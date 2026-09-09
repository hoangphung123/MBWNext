import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { activeEmployeeId, activeRole, activeUser, isSystemAdministrator } from "../../lib/accessControl";
import { EmployeeSelfServiceOverview, mockApi } from "../../lib/mockApi";

const formatDate = (value?: string) => value ? new Date(`${value}T00:00:00`).toLocaleDateString("vi-VN", { day: "2-digit", month: "long", year: "numeric" }) : "—";
const initials = (name: string) => name.split(" ").filter(Boolean).slice(-2).map((part) => part[0]).join("").toUpperCase();
const personalDirectory: Record<string, { phone: string; location: string; manager: string; workMode: string }> = {
  "sales@anphuviet.vn": { phone: "0901 234 820", location: "Văn phòng Hồ Chí Minh", manager: "Nguyễn Hoàng Ngọc", workMode: "Làm việc tại văn phòng" },
  "purchase@anphuviet.vn": { phone: "0901 234 821", location: "Văn phòng Hồ Chí Minh", manager: "Nguyễn Hoàng Ngọc", workMode: "Làm việc tại văn phòng" },
  "warehouse@anphuviet.vn": { phone: "0901 234 822", location: "Kho HCM-MAIN", manager: "Phạm Thu Hà", workMode: "Làm việc tại kho" },
  "finance@anphuviet.vn": { phone: "0901 234 823", location: "Văn phòng Hồ Chí Minh", manager: "Nguyễn Hoàng Ngọc", workMode: "Làm việc tại văn phòng" },
  "hr@anphuviet.vn": { phone: "0901 234 824", location: "Văn phòng Hồ Chí Minh", manager: "Nguyễn Hoàng Ngọc", workMode: "Làm việc tại văn phòng" },
  "cashier@anphuviet.vn": { phone: "0901 234 825", location: "Cửa hàng Quận 1", manager: "Trần Minh Anh", workMode: "Làm việc theo ca" },
  "employee@anphuviet.vn": { phone: "0901 234 826", location: "Kho HCM-MAIN", manager: "Lê Quốc Huy", workMode: "Làm việc tại kho" },
};

function InfoRow({ label, value }: { label: string; value: string }) { return <div className="personal-info-row"><span>{label}</span><strong>{value}</strong></div>; }

export function PersonalProfilePage() {
  const user = activeUser(); const navigate = useNavigate(); const employeeId = activeEmployeeId(); const systemAdmin = isSystemAdministrator();
  const [employeeOverview, setEmployeeOverview] = useState<EmployeeSelfServiceOverview | null | undefined>(employeeId ? undefined : null);
  useEffect(() => { if (!employeeId) { setEmployeeOverview(null); return; } void mockApi.hr.getSelfServiceOverview().then((data) => setEmployeeOverview(data ?? null)); }, [employeeId]);
  const name = employeeOverview?.employee.fullName ?? user?.name ?? "Tài khoản MBWNext";
  const email = employeeOverview?.employee.email ?? user?.email ?? "—";
  const details = personalDirectory[email] ?? { phone: "Chưa cập nhật", location: user?.scope ?? "Chưa cập nhật", manager: "System Admin", workMode: "Chưa xác định" };
  const isEmployee = Boolean(employeeOverview?.employee);

  return <section className="sales-content personal-profile-page">
    <article className="personal-hero">
      <div className="personal-hero-orb orb-one" /><div className="personal-hero-orb orb-two" />
      <div className="personal-avatar">{initials(name)}</div>
      <div className="personal-hero-copy"><span>HỒ SƠ CÁ NHÂN</span><h2>{name}</h2><p>{isEmployee ? `${employeeOverview!.employee.title} · ${employeeOverview!.employee.department}` : "Quản trị viên hệ thống MBWNext"}</p><div><StatusBadge status="active" /><small>{email}</small></div></div>
      <div className="personal-hero-actions">{isEmployee && <button className="personal-light-button" onClick={() => navigate("/attendance")}>Chấm công của tôi <span>→</span></button>}{systemAdmin && <button className="personal-outline-button" onClick={() => navigate("/settings")}>Cài đặt hệ thống</button>}</div>
    </article>

    <div className="personal-page-heading"><div><h3>Thông tin của tôi</h3><p>Hồ sơ cá nhân, thông tin công việc và quyền truy cập của tài khoản hiện tại.</p></div><span>Đồng bộ hồ sơ · Mock API</span></div>
    <div className="personal-grid">
      <article className="personal-card personal-card-main"><div className="personal-card-heading"><div className="personal-card-icon coral">⌁</div><div><h3>Thông tin liên hệ</h3><p>Dùng để phối hợp công việc nội bộ.</p></div></div><InfoRow label="Email công việc" value={email} /><InfoRow label="Số điện thoại" value={details.phone} /><InfoRow label="Địa điểm làm việc" value={details.location} /></article>
      <article className="personal-card"><div className="personal-card-heading"><div className="personal-card-icon blue">◫</div><div><h3>Thông tin công việc</h3><p>Thông tin được quản lý bởi HR.</p></div></div>{isEmployee ? <><InfoRow label="Mã nhân viên" value={employeeOverview!.employee.employeeNo} /><InfoRow label="Quản lý trực tiếp" value={details.manager} /><InfoRow label="Ngày vào làm" value={formatDate(employeeOverview!.employee.joinDate)} /><InfoRow label="Hình thức làm việc" value={details.workMode} /></> : <><InfoRow label="Loại tài khoản" value="System Administrator" /><InfoRow label="Phạm vi" value={user?.scope ?? "Tất cả chi nhánh"} /><InfoRow label="Chấm công" value="Không áp dụng" /></>}</article>
      <article className="personal-card"><div className="personal-card-heading"><div className="personal-card-icon green">✓</div><div><h3>Tài khoản & quyền</h3><p>Quyền đang có hiệu lực trong phiên này.</p></div></div><InfoRow label="Role hiện tại" value={activeRole()} /><InfoRow label="Trạng thái tài khoản" value="Đang hoạt động" /><InfoRow label="Phạm vi dữ liệu" value={user?.scope ?? "Tất cả chi nhánh"} /><InfoRow label="Bảo mật" value="Đăng nhập bằng tài khoản nội bộ" /></article>
    </div>
    <div className="personal-bottom-grid">
      <article className="personal-card personal-note"><div className="personal-card-heading"><div className="personal-card-icon amber">☀</div><div><h3>{isEmployee ? "Không gian nhân viên" : "Không gian quản trị"}</h3><p>{isEmployee ? "Chấm công, nghỉ phép và thông tin nhân sự được tách thành một khu vực riêng." : "System Admin không có hồ sơ nhân sự, chấm công hay bảng lương cá nhân."}</p></div></div>{isEmployee ? <button className="reference-button" onClick={() => navigate("/attendance")}>Mở chấm công & nghỉ phép →</button> : <button className="reference-button" onClick={() => navigate("/settings")}>Mở cài đặt hệ thống →</button>}</article>
      <article className="personal-card personal-security"><div><span className="personal-security-kicker">TRẠNG THÁI PHIÊN</span><strong>Đăng nhập an toàn</strong><p>Tài khoản đang hoạt động trong phiên mock hiện tại. Dữ liệu thay đổi sẽ được đặt lại khi tải lại ứng dụng.</p></div><span className="personal-security-dot" /></article>
    </div>
  </section>;
}
