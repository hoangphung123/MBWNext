import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Column, DataTable } from "../../components/ui/DataTable";
import { FilterBar } from "../../components/ui/FilterBar";
import { Modal } from "../../components/ui/Modal";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { CrmActivity, Customer, Lead, Opportunity, mockApi } from "../../lib/mockApi";
import { CrmActivityFormModal } from "./CrmActivityFormModal";

const typeLabels: Record<CrmActivity["type"], string> = { call: "Cuộc gọi", email: "Email", meeting: "Cuộc họp", task: "Công việc", note: "Ghi chú" };
const typeIcons: Record<CrmActivity["type"], string> = { call: "☎", email: "✉", meeting: "◫", task: "✓", note: "•" };

export function CrmActivitiesPage() {
  const [activities, setActivities] = useState<CrmActivity[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [completing, setCompleting] = useState<CrmActivity | null>(null);
  const [cancelling, setCancelling] = useState<CrmActivity | null>(null);
  const [result, setResult] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(() => {
    void Promise.all([mockApi.sales.getCrmActivities(), mockApi.sales.getCustomers(), mockApi.sales.getLeads(), mockApi.sales.getOpportunities()]).then(([activityRows, customerRows, leadRows, opportunityRows]) => {
      setActivities(activityRows);
      setCustomers(customerRows);
      setLeads(leadRows);
      setOpportunities(opportunityRows);
    });
  }, []);
  useEffect(() => { load(); }, [load]);

  const customerById = useMemo(() => new Map(customers.map((customer) => [customer.id, customer])), [customers]);
  const leadById = useMemo(() => new Map(leads.map((lead) => [lead.id, lead])), [leads]);
  const opportunityById = useMemo(() => new Map(opportunities.map((opportunity) => [opportunity.id, opportunity])), [opportunities]);
  const rows = useMemo(() => activities.filter((activity) => `${activity.subject} ${customerById.get(activity.customerId ?? "")?.name ?? ""} ${leadById.get(activity.leadId ?? "")?.fullName ?? ""} ${opportunityById.get(activity.opportunityId ?? "")?.name ?? ""}`.toLowerCase().includes(search.toLowerCase()) && (status === "all" || activity.status === status)), [activities, customerById, leadById, opportunityById, search, status]);
  const plannedCount = activities.filter((activity) => activity.status === "planned").length;
  const todayCount = activities.filter((activity) => activity.status === "planned" && activity.scheduledAt.slice(0, 10) === "2026-08-29").length;

  const relation = (activity: CrmActivity) => {
    const opportunity = opportunityById.get(activity.opportunityId ?? "");
    if (opportunity) return `${opportunity.code} · ${opportunity.name}`;
    const customer = customerById.get(activity.customerId ?? "");
    if (customer) return `${customer.code} · ${customer.name}`;
    const lead = leadById.get(activity.leadId ?? "");
    return lead ? `${lead.code} · ${lead.fullName}` : "Chưa có liên kết";
  };
  const complete = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!completing) return;
    setSaving(true);
    const response = await mockApi.sales.completeCrmActivity(completing.id, result);
    setSaving(false);
    if (!response.entity) { setErrors(response.errors); showToast(response.errors.form ?? Object.values(response.errors)[0] ?? "Không thể hoàn tất hoạt động.", "error"); return; }
    showToast("Đã ghi nhận kết quả hoạt động.");
    setCompleting(null);
    load();
  };
  const cancel = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!cancelling) return;
    setSaving(true);
    const response = await mockApi.sales.cancelCrmActivity(cancelling.id, result);
    setSaving(false);
    if (!response.entity) { setErrors(response.errors); showToast(response.errors.form ?? Object.values(response.errors)[0] ?? "Không thể hủy hoạt động.", "error"); return; }
    showToast("Hoạt động đã được hủy.");
    setCancelling(null);
    load();
  };
  const columns: Column<CrmActivity>[] = [
    { key: "activity", header: "Hoạt động", render: (activity) => <div className="activity-cell"><span className={`crm-activity-icon type-${activity.type}`}>{typeIcons[activity.type]}</span><div className="cell-main"><strong>{activity.subject}</strong><span>{typeLabels[activity.type]} · {activity.assignedTo === "emp-005" ? "Linh Bùi" : "Ngọc Nguyễn"}</span></div></div> },
    { key: "relation", header: "Liên kết", render: relation },
    { key: "scheduled", header: "Thời điểm", render: (activity) => <div className="cell-main"><strong>{new Date(activity.scheduledAt).toLocaleDateString("vi-VN")}</strong><span>{new Date(activity.scheduledAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</span></div> },
    { key: "result", header: "Kết quả", render: (activity) => <span className="muted-text">{activity.result ?? activity.cancellationReason ?? "Chưa thực hiện"}</span> },
    { key: "status", header: "Trạng thái", render: (activity) => <StatusBadge status={activity.status} /> },
    { key: "action", header: "", className: "text-right", render: (activity) => activity.status === "planned" ? <div className="table-actions"><button onClick={() => { setCompleting(activity); setResult(""); setErrors({}); }}>Hoàn tất</button><button className="danger-action" onClick={() => { setCancelling(activity); setResult(""); setErrors({}); }}>Hủy</button></div> : null },
  ];

  return <section className="sales-content">
    <div className="content-heading"><div><h2>Hoạt động CRM</h2><p>Quản lý công việc chăm sóc khách hàng, lead và cơ hội theo lịch.</p></div><button className="primary-button compact" onClick={() => setFormOpen(true)}>＋ Tạo hoạt động</button></div>
    <div className="crm-activity-summary"><article><span>Đang lên lịch</span><strong>{plannedCount}</strong><small>hoạt động cần thực hiện</small></article><article><span>Đến hạn hôm nay</span><strong>{todayCount}</strong><small>lịch cần ưu tiên xử lý</small></article></div>
    <FilterBar searchValue={search} onSearchChange={setSearch} placeholder="Tìm nội dung, khách hàng, lead hoặc cơ hội..."><select className="filter-select" aria-label="Trạng thái hoạt động" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Tất cả trạng thái</option><option value="planned">Đang lên lịch</option><option value="completed">Hoàn thành</option><option value="cancelled">Đã hủy</option></select></FilterBar>
    <div className="list-panel"><DataTable columns={columns} rows={rows} emptyTitle="Chưa có hoạt động phù hợp" emptyDescription="Tạo một hoạt động để theo dõi việc chăm sóc và nhắc việc." /></div>
    <CrmActivityFormModal isOpen={formOpen} onClose={() => setFormOpen(false)} onSaved={(activity) => { showToast(`Đã tạo hoạt động: ${activity.subject}`); load(); }} />
    <Modal isOpen={Boolean(completing)} title="Hoàn tất hoạt động" onClose={() => setCompleting(null)}><form className="crm-form" onSubmit={complete}><p className="modal-description">Ghi kết quả để lịch sử chăm sóc có thể được người khác tiếp tục theo dõi.</p><label>Kết quả hoạt động<textarea rows={3} value={result} placeholder="Ví dụ: Khách xác nhận lịch gặp tuần tới" onChange={(event) => setResult(event.target.value)} />{errors.result && <small className="field-error">{errors.result}</small>}</label><div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setCompleting(null)}>Hủy</button><button className="primary-button compact" disabled={saving}>{saving ? "Đang lưu..." : "Xác nhận hoàn tất"}</button></div></form></Modal>
    <Modal isOpen={Boolean(cancelling)} title="Hủy hoạt động" onClose={() => setCancelling(null)}><form className="crm-form" onSubmit={cancel}><label>Lý do hủy<textarea rows={3} value={result} placeholder="Nêu lý do để lịch sử được đầy đủ" onChange={(event) => setResult(event.target.value)} />{errors.reason && <small className="field-error">{errors.reason}</small>}</label><div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setCancelling(null)}>Quay lại</button><button className="primary-button compact" disabled={saving}>{saving ? "Đang hủy..." : "Xác nhận hủy"}</button></div></form></Modal>
  </section>;
}
