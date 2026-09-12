import { CSSProperties, useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/Toast";
import { formatVnd } from "../data/mockData";
import { DashboardOverview, mockApi } from "../lib/mockApi";

const metricIcons: Record<string, string> = { revenue: "↗", grossProfit: "◈", openSalesOrders: "□", lowStockItems: "!", receivables: "₫" };
const sparkline = [38, 52, 44, 68, 57, 78, 92];

function DashboardSkeleton() {
  return <section className="dashboard-page command-center" aria-label="Đang tải dữ liệu tổng quan"><div className="skeleton command-skeleton-hero" /><div className="skeleton-grid command-skeleton-grid">{Array.from({ length: 5 }, (_, index) => <div className="skeleton metric-skeleton" key={index} />)}</div><div className="skeleton-grid large"><div className="skeleton panel-skeleton" /><div className="skeleton panel-skeleton" /></div></section>;
}

export function HomePage() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [pendingApproval, setPendingApproval] = useState<DashboardOverview["approvals"][number] | null>(null);
  const { showToast } = useToast();

  useEffect(() => { let mounted = true; mockApi.dashboard.getOverview().then((response) => mounted && setOverview(response)); return () => { mounted = false; }; }, []);
  const maxRevenue = useMemo(() => overview ? Math.max(...overview.revenueByDay.map((point) => point.sales), ...overview.revenueByDay.map((point) => point.target)) : 1, [overview]);
  const revenueProgress = useMemo(() => { if (!overview) return 0; const actual = overview.revenueByDay.reduce((sum, point) => sum + point.sales, 0); const target = overview.revenueByDay.reduce((sum, point) => sum + point.target, 0); return Math.min(100, Math.round((actual / target) * 100)); }, [overview]);
  if (!overview) return <DashboardSkeleton />;

  const revenueMetric = overview.metrics.find((metric) => metric.key === "revenue");
  const gaugeStyle = { "--gauge-progress": `${revenueProgress * 3.6}deg` } as CSSProperties & Record<string, string>;
  const approve = () => { if (!pendingApproval) return; showToast(`${pendingApproval.documentNo} đã được phê duyệt.`); setPendingApproval(null); };

  return <section className="dashboard-page command-center">
    <section className="command-hero" aria-label="Tình hình vận hành hôm nay">
      <div className="command-aurora aurora-one" /><div className="command-aurora aurora-two" />
      <div className="command-hero-copy"><p className="command-kicker"><i /> TRUNG TÂM ĐIỀU HÀNH</p><h1>Một ngày vận hành<br /><span>rõ ràng hơn.</span></h1><p>Chào Ngọc, đây là các tín hiệu quan trọng giúp An Phú Việt vận hành chủ động hôm nay.</p><div className="command-live-row"><span><i className="live-dot" /> Đồng bộ dữ liệu</span><span>•</span><span>Cập nhật lúc 09:12</span></div></div>
      <div className="command-hero-actions"><button className="command-period-button">{overview.period.label} <span>⌄</span></button><button className="command-create-button" onClick={() => showToast("Biểu mẫu tạo chứng từ sẽ được triển khai cùng các phân hệ.", "info")}>＋ Tạo mới</button></div>
      <div className="command-hero-insight"><div className="command-gauge" style={gaugeStyle}><div><strong>{revenueProgress}%</strong><span>mục tiêu</span></div></div><div><span className="hero-insight-label">HIỆU SUẤT DOANH THU</span><strong>{revenueMetric ? formatVnd(revenueMetric.value) : "—"}</strong><small><b>↗ 12,55%</b> so với tháng trước</small></div></div>
    </section>

    <section className="command-priority-strip" aria-label="Điểm cần ưu tiên">
      <div className="priority-intro"><span className="priority-icon">✦</span><div><strong>Nhịp vận hành hôm nay</strong><small>Tập trung vào việc có ảnh hưởng lớn nhất</small></div></div>
      <div className="priority-item priority-violet"><span>{overview.approvals.length}</span><div><strong>Chứng từ chờ duyệt</strong><small>Cần quyết định trong hôm nay</small></div><b>→</b></div>
      <div className="priority-item priority-amber"><span>{overview.lowStockAlerts.length}</span><div><strong>Cảnh báo tồn kho</strong><small>Cần tạo yêu cầu mua hàng</small></div><b>→</b></div>
      <div className="priority-item priority-blue"><span>{overview.metrics.find((metric) => metric.key === "openSalesOrders")?.value ?? 0}</span><div><strong>Đơn bán đang xử lý</strong><small>Theo dõi tiến độ giao hàng</small></div><b>→</b></div>
    </section>

    <section className="command-metrics" aria-label="Chỉ số vận hành">
      {overview.metrics.map((metric, index) => { const favorable = metric.key === "lowStockItems" ? metric.trend === "down" : metric.trend === "up"; return <article className={`command-metric metric-${metric.key}`} key={metric.key}><div className="command-metric-head"><span>{metric.label}</span><i>{metricIcons[metric.key] ?? "•"}</i></div><strong>{metric.format === "currency" ? formatVnd(metric.value) : metric.value.toLocaleString("vi-VN")}</strong><div className={`command-trend ${favorable ? "positive" : "negative"}`}><b>{metric.trend === "up" ? "↗" : "↘"} {Math.abs(metric.trendPercent).toLocaleString("vi-VN")}%</b><span> so với tháng trước</span></div><div className="metric-spark" aria-hidden="true">{sparkline.map((height, barIndex) => <i key={barIndex} style={{ height: `${Math.max(24, height - index * 4)}%` }} />)}</div></article>; })}
    </section>

    <section className="command-primary-grid">
      <article className="command-panel revenue-command-panel"><header className="command-panel-heading"><div><p>DOANH THU</p><h2>Nhịp tăng trưởng</h2><span>Thực tế và kế hoạch 5 ngày gần nhất</span></div><button className="panel-link-button" onClick={() => showToast("Báo cáo chi tiết sẽ có trong phân hệ Báo cáo.", "info")}>Xem báo cáo <b>↗</b></button></header><div className="revenue-command-summary"><div><span>Thực tế</span><strong>{formatVnd(overview.revenueByDay.reduce((sum, point) => sum + point.sales, 0))}</strong></div><div><span>Mục tiêu</span><strong>{formatVnd(overview.revenueByDay.reduce((sum, point) => sum + point.target, 0))}</strong></div><span className="revenue-positive">+12,55%</span></div><div className="command-chart-legend"><span><i />Thực tế</span><span><i />Mục tiêu</span></div><div className="command-bar-chart" aria-label="Biểu đồ doanh thu năm ngày gần nhất">{overview.revenueByDay.map((point) => <div className="command-bar-group" key={point.date}><div className="command-bars"><i className="command-bar-target" style={{ height: `${(point.target / maxRevenue) * 100}%` }} /><i className="command-bar-sales" style={{ height: `${(point.sales / maxRevenue) * 100}%` }} title={formatVnd(point.sales)} /></div><span>{point.date.slice(8, 10)}/08</span></div>)}</div></article>
      <article className="command-panel channel-command-panel"><header className="command-panel-heading"><div><p>PHÂN BỔ KÊNH</p><h2>Dòng tiền đến từ đâu?</h2><span>{overview.period.label}</span></div><button className="more-button" aria-label="Tùy chọn khác">•••</button></header><div className="channel-command-body"><div className="command-donut"><div><strong>1,25</strong><span>tỷ VNĐ</span></div></div><div className="channel-command-list">{overview.salesByChannel.map((channel, index) => <div key={channel.channel}><span><i className={`channel-mark mark-${index + 1}`} />{channel.channel}</span><strong>{channel.percentage.toLocaleString("vi-VN")}%</strong><small><b style={{ width: `${channel.percentage}%` }} /></small></div>)}</div></div></article>
    </section>

    <section className="command-secondary-grid">
      <article className="command-panel work-command-panel"><header className="command-panel-heading"><div><p>HÀNG ĐỢI QUYẾT ĐỊNH</p><h2>Cần bạn xử lý</h2><span>{overview.approvals.length} chứng từ đang ở bước phê duyệt</span></div><button className="panel-link-button" onClick={() => showToast("Danh sách phê duyệt chi tiết sẽ được xây dựng ở phân hệ workflow.", "info")}>Mở hàng đợi <b>→</b></button></header><div className="command-approval-list">{overview.approvals.map((approval, index) => <div className="command-approval-card" key={approval.id}><span className={`approval-number approval-${index + 1}`}>0{index + 1}</span><div><strong>{approval.title}</strong><small>{approval.documentNo} · {approval.requestedBy}</small></div><b>{formatVnd(approval.amount)}</b><button onClick={() => setPendingApproval(approval)}>Duyệt <span>→</span></button></div>)}</div></article>
      <article className="command-panel stock-command-panel"><header className="command-panel-heading"><div><p>NGUY CƠ VẬN HÀNH</p><h2>Cảnh báo kho</h2><span>Chủ động bổ sung trước khi gián đoạn</span></div><span className="stock-status-dot">{overview.lowStockAlerts.length}</span></header><div className="command-stock-list">{overview.lowStockAlerts.map((alert) => <div className="command-stock-row" key={alert.itemId}><span className={`stock-symbol ${alert.severity}`}>!</span><div><strong>{alert.itemName}</strong><small>Còn <b>{alert.onHand.toLocaleString("vi-VN")}</b> · Thiếu <b>{alert.shortage.toLocaleString("vi-VN")}</b></small><i><b style={{ width: `${Math.min(100, (alert.onHand / (alert.onHand + alert.shortage)) * 100)}%` }} /></i></div><button onClick={() => showToast(`Đã tạo yêu cầu mua hàng nháp cho ${alert.itemName}.`)}>Tạo PR</button></div>)}</div></article>
    </section>

    <article className="command-activity-panel"><header className="command-panel-heading"><div><p>DÒNG THỜI GIAN VẬN HÀNH</p><h2>Hoạt động mới nhất</h2></div><span className="activity-caption">Theo dõi thay đổi xuyên suốt hệ thống</span></header><div className="command-activity-list">{overview.recentActivities.map((activity, index) => <div className="command-activity-row" key={activity.id}><span className={`activity-rail rail-${index + 1}`} /><div className="activity-avatar">{activity.actor.split(" ").map((part) => part[0]).slice(-2).join("")}</div><p><strong>{activity.actor}</strong> {activity.action} <button onClick={() => showToast(`Đã chọn chứng từ ${activity.reference}.`, "info")}>{activity.reference}</button></p><time>{activity.at.slice(11, 16)}</time></div>)}</div></article>
    <ConfirmDialog isOpen={Boolean(pendingApproval)} title="Xác nhận phê duyệt" description={pendingApproval ? <>Bạn có muốn phê duyệt <strong>{pendingApproval.documentNo}</strong> với giá trị <strong>{formatVnd(pendingApproval.amount)}</strong>?</> : ""} confirmLabel="Phê duyệt" onClose={() => setPendingApproval(null)} onConfirm={approve} />
  </section>;
}
