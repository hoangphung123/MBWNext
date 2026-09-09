import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "../../components/ui/EmptyState";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { formatVnd } from "../../data/mockData";
import { Customer360, mockApi } from "../../lib/mockApi";
import { CrmActivityFormModal } from "./CrmActivityFormModal";

const activityIcon: Record<string, string> = { call: "☎", email: "✉", meeting: "◫", task: "✓", note: "•" };
const activityType: Record<string, string> = { call: "Cuộc gọi", email: "Email", meeting: "Cuộc họp", task: "Công việc", note: "Ghi chú" };

export function Customer360Page() {
  const { customerId = "" } = useParams();
  const [detail, setDetail] = useState<Customer360 | null | undefined>(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const { showToast } = useToast();
  const load = useCallback(() => { void mockApi.sales.getCustomer360(customerId).then(setDetail); }, [customerId]);
  useEffect(() => { load(); }, [load]);

  if (detail === null) return <section className="sales-content"><div className="detail-loading">Đang tải Customer 360...</div></section>;
  if (!detail) return <section className="sales-content"><EmptyState title="Không tìm thấy khách hàng" description="Khách hàng không còn tồn tại hoặc đã bị xóa." actionLabel="Quay lại khách hàng" onAction={() => window.history.back()} /></section>;

  const creditUsage = detail.customer.creditLimit > 0 ? Math.min(100, Math.round(detail.customer.outstandingBalance / detail.customer.creditLimit * 100)) : 0;
  return <section className="sales-content customer-360-page">
    <div className="detail-breadcrumb"><Link to="/sales/customers">Khách hàng</Link><span>/</span><strong>{detail.customer.code}</strong></div>
    <div className="content-heading detail-heading"><div><div className="heading-with-badge"><h2>{detail.customer.name}</h2><StatusBadge status={detail.customer.status} /></div><p>{detail.customer.code} · MST {detail.customer.taxCode}</p></div><div className="detail-actions"><button className="primary-button compact" onClick={() => setActivityOpen(true)}>＋ Tạo hoạt động</button></div></div>
    <div className="customer-overview-grid">
      <article className="detail-card"><span>Liên hệ</span><strong>{detail.customer.phone}</strong><p>{detail.customer.email}<br />{detail.customer.address}</p></article>
      <article className="detail-card"><span>Công nợ / hạn mức</span><strong>{formatVnd(detail.customer.outstandingBalance)}</strong><p>Hạn mức {formatVnd(detail.customer.creditLimit)} · Đã sử dụng {creditUsage}%<br />Điều khoản thanh toán {detail.customer.paymentTermDays} ngày</p></article>
      <article className="detail-card amount-card"><span>Doanh thu đã thu</span><strong>{formatVnd(detail.summary.paidAmount)}</strong><p>Đã xuất hóa đơn {formatVnd(detail.summary.invoicedAmount)}<br />Đơn bán lũy kế {formatVnd(detail.summary.orderAmount)}</p></article>
      <article className="detail-card"><span>Cơ hội đang mở</span><strong>{formatVnd(detail.summary.openOpportunityAmount)}</strong><p>{detail.opportunities.filter((opportunity) => opportunity.status === "open").length} cơ hội đang theo dõi · Báo giá {formatVnd(detail.summary.quotationAmount)}</p></article>
    </div>
    <div className="customer-360-grid">
      <article className="detail-section"><div className="section-heading"><div><h3>Hoạt động & chăm sóc</h3><p>Lịch sử giao tiếp gắn trực tiếp hoặc qua cơ hội của khách hàng.</p></div><button className="secondary-button" onClick={() => setActivityOpen(true)}>Tạo hoạt động</button></div>{detail.activities.length ? <div className="transaction-list">{detail.activities.map((activity) => <div className="transaction-row customer-activity-row" key={activity.id}><span className={`transaction-icon crm-${activity.type}`}>{activityIcon[activity.type]}</span><div><strong>{activity.subject}</strong><span>{activityType[activity.type]} · {new Date(activity.scheduledAt).toLocaleDateString("vi-VN")} · {activity.result ?? activity.cancellationReason ?? activity.description ?? "Chưa có kết quả"}</span></div><StatusBadge status={activity.status} /></div>)}</div> : <p className="inline-empty">Chưa có hoạt động. Tạo lịch chăm sóc để giữ mạch trao đổi với khách hàng.</p>}</article>
      <article className="detail-section"><div className="section-heading"><div><h3>Cơ hội bán hàng</h3><p>Cơ hội đã gắn với khách hàng này.</p></div><Link className="secondary-button" to="/sales/opportunities">Mở Pipeline</Link></div>{detail.opportunities.length ? <div className="transaction-list">{detail.opportunities.map((opportunity) => <div className="transaction-row" key={opportunity.id}><span className="transaction-icon">◒</span><div><strong>{opportunity.name}</strong><span>{opportunity.code} · Chốt dự kiến {new Date(opportunity.expectedCloseDate).toLocaleDateString("vi-VN")} · {formatVnd(opportunity.expectedValue)}</span></div><StatusBadge status={opportunity.stage} /></div>)}</div> : <p className="inline-empty">Chưa có cơ hội gắn với khách hàng.</p>}</article>
    </div>
    <div className="customer-360-grid">
      <article className="detail-section"><div className="section-heading"><div><h3>Đơn bán & báo giá</h3><p>Chứng từ thương mại đã phát sinh.</p></div></div>{detail.quotations.length + detail.orders.length ? <div className="transaction-list">{detail.quotations.map((quotation) => <div className="transaction-row" key={quotation.id}><span className="transaction-icon">▤</span><div><strong>{quotation.documentNo}</strong><span>Báo giá · {formatVnd(quotation.totalAmount)} · {new Date(quotation.documentDate).toLocaleDateString("vi-VN")}</span></div><StatusBadge status={quotation.status} /></div>)}{detail.orders.map((order) => <div className="transaction-row" key={order.id}><span className="transaction-icon">▣</span><div><Link className="reference-button" to={`/sales/orders/${order.id}`}>{order.documentNo}</Link><span>Đơn bán · {formatVnd(order.totalAmount)} · Còn phải thu {formatVnd(order.balanceAmount)}</span></div><StatusBadge status={order.status} /></div>)}</div> : <p className="inline-empty">Chưa có báo giá hoặc đơn bán.</p>}</article>
      <article className="detail-section"><div className="section-heading"><div><h3>Hóa đơn & thanh toán</h3><p>Công nợ của khách hàng.</p></div></div>{detail.invoices.length ? <div className="transaction-list">{detail.invoices.map((invoice) => <div className="transaction-row" key={invoice.id}><span className="transaction-icon finance">₫</span><div><strong>{invoice.documentNo}</strong><span>Hóa đơn {formatVnd(invoice.totalAmount)} · Còn {formatVnd(invoice.balanceAmount)} · Hạn {new Date(invoice.dueDate).toLocaleDateString("vi-VN")}</span></div><StatusBadge status={invoice.status} /></div>)}{detail.payments.length > 0 && <div className="payment-history"><strong>Thanh toán đã ghi nhận</strong>{detail.payments.map((payment) => <span key={payment.id}>{payment.paymentNo} · {formatVnd(payment.totalAmount)} · {payment.methodName}</span>)}</div>}</div> : <p className="inline-empty">Chưa có hóa đơn bán hàng.</p>}</article>
    </div>
    <CrmActivityFormModal isOpen={activityOpen} onClose={() => setActivityOpen(false)} initialCustomerId={detail.customer.id} onSaved={(activity) => { showToast(`Đã lên lịch: ${activity.subject}`); load(); }} />
  </section>;
}
