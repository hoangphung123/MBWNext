import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { navigationItems, systemItems } from "../app/navigation";
import { mbwNextMockData } from "../data/mockData";
import { useToast } from "./ui/Toast";
import { activeEmployeeId, activeRole, activeUser, can, isSystemAdministrator, PermissionModule, resetActiveRole } from "../lib/accessControl";

const data = mbwNextMockData as any;
function Brand({ light = false }: { light?: boolean }) { return <div className={`brand ${light ? "brand-light" : ""}`} aria-label="MBWNext"><span className="brand-mark">MBW</span><span className="brand-divider" /><span className="brand-name">Next</span></div>; }

export function AppShell({ onSignOut }: { onSignOut: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const sessionUser = activeUser();
  const currentUserName = sessionUser?.name ?? (data.auth.currentUser as { fullName: string }).fullName;
  const signOut = () => { resetActiveRole(); onSignOut(); navigate("/login", { replace: true }); };
  const moduleForPath: Record<string, PermissionModule | undefined> = { "/sales": "Bán hàng & CRM", "/purchase": "Mua hàng", "/inventory": "Kho hàng", "/finance": "Tài chính", "/manufacturing": "Sản xuất", "/hr": "Nhân sự", "/pos": "POS", "/projects": "Dự án", "/reports": "Báo cáo" };
  const role = activeRole();
  const canManageSettings = isSystemAdministrator();
  const canManageHr = can(role, "Nhân sự", "Duyệt");
  useEffect(() => { if (location.pathname.startsWith("/settings") && !canManageSettings) { showToast("Chỉ System Admin được truy cập Cài đặt hệ thống.", "error"); navigate("/app", { replace: true }); return; } const path = Object.keys(moduleForPath).find((key) => location.pathname.startsWith(key)); const module = path ? moduleForPath[path] : undefined; if (module && !can(role, module, "Xem")) { showToast(`Role ${role} không có quyền xem ${module}.`, "error"); navigate("/app", { replace: true }); } }, [canManageSettings, location.pathname, navigate, role, showToast]);
  return <div className={`app-shell ${sidebarOpen ? "sidebar-open" : "sidebar-collapsed"}`}>
    <aside className="sidebar"><div className="sidebar-brand"><Brand light /></div><div className="workspace-select"><span className="workspace-avatar">AP</span><div><strong>An Phú Việt</strong><small>{role}</small></div><span className="caret">⌄</span></div><nav aria-label="Điều hướng chính"><p className="nav-group-label">VẬN HÀNH</p>{navigationItems.filter((item) => (item.to !== "/attendance" || !canManageSettings) && (item.to !== "/hr" || !activeEmployeeId() || canManageHr) && (!moduleForPath[item.to] || can(role, moduleForPath[item.to]!, "Xem"))).map((item) => <NavLink end={item.end} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} key={item.to} to={item.to}><span className="nav-icon">{item.icon}</span><span>{item.label}</span></NavLink>)}<p className="nav-group-label nav-group-second">HỆ THỐNG</p>{systemItems.filter((item) => (item.to !== "/settings" || canManageSettings) && (!moduleForPath[item.to] || can(role, moduleForPath[item.to]!, "Xem"))).map((item) => <NavLink className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} key={item.to} to={item.to}><span className="nav-icon">{item.icon}</span><span>{item.label}</span></NavLink>)}</nav><div className="sidebar-bottom"><button className="logout-button" onClick={signOut}><span>↪</span> Đăng xuất</button><div className="sidebar-footer"><span className="online-dot" /> Hệ thống hoạt động ổn định</div></div></aside>
    <main className="main-content"><header className="topbar"><button className="icon-button menu-button" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Đóng hoặc mở thanh điều hướng">☰</button><div className="global-search"><span>⌕</span><input aria-label="Tìm kiếm" placeholder="Tìm chứng từ, khách hàng, sản phẩm..." /><kbd>⌘ K</kbd></div><div className="topbar-actions"><button className="icon-button notification-button" onClick={() => showToast("Bạn có 2 chứng từ đang chờ phê duyệt.", "info")} aria-label="Thông báo">♧<i>2</i></button><button className="profile-button" onClick={() => navigate("/me")}><span className="user-avatar" aria-hidden="true">{currentUserName.split(" ").map((part) => part[0]).slice(-2).join("")}</span><span><strong>{currentUserName}</strong><small>{role}</small></span><b>⌄</b></button></div></header><Outlet /></main>
  </div>;
}
