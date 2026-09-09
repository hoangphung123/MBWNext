import assert from 'node:assert/strict';
import { createServer } from 'vite';

// Isolated in-memory API: does not touch the user's browser session.
globalThis.window = { setTimeout };
const server = await createServer({ logLevel: 'silent', optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true } });
let passed = 0;
try {
  const { mockApi } = await server.ssrLoadModule('/src/lib/mockApi.ts');
  const { mbwNextMockData: data } = await server.ssrLoadModule('/src/data/mockData.ts');
  const create = async (quantity = 1, date = '2026-08-29') => {
    const result = await mockApi.manufacturing.createWorkOrder({ bomId: 'bom-fg250-v2', inputWarehouseId: 'wh-hcm-rm', outputWarehouseId: 'wh-hcm-main', plannedQuantity: quantity, plannedStartDate: date, plannedEndDate: date });
    assert.ok(result.entity, JSON.stringify(result.errors));
    return result.entity;
  };
  const complete = (order, quantity, batchNo, date = '2026-08-29', rejectedQuantity = 0) => mockApi.manufacturing.recordCompletion({ workOrderId: order.id, completionDate: date, completedQuantity: quantity, rejectedQuantity, batchNo });
  const snapshot = async () => JSON.stringify(await mockApi.manufacturing.getOverview()) + JSON.stringify(await mockApi.inventory.getBatchBalances()) + JSON.stringify(await mockApi.inventory.getMovements());
  const rejectedWithoutMutation = async (order, quantity, batch, date, errorKey) => {
    const before = await snapshot();
    const result = await complete(order, quantity, batch, date);
    assert.equal(result.entity, null);
    assert.ok(result.errors[errorKey], JSON.stringify(result.errors));
    assert.equal(await snapshot(), before, 'Rejected completion must not change stock, lots, jobs or orders');
    passed++;
  };

  const order = await create(200);
  const partial = await complete(order, 199, 'P0-PARTIAL');
  assert.equal(partial.entity.status, 'in_progress');
  assert.equal(partial.entity.progressPercent, 99);
  const final = await complete(order, 1, ' p0-partial ');
  assert.equal(final.entity.status, 'completed');
  assert.equal(final.entity.completedQuantity, 200);
  const lot = (await mockApi.inventory.getBatchBalances()).find(batch => batch.batchNo === 'P0-PARTIAL');
  assert.equal(lot.quantityOnHand, 200);
  assert.equal(lot.manufacturingDate, '2026-08-29');
  assert.equal(lot.expiryDate, '2027-02-25');
  passed++;
  await rejectedWithoutMutation(order, 1, 'P0-PARTIAL', '2026-08-29', 'workOrderId');

  const future = await create(1, '2028-01-01');
  await rejectedWithoutMutation(future, 1, 'P0-FUTURE', '2028-01-01', 'material-item-rm-arabica');
  const current = await create();
  await rejectedWithoutMutation(current, 1, 'FG250-20260822', '2026-08-29', 'batchNo');
  await rejectedWithoutMutation(current, 1, 'P0-INVALID-DATE', '2026-02-30', 'completionDate');

  // A later mẻ cannot silently reuse a lot created on the previous day.
  const tomorrow = await create(1, '2026-08-30');
  await rejectedWithoutMutation(tomorrow, 1, 'P0-PARTIAL', '2026-08-30', 'batchNo');

  // Mixed inventory: skip expired stock even if it sorts first under FEFO.
  const arabica = data.inventory.batches.find(batch => batch.itemId === 'item-rm-arabica');
  arabica.expiryDate = '2026-08-28';
  arabica.quantityOnHand -= 10;
  data.inventory.batches.push({ ...arabica, id: 'p0-fresh-arabica', batchNo: 'P0-FRESH-ARA', quantityOnHand: 10, expiryDate: '2027-08-29' });
  const before = await mockApi.inventory.getBatchBalances();
  const accepted = await complete(current, 1, 'P0-MIXED');
  assert.ok(accepted.entity);
  const after = await mockApi.inventory.getBatchBalances();
  assert.equal(after.find(batch => batch.id === arabica.id).quantityOnHand, before.find(batch => batch.id === arabica.id).quantityOnHand);
  assert.ok(Math.abs(after.find(batch => batch.batchNo === 'P0-FRESH-ARA').quantityOnHand - (10 - 0.1632)) < 1e-9);
  passed++;

  const rejects = await create(2);
  const rejectedUnits = await complete(rejects, 1, 'P0-REJECT', '2026-08-29', 1);
  assert.equal(rejectedUnits.entity.status, 'completed');
  assert.equal(rejectedUnits.entity.completedQuantity, 1);
  assert.equal(rejectedUnits.entity.rejectedQuantity, 1);
  passed++;
  console.log(`PASS: ${passed} manufacturing P0 scenarios`);
} finally {
  await server.close();
}
