import { useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/Toast";
import { formatVnd } from "../data/mockData";
import { DashboardOverview, mockApi } from "../lib/mockApi";

function metricIcon(key: string) { return { revenue: "↗", grossProfit: "◈", openSalesOrders: "□", lowStockItems: "!", receivables: "₫" }[key] ?? "•"; }

function DashboardSkeleton() {
  return <section className="dashboard-page" aria-label="Đang tải dữ liệu tổng quan"><div className="skeleton heading-skeleton" /><div className="skeleton-grid">{Array.from({ length: 5 }, (_, index) => <div className="skeleton metric-skeleton" key={index} />)}</div><div className="skeleton-grid large"><div className="skeleton panel-skeleton" /><div className="skeleton panel-skeleton" /></div></section>;
}

export function HomePage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [pendingApproval, setPendingApproval] = useState<DashboardOverview["approvals"][number] | null>(null);
  const { showToast } = useToast();

  useEffect(() => { let mounted = true; mockApi.dashboard.getOverview().then((response) => mounted && setOverview(response)); return () => { mounted = false; }; }, []);
  const maxRevenue = useMemo(() => overview ? Math.max(...overview.revenueByDay.map((point) => point.sales), ...overview.revenueByDay.map((point) => point.target)) : 1, [overview]);
  if (!overview) return <DashboardSkeleton />;

  const approve = () => {
    if (!pendingApproval) return;
    showToast(`${pendingApproval.documentNo} đã được phê duyệt.`);
    setPendingApproval(null);
  };

  return <section className="dashboard-page">
    <div className="page-heading"><div><p className="eyebrow dark">TỔNG QUAN VẬN HÀNH</p><h1>Chào buổi sáng, Ngọc <span>👋</span></h1><p>Dưới đây là tình hình kinh doanh của An Phú Việt hôm nay.</p></div><div className="page-actions"><button className="secondary-button">{overview.period.label} <span>⌄</span></button><button className="primary-button compact" onClick={() => showToast("Biểu mẫu tạo chứng từ sẽ được triển khai cùng các phân hệ.", "info")}>＋ Tạo mới</button></div></div>
    <div className="metric-grid">{overview.metrics.map((metric) => { const favorable = metric.key === "lowStockItems" ? metric.trend === "down" : metric.trend === "up"; return <article className="metric-card" key={metric.key}><div className="metric-top"><span>{metric.label}</span><span className={`metric-icon ${metric.key}`}>{metricIcon(metric.key)}</span></div><strong>{metric.format === "currency" ? formatVnd(metric.value) : metric.value.toLocaleString("vi-VN")}</strong><div className={`metric-trend ${favorable ? "positive" : "negative"}`}><b>{metric.trend === "up" ? "↗" : "↘"} {Math.abs(metric.trendPercent).toLocaleString("vi-VN")} %</b><span>so với tháng trước</span></div></article>; })}</div>
    <div className="dashboard-grid main-grid"><article className="panel revenue-panel"><div className="panel-heading"><div><h2>Doanh thu theo ngày</h2><p>So sánh với mục tiêu doanh thu</p></div><button className="text-button" onClick={() => showToast("Báo cáo chi tiết sẽ có trong phân hệ Báo cáo.", "info")}>Xem báo cáo →</button></div><div className="chart-legend"><span><i className="sales-key" />Thực tế</span><span><i className="target-key" />Mục tiêu</span></div><div className="bar-chart" aria-label="Biểu đồ doanh thu năm ngày gần nhất">{overview.revenueByDay.map((point) => <div className="bar-group" key={point.date}><div className="bars"><div className="bar target" style={{ height: `${(point.target / maxRevenue) * 100}%` }} /><div className="bar sales" style={{ height: `${(point.sales / maxRevenue) * 100}%` }} title={formatVnd(point.sales)} /></div><span>{point.date.slice(8, 10)}/08</span></div>)}</div></article><article className="panel channel-panel"><div className="panel-heading"><div><h2>Doanh thu theo kênh</h2><p>Phân bổ trong {overview.period.label}</p></div><button className="more-button" aria-label="Tùy chọn khác">•••</button></div><div className="channel-donut"><div className="donut"><div><strong>1,25 tỷ</strong><span>Doanh thu</span></div></div></div><div className="channel-list">{overview.salesByChannel.map((channel, index) => <div key={channel.channel}><span><i className={`channel-dot dot-${index + 1}`} />{channel.channel}</span><strong>{channel.percentage.toLocaleString("vi-VN")} %</strong></div>)}</div></article></div>
    <div className="dashboard-grid lower-grid"><article className="panel approval-panel"><div className="panel-heading"><div><h2>Chờ phê duyệt</h2><p>{overview.approvals.length} chứng từ cần xử lý</p></div><button className="text-button" onClick={() => showToast("Danh sách phê duyệt chi tiết sẽ được xây dựng ở phân hệ workflow.", "info")}>Xem tất cả →</button></div><div className="approval-list">{overview.approvals.map((approval) => <div className="approval-row" key={approval.id}><div className="document-badge">▤</div><div className="approval-main"><strong>{approval.title}</strong><span>{approval.documentNo} · {approval.requestedBy}</span></div><div className="approval-value"><strong>{formatVnd(approval.amount)}</strong><span>Bước {approval.currentStep}/{approval.totalSteps}</span></div><button className="approve-button" onClick={() => setPendingApproval(approval)}>Duyệt</button></div>)}</div></article><article className="panel alert-panel"><div className="panel-heading"><div><h2>Cảnh báo tồn kho</h2><p>Cần xử lý sớm để đảm bảo vận hành</p></div><button className="more-button" aria-label="Tùy chọn khác">•••</button></div><div className="stock-alerts">{overview.lowStockAlerts.map((alert) => <div className="stock-alert" key={alert.itemId}><span className={`alert-symbol ${alert.severity}`}>!</span><div><strong>{alert.itemName}</strong><span>Còn {alert.onHand.toLocaleString("vi-VN")} · thiếu {alert.shortage.toLocaleString("vi-VN")}</span></div><button onClick={() => showToast(`Đã tạo yêu cầu mua hàng nháp cho ${alert.itemName}.`)}>Tạo PR</button></div>)}</div></article></div>
    <article className="panel activity-panel"><div className="panel-heading"><div><h2>Hoạt động gần đây</h2><p>Thay đổi mới nhất trên hệ thống</p></div></div><div className="activity-list">{overview.recentActivities.map((activity) => <div className="activity-row" key={activity.id}><span className="activity-dot" /><div><strong>{activity.actor}</strong> {activity.action} <button className="reference-button" onClick={() => showToast(`Đã chọn chứng từ ${activity.reference}.`, "info")}>{activity.reference}</button></div><time>{activity.at.slice(11, 16)}</time></div>)}</div></article>
    <ConfirmDialog isOpen={Boolean(pendingApproval)} title="Xác nhận phê duyệt" description={pendingApproval ? <>Bạn có muốn phê duyệt <strong>{pendingApproval.documentNo}</strong> với giá trị <strong>{formatVnd(pendingApproval.amount)}</strong>?</> : ""} confirmLabel="Phê duyệt" onClose={() => setPendingApproval(null)} onConfirm={approve} />
  </section>;
}
