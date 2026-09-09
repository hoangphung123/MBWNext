import { FormEvent, useEffect, useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { Customer, CustomerDraft, Lead, LeadDraft, Opportunity, OpportunityDraft, OpportunityStage, mockApi } from "../../lib/mockApi";

type SharedProps = { isOpen: boolean; onClose: () => void };

const leadDefaults: LeadDraft = { fullName: "", companyName: "", phone: "", email: "", source: "Website", status: "new", score: 50, ownerId: "emp-004" };
const customerDefaults: CustomerDraft = { name: "", taxCode: "", phone: "", email: "", address: "", creditLimit: 50_000_000, outstandingBalance: 0, paymentTermDays: 30, assignedSalesperson: "emp-004", status: "active" };
const opportunityDefaults: OpportunityDraft = { leadId: null, customerId: null, name: "", stage: "qualification", probability: 25, expectedValue: 10_000_000, expectedCloseDate: "2026-09-30", ownerId: "emp-004", status: "open" };

function FormError({ message }: { message?: string }) { return message ? <small className="field-error">{message}</small> : null; }

export function LeadFormModal({ isOpen, onClose, lead, onSaved }: SharedProps & { lead: Lead | null; onSaved: (lead: Lead) => void }) {
  const [draft, setDraft] = useState<LeadDraft>(leadDefaults);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const isConverted = lead?.status === "converted";

  useEffect(() => {
    if (!isOpen) return;
    setDraft(lead ? { fullName: lead.fullName, companyName: lead.companyName, phone: lead.phone, email: lead.email, source: lead.source, status: lead.status, score: lead.score, ownerId: lead.ownerId, lostReason: lead.lostReason } : leadDefaults);
    setErrors({});
  }, [isOpen, lead]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const result = lead ? await mockApi.sales.updateLead(lead.id, draft) : await mockApi.sales.createLead(draft);
    setSaving(false);
    if (!result.entity) { setErrors(result.errors); return; }
    onSaved(result.entity);
    onClose();
  };

  return <Modal isOpen={isOpen} onClose={onClose} title={lead ? "Chỉnh sửa lead" : "Thêm lead"} wide>
    <form className="crm-form" onSubmit={submit}>
      {isConverted && <p className="modal-description">Lead đã được chuyển đổi; chỉ có thể cập nhật thông tin liên hệ, không thể đổi lại trạng thái.</p>}
      <div className="form-grid two-columns">
        <label>Họ tên<input value={draft.fullName} onChange={(event) => setDraft({ ...draft, fullName: event.target.value })} /><FormError message={errors.fullName} /></label>
        <label>Công ty<input value={draft.companyName} onChange={(event) => setDraft({ ...draft, companyName: event.target.value })} /><FormError message={errors.companyName} /></label>
        <label>Số điện thoại<input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /><FormError message={errors.phone} /></label>
        <label>Email<input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /><FormError message={errors.email} /></label>
        <label>Nguồn lead<select value={draft.source} onChange={(event) => setDraft({ ...draft, source: event.target.value })}><option>Website</option><option>Referral</option><option>Event</option><option>Sales outbound</option></select></label>
        <label>Điểm lead<input type="number" min="0" max="100" value={draft.score} onChange={(event) => setDraft({ ...draft, score: Number(event.target.value) })} /><FormError message={errors.score} /></label>
        <label>Trạng thái<select value={draft.status} disabled={isConverted} onChange={(event) => setDraft({ ...draft, status: event.target.value as LeadDraft["status"] })}><option value="new">Mới</option><option value="contacted">Đã liên hệ</option><option value="qualified">Đã đánh giá</option><option value="lost">Không thành công</option>{isConverted && <option value="converted">Đã chuyển đổi</option>}</select><FormError message={errors.status} /></label>
        <label>Phụ trách<select value={draft.ownerId} onChange={(event) => setDraft({ ...draft, ownerId: event.target.value })}><option value="emp-004">Ngọc Nguyễn</option><option value="emp-005">Linh Bùi</option></select></label>
        {draft.status === "lost" && <label className="full-width">Lý do không thành công<input value={draft.lostReason ?? ""} onChange={(event) => setDraft({ ...draft, lostReason: event.target.value })} /><FormError message={errors.lostReason} /></label>}
      </div>
      {errors.form && <p className="form-wide-error">{errors.form}</p>}
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Hủy</button><button className="primary-button compact" type="submit" disabled={saving}>{saving ? "Đang lưu..." : "Lưu lead"}</button></div>
    </form>
  </Modal>;
}

export function CustomerFormModal({ isOpen, onClose, customer, onSaved }: SharedProps & { customer: Customer | null; onSaved: (customer: Customer) => void }) {
  const [draft, setDraft] = useState<CustomerDraft>(customerDefaults);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setDraft(customer ? { name: customer.name, taxCode: customer.taxCode, phone: customer.phone, email: customer.email, address: customer.address, creditLimit: customer.creditLimit, outstandingBalance: customer.outstandingBalance, paymentTermDays: customer.paymentTermDays, assignedSalesperson: customer.assignedSalesperson, status: customer.status } : customerDefaults);
    setErrors({});
  }, [isOpen, customer]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const result = customer ? await mockApi.sales.updateCustomer(customer.id, draft) : await mockApi.sales.createCustomer(draft);
    setSaving(false);
    if (!result.entity) { setErrors(result.errors); return; }
    onSaved(result.entity);
    onClose();
  };

  return <Modal isOpen={isOpen} onClose={onClose} title={customer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng"} wide>
    <form className="crm-form" onSubmit={submit}>
      <div className="form-grid two-columns">
        <label>Tên khách hàng<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /><FormError message={errors.name} /></label>
        <label>Mã số thuế<input value={draft.taxCode} onChange={(event) => setDraft({ ...draft, taxCode: event.target.value })} /><FormError message={errors.taxCode} /></label>
        <label>Số điện thoại<input value={draft.phone} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} /><FormError message={errors.phone} /></label>
        <label>Email<input type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} /><FormError message={errors.email} /></label>
        <label className="full-width">Địa chỉ<input value={draft.address} onChange={(event) => setDraft({ ...draft, address: event.target.value })} /><FormError message={errors.address} /></label>
        <label>Hạn mức công nợ<input type="number" min="0" step="1000000" value={draft.creditLimit} onChange={(event) => setDraft({ ...draft, creditLimit: Number(event.target.value) })} /><FormError message={errors.creditLimit} /></label>
        <label>Hạn thanh toán (ngày)<input type="number" min="0" value={draft.paymentTermDays} onChange={(event) => setDraft({ ...draft, paymentTermDays: Number(event.target.value) })} /><FormError message={errors.paymentTermDays} /></label>
        <label>Nhân viên phụ trách<select value={draft.assignedSalesperson} onChange={(event) => setDraft({ ...draft, assignedSalesperson: event.target.value })}><option value="emp-004">Ngọc Nguyễn</option><option value="emp-005">Linh Bùi</option></select></label>
        <label>Trạng thái<select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as CustomerDraft["status"] })}><option value="active">Đang hoạt động</option><option value="inactive">Ngừng hoạt động</option></select></label>
      </div>
      {errors.form && <p className="form-wide-error">{errors.form}</p>}
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Hủy</button><button className="primary-button compact" type="submit" disabled={saving}>{saving ? "Đang lưu..." : "Lưu khách hàng"}</button></div>
    </form>
  </Modal>;
}

function normalizedStagePatch(stage: OpportunityStage, draft: OpportunityDraft): OpportunityDraft {
  return { ...draft, stage, probability: stage === "won" ? 100 : stage === "lost" ? 0 : draft.probability, lostReason: stage === "lost" ? draft.lostReason : undefined };
}

export function OpportunityFormModal({ isOpen, onClose, opportunity, onSaved }: SharedProps & { opportunity: Opportunity | null; onSaved: (opportunity: Opportunity) => void }) {
  const [draft, setDraft] = useState<OpportunityDraft>(opportunityDefaults);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [options, setOptions] = useState<{ leads: Lead[]; customers: Customer[] }>({ leads: [], customers: [] });
  const terminalStage = draft.stage === "won" || draft.stage === "lost";

  useEffect(() => {
    if (!isOpen) return;
    mockApi.sales.getCrmFormOptions().then(setOptions);
    setDraft(opportunity ? { leadId: opportunity.leadId, customerId: opportunity.customerId, name: opportunity.name, stage: opportunity.stage, probability: opportunity.probability, expectedValue: opportunity.expectedValue, expectedCloseDate: opportunity.expectedCloseDate, ownerId: opportunity.ownerId, status: opportunity.status, lostReason: opportunity.lostReason } : opportunityDefaults);
    setErrors({});
  }, [isOpen, opportunity]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const result = opportunity ? await mockApi.sales.updateOpportunity(opportunity.id, draft) : await mockApi.sales.createOpportunity(draft);
    setSaving(false);
    if (!result.entity) { setErrors(result.errors); return; }
    onSaved(result.entity);
    onClose();
  };

  return <Modal isOpen={isOpen} onClose={onClose} title={opportunity ? "Chỉnh sửa cơ hội" : "Thêm cơ hội"} wide>
    <form className="crm-form" onSubmit={submit}>
      <div className="form-grid two-columns">
        <label className="full-width">Tên cơ hội<input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /><FormError message={errors.name} /></label>
        <label>Lead liên kết<select value={draft.leadId ?? ""} onChange={(event) => setDraft({ ...draft, leadId: event.target.value || null })}><option value="">Không chọn lead</option>{options.leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.code} - {lead.fullName}</option>)}</select></label>
        <label>Khách hàng liên kết<select value={draft.customerId ?? ""} onChange={(event) => setDraft({ ...draft, customerId: event.target.value || null })}><option value="">Không chọn khách hàng</option>{options.customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.code} - {customer.name}</option>)}</select></label>
        {errors.related && <p className="form-wide-error full-width">{errors.related}</p>}
        <label>Giai đoạn<select value={draft.stage} onChange={(event) => setDraft(normalizedStagePatch(event.target.value as OpportunityStage, draft))}><option value="qualification">Đánh giá</option><option value="proposal">Đề xuất</option><option value="negotiation">Đàm phán</option><option value="won">Thành công</option><option value="lost">Không thành công</option></select></label>
        <label>Xác suất (%)<input type="number" min="0" max="100" disabled={terminalStage} value={draft.probability} onChange={(event) => setDraft({ ...draft, probability: Number(event.target.value) })} /><FormError message={errors.probability} /></label>
        <label>Giá trị dự kiến<input type="number" min="0" step="1000000" value={draft.expectedValue} onChange={(event) => setDraft({ ...draft, expectedValue: Number(event.target.value) })} /><FormError message={errors.expectedValue} /></label>
        <label>Ngày chốt dự kiến<input type="date" value={draft.expectedCloseDate} onChange={(event) => setDraft({ ...draft, expectedCloseDate: event.target.value })} /><FormError message={errors.expectedCloseDate} /></label>
        <label>Phụ trách<select value={draft.ownerId} onChange={(event) => setDraft({ ...draft, ownerId: event.target.value })}><option value="emp-004">Ngọc Nguyễn</option><option value="emp-005">Linh Bùi</option></select></label>
        {draft.stage === "lost" && <label className="full-width">Lý do thất bại<input value={draft.lostReason ?? ""} onChange={(event) => setDraft({ ...draft, lostReason: event.target.value })} /><FormError message={errors.lostReason} /></label>}
      </div>
      {errors.form && <p className="form-wide-error">{errors.form}</p>}
      <div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Hủy</button><button className="primary-button compact" type="submit" disabled={saving}>{saving ? "Đang lưu..." : "Lưu cơ hội"}</button></div>
    </form>
  </Modal>;
}
