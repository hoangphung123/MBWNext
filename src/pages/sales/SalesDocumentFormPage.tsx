import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formatVnd } from "../../data/mockData";
import { SalesDocumentDraft, SalesDocumentKind, SalesFormOptions, SalesValidation, mockApi } from "../../lib/mockApi";
import { useToast } from "../../components/ui/Toast";
import { EmptyState } from "../../components/ui/EmptyState";

function createDraft(kind: SalesDocumentKind): SalesDocumentDraft {
  return {
    kind,
    customerId: "",
    warehouseId: "wh-hcm-main",
    documentDate: "2026-08-29",
    validUntil: kind === "quotation" ? "2026-09-12" : undefined,
    requestedDeliveryDate: kind === "order" ? "2026-09-02" : undefined,
    lines: [{ itemId: "", quantity: 1, unitPrice: 0, discountAmount: 0 }],
  };
}

export function SalesDocumentFormPage({ kind }: { kind: SalesDocumentKind }) {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [options, setOptions] = useState<SalesFormOptions | null>(null);
  const [draft, setDraft] = useState<SalesDocumentDraft>(() => createDraft(kind));
  const [validation, setValidation] = useState<SalesValidation | null>(null);
  const [documentStatus, setDocumentStatus] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const kindLabel = kind === "order" ? "đơn bán" : "báo giá";
  const listPath = kind === "order" ? "/sales/orders" : "/sales/quotations";

  useEffect(() => {
    let mounted = true;
    const documentRequest = documentId ? (kind === "order" ? mockApi.sales.getOrder(documentId) : mockApi.sales.getQuotation(documentId)) : Promise.resolve(undefined);
    Promise.all([mockApi.sales.getFormOptions(), documentRequest]).then(([formOptions, document]) => {
      if (!mounted) return;
      setOptions(formOptions);
      setDocumentStatus(document?.status ?? null);
      setNotFound(Boolean(documentId && !document));
      setDraft(document ? {
        id: document.id,
        kind,
        customerId: document.customerId,
        warehouseId: document.warehouseId ?? "wh-hcm-main",
        documentDate: document.documentDate,
        validUntil: document.validUntil,
        requestedDeliveryDate: document.requestedDeliveryDate,
        lines: document.lines.map((line) => ({ itemId: line.itemId, quantity: line.quantity, unitPrice: line.unitPrice, discountAmount: line.discountAmount })),
      } : createDraft(kind));
      setLoading(false);
    });
    return () => { mounted = false; };
  }, [documentId, kind]);

  useEffect(() => {
    if (!options) return;
    let mounted = true;
    mockApi.sales.validateDocument(draft).then((result) => mounted && setValidation(result));
    return () => { mounted = false; };
  }, [draft, options]);

  const productById = useMemo(() => new Map(options?.products.map((product) => [product.id, product]) ?? []), [options]);
  const availableByItem = useMemo(() => new Map((options?.stockAvailability ?? []).filter((stock) => stock.warehouseId === draft.warehouseId).map((stock) => [stock.itemId, stock.availableQuantity])), [options, draft.warehouseId]);
  const selectedItemIds = useMemo(() => new Set(draft.lines.map((line) => line.itemId).filter(Boolean)), [draft.lines]);
  const selectableProducts = useMemo(() => (options?.products ?? []).filter((product) => {
    if (kind === "quotation" || product.itemType === "service") return true;
    return (availableByItem.get(product.id) ?? 0) > 0 || selectedItemIds.has(product.id);
  }), [availableByItem, kind, options, selectedItemIds]);
  const selectedWarehouse = options?.warehouses.find((warehouse) => warehouse.id === draft.warehouseId);
  const customer = options?.customers.find((item) => item.id === draft.customerId);

  const updateDraft = (patch: Partial<SalesDocumentDraft>) => setDraft((current) => ({ ...current, ...patch }));
  const updateLine = (index: number, patch: Partial<SalesDocumentDraft["lines"][number]>) => setDraft((current) => ({ ...current, lines: current.lines.map((line, lineIndex) => lineIndex === index ? { ...line, ...patch } : line) }));
  const chooseProduct = (index: number, itemId: string) => {
    const product = productById.get(itemId);
    updateLine(index, { itemId, unitPrice: product?.sellingPrice ?? 0 });
  };
  const changeWarehouse = (warehouseId: string) => setDraft((current) => ({
    ...current,
    warehouseId,
    lines: current.lines.map((line) => {
      const product = productById.get(line.itemId);
      const available = (options?.stockAvailability ?? []).find((stock) => stock.itemId === line.itemId && stock.warehouseId === warehouseId)?.availableQuantity ?? 0;
      return kind === "order" && product && product.itemType !== "service" && available <= 0 ? { ...line, itemId: "", unitPrice: 0 } : line;
    }),
  }));
  const removeLine = (index: number) => setDraft((current) => current.lines.length === 1 ? current : { ...current, lines: current.lines.filter((_, lineIndex) => lineIndex !== index) });
  const addLine = () => setDraft((current) => ({ ...current, lines: [...current.lines, { itemId: "", quantity: 1, unitPrice: 0, discountAmount: 0 }] }));

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const preview = await mockApi.sales.validateDocument(draft);
    setValidation(preview);
    if (Object.keys(preview.errors).length > 0) {
      showToast("Vui lòng kiểm tra các trường được đánh dấu.", "error");
      setSaving(false);
      return;
    }
    const result = await mockApi.sales.saveDocument(draft);
    setSaving(false);
    if (!result.document) {
      setValidation(result.validation);
      showToast("Không thể lưu chứng từ. Vui lòng kiểm tra lại dữ liệu.", "error");
      return;
    }
    showToast(`${result.document.documentNo} đã được lưu.`);
    navigate(kind === "order" ? `/sales/orders/${result.document.id}` : listPath);
  };

  if (loading || !options) return <section className="sales-content"><div className="detail-loading">Đang tải biểu mẫu {kindLabel}...</div></section>;
  if (notFound) return <section className="sales-content"><EmptyState title={`Không tìm thấy ${kindLabel}`} description="Chứng từ có thể đã bị xóa hoặc đường dẫn không còn hợp lệ." actionLabel={`Về danh sách ${kindLabel}`} onAction={() => navigate(listPath)} /></section>;
  if (documentId && documentStatus && documentStatus !== "draft") return <section className="sales-content"><EmptyState title={`Không thể chỉnh sửa ${kindLabel}`} description="Chứng từ đã được xác nhận hoặc đã phát sinh nghiệp vụ. Hãy tạo chứng từ điều chỉnh thay vì thay đổi dữ liệu gốc." actionLabel={`Về danh sách ${kindLabel}`} onAction={() => navigate(listPath)} /></section>;

  const errors = validation?.errors ?? {};
  const total = validation?.totalAmount ?? 0;
  const subtotal = validation?.subtotal ?? 0;
  const vatAmount = validation?.vatAmount ?? 0;
  const productHint = kind === "order" ? `Chỉ hiển thị hàng còn tồn khả dụng tại ${selectedWarehouse?.name ?? "kho xuất"}; dịch vụ không phụ thuộc kho.` : "Giá bán được lấy từ danh mục sản phẩm.";

  return <section className="sales-content">
    <div className="detail-breadcrumb"><Link to={listPath}>{kind === "order" ? "Đơn bán" : "Báo giá"}</Link><span>/</span><strong>{documentId ? "Chỉnh sửa" : "Tạo mới"}</strong></div>
    <div className="content-heading form-heading"><div><h2>{documentId ? `Chỉnh sửa ${kindLabel}` : `Tạo ${kindLabel}`}</h2><p>Thông tin chứng từ được kiểm tra với tồn kho và hạn mức công nợ hiện tại.</p></div><Link className="secondary-button" to={listPath}>Hủy</Link></div>
    <form className="sales-form" onSubmit={save}>
      <div className="form-main">
        <article className="form-card">
          <h3>Thông tin chung</h3>
          <div className="form-grid two-columns">
            <label>Khách hàng<select value={draft.customerId} onChange={(event) => updateDraft({ customerId: event.target.value })}><option value="">Chọn khách hàng</option>{options.customers.map((item) => <option value={item.id} key={item.id}>{item.code} - {item.name}</option>)}</select>{errors.customerId && <small className="field-error">{errors.customerId}</small>}</label>
            <label>Kho xuất hàng<select value={draft.warehouseId} onChange={(event) => changeWarehouse(event.target.value)}>{options.warehouses.map((item) => <option value={item.id} key={item.id}>{item.code} - {item.name}</option>)}</select>{errors.warehouseId && <small className="field-error">{errors.warehouseId}</small>}</label>
            <label>Ngày chứng từ<input type="date" value={draft.documentDate} onChange={(event) => updateDraft({ documentDate: event.target.value })} /></label>
            {kind === "quotation" ? <label>Hiệu lực đến<input type="date" value={draft.validUntil ?? ""} onChange={(event) => updateDraft({ validUntil: event.target.value })} />{errors.validUntil && <small className="field-error">{errors.validUntil}</small>}</label> : <label>Ngày giao dự kiến<input type="date" value={draft.requestedDeliveryDate ?? ""} onChange={(event) => updateDraft({ requestedDeliveryDate: event.target.value })} />{errors.requestedDeliveryDate && <small className="field-error">{errors.requestedDeliveryDate}</small>}</label>}
          </div>
          {customer && <div className="credit-note"><span>Hạn mức công nợ còn lại</span><strong>{formatVnd(Math.max(0, customer.creditLimit - customer.outstandingBalance))}</strong><small>Hạn mức {formatVnd(customer.creditLimit)} · đang nợ {formatVnd(customer.outstandingBalance)}</small></div>}
          {errors.creditLimit && <p className="form-wide-error">{errors.creditLimit}</p>}
        </article>
        <article className="form-card">
          <div className="line-heading"><div><h3>Danh sách hàng hóa</h3><p>{productHint}</p></div><button className="secondary-button" type="button" onClick={addLine}>＋ Thêm dòng</button></div>
          <div className="form-lines">
            {draft.lines.map((line, index) => {
              const product = productById.get(line.itemId);
              const available = validation?.availableByLine[index] ?? 0;
              return <div className="form-line" key={`${line.itemId}-${index}`}>
                <label className="product-input">Sản phẩm
                  <select value={line.itemId} onChange={(event) => chooseProduct(index, event.target.value)}>
                    <option value="">Chọn sản phẩm</option>
                    {selectableProducts.map((item) => {
                      const stockAvailable = availableByItem.get(item.id) ?? 0;
                      const label = item.itemType === "service" ? `${item.sku} - ${item.name} · Dịch vụ` : `${item.sku} - ${item.name} · Còn ${stockAvailable.toLocaleString("vi-VN")} ${item.unit}`;
                      return <option value={item.id} key={item.id} disabled={kind === "order" && item.itemType !== "service" && stockAvailable <= 0}>{label}</option>;
                    })}
                  </select>
                  {product && <small>{product.unit} · {product.itemType === "service" ? "Không quản lý tồn kho" : <>Tồn khả dụng: <strong>{available.toLocaleString("vi-VN")}</strong></>}</small>}
                </label>
                <label>SL<input min="0" step="1" type="number" value={line.quantity} onChange={(event) => updateLine(index, { quantity: Number(event.target.value) })} /></label>
                <label>Đơn giá<input min="0" step="1000" type="number" value={line.unitPrice} onChange={(event) => updateLine(index, { unitPrice: Number(event.target.value) })} /></label>
                <label>Chiết khấu<input min="0" step="1000" type="number" value={line.discountAmount} onChange={(event) => updateLine(index, { discountAmount: Number(event.target.value) })} /></label>
                <div className="line-total"><span>Thành tiền</span><strong>{formatVnd(Math.max(0, line.quantity * line.unitPrice - line.discountAmount))}</strong></div>
                <button className="line-remove" type="button" disabled={draft.lines.length === 1} onClick={() => removeLine(index)} aria-label="Xóa dòng hàng">×</button>
                {errors[`line-${index}`] && <small className="field-error line-error">{errors[`line-${index}`]}</small>}
              </div>;
            })}
          </div>
          {errors.lines && <p className="form-wide-error">{errors.lines}</p>}
        </article>
      </div>
      <aside className="form-summary"><article className="form-card"><h3>Tóm tắt {kindLabel}</h3><div className="summary-row"><span>Tạm tính</span><strong>{formatVnd(subtotal)}</strong></div><div className="summary-row"><span>Thuế GTGT</span><strong>{formatVnd(vatAmount)}</strong></div><div className="summary-row total"><span>Tổng cộng</span><strong>{formatVnd(total)}</strong></div><button className="primary-button" type="submit" disabled={saving}>{saving ? "Đang lưu..." : documentId ? "Lưu thay đổi" : `Tạo ${kindLabel}`}</button><Link className="summary-cancel" to={listPath}>Hủy và quay lại</Link></article></aside>
    </form>
  </section>;
}
