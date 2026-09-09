import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Column, DataTable } from "../../components/ui/DataTable";
import { FilterBar } from "../../components/ui/FilterBar";
import { Modal } from "../../components/ui/Modal";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { formatVnd } from "../../data/mockData";
import { PaymentMethod, PurchaseInvoice, PurchasePayment, PurchasePaymentDraft, Supplier, mockApi } from "../../lib/mockApi";

const emptyDraft = (): PurchasePaymentDraft => ({ purchaseInvoiceId: "", paymentDate: "2026-08-29", methodId: "", totalAmount: 0, referenceNo: "" });

export function PurchasePaymentsPage() {
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>([]);
  const [payments, setPayments] = useState<PurchasePayment[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [draft, setDraft] = useState<PurchasePaymentDraft>(() => emptyDraft());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(() => {
    void Promise.all([
      mockApi.purchasing.getPurchaseInvoices(),
      mockApi.purchasing.getPurchasePayments(),
      mockApi.purchasing.getSuppliers(),
      mockApi.purchasing.getPaymentMethods(),
    ]).then(([invoiceRows, paymentRows, supplierRows, methodRows]) => {
      setInvoices(invoiceRows);
      setPayments(paymentRows);
      setSuppliers(supplierRows);
      setMethods(methodRows);
    });
  }, []);
  useEffect(() => { load(); }, [load]);

  const supplierById = useMemo(() => new Map(suppliers.map((supplier) => [supplier.id, supplier])), [suppliers]);
  const invoiceById = useMemo(() => new Map(invoices.map((invoice) => [invoice.id, invoice])), [invoices]);
  const payableInvoices = useMemo(() => invoices.filter((invoice) => invoice.status !== "cancelled" && invoice.balanceAmount > 0), [invoices]);
  const selectedInvoice = invoiceById.get(draft.purchaseInvoiceId);
  const outstandingAmount = payableInvoices.reduce((total, invoice) => total + invoice.balanceAmount, 0);
  const filteredInvoices = useMemo(() => payableInvoices.filter((invoice) => `${invoice.documentNo} ${invoice.supplierInvoiceNo} ${supplierById.get(invoice.supplierId)?.name ?? ""}`.toLowerCase().includes(search.toLowerCase())), [payableInvoices, search, supplierById]);

  const openPayment = (invoice?: PurchaseInvoice) => {
    const target = invoice ?? payableInvoices[0];
    setDraft({ ...emptyDraft(), purchaseInvoiceId: target?.id ?? "", paymentDate: target?.invoiceDate && target.invoiceDate > "2026-08-29" ? target.invoiceDate : "2026-08-29", totalAmount: target?.balanceAmount ?? 0, methodId: methods[0]?.id ?? "" });
    setErrors({});
    setModalOpen(true);
  };
  const selectInvoice = (purchaseInvoiceId: string) => {
    const invoice = payableInvoices.find((entry) => entry.id === purchaseInvoiceId);
    setDraft((current) => ({ ...current, purchaseInvoiceId, paymentDate: invoice?.invoiceDate && invoice.invoiceDate > current.paymentDate ? invoice.invoiceDate : current.paymentDate, totalAmount: invoice?.balanceAmount ?? 0 }));
  };
  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const result = await mockApi.purchasing.recordPurchasePayment(draft);
    setSaving(false);
    if (!result.entity) {
      setErrors(result.errors);
      showToast(result.errors.form ?? Object.values(result.errors)[0] ?? "Không thể ghi nhận thanh toán.", "error");
      return;
    }
    showToast(`${result.entity.paymentNo} đã được ghi nhận.`);
    setModalOpen(false);
    load();
  };

  const invoiceColumns: Column<PurchaseInvoice>[] = [
    { key: "invoice", header: "Hóa đơn", render: (invoice) => <div className="cell-main"><strong>{invoice.documentNo}</strong><span>HĐ NCC: {invoice.supplierInvoiceNo} · Hạn {new Date(invoice.dueDate).toLocaleDateString("vi-VN")}</span></div> },
    { key: "supplier", header: "Nhà cung cấp", render: (invoice) => supplierById.get(invoice.supplierId)?.name ?? invoice.supplierId },
    { key: "balance", header: "Còn phải trả", className: "text-right", render: (invoice) => <strong>{formatVnd(invoice.balanceAmount)}</strong> },
    { key: "status", header: "Trạng thái", render: (invoice) => <StatusBadge status={invoice.status} /> },
    { key: "action", header: "", className: "text-right", render: (invoice) => <button className="table-action-button" onClick={() => openPayment(invoice)}>Thanh toán</button> },
  ];
  const paymentColumns: Column<PurchasePayment>[] = [
    { key: "payment", header: "Phiếu chi", render: (payment) => <div className="cell-main"><strong>{payment.paymentNo}</strong><span>{new Date(payment.paymentDate).toLocaleDateString("vi-VN")} · {payment.methodName}{payment.referenceNo ? ` · ${payment.referenceNo}` : ""}</span></div> },
    { key: "invoice", header: "Hóa đơn mua", render: (payment) => <div className="cell-main"><strong>{invoiceById.get(payment.purchaseInvoiceId)?.documentNo ?? payment.purchaseInvoiceId}</strong><span>{supplierById.get(payment.supplierId)?.name ?? payment.supplierId}</span></div> },
    { key: "amount", header: "Số tiền", className: "text-right", render: (payment) => <strong>{formatVnd(payment.totalAmount)}</strong> },
    { key: "status", header: "Trạng thái", render: (payment) => <StatusBadge status={payment.status} /> },
  ];

  return <section className="sales-content">
    <div className="content-heading"><div><h2>Thanh toán nhà cung cấp</h2><p>Ghi nhận chi tiền theo từng hóa đơn mua, hỗ trợ thanh toán một phần.</p></div><button className="primary-button compact" disabled={!payableInvoices.length} onClick={() => openPayment()}>＋ Ghi nhận thanh toán</button></div>
    <div className="purchase-payable-summary"><article><span>Tổng còn phải trả</span><strong>{formatVnd(outstandingAmount)}</strong><small>{payableInvoices.length} hóa đơn cần xử lý</small></article><article><span>Đã chi trong phiên mock</span><strong>{formatVnd(payments.reduce((total, payment) => total + payment.totalAmount, 0))}</strong><small>{payments.length} phiếu chi đã ghi nhận</small></article></div>
    <FilterBar searchValue={search} onSearchChange={setSearch} placeholder="Tìm hóa đơn hoặc nhà cung cấp cần thanh toán..." />
    <div className="list-panel"><DataTable columns={invoiceColumns} rows={filteredInvoices} emptyTitle="Không còn hóa đơn cần thanh toán" emptyDescription="Mọi hóa đơn mua đang được thanh toán đủ hoặc chưa có công nợ." /></div>
    <div className="content-subheading"><div><h3>Lịch sử thanh toán</h3><p>Các phiếu chi phát sinh trong phiên mock hiện tại.</p></div><Link className="secondary-button" to="/purchase/invoices">Xem hóa đơn mua</Link></div>
    <div className="list-panel"><DataTable columns={paymentColumns} rows={payments} emptyTitle="Chưa có thanh toán" emptyDescription="Chọn một hóa đơn còn phải trả để ghi nhận phiếu chi." /></div>
    <Modal isOpen={modalOpen} title="Ghi nhận thanh toán nhà cung cấp" onClose={() => setModalOpen(false)}><form className="crm-form" onSubmit={save}>
      <p className="modal-description">Một phiếu chi chỉ phân bổ cho một hóa đơn. Bạn có thể thanh toán một phần và ghi nhận phần còn lại sau.</p>
      <label>Hóa đơn mua<select value={draft.purchaseInvoiceId} onChange={(event) => selectInvoice(event.target.value)}><option value="">Chọn hóa đơn cần thanh toán</option>{payableInvoices.map((invoice) => <option key={invoice.id} value={invoice.id}>{invoice.documentNo} · {supplierById.get(invoice.supplierId)?.name} · Còn {formatVnd(invoice.balanceAmount)}</option>)}</select>{errors.purchaseInvoiceId && <small className="field-error">{errors.purchaseInvoiceId}</small>}</label>
      {selectedInvoice && <div className="payment-balance"><span>Công nợ còn lại của {selectedInvoice.documentNo}</span><strong>{formatVnd(selectedInvoice.balanceAmount)}</strong></div>}
      <label>Ngày thanh toán<input type="date" value={draft.paymentDate} onChange={(event) => setDraft((current) => ({ ...current, paymentDate: event.target.value }))} />{errors.paymentDate && <small className="field-error">{errors.paymentDate}</small>}</label>
      <label>Phương thức thanh toán<select value={draft.methodId} onChange={(event) => setDraft((current) => ({ ...current, methodId: event.target.value }))}><option value="">Chọn phương thức</option>{methods.map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}</select>{errors.methodId && <small className="field-error">{errors.methodId}</small>}</label>
      <label>Số tiền thanh toán<input type="number" min="0" max={selectedInvoice?.balanceAmount ?? undefined} value={draft.totalAmount} onChange={(event) => setDraft((current) => ({ ...current, totalAmount: Number(event.target.value) }))} />{errors.totalAmount && <small className="field-error">{errors.totalAmount}</small>}</label>
      <label>Số tham chiếu (tùy chọn)<input value={draft.referenceNo ?? ""} placeholder="Ví dụ: UNC-20260829-001" onChange={(event) => setDraft((current) => ({ ...current, referenceNo: event.target.value }))} /></label>
      <div className="modal-actions"><button className="secondary-button" type="button" onClick={() => setModalOpen(false)}>Hủy</button><button className="primary-button compact" disabled={saving}>{saving ? "Đang ghi nhận..." : "Xác nhận thanh toán"}</button></div>
    </form></Modal>
  </section>;
}
