import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Column, DataTable } from "../../components/ui/DataTable";
import { FilterBar } from "../../components/ui/FilterBar";
import { Modal } from "../../components/ui/Modal";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { formatVnd } from "../../data/mockData";
import { PurchaseInvoice, PurchaseInvoiceAdjustmentDraft, PurchaseInvoiceCandidate, PurchaseInvoiceDraft, PurchaseOrder, Supplier, mockApi } from "../../lib/mockApi";

const emptyDraft = (): PurchaseInvoiceDraft => ({ purchaseReceiptId: "", supplierInvoiceNo: "", attachmentName: "", invoiceDate: "2026-08-29", dueDate: "2026-09-28", lines: [] });
const emptyAdjustment = (): PurchaseInvoiceAdjustmentDraft => ({ purchaseInvoiceId: "", adjustmentDate: "2026-08-29", amount: 0, reason: "" });

export function PurchaseInvoicesPage() {
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
  const [candidates, setCandidates] = useState<PurchaseInvoiceCandidate[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [adjustmentOpen, setAdjustmentOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [draft, setDraft] = useState<PurchaseInvoiceDraft>(() => emptyDraft());
  const [adjustment, setAdjustment] = useState<PurchaseInvoiceAdjustmentDraft>(() => emptyAdjustment());
  const [cancelTarget, setCancelTarget] = useState<PurchaseInvoice | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const load = useCallback(() => { void Promise.all([mockApi.purchasing.getPurchaseInvoices(), mockApi.purchasing.getPurchaseInvoiceCandidates(), mockApi.purchasing.getPurchaseOrders(), mockApi.purchasing.getSuppliers()]).then(([invoiceRows, candidateRows, orderRows, supplierRows]) => { setInvoices(invoiceRows); setCandidates(candidateRows); setOrders(orderRows); setSuppliers(supplierRows); }); }, []);
  useEffect(() => { load(); }, [load]);

  const supplierById = useMemo(() => new Map(suppliers.map((supplier) => [supplier.id, supplier])), [suppliers]);
  const orderById = useMemo(() => new Map(orders.map((order) => [order.id, order])), [orders]);
  const selectedCandidate = candidates.find((entry) => entry.receipt.id === draft.purchaseReceiptId);
  const invoicedQuantityByReceiptLine = useMemo(() => {
    const values = new Map<string, number>();
    invoices.filter((invoice) => invoice.status !== "cancelled").flatMap((invoice) => invoice.lines).forEach((line) => values.set(line.purchaseReceiptLineId, (values.get(line.purchaseReceiptLineId) ?? 0) + line.quantity));
    return values;
  }, [invoices]);
  const rows = useMemo(() => invoices.filter((invoice) => `${invoice.documentNo} ${invoice.supplierInvoiceNo} ${supplierById.get(invoice.supplierId)?.name ?? ""}`.toLowerCase().includes(search.toLowerCase())), [invoices, search, supplierById]);
  const selectReceipt = (purchaseReceiptId: string) => {
    const selected = candidates.find((entry) => entry.receipt.id === purchaseReceiptId);
    setDraft((current) => ({ ...current, purchaseReceiptId, dueDate: selected ? new Date(new Date(current.invoiceDate + "T00:00:00").getTime() + selected.supplier.paymentTermDays * 86_400_000).toISOString().slice(0, 10) : current.dueDate, lines: selected?.receipt.lines.map((line) => ({ purchaseReceiptLineId: line.id ?? "", quantity: Math.max(0, line.quantity - (invoicedQuantityByReceiptLine.get(line.id ?? "") ?? 0)) })).filter((line) => line.quantity > 0) ?? [] }));
  };
  const updateLine = (index: number, quantity: number) => setDraft((current) => ({ ...current, lines: current.lines.map((line, lineIndex) => lineIndex === index ? { ...line, quantity } : line) }));
  const save = async (event: FormEvent) => { event.preventDefault(); setSaving(true); const result = await mockApi.purchasing.createPurchaseInvoice(draft); setSaving(false); if (!result.entity) { setErrors(result.errors); showToast(result.errors.form ?? Object.values(result.errors)[0] ?? "Không thể lập hóa đơn mua.", "error"); return; } showToast(`${result.entity.documentNo} đã được lập từ phiếu nhập.`); setModalOpen(false); load(); };
  const saveAdjustment = async (event: FormEvent) => { event.preventDefault(); setSaving(true); const result = await mockApi.purchasing.createPurchaseInvoiceAdjustment(adjustment); setSaving(false); if (!result.entity) { setErrors(result.errors); showToast(result.errors.form ?? Object.values(result.errors)[0] ?? "Không thể điều chỉnh hóa đơn.", "error"); return; } showToast(`${result.entity.adjustmentNo} đã được ghi nhận.`); setAdjustmentOpen(false); load(); };
  const cancelInvoice = async (event: FormEvent) => { event.preventDefault(); if (!cancelTarget) return; setSaving(true); const result = await mockApi.purchasing.cancelPurchaseInvoice(cancelTarget.id, cancelReason); setSaving(false); if (!result.entity) { setErrors(result.errors); showToast(result.errors.form ?? Object.values(result.errors)[0] ?? "Không thể hủy hóa đơn.", "error"); return; } showToast(`${result.entity.documentNo} đã được hủy; số lượng có thể được lập lại.`); setCancelOpen(false); load(); };

  const columns: Column<PurchaseInvoice>[] = [
    { key: "document", header: "Hóa đơn mua", render: (invoice) => <div className="cell-main"><strong>{invoice.documentNo}</strong><span>HĐ NCC: {invoice.supplierInvoiceNo} · {new Date(invoice.invoiceDate).toLocaleDateString("vi-VN")}</span></div> },
    { key: "supplier", header: "Nhà cung cấp", render: (invoice) => <div className="cell-main"><strong>{supplierById.get(invoice.supplierId)?.name ?? invoice.supplierId}</strong><span>Hạn TT {new Date(invoice.dueDate).toLocaleDateString("vi-VN")}</span></div> },
    { key: "order", header: "Đơn mua", render: (invoice) => <Link className="reference-button" to={`/purchase/orders/${invoice.purchaseOrderId}`}>{orderById.get(invoice.purchaseOrderId)?.documentNo ?? invoice.purchaseOrderId}</Link> },
    { key: "balance", header: "Còn phải trả", className: "text-right", render: (invoice) => <div className="cell-main text-right"><strong>{formatVnd(invoice.balanceAmount)}</strong>{invoice.adjustedAmount > 0 && <span>Đã điều chỉnh {formatVnd(invoice.adjustedAmount)}</span>}</div> },
    { key: "status", header: "Trạng thái", render: (invoice) => <StatusBadge status={invoice.status} /> },
    { key: "action", header: "", className: "text-right", render: (invoice) => <div className="table-actions">{invoice.status !== "cancelled" && invoice.balanceAmount > 0 && <button onClick={() => { setAdjustment({ ...emptyAdjustment(), purchaseInvoiceId: invoice.id, amount: invoice.balanceAmount }); setErrors({}); setAdjustmentOpen(true); }}>Điều chỉnh</button>}{invoice.status !== "cancelled" && invoice.paidAmount === 0 && invoice.adjustedAmount === 0 && <button onClick={() => { setCancelTarget(invoice); setCancelReason(""); setErrors({}); setCancelOpen(true); }}>Hủy HĐ</button>}</div> },
  ];

  return <section className="sales-content">
    <div className="content-heading"><div><h2>Hóa đơn mua hàng</h2><p>Lập công nợ theo từng dòng phiếu nhập; hỗ trợ hóa đơn một phần, hủy và điều chỉnh.</p></div><button className="primary-button compact" onClick={() => { setDraft(emptyDraft()); setErrors({}); setModalOpen(true); }}>＋ Lập hóa đơn mua</button></div>
    <FilterBar searchValue={search} onSearchChange={setSearch} placeholder="Tìm số hóa đơn nội bộ, hóa đơn NCC hoặc nhà cung cấp..." />
    <div className="list-panel"><DataTable columns={columns} rows={rows} emptyTitle="Chưa có hóa đơn mua" emptyDescription="Nhập kho trước rồi lập hóa đơn từ phiếu nhập." /></div>
    <Modal isOpen={modalOpen} title="Lập hóa đơn mua từ phiếu nhập" onClose={() => setModalOpen(false)} wide><form className="crm-form purchase-receipt-form" onSubmit={save}>
      <p className="modal-description">Chỉ chọn số lượng chưa được lập hóa đơn. Hệ thống giữ nguyên đơn giá, chiết khấu và VAT của phiếu nhập.</p>
      <div className="form-grid two-columns"><label>Phiếu nhập kho<select value={draft.purchaseReceiptId} onChange={(event) => selectReceipt(event.target.value)}><option value="">Chọn phiếu nhập còn giá trị</option>{candidates.map((entry) => <option key={entry.receipt.id} value={entry.receipt.id}>{entry.receipt.documentNo} · {entry.supplier.name} · Còn {formatVnd(entry.totalAmount)}</option>)}</select>{errors.purchaseReceiptId && <small className="field-error">{errors.purchaseReceiptId}</small>}</label><label>Số hóa đơn NCC<input value={draft.supplierInvoiceNo} placeholder="Ví dụ: INV-2026-0128" onChange={(event) => setDraft((current) => ({ ...current, supplierInvoiceNo: event.target.value }))} />{errors.supplierInvoiceNo && <small className="field-error">{errors.supplierInvoiceNo}</small>}</label><label>Ngày hóa đơn<input type="date" value={draft.invoiceDate} onChange={(event) => setDraft((current) => ({ ...current, invoiceDate: event.target.value }))} />{errors.invoiceDate && <small className="field-error">{errors.invoiceDate}</small>}</label><label>Hạn thanh toán<input type="date" value={draft.dueDate} onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))} />{errors.dueDate && <small className="field-error">{errors.dueDate}</small>}</label><label className="form-span-2">Tên tệp đính kèm (mock)<input value={draft.attachmentName ?? ""} placeholder="hoa-don-ncc.pdf" onChange={(event) => setDraft((current) => ({ ...current, attachmentName: event.target.value }))} /></label></div>
      {selectedCandidate && <div className="receipt-lines">{draft.lines.map((line, index) => { const receiptLine = selectedCandidate.receipt.lines.find((entry) => entry.id === line.purchaseReceiptLineId); const invoiced = invoicedQuantityByReceiptLine.get(line.purchaseReceiptLineId) ?? 0; const remaining = Math.max(0, (receiptLine?.quantity ?? 0) - invoiced); return <div className="receipt-line operation-line" key={line.purchaseReceiptLineId}><div><strong>{receiptLine?.description}</strong><span>Còn có thể lập {remaining.toLocaleString("vi-VN")} {receiptLine?.unit}</span></div><label>SL lập HĐ<input type="number" min="0" max={remaining} value={line.quantity} onChange={(event) => updateLine(index, Number(event.target.value))} /></label><div className="line-total"><span>Đơn giá</span><strong>{formatVnd(receiptLine?.unitPrice ?? 0)}</strong></div>{errors[`line-${index}`] && <small className="field-error receipt-line-error">{errors[`line-${index}`]}</small>}</div>; })}</div>}
      {errors.lines && <p className="form-wide-error">{errors.lines}</p>}<div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setModalOpen(false)}>Hủy</button><button className="primary-button compact" disabled={saving}>{saving ? "Đang lập..." : "Xác nhận lập hóa đơn"}</button></div>
    </form></Modal>
    <Modal isOpen={adjustmentOpen} title="Điều chỉnh hóa đơn mua" onClose={() => setAdjustmentOpen(false)}><form className="crm-form" onSubmit={saveAdjustment}><p className="modal-description">Điều chỉnh làm giảm công nợ còn phải trả nhưng không thay đổi tồn kho.</p><label>Ngày điều chỉnh<input type="date" value={adjustment.adjustmentDate} onChange={(event) => setAdjustment((current) => ({ ...current, adjustmentDate: event.target.value }))} />{errors.adjustmentDate && <small className="field-error">{errors.adjustmentDate}</small>}</label><label>Số tiền điều chỉnh<input type="number" min="0" value={adjustment.amount} onChange={(event) => setAdjustment((current) => ({ ...current, amount: Number(event.target.value) }))} />{errors.amount && <small className="field-error">{errors.amount}</small>}</label><label>Lý do<input value={adjustment.reason} onChange={(event) => setAdjustment((current) => ({ ...current, reason: event.target.value }))} />{errors.reason && <small className="field-error">{errors.reason}</small>}</label><div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setAdjustmentOpen(false)}>Hủy</button><button className="primary-button compact" disabled={saving}>Xác nhận điều chỉnh</button></div></form></Modal>
    <Modal isOpen={cancelOpen} title="Hủy hóa đơn mua" onClose={() => setCancelOpen(false)}><form className="crm-form" onSubmit={cancelInvoice}><p className="modal-description">Chỉ hủy hóa đơn chưa thanh toán và chưa có điều chỉnh. Phiếu nhập sẽ được mở lại phần chưa lập hóa đơn.</p><label>Lý do hủy<input value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} />{errors.reason && <small className="field-error">{errors.reason}</small>}</label><div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setCancelOpen(false)}>Quay lại</button><button className="primary-button compact" disabled={saving}>Xác nhận hủy</button></div></form></Modal>
  </section>;
}
