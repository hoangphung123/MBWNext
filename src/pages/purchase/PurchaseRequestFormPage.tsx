import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../components/ui/Toast";
import { formatVnd } from "../../data/mockData";
import { PurchaseFormOptions, PurchaseRequestDraft, PurchaseRequestValidation, mockApi } from "../../lib/mockApi";

const createDraft = (): PurchaseRequestDraft => ({ requestingDepartment: "Kho vận", warehouseId: "wh-hcm-rm", requestDate: "2026-08-29", requiredDate: "2026-09-05", lines: [{ itemId: "", quantity: 1, unitPrice: 0 }] });

export function PurchaseRequestFormPage() {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [options, setOptions] = useState<PurchaseFormOptions | null>(null);
  const [draft, setDraft] = useState<PurchaseRequestDraft>(() => createDraft());
  const [validation, setValidation] = useState<PurchaseRequestValidation | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [locked, setLocked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void Promise.all([mockApi.purchasing.getFormOptions(), documentId ? mockApi.purchasing.getPurchaseRequest(documentId) : Promise.resolve(undefined)]).then(([formOptions, request]) => {
      setOptions(formOptions);
      if (documentId && !request) setNotFound(true);
      else if (request) {
        setLocked(request.status !== "draft");
        setDraft({ id: request.id, requestingDepartment: request.requestingDepartment, warehouseId: request.warehouseId, requestDate: request.requestDate, requiredDate: request.requiredDate, lines: request.lines.map((line) => ({ itemId: line.itemId, quantity: line.quantity, unitPrice: line.unitPrice })) });
      }
      setLoading(false);
    });
  }, [documentId]);

  useEffect(() => { if (options && !locked) void mockApi.purchasing.validatePurchaseRequest(draft).then(setValidation); }, [draft, locked, options]);

  const productsById = useMemo(() => new Map(options?.products.map((product) => [product.id, product]) ?? []), [options]);
  const managedProducts = options?.products.filter((product) => product.itemType !== "service") ?? [];
  const errors = validation?.errors ?? {};
  const updateLine = (index: number, change: Partial<PurchaseRequestDraft["lines"][number]>) => setDraft((current) => ({ ...current, lines: current.lines.map((line, lineIndex) => lineIndex === index ? { ...line, ...change } : line) }));
  const chooseProduct = (index: number, itemId: string) => updateLine(index, { itemId, unitPrice: productsById.get(itemId)?.costPrice ?? 0 });
  const addLine = () => setDraft((current) => ({ ...current, lines: [...current.lines, { itemId: "", quantity: 1, unitPrice: 0 }] }));
  const removeLine = (index: number) => setDraft((current) => ({ ...current, lines: current.lines.filter((_, lineIndex) => lineIndex !== index) }));

  const save = async () => {
    const preview = await mockApi.purchasing.validatePurchaseRequest(draft);
    if (Object.keys(preview.errors).length) { setValidation(preview); showToast("Vui lòng kiểm tra các trường được đánh dấu.", "error"); return; }
    setSaving(true);
    const result = documentId ? await mockApi.purchasing.updatePurchaseRequest(documentId, draft) : await mockApi.purchasing.createPurchaseRequest(draft);
    setSaving(false);
    if (!result.entity) { setValidation({ errors: result.errors, estimatedAmount: preview.estimatedAmount }); showToast(result.errors.form ?? "Không thể lưu yêu cầu mua.", "error"); return; }
    showToast(`${result.entity.documentNo} đã được ${documentId ? "cập nhật" : "tạo"}.`);
    navigate(`/purchase/requests/${result.entity.id}`);
  };
  const submit = (event: FormEvent) => { event.preventDefault(); void save(); };

  if (loading) return <section className="sales-content"><div className="detail-loading">Đang tải yêu cầu mua...</div></section>;
  if (notFound || !options) return <section className="sales-content"><div className="empty-state"><h3>Không tìm thấy yêu cầu mua</h3><Link className="primary-button compact" to="/purchase/requests">Quay lại danh sách</Link></div></section>;
  if (locked) return <section className="sales-content"><div className="empty-state"><h3>Yêu cầu mua không thể chỉnh sửa</h3><p>Chỉ yêu cầu ở trạng thái nháp được phép thay đổi để đảm bảo đúng luồng phê duyệt.</p><Link className="primary-button compact" to={`/purchase/requests/${documentId}`}>Xem chi tiết yêu cầu</Link></div></section>;

  const estimatedAmount = validation?.estimatedAmount ?? 0;
  return <section className="sales-content">
    <div className="detail-breadcrumb"><Link to="/purchase/requests">Yêu cầu mua</Link><span>/</span><strong>{documentId ? "Chỉnh sửa" : "Tạo mới"}</strong></div>
    <div className="content-heading form-heading"><div><h2>{documentId ? "Chỉnh sửa yêu cầu mua" : "Tạo yêu cầu mua"}</h2><p>Chỉ hàng hóa quản lý tồn kho được đưa vào yêu cầu mua; đơn giá dự kiến được lấy từ giá vốn hiện tại.</p></div><Link className="secondary-button" to={documentId ? `/purchase/requests/${documentId}` : "/purchase/requests"}>Hủy</Link></div>
    <form className="sales-form" onSubmit={submit}>
      <div className="form-main">
        <article className="form-card"><h3>Thông tin chung</h3><div className="form-grid two-columns">
          <label>Bộ phận yêu cầu<input value={draft.requestingDepartment} onChange={(event) => setDraft((current) => ({ ...current, requestingDepartment: event.target.value }))} />{errors.requestingDepartment && <small className="field-error">{errors.requestingDepartment}</small>}</label>
          <label>Kho cần hàng<select value={draft.warehouseId} onChange={(event) => setDraft((current) => ({ ...current, warehouseId: event.target.value }))}>{options.warehouses.filter((warehouse) => warehouse.warehouseType === "physical").map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.code} - {warehouse.name}</option>)}</select>{errors.warehouseId && <small className="field-error">{errors.warehouseId}</small>}</label>
          <label>Ngày yêu cầu<input type="date" value={draft.requestDate} onChange={(event) => setDraft((current) => ({ ...current, requestDate: event.target.value }))} />{errors.requestDate && <small className="field-error">{errors.requestDate}</small>}</label>
          <label>Ngày cần hàng<input type="date" value={draft.requiredDate} onChange={(event) => setDraft((current) => ({ ...current, requiredDate: event.target.value }))} />{errors.requiredDate && <small className="field-error">{errors.requiredDate}</small>}</label>
        </div></article>
        <article className="form-card"><div className="line-heading"><div><h3>Hàng hóa cần mua</h3><p>Đơn giá dự kiến có thể điều chỉnh trước khi gửi duyệt.</p></div><button className="secondary-button" type="button" onClick={addLine}>＋ Thêm dòng</button></div><div className="form-lines">{draft.lines.map((line, index) => { const product = productsById.get(line.itemId); return <div className="form-line purchase-request-line" key={`${line.itemId}-${index}`}>
          <label className="product-input">Hàng hóa<select value={line.itemId} onChange={(event) => chooseProduct(index, event.target.value)}><option value="">Chọn hàng hóa</option>{managedProducts.map((item) => <option key={item.id} value={item.id}>{item.sku} - {item.name}</option>)}</select>{product && <small>{product.unit} · Giá vốn: <strong>{formatVnd(product.costPrice)}</strong></small>}</label>
          <label>SL<input min="0" step="1" type="number" value={line.quantity} onChange={(event) => updateLine(index, { quantity: Number(event.target.value) })} /></label>
          <label>Đơn giá dự kiến<input min="0" step="1000" type="number" value={line.unitPrice} onChange={(event) => updateLine(index, { unitPrice: Number(event.target.value) })} /></label>
          <div className="line-total"><span>Ước tính</span><strong>{formatVnd(Math.max(0, line.quantity * line.unitPrice))}</strong></div>
          <button className="line-remove" type="button" disabled={draft.lines.length === 1} onClick={() => removeLine(index)} aria-label="Xóa dòng hàng">×</button>
          {errors[`line-${index}`] && <small className="field-error line-error">{errors[`line-${index}`]}</small>}
        </div>; })}</div>{errors.lines && <p className="form-wide-error">{errors.lines}</p>}</article>
      </div>
      <aside className="form-summary"><article className="form-card"><h3>Tóm tắt yêu cầu</h3><div className="summary-row"><span>Số dòng hàng</span><strong>{draft.lines.length}</strong></div><div className="summary-row total"><span>Giá trị ước tính</span><strong>{formatVnd(estimatedAmount)}</strong></div><button className="primary-button" type="button" onClick={() => void save()} disabled={saving}>{saving ? "Đang lưu..." : documentId ? "Lưu thay đổi" : "Tạo yêu cầu"}</button><Link className="summary-cancel" to={documentId ? `/purchase/requests/${documentId}` : "/purchase/requests"}>Hủy và quay lại</Link></article></aside>
    </form>
  </section>;
}
