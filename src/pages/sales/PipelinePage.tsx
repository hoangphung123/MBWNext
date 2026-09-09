import { DragEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/Toast";
import { formatVnd } from "../../data/mockData";
import { Opportunity, OpportunityStage, mockApi } from "../../lib/mockApi";
import { OpportunityFormModal } from "./CrmFormModals";

const stages: Array<{ id: OpportunityStage; label: string; color: string }> = [
  { id: "qualification", label: "Đánh giá", color: "slate" },
  { id: "proposal", label: "Đề xuất", color: "blue" },
  { id: "negotiation", label: "Đàm phán", color: "orange" },
  { id: "won", label: "Thành công", color: "green" },
  { id: "lost", label: "Không thành công", color: "red" },
];

export function PipelinePage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [editing, setEditing] = useState<Opportunity | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [dragOver, setDragOver] = useState<OpportunityStage | null>(null);
  const [lossTarget, setLossTarget] = useState<Opportunity | null>(null);
  const [lossReason, setLossReason] = useState("");
  const [lossError, setLossError] = useState("");
  const [savingLoss, setSavingLoss] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(() => { mockApi.sales.getOpportunities().then(setOpportunities); }, []);
  useEffect(() => { load(); }, [load]);

  const total = useMemo(
    () => opportunities.filter((item) => item.status === "open").reduce((sum, item) => sum + item.expectedValue, 0),
    [opportunities],
  );

  const move = async (opportunityId: string, stage: OpportunityStage, reason?: string) => {
    const result = await mockApi.sales.moveOpportunity(opportunityId, stage, reason);
    if (!result.entity) return result.errors;

    setOpportunities((current) => current.map((item) => item.id === result.entity?.id ? result.entity : item));
    showToast(`${result.entity.code} đã chuyển sang “${stages.find((item) => item.id === stage)?.label}”.`);
    return {};
  };

  const requestMoveToLost = (opportunityId: string) => {
    const opportunity = opportunities.find((item) => item.id === opportunityId);
    if (!opportunity || opportunity.stage === "lost") return;

    setLossTarget(opportunity);
    setLossReason("");
    setLossError("");
  };

  const onDrop = (event: DragEvent<HTMLElement>, stage: OpportunityStage) => {
    event.preventDefault();
    setDragOver(null);
    const opportunityId = event.dataTransfer.getData("application/x-mbwnext-opportunity");
    if (!opportunityId) return;

    if (stage === "lost") {
      requestMoveToLost(opportunityId);
      return;
    }

    void move(opportunityId, stage).then((errors) => {
      if (errors.form) showToast(errors.form, "error");
    });
  };

  const submitLoss = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!lossTarget) return;
    if (!lossReason.trim()) {
      setLossError("Vui lòng nhập lý do không thành công.");
      return;
    }

    setSavingLoss(true);
    const errors = await move(lossTarget.id, "lost", lossReason);
    setSavingLoss(false);
    if (errors.lostReason || errors.form) {
      setLossError(errors.lostReason ?? errors.form ?? "Không thể cập nhật Pipeline.");
      return;
    }
    setLossTarget(null);
  };

  const closeLossModal = () => { if (!savingLoss) setLossTarget(null); };

  return <section className="sales-content">
    <div className="content-heading">
      <div>
        <h2>Pipeline cơ hội</h2>
        <p>{opportunities.filter((item) => item.status === "open").length} cơ hội mở · tổng giá trị {formatVnd(total)}</p>
      </div>
      <div className="pipeline-actions">
        <span className="pipeline-hint">Kéo thẻ sang giai đoạn mới để cập nhật</span>
        <button className="primary-button compact" onClick={() => { setEditing(null); setFormOpen(true); }}>＋ Thêm cơ hội</button>
      </div>
    </div>

    <div className="kanban-board kanban-board-five">
      {stages.map((stage) => {
        const cards = opportunities.filter((opportunity) => opportunity.stage === stage.id);
        const stageTotal = cards.reduce((sum, opportunity) => sum + opportunity.expectedValue, 0);
        return <section
          className={`kanban-column${dragOver === stage.id ? " is-drop-target" : ""}`}
          key={stage.id}
          onDragOver={(event) => { event.preventDefault(); setDragOver(stage.id); }}
          onDragLeave={() => setDragOver(null)}
          onDrop={(event) => onDrop(event, stage.id)}
        >
          <div className="kanban-heading">
            <div><span className={`kanban-indicator ${stage.color}`} /><strong>{stage.label}</strong><small>{cards.length}</small></div>
            <span>{formatVnd(stageTotal)}</span>
          </div>
          <div className="kanban-cards">
            {cards.length ? cards.map((opportunity) => <article
              className="kanban-card"
              key={opportunity.id}
              draggable
              onDragStart={(event) => event.dataTransfer.setData("application/x-mbwnext-opportunity", opportunity.id)}
              onClick={() => { setEditing(opportunity); setFormOpen(true); }}
            >
              <span className="kanban-code">{opportunity.code}</span>
              <h3>{opportunity.name}</h3>
              <div className="kanban-value"><strong>{formatVnd(opportunity.expectedValue)}</strong><span>{opportunity.probability}% xác suất</span></div>
              <div className="kanban-foot"><span>Chốt {new Date(opportunity.expectedCloseDate).toLocaleDateString("vi-VN")}</span><span className="assignee-avatar">{opportunity.ownerId === "emp-005" ? "LB" : "NN"}</span></div>
            </article>) : <div className="kanban-empty">Thả cơ hội vào đây</div>}
          </div>
        </section>;
      })}
    </div>

    <OpportunityFormModal
      isOpen={formOpen}
      opportunity={editing}
      onClose={() => setFormOpen(false)}
      onSaved={(opportunity) => { showToast(`${opportunity.code} đã được lưu.`); load(); }}
    />

    <Modal isOpen={Boolean(lossTarget)} title="Xác nhận cơ hội không thành công" onClose={closeLossModal}>
      <form className="crm-form" onSubmit={submitLoss}>
        <p className="modal-description">Nhập lý do cho <strong>{lossTarget?.code}</strong> trước khi chuyển cơ hội sang Không thành công.</p>
        <label className="loss-reason-field">Lý do không thành công
          <textarea
            value={lossReason}
            onChange={(event) => { setLossReason(event.target.value); setLossError(""); }}
            placeholder="Ví dụ: Khách hàng chọn nhà cung cấp khác"
            autoFocus
            rows={4}
          />
        </label>
        {lossError && <p className="form-wide-error">{lossError}</p>}
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={closeLossModal} disabled={savingLoss}>Hủy</button>
          <button className="primary-button compact" type="submit" disabled={savingLoss}>{savingLoss ? "Đang cập nhật..." : "Xác nhận không thành công"}</button>
        </div>
      </form>
    </Modal>
  </section>;
}
