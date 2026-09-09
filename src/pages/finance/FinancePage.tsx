import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Column, DataTable } from "../../components/ui/DataTable";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { formatVnd } from "../../data/mockData";
import { FinanceDocument, FinanceOverview, FinancePayment, mockApi } from "../../lib/mockApi";

type LedgerView = "receivable" | "payable";

const formatDate = (value: string) => new Date(`${value}T00:00:00`).toLocaleDateString("vi-VN");

export function FinancePage() {
  const [overview, setOverview] = useState<FinanceOverview | null>(null);
  const [ledgerView, setLedgerView] = useState<LedgerView>("receivable");
  const load = useCallback(() => { void mockApi.finance.getOverview().then(setOverview); }, []);
  useEffect(() => { load(); }, [load]);

  const rows = useMemo(() => overview ? (ledgerView === "receivable" ? overview.receivables : overview.payables).filter((document) => document.status !== "cancelled") : [], [ledgerView, overview]);
  if (!overview) return <section className="sales-content"><div className="detail-loading">Đang tổng hợp dữ liệu tài chính...</div></section>;

  const outstandingReceivables = overview.receivables.filter((invoice) => invoice.status !== "cancelled" && invoice.balanceAmount > 0);
  const outstandingPayables = overview.payables.filter((invoice) => invoice.status !== "cancelled" && invoice.balanceAmount > 0);
  const dueTodayOrOverdue = outstandingReceivables.filter((invoice) => invoice.dueDate <= overview.asOfDate);
  const documentColumns: Column<FinanceDocument>[] = [
    { key: "document", header: "Hóa đơn", render: (document) => <div className="cell-main"><strong>{document.documentNo}</strong><span>{document.sourceDocumentNo ? `Nguồn ${document.sourceDocumentNo}` : "Chứng từ độc lập"} · Phát hành {formatDate(document.issueDate)}</span></div> },
    { key: "counterparty", header: ledgerView === "receivable" ? "Khách hàng" : "Nhà cung cấp", render: (document) => <div className="cell-main"><strong>{document.counterpartyName}</strong><span>Hạn thanh toán {formatDate(document.dueDate)}</span></div> },
    { key: "total", header: "Tổng tiền", className: "text-right", render: (document) => formatVnd(document.totalAmount) },
    { key: "balance", header: ledgerView === "receivable" ? "Còn phải thu" : "Còn phải trả", className: "text-right", render: (document) => <strong className={document.balanceAmount > 0 && document.dueDate < overview.asOfDate ? "finance-overdue-amount" : ""}>{formatVnd(document.balanceAmount)}</strong> },
    { key: "status", header: "Trạng thái", render: (document) => <StatusBadge status={document.status} /> },
  ];
  const paymentColumns: Column<FinancePayment>[] = [
    { key: "payment", header: "Phiếu thu / chi", render: (payment) => <div className="cell-main"><strong>{payment.paymentNo}</strong><span>{formatDate(payment.paymentDate)} · {payment.methodName}{payment.referenceNo ? ` · ${payment.referenceNo}` : ""}</span></div> },
    { key: "direction", header: "Loại", render: (payment) => <span className={`cashflow-direction ${payment.direction}`}>{payment.direction === "incoming" ? "Thu tiền" : "Chi tiền"}</span> },
    { key: "counterparty", header: "Đối tượng", render: (payment) => <div className="cell-main"><strong>{payment.counterpartyName}</strong><span>{payment.sourceDocumentNo ? `Phân bổ ${payment.sourceDocumentNo}` : "Chưa phân bổ"}</span></div> },
    { key: "amount", header: "Số tiền", className: "text-right", render: (payment) => <strong className={payment.direction === "incoming" ? "cashflow-incoming" : "cashflow-outgoing"}>{payment.direction === "incoming" ? "+" : "−"}{formatVnd(payment.totalAmount)}</strong> },
    { key: "status", header: "Trạng thái", render: (payment) => <StatusBadge status={payment.status} /> },
  ];

  return <section className="sales-content finance-page">
    <div className="content-heading">
      <div><h2>Tài chính – Kế toán</h2><p>Tổng hợp công nợ và dòng tiền từ hóa đơn, phiếu thu và phiếu chi của các luồng bán hàng/mua hàng.</p></div>
      <div className="detail-actions"><Link className="secondary-button" to="/purchase/payments">Phiếu chi NCC</Link><Link className="primary-button compact" to="/sales/orders">Theo dõi đơn bán</Link></div>
    </div>

    <div className="finance-summary">
      <article><span>Tiền gửi ngân hàng</span><strong>{formatVnd(overview.cashBalance)}</strong><small>Số dư mock hiện tại, đã phản ánh phiếu thu/chi trong phiên này.</small></article>
      <article><span>Phải thu khách hàng</span><strong>{formatVnd(overview.receivableBalance)}</strong><small>{outstandingReceivables.length} hóa đơn còn phải thu</small></article>
      <article><span>Phải trả nhà cung cấp</span><strong>{formatVnd(overview.payableBalance)}</strong><small>{outstandingPayables.length} hóa đơn còn phải trả</small></article>
      <article className="warning"><span>Phải thu quá hạn</span><strong>{formatVnd(overview.overdueReceivableBalance)}</strong><small>{dueTodayOrOverdue.length} hóa đơn cần nhắc thu tiền</small></article>
    </div>

    {overview.overdueReceivableBalance > 0 && <div className="finance-alert"><div><strong>Cần xử lý công nợ quá hạn</strong><span>{formatVnd(overview.overdueReceivableBalance)} đã đến hạn hoặc quá hạn tại ngày {formatDate(overview.asOfDate)}.</span></div><button className="secondary-button" onClick={() => setLedgerView("receivable")}>Xem phải thu</button></div>}

    <div className="finance-grid">
      <article className="detail-section finance-ledger-section">
        <div className="section-heading"><div><h3>Hóa đơn & công nợ</h3><p>Theo dõi số tiền còn mở của từng chứng từ.</p></div><div className="finance-ledger-tabs"><button className={ledgerView === "receivable" ? "active" : ""} onClick={() => setLedgerView("receivable")}>Phải thu ({outstandingReceivables.length})</button><button className={ledgerView === "payable" ? "active" : ""} onClick={() => setLedgerView("payable")}>Phải trả ({outstandingPayables.length})</button></div></div>
        <DataTable columns={documentColumns} rows={rows} emptyTitle="Chưa có hóa đơn" emptyDescription="Hóa đơn sẽ xuất hiện sau khi nghiệp vụ bán hàng hoặc mua hàng được xác nhận." />
      </article>
      <article className="detail-section finance-cashflow-section">
        <div className="section-heading"><div><h3>Dòng tiền đã ghi nhận</h3><p>Phiếu thu và chi, bao gồm lịch sử mẫu cùng giao dịch của phiên hiện tại.</p></div></div>
        <div className="finance-payment-list">{overview.payments.slice(0, 6).map((payment) => <div className="finance-payment-row" key={payment.id}><span className={`transaction-icon ${payment.direction === "incoming" ? "finance-income" : "finance-expense"}`}>{payment.direction === "incoming" ? "↓" : "↑"}</span><div><strong>{payment.counterpartyName}</strong><span>{payment.paymentNo} · {formatDate(payment.paymentDate)}<br />{payment.sourceDocumentNo ? `Phân bổ ${payment.sourceDocumentNo}` : "Chưa phân bổ hóa đơn"}</span></div><b className={payment.direction === "incoming" ? "cashflow-incoming" : "cashflow-outgoing"}>{payment.direction === "incoming" ? "+" : "−"}{formatVnd(payment.totalAmount)}</b></div>)}</div>
      </article>
    </div>

    <div className="content-subheading"><div><h3>Nhật ký kế toán</h3><p>Các bút toán đã ghi sổ của chứng từ nguồn trong dữ liệu mock.</p></div></div>
    <div className="list-panel"><DataTable columns={[
      { key: "entry", header: "Số bút toán", render: (entry) => <div className="cell-main"><strong>{entry.entryNo}</strong><span>Nguồn {entry.sourceDocumentNo}</span></div> },
      { key: "date", header: "Ngày hạch toán", render: (entry) => formatDate(entry.postingDate) },
      { key: "debit", header: "Tổng nợ", className: "text-right", render: (entry) => formatVnd(entry.debitAmount) },
      { key: "credit", header: "Tổng có", className: "text-right", render: (entry) => formatVnd(entry.creditAmount) },
      { key: "status", header: "Trạng thái", render: (entry) => <StatusBadge status={entry.status} /> },
    ]} rows={overview.journalEntries} emptyTitle="Chưa có bút toán" emptyDescription="Bút toán sẽ xuất hiện khi chứng từ được ghi sổ." /></div>
  </section>;
}
