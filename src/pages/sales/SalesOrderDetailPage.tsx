import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { EmptyState } from "../../components/ui/EmptyState";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useToast } from "../../components/ui/Toast";
import { formatVnd } from "../../data/mockData";
import { OrderDetail, SalesInvoice, mockApi } from "../../lib/mockApi";
import { DeliveryFormModal, PaymentFormModal } from "./SalesTransactionModals";

export function SalesOrderDetailPage() {
  const { documentId = "" } = useParams();
  const [detail, setDetail] = useState<OrderDetail | null | undefined>(null);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<SalesInvoice | null>(null);
  const [invoiceConfirm, setInvoiceConfirm] = useState(false);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [acting, setActing] = useState(false);
  const { showToast } = useToast();

  const load = useCallback(() => { void mockApi.sales.getOrderDetail(documentId).then(setDetail); }, [documentId]);
  useEffect(() => { load(); }, [load]);
  if (detail === null) return <section className="sales-content"><div className="detail-loading">Đang tải đơn bán...</div></section>;
  if (!detail) return <section className="sales-content"><EmptyState title="Không tìm thấy đơn bán" description="Chứng từ có thể đã bị xóa hoặc không tồn tại." actionLabel="Về danh sách đơn bán" onAction={() => window.history.back()} /></section>;

  const { order, customer } = detail;
  const stockLineIds = detail.lines.filter((line) => line.product.itemType !== "service").map((line) => line.id);
  const serviceOnly = stockLineIds.length === 0;
  const canDeliver = ["confirmed", "partially_completed", "partially_invoiced"].includes(order.status) && detail.lines.some((line) => line.product.itemType !== "service" && (line.fulfilledQuantity ?? 0) < line.quantity);
  const canInvoice = ["partially_completed", "completed", "partially_invoiced"].includes(order.status) || (serviceOnly && order.status === "confirmed");
  const hasPickList = detail.pickLists.some((pickList) => pickList.status !== "cancelled");

  const confirmOrder = async () => {
    setActing(true); const result = await mockApi.sales.confirmOrder(order.id); setActing(false);
    if (!result.entity) showToast(result.errors.form ?? "Không thể xác nhận đơn bán.", "error"); else { showToast(order.documentNo + " đã được xác nhận."); load(); }
  };
  const createPickList = async () => {
    setActing(true); const result = await mockApi.inventory.createPickList(order.id); setActing(false);
    if (!result.entity) showToast(result.errors.form ?? "Không thể tạo Pick List.", "error"); else { showToast(result.entity.documentNo + " đã được tạo. Mở Kho hàng để soạn."); load(); }
  };
  const createInvoice = async () => {
    setActing(true); const result = await mockApi.sales.createInvoiceFromDelivered(order.id); setActing(false); setInvoiceConfirm(false);
    if (!result.entity) showToast(result.errors.form ?? "Không thể lập hóa đơn.", "error"); else { showToast(result.entity.documentNo + " đã được lập."); load(); }
  };
  const cancelOrder = async () => {
    setActing(true); const result = await mockApi.sales.cancelOrder(order.id); setActing(false); setCancelConfirm(false);
    if (!result.entity) showToast(result.errors.form ?? "Không thể hủy đơn bán.", "error"); else { showToast(order.documentNo + " đã được hủy."); load(); }
  };

  return <section className="sales-content">
    <div className="detail-breadcrumb"><Link to="/sales/orders">Đơn bán</Link><span>/</span><strong>{order.documentNo}</strong></div>
    <div className="content-heading detail-heading">
      <div><div className="heading-with-badge"><h2>{order.documentNo}</h2><StatusBadge status={order.status} /></div><p>Ngày tạo {new Date(order.documentDate).toLocaleDateString("vi-VN")} · Giao dự kiến {order.requestedDeliveryDate ? new Date(order.requestedDeliveryDate).toLocaleDateString("vi-VN") : "-"}{order.sourceQuotationId ? " · Tạo từ báo giá" : ""}</p></div>
      <div className="detail-actions">
        {order.status === "draft" && <><Link className="secondary-button" to={"/sales/orders/" + order.id + "/edit"}>Sửa đơn</Link><button className="primary-button compact" disabled={acting} onClick={() => void confirmOrder()}>Xác nhận đơn</button></>}
        {canDeliver && !hasPickList && <button className="secondary-button" disabled={acting} onClick={() => void createPickList()}>Tạo Pick List</button>}
        {canDeliver && <button className="primary-button compact" onClick={() => setDeliveryOpen(true)}>Tạo phiếu giao</button>}
        {canInvoice && <button className="secondary-button" disabled={acting} onClick={() => setInvoiceConfirm(true)}>Lập hóa đơn</button>}
        {["draft", "confirmed"].includes(order.status) && <button className="text-danger-button" disabled={acting} onClick={() => setCancelConfirm(true)}>Hủy đơn</button>}
      </div>
    </div>
    <div className="order-overview-grid">
      <article className="detail-card"><span>Khách hàng</span><strong>{customer.name}</strong><p>{customer.code} · {customer.phone}<br />{customer.address}</p></article>
      <article className="detail-card"><span>Điều khoản thanh toán</span><strong>{customer.paymentTermDays} ngày</strong><p>Công nợ hiện tại: {formatVnd(customer.outstandingBalance)}<br />Hạn mức: {formatVnd(customer.creditLimit)}</p></article>
      <article className="detail-card amount-card"><span>Tổng giá trị đơn</span><strong>{formatVnd(order.totalAmount)}</strong><p>Đã thu: {formatVnd(order.paidAmount)}<br />Còn phải thu: {formatVnd(order.balanceAmount)}</p></article>
    </div>
    <article className="detail-section">
      <div className="section-heading"><div><h3>Dòng hàng</h3><p>Kho xuất: {order.warehouseId === "wh-hcm-main" ? "Kho thành phẩm Hồ Chí Minh" : order.warehouseId}</p></div></div>
      <div className="table-wrap"><table className="data-table"><thead><tr><th>Sản phẩm</th><th className="text-right">SL đặt</th><th className="text-right">Đã giao</th><th className="text-right">Tồn khả dụng</th><th className="text-right">Đơn giá</th><th className="text-right">Thành tiền</th></tr></thead><tbody>{detail.lines.map((line) => <tr key={line.id}><td><div className="cell-main"><strong>{line.product.name}</strong><span>{line.product.sku} · {line.unit}</span></div></td><td className="text-right">{line.quantity.toLocaleString("vi-VN")}</td><td className="text-right">{(line.fulfilledQuantity ?? 0).toLocaleString("vi-VN")}</td><td className="text-right">{line.product.itemType === "service" ? <span className="stock-neutral">Không quản lý</span> : <span className={line.availableQuantity < line.quantity - (line.fulfilledQuantity ?? 0) ? "stock-low" : "stock-ok"}>{line.availableQuantity.toLocaleString("vi-VN")}</span>}</td><td className="text-right">{formatVnd(line.unitPrice)}</td><td className="text-right"><strong>{formatVnd(line.lineTotal)}</strong></td></tr>)}</tbody></table></div>
      <div className="order-totals"><span>Tạm tính <strong>{formatVnd(order.subtotal)}</strong></span><span>Thuế GTGT <strong>{formatVnd(order.vatAmount)}</strong></span><span className="grand-total">Tổng cộng <strong>{formatVnd(order.totalAmount)}</strong></span></div>
    </article>
    <div className="order-detail-grid">
      <article className="detail-section"><div className="section-heading"><div><h3>Pick List</h3><p>Soạn hàng và phân bổ lô trước khi giao</p></div></div>{detail.pickLists.length ? <div className="transaction-list">{detail.pickLists.map((pickList) => <div className="transaction-row" key={pickList.id}><div className="transaction-icon">✓</div><div><strong>{pickList.documentNo}</strong><span>{pickList.lines.reduce((sum, line) => sum + line.requestedQuantity, 0).toLocaleString("vi-VN")} đơn vị · {pickList.pickedDate ? "Đã soạn " + new Date(pickList.pickedDate).toLocaleDateString("vi-VN") : "Chưa hoàn tất"}</span></div><StatusBadge status={pickList.status} /></div>)}</div> : <p className="inline-empty">Chưa tạo Pick List. Tạo sau khi đơn bán được xác nhận.</p>}</article>
      <article className="detail-section"><div className="section-heading"><div><h3>Giao hàng</h3><p>Phiếu giao phát sinh từ đơn bán</p></div></div>{detail.deliveries.length ? <div className="transaction-list">{detail.deliveries.map((delivery) => <div className="transaction-row" key={delivery.id}><div className="transaction-icon">▤</div><div><strong>{delivery.documentNo}</strong><span>Giao ngày {new Date(delivery.deliveryDate).toLocaleDateString("vi-VN")} · {delivery.lines.reduce((sum, line) => sum + line.deliveredQuantity, 0).toLocaleString("vi-VN")} đơn vị · Người nhận {delivery.recipientName}</span></div><StatusBadge status={delivery.status} /></div>)}</div> : <p className="inline-empty">Chưa có phiếu giao hàng.</p>}</article>
      <article className="detail-section"><div className="section-heading"><div><h3>Hóa đơn & thanh toán</h3><p>Theo dõi công nợ của đơn bán</p></div></div>{detail.invoices.length ? <div className="transaction-list">{detail.invoices.map((invoice) => <div className="transaction-row transaction-row-action" key={invoice.id}><div className="transaction-icon finance">₫</div><div><strong>{invoice.documentNo}</strong><span>Hạn thanh toán {new Date(invoice.dueDate).toLocaleDateString("vi-VN")} · Còn {formatVnd(invoice.balanceAmount)}</span></div><div className="transaction-actions"><StatusBadge status={invoice.status} />{invoice.balanceAmount > 0 && <button onClick={() => setPaymentInvoice(invoice)}>Thu tiền</button>}</div></div>)}{detail.payments.length > 0 && <div className="payment-history"><strong>Thanh toán đã ghi nhận</strong>{detail.payments.map((payment) => <span key={payment.id}>{payment.paymentNo} · {payment.methodName} · {formatVnd(payment.totalAmount)}</span>)}</div>}{detail.payments.length === 0 && <p className="inline-empty">Chưa ghi nhận thanh toán cho các hóa đơn này.</p>}</div> : <p className="inline-empty">Chưa lập hóa đơn bán hàng.</p>}</article>
    </div>
    <DeliveryFormModal isOpen={deliveryOpen} onClose={() => setDeliveryOpen(false)} order={order} customer={customer} stockLineIds={stockLineIds} onSaved={(delivery) => { showToast(delivery.documentNo + " đã được tạo."); load(); }} />
    <PaymentFormModal isOpen={Boolean(paymentInvoice)} onClose={() => setPaymentInvoice(null)} invoice={paymentInvoice} onSaved={(payment) => { showToast(payment.paymentNo + " đã được ghi nhận."); load(); }} />
    <ConfirmDialog isOpen={invoiceConfirm} title="Lập hóa đơn bán hàng" description={<>Hóa đơn sẽ được lập cho các dòng hàng đã giao nhưng chưa lập hóa đơn của <strong>{order.documentNo}</strong>.</>} confirmLabel={acting ? "Đang lập..." : "Lập hóa đơn"} onClose={() => setInvoiceConfirm(false)} onConfirm={() => void createInvoice()} />
    <ConfirmDialog isOpen={cancelConfirm} title="Hủy đơn bán" description={<>Bạn muốn hủy <strong>{order.documentNo}</strong>? Đơn đã thanh toán không thể hủy.</>} confirmLabel={acting ? "Đang hủy..." : "Hủy đơn"} onClose={() => setCancelConfirm(false)} onConfirm={() => void cancelOrder()} />
  </section>;
}
