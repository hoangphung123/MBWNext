import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DataTable, Column } from "../../components/ui/DataTable";
import { FilterBar } from "../../components/ui/FilterBar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { formatVnd } from "../../data/mockData";
import { Customer, QuotationConversionReadiness, SalesDocument, SalesDocumentKind, mockApi } from "../../lib/mockApi";

function conversionErrorMessage(errors: Record<string, string>, includeSummary = true) {
  const details = [...new Set(Object.entries(errors).filter(([field]) => field !== "form").map(([, message]) => message))];
  if (details.length === 0) return errors.form ?? "Không thể cập nhật chứng từ.";
  return includeSummary && errors.form ? `${errors.form} ${details.join(" ")}` : details.join(" ");
}

export function SalesDocumentsPage({ kind }: { kind: SalesDocumentKind }) {
  const [documents, setDocuments] = useState<SalesDocument[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [conversionChecks, setConversionChecks] = useState<Record<string, QuotationConversionReadiness>>({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [actingId, setActingId] = useState<string | null>(null);
  const { showToast } = useToast();

  const load = useCallback(() => {
    const request = kind === "order" ? mockApi.sales.getOrders() : mockApi.sales.getQuotations();
    void Promise.all([request, mockApi.sales.getCustomers()]).then(async ([docs, customerRows]) => {
      setDocuments(docs);
      setCustomers(customerRows);

      if (kind !== "quotation") {
        setConversionChecks({});
        return;
      }

      const approvedQuotes = docs.filter((document) => document.status === "approved");
      const checks = await Promise.all(approvedQuotes.map(async (document) => [document.id, await mockApi.sales.getQuotationConversionReadiness(document.id)] as const));
      setConversionChecks(Object.fromEntries(checks));
    });
  }, [kind]);

  useEffect(() => { load(); }, [load]);

  const customerById = useMemo(() => new Map(customers.map((customer) => [customer.id, customer])), [customers]);
  const rows = useMemo(() => documents.filter((document) => `${document.documentNo} ${customerById.get(document.customerId)?.name ?? ""}`.toLowerCase().includes(search.toLowerCase()) && (status === "all" || document.status === status)), [documents, search, customerById, status]);

  const runAction = async (document: SalesDocument, action: "submit" | "approve" | "convert" | "confirm") => {
    setActingId(document.id);
    const result = action === "submit"
      ? await mockApi.sales.submitQuotation(document.id)
      : action === "approve"
        ? await mockApi.sales.approveQuotation(document.id)
        : action === "convert"
          ? await mockApi.sales.convertQuotationToOrder(document.id)
          : await mockApi.sales.confirmOrder(document.id);
    setActingId(null);

    if (!result.entity) {
      const errors = result.errors as Record<string, string>;
      showToast(action === "convert" ? conversionErrorMessage(errors) : errors.form ?? "Không thể cập nhật chứng từ.", "error");
      load();
      return;
    }

    const message = action === "submit"
      ? `${document.documentNo} đã gửi duyệt.`
      : action === "approve"
        ? `${document.documentNo} đã được duyệt.`
        : action === "convert"
          ? `Đã tạo ${result.entity.documentNo} từ ${document.documentNo}.`
          : `${document.documentNo} đã được xác nhận.`;
    showToast(message);
    load();
  };

  const columns: Column<SalesDocument>[] = [
    {
      key: "document",
      header: kind === "order" ? "Đơn bán" : "Báo giá",
      render: (document) => {
        const conversionCheck = conversionChecks[document.id];
        const warning = kind === "quotation" && document.status === "approved" && conversionCheck && !conversionCheck.canConvert
          ? conversionErrorMessage(conversionCheck.errors, false)
          : null;
        return <div className="cell-main"><strong>{document.documentNo}</strong><span>{new Date(document.documentDate).toLocaleDateString("vi-VN")}{document.sourceQuotationId ? " · Từ báo giá" : ""}</span>{warning && <span className="conversion-warning" title={warning}>⚠ Chưa thể tạo đơn: {warning}</span>}</div>;
      },
    },
    { key: "customer", header: "Khách hàng", render: (document) => <div className="cell-main"><strong>{customerById.get(document.customerId)?.name ?? "Chưa xác định"}</strong><span>{document.lines.length} dòng hàng</span></div> },
    { key: "amount", header: "Tổng tiền", className: "text-right", render: (document) => formatVnd(document.totalAmount) },
    { key: "status", header: "Trạng thái", render: (document) => <StatusBadge status={document.status} /> },
    {
      key: "action",
      header: "",
      className: "text-right",
      render: (document) => <div className="table-actions">
        {kind === "order" && <Link to={`/sales/orders/${document.id}`}>Xem</Link>}
        {document.status === "draft" && <Link to={`/sales/${kind === "order" ? "orders" : "quotations"}/${document.id}/edit`}>Sửa</Link>}
        {kind === "quotation" && document.status === "draft" && <button disabled={actingId === document.id} onClick={() => void runAction(document, "submit")}>Gửi duyệt</button>}
        {kind === "quotation" && document.status === "pending_approval" && <button disabled={actingId === document.id} onClick={() => void runAction(document, "approve")}>Duyệt</button>}
        {kind === "quotation" && document.status === "approved" && <button disabled={actingId === document.id} onClick={() => void runAction(document, "convert")}>Tạo đơn</button>}
        {kind === "order" && document.status === "draft" && <button disabled={actingId === document.id} onClick={() => void runAction(document, "confirm")}>Xác nhận</button>}
      </div>,
    },
  ];

  const title = kind === "order" ? "Đơn bán" : "Báo giá";
  const createPath = kind === "order" ? "/sales/orders/new" : "/sales/quotations/new";
  return <section className="sales-content"><div className="content-heading"><div><h2>{title}</h2><p>{kind === "order" ? "Xác nhận, giao hàng, lập hóa đơn và thu tiền từ đơn bán." : "Soạn, gửi duyệt và chuyển báo giá đã duyệt thành đơn bán."}</p></div><Link className="primary-button compact" to={createPath}>＋ Tạo {kind === "order" ? "đơn bán" : "báo giá"}</Link></div><FilterBar searchValue={search} onSearchChange={setSearch} placeholder={`Tìm số ${title.toLowerCase()} hoặc khách hàng...`}><select className="filter-select" aria-label={`Trạng thái ${title.toLowerCase()}`} value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Tất cả trạng thái</option><option value="draft">Nháp</option><option value="pending_approval">Chờ duyệt</option><option value="approved">Đã duyệt</option><option value="confirmed">Đã xác nhận</option><option value="partially_completed">Đang giao</option><option value="completed">Hoàn tất giao</option><option value="partially_invoiced">Đã lập một phần hóa đơn</option><option value="invoiced">Đã lập hóa đơn</option><option value="paid">Đã thanh toán</option><option value="converted">Đã chuyển đơn</option><option value="cancelled">Đã hủy</option></select></FilterBar><div className="list-panel"><DataTable columns={columns} rows={rows} emptyTitle={`Không tìm thấy ${title.toLowerCase()}`} emptyDescription="Thử đổi điều kiện tìm kiếm hoặc tạo chứng từ mới." /></div></section>;
}
