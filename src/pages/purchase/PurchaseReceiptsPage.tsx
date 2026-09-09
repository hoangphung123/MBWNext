import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Column, DataTable } from "../../components/ui/DataTable";
import { FilterBar } from "../../components/ui/FilterBar";
import { Modal } from "../../components/ui/Modal";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { PurchaseOrder, PurchaseReceipt, PurchaseReturn, PurchaseReturnDraft, StockBalanceView, StockBatchView, Warehouse, mockApi } from "../../lib/mockApi";

const emptyReturnDraft = (receipt?: PurchaseReceipt): PurchaseReturnDraft => ({
  purchaseReceiptId: receipt?.id ?? "",
  returnDate: "2026-08-29",
  reason: "",
  lines: receipt?.lines.filter((line) => line.quantity > 0).map((line) => ({ purchaseReceiptLineId: line.id ?? "", quantity: 0, batchNo: line.batchNo })) ?? [],
});

export function PurchaseReceiptsPage() {
  const [receipts, setReceipts] = useState<PurchaseReceipt[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [returns, setReturns] = useState<PurchaseReturn[]>([]);
  const [stockBalances, setStockBalances] = useState<StockBalanceView[]>([]);
  const [stockBatches, setStockBatches] = useState<StockBatchView[]>([]);
  const [search, setSearch] = useState("");
  const [returnReceipt, setReturnReceipt] = useState<PurchaseReceipt | null>(null);
  const [returnDraft, setReturnDraft] = useState<PurchaseReturnDraft>(() => emptyReturnDraft());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(() => {
    void Promise.all([
      mockApi.purchasing.getReceipts(),
      mockApi.purchasing.getPurchaseOrders(),
      mockApi.purchasing.getFormOptions(),
      mockApi.purchasing.getPurchaseReturns(),
      mockApi.inventory.getStockBalances(),
      mockApi.inventory.getBatchBalances(),
    ]).then(([receiptRows, orderRows, formOptions, returnRows, balanceRows, batchRows]) => {
      setReceipts(receiptRows);
      setOrders(orderRows);
      setWarehouses(formOptions.warehouses);
      setReturns(returnRows);
      setStockBalances(balanceRows);
      setStockBatches(batchRows);
    });
  }, []);
  useEffect(() => { load(); }, [load]);

  const orderById = useMemo(() => new Map(orders.map((order) => [order.id, order])), [orders]);
  const warehouseById = useMemo(() => new Map(warehouses.map((warehouse) => [warehouse.id, warehouse])), [warehouses]);
  const returnedByReceiptLine = useMemo(() => {
    const values = new Map<string, number>();
    returns.flatMap((entry) => entry.lines).forEach((line) => values.set(line.purchaseReceiptLineId, (values.get(line.purchaseReceiptLineId) ?? 0) + line.quantity));
    return values;
  }, [returns]);
  const availableByItemWarehouse = useMemo(() => new Map(stockBalances.map((balance) => [`${balance.itemId}:${balance.warehouseId}`, balance.availableQuantity])), [stockBalances]);
  const onHandByBatch = useMemo(() => new Map(stockBatches.map((batch) => [`${batch.itemId}:${batch.warehouseId}:${batch.batchNo}`, batch.quantityOnHand])), [stockBatches]);
  const rows = useMemo(() => receipts.filter((receipt) => `${receipt.documentNo} ${orderById.get(receipt.purchaseOrderId)?.documentNo ?? ""} ${warehouseById.get(receipt.warehouseId)?.code ?? ""} ${warehouseById.get(receipt.warehouseId)?.name ?? ""}`.toLowerCase().includes(search.toLowerCase())), [receipts, search, orderById, warehouseById]);

  const openReturn = (receipt: PurchaseReceipt) => {
    setReturnReceipt(receipt);
    setReturnDraft(emptyReturnDraft(receipt));
    setErrors({});
  };
  const updateReturnLine = (index: number, quantity: number) => setReturnDraft((current) => ({ ...current, lines: current.lines.map((line, lineIndex) => lineIndex === index ? { ...line, quantity } : line) }));
  const saveReturn = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const result = await mockApi.purchasing.createPurchaseReturn(returnDraft);
    setSaving(false);
    if (!result.entity) {
      setErrors(result.errors);
      showToast(result.errors.form ?? Object.values(result.errors)[0] ?? "Không thể trả hàng nhà cung cấp.", "error");
      return;
    }
    showToast(`${result.entity.documentNo} đã được ghi nhận; tồn kho đã giảm theo số lượng trả.`);
    setReturnReceipt(null);
    load();
  };

  const columns: Column<PurchaseReceipt>[] = [
    { key: "document", header: "Phiếu nhập", render: (receipt) => <div className="cell-main"><strong>{receipt.documentNo}</strong><span>{new Date(receipt.receivedDate).toLocaleDateString("vi-VN")} · {receipt.lines.length} dòng hàng</span></div> },
    { key: "order", header: "Đơn mua", render: (receipt) => <Link className="reference-button" to={`/purchase/orders/${receipt.purchaseOrderId}`}>{orderById.get(receipt.purchaseOrderId)?.documentNo ?? "Đơn mua đã xóa"}</Link> },
    { key: "warehouse", header: "Kho nhận", render: (receipt) => { const warehouse = warehouseById.get(receipt.warehouseId); return warehouse ? <div className="cell-main"><strong>{warehouse.code}</strong><span>{warehouse.name}</span></div> : <span className="muted-text">Kho không xác định</span>; } },
    { key: "quantity", header: "Đạt / Từ chối", className: "text-right", render: (receipt) => <div className="cell-main text-right"><strong>{receipt.lines.reduce((sum, line) => sum + line.quantity, 0).toLocaleString("vi-VN")}</strong><span>Từ chối {receipt.lines.reduce((sum, line) => sum + (line.rejectedQuantity ?? 0), 0).toLocaleString("vi-VN")}</span></div> },
    { key: "status", header: "Trạng thái", render: (receipt) => <StatusBadge status={receipt.status} /> },
    { key: "action", header: "", className: "text-right", render: (receipt) => receipt.lines.some((line) => line.quantity > (returnedByReceiptLine.get(line.id ?? "") ?? 0)) ? <button className="table-action-button" onClick={() => openReturn(receipt)}>Trả NCC</button> : <span className="muted-text">Đã trả hết</span> },
  ];
  const returnColumns: Column<PurchaseReturn>[] = [
    { key: "return", header: "Phiếu trả", render: (entry) => <div className="cell-main"><strong>{entry.documentNo}</strong><span>{new Date(entry.returnDate).toLocaleDateString("vi-VN")} · {entry.reason}</span></div> },
    { key: "receipt", header: "Phiếu nhập nguồn", render: (entry) => receipts.find((receipt) => receipt.id === entry.purchaseReceiptId)?.documentNo ?? entry.purchaseReceiptId },
    { key: "quantity", header: "Số lượng trả", className: "text-right", render: (entry) => entry.lines.reduce((sum, line) => sum + line.quantity, 0).toLocaleString("vi-VN") },
    { key: "status", header: "Trạng thái", render: (entry) => <StatusBadge status={entry.status} /> },
  ];

  return <section className="sales-content">
    <div className="content-heading"><div><h2>Phiếu nhập kho</h2><p>Hàng đạt được cập nhật vào tồn; hàng từ chối chỉ được theo dõi để nhà cung cấp xử lý.</p></div><Link className="secondary-button" to="/purchase/orders">Xem đơn mua</Link></div>
    <FilterBar searchValue={search} onSearchChange={setSearch} placeholder="Tìm số phiếu nhập hoặc đơn mua..." />
    <div className="list-panel"><DataTable columns={columns} rows={rows} emptyTitle="Chưa có phiếu nhập kho" emptyDescription="Xác nhận đơn mua và nhập hàng từ trang chi tiết đơn mua." /></div>
    <div className="content-subheading"><div><h3>Hàng đã trả nhà cung cấp</h3><p>Trả hàng sẽ giảm tồn thực tế, tồn khả dụng và số lượng đã nhận của PO.</p></div></div>
    <div className="list-panel"><DataTable columns={returnColumns} rows={returns} emptyTitle="Chưa có phiếu trả NCC" emptyDescription="Mở một phiếu nhập để trả các hàng đã nhận về nhà cung cấp." /></div>
    <Modal isOpen={Boolean(returnReceipt)} title={`Trả hàng NCC${returnReceipt ? ` từ ${returnReceipt.documentNo}` : ""}`} onClose={() => setReturnReceipt(null)} wide><form className="crm-form purchase-receipt-form" onSubmit={saveReturn}>
      <p className="modal-description">Chỉ trả hàng đang còn trong tồn khả dụng. Khi nhà cung cấp xác nhận giảm công nợ, hãy lập điều chỉnh ở Hóa đơn mua.</p>
      <div className="form-grid two-columns"><label>Ngày trả hàng<input type="date" value={returnDraft.returnDate} onChange={(event) => setReturnDraft((current) => ({ ...current, returnDate: event.target.value }))} />{errors.returnDate && <small className="field-error">{errors.returnDate}</small>}</label><label>Lý do trả hàng<input value={returnDraft.reason} placeholder="Ví dụ: Lỗi chất lượng" onChange={(event) => setReturnDraft((current) => ({ ...current, reason: event.target.value }))} />{errors.reason && <small className="field-error">{errors.reason}</small>}</label></div>
      {returnReceipt && <div className="receipt-lines">{returnDraft.lines.map((line, index) => { const receiptLine = returnReceipt.lines.find((entry) => entry.id === line.purchaseReceiptLineId); const returned = returnedByReceiptLine.get(line.purchaseReceiptLineId) ?? 0; const sourceRemaining = Math.max(0, (receiptLine?.quantity ?? 0) - returned); const available = availableByItemWarehouse.get(`${receiptLine?.itemId}:${returnReceipt.warehouseId}`) ?? 0; const batchOnHand = receiptLine?.batchNo ? (onHandByBatch.get(`${receiptLine.itemId}:${returnReceipt.warehouseId}:${receiptLine.batchNo.trim().toUpperCase()}`) ?? 0) : available; const maximum = Math.min(sourceRemaining, available, batchOnHand); return <div className="receipt-line return-line" key={line.purchaseReceiptLineId}><div><strong>{receiptLine?.description}</strong><span>Đã nhập {receiptLine?.quantity.toLocaleString("vi-VN")} {receiptLine?.unit} · Có thể trả {maximum.toLocaleString("vi-VN")} (tồn khả dụng {available.toLocaleString("vi-VN")}){receiptLine?.batchNo ? ` · Lô ${receiptLine.batchNo} còn ${batchOnHand.toLocaleString("vi-VN")}` : ""}</span></div><label>SL trả<input type="number" min="0" max={maximum} value={line.quantity} onChange={(event) => updateReturnLine(index, Number(event.target.value))} /></label>{errors[`line-${index}`] && <small className="field-error receipt-line-error">{errors[`line-${index}`]}</small>}</div>; })}</div>}
      {errors.lines && <p className="form-wide-error">{errors.lines}</p>}<div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setReturnReceipt(null)}>Hủy</button><button className="primary-button compact" disabled={saving}>{saving ? "Đang ghi nhận..." : "Xác nhận trả NCC"}</button></div>
    </form></Modal>
  </section>;
}
