import { NavLink, Outlet } from "react-router-dom";

const salesTabs = [
  { to: "/sales", label: "Lead", end: true },
  { to: "/sales/customers", label: "Khách hàng" },
  { to: "/sales/opportunities", label: "Cơ hội" },
  { to: "/sales/pipeline", label: "Pipeline" },
  { to: "/sales/activities", label: "Hoạt động" },
  { to: "/sales/quotations", label: "Báo giá" },
  { to: "/sales/orders", label: "Đơn bán" },
];

export function SalesLayout() {
  return <section className="sales-module"><div className="sales-module-heading"><div><p className="eyebrow dark">BÁN HÀNG & CRM</p><h1>Quản lý tăng trưởng doanh thu</h1><p>Theo dõi hành trình khách hàng từ tiếp nhận lead đến đơn hàng và thanh toán.</p></div></div><nav className="sales-tabs" aria-label="Điều hướng Bán hàng & CRM">{salesTabs.map((tab) => <NavLink end={tab.end} key={tab.to} to={tab.to}>{tab.label}</NavLink>)}</nav><Outlet /></section>;
}
