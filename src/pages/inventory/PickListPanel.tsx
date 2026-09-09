import { FormEvent, useCallback, useEffect, useState } from "react";
import { Column, DataTable } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { PickList, PickListCompletionDraft, StockBatchView, mockApi } from "../../lib/mockApi";

const initialCompletion = (pickList: PickList): PickListCompletionDraft => ({
  pickDate: "2026-08-29",
  lines: pickList.lines.map((line) => ({ salesOrderLineId: line.salesOrderLineId, pickedQuantity: line.requestedQuantity, batchNo: "" })),
});

type PickListPanelProps = { onInventoryChanged: () => void };

export function PickListPanel({ onInventoryChanged }: PickListPanelProps) {
  const [pickLists, setPickLists] = useState<PickList[]>([]);
  const [batches, setBatches] = useState<StockBatchView[]>([]);
  const [completionTarget, setCompletionTarget] = useState<PickList | null>(null);
  const [draft, setDraft] = useState<PickListCompletionDraft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [actingId, setActingId] = useState("");
  const { showToast } = useToast();

  const load = useCallback(() => {
    void Promise.all([mockApi.inventory.getPickLists(), mockApi.inventory.getBatchBalances()]).then(([pickListRows, batchRows]) => {
      setPickLists(pickListRows);
      setBatches(batchRows);
    });
  }, []);
  useEffect(() => { load(); }, [load]);
  const refresh = () => { load(); onInventoryChanged(); };
  const batchesForLine = (pickList: PickList, itemId: string) => batches.filter((batch) => batch.warehouseId === pickList.warehouseId && batch.itemId === itemId && batch.qualityStatus === "released" && batch.quantityOnHand > 0);
  const start = async (pickList: PickList) => {
    setActingId(pickList.id); const result = await mockApi.inventory.startPickList(pickList.id); setActingId("");
    if (!result.entity) showToast(result.errors.form ?? "Không thể bắt đầu soạn.", "error"); else { showToast(result.entity.documentNo + " đang được soạn hàng."); refresh(); }
  };
  const cancel = async (pickList: PickList) => {
    setActingId(pickList.id); const result = await mockApi.inventory.cancelPickList(pickList.id); setActingId("");
    if (!result.entity) showToast(result.errors.form ?? "Không thể hủy Pick List.", "error"); else { showToast(result.entity.documentNo + " đã được hủy."); refresh(); }
  };
  const openComplete = (pickList: PickList) => { setCompletionTarget(pickList); setDraft(initialCompletion(pickList)); setErrors({}); };
  const complete = async (event: FormEvent) => {
    event.preventDefault(); if (!completionTarget || !draft) return; setActingId(completionTarget.id);
    const result = await mockApi.inventory.completePickList(completionTarget.id, draft); setActingId("");
    if (!result.entity) { setErrors(result.errors); showToast(result.errors.form ?? Object.values(result.errors)[0] ?? "Không thể hoàn tất soạn hàng.", "error"); return; }
    showToast(result.entity.documentNo + " đã hoàn tất soạn hàng."); setCompletionTarget(null); setDraft(null); refresh();
  };
  const updateLine = (index: number, change: Partial<PickListCompletionDraft["lines"][number]>) => setDraft((current) => current ? { ...current, lines: current.lines.map((line, lineIndex) => lineIndex === index ? { ...line, ...change } : line) } : current);
  const columns: Column<PickList>[] = [
    { key: "document", header: "Pick List", render: (entry) => <div className="cell-main"><strong>{entry.documentNo}</strong><span>{entry.salesOrderId} · {entry.lines.length} dòng</span></div> },
    { key: "warehouse", header: "Kho xuất", render: (entry) => entry.warehouseId },
    { key: "quantity", header: "SL soạn", className: "text-right", render: (entry) => entry.lines.reduce((sum, line) => sum + line.requestedQuantity, 0).toLocaleString("vi-VN") },
    { key: "status", header: "Trạng thái", render: (entry) => <StatusBadge status={entry.status} /> },
    { key: "actions", header: "", className: "text-right", render: (entry) => <div className="table-actions">{entry.status === "ready" && <button disabled={actingId === entry.id} onClick={() => void start(entry)}>{actingId === entry.id ? "Đang xử lý..." : "Bắt đầu"}</button>}{["ready", "in_progress"].includes(entry.status) && <button disabled={actingId === entry.id} onClick={() => openComplete(entry)}>Hoàn tất soạn</button>}{["ready", "in_progress"].includes(entry.status) && <button className="danger-action" disabled={actingId === entry.id} onClick={() => void cancel(entry)}>Hủy</button>}</div> },
  ];

  return <section className="inventory-pick-list">
    <div className="content-heading inventory-movement-heading"><div><h2>Pick List</h2><p>Danh sách soạn hàng được tạo từ đơn bán đã xác nhận. Hoàn tất Pick List chỉ phân bổ lô; tồn được trừ ở bước giao hàng.</p></div></div>
    <div className="list-panel"><DataTable columns={columns} rows={pickLists} emptyTitle="Chưa có Pick List" emptyDescription="Mở một đơn bán đã xác nhận để tạo danh sách soạn hàng." /></div>
    <Modal isOpen={Boolean(completionTarget && draft)} title={completionTarget ? "Hoàn tất soạn · " + completionTarget.documentNo : "Hoàn tất Pick List"} onClose={() => { setCompletionTarget(null); setDraft(null); setErrors({}); }} wide>
      {completionTarget && draft && <form className="crm-form purchase-receipt-form" onSubmit={complete}><p className="modal-description">Chọn lô xuất cho từng hàng. Số lượng phải khớp với danh sách cần soạn, và lô chỉ được phân bổ nếu còn tồn khả dụng.</p><label>Ngày soạn hàng<input type="date" value={draft.pickDate} onChange={(event) => setDraft({ ...draft, pickDate: event.target.value })} />{errors.pickDate && <small className="field-error">{errors.pickDate}</small>}</label><div className="receipt-lines">{completionTarget.lines.map((line, index) => { const draftLine = draft.lines[index]; const lineBatches = batchesForLine(completionTarget, line.itemId); return <div className="receipt-line pick-line" key={line.salesOrderLineId}><div><strong>{line.description}</strong><span>Cần soạn {line.requestedQuantity.toLocaleString("vi-VN")} {line.unit}</span></div><label>SL đã soạn<input type="number" min="0" value={draftLine?.pickedQuantity ?? 0} onChange={(event) => updateLine(index, { pickedQuantity: Number(event.target.value) })} /></label>{lineBatches.length ? <label>Lô xuất<select value={draftLine?.batchNo ?? ""} onChange={(event) => updateLine(index, { batchNo: event.target.value })}><option value="">Chọn lô</option>{lineBatches.map((batch) => <option key={batch.id} value={batch.batchNo}>{batch.batchNo} · còn {batch.quantityOnHand.toLocaleString("vi-VN")} {batch.item.unit}</option>)}</select></label> : <div className="transfer-no-batch"><strong>Không quản lý lô</strong></div>}{errors["line-" + index] && <small className="field-error receipt-line-error">{errors["line-" + index]}</small>}</div>; })}</div><div className="modal-actions"><button className="secondary-button" type="button" onClick={() => { setCompletionTarget(null); setDraft(null); }}>Hủy</button><button className="primary-button compact" disabled={actingId === completionTarget.id}>{actingId === completionTarget.id ? "Đang hoàn tất..." : "Xác nhận đã soạn"}</button></div></form>}
    </Modal>
  </section>;
}
