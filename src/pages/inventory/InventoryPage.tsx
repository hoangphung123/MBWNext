import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Column, DataTable } from "../../components/ui/DataTable";
import { FilterBar } from "../../components/ui/FilterBar";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import { formatVnd } from "../../data/mockData";
import { InventoryMovement, InventoryTransferDraft, StockBalanceView, StockBatchView, Warehouse, mockApi } from "../../lib/mockApi";
import { WarehouseOperationsPanel } from "./InventoryOperationsPanels";
import { PickListPanel } from "./PickListPanel";

const initialTransfer = (): InventoryTransferDraft => ({
  fromWarehouseId: "wh-hcm-rm",
  toWarehouseId: "wh-hcm-main",
  transferDate: "2026-08-29",
  lines: [{ itemId: "", quantity: 1, batchNo: "" }],
});

export function InventoryPage() {
  const [balances, setBalances] = useState<StockBalanceView[]>([]);
  const [batches, setBatches] = useState<StockBatchView[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [search, setSearch] = useState("");
  const [warehouseId, setWarehouseId] = useState("all");
  const [transferOpen, setTransferOpen] = useState(false);
  const [transfer, setTransfer] = useState<InventoryTransferDraft>(() => initialTransfer());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(() => {
    void Promise.all([
      mockApi.inventory.getStockBalances(),
      mockApi.inventory.getBatchBalances(),
      mockApi.inventory.getWarehouses(),
      mockApi.inventory.getMovements(),
    ]).then(([balanceRows, batchRows, warehouseRows, movementRows]) => {
      setBalances(balanceRows);
      setBatches(batchRows);
      setWarehouses(warehouseRows);
      setMovements(movementRows);
    });
  }, []);
  useEffect(() => { load(); }, [load]);

  const rows = useMemo(() => balances.filter((balance) =>
    (warehouseId === "all" || balance.warehouseId === warehouseId) &&
    (balance.item.sku + " " + balance.item.name + " " + balance.warehouse.name).toLowerCase().includes(search.toLowerCase()),
  ), [balances, warehouseId, search]);
  const sourceProductOptions = useMemo(() => balances
    .filter((balance) => balance.warehouseId === transfer.fromWarehouseId && balance.availableQuantity > 0)
    .map((balance) => balance.item), [balances, transfer.fromWarehouseId]);
  const batchRows = useMemo(() => batches.filter((batch) =>
    (warehouseId === "all" || batch.warehouseId === warehouseId) &&
    (batch.item.sku + " " + batch.item.name + " " + batch.batchNo + " " + batch.warehouse.name).toLowerCase().includes(search.toLowerCase()),
  ), [batches, warehouseId, search]);
  const lowStockCount = balances.filter((balance) => balance.warehouse.warehouseType === "physical" && balance.item.reorderLevel > 0 && balance.availableQuantity <= balance.item.reorderLevel).length;
  const totalStockValue = balances.reduce((sum, balance) => sum + balance.stockValue, 0);
  const totalReserved = balances.reduce((sum, balance) => sum + balance.reservedQuantity, 0);
  const batchesForLine = (itemId: string) => batches.filter((batch) =>
    batch.itemId === itemId && batch.warehouseId === transfer.fromWarehouseId && batch.qualityStatus === "released" && batch.quantityOnHand > 0,
  );

  const updateTransferLine = (index: number, change: Partial<InventoryTransferDraft["lines"][number]>) =>
    setTransfer((current) => ({ ...current, lines: current.lines.map((line, lineIndex) => lineIndex === index ? { ...line, ...change } : line) }));
  const addTransferLine = () => setTransfer((current) => ({ ...current, lines: [...current.lines, { itemId: "", quantity: 1, batchNo: "" }] }));
  const removeTransferLine = (index: number) => setTransfer((current) => ({ ...current, lines: current.lines.filter((_, lineIndex) => lineIndex !== index) }));
  const openTransfer = () => { setTransfer(initialTransfer()); setErrors({}); setTransferOpen(true); };
  const submitTransfer = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const result = await mockApi.inventory.createTransfer(transfer);
    setSaving(false);
    if (!result.entity) {
      setErrors(result.errors);
      showToast(result.errors.form ?? Object.values(result.errors)[0] ?? "Không thể chuyển kho.", "error");
      return;
    }
    showToast(result.entity.documentNo + " đã hoàn tất. Tồn kho và tồn theo lô đã được cập nhật.");
    setTransferOpen(false);
    load();
  };

  const columns: Column<StockBalanceView>[] = [
    { key: "item", header: "Hàng hóa", render: (balance) => <div className="cell-main"><strong>{balance.item.sku} · {balance.item.name}</strong><span>{balance.item.unit} · Mức đặt hàng lại {balance.item.reorderLevel.toLocaleString("vi-VN")}</span></div> },
    { key: "warehouse", header: "Kho", render: (balance) => <div className="cell-main"><strong>{balance.warehouse.name}</strong><span>{balance.warehouse.code}</span></div> },
    { key: "onhand", header: "Tồn thực tế", className: "text-right", render: (balance) => balance.quantityOnHand.toLocaleString("vi-VN") },
    { key: "reserved", header: "Đã giữ / khả dụng", className: "text-right", render: (balance) => <div className="cell-main text-right"><strong>{balance.reservedQuantity.toLocaleString("vi-VN")} / <span className={balance.item.reorderLevel > 0 && balance.availableQuantity <= balance.item.reorderLevel ? "stock-low" : "stock-ok"}>{balance.availableQuantity.toLocaleString("vi-VN")}</span></strong><span>{balance.item.unit}</span></div> },
    { key: "cost", header: "Giá trị tồn", className: "text-right", render: (balance) => <div className="cell-main text-right"><strong>{formatVnd(balance.stockValue)}</strong><span>Giá vốn {formatVnd(balance.averageCost)}</span></div> },
  ];
  const batchColumns: Column<StockBatchView>[] = [
    { key: "batch", header: "Lô hàng", render: (batch) => <div className="cell-main"><strong>{batch.batchNo}</strong><span>{batch.qualityStatus === "released" ? "Được phép xuất" : "Chờ kiểm định"}</span></div> },
    { key: "item", header: "Hàng hóa", render: (batch) => <div className="cell-main"><strong>{batch.item.sku}</strong><span>{batch.item.name}</span></div> },
    { key: "warehouse", header: "Kho", render: (batch) => batch.warehouse.code },
    { key: "quantity", header: "Tồn lô", className: "text-right", render: (batch) => <strong>{batch.quantityOnHand.toLocaleString("vi-VN")} {batch.item.unit}</strong> },
    { key: "expiry", header: "Hạn dùng", render: (batch) => batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString("vi-VN") : "—" },
  ];
  const movementColumns: Column<InventoryMovement>[] = [
    { key: "reference", header: "Chứng từ", render: (movement) => <div className="cell-main"><strong>{movement.referenceNo}</strong><span>{new Date(movement.postingDate).toLocaleDateString("vi-VN")}</span></div> },
    { key: "description", header: "Diễn giải", render: (movement) => <span>{movement.description}</span> },
    { key: "quantity", header: "Biến động", className: "text-right", render: (movement) => <strong className={movement.quantity >= 0 ? "stock-ok" : "stock-low"}>{movement.quantity >= 0 ? "+" : ""}{movement.quantity.toLocaleString("vi-VN")}</strong> },
  ];

  return <section className="sales-module">
    <div className="sales-module-heading"><div><p className="eyebrow dark">KHO HÀNG</p><h1>Tồn kho và điều chuyển nội bộ</h1><p>Theo dõi tồn thực tế, tồn giữ chỗ và tồn theo lô sau nhập kho, xuất giao hoặc chuyển kho.</p></div></div>
    <div className="sales-content">
      <div className="content-heading"><div><h2>Tồn kho theo kho</h2><p>Tồn khả dụng đã loại trừ hàng đang được đơn bán đã xác nhận giữ chỗ.</p></div><button className="primary-button compact" onClick={openTransfer}>＋ Chuyển kho</button></div>
      <div className="inventory-summary"><article><span>Giá trị tồn kho</span><strong>{formatVnd(totalStockValue)}</strong></article><article><span>Hàng đang giữ chỗ</span><strong>{totalReserved.toLocaleString("vi-VN")}</strong></article><article className={lowStockCount ? "warning" : ""}><span>Mặt hàng cần bổ sung</span><strong>{lowStockCount.toLocaleString("vi-VN")}</strong></article></div>
      <FilterBar searchValue={search} onSearchChange={setSearch} placeholder="Tìm SKU, tên hàng, lô hoặc kho..."><select className="filter-select" value={warehouseId} aria-label="Lọc theo kho" onChange={(event) => setWarehouseId(event.target.value)}><option value="all">Tất cả kho</option>{warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.code} - {warehouse.name}</option>)}</select></FilterBar>
      <div className="list-panel"><DataTable columns={columns} rows={rows} emptyTitle="Không tìm thấy tồn kho" emptyDescription="Thử đổi điều kiện tìm kiếm hoặc nhập hàng vào kho." /></div>
      <div className="content-heading inventory-movement-heading"><div><h2>Tồn theo lô</h2><p>Lô được cập nhật đồng thời với nhập kho, điều chuyển và giao hàng.</p></div></div>
      <div className="list-panel"><DataTable columns={batchColumns} rows={batchRows} emptyTitle="Không có lô hàng phù hợp" /></div>
      <div className="content-heading inventory-movement-heading"><div><h2>Biến động kho gần đây</h2><p>Nhập kho, xuất giao và điều chuyển đã hoàn tất.</p></div></div>
      <div className="list-panel"><DataTable columns={movementColumns} rows={movements.slice(0, 8)} emptyTitle="Chưa có biến động kho" /></div>
      <WarehouseOperationsPanel onInventoryChanged={load} />
      <PickListPanel onInventoryChanged={load} />
    </div>
    <Modal isOpen={transferOpen} title="Tạo phiếu chuyển kho" onClose={() => setTransferOpen(false)} wide>
      <form className="crm-form purchase-receipt-form" onSubmit={submitTransfer}>
        <p className="modal-description">Chọn đúng lô với hàng có quản lý lô. Hệ thống kiểm tra tổng số lượng từng hàng và từng lô trước khi cập nhật tồn của hai kho.</p>
        <div className="form-grid two-columns">
          <label>Kho xuất<select value={transfer.fromWarehouseId} onChange={(event) => setTransfer((current) => ({ ...current, fromWarehouseId: event.target.value, lines: current.lines.map((line) => ({ ...line, itemId: "", batchNo: "" })) }))}>{warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.code} - {warehouse.name}</option>)}</select>{errors.fromWarehouseId && <small className="field-error">{errors.fromWarehouseId}</small>}</label>
          <label>Kho nhận<select value={transfer.toWarehouseId} onChange={(event) => setTransfer((current) => ({ ...current, toWarehouseId: event.target.value }))}>{warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.code} - {warehouse.name}</option>)}</select>{errors.toWarehouseId && <small className="field-error">{errors.toWarehouseId}</small>}</label>
          <label>Ngày chuyển<input type="date" value={transfer.transferDate} onChange={(event) => setTransfer((current) => ({ ...current, transferDate: event.target.value }))} />{errors.transferDate && <small className="field-error">{errors.transferDate}</small>}</label>
        </div>
        <div className="receipt-lines">{transfer.lines.map((line, index) => {
          const product = sourceProductOptions.find((entry) => entry.id === line.itemId);
          const requiresBatch = product?.trackBatch ?? false;
          const lineBatches = batchesForLine(line.itemId);
          return <div className="receipt-line transfer-line" key={line.itemId + "-" + index}>
            <label>Hàng hóa<select value={line.itemId} onChange={(event) => updateTransferLine(index, { itemId: event.target.value, batchNo: "" })}><option value="">Chọn hàng hóa</option>{sourceProductOptions.map((entry) => <option key={entry.id} value={entry.id}>{entry.sku} - {entry.name}</option>)}</select></label>
            {requiresBatch ? <label>Lô hàng<select value={line.batchNo ?? ""} onChange={(event) => updateTransferLine(index, { batchNo: event.target.value })}><option value="">Chọn lô hàng</option>{lineBatches.map((batch) => <option key={batch.id} value={batch.batchNo}>{batch.batchNo} · còn {batch.quantityOnHand.toLocaleString("vi-VN")} {batch.item.unit}</option>)}</select></label> : <div className="transfer-no-batch"><strong>Không quản lý lô</strong><span>{product ? "Hàng không yêu cầu lô" : "Chọn hàng hóa trước"}</span></div>}
            <label>Số lượng<input min="0" step="1" type="number" value={line.quantity} onChange={(event) => updateTransferLine(index, { quantity: Number(event.target.value) })} /></label>
            <button className="line-remove" type="button" disabled={transfer.lines.length === 1} onClick={() => removeTransferLine(index)}>×</button>
            {errors["line-" + index] && <small className="field-error receipt-line-error">{errors["line-" + index]}</small>}
          </div>;
        })}</div>
        <button className="secondary-button" type="button" onClick={addTransferLine}>＋ Thêm dòng</button>
        {errors.lines && <p className="form-wide-error">{errors.lines}</p>}
        <div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setTransferOpen(false)}>Hủy</button><button className="primary-button compact" disabled={saving} type="submit">{saving ? "Đang chuyển..." : "Xác nhận chuyển kho"}</button></div>
      </form>
    </Modal>
  </section>;
}
