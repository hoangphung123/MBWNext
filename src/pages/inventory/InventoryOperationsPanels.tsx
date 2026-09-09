import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Column, DataTable } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import {
  InventoryAdjustment,
  InventoryAdjustmentDraft,
  Product,
  ReturnableDelivery,
  SalesReturn,
  SalesReturnDraft,
  StockBalanceView,
  StockBatchView,
  VirtualStockProcess,
  VirtualStockProcessDraft,
  Warehouse,
  mockApi,
} from "../../lib/mockApi";

const initialAdjustment = (): InventoryAdjustmentDraft => ({ warehouseId: "wh-hcm-rm", adjustmentDate: "2026-08-29", reason: "stocktake_gain", note: "", lines: [{ itemId: "", quantityDelta: 0, batchNo: "" }] });
const initialVirtualProcess = (): VirtualStockProcessDraft => ({ sourceWarehouseId: "wh-qc", targetWarehouseId: "wh-hcm-main", action: "release", processDate: "2026-08-29", reason: "", lines: [{ itemId: "", quantity: 1, batchNo: "" }] });
const emptyReturn = (virtualWarehouseId: string): SalesReturnDraft => ({ deliveryId: "", returnDate: "2026-08-29", returnWarehouseId: virtualWarehouseId, reason: "", lines: [] });

type WarehouseOperationsPanelProps = { onInventoryChanged: () => void };
type PendingSalesReturn = SalesReturn & { pendingQuantity: number };

export function WarehouseOperationsPanel({ onInventoryChanged }: WarehouseOperationsPanelProps) {
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>([]);
  const [returns, setReturns] = useState<SalesReturn[]>([]);
  const [virtualProcesses, setVirtualProcesses] = useState<VirtualStockProcess[]>([]);
  const [returnables, setReturnables] = useState<ReturnableDelivery[]>([]);
  const [balances, setBalances] = useState<StockBalanceView[]>([]);
  const [batches, setBatches] = useState<StockBatchView[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [items, setItems] = useState<Product[]>([]);
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [virtualOpen, setVirtualOpen] = useState(false);
  const [adjustment, setAdjustment] = useState<InventoryAdjustmentDraft>(() => initialAdjustment());
  const [salesReturn, setSalesReturn] = useState<SalesReturnDraft>({ deliveryId: "", returnDate: "2026-08-29", returnWarehouseId: "", reason: "", lines: [] });
  const [virtualProcess, setVirtualProcess] = useState<VirtualStockProcessDraft>(() => initialVirtualProcess());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(() => {
    void Promise.all([
      mockApi.inventory.getAdjustments(),
      mockApi.inventory.getSalesReturns(),
      mockApi.inventory.getVirtualStockProcesses(),
      mockApi.inventory.getReturnableDeliveries(),
      mockApi.inventory.getStockBalances(),
      mockApi.inventory.getBatchBalances(),
      mockApi.inventory.getAllWarehouses(),
      mockApi.inventory.getStockItems(),
    ]).then(([adjustmentRows, returnRows, processRows, returnableRows, balanceRows, batchRows, warehouseRows, itemRows]) => {
      setAdjustments(adjustmentRows);
      setReturns(returnRows);
      setVirtualProcesses(processRows);
      setReturnables(returnableRows);
      setBalances(balanceRows);
      setBatches(batchRows);
      setWarehouses(warehouseRows);
      setItems(itemRows);
    });
  }, []);
  useEffect(() => { load(); }, [load]);

  const physicalWarehouses = warehouses.filter((warehouse) => warehouse.warehouseType === "physical");
  const virtualWarehouses = warehouses.filter((warehouse) => warehouse.warehouseType === "virtual");
  const adjustmentBatches = (itemId: string, warehouseId: string) => batches.filter((batch) => batch.itemId === itemId && batch.warehouseId === warehouseId && batch.quantityOnHand > 0);
  const adjustmentBalances = balances.filter((balance) => balance.warehouseId === adjustment.warehouseId);
  const adjustmentItemOptions = adjustment.reason === "opening_balance" ? items : adjustmentBalances.map((balance) => balance.item);
  const adjustmentBalanceFor = (itemId: string) => adjustmentBalances.find((balance) => balance.itemId === itemId);
  const virtualSourceBalances = balances.filter((balance) => balance.warehouseId === virtualProcess.sourceWarehouseId && balance.quantityOnHand > 0);
  const virtualSourceBatches = (itemId: string) => batches.filter((batch) => batch.warehouseId === virtualProcess.sourceWarehouseId && batch.itemId === itemId && batch.quantityOnHand > 0);
  const selectedReturn = returnables.find((entry) => entry.delivery.id === salesReturn.deliveryId);
  const pendingQcReturnRows = useMemo(() => {
    const remainingByItem = new Map(balances.filter((balance) => balance.warehouse.warehouseType === "virtual" && balance.quantityOnHand > 0).map((balance) => [balance.warehouseId + ":" + balance.itemId, balance.quantityOnHand]));
    const remainingByBatch = new Map(batches.filter((batch) => batch.warehouse.warehouseType === "virtual" && batch.quantityOnHand > 0).map((batch) => [batch.warehouseId + ":" + batch.itemId + ":" + batch.batchNo, batch.quantityOnHand]));
    return returns.flatMap((salesReturn) => {
      return salesReturn.lines.flatMap((line) => {
        const item = items.find((product) => product.id === line.itemId); if (!item) return [];
        const key = item.trackBatch && line.batchNo ? salesReturn.returnWarehouseId + ":" + line.itemId + ":" + line.batchNo : salesReturn.returnWarehouseId + ":" + line.itemId;
        const remaining = item.trackBatch && line.batchNo ? remainingByBatch.get(key) ?? 0 : remainingByItem.get(key) ?? 0;
        const quantity = Math.min(line.quantity, remaining); if (quantity <= 0) return [];
        if (item.trackBatch && line.batchNo) remainingByBatch.set(key, remaining - quantity); else remainingByItem.set(key, remaining - quantity);
        return [{ salesReturnId: salesReturn.id, returnWarehouseId: salesReturn.returnWarehouseId, documentNo: salesReturn.documentNo, deliveryId: salesReturn.deliveryId, item, batchNo: line.batchNo, quantity }];
      });
    });
  }, [balances, batches, items, returns]);
  const qcReturnRows = pendingQcReturnRows.filter((row) => row.returnWarehouseId === virtualProcess.sourceWarehouseId);
  const pendingSalesReturns: PendingSalesReturn[] = returns.flatMap((salesReturn) => {
    const pendingQuantity = pendingQcReturnRows.filter((row) => row.salesReturnId === salesReturn.id).reduce((sum, row) => sum + row.quantity, 0);
    return pendingQuantity > 0 ? [{ ...salesReturn, pendingQuantity }] : [];
  });

  const refreshAfterMutation = () => { load(); onInventoryChanged(); };
  const closeAll = () => { setAdjustmentOpen(false); setReturnOpen(false); setVirtualOpen(false); setErrors({}); };
  const updateAdjustmentLine = (index: number, change: Partial<InventoryAdjustmentDraft["lines"][number]>) => setAdjustment((current) => ({ ...current, lines: current.lines.map((line, lineIndex) => lineIndex === index ? { ...line, ...change } : line) }));
  const updateVirtualLine = (index: number, change: Partial<VirtualStockProcessDraft["lines"][number]>) => setVirtualProcess((current) => ({ ...current, lines: current.lines.map((line, lineIndex) => lineIndex === index ? { ...line, ...change } : line) }));
  const updateReturnLine = (index: number, change: Partial<SalesReturnDraft["lines"][number]>) => setSalesReturn((current) => ({ ...current, lines: current.lines.map((line, lineIndex) => lineIndex === index ? { ...line, ...change } : line) }));

  const openAdjustment = () => { setAdjustment(initialAdjustment()); setErrors({}); setAdjustmentOpen(true); };
  const openReturn = () => { const virtualWarehouseId = virtualWarehouses[0]?.id ?? ""; setSalesReturn(emptyReturn(virtualWarehouseId)); setErrors({}); setReturnOpen(true); };
  const openVirtualProcess = () => {
    const sourceWarehouseId = virtualWarehouses[0]?.id ?? "";
    const firstBalance = balances.find((balance) => balance.warehouseId === sourceWarehouseId && balance.quantityOnHand > 0);
    const firstBatch = firstBalance?.item.trackBatch ? batches.find((batch) => batch.warehouseId === sourceWarehouseId && batch.itemId === firstBalance.itemId && batch.quantityOnHand > 0 && batch.qualityStatus === "quality_hold") : undefined;
    setVirtualProcess({ ...initialVirtualProcess(), sourceWarehouseId, targetWarehouseId: physicalWarehouses[0]?.id ?? "", lines: [{ itemId: firstBalance?.itemId ?? "", quantity: 1, batchNo: firstBatch?.batchNo ?? "" }] });
    setErrors({}); setVirtualOpen(true);
  };
  const chooseReturnDelivery = (deliveryId: string) => {
    const source = returnables.find((entry) => entry.delivery.id === deliveryId);
    setSalesReturn((current) => ({
      ...current,
      deliveryId,
      lines: source?.lines.filter((line) => line.returnableQuantity > 0).map((line) => ({ salesOrderLineId: line.salesOrderLineId, quantity: 0, batchNo: line.batchNo })) ?? [],
    }));
  };

  const submitAdjustment = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); const result = await mockApi.inventory.createAdjustment(adjustment); setSaving(false);
    if (!result.entity) { setErrors(result.errors); showToast(result.errors.form ?? Object.values(result.errors)[0] ?? "Không thể điều chỉnh tồn.", "error"); return; }
    showToast(result.entity.documentNo + " đã cập nhật tồn kho."); closeAll(); refreshAfterMutation();
  };
  const submitReturn = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); const result = await mockApi.inventory.createSalesReturn(salesReturn); setSaving(false);
    if (!result.entity) { setErrors(result.errors); showToast(result.errors.form ?? Object.values(result.errors)[0] ?? "Không thể nhận hàng trả.", "error"); return; }
    showToast(result.entity.documentNo + " đã đưa hàng vào kho QC."); closeAll(); refreshAfterMutation();
  };
  const submitVirtualProcess = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); const result = await mockApi.inventory.processVirtualStock(virtualProcess); setSaving(false);
    if (!result.entity) { setErrors(result.errors); showToast(result.errors.form ?? Object.values(result.errors)[0] ?? "Không thể xử lý kho ảo.", "error"); return; }
    showToast(result.entity.documentNo + " đã hoàn tất xử lý QC."); closeAll(); refreshAfterMutation();
  };

  const adjustmentColumns: Column<InventoryAdjustment>[] = [
    { key: "document", header: "Chứng từ", render: (entry) => <div className="cell-main"><strong>{entry.documentNo}</strong><span>{new Date(entry.adjustmentDate).toLocaleDateString("vi-VN")} · {entry.reason}</span></div> },
    { key: "warehouse", header: "Kho", render: (entry) => warehouses.find((warehouse) => warehouse.id === entry.warehouseId)?.code ?? entry.warehouseId },
    { key: "quantity", header: "Biến động", className: "text-right", render: (entry) => <strong>{entry.lines.reduce((sum, line) => sum + line.quantityDelta, 0) >= 0 ? "+" : ""}{entry.lines.reduce((sum, line) => sum + line.quantityDelta, 0).toLocaleString("vi-VN")}</strong> },
  ];
  const returnColumns: Column<PendingSalesReturn>[] = [
    { key: "document", header: "Phiếu trả", render: (entry) => <div className="cell-main"><strong>{entry.documentNo}</strong><span>{new Date(entry.returnDate).toLocaleDateString("vi-VN")} · {entry.reason}</span></div> },
    { key: "source", header: "Phiếu giao", render: (entry) => entry.deliveryId },
    { key: "warehouse", header: "Kho nhận", render: (entry) => warehouses.find((warehouse) => warehouse.id === entry.returnWarehouseId)?.name ?? entry.returnWarehouseId },
    { key: "quantity", header: "Còn chờ QC", className: "text-right", render: (entry) => entry.pendingQuantity.toLocaleString("vi-VN") },
  ];
  const virtualColumns: Column<VirtualStockProcess>[] = [
    { key: "document", header: "Xử lý QC", render: (entry) => <div className="cell-main"><strong>{entry.documentNo}</strong><span>{entry.action === "release" ? "Nhả QC" : "Hủy hàng"} · {entry.reason}</span></div> },
    { key: "date", header: "Ngày", render: (entry) => new Date(entry.processDate).toLocaleDateString("vi-VN") },
    { key: "quantity", header: "SL xử lý", className: "text-right", render: (entry) => entry.lines.reduce((sum, line) => sum + line.quantity, 0).toLocaleString("vi-VN") },
  ];

  return <section className="inventory-operations">
    <div className="content-heading inventory-movement-heading"><div><h2>Nghiệp vụ kho</h2><p>Điều chỉnh tồn có kiểm soát, nhận hàng trả và xử lý hàng tại kho ảo QC.</p></div><div className="inventory-action-buttons"><button className="secondary-button" onClick={openAdjustment}>Điều chỉnh tồn</button><button className="secondary-button" onClick={openReturn}>Nhận trả hàng</button><button className="primary-button compact" onClick={openVirtualProcess}>Xử lý kho ảo</button></div></div>
    <div className="inventory-operation-grid">
      <div className="list-panel"><h3>Điều chỉnh tồn gần đây</h3><DataTable columns={adjustmentColumns} rows={adjustments.slice(0, 5)} emptyTitle="Chưa có phiếu điều chỉnh" /></div>
      <div className="list-panel"><h3>Hàng trả đang chờ QC</h3><DataTable columns={returnColumns} rows={pendingSalesReturns.slice(0, 5)} emptyTitle="Không còn hàng trả chờ QC" /></div>
    </div>
    <div className="content-heading inventory-movement-heading"><div><h2>Kho ảo & QC Hold</h2><p>Hàng trả đi vào kho ảo, không hiển thị trong tồn bán được cho đến khi nhả QC.</p></div></div>
    <div className="inventory-virtual-summary">{virtualWarehouses.map((warehouse) => <article key={warehouse.id}><span>{warehouse.code} · {warehouse.name}</span><strong>{balances.filter((balance) => balance.warehouseId === warehouse.id).reduce((sum, balance) => sum + balance.quantityOnHand, 0).toLocaleString("vi-VN")} đơn vị</strong><small>Không thể chọn làm kho xuất đơn bán</small></article>)}</div>
    <div className="list-panel"><DataTable columns={virtualColumns} rows={virtualProcesses.slice(0, 5)} emptyTitle="Chưa có lượt xử lý kho ảo" /></div>

    <Modal isOpen={adjustmentOpen} title="Điều chỉnh tồn kho" onClose={closeAll} wide><form className="crm-form purchase-receipt-form" onSubmit={submitAdjustment}>
      <p className="modal-description">Điều chỉnh tồn chỉ cộng/trừ vào hàng đã có tại kho đã chọn. Số dương ghi tăng, số âm ghi giảm; hệ thống không cho giảm thấp hơn lượng đang giữ chỗ. Chỉ chọn <strong>Số dư đầu kỳ</strong> khi cần khởi tạo một hàng hoặc lô mới.</p>
      <div className="form-grid two-columns"><label>Kho<select value={adjustment.warehouseId} onChange={(event) => setAdjustment((current) => ({ ...current, warehouseId: event.target.value, lines: current.lines.map(() => ({ itemId: "", quantityDelta: 0, batchNo: "" })) }))}>{warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.code} - {warehouse.name}</option>)}</select>{errors.warehouseId && <small className="field-error">{errors.warehouseId}</small>}</label><label>Ngày điều chỉnh<input type="date" value={adjustment.adjustmentDate} onChange={(event) => setAdjustment((current) => ({ ...current, adjustmentDate: event.target.value }))} />{errors.adjustmentDate && <small className="field-error">{errors.adjustmentDate}</small>}</label><label>Lý do<select value={adjustment.reason} onChange={(event) => setAdjustment((current) => ({ ...current, reason: event.target.value as InventoryAdjustmentDraft["reason"], lines: current.lines.map(() => ({ itemId: "", quantityDelta: 0, batchNo: "" })) }))}><option value="stocktake_gain">Kiểm kê thừa</option><option value="stocktake_loss">Kiểm kê thiếu</option><option value="damaged">Hàng hư hỏng</option><option value="expired">Hàng hết hạn</option><option value="opening_balance">Số dư đầu kỳ</option></select></label><label>Diễn giải<input value={adjustment.note} onChange={(event) => setAdjustment((current) => ({ ...current, note: event.target.value }))} />{errors.note && <small className="field-error">{errors.note}</small>}</label></div>
      <div className="receipt-lines">{adjustment.lines.map((line, index) => { const product = items.find((item) => item.id === line.itemId); const balance = adjustmentBalanceFor(line.itemId); const lineBatches = adjustmentBatches(line.itemId, adjustment.warehouseId); return <div className="receipt-line operation-line" key={line.itemId + "-" + index}><label>Hàng hóa<select value={line.itemId} onChange={(event) => updateAdjustmentLine(index, { itemId: event.target.value, batchNo: "" })}><option value="">Chọn hàng hóa</option>{adjustmentItemOptions.map((item) => <option key={item.id} value={item.id}>{item.sku} - {item.name}</option>)}</select>{balance && <small className="stock-context">Hiện có: {balance.quantityOnHand.toLocaleString("vi-VN")} · khả dụng: {balance.availableQuantity.toLocaleString("vi-VN")} {balance.item.unit}</small>}{adjustment.reason === "opening_balance" && <small className="stock-context">Số dư đầu kỳ có thể tạo tồn mới tại kho này.</small>}</label>{product?.trackBatch ? adjustment.reason === "opening_balance" ? <label>Lô hàng<input value={line.batchNo ?? ""} onChange={(event) => updateAdjustmentLine(index, { batchNo: event.target.value })} placeholder="Nhập lô khởi tạo" /></label> : <label>Lô hàng<select value={line.batchNo ?? ""} onChange={(event) => updateAdjustmentLine(index, { batchNo: event.target.value })}><option value="">Chọn lô đang có</option>{lineBatches.map((batch) => <option key={batch.id} value={batch.batchNo}>{batch.batchNo} · hiện có {batch.quantityOnHand.toLocaleString("vi-VN")} {batch.item.unit}</option>)}</select></label> : <div className="transfer-no-batch"><strong>Không quản lý lô</strong></div>}<label>Tăng (+) / giảm (-)<input type="number" step="1" value={line.quantityDelta} onChange={(event) => updateAdjustmentLine(index, { quantityDelta: Number(event.target.value) })} /></label><button className="line-remove" type="button" disabled={adjustment.lines.length === 1} onClick={() => setAdjustment((current) => ({ ...current, lines: current.lines.filter((_, lineIndex) => lineIndex !== index) }))}>×</button>{errors["line-" + index] && <small className="field-error receipt-line-error">{errors["line-" + index]}</small>}</div>; })}</div>
      <button className="secondary-button" type="button" onClick={() => setAdjustment((current) => ({ ...current, lines: [...current.lines, { itemId: "", quantityDelta: 0, batchNo: "" }] }))}>＋ Thêm dòng</button>{errors.lines && <p className="form-wide-error">{errors.lines}</p>}<div className="modal-actions"><button className="secondary-button" type="button" onClick={closeAll}>Hủy</button><button className="primary-button compact" disabled={saving}>{saving ? "Đang cập nhật..." : "Xác nhận điều chỉnh"}</button></div>
    </form></Modal>

    <Modal isOpen={returnOpen} title="Nhận hàng trả từ khách" onClose={closeAll} wide><form className="crm-form purchase-receipt-form" onSubmit={submitReturn}>
      <p className="modal-description">Hàng trả được nhận vào kho ảo QC Hold. Hàng theo lô phải khớp với lô đã xuất cho khách.</p>
      <div className="form-grid two-columns"><label>Phiếu giao nguồn<select value={salesReturn.deliveryId} onChange={(event) => chooseReturnDelivery(event.target.value)}><option value="">Chọn phiếu giao</option>{returnables.map((entry) => <option key={entry.delivery.id} value={entry.delivery.id}>{entry.delivery.documentNo} · {entry.customer.name}</option>)}</select>{errors.deliveryId && <small className="field-error">{errors.deliveryId}</small>}</label><label>Kho nhận trả<select value={salesReturn.returnWarehouseId} onChange={(event) => setSalesReturn((current) => ({ ...current, returnWarehouseId: event.target.value }))}>{virtualWarehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.code} - {warehouse.name}</option>)}</select>{errors.returnWarehouseId && <small className="field-error">{errors.returnWarehouseId}</small>}</label><label>Ngày nhận trả<input type="date" value={salesReturn.returnDate} onChange={(event) => setSalesReturn((current) => ({ ...current, returnDate: event.target.value }))} /></label><label>Lý do trả<input value={salesReturn.reason} onChange={(event) => setSalesReturn((current) => ({ ...current, reason: event.target.value }))} />{errors.reason && <small className="field-error">{errors.reason}</small>}</label></div>
      {selectedReturn && <div className="receipt-lines">{selectedReturn.lines.filter((line) => line.returnableQuantity > 0).map((line, index) => <div className="receipt-line return-line" key={line.salesOrderLineId}><div><strong>{line.product.name}</strong><span>Đã giao {line.deliveredQuantity.toLocaleString("vi-VN")} · còn được trả {line.returnableQuantity.toLocaleString("vi-VN")} {line.product.unit}{line.batchNo ? " · Lô " + line.batchNo : ""}</span></div><label>SL nhận trả<input type="number" min="0" max={line.returnableQuantity} value={salesReturn.lines[index]?.quantity ?? 0} onChange={(event) => updateReturnLine(index, { quantity: Number(event.target.value) })} /></label>{errors["line-" + index] && <small className="field-error receipt-line-error">{errors["line-" + index]}</small>}</div>)}</div>}
      {errors.lines && <p className="form-wide-error">{errors.lines}</p>}<div className="modal-actions"><button className="secondary-button" type="button" onClick={closeAll}>Hủy</button><button className="primary-button compact" disabled={saving}>{saving ? "Đang nhận..." : "Xác nhận nhận trả"}</button></div>
    </form></Modal>

    <Modal isOpen={virtualOpen} title="Xử lý hàng tại kho ảo" onClose={closeAll} wide><form className="crm-form purchase-receipt-form" onSubmit={submitVirtualProcess}>
      <p className="modal-description">Nhả QC sẽ đưa hàng đạt yêu cầu sang kho vật lý. Hủy hàng sẽ loại hàng khỏi tồn kho ảo và chỉ ghi nhận biến động kho.</p>
      {qcReturnRows.length > 0 && <div className="qc-return-preview"><div><strong>Hàng trả sẵn sàng xử lý</strong><span>Chọn một dòng bên dưới để nhả QC hoặc hủy hàng.</span></div>{qcReturnRows.map((row) => <article key={row.documentNo + "-" + row.item.id + "-" + row.batchNo}><strong>{row.documentNo}</strong><span>{row.item.sku} · {row.item.name}</span><small>{row.batchNo ? "Lô " + row.batchNo + " · " : ""}{row.quantity.toLocaleString("vi-VN")} {row.item.unit} chờ QC</small></article>)}</div>}
      <div className="form-grid two-columns"><label>Kho ảo nguồn<select value={virtualProcess.sourceWarehouseId} onChange={(event) => setVirtualProcess((current) => ({ ...current, sourceWarehouseId: event.target.value, lines: current.lines.map((line) => ({ ...line, itemId: "", batchNo: "" })) }))}>{virtualWarehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.code} - {warehouse.name}</option>)}</select>{errors.sourceWarehouseId && <small className="field-error">{errors.sourceWarehouseId}</small>}</label><label>Hướng xử lý<select value={virtualProcess.action} onChange={(event) => setVirtualProcess((current) => ({ ...current, action: event.target.value as VirtualStockProcessDraft["action"] }))}><option value="release">Đạt QC · Nhả về kho vật lý</option><option value="scrap">Không đạt · Hủy hàng</option></select></label>{virtualProcess.action === "release" && <label>Kho nhận sau QC<select value={virtualProcess.targetWarehouseId ?? ""} onChange={(event) => setVirtualProcess((current) => ({ ...current, targetWarehouseId: event.target.value }))}>{physicalWarehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.code} - {warehouse.name}</option>)}</select>{errors.targetWarehouseId && <small className="field-error">{errors.targetWarehouseId}</small>}</label>}<label>Ngày xử lý<input type="date" value={virtualProcess.processDate} onChange={(event) => setVirtualProcess((current) => ({ ...current, processDate: event.target.value }))} /></label><label className="full-width">Kết quả / diễn giải<input value={virtualProcess.reason} onChange={(event) => setVirtualProcess((current) => ({ ...current, reason: event.target.value }))} />{errors.reason && <small className="field-error">{errors.reason}</small>}</label></div>
      <div className="receipt-lines">{virtualProcess.lines.map((line, index) => { const sourceBalance = virtualSourceBalances.find((balance) => balance.itemId === line.itemId); const product = sourceBalance?.item; const lineBatches = virtualSourceBatches(line.itemId); return <div className="receipt-line operation-line" key={line.itemId + "-" + index}><label>Hàng hóa<select value={line.itemId} onChange={(event) => updateVirtualLine(index, { itemId: event.target.value, batchNo: "" })}><option value="">Chọn hàng trong kho ảo</option>{virtualSourceBalances.map((balance) => <option key={balance.itemId} value={balance.itemId}>{balance.item.sku} - {balance.item.name}</option>)}</select>{sourceBalance && <small className="stock-context">Đang chờ QC: {sourceBalance.quantityOnHand.toLocaleString("vi-VN")} {sourceBalance.item.unit}</small>}</label>{product?.trackBatch ? <label>Lô hàng<select value={line.batchNo ?? ""} onChange={(event) => updateVirtualLine(index, { batchNo: event.target.value })}><option value="">Chọn lô</option>{lineBatches.map((batch) => <option key={batch.id} value={batch.batchNo}>{batch.batchNo} · còn {batch.quantityOnHand.toLocaleString("vi-VN")} {batch.item.unit}</option>)}</select></label> : <div className="transfer-no-batch"><strong>Không quản lý lô</strong></div>}<label>Số lượng<input type="number" min="0" max={sourceBalance?.quantityOnHand} value={line.quantity} onChange={(event) => updateVirtualLine(index, { quantity: Number(event.target.value) })} /></label><button className="line-remove" type="button" disabled={virtualProcess.lines.length === 1} onClick={() => setVirtualProcess((current) => ({ ...current, lines: current.lines.filter((_, lineIndex) => lineIndex !== index) }))}>×</button>{errors["line-" + index] && <small className="field-error receipt-line-error">{errors["line-" + index]}</small>}</div>; })}</div>
      <button className="secondary-button" type="button" onClick={() => setVirtualProcess((current) => ({ ...current, lines: [...current.lines, { itemId: "", quantity: 1, batchNo: "" }] }))}>＋ Thêm dòng</button>{errors.lines && <p className="form-wide-error">{errors.lines}</p>}<div className="modal-actions"><button className="secondary-button" type="button" onClick={closeAll}>Hủy</button><button className="primary-button compact" disabled={saving}>{saving ? "Đang xử lý..." : virtualProcess.action === "release" ? "Xác nhận nhả QC" : "Xác nhận hủy hàng"}</button></div>
    </form></Modal>
  </section>;
}
