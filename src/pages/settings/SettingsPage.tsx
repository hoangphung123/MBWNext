import { useEffect, useMemo, useState } from "react";
import { useToast } from "../../components/ui/Toast";
import { AccountStatus, PermissionAction, PermissionModule, RolePermissionMap, UserAccess, activeRole, activeScope, activeUser, defaultPermissions, readPermissions, readUsers, setActiveRole, setActiveUser, writePermissions, writeUsers } from "../../lib/accessControl";
import { DEMO_ACCOUNTS } from "../../lib/demoAccounts";
type Permission = PermissionAction;
const modules = ["Bán hàng & CRM", "Mua hàng", "Kho hàng", "Tài chính", "Sản xuất", "Nhân sự", "POS", "Dự án", "Báo cáo"] as PermissionModule[];
const actions: Permission[] = ["Xem", "Tạo", "Sửa", "Duyệt", "Hủy"];
const roles = ["System Admin", "Kinh doanh & CRM", "Mua hàng", "Thủ kho", "Kế toán – Tài chính", "HR / Quản lý nhân sự", "Thu ngân"];
const scopeOptions = [{ value: "Tất cả chi nhánh", label: "Toàn công ty", detail: "Tất cả chi nhánh, kho và phòng ban" }, { value: "Hồ Chí Minh", label: "Chi nhánh · Hồ Chí Minh", detail: "Dữ liệu thuộc chi nhánh Hồ Chí Minh" }, { value: "Kho HCM-MAIN, HCM-RM", label: "Kho · HCM-MAIN, HCM-RM", detail: "Hai kho vật lý được phân công" }, { value: "Cửa hàng Quận 1", label: "Cửa hàng · Quận 1", detail: "Bán hàng tại cửa hàng Quận 1" }, { value: "Phòng ban nhân sự", label: "Phòng ban · Nhân sự", detail: "Dữ liệu nhân sự được ủy quyền" }];
const accountStatusLabels: Record<AccountStatus, string> = { active: "Hoạt động", suspended: "Tạm khóa", invited: "Chưa kích hoạt" };
const roleShortNames: Record<string, string> = { "System Admin": "SA", "Kinh doanh & CRM": "KD", "Mua hàng": "MH", "Thủ kho": "TK", "Kế toán – Tài chính": "KT", "HR / Quản lý nhân sự": "HR", "Thu ngân": "TN" };
const blankRole = () => Object.fromEntries(modules.map((module) => [module, ["Xem"] as Permission[]])) as Record<PermissionModule, Permission[]>;

export function SettingsPage() {
  const [role, setRole] = useState(roles[0]);
  const [previewRole, setPreviewRole] = useState(activeRole());
  const [rolePermissions, setRolePermissions] = useState<RolePermissionMap>(() => ({ ...defaultPermissions(), ...readPermissions() }));
  const [users, setUsers] = useState<UserAccess[]>(readUsers);
  const [savedPermissions, setSavedPermissions] = useState<RolePermissionMap>(() => ({ ...defaultPermissions(), ...readPermissions() }));
  const [savedUsers, setSavedUsers] = useState<UserAccess[]>(readUsers);
  const { showToast } = useToast();
  const permissions = rolePermissions[role] ?? blankRole();
  const assignedPermissions = useMemo(() => Object.values(permissions).reduce((total, permissionList) => total + permissionList.length, 0), [permissions]);
  const dirty = JSON.stringify(rolePermissions) !== JSON.stringify(savedPermissions) || JSON.stringify(users) !== JSON.stringify(savedUsers);
  const activeAccounts = users.filter((user) => user.accountStatus === "active").length;

  useEffect(() => {
    const warnBeforeUnload = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ""; } };
    const warnInternalNavigation = (event: MouseEvent) => {
      if (!dirty || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest("a[href]");
      if (!link || link.getAttribute("target")) return;
      if (!window.confirm("Bạn có thay đổi chưa lưu trong Cài đặt. Rời trang và bỏ các thay đổi này?")) { event.preventDefault(); event.stopImmediatePropagation(); }
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    document.addEventListener("click", warnInternalNavigation, true);
    return () => { window.removeEventListener("beforeunload", warnBeforeUnload); document.removeEventListener("click", warnInternalNavigation, true); };
  }, [dirty]);

  const switchRole = (next: string) => { setRole(next); setRolePermissions((all) => all[next] ? all : { ...all, [next]: blankRole() }); };
  const toggle = (module: PermissionModule, action: Permission) => setRolePermissions((all) => {
    const current = all[role] ?? blankRole(); const currentActions = current[module]; const enabled = currentActions.includes(action);
    const nextActions = action === "Xem" ? (enabled ? [] : ["Xem"]) : (enabled ? currentActions.filter((item) => item !== action) : Array.from(new Set<Permission>(["Xem", ...currentActions, action])));
    return { ...all, [role]: { ...current, [module]: nextActions } };
  });
  const updateUser = (index: number, patch: Partial<UserAccess>) => setUsers((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  const discardChanges = () => { setRolePermissions(savedPermissions); setUsers(savedUsers); showToast("Đã khôi phục cấu hình đã lưu gần nhất.", "info"); };
  const save = () => {
    writePermissions(rolePermissions); writeUsers(users); setSavedPermissions(rolePermissions); setSavedUsers(users);
    const currentUser = activeUser(); const updatedCurrentUser = currentUser && users.find((user) => user.email === currentUser.email);
    if (updatedCurrentUser) {
      setActiveUser(updatedCurrentUser);
      if (updatedCurrentUser.accountStatus !== "active") { window.localStorage.removeItem("mbwnext_demo_session"); window.location.assign("/login"); return; }
      showToast("Đã lưu và áp dụng lại role/phạm vi cho phiên hiện tại.", "success"); window.setTimeout(() => window.location.reload(), 350); return;
    }
    showToast("Đã lưu role, trạng thái tài khoản và phạm vi dữ liệu trong phiên mock.", "success");
  };
  const switchPreview = (next: string) => { setPreviewRole(next); setActiveRole(next); window.location.reload(); };

  return <section className="sales-content settings-page">
    <header className="settings-hero">
      <div className="settings-hero-copy"><p className="eyebrow dark">QUẢN TRỊ HỆ THỐNG</p><h2>Phân quyền &amp; cấu hình</h2><p>Quản lý người dùng, phạm vi dữ liệu và quyền thao tác theo từng vai trò.</p></div>
      <div className="role-preview-card"><span className="role-preview-icon">◉</span><label><small>CHẾ ĐỘ XEM TRƯỚC</small><strong>Mô phỏng giao diện theo role</strong><select aria-label="Role đang mô phỏng" value={previewRole} onChange={(event) => switchPreview(event.target.value)}>{roles.map((item) => <option key={item}>{item}</option>)}</select><em>Phạm vi mô phỏng: {scopeOptions.find((item) => item.value === activeScope())?.label ?? activeScope()}</em></label></div>
    </header>
    <div className="settings-summary" aria-label="Tổng quan cấu hình">
      <article><span className="settings-summary-icon users">♙</span><div><small>NGƯỜI DÙNG</small><strong>{users.length}</strong><p>{activeAccounts} tài khoản đang hoạt động</p></div></article>
      <article><span className="settings-summary-icon roles">⌘</span><div><small>VAI TRÒ</small><strong>{roles.length}</strong><p>Nhóm quyền đang cấu hình</p></div></article>
      <article><span className="settings-summary-icon modules">▦</span><div><small>PHÂN HỆ</small><strong>{modules.length}</strong><p>Phân hệ đã có kiểm soát quyền</p></div></article>
    </div>
    <section className="settings-card">
      <div className="settings-card-heading"><div><span className="section-kicker">01 · NGƯỜI DÙNG</span><h3>Gán role &amp; phạm vi dữ liệu</h3><p>Mỗi tài khoản có một role và phạm vi dữ liệu dùng khi kết nối API.</p></div><span className="settings-status"><i /> Đã đồng bộ mock</span></div>
      <div className="settings-users-list"><div className="settings-users-heading"><span>Người dùng</span><span>Vai trò</span><span>Phạm vi dữ liệu</span><span>Trạng thái</span></div>{users.map((user, index) => {
        const scope = scopeOptions.find((option) => option.value === user.scope) ?? scopeOptions[0];
        const isDemoAccount = DEMO_ACCOUNTS.some((account) => account.email === user.email);
        const status = user.accountStatus ?? "invited";
        return <div className="settings-user-row" key={user.email}>
        <div className="settings-user-profile"><span className="settings-avatar">{user.name.split(" ").slice(-2).map((part) => part[0]).join("")}</span><div><strong>{user.name}</strong><small>{user.email}</small></div></div>
        <label className="settings-select"><span className="mobile-field-label">Vai trò</span><b className="role-pill">{roleShortNames[user.role] ?? "RL"}</b><select aria-label={`Role của ${user.name}`} value={user.role} onChange={(event) => updateUser(index, { role: event.target.value })}>{roles.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="settings-select settings-scope-select"><span className="mobile-field-label">Phạm vi dữ liệu</span><select aria-label={`Phạm vi dữ liệu của ${user.name}`} value={user.scope} onChange={(event) => updateUser(index, { scope: event.target.value })}>{scopeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><small>{scope.detail}</small></label>
        <label className="settings-select settings-account-status"><span className="mobile-field-label">Trạng thái</span><span className={`account-status status-${status}`}>{accountStatusLabels[status]}</span><select aria-label={`Trạng thái tài khoản của ${user.name}`} value={status} disabled={!isDemoAccount && status === "invited"} title={!isDemoAccount && status === "invited" ? "Tài khoản này chưa có thông tin đăng nhập mẫu." : undefined} onChange={(event) => updateUser(index, { accountStatus: event.target.value as AccountStatus })}>{(["active", "suspended", "invited"] as AccountStatus[]).map((item) => <option key={item} value={item}>{accountStatusLabels[item]}</option>)}</select>{!isDemoAccount && status === "invited" && <small className="account-status-note">Chưa có thông tin đăng nhập</small>}</label>
      </div>})}</div>
    </section>
    <section className="settings-card settings-permission-card">
      <div className="settings-card-heading permission-heading"><div><span className="section-kicker">02 · PHÂN QUYỀN</span><h3>Ma trận quyền thao tác</h3><p>Chọn vai trò cần cấu hình, sau đó bật quyền theo từng phân hệ.</p></div><label className="role-config-select"><small>VAI TRÒ ĐANG CẤU HÌNH</small><select value={role} onChange={(event) => switchRole(event.target.value)}>{roles.map((item) => <option key={item}>{item}</option>)}</select></label></div>
      <div className="permission-context"><span className="role-context-avatar">{roleShortNames[role] ?? "RL"}</span><div><strong>{role}</strong><small>Đang có <b>{assignedPermissions}</b> quyền được cấp trên {modules.length} phân hệ.</small></div><span className="permission-context-note">Thay đổi chỉ có hiệu lực sau khi lưu</span></div>
      <div className="permission-table-wrap"><table className="permission-table"><thead><tr><th>Phân hệ</th>{actions.map((action) => <th key={action}>{action}</th>)}</tr></thead><tbody>{modules.map((module) => <tr key={module}><td><strong>{module}</strong><small>{permissions[module].length} quyền đang bật</small></td>{actions.map((action) => <td key={action}><label className="permission-toggle"><input aria-label={`${module} ${action}`} type="checkbox" checked={permissions[module].includes(action)} onChange={() => toggle(module, action)} /><span /></label></td>)}</tr>)}</tbody></table></div>
      <footer className="settings-card-footer"><p><span>ⓘ</span> Bật quyền thao tác sẽ tự bật “Xem”; tắt “Xem” sẽ tắt toàn bộ quyền của phân hệ để tránh cấu hình mâu thuẫn.</p><div className="settings-footer-actions">{dirty && <button className="secondary-button" onClick={discardChanges}>Bỏ thay đổi</button>}<button className="primary-button compact" onClick={save} disabled={!dirty}>Lưu cấu hình phân quyền <span>→</span></button></div></footer>
    </section>
    <div className="settings-info-grid"><article><span className="settings-info-icon">↗</span><div><h3>Luồng phê duyệt</h3><p>Yêu cầu mua đi qua Mua hàng, Kế toán và System Admin trước khi được duyệt.</p><button className="text-button" onClick={() => showToast("Cấu hình chi tiết cấp duyệt sẽ là bước mở rộng tiếp theo.", "info")}>Xem luồng duyệt →</button></div></article><article><span className="settings-info-icon neutral">◌</span><div><h3>Lưu ý về phạm vi</h3><p>Phạm vi hiện được mô phỏng ở FE; backend sẽ dùng nó để lọc dữ liệu đúng người dùng.</p><button className="text-button" onClick={save}>Lưu thay đổi →</button></div></article></div>
  </section>;
}
