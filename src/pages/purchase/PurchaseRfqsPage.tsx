import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Column, DataTable } from "../../components/ui/DataTable";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { PurchaseRequest, RequestForQuotation, Supplier, mockApi } from "../../lib/mockApi";

export function PurchaseRfqsPage() {
  const [rfqs, setRfqs] = useState<RequestForQuotation[]>([]);
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");
  const [actingId, setActingId] = useState("");
  const { showToast } = useToast();
  const load = useCallback(() => { void Promise.all([mockApi.purchasing.getRfqs(), mockApi.purchasing.getPurchaseRequests(), mockApi.purchasing.getSuppliers()]).then(([rfqRows, requestRows, supplierRows]) => { setRfqs(rfqRows); setRequests(requestRows); setSuppliers(supplierRows); }); }, []);
  useEffect(() => { load(); }, [load]);
  const requestById = useMemo(() => new Map(requests.map((request) => [request.id, request])), [requests]);
  const supplierById = useMemo(() => new Map(suppliers.map((supplier) => [supplier.id, supplier])), [suppliers]);
  const rows = useMemo(() => rfqs.filter((rfq) => `${rfq.documentNo} ${requestById.get(rfq.sourcePurchaseRequestId ?? "")?.documentNo ?? ""} ${requestById.get(rfq.sourcePurchaseRequestId ?? "")?.requestingDepartment ?? ""} ${rfq.lines.map((line) => line.description).join(" ")} ${rfq.supplierIds.map((id) => supplierById.get(id)?.name ?? "").join(" ")}`.toLowerCase().includes(search.toLowerCase())), [requestById, rfqs, search, supplierById]);
  const runAction = async (rfq: RequestForQuotation, action: "send" | "cancel" | "reopen") => { setActingId(rfq.id); const result = action === "send" ? await mockApi.purchasing.sendRfq(rfq.id) : action === "cancel" ? await mockApi.purchasing.cancelRfq(rfq.id) : await mockApi.purchasing.reopenRfq(rfq.id); setActingId(""); if (!result.entity) { showToast(result.errors.form ?? "Không thể cập nhật RFQ.", "error"); return; } showToast(action === "send" ? `${rfq.documentNo} đã gửi cho nhà cung cấp.` : action === "cancel" ? `${rfq.documentNo} đã hủy; yêu cầu mua được trả lại để xử lý.` : `${rfq.documentNo} đã mở lại ở trạng thái nháp.`); load(); };
  const columns: Column<RequestForQuotation>[] = [
    { key: "document", header: "RFQ", render: (rfq) => <div className="cell-main"><strong>{rfq.documentNo}</strong><span>Hạn nhận báo giá {new Date(rfq.deadline).toLocaleDateString("vi-VN")}</span></div> },
    { key: "request", header: "Yêu cầu mua", render: (rfq) => { const request = requestById.get(rfq.sourcePurchaseRequestId ?? ""); return request ? <div className="cell-main"><strong><Link className="reference-button" to={`/purchase/requests/${request.id}`}>{request.documentNo}</Link></strong><span>{request.requestingDepartment} · {request.lines.map((line) => line.description).join(", ")}</span></div> : <span className="muted-text">Tạo trực tiếp</span>; } },
    { key: "suppliers", header: "Nhà cung cấp mời", render: (rfq) => <div className="cell-main"><strong>{rfq.supplierIds.map((id) => supplierById.get(id)?.name ?? id).join(", ")}</strong><span>{rfq.lines.length} dòng hàng</span></div> },
    { key: "status", header: "Trạng thái", render: (rfq) => <StatusBadge status={rfq.status} /> },
    { key: "action", header: "", className: "text-right", render: (rfq) => <div className="table-actions">{rfq.status === "draft" && <button disabled={actingId === rfq.id} onClick={() => void runAction(rfq, "send")}>Gửi RFQ</button>}{["draft", "sent"].includes(rfq.status) && <button disabled={actingId === rfq.id} onClick={() => void runAction(rfq, "cancel")}>Hủy RFQ</button>}{rfq.status === "cancelled" && <button disabled={actingId === rfq.id} onClick={() => void runAction(rfq, "reopen")}>Mở lại</button>}</div> },
  ];
  return <section className="sales-content"><div className="content-heading"><div><h2>Yêu cầu báo giá (RFQ)</h2><p>RFQ được tạo từ yêu cầu mua đã duyệt và gửi đến các nhà cung cấp được mời.</p></div></div><FilterBar searchValue={search} onSearchChange={setSearch} placeholder="Tìm số RFQ, hàng hóa hoặc nhà cung cấp..." /><div className="list-panel"><DataTable columns={columns} rows={rows} emptyTitle="Chưa có RFQ" emptyDescription="Duyệt yêu cầu mua rồi chọn Tạo RFQ để bắt đầu mời báo giá." /></div></section>;
}
