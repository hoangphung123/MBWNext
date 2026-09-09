import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Column, DataTable } from "../../components/ui/DataTable";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { formatVnd } from "../../data/mockData";
import { PurchaseOrder, Supplier, mockApi } from "../../lib/mockApi";

export function PurchaseOrdersPage() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [actingId, setActingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const load = useCallback(() => { void Promise.all([mockApi.purchasing.getPurchaseOrders(), mockApi.purchasing.getSuppliers()]).then(([orderRows, supplierRows]) => { setOrders(orderRows); setSuppliers(supplierRows); }); }, []);
  useEffect(() => { load(); }, [load]);

  const supplierById = useMemo(() => new Map(suppliers.map((supplier) => [supplier.id, supplier])), [suppliers]);
  const rows = useMemo(() => orders.filter((order) => `${order.documentNo} ${supplierById.get(order.supplierId)?.name ?? ""}`.toLowerCase().includes(search.toLowerCase()) && (status === "all" || order.status === status)), [orders, search, status, supplierById]);

  const runAction = async (order: PurchaseOrder, action: "submit" | "approve" | "confirm") => {
    setActingId(order.id);
    const result = action === "submit" ? await mockApi.purchasing.submitPurchaseOrder(order.id) : action === "approve" ? await mockApi.purchasing.approvePurchaseOrder(order.id) : await mockApi.purchasing.confirmPurchaseOrder(order.id);
    setActingId(null);
    if (!result.entity) { showToast(result.errors.form ?? "Không thể cập nhật đơn mua.", "error"); return; }
    showToast(action === "submit" ? `${order.documentNo} đã gửi duyệt.` : action === "approve" ? `${order.documentNo} đã được duyệt.` : `${order.documentNo} đã xác nhận đặt hàng.`);
    load();
  };

  const columns: Column<PurchaseOrder>[] = [
    { key: "document", header: "Đơn mua", render: (order) => <div className="cell-main"><strong>{order.documentNo}</strong><span>{new Date(order.orderDate).toLocaleDateString("vi-VN")} · Nhận dự kiến {new Date(order.expectedReceiptDate).toLocaleDateString("vi-VN")}</span></div> },
    { key: "supplier", header: "Nhà cung cấp", render: (order) => <div className="cell-main"><strong>{supplierById.get(order.supplierId)?.name ?? "Chưa xác định"}</strong><span>{order.lines.length} dòng hàng</span></div> },
    { key: "amount", header: "Tổng tiền", className: "text-right", render: (order) => formatVnd(order.totalAmount) },
    { key: "status", header: "Trạng thái", render: (order) => <StatusBadge status={order.status} /> },
    { key: "action", header: "", className: "text-right", render: (order) => <div className="table-actions"><Link to={`/purchase/orders/${order.id}`}>Xem</Link>{order.status === "draft" && <>{!order.sourceSupplierQuotationId && <Link to={`/purchase/orders/${order.id}/edit`}>Sửa</Link>}<button disabled={actingId === order.id} onClick={() => void runAction(order, "submit")}>Gửi duyệt</button></>}{order.status === "pending_approval" && <button disabled={actingId === order.id} onClick={() => void runAction(order, "approve")}>Duyệt</button>}{order.status === "approved" && <button disabled={actingId === order.id} onClick={() => void runAction(order, "confirm")}>Xác nhận</button>}</div> },
  ];

  return <section className="sales-content"><div className="content-heading"><div><h2>Đơn mua hàng</h2><p>Soạn đơn, phê duyệt và xác nhận đặt hàng với nhà cung cấp.</p></div><Link className="primary-button compact" to="/purchase/orders/new">＋ Tạo đơn mua</Link></div><FilterBar searchValue={search} onSearchChange={setSearch} placeholder="Tìm số đơn mua hoặc nhà cung cấp..."><select className="filter-select" aria-label="Trạng thái đơn mua" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Tất cả trạng thái</option><option value="draft">Nháp</option><option value="pending_approval">Chờ duyệt</option><option value="approved">Đã duyệt</option><option value="confirmed">Đã xác nhận</option><option value="partially_completed">Đang nhận hàng</option><option value="completed">Hoàn tất</option></select></FilterBar><div className="list-panel"><DataTable columns={columns} rows={rows} emptyTitle="Không tìm thấy đơn mua" emptyDescription="Thử đổi điều kiện tìm kiếm hoặc tạo đơn mua mới." /></div></section>;
}
