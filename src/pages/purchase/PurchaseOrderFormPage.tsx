import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../components/ui/Toast";
import { formatVnd } from "../../data/mockData";
import { PurchaseFormOptions, PurchaseOrderDraft, PurchaseValidation, mockApi } from "../../lib/mockApi";

const createDraft = (): PurchaseOrderDraft => ({ supplierId: "", warehouseId: "wh-hcm-rm", orderDate: "2026-08-29", expectedReceiptDate: "2026-09-03", lines: [{ itemId: "", quantity: 1, unitPrice: 0, discountAmount: 0 }] });

export function PurchaseOrderFormPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [options, setOptions] = useState<PurchaseFormOptions | null>(null);
  const [draft, setDraft] = useState<PurchaseOrderDraft>(() => createDraft());
  const [validation, setValidation] = useState<PurchaseValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [sourceQuotationLocked, setSourceQuotationLocked] = useState(false);

  useEffect(() => {
    void Promise.all([mockApi.purchasing.getFormOptions(), documentId ? mockApi.purchasing.getPurchaseOrder(documentId) : Promise.resolve(undefined)]).then(([formOptions, order]) => {
      setOptions(formOptions);
      if (documentId && !order) setNotFound(true);
      else if (order) { setSourceQuotationLocked(Boolean(order.sourceSupplierQuotationId)); setDraft({ id: order.id, supplierId: order.supplierId, warehouseId: order.warehouseId, orderDate: order.orderDate, expectedReceiptDate: order.expectedReceiptDate, lines: order.lines.map((line) => ({ itemId: line.itemId, quantity: line.quantity, unitPrice: line.unitPrice, discountAmount: line.discountAmount })) }); }
      setLoading(false);
    });
  }, [documentId]);

  useEffect(() => { if (options) void mockApi.purchasing.validatePurchaseOrder(draft).then(setValidation); }, [draft, options]);

  const productsById = useMemo(() => new Map(options?.products.map((product) => [product.id, product]) ?? []), [options]);
  const errors = validation?.errors ?? {};
  const updateLine = (index: number, change: Partial<PurchaseOrderDraft["lines"][number]>) => setDraft((current) => ({ ...current, lines: current.lines.map((line, lineIndex) => lineIndex === index ? { ...line, ...change } : line) }));
  const chooseProduct = (index: number, itemId: string) => { const product = productsById.get(itemId); updateLine(index, { itemId, unitPrice: product?.costPrice ?? 0, discountAmount: 0 }); };
  const addLine = () => setDraft((current) => ({ ...current, lines: [...current.lines, { itemId: "", quantity: 1, unitPrice: 0, discountAmount: 0 }] }));
  const removeLine = (index: number) => setDraft((current) => ({ ...current, lines: current.lines.filter((_, lineIndex) => lineIndex !== index) }));

  const save = async () => {
    setSaving(true);
    const preview = await mockApi.purchasing.validatePurchaseOrder(draft);
    if (Object.keys(preview.errors).length) {
      setValidation(preview);
      showToast("Vui lòng kiểm tra các trường được đánh dấu.", "error");
      setSaving(false);
      return;
    }
    const result = await mockApi.purchasing.savePurchaseOrder(draft);
    setSaving(false);
    if (!result.document) {
      setValidation(result.validation);
      showToast(result.validation.errors.form ?? "Không thể lưu đơn mua.", "error");
      return;
    }
    showToast(`${result.document.documentNo} đã được lưu.`);
    navigate("/purchase/orders");
  };
  const submit = (event: FormEvent) => { event.preventDefault(); void save(); };

  if (loading) return <section className="sales-content"><div className="detail-loading">Đang tải đơn mua...</div></section>;
  if (notFound || !options) return <section className="sales-content"><div className="empty-state"><h3>Không tìm thấy đơn mua</h3><Link className="primary-button compact" to="/purchase/orders">Quay lại danh sách</Link></div></section>;
  if (sourceQuotationLocked) return <section className="sales-content"><div className="empty-state"><h3>PO từ báo giá đã chọn không thể chỉnh sửa</h3><p>Đơn mua này được khóa để giữ nguyên nhà cung cấp, hàng hóa, số lượng, giá và chiết khấu đã được phê duyệt.</p><div className="detail-actions"><Link className="secondary-button" to={`/purchase/orders/${documentId}`}>Xem đơn mua</Link><Link className="primary-button compact" to="/purchase/orders">Quay lại danh sách</Link></div></div></section>;

  const subtotal = validation?.subtotal ?? 0;
  const vatAmount = validation?.vatAmount ?? 0;
  const total = validation?.totalAmount ?? 0;
  return <section className="sales-content">
    <div className="detail-breadcrumb"><Link to="/purchase/orders">Đơn mua</Link><span>/</span><strong>{documentId ? "Chỉnh sửa" : "Tạo mới"}</strong></div>
    <div className="content-heading form-heading"><div><h2>{documentId ? "Chỉnh sửa đơn mua" : "Tạo đơn mua"}</h2><p>Đơn mua được kiểm tra nhà cung cấp, kho nhận, ngày nhận và từng dòng hàng.</p></div><Link className="secondary-button" to="/purchase/orders">Hủy</Link></div>
    <form className="sales-form" onSubmit={submit}>
      <div className="form-main">
        <article className="form-card"><h3>Thông tin chung</h3><div className="form-grid two-columns">
          <label>Nhà cung cấp<select value={draft.supplierId} onChange={(event) => setDraft((current) => ({ ...current, supplierId: event.target.value }))}><option value="">Chọn nhà cung cấp</option>{options.suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.code} - {supplier.name}</option>)}</select>{errors.supplierId && <small className="field-error">{errors.supplierId}</small>}</label>
          <label>Kho nhận<select value={draft.warehouseId} onChange={(event) => setDraft((current) => ({ ...current, warehouseId: event.target.value }))}>{options.warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.code} - {warehouse.name}</option>)}</select>{errors.warehouseId && <small className="field-error">{errors.warehouseId}</small>}</label>
          <label>Ngày đơn mua<input type="date" value={draft.orderDate} onChange={(event) => setDraft((current) => ({ ...current, orderDate: event.target.value }))} />{errors.orderDate && <small className="field-error">{errors.orderDate}</small>}</label>
          <label>Ngày nhận dự kiến<input type="date" value={draft.expectedReceiptDate} onChange={(event) => setDraft((current) => ({ ...current, expectedReceiptDate: event.target.value }))} />{errors.expectedReceiptDate && <small className="field-error">{errors.expectedReceiptDate}</small>}</label>
        </div></article>
        <article className="form-card"><div className="line-heading"><div><h3>Danh sách hàng hóa</h3><p>Đơn giá mua được lấy từ giá vốn của danh mục sản phẩm.</p></div><button className="secondary-button" type="button" onClick={addLine}>＋ Thêm dòng</button></div><div className="form-lines">{draft.lines.map((line, index) => { const product = productsById.get(line.itemId); return <div className="form-line" key={`${line.itemId}-${index}`}>
          <label className="product-input">Hàng hóa<select value={line.itemId} onChange={(event) => chooseProduct(index, event.target.value)}><option value="">Chọn hàng hóa</option>{options.products.map((item) => <option key={item.id} value={item.id}>{item.sku} - {item.name}</option>)}</select>{product && <small>{product.unit} · Giá vốn: <strong>{formatVnd(product.costPrice)}</strong></small>}</label>
          <label>SL<input min="0" step="1" type="number" value={line.quantity} onChange={(event) => updateLine(index, { quantity: Number(event.target.value) })} /></label>
          <label>Đơn giá<input min="0" step="1000" type="number" value={line.unitPrice} onChange={(event) => updateLine(index, { unitPrice: Number(event.target.value) })} /></label>
          <label>Chiết khấu<input min="0" step="1000" type="number" value={line.discountAmount} onChange={(event) => updateLine(index, { discountAmount: Number(event.target.value) })} /></label>
          <div className="line-total"><span>Thành tiền</span><strong>{formatVnd(Math.max(0, line.quantity * line.unitPrice - line.discountAmount))}</strong></div>
          <button className="line-remove" type="button" disabled={draft.lines.length === 1} onClick={() => removeLine(index)} aria-label="Xóa dòng hàng">×</button>
          {errors[`line-${index}`] && <small className="field-error line-error">{errors[`line-${index}`]}</small>}
        </div>; })}</div>{errors.lines && <p className="form-wide-error">{errors.lines}</p>}</article>
      </div>
      <aside className="form-summary"><article className="form-card"><h3>Tóm tắt đơn mua</h3><div className="summary-row"><span>Tạm tính</span><strong>{formatVnd(subtotal)}</strong></div><div className="summary-row"><span>Thuế GTGT</span><strong>{formatVnd(vatAmount)}</strong></div><div className="summary-row total"><span>Tổng cộng</span><strong>{formatVnd(total)}</strong></div><button className="primary-button" type="button" onClick={() => void save()} disabled={saving}>{saving ? "Đang lưu..." : documentId ? "Lưu thay đổi" : "Tạo đơn mua"}</button><Link className="summary-cancel" to="/purchase/orders">Hủy và quay lại</Link></article></aside>
    </form>
  </section>;
}
