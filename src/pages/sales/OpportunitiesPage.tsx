import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { DataTable, Column } from "../../components/ui/DataTable";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { formatVnd } from "../../data/mockData";
import { Opportunity, mockApi } from "../../lib/mockApi";
import { OpportunityFormModal } from "./CrmFormModals";

export function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]); const [search, setSearch] = useState(""); const [stage, setStage] = useState("all"); const [formOpen, setFormOpen] = useState(false); const [editing, setEditing] = useState<Opportunity | null>(null); const [deleting, setDeleting] = useState<Opportunity | null>(null); const { showToast } = useToast();
  const load = useCallback(() => { mockApi.sales.getOpportunities().then(setOpportunities); }, []);
  useEffect(() => { load(); }, [load]);
  const rows = useMemo(() => opportunities.filter((opportunity) => `${opportunity.code} ${opportunity.name}`.toLowerCase().includes(search.toLowerCase()) && (stage === "all" || opportunity.stage === stage)), [opportunities, search, stage]);
  const handleDelete = async () => { if (!deleting) return; const result = await mockApi.sales.deleteOpportunity(deleting.id); if (!result.entity) showToast(result.errors.form ?? "Không thể xóa cơ hội.", "error"); else { showToast(`Đã xóa ${deleting.code}.`); load(); } setDeleting(null); };
  const columns: Column<Opportunity>[] = [
    { key: "opportunity", header: "Cơ hội", render: (opportunity) => <div className="cell-main"><strong>{opportunity.name}</strong><span>{opportunity.code}</span></div> },
    { key: "stage", header: "Giai đoạn", render: (opportunity) => <StatusBadge status={opportunity.stage} /> },
    { key: "value", header: "Giá trị dự kiến", className: "text-right", render: (opportunity) => formatVnd(opportunity.expectedValue) },
    { key: "probability", header: "Xác suất", className: "text-right", render: (opportunity) => `${opportunity.probability}%` },
    { key: "close", header: "Ngày chốt dự kiến", render: (opportunity) => new Date(opportunity.expectedCloseDate).toLocaleDateString("vi-VN") },
    { key: "action", header: "", className: "text-right", render: (opportunity) => <div className="table-actions"><button onClick={() => { setEditing(opportunity); setFormOpen(true); }}>Sửa</button><button className="danger-action" onClick={() => setDeleting(opportunity)}>Xóa</button></div> },
  ];
  return <section className="sales-content"><div className="content-heading"><div><h2>Cơ hội bán hàng</h2><p>Ưu tiên các cơ hội có xác suất và giá trị cao.</p></div><button className="primary-button compact" onClick={() => { setEditing(null); setFormOpen(true); }}>＋ Thêm cơ hội</button></div><FilterBar searchValue={search} onSearchChange={setSearch} placeholder="Tìm mã hoặc tên cơ hội..."><select className="filter-select" aria-label="Giai đoạn cơ hội" value={stage} onChange={(event) => setStage(event.target.value)}><option value="all">Tất cả giai đoạn</option><option value="qualification">Đánh giá</option><option value="proposal">Đề xuất</option><option value="negotiation">Đàm phán</option><option value="won">Thành công</option><option value="lost">Không thành công</option></select></FilterBar><div className="list-panel"><DataTable columns={columns} rows={rows} emptyTitle="Không tìm thấy cơ hội" emptyDescription="Thử đổi điều kiện tìm kiếm." /></div><OpportunityFormModal isOpen={formOpen} opportunity={editing} onClose={() => setFormOpen(false)} onSaved={(opportunity) => { showToast(`${opportunity.code} đã được lưu.`); load(); }} /><ConfirmDialog isOpen={Boolean(deleting)} title="Xóa cơ hội" description={<>Bạn muốn xóa <strong>{deleting?.name}</strong>? Thao tác này không thể hoàn tác.</>} confirmLabel="Xóa cơ hội" onClose={() => setDeleting(null)} onConfirm={handleDelete} /></section>;
}
