import { NavLink, Outlet } from "react-router-dom";

const tabs = [
  { to: "/purchase/requests", label: "Yêu cầu mua" },
  { to: "/purchase/rfqs", label: "RFQ" },
  { to: "/purchase/supplier-quotations", label: "Báo giá NCC" },
  { to: "/purchase/orders", label: "Đơn mua" },
  { to: "/purchase/receipts", label: "Nhập kho" },
  { to: "/purchase/invoices", label: "Hóa đơn mua" },
  { to: "/purchase/payments", label: "Thanh toán NCC" },
];

export function PurchaseLayout() {
  return <section className="sales-module"><div className="sales-module-heading"><div><p className="eyebrow dark">MUA HÀNG & KHO</p><h1>Kiểm soát cung ứng và tồn kho</h1><p>Đi từ yêu cầu mua, mời báo giá, đặt hàng, nhận kho đến hóa đơn phải trả nhà cung cấp.</p></div></div><nav className="sales-tabs" aria-label="Điều hướng Mua hàng">{tabs.map((tab) => <NavLink key={tab.to} to={tab.to}>{tab.label}</NavLink>)}</nav><Outlet /></section>;
}
