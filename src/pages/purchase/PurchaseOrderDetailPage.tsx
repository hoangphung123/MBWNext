import { FormEvent, useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Modal } from "../../components/ui/Modal";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { formatVnd } from "../../data/mockData";
import { PurchaseOrderDetail, PurchaseReceiptDraft, mockApi } from "../../lib/mockApi";

const createReceiptDraft = (detail: PurchaseOrderDetail): PurchaseReceiptDraft => ({
  receivedDate: "2026-08-29",
  lines: detail.order.lines.map((line) => ({ purchaseOrderLineId: line.id, itemId: line.itemId, quantity: 0, rejectedQuantity: 0, rejectionReason: "", batchNo: "", manufacturingDate: "", expiryDate: "" })),
});

export function PurchaseOrderDetailPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [detail, setDetail] = useState<PurchaseOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [draft, setDraft] = useState<PurchaseReceiptDraft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [amending, setAmending] = useState(false);

  const load = useCallback(() => {
    if (!documentId) return;
    setLoading(true);
    void mockApi.purchasing.getPurchaseOrderDetail(documentId).then((data) => { setDetail(data ?? null); setLoading(false); });
  }, [documentId]);
  useEffect(() => { load(); }, [load]);

  const openReceipt = () => { if (!detail) return; setDraft(createReceiptDraft(detail)); setErrors({}); setReceiptOpen(true); };
  const updateReceiptLine = (index: number, change: Partial<PurchaseReceiptDraft["lines"][number]>) => setDraft((current) => current ? { ...current, lines: current.lines.map((line, lineIndex) => lineIndex === index ? { ...line, ...change } : line) } : current);
  const saveReceipt = async (event: FormEvent) => {
    event.preventDefault();
    if (!detail || !draft) return;
    setSaving(true);
    const result = await mockApi.purchasing.createReceipt(detail.order.id, draft);
    setSaving(false);
    if (!result.entity) { setErrors(result.errors); showToast(result.errors.form ?? Object.values(result.errors)[0] ?? "Không thể nhập kho.", "error"); return; }
    showToast(`${result.entity.documentNo} đã được ghi nhận. Chỉ hàng đạt mới cộng vào tồn kho.`);
    setReceiptOpen(false); load();
  };
  const createAmendment = async () => {
    if (!detail) return;
    setAmending(true);
    const result = await mockApi.purchasing.createPurchaseOrderAmendment(detail.order.id);
    setAmending(false);
    if (!result.entity) { showToast(result.errors.form ?? "Không thể tạo PO điều chỉnh.", "error"); return; }
    showToast(`${result.entity.documentNo} đã được tạo để điều chỉnh ${detail.order.documentNo}.`);
    navigate(`/purchase/orders/${result.entity.id}/edit`);
  };

  if (loading) return <section className="sales-content"><div className="detail-loading">Đang tải đơn mua...</div></section>;
  if (!detail || (!draft && receiptOpen)) return <section className="sales-content"><div className="empty-state"><h3>Không tìm thấy đơn mua</h3><Link className="primary-button compact" to="/purchase/orders">Quay lại danh sách</Link></div></section>;

  const canReceive = ["confirmed", "partially_completed"].includes(detail.order.status) && detail.order.lines.some((line) => line.receivedQuantity < line.quantity);
  const canAmend = ["draft", "pending_approval", "approved"].includes(detail.order.status) && !detail.receipts.length;
  const isLate = ["confirmed", "partially_completed"].includes(detail.order.status) && detail.order.expectedReceiptDate < "2026-08-29";

  return <section className="sales-content">
    <div className="detail-breadcrumb"><Link to="/purchase/orders">Đơn mua</Link><span>/</span><strong>{detail.order.documentNo}</strong></div>
    <div className="content-heading detail-heading">
      <div><div className="heading-with-badge"><h2>{detail.order.documentNo}</h2><StatusBadge status={detail.order.status} /></div><p>{detail.supplier.name} · Nhận tại {detail.warehouse.code} - {detail.warehouse.name}</p></div>
      <div className="detail-actions">
        {detail.order.status === "draft" && !detail.order.sourceSupplierQuotationId && <Link className="secondary-button" to={`/purchase/orders/${detail.order.id}/edit`}>Chỉnh sửa</Link>}
        {canAmend && <button className="secondary-button" disabled={amending} onClick={() => void createAmendment()}>{amending ? "Đang tạo..." : "Tạo PO điều chỉnh"}</button>}
        {canReceive && <button className="primary-button compact" onClick={openReceipt}>＋ Nhập kho</button>}
      </div>
    </div>
    <div className="order-overview-grid">
      <article className="detail-card"><span>Nhà cung cấp</span><strong>{detail.supplier.name}</strong><p>{detail.supplier.code} · Thanh toán {detail.supplier.paymentTermDays} ngày</p></article>
      <article className="detail-card"><span>Thời gian nhận</span><strong>{new Date(detail.order.expectedReceiptDate).toLocaleDateString("vi-VN")}</strong><p>{isLate ? "Đã quá ngày nhận dự kiến" : `Ngày đơn ${new Date(detail.order.orderDate).toLocaleDateString("vi-VN")}`}</p></article>
      <article className="detail-card amount-card"><span>Tổng giá trị</span><strong>{formatVnd(detail.order.totalAmount)}</strong><p>Đã nhận {detail.order.lines.reduce((sum, line) => sum + line.receivedQuantity, 0).toLocaleString("vi-VN")} đơn vị</p></article>
    </div>
    {detail.order.sourceSupplierQuotationId && <div className="credit-note"><span>PO được tạo từ báo giá đã chọn</span><strong>Nội dung PO được khóa để đảm bảo đúng giá và điều kiện đã phê duyệt.</strong></div>}
    {detail.order.amendsPurchaseOrderId && <div className="credit-note"><span>PO điều chỉnh</span><strong>Đơn này thay thế PO {detail.order.amendsPurchaseOrderId} và cần đi lại quy trình duyệt.</strong></div>}
    {isLate && <p className="form-wide-error">PO đã quá ngày nhận dự kiến. Hãy liên hệ nhà cung cấp hoặc tạo PO điều chỉnh.</p>}
    <article className="detail-section"><div className="section-heading"><div><h3>Dòng hàng đặt mua</h3><p>Chỉ số lượng đạt mới được cộng tồn kho; hàng từ chối sẽ không vào kho.</p></div></div><div className="table-wrap"><table className="data-table purchase-detail-table"><thead><tr><th>Hàng hóa</th><th className="text-right">Đặt mua</th><th className="text-right">Đã nhận</th><th className="text-right">Còn lại</th><th className="text-right">Đơn giá</th><th className="text-right">Thành tiền</th></tr></thead><tbody>{detail.order.lines.map((line) => <tr key={line.id}><td><div className="cell-main"><strong>{line.description}</strong><span>{line.unit}</span></div></td><td className="text-right">{line.quantity.toLocaleString("vi-VN")}</td><td className="text-right"><strong className={line.receivedQuantity ? "stock-ok" : "stock-neutral"}>{line.receivedQuantity.toLocaleString("vi-VN")}</strong></td><td className="text-right">{Math.max(0, line.quantity - line.receivedQuantity).toLocaleString("vi-VN")}</td><td className="text-right">{formatVnd(line.unitPrice)}</td><td className="text-right">{formatVnd(line.lineTotal * (1 + line.vatRate))}</td></tr>)}</tbody></table></div><div className="order-totals"><span><b>Tạm tính</b><strong>{formatVnd(detail.order.subtotal)}</strong></span><span><b>Thuế GTGT</b><strong>{formatVnd(detail.order.vatAmount)}</strong></span><span className="grand-total"><b>Tổng cộng</b><strong>{formatVnd(detail.order.totalAmount)}</strong></span></div></article>
    <article className="detail-section"><div className="section-heading"><div><h3>Lịch sử nhập kho</h3><p>Phiếu nhập ghi nhận riêng hàng đạt và hàng từ chối.</p></div></div>{detail.receipts.length ? <div className="transaction-list">{detail.receipts.map((receipt) => <div className="transaction-row" key={receipt.id}><span className="transaction-icon">↓</span><div><strong>{receipt.documentNo}</strong><span>{new Date(receipt.receivedDate).toLocaleDateString("vi-VN")} · Nhập đạt {receipt.lines.reduce((sum, line) => sum + line.quantity, 0).toLocaleString("vi-VN")} · Từ chối {receipt.lines.reduce((sum, line) => sum + (line.rejectedQuantity ?? 0), 0).toLocaleString("vi-VN")}</span></div><StatusBadge status={receipt.status} /></div>)}</div> : <p className="inline-empty">Chưa có phiếu nhập kho. Xác nhận đơn mua để bắt đầu nhận hàng.</p>}</article>
    <article className="detail-section"><div className="section-heading"><div><h3>Hóa đơn mua liên quan</h3><p>Đối chiếu công nợ phát sinh từ các phiếu nhập của PO.</p></div></div>{detail.invoices.length ? <div className="transaction-list">{detail.invoices.map((invoice) => <div className="transaction-row" key={invoice.id}><span className="transaction-icon">₫</span><div><strong>{invoice.documentNo} · {invoice.supplierInvoiceNo}</strong><span>Còn phải trả {formatVnd(invoice.balanceAmount)}</span></div><StatusBadge status={invoice.status} /></div>)}</div> : <p className="inline-empty">Chưa có hóa đơn mua.</p>}</article>
    <Modal isOpen={receiptOpen} title={`Nhập kho từ ${detail.order.documentNo}`} onClose={() => setReceiptOpen(false)} wide>
      <form className="crm-form purchase-receipt-form" onSubmit={saveReceipt}>
        <p className="modal-description">Hàng đạt được cộng vào tồn kho. Hàng từ chối được ghi nhận để nhà cung cấp giao bù hoặc xử lý riêng.</p>
        <label>Ngày nhận hàng<input type="date" value={draft?.receivedDate ?? ""} onChange={(event) => setDraft((current) => current ? { ...current, receivedDate: event.target.value } : current)} />{errors.receivedDate && <small className="field-error">{errors.receivedDate}</small>}</label>
        <div className="receipt-lines">{detail.order.lines.map((line, index) => { const remaining = Math.max(0, line.quantity - line.receivedQuantity); const receiptLine = draft?.lines[index]; const requiresBatch = line.itemId === "item-rm-arabica" || line.itemId === "item-rm-robusta" || line.itemId.startsWith("item-fg-"); return <div className="receipt-line operation-line" key={line.id}><div><strong>{line.description}</strong><span>Tối đa {remaining.toLocaleString("vi-VN")} {line.unit}</span></div><label>SL đạt<input type="number" min="0" max={remaining} value={receiptLine?.quantity ?? 0} onChange={(event) => updateReceiptLine(index, { quantity: Number(event.target.value) })} /></label><label>SL từ chối<input type="number" min="0" max={remaining} value={receiptLine?.rejectedQuantity ?? 0} onChange={(event) => updateReceiptLine(index, { rejectedQuantity: Number(event.target.value) })} /></label>{requiresBatch && <label>Số lô<input value={receiptLine?.batchNo ?? ""} placeholder="Ví dụ: LOT-20260829" onChange={(event) => updateReceiptLine(index, { batchNo: event.target.value })} /></label>}{(receiptLine?.rejectedQuantity ?? 0) > 0 && <label>Lý do từ chối<input value={receiptLine?.rejectionReason ?? ""} onChange={(event) => updateReceiptLine(index, { rejectionReason: event.target.value })} /></label>}{requiresBatch && <label>Hạn dùng<input type="date" value={receiptLine?.expiryDate ?? ""} onChange={(event) => updateReceiptLine(index, { expiryDate: event.target.value })} /></label>}{errors[`line-${index}`] && <small className="field-error receipt-line-error">{errors[`line-${index}`]}</small>}</div>; })}</div>
        {errors.lines && <p className="form-wide-error">{errors.lines}</p>}
        <div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setReceiptOpen(false)}>Hủy</button><button className="primary-button compact" disabled={saving} type="submit">{saving ? "Đang nhập..." : "Xác nhận nhập kho"}</button></div>
      </form>
    </Modal>
  </section>;
}
