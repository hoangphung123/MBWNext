import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Column, DataTable } from "../../components/ui/DataTable";
import { Modal } from "../../components/ui/Modal";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { ManufacturingBom, ManufacturingCompletionDraft, ManufacturingOverview, ManufacturingWorkOrder, ManufacturingWorkOrderDraft, mockApi } from "../../lib/mockApi";

const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("vi-VN");
const emptyWorkOrder = (): ManufacturingWorkOrderDraft => ({ bomId: "", inputWarehouseId: "wh-hcm-rm", outputWarehouseId: "wh-hcm-main", plannedQuantity: 100, plannedStartDate: "2026-08-29", plannedEndDate: "2026-09-05", sourceSalesOrderId: "" });
const emptyCompletion = (order: ManufacturingWorkOrder): ManufacturingCompletionDraft => ({ workOrderId: order.id, completionDate: "2026-08-29", completedQuantity: Math.max(0, order.plannedQuantity - order.completedQuantity - order.rejectedQuantity), rejectedQuantity: 0, batchNo: "" });

export function ManufacturingPage() {
  const [overview, setOverview] = useState<ManufacturingOverview | null>(null);
  const [workOrderOpen, setWorkOrderOpen] = useState(false);
  const [completionOrder, setCompletionOrder] = useState<ManufacturingWorkOrder | null>(null);
  const [workOrderDraft, setWorkOrderDraft] = useState<ManufacturingWorkOrderDraft>(() => emptyWorkOrder());
  const [completionDraft, setCompletionDraft] = useState<ManufacturingCompletionDraft | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const load = useCallback(() => { void mockApi.manufacturing.getOverview().then(setOverview); }, []);
  useEffect(() => { load(); }, [load]);

  const productById = useMemo(() => new Map(overview?.products.map((product) => [product.id, product]) ?? []), [overview]);
  const bomById = useMemo(() => new Map(overview?.boms.map((bom) => [bom.id, bom]) ?? []), [overview]);
  const workCenterById = useMemo(() => new Map(overview?.workCenters.map((center) => [center.id, center]) ?? []), [overview]);
  const selectedBom = bomById.get(workOrderDraft.bomId);
  const selectedOutput = selectedBom ? productById.get(selectedBom.outputItemId) : undefined;
  const availableFor = (itemId: string, warehouseId: string) => overview?.stockBalances.find((balance) => balance.itemId === itemId && balance.warehouseId === warehouseId)?.availableQuantity ?? 0;
  const plannedMaterials = selectedBom ? selectedBom.lines.map((line) => ({ ...line, product: productById.get(line.itemId), needed: workOrderDraft.plannedQuantity * line.quantity / selectedBom.outputQuantity * (1 + line.scrapRate) })) : [];

  if (!overview) return <section className="sales-content"><div className="detail-loading">Đang tải dữ liệu sản xuất...</div></section>;

  const activeOrders = overview.workOrders.filter((order) => ["planned", "in_progress"].includes(order.status));
  const completedThisPlan = overview.workOrders.reduce((total, order) => total + order.completedQuantity, 0);
  const rejectedThisPlan = overview.workOrders.reduce((total, order) => total + order.rejectedQuantity, 0);
  const openWorkOrder = () => { setWorkOrderDraft(emptyWorkOrder()); setErrors({}); setWorkOrderOpen(true); };
  const openCompletion = (order: ManufacturingWorkOrder) => { setCompletionOrder(order); setCompletionDraft(emptyCompletion(order)); setErrors({}); };
  const submitWorkOrder = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true);
    const result = await mockApi.manufacturing.createWorkOrder(workOrderDraft);
    setSaving(false);
    if (!result.entity) { setErrors(result.errors); showToast(result.errors.form ?? Object.values(result.errors)[0] ?? "Không thể tạo lệnh sản xuất.", "error"); return; }
    showToast(`${result.entity.workOrderNo} đã được tạo. Kho nguyên liệu chỉ bị trừ khi ghi nhận hoàn thành.`);
    setWorkOrderOpen(false); load();
  };
  const submitCompletion = async (event: FormEvent) => {
    event.preventDefault(); if (!completionDraft) return; setSaving(true);
    const result = await mockApi.manufacturing.recordCompletion(completionDraft);
    setSaving(false);
    if (!result.entity) { setErrors(result.errors); showToast(result.errors.form ?? Object.values(result.errors)[0] ?? "Không thể ghi nhận sản xuất.", "error"); return; }
    showToast(`${result.entity.workOrderNo} đã cập nhật. Nguyên liệu, thành phẩm và lô hàng đã được cập nhật.`);
    setCompletionOrder(null); setCompletionDraft(null); load();
  };

  const workOrderColumns: Column<ManufacturingWorkOrder>[] = [
    { key: "order", header: "Lệnh sản xuất", render: (order) => <div className="cell-main"><strong>{order.workOrderNo}</strong><span>{bomById.get(order.bomId)?.bomNo ?? order.bomId} · {formatDate(order.plannedStartDate)} – {formatDate(order.plannedEndDate)}</span></div> },
    { key: "output", header: "Thành phẩm", render: (order) => <div className="cell-main"><strong>{productById.get(order.outputItemId)?.sku ?? order.outputItemId}</strong><span>{productById.get(order.outputItemId)?.name}</span></div> },
    { key: "progress", header: "Tiến độ", render: (order) => <div className="manufacturing-progress"><strong>{order.progressPercent}%</strong><span><i style={{ width: `${order.progressPercent}%` }} /></span><small>Đạt {order.completedQuantity.toLocaleString("vi-VN")} · Loại {order.rejectedQuantity.toLocaleString("vi-VN")} / {order.plannedQuantity.toLocaleString("vi-VN")}</small></div> },
    { key: "status", header: "Trạng thái", render: (order) => <StatusBadge status={order.status} /> },
    { key: "action", header: "", className: "text-right", render: (order) => <button className="table-action-button" disabled={!['planned', 'in_progress'].includes(order.status)} onClick={() => openCompletion(order)}>Ghi nhận</button> },
  ];

  return <section className="sales-content manufacturing-page">
    <div className="content-heading"><div><h2>Sản xuất</h2><p>Lập lệnh từ BOM, xuất nguyên liệu khi sản xuất và nhập thành phẩm kèm lô vào kho.</p></div><button className="primary-button compact" onClick={openWorkOrder}>＋ Tạo lệnh sản xuất</button></div>
    <div className="manufacturing-summary">
      <article><span>Lệnh đang thực hiện</span><strong>{activeOrders.length}</strong><small>Gồm kế hoạch và lệnh đang sản xuất</small></article>
      <article><span>Thành phẩm đã đạt</span><strong>{completedThisPlan.toLocaleString("vi-VN")}</strong><small>Đơn vị theo tất cả lệnh hiển thị</small></article>
      <article className={rejectedThisPlan ? "warning" : ""}><span>Hàng loại</span><strong>{rejectedThisPlan.toLocaleString("vi-VN")}</strong><small>Được tính vào tiến độ và tiêu hao nguyên liệu</small></article>
    </div>
    <div className="list-panel"><DataTable columns={workOrderColumns} rows={overview.workOrders} emptyTitle="Chưa có lệnh sản xuất" emptyDescription="Tạo lệnh từ một BOM đang hiệu lực để bắt đầu kế hoạch sản xuất." /></div>

    <div className="manufacturing-two-columns">
      <article className="detail-section"><div className="section-heading"><div><h3>Định mức nguyên vật liệu (BOM)</h3><p>Định mức cho mỗi mẻ thành phẩm; phần hao hụt được cộng vào lượng xuất thực tế.</p></div></div>{overview.boms.map((bom) => <BomCard key={bom.id} bom={bom} productById={productById} />)}</article>
      <article className="detail-section"><div className="section-heading"><div><h3>Phiếu công đoạn gần đây</h3><p>Ghi nhận thực hiện theo công đoạn hoặc lần hoàn thành mẻ.</p></div></div><div className="manufacturing-job-list">{overview.jobCards.map((card) => <div className="transaction-row" key={card.id}><span className="transaction-icon">◌</span><div><strong>{card.operation}</strong><span>{workCenterById.get(card.workCenterId)?.name ?? card.workCenterId} · {card.completedQuantity.toLocaleString("vi-VN")} đạt · {card.rejectedQuantity.toLocaleString("vi-VN")} loại</span></div><StatusBadge status={card.status} /></div>)}</div></article>
    </div>

    <Modal isOpen={workOrderOpen} title="Tạo lệnh sản xuất" onClose={() => setWorkOrderOpen(false)} wide><form className="crm-form" onSubmit={submitWorkOrder}>
      <p className="modal-description">Tạo lệnh chỉ ghi nhận kế hoạch. Nguyên liệu chỉ được kiểm tra và xuất kho khi bạn ghi nhận hoàn thành mẻ sản xuất.</p>
      <div className="form-grid two-columns">
        <label>BOM<select value={workOrderDraft.bomId} onChange={(event) => setWorkOrderDraft((current) => ({ ...current, bomId: event.target.value }))}><option value="">Chọn BOM</option>{overview.boms.filter((bom) => bom.status === "active").map((bom) => <option key={bom.id} value={bom.id}>{bom.bomNo} · {productById.get(bom.outputItemId)?.name} · Ra {bom.outputQuantity} {bom.unit}</option>)}</select>{errors.bomId && <small className="field-error">{errors.bomId}</small>}</label>
        <label>Số lượng kế hoạch<input type="number" min="1" value={workOrderDraft.plannedQuantity} onChange={(event) => setWorkOrderDraft((current) => ({ ...current, plannedQuantity: Number(event.target.value) }))} />{selectedOutput && <small className="muted-text">{selectedOutput.unit}</small>}{errors.plannedQuantity && <small className="field-error">{errors.plannedQuantity}</small>}</label>
        <label>Kho nguyên liệu<select value={workOrderDraft.inputWarehouseId} onChange={(event) => setWorkOrderDraft((current) => ({ ...current, inputWarehouseId: event.target.value }))}>{overview.warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.code} - {warehouse.name}</option>)}</select>{errors.inputWarehouseId && <small className="field-error">{errors.inputWarehouseId}</small>}</label>
        <label>Kho nhận thành phẩm<select value={workOrderDraft.outputWarehouseId} onChange={(event) => setWorkOrderDraft((current) => ({ ...current, outputWarehouseId: event.target.value }))}>{overview.warehouses.map((warehouse) => <option key={warehouse.id} value={warehouse.id}>{warehouse.code} - {warehouse.name}</option>)}</select>{errors.outputWarehouseId && <small className="field-error">{errors.outputWarehouseId}</small>}</label>
        <label>Ngày bắt đầu<input type="date" value={workOrderDraft.plannedStartDate} onChange={(event) => setWorkOrderDraft((current) => ({ ...current, plannedStartDate: event.target.value }))} />{errors.plannedStartDate && <small className="field-error">{errors.plannedStartDate}</small>}</label>
        <label>Ngày hoàn thành kế hoạch<input type="date" value={workOrderDraft.plannedEndDate} onChange={(event) => setWorkOrderDraft((current) => ({ ...current, plannedEndDate: event.target.value }))} />{errors.plannedEndDate && <small className="field-error">{errors.plannedEndDate}</small>}</label>
      </div>
      {selectedBom && <div className="manufacturing-material-preview"><strong>Nhu cầu nguyên liệu theo kế hoạch</strong>{plannedMaterials.map((line) => { const available = availableFor(line.itemId, workOrderDraft.inputWarehouseId); return <div key={line.id}><span>{line.product?.sku} · {line.product?.name}</span><b className={available + 0.000001 < line.needed ? "stock-low" : "stock-ok"}>Cần {line.needed.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} / khả dụng {available.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} {line.unit}</b></div>; })}</div>}
      <div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setWorkOrderOpen(false)}>Hủy</button><button className="primary-button compact" disabled={saving} type="submit">{saving ? "Đang tạo..." : "Tạo lệnh"}</button></div>
    </form></Modal>

    <Modal isOpen={Boolean(completionOrder && completionDraft)} title={`Ghi nhận sản xuất${completionOrder ? ` · ${completionOrder.workOrderNo}` : ""}`} onClose={() => { setCompletionOrder(null); setCompletionDraft(null); }} wide>{completionOrder && completionDraft && <form className="crm-form" onSubmit={submitCompletion}>
      <p className="modal-description">Hệ thống xuất nguyên liệu theo BOM (bao gồm hao hụt), tăng thành phẩm đạt vào kho nhận và ghi nhận hàng loại vào tiến độ nhưng không nhập kho.</p>
      <div className="form-grid two-columns">
        <label>Ngày ghi nhận<input type="date" value={completionDraft.completionDate} onChange={(event) => setCompletionDraft((current) => current ? { ...current, completionDate: event.target.value } : current)} />{errors.completionDate && <small className="field-error">{errors.completionDate}</small>}</label>
        <label>Số lượng đạt<input type="number" min="0" value={completionDraft.completedQuantity} onChange={(event) => setCompletionDraft((current) => current ? { ...current, completedQuantity: Number(event.target.value) } : current)} />{errors.completedQuantity && <small className="field-error">{errors.completedQuantity}</small>}</label>
        <label>Số lượng loại<input type="number" min="0" value={completionDraft.rejectedQuantity} onChange={(event) => setCompletionDraft((current) => current ? { ...current, rejectedQuantity: Number(event.target.value) } : current)} />{errors.rejectedQuantity && <small className="field-error">{errors.rejectedQuantity}</small>}</label>
        {productById.get(completionOrder.outputItemId)?.trackBatch && <label>Mã lô thành phẩm<input placeholder="Ví dụ: FG250-20260829" value={completionDraft.batchNo ?? ""} onChange={(event) => setCompletionDraft((current) => current ? { ...current, batchNo: event.target.value } : current)} />{errors.batchNo && <small className="field-error">{errors.batchNo}</small>}</label>}
      </div>
      {Object.entries(errors).filter(([key]) => key.startsWith("material-")).map(([key, message]) => <p className="form-wide-error" key={key}>{message}</p>)}
      {errors.form && <p className="form-wide-error">{errors.form}</p>}
      <div className="modal-actions"><button className="secondary-button" type="button" onClick={() => { setCompletionOrder(null); setCompletionDraft(null); }}>Hủy</button><button className="primary-button compact" disabled={saving} type="submit">{saving ? "Đang ghi nhận..." : "Xác nhận hoàn thành"}</button></div>
    </form>}</Modal>
  </section>;
}

function BomCard({ bom, productById }: { bom: ManufacturingBom; productById: Map<string, { sku: string; name: string }> }) {
  const output = productById.get(bom.outputItemId);
  return <div className="manufacturing-bom-card"><div><strong>{bom.bomNo}</strong><span>{output?.sku} · {output?.name} · Ra {bom.outputQuantity.toLocaleString("vi-VN")} {bom.unit}</span></div>{bom.lines.map((line) => <p key={line.id}>{productById.get(line.itemId)?.sku} · {line.quantity.toLocaleString("vi-VN")} {line.unit}{line.scrapRate > 0 ? ` · Hao hụt ${(line.scrapRate * 100).toLocaleString("vi-VN")}%` : ""}</p>)}</div>;
}
