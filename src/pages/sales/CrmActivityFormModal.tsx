import { FormEvent, useEffect, useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { CrmActivity, CrmActivityDraft, CrmActivityFormOptions, mockApi } from "../../lib/mockApi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (activity: CrmActivity) => void;
  initialCustomerId?: string;
  initialLeadId?: string;
  initialOpportunityId?: string;
};

const defaultDraft = (props: Props): CrmActivityDraft => ({ type: "call", subject: "", description: "", scheduledAt: "2026-08-30T09:00", assignedTo: "emp-004", customerId: props.initialCustomerId ?? null, leadId: props.initialLeadId ?? null, opportunityId: props.initialOpportunityId ?? null });

export function CrmActivityFormModal(props: Props) {
  const [draft, setDraft] = useState<CrmActivityDraft>(() => defaultDraft(props));
  const [options, setOptions] = useState<CrmActivityFormOptions>({ leads: [], customers: [], opportunities: [] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!props.isOpen) return;
    void mockApi.sales.getCrmActivityFormOptions().then(setOptions);
    setDraft(defaultDraft(props));
    setErrors({});
  }, [props.isOpen, props.initialCustomerId, props.initialLeadId, props.initialOpportunityId]);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const result = await mockApi.sales.createCrmActivity(draft);
    setSaving(false);
    if (!result.entity) { setErrors(result.errors); return; }
    props.onSaved(result.entity);
    props.onClose();
  };

  return <Modal isOpen={props.isOpen} title="Tạo hoạt động CRM" onClose={props.onClose} wide><form className="crm-form" onSubmit={save}>
    <p className="modal-description">Lên lịch hoạt động và gắn nó với lead, khách hàng hoặc cơ hội để không mất lịch sử chăm sóc.</p>
    <div className="form-grid two-columns">
      <label>Loại hoạt động<select value={draft.type} onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value as CrmActivityDraft["type"] }))}><option value="call">Cuộc gọi</option><option value="email">Email</option><option value="meeting">Cuộc họp</option><option value="task">Công việc</option><option value="note">Ghi chú cần xử lý</option></select></label>
      <label>Thời điểm thực hiện<input type="datetime-local" value={draft.scheduledAt} onChange={(event) => setDraft((current) => ({ ...current, scheduledAt: event.target.value }))} />{errors.scheduledAt && <small className="field-error">{errors.scheduledAt}</small>}</label>
      <label className="full-width">Nội dung<input value={draft.subject} placeholder="Ví dụ: Gọi xác nhận nhu cầu tháng 9" onChange={(event) => setDraft((current) => ({ ...current, subject: event.target.value }))} />{errors.subject && <small className="field-error">{errors.subject}</small>}</label>
      <label>Khách hàng<select value={draft.customerId ?? ""} onChange={(event) => setDraft((current) => ({ ...current, customerId: event.target.value || null }))}><option value="">Không liên kết khách hàng</option>{options.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.code} - {customer.name}</option>)}</select></label>
      <label>Lead<select value={draft.leadId ?? ""} onChange={(event) => setDraft((current) => ({ ...current, leadId: event.target.value || null }))}><option value="">Không liên kết lead</option>{options.leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.code} - {lead.fullName}</option>)}</select></label>
      <label> Cơ hội<select value={draft.opportunityId ?? ""} onChange={(event) => setDraft((current) => ({ ...current, opportunityId: event.target.value || null }))}><option value="">Không liên kết cơ hội</option>{options.opportunities.map((opportunity) => <option key={opportunity.id} value={opportunity.id}>{opportunity.code} - {opportunity.name}</option>)}</select></label>
      <label>Phụ trách<select value={draft.assignedTo} onChange={(event) => setDraft((current) => ({ ...current, assignedTo: event.target.value }))}><option value="emp-004">Ngọc Nguyễn</option><option value="emp-005">Linh Bùi</option></select>{errors.assignedTo && <small className="field-error">{errors.assignedTo}</small>}</label>
      {errors.related && <p className="form-wide-error full-width">{errors.related}</p>}
      <label className="full-width">Mô tả / chuẩn bị<textarea rows={3} value={draft.description ?? ""} placeholder="Ghi chú trước khi thực hiện (tùy chọn)" onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} /></label>
    </div>
    {errors.form && <p className="form-wide-error">{errors.form}</p>}
    <div className="modal-actions"><button className="secondary-button" type="button" onClick={props.onClose}>Hủy</button><button className="primary-button compact" disabled={saving}>{saving ? "Đang tạo..." : "Tạo hoạt động"}</button></div>
  </form></Modal>;
}
