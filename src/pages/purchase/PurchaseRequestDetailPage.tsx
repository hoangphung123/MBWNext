import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { formatVnd } from "../../data/mockData";
import { PurchaseFormOptions, PurchaseRequest, RequestForQuotation, mockApi } from "../../lib/mockApi";

export function PurchaseRequestDetailPage() {
  const { documentId } = useParams();
  const { showToast } = useToast();
  const [request, setRequest] = useState<PurchaseRequest | null>(null);
  const [rfqs, setRfqs] = useState<RequestForQuotation[]>([]);
  const [options, setOptions] = useState<PurchaseFormOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);

  const load = useCallback(() => { if (!documentId) return; setLoading(true); void Promise.all([mockApi.purchasing.getPurchaseRequest(documentId), mockApi.purchasing.getRfqs(), mockApi.purchasing.getFormOptions()]).then(([requestRow, rfqRows, formOptions]) => { setRequest(requestRow ?? null); setRfqs(rfqRows); setOptions(formOptions); setLoading(false); }); }, [documentId]);
  useEffect(() => { load(); }, [load]);
  const warehouseById = useMemo(() => new Map(options?.warehouses.map((warehouse) => [warehouse.id, warehouse]) ?? []), [options]);
  const relatedRfq = rfqs.find((rfq) => rfq.sourcePurchaseRequestId === request?.id);
  const runAction = async (action: "submit" | "approve" | "rfq") => {
    if (!request) return; setActing(true);
    const result = action === "submit" ? await mockApi.purchasing.submitPurchaseRequest(request.id) : action === "approve" ? await mockApi.purchasing.approvePurchaseRequest(request.id) : await mockApi.purchasing.createRfqFromPurchaseRequest(request.id);
    setActing(false);
    if (!result.entity) { showToast(result.errors.form ?? "Không thể cập nhật yêu cầu mua.", "error"); return; }
    showToast(action === "rfq" ? `${result.entity.documentNo} đã được tạo từ ${request.documentNo}.` : `${request.documentNo} đã được cập nhật.`); load();
  };

  if (loading) return <section className="sales-content"><div className="detail-loading">Đang tải yêu cầu mua...</div></section>;
  if (!request) return <section className="sales-content"><div className="empty-state"><h3>Không tìm thấy yêu cầu mua</h3><Link className="primary-button compact" to="/purchase/requests">Quay lại danh sách</Link></div></section>;
  const warehouse = warehouseById.get(request.warehouseId);
  const isRequiredDatePast = request.requiredDate < "2026-08-29";
  return <section className="sales-content">
    <div className="detail-breadcrumb"><Link to="/purchase/requests">Yêu cầu mua</Link><span>/</span><strong>{request.documentNo}</strong></div>
    <div className="content-heading detail-heading"><div><div className="heading-with-badge"><h2>{request.documentNo}</h2><StatusBadge status={request.status} /></div><p>{request.requestingDepartment} · {warehouse ? `${warehouse.code} - ${warehouse.name}` : request.warehouseId}</p></div><div className="detail-actions"><Link className="secondary-button" to="/purchase/requests">Danh sách</Link>{request.status === "draft" && <Link className="secondary-button" to={`/purchase/requests/${request.id}/edit`}>Chỉnh sửa</Link>}{request.status === "draft" && <button className="primary-button compact" disabled={acting} onClick={() => void runAction("submit")}>Gửi duyệt</button>}{request.status === "pending_approval" && <button className="primary-button compact" disabled={acting} onClick={() => void runAction("approve")}>Duyệt</button>}{request.status === "approved" && !isRequiredDatePast && <button className="primary-button compact" disabled={acting} onClick={() => void runAction("rfq")}>Tạo RFQ</button>}</div></div>
    <div className="order-overview-grid"><article className="detail-card"><span>Người yêu cầu</span><strong>{request.requestedBy}</strong><p>{request.requestingDepartment}</p></article><article className="detail-card"><span>Thời hạn cần hàng</span><strong>{new Date(request.requiredDate).toLocaleDateString("vi-VN")}</strong><p>Ngày yêu cầu {new Date(request.requestDate).toLocaleDateString("vi-VN")}</p></article><article className="detail-card amount-card"><span>Giá trị ước tính</span><strong>{formatVnd(request.estimatedAmount)}</strong><p>{request.lines.length} dòng hàng cần mua</p></article></div>
    <article className="detail-section"><div className="section-heading"><div><h3>Hàng hóa đề nghị mua</h3><p>Đây là số lượng và đơn giá dự kiến tại thời điểm lập yêu cầu.</p></div></div><div className="table-wrap"><table className="data-table purchase-detail-table"><thead><tr><th>Hàng hóa</th><th className="text-right">Số lượng</th><th className="text-right">Đơn giá dự kiến</th><th className="text-right">Ước tính</th></tr></thead><tbody>{request.lines.map((line) => <tr key={line.id}><td><div className="cell-main"><strong>{line.description}</strong><span>{line.unit}</span></div></td><td className="text-right">{line.quantity.toLocaleString("vi-VN")}</td><td className="text-right">{formatVnd(line.unitPrice)}</td><td className="text-right">{formatVnd(line.lineTotal)}</td></tr>)}</tbody></table></div></article>
    <article className="detail-section"><div className="section-heading"><div><h3>Luồng xử lý và chứng từ liên quan</h3><p>Theo dõi rõ yêu cầu này đang ở bước nào và đã sinh chứng từ nào.</p></div></div>{relatedRfq ? <div className="transaction-row"><span className="transaction-icon">→</span><div><strong>Đã tạo RFQ <Link className="reference-button" to="/purchase/rfqs">{relatedRfq.documentNo}</Link></strong><span>Hạn nhận báo giá {new Date(relatedRfq.deadline).toLocaleDateString("vi-VN")} · {relatedRfq.lines.length} dòng hàng</span></div><StatusBadge status={relatedRfq.status} /></div> : <p className="inline-empty">{request.status === "draft" ? "Yêu cầu đang là nháp: có thể chỉnh sửa hoặc gửi duyệt." : request.status === "pending_approval" ? "Yêu cầu đang chờ phê duyệt trước khi tạo RFQ." : isRequiredDatePast ? "Ngày cần hàng đã qua, nên không thể mở RFQ mới từ yêu cầu này." : "Yêu cầu đã duyệt: có thể tạo RFQ để mời báo giá nhà cung cấp."}</p>}</article>
  </section>;
}
