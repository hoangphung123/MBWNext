import { mbwNextMockData } from "../data/mockData";
import { activeEmployeeId, activeRole, activeUser, can, canAccessWarehouse, isSelfServiceOnly, PermissionAction, PermissionModule } from "./accessControl";

type Metric = { key: string; label: string; value: number; previousValue: number; format: "currency" | "number"; trend: "up" | "down"; trendPercent: number };
export type DashboardOverview = { period: { from: string; to: string; label: string }; metrics: Metric[]; revenueByDay: Array<{ date: string; sales: number; target: number }>; salesByChannel: Array<{ channel: string; revenue: number; percentage: number }>; recentActivities: Array<{ id: string; at: string; actor: string; action: string; reference: string }>; approvals: Array<{ id: string; documentNo: string; title: string; requestedBy: string; submittedAt: string; amount: number; currentStep: number; totalSteps: number }>; lowStockAlerts: Array<{ itemId: string; itemName: string; warehouseId: string; onHand: number; reorderLevel: number; shortage: number; severity: "high" | "medium" }> };
export type Lead = { id: string; code: string; fullName: string; companyName: string; phone: string; email: string; source: string; status: "new" | "contacted" | "qualified" | "converted" | "lost"; score: number; ownerId: string; createdAt: string; lostReason?: string };
export type Customer = { id: string; code: string; name: string; taxCode: string; phone: string; email: string; address: string; creditLimit: number; outstandingBalance: number; paymentTermDays: number; assignedSalesperson: string; status: "active" | "inactive" };
export type OpportunityStage = "qualification" | "proposal" | "negotiation" | "won" | "lost";
export type Opportunity = { id: string; code: string; leadId: string | null; customerId: string | null; name: string; stage: OpportunityStage; probability: number; expectedValue: number; expectedCloseDate: string; ownerId: string; status: "open" | "won" | "lost"; lostReason?: string };
export type CrmActivityType = "call" | "email" | "meeting" | "task" | "note";
export type CrmActivityStatus = "planned" | "completed" | "cancelled";
export type CrmActivity = { id: string; type: CrmActivityType; subject: string; description?: string; scheduledAt: string; assignedTo: string; status: CrmActivityStatus; result?: string; cancellationReason?: string; completedAt?: string; createdAt?: string; customerId?: string | null; leadId?: string | null; opportunityId?: string | null };
export type CrmActivityDraft = { type: CrmActivityType; subject: string; description?: string; scheduledAt: string; assignedTo: string; customerId?: string | null; leadId?: string | null; opportunityId?: string | null };
export type CrmActivityFormOptions = { leads: Lead[]; customers: Customer[]; opportunities: Opportunity[] };
export type Product = { id: string; sku: string; name: string; unit: string; costPrice: number; sellingPrice: number; vatRate: number; itemType: string; trackBatch: boolean; reorderLevel: number; status: string };
export type Warehouse = { id: string; code: string; name: string; branchId: string; warehouseType: string; status: string };
export type PaymentMethod = { id: string; code: string; name: string; type: string; isActive: boolean };
export type SalesDocumentKind = "quotation" | "order";
export type SalesDocumentLine = { id: string; itemId: string; description: string; unit: string; quantity: number; fulfilledQuantity?: number; unitPrice: number; discountAmount: number; vatRate: number; lineTotal: number };
export type SalesDocument = { id: string; documentNo: string; kind: SalesDocumentKind; customerId: string; opportunityId?: string | null; sourceQuotationId?: string | null; status: string; documentDate: string; validUntil?: string; requestedDeliveryDate?: string; warehouseId?: string; subtotal: number; discountAmount: number; vatAmount: number; totalAmount: number; paidAmount: number; balanceAmount: number; lines: SalesDocumentLine[] };
export type DeliveryLine = { salesOrderLineId: string; itemId: string; deliveredQuantity: number; batchNo?: string };
export type Delivery = { id: string; documentNo: string; salesOrderId: string; status: "completed" | "cancelled"; deliveryDate: string; recipientName: string; recipientPhone: string; lines: DeliveryLine[] };
export type InvoiceLine = SalesDocumentLine & { salesOrderLineId: string };
export type SalesInvoice = { id: string; documentNo: string; salesOrderId: string; customerId: string; status: "approved" | "partially_paid" | "paid" | "overdue" | "cancelled"; issueDate: string; dueDate: string; subtotal: number; discountAmount: number; vatAmount: number; totalAmount: number; paidAmount: number; balanceAmount: number; lines: InvoiceLine[] };
export type Payment = { id: string; paymentNo: string; invoiceId: string; paymentDate: string; totalAmount: number; status: "completed"; methodId: string; methodName: string };
export type FinanceDocument = { id: string; documentNo: string; direction: "receivable" | "payable"; counterpartyId: string; counterpartyName: string; sourceDocumentNo?: string; status: string; issueDate: string; dueDate: string; totalAmount: number; paidAmount: number; balanceAmount: number };
export type FinancePayment = { id: string; paymentNo: string; direction: "incoming" | "outgoing"; counterpartyName: string; paymentDate: string; methodName: string; sourceDocumentNo?: string; referenceNo?: string; totalAmount: number; status: "completed" };
export type FinanceJournalEntry = { id: string; entryNo: string; postingDate: string; sourceDocumentNo: string; status: string; debitAmount: number; creditAmount: number };
export type FinanceOverview = { asOfDate: string; cashBalance: number; receivableBalance: number; payableBalance: number; overdueReceivableBalance: number; receivables: FinanceDocument[]; payables: FinanceDocument[]; payments: FinancePayment[]; journalEntries: FinanceJournalEntry[] };
export type OrderDetail = { order: SalesDocument; customer: Customer; lines: Array<SalesDocumentLine & { product: Product; availableQuantity: number }>; deliveries: Delivery[]; invoices: SalesInvoice[]; payments: Payment[]; pickLists: PickList[] };
export type SalesDocumentDraft = { id?: string; kind: SalesDocumentKind; customerId: string; warehouseId: string; documentDate: string; validUntil?: string; requestedDeliveryDate?: string; lines: Array<{ itemId: string; quantity: number; unitPrice: number; discountAmount: number }> };
export type SalesValidation = { errors: Record<string, string>; subtotal: number; vatAmount: number; totalAmount: number; availableByLine: number[] };
export type SalesFormOptions = { customers: Customer[]; products: Product[]; warehouses: Warehouse[]; stockAvailability: Array<{ itemId: string; warehouseId: string; availableQuantity: number }> };
export type LeadDraft = Omit<Lead, "id" | "code" | "createdAt">;
export type CustomerDraft = Omit<Customer, "id" | "code">;
export type OpportunityDraft = Omit<Opportunity, "id" | "code">;
export type CrmFormOptions = { leads: Lead[]; customers: Customer[] };
export type Customer360 = { customer: Customer; opportunities: Opportunity[]; quotations: SalesDocument[]; orders: SalesDocument[]; invoices: SalesInvoice[]; payments: Payment[]; activities: CrmActivity[]; summary: { quotationAmount: number; orderAmount: number; invoicedAmount: number; paidAmount: number; openOpportunityAmount: number } };
export type DeliveryDraft = { recipientName: string; recipientPhone: string; deliveryDate: string; lines: Array<{ salesOrderLineId: string; deliveredQuantity: number; batchNo?: string }> };
export type PaymentDraft = { paymentDate: string; methodId: string; totalAmount: number };
export type Supplier = { id: string; code: string; name: string; taxCode: string; phone: string; email: string; address: string; status: "active" | "inactive"; paymentTermDays: number; rating: number };
export type PurchaseRequestStatus = "draft" | "pending_approval" | "approved" | "converted" | "cancelled";
export type PurchaseRequestLine = { id: string; itemId: string; description: string; unit: string; quantity: number; unitPrice: number; lineTotal: number };
export type PurchaseRequest = { id: string; documentNo: string; status: PurchaseRequestStatus; requestDate: string; requiredDate: string; requestedBy: string; requestingDepartment: string; warehouseId: string; estimatedAmount: number; lines: PurchaseRequestLine[] };
export type PurchaseRequestDraft = { id?: string; requestingDepartment: string; warehouseId: string; requestDate: string; requiredDate: string; lines: Array<{ itemId: string; quantity: number; unitPrice: number }> };
export type PurchaseRequestValidation = { errors: Record<string, string>; estimatedAmount: number };
export type RequestForQuotationStatus = "draft" | "sent" | "overdue" | "closed" | "cancelled";
export type RequestForQuotation = { id: string; documentNo: string; sourcePurchaseRequestId?: string | null; selectedSupplierQuotationId?: string | null; status: RequestForQuotationStatus; rfqDate: string; deadline: string; warehouseId: string; supplierIds: string[]; lines: PurchaseRequestLine[] };
export type SupplierQuotationStatus = "draft" | "approved" | "rejected" | "converted";
export type SupplierQuotationLine = PurchaseRequestLine & { discountAmount: number; vatRate: number };
export type SupplierQuotation = { id: string; documentNo: string; rfqId?: string; rfqNo: string; supplierId: string; status: SupplierQuotationStatus; validUntil: string; leadTimeDays: number; totalAmount: number; lines: SupplierQuotationLine[] };
export type SupplierQuotationDraft = { rfqId: string; supplierId: string; validUntil: string; leadTimeDays: number; lines: Array<{ itemId: string; quantity: number; unitPrice: number; discountAmount: number }> };
export type PurchaseOrderLine = { id: string; itemId: string; description: string; unit: string; quantity: number; receivedQuantity: number; unitPrice: number; discountAmount: number; vatRate: number; lineTotal: number };
export type PurchaseOrder = { id: string; documentNo: string; supplierId: string; sourcePurchaseRequestId?: string | null; sourceRfqId?: string | null; sourceSupplierQuotationId?: string | null; amendsPurchaseOrderId?: string | null; status: string; orderDate: string; expectedReceiptDate: string; warehouseId: string; subtotal: number; discountAmount: number; vatAmount: number; totalAmount: number; lines: PurchaseOrderLine[] };
export type PurchaseOrderDraft = { id?: string; supplierId: string; warehouseId: string; orderDate: string; expectedReceiptDate: string; lines: Array<{ itemId: string; quantity: number; unitPrice: number; discountAmount: number }> };
export type PurchaseValidation = { errors: Record<string, string>; subtotal: number; vatAmount: number; totalAmount: number };
export type PurchaseFormOptions = { suppliers: Supplier[]; products: Product[]; warehouses: Warehouse[] };
export type PurchaseReceiptLine = { id?: string; purchaseOrderLineId: string; itemId: string; quantity: number; rejectedQuantity?: number; rejectionReason?: string; batchNo?: string; manufacturingDate?: string; expiryDate?: string };
export type PurchaseReceiptDraft = { receivedDate: string; lines: PurchaseReceiptLine[] };
export type PurchaseReceipt = { id: string; documentNo: string; purchaseOrderId: string; status: "completed"; receivedDate: string; warehouseId: string; lines: Array<PurchaseReceiptLine & { description: string; unit: string; unitPrice: number; discountAmount: number; vatRate: number }> };
export type PurchaseReturnDraft = { purchaseReceiptId: string; returnDate: string; reason: string; lines: Array<{ purchaseReceiptLineId: string; quantity: number; batchNo?: string }> };
export type PurchaseReturn = { id: string; documentNo: string; purchaseReceiptId: string; purchaseOrderId: string; warehouseId: string; returnDate: string; reason: string; status: "completed"; lines: Array<{ purchaseReceiptLineId: string; purchaseOrderLineId: string; itemId: string; description: string; unit: string; quantity: number; batchNo?: string }> };
export type PurchaseInvoiceStatus = "draft" | "approved" | "partially_paid" | "paid" | "adjusted" | "cancelled";
export type PurchaseInvoiceLine = { purchaseReceiptLineId: string; itemId: string; description: string; unit: string; quantity: number; unitPrice: number; discountAmount: number; vatRate: number; lineTotal: number };
export type PurchaseInvoice = { id: string; documentNo: string; supplierInvoiceNo: string; attachmentName?: string; purchaseReceiptId: string; purchaseOrderId: string; supplierId: string; status: PurchaseInvoiceStatus; invoiceDate: string; dueDate: string; cancellationReason?: string; subtotal: number; discountAmount: number; vatAmount: number; totalAmount: number; paidAmount: number; adjustedAmount: number; balanceAmount: number; lines: PurchaseInvoiceLine[] };
export type PurchaseInvoiceDraft = { purchaseReceiptId: string; supplierInvoiceNo: string; attachmentName?: string; invoiceDate: string; dueDate: string; lines: Array<{ purchaseReceiptLineId: string; quantity: number }> };
export type PurchaseInvoiceAdjustmentDraft = { purchaseInvoiceId: string; adjustmentDate: string; amount: number; reason: string };
export type PurchaseInvoiceAdjustment = { id: string; adjustmentNo: string; purchaseInvoiceId: string; adjustmentDate: string; amount: number; reason: string; status: "completed" };
export type PurchasePaymentDraft = { purchaseInvoiceId: string; paymentDate: string; methodId: string; totalAmount: number; referenceNo?: string };
export type PurchasePayment = { id: string; paymentNo: string; purchaseInvoiceId: string; supplierId: string; paymentDate: string; methodId: string; methodName: string; totalAmount: number; referenceNo?: string; status: "completed" };
export type PurchaseInvoiceCandidate = { receipt: PurchaseReceipt; order: PurchaseOrder; supplier: Supplier; totalAmount: number };
export type PurchaseOrderDetail = { order: PurchaseOrder; supplier: Supplier; warehouse: Warehouse; receipts: PurchaseReceipt[]; invoices: PurchaseInvoice[] };
export type ManufacturingBomLine = { id: string; itemId: string; quantity: number; unit: string; scrapRate: number };
export type ManufacturingBom = { id: string; bomNo: string; outputItemId: string; outputQuantity: number; unit: string; status: "active" | "inactive"; effectiveFrom: string; lines: ManufacturingBomLine[] };
export type ManufacturingWorkOrderStatus = "planned" | "in_progress" | "completed" | "cancelled";
export type ManufacturingWorkOrder = { id: string; workOrderNo: string; bomId: string; outputItemId: string; inputWarehouseId: string; outputWarehouseId: string; plannedQuantity: number; completedQuantity: number; rejectedQuantity: number; plannedStartDate: string; plannedEndDate: string; status: ManufacturingWorkOrderStatus; sourceSalesOrderId?: string | null; progressPercent: number };
export type ManufacturingJobCard = { id: string; workOrderId: string; workCenterId: string; operation: string; assignedEmployeeIds: string[]; startedAt: string; endedAt: string | null; completedQuantity: number; rejectedQuantity: number; status: "planned" | "in_progress" | "completed" | "cancelled" };
export type ManufacturingWorkOrderDraft = { bomId: string; inputWarehouseId: string; outputWarehouseId: string; plannedQuantity: number; plannedStartDate: string; plannedEndDate: string; sourceSalesOrderId?: string };
export type ManufacturingCompletionDraft = { workOrderId: string; completionDate: string; completedQuantity: number; rejectedQuantity: number; batchNo?: string };
export type ManufacturingFormOptions = { boms: ManufacturingBom[]; warehouses: Warehouse[]; stockBalances: StockBalanceView[] };
export type ManufacturingOverview = { boms: ManufacturingBom[]; workOrders: ManufacturingWorkOrder[]; jobCards: ManufacturingJobCard[]; workCenters: Array<{ id: string; code: string; name: string; hourlyCapacity: number; hourlyCost: number; status: string }>; products: Product[]; warehouses: Warehouse[]; stockBalances: StockBalanceView[] };
export type HrEmployee = { id: string; employeeNo: string; fullName: string; department: string; title: string; joinDate: string; status: "active" | "on_leave" | "inactive"; email: string };
export type AttendanceRecord = { id: string; employeeId: string; workDate: string; checkIn?: string; checkOut?: string; status: "present" | "late" | "absent" | "on_leave"; note?: string; adjustedBy?: string; adjustedAt?: string };
export type AttendanceAdjustmentDraft = { employeeId: string; checkIn?: string; checkOut?: string; reason: string };
export type LeaveRequest = { id: string; requestNo: string; employeeId: string; leaveType: "annual" | "sick" | "unpaid"; fromDate: string; toDate: string; totalDays: number; reason: string; status: "pending" | "approved" | "rejected"; decidedBy?: string; decidedAt?: string };
export type SalaryStructure = { id: string; code: string; name: string; baseSalary: number; allowanceAmount: number; insuranceRate: number; status: "active" | "inactive" };
export type EmploymentContract = { id: string; contractNo: string; employeeId: string; salaryStructureId: string; startDate: string; endDate: string; status: "active" | "expired" | "terminated" };
export type PayrollStatus = "draft" | "approved" | "paid";
export type PayrollLine = { id: string; employeeId: string; baseSalary: number; allowanceAmount: number; grossAmount: number; deductionAmount: number; netAmount: number; scheduledWorkdays?: number; payableWorkdays?: number; unpaidLeaveDays?: number };
export type PayrollEntry = { id: string; payrollNo: string; period: string; paymentDate?: string; status: PayrollStatus; lines: PayrollLine[]; totalGross: number; totalDeduction: number; totalNet: number; createdBy?: string; approvedBy?: string; paidBy?: string };
export type PayrollDraft = { period: string; paymentDate: string };
export type EmploymentContractDraft = { employeeId: string; salaryStructureId: string; startDate: string; endDate: string };
export type HrOverview = { asOfDate: string; employees: HrEmployee[]; attendance: AttendanceRecord[]; leaveRequests: LeaveRequest[]; salaryStructures: SalaryStructure[]; contracts: EmploymentContract[]; payrollEntries: PayrollEntry[] };
export type EmployeeSelfServiceOverview = { asOfDate: string; employee: HrEmployee; attendance: AttendanceRecord; leaveRequests: LeaveRequest[] };
export type PosProfile = { id: string; code: string; name: string; storeName: string; warehouseId: string; status: "active" | "inactive" };
export type PosShift = { id: string; shiftNo: string; profileId: string; cashierName: string; openedAt: string; closedAt?: string; openingCash: number; expectedCash: number; actualCash?: number; difference?: number; status: "open" | "closed" };
export type PosInvoice = { id: string; receiptNo: string; shiftId: string; postedAt: string; subtotal: number; vatAmount: number; totalAmount: number; paymentMethodName: string; lines: Array<{ itemId: string; name: string; quantity: number; unitPrice: number }> };
export type PosCheckoutDraft = { profileId: string; paymentMethodId: string; lines: Array<{ itemId: string; quantity: number }> };
export type PosOverview = { profiles: PosProfile[]; shifts: PosShift[]; invoices: PosInvoice[]; products: Product[]; paymentMethods: PaymentMethod[]; stockBalances: StockBalanceView[] };
export type ProjectStatus = "not_started" | "in_progress" | "on_hold" | "completed" | "cancelled";
export type ProjectPriority = "low" | "medium" | "high" | "critical";
export type ProjectTask = { id: string; projectId: string; code: string; title: string; assigneeId: string; assigneeName: string; startDate: string; dueDate: string; status: "not_started" | "in_progress" | "completed"; progressPercent: number; priority: ProjectPriority; isMilestone: boolean; predecessorIds: string[]; predecessorNames: string[]; comments: Array<{ id: string; author: string; message: string; createdAt: string }>; attachments: Array<{ id: string; name: string; addedBy: string; addedAt: string }> };
export type Project = { id: string; code: string; name: string; customerId?: string; customerName?: string; managerId: string; managerName: string; teamMemberIds: string[]; teamMemberNames: string[]; startDate: string; endDate: string; budgetAmount: number; actualCost: number; laborCost: number; actualRevenue: number; budgetRemaining: number; budgetUtilization: number; status: ProjectStatus; progressPercent: number };
export type ProjectTimesheetStatus = "submitted" | "approved" | "rejected";
export type ProjectTimesheet = { id: string; projectId: string; taskId: string; taskTitle: string; employeeId: string; employeeName: string; workDate: string; hours: number; status: ProjectTimesheetStatus; note: string; createdByEmployeeId?: string; decidedBy?: string; decidedAt?: string; decisionReason?: string };
export type ProjectFinancialEntry = { id: string; projectId: string; postingDate: string; entryType: "expense" | "revenue"; sourceDocumentNo: string; description: string; amount: number };
export type ProjectTimesheetDraft = { projectId: string; taskId: string; employeeId: string; workDate: string; hours: number; note: string };
export type ProjectFinancialSource = { documentNo: string; entryType: "expense" | "revenue"; postingDate: string; description: string; amount: number; customerId?: string };
export type ProjectFinancialEntryDraft = { projectId: string; sourceDocumentNo: string };
export type ProjectDraft = { id?: string; name: string; customerId: string; managerId: string; teamMemberIds: string[]; startDate: string; endDate: string; budgetAmount: number; status: ProjectStatus };
export type ProjectTaskDraft = { id?: string; projectId: string; title: string; assigneeId: string; startDate: string; dueDate: string; priority: ProjectPriority; isMilestone: boolean; predecessorIds: string[] };
export type ProjectActivity = { id: string; projectId: string; at: string; actor: string; action: string; detail: string };
export type ProjectOverview = { projects: Project[]; tasks: ProjectTask[]; timesheets: ProjectTimesheet[]; financialEntries: ProjectFinancialEntry[]; financialSources: ProjectFinancialSource[]; activities: ProjectActivity[]; employees: HrEmployee[]; customers: Customer[] };
export type StockBalanceView = { id: string; itemId: string; warehouseId: string; quantityOnHand: number; reservedQuantity: number; availableQuantity: number; averageCost: number; stockValue: number; updatedAt: string; item: Product; warehouse: Warehouse };
export type StockBatchView = { id: string; itemId: string; warehouseId: string; batchNo: string; manufacturingDate?: string; expiryDate?: string; quantityOnHand: number; qualityStatus: string; item: Product; warehouse: Warehouse };
export type InventoryMovement = { id: string; referenceNo: string; movementType: "purchase_receipt" | "purchase_return" | "sales_delivery" | "pos_sale" | "transfer_in" | "transfer_out" | "adjustment_in" | "adjustment_out" | "sales_return" | "qc_release_in" | "qc_release_out" | "qc_scrap" | "manufacturing_consumption" | "manufacturing_receipt"; itemId: string; warehouseId: string; quantity: number; postingDate: string; description: string };
export type InventoryTransferDraft = { fromWarehouseId: string; toWarehouseId: string; transferDate: string; lines: Array<{ itemId: string; quantity: number; batchNo?: string }> };
export type InventoryTransfer = { id: string; documentNo: string; status: "completed"; fromWarehouseId: string; toWarehouseId: string; transferDate: string; lines: Array<{ itemId: string; quantity: number; unit: string; batchNo?: string }> };
export type InventoryAdjustmentReason = "stocktake_gain" | "stocktake_loss" | "damaged" | "expired" | "opening_balance";
export type InventoryAdjustmentDraft = { warehouseId: string; adjustmentDate: string; reason: InventoryAdjustmentReason; note: string; lines: Array<{ itemId: string; quantityDelta: number; batchNo?: string }> };
export type InventoryAdjustment = { id: string; documentNo: string; status: "completed"; warehouseId: string; adjustmentDate: string; reason: InventoryAdjustmentReason; note: string; lines: Array<{ itemId: string; quantityDelta: number; unit: string; batchNo?: string }> };
export type SalesReturnDraft = { deliveryId: string; returnDate: string; returnWarehouseId: string; reason: string; lines: Array<{ salesOrderLineId: string; quantity: number; batchNo?: string }> };
export type SalesReturn = { id: string; documentNo: string; status: "completed"; deliveryId: string; salesOrderId: string; customerId: string; returnDate: string; returnWarehouseId: string; reason: string; lines: Array<{ salesOrderLineId: string; itemId: string; quantity: number; unit: string; batchNo?: string }> };
export type ReturnableDelivery = { delivery: Delivery; order: SalesDocument; customer: Customer; lines: Array<DeliveryLine & { product: Product; returnedQuantity: number; returnableQuantity: number }> };
export type VirtualStockProcessDraft = { sourceWarehouseId: string; targetWarehouseId?: string; action: "release" | "scrap"; processDate: string; reason: string; lines: Array<{ itemId: string; quantity: number; batchNo?: string }> };
export type VirtualStockProcess = { id: string; documentNo: string; status: "completed"; sourceWarehouseId: string; targetWarehouseId?: string; action: "release" | "scrap"; processDate: string; reason: string; lines: Array<{ itemId: string; quantity: number; unit: string; batchNo?: string }> };
export type PickListStatus = "ready" | "in_progress" | "picked" | "cancelled";
export type PickListLine = { salesOrderLineId: string; itemId: string; description: string; unit: string; requestedQuantity: number; pickedQuantity: number; batchNo?: string };
export type PickList = { id: string; documentNo: string; salesOrderId: string; warehouseId: string; status: PickListStatus; createdDate: string; pickedDate?: string; lines: PickListLine[] };
export type PickListCompletionDraft = { pickDate: string; lines: Array<{ salesOrderLineId: string; pickedQuantity: number; batchNo?: string }> };
export type MutationResult<T> = { entity: T | null; errors: Record<string, string> };
export type QuotationConversionReadiness = { canConvert: boolean; errors: Record<string, string> };
type StockBatchRecord = Omit<StockBatchView, "item" | "warehouse">;
type JournalLine = { accountCode: string; debit: number; credit: number };
type JournalEntryRecord = { id: string; entryNo: string; postingDate: string; sourceDocumentNo: string; status: "posted"; lines: JournalLine[] };

const data = mbwNextMockData as any;
const now = "2026-08-29";
const localDateKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const hrToday = () => localDateKey();
const currentTime = () => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" }).format(new Date());
const currentActor = () => activeUser()?.email ?? activeRole();
const clone = <T,>(value: T): T => value === undefined ? value : JSON.parse(JSON.stringify(value)) as T;
const respond = <T,>(payload: T, delay = 180): Promise<T> => new Promise((resolve) => window.setTimeout(() => resolve(clone(payload)), delay));
const leadStore: Lead[] = clone(data.crmAndSales.leads);
const customerStore: Customer[] = clone(data.masterData.customers);
const opportunityStore: Opportunity[] = clone(data.crmAndSales.opportunities);
const crmActivityStore: CrmActivity[] = clone((data.crmAndSales.activities ?? []) as CrmActivity[]);
const generatedOrders: SalesDocument[] = [];
const generatedQuotations: SalesDocument[] = [];
const documentOverrides = new Map<string, SalesDocument>();
const generatedDeliveries: Delivery[] = [];
const generatedInvoices: SalesInvoice[] = [];
const invoiceOverrides = new Map<string, SalesInvoice>();
const generatedPayments: Payment[] = [];
type Reservation = { lineId: string; itemId: string; warehouseId: string; quantity: number };
const reservationStore = new Map<string, Map<string, Reservation>>();
const generatedPurchaseOrders: PurchaseOrder[] = [];
const purchaseOrderOverrides = new Map<string, PurchaseOrder>();
const generatedPurchaseReceipts: PurchaseReceipt[] = [];
const generatedPurchaseReturns: PurchaseReturn[] = [];
const generatedPurchaseRequests: PurchaseRequest[] = [];
const purchaseRequestOverrides = new Map<string, PurchaseRequest>();
const generatedRfqs: RequestForQuotation[] = [];
const rfqOverrides = new Map<string, RequestForQuotation>();
const generatedSupplierQuotations: SupplierQuotation[] = [];
const supplierQuotationOverrides = new Map<string, SupplierQuotation>();
const generatedPurchaseInvoices: PurchaseInvoice[] = [];
const purchaseInvoiceOverrides = new Map<string, PurchaseInvoice>();
const generatedPurchaseInvoiceAdjustments: PurchaseInvoiceAdjustment[] = [];
const generatedPurchasePayments: PurchasePayment[] = [];
const generatedJournalEntries: JournalEntryRecord[] = [];
const generatedTransfers: InventoryTransfer[] = [];
const inventoryAdjustments = new Map<string, { quantity: number; value: number }>();
const generatedInventoryMovements: InventoryMovement[] = [];
const generatedStockBatches: StockBatchRecord[] = [];
const batchAdjustments = new Map<string, number>();
const generatedInventoryAdjustments: InventoryAdjustment[] = [];
const generatedSalesReturns: SalesReturn[] = [];
const generatedVirtualStockProcesses: VirtualStockProcess[] = [];
const generatedPickLists: PickList[] = [];
const generatedWorkOrders: ManufacturingWorkOrder[] = [];
const workOrderOverrides = new Map<string, ManufacturingWorkOrder>();
const generatedManufacturingJobCards: ManufacturingJobCard[] = [];
const hrEmployees: HrEmployee[] = [
  { id: "emp-001", employeeNo: "NV-0001", fullName: "Nguyễn Ngọc Nam", department: "Tài chính", title: "Trưởng phòng tài chính", joinDate: "2023-02-01", status: "active", email: "nam.nguyen@anphuviet.vn" },
  { id: "emp-002", employeeNo: "NV-0002", fullName: "Trần Minh Anh", department: "Kinh doanh", title: "Chuyên viên kinh doanh", joinDate: "2024-05-13", status: "active", email: "anh.tran@anphuviet.vn" },
  { id: "emp-003", employeeNo: "NV-0003", fullName: "Lê Quốc Huy", department: "Kho vận", title: "Thủ kho", joinDate: "2022-10-10", status: "active", email: "huy.le@anphuviet.vn" },
  { id: "emp-004", employeeNo: "NV-0004", fullName: "Phạm Thu Hà", department: "Sản xuất", title: "Tổ trưởng sản xuất", joinDate: "2021-08-20", status: "active", email: "ha.pham@anphuviet.vn" },
  { id: "emp-005", employeeNo: "NV-0005", fullName: "Nguyễn Đức Thành", department: "Kho vận", title: "Nhân viên kho", joinDate: "2026-07-15", status: "active", email: "employee@anphuviet.vn" },
  { id: "emp-006", employeeNo: "NV-0006", fullName: "Nguyễn Thanh Bình", department: "Mua hàng", title: "Chuyên viên mua hàng", joinDate: "2024-03-18", status: "active", email: "purchase@anphuviet.vn" },
  { id: "emp-007", employeeNo: "NV-0007", fullName: "Phạm Mai Lan", department: "Tài chính", title: "Kế toán tổng hợp", joinDate: "2023-11-06", status: "active", email: "finance@anphuviet.vn" },
  { id: "emp-008", employeeNo: "NV-0008", fullName: "Võ Đức Long", department: "Kinh doanh", title: "Thu ngân", joinDate: "2025-01-13", status: "active", email: "cashier@anphuviet.vn" },
];
const attendanceStore: AttendanceRecord[] = [
  { id: "att-001", employeeId: "emp-001", workDate: now, checkIn: "08:03", status: "present" },
  { id: "att-002", employeeId: "emp-002", workDate: now, checkIn: "08:17", status: "late", note: "Kẹt xe" },
  { id: "att-003", employeeId: "emp-003", workDate: now, checkIn: "07:55", checkOut: "17:08", status: "present" },
  { id: "att-004", employeeId: "emp-004", workDate: now, status: "on_leave" },
];
const leaveRequestStore: LeaveRequest[] = [
  { id: "leave-001", requestNo: "LV-2026-0001", employeeId: "emp-004", leaveType: "annual", fromDate: "2026-08-29", toDate: "2026-08-29", totalDays: 1, reason: "Việc gia đình", status: "approved" },
  { id: "leave-002", requestNo: "LV-2026-0002", employeeId: "emp-002", leaveType: "annual", fromDate: "2026-09-03", toDate: "2026-09-04", totalDays: 2, reason: "Nghỉ phép theo kế hoạch", status: "pending" },
];
const salaryStructureStore: SalaryStructure[] = [
  { id: "salary-finance-manager", code: "SAL-FIN-MGR", name: "Quản lý tài chính", baseSalary: 28_000_000, allowanceAmount: 3_000_000, insuranceRate: 0.105, status: "active" },
  { id: "salary-sales", code: "SAL-SALES", name: "Chuyên viên kinh doanh", baseSalary: 14_000_000, allowanceAmount: 1_500_000, insuranceRate: 0.105, status: "active" },
  { id: "salary-warehouse", code: "SAL-WH", name: "Nhân viên kho", baseSalary: 12_000_000, allowanceAmount: 1_200_000, insuranceRate: 0.105, status: "active" },
  { id: "salary-production-lead", code: "SAL-PROD-LEAD", name: "Tổ trưởng sản xuất", baseSalary: 18_000_000, allowanceAmount: 1_800_000, insuranceRate: 0.105, status: "active" },
];
const contractStore: EmploymentContract[] = [
  { id: "contract-001", contractNo: "HDLD-2026-0001", employeeId: "emp-001", salaryStructureId: "salary-finance-manager", startDate: "2026-01-01", endDate: "2026-12-31", status: "active" },
  { id: "contract-002", contractNo: "HDLD-2026-0002", employeeId: "emp-002", salaryStructureId: "salary-sales", startDate: "2026-01-01", endDate: "2026-12-31", status: "active" },
  { id: "contract-003", contractNo: "HDLD-2026-0003", employeeId: "emp-003", salaryStructureId: "salary-warehouse", startDate: "2026-01-01", endDate: "2026-12-31", status: "active" },
  { id: "contract-004", contractNo: "HDLD-2026-0004", employeeId: "emp-004", salaryStructureId: "salary-production-lead", startDate: "2026-01-01", endDate: "2026-12-31", status: "active" },
];
const payrollEntryStore: PayrollEntry[] = [
  { id: "payroll-2026-08", payrollNo: "PAYROLL-2026-08", period: "2026-08", paymentDate: "2026-08-29", status: "paid", lines: [
    { id: "payline-aug-001", employeeId: "emp-001", baseSalary: 28_000_000, allowanceAmount: 3_000_000, grossAmount: 31_000_000, deductionAmount: 3_255_000, netAmount: 27_745_000 },
    { id: "payline-aug-002", employeeId: "emp-002", baseSalary: 14_000_000, allowanceAmount: 1_500_000, grossAmount: 15_500_000, deductionAmount: 1_627_500, netAmount: 13_872_500 },
    { id: "payline-aug-003", employeeId: "emp-003", baseSalary: 12_000_000, allowanceAmount: 1_200_000, grossAmount: 13_200_000, deductionAmount: 1_386_000, netAmount: 11_814_000 },
    { id: "payline-aug-004", employeeId: "emp-004", baseSalary: 18_000_000, allowanceAmount: 1_800_000, grossAmount: 19_800_000, deductionAmount: 2_079_000, netAmount: 17_721_000 },
  ], totalGross: 79_500_000, totalDeduction: 8_347_500, totalNet: 71_152_500 },
];
const generatedPosShifts: PosShift[] = [];
const generatedPosInvoices: PosInvoice[] = [];
const generatedPosPayments: FinancePayment[] = [];
const projectTaskOverrides = new Map<string, ProjectTask>();
const generatedProjectTimesheets: ProjectTimesheet[] = [];
const projectTimesheetOverrides = new Map<string, ProjectTimesheet>();
const generatedProjectFinancialEntries: ProjectFinancialEntry[] = [];
const generatedProjects: any[] = [];
const projectOverrides = new Map<string, any>();
const generatedProjectTasks: any[] = [];
const projectActivities: ProjectActivity[] = [];

const products = () => data.masterData.items as Product[];
const warehouses = () => data.inventory.warehouses as Warehouse[];
const paymentMethods = () => data.masterData.paymentMethods as PaymentMethod[];
const suppliers = () => data.masterData.suppliers as Supplier[];
const productById = (id: string) => products().find((item) => item.id === id);
const customerById = (id: string) => customerStore.find((item) => item.id === id);
const supplierById = (id: string) => suppliers().find((item) => item.id === id);
const isStockManaged = (product?: Product) => product?.itemType !== "service";
const pad = (value: number) => String(value).padStart(4, "0");
const nextCode = (prefix: string, total: number) => `${prefix}-2026-${pad(total + 1)}`;
const addDays = (date: string, days: number) => { const value = new Date(`${date}T00:00:00`); value.setDate(value.getDate() + days); return value.toISOString().slice(0, 10); };
const mutation = <T,>(entity: T | null, errors: Record<string, string> = {}): MutationResult<T> => ({ entity, errors });

function rawToDocument(raw: any, kind: SalesDocumentKind): SalesDocument {
  return { id: raw.id, documentNo: raw.documentNo, kind, customerId: raw.customerId, opportunityId: raw.opportunityId ?? null, sourceQuotationId: raw.sourceQuotationId ?? null, status: raw.status, documentDate: raw.orderDate ?? raw.issueDate, validUntil: raw.validUntil, requestedDeliveryDate: raw.requestedDeliveryDate, warehouseId: raw.warehouseId ?? "wh-hcm-main", subtotal: raw.subtotal, discountAmount: raw.discountAmount, vatAmount: raw.vatAmount, totalAmount: raw.totalAmount, paidAmount: raw.paidAmount ?? 0, balanceAmount: raw.balanceAmount ?? raw.totalAmount, lines: raw.lines };
}
function documents(kind: SalesDocumentKind): SalesDocument[] {
  const source = kind === "order" ? data.crmAndSales.salesOrders : data.crmAndSales.salesQuotations;
  const generated = kind === "order" ? generatedOrders : generatedQuotations;
  return [...source.map((entry: any) => rawToDocument(entry, kind)), ...generated].map((document) => documentOverrides.get(document.id) ?? document);
}
function rawDeliveries(): Delivery[] { return (data.crmAndSales.deliveries as any[]).map((delivery) => ({ ...delivery, recipientPhone: delivery.recipientPhone ?? "", lines: delivery.lines })); }
function deliveries() { return [...rawDeliveries(), ...generatedDeliveries]; }
function rawInvoices(): SalesInvoice[] {
  return (data.finance.salesInvoices as any[]).map((invoice) => {
    const order = documents("order").find((item) => item.id === invoice.salesOrderId);
    const usedByLine = new Map<string, number>();
    const lines: InvoiceLine[] = invoice.lines.map((line: SalesDocumentLine, index: number) => {
      const source = order?.lines.find((candidate) => candidate.itemId === line.itemId && (usedByLine.get(candidate.id) ?? 0) < candidate.quantity);
      if (source) usedByLine.set(source.id, (usedByLine.get(source.id) ?? 0) + line.quantity);
      return { ...line, salesOrderLineId: source?.id ?? `legacy-${invoice.id}-${index}` };
    });
    return { id: invoice.id, documentNo: invoice.documentNo, salesOrderId: invoice.salesOrderId, customerId: invoice.customerId, status: invoice.status, issueDate: invoice.issueDate, dueDate: invoice.dueDate, subtotal: invoice.subtotal, discountAmount: invoice.discountAmount, vatAmount: invoice.vatAmount, totalAmount: invoice.totalAmount, paidAmount: invoice.paidAmount ?? 0, balanceAmount: invoice.balanceAmount ?? invoice.totalAmount, lines };
  });
}
function invoices() { return [...rawInvoices(), ...generatedInvoices].map((invoice) => invoiceOverrides.get(invoice.id) ?? invoice); }
function rawPayments(): Payment[] { return (data.finance.payments as any[]).filter((payment) => payment.paymentType === "incoming").flatMap((payment) => payment.allocations.map((allocation: any) => ({ id: `${payment.id}-${allocation.invoiceId}`, paymentNo: payment.paymentNo, invoiceId: allocation.invoiceId, paymentDate: payment.paymentDate, totalAmount: allocation.allocatedAmount, status: "completed" as const, methodId: payment.methodId, methodName: paymentMethods().find((method) => method.id === payment.methodId)?.name ?? payment.methodId }))); }
function payments() { return [...rawPayments(), ...generatedPayments]; }
function isBankSettlement(methodId: string) { return paymentMethods().find((method) => method.id === methodId)?.type === "bank_transfer"; }
function settlementAccount(methodId: string) {
  const method = paymentMethods().find((entry) => entry.id === methodId);
  if (method?.type === "cash") return "1111";
  if (method?.type === "bank_transfer") return "1121";
  return "113";
}
function postJournalEntry(sourceDocumentNo: string, postingDate: string, lines: JournalLine[]) {
  const debitAmount = lines.reduce((total, line) => total + line.debit, 0);
  const creditAmount = lines.reduce((total, line) => total + line.credit, 0);
  if (Math.round(debitAmount) !== Math.round(creditAmount)) throw new Error(`Bút toán ${sourceDocumentNo} không cân Nợ/Có.`);
  generatedJournalEntries.unshift({ id: `journal-${Date.now()}-${generatedJournalEntries.length + 1}`, entryNo: `JE-2026-${pad(341 + generatedJournalEntries.length + 1)}`, postingDate, sourceDocumentNo, status: "posted", lines });
}
function journalEntryViews(): FinanceJournalEntry[] {
  const staticEntries = ((data.finance?.journalEntries ?? []) as JournalEntryRecord[]);
  return [...generatedJournalEntries, ...staticEntries].map((entry) => ({ id: entry.id, entryNo: entry.entryNo, postingDate: entry.postingDate, sourceDocumentNo: entry.sourceDocumentNo, status: entry.status, debitAmount: entry.lines.reduce((total, line) => total + Number(line.debit ?? 0), 0), creditAmount: entry.lines.reduce((total, line) => total + Number(line.credit ?? 0), 0) })).sort((left, right) => right.postingDate.localeCompare(left.postingDate) || right.entryNo.localeCompare(left.entryNo));
}
function documentCount(kind: SalesDocumentKind) { return documents(kind).length + (kind === "order" ? 94 : 34); }

const inventoryKey = (itemId: string, warehouseId: string) => `${itemId}:${warehouseId}`;
const normalizeBatchNo = (batchNo?: string) => batchNo?.trim().toUpperCase() ?? "";
const stockBatchKey = (itemId: string, warehouseId: string, batchNo: string) => [itemId, warehouseId, normalizeBatchNo(batchNo)].join(":");
function stockBatchRecords(): StockBatchRecord[] {
  return [...data.inventory.batches.map((batch: unknown) => ({ ...(batch as StockBatchRecord) })), ...generatedStockBatches];
}
function postBatchAdjustment(itemId: string, warehouseId: string, batchNo: string, quantity: number, metadata: Partial<Pick<StockBatchRecord, "manufacturingDate" | "expiryDate" | "qualityStatus">> = {}) {
  const normalizedBatchNo = normalizeBatchNo(batchNo); if (!normalizedBatchNo || !quantity) return;
  const key = stockBatchKey(itemId, warehouseId, normalizedBatchNo);
  const exists = stockBatchRecords().some((batch) => stockBatchKey(batch.itemId, batch.warehouseId, batch.batchNo) === key);
  if (!exists) generatedStockBatches.unshift({ id: "BATCH-" + Date.now() + "-" + (generatedStockBatches.length + 1), itemId, warehouseId, batchNo: normalizedBatchNo, manufacturingDate: metadata.manufacturingDate ?? now, expiryDate: metadata.expiryDate, quantityOnHand: 0, qualityStatus: metadata.qualityStatus ?? "released" });
  batchAdjustments.set(key, (batchAdjustments.get(key) ?? 0) + quantity);
}
function stockBatchViews(): StockBatchView[] {
  const batchesByKey = new Map<string, StockBatchRecord>();
  stockBatchRecords().forEach((batch) => batchesByKey.set(stockBatchKey(batch.itemId, batch.warehouseId, batch.batchNo), batch));
  const keys = new Set([...batchesByKey.keys(), ...batchAdjustments.keys()]);
  return [...keys].flatMap((key) => {
    const batch = batchesByKey.get(key); if (!batch) return [];
    const item = productById(batch.itemId); const warehouse = warehouses().find((entry) => entry.id === batch.warehouseId);
    const quantityOnHand = Math.max(0, batch.quantityOnHand + (batchAdjustments.get(key) ?? 0));
    return !item || !warehouse || quantityOnHand <= 0 ? [] : [{ ...batch, batchNo: normalizeBatchNo(batch.batchNo), quantityOnHand, item, warehouse }];
  }).sort((left, right) => [left.warehouse.name, left.item.sku, left.batchNo].join("-").localeCompare([right.warehouse.name, right.item.sku, right.batchNo].join("-"), "vi"));
}
function inventoryAdjustment(itemId: string, warehouseId: string) { return inventoryAdjustments.get(inventoryKey(itemId, warehouseId)) ?? { quantity: 0, value: 0 }; }
function postInventoryAdjustment(itemId: string, warehouseId: string, quantity: number, unitCost: number) {
  const key = inventoryKey(itemId, warehouseId); const current = inventoryAdjustment(itemId, warehouseId);
  inventoryAdjustments.set(key, { quantity: current.quantity + quantity, value: current.value + quantity * unitCost });
}
function availableBaseQuantity(itemId: string, warehouseId: string) {
  const base = (data.inventory.stockBalances as Array<{ itemId: string; warehouseId: string; availableQuantity: number }>).filter((balance) => balance.itemId === itemId && balance.warehouseId === warehouseId).reduce((total, balance) => total + balance.availableQuantity, 0);
  return Math.max(0, base + inventoryAdjustment(itemId, warehouseId).quantity);
}
function reservedQuantity(itemId: string, warehouseId: string, exceptOrderId?: string) { return [...reservationStore.entries()].filter(([orderId]) => orderId !== exceptOrderId).flatMap(([, reservations]) => [...reservations.values()]).filter((reservation) => reservation.itemId === itemId && reservation.warehouseId === warehouseId).reduce((total, reservation) => total + reservation.quantity, 0); }
function availableToSell(itemId: string, warehouseId: string) { return Math.max(0, availableBaseQuantity(itemId, warehouseId) - reservedQuantity(itemId, warehouseId)); }
function availableToDeliver(itemId: string, warehouseId: string, orderId: string) { return Math.max(0, availableBaseQuantity(itemId, warehouseId) - reservedQuantity(itemId, warehouseId, orderId)); }
function reserveOrder(order: SalesDocument) {
  const reservations = new Map<string, Reservation>();
  order.lines.forEach((line) => { if (isStockManaged(productById(line.itemId))) reservations.set(line.id, { lineId: line.id, itemId: line.itemId, warehouseId: order.warehouseId ?? "", quantity: Math.max(0, line.quantity - (line.fulfilledQuantity ?? 0)) }); });
  reservationStore.set(order.id, reservations);
}
function releaseReservation(orderId: string, lineId?: string, quantity?: number) {
  const reservations = reservationStore.get(orderId); if (!reservations) return;
  if (!lineId) { reservationStore.delete(orderId); return; }
  const reservation = reservations.get(lineId); if (!reservation) return;
  const remaining = reservation.quantity - (quantity ?? reservation.quantity);
  if (remaining <= 0) reservations.delete(lineId); else reservations.set(lineId, { ...reservation, quantity: remaining });
  if (reservations.size === 0) reservationStore.delete(orderId);
}

function calculate(draft: SalesDocumentDraft): SalesValidation {
  const errors: Record<string, string> = {};
  const customer = customerById(draft.customerId);
  if (!draft.customerId || !customer) errors.customerId = "Vui lòng chọn khách hàng hợp lệ.";
  else if (customer.status !== "active") errors.customerId = "Khách hàng đang ngừng hoạt động.";
  const warehouse = warehouses().find((entry) => entry.id === draft.warehouseId);
  if (!draft.warehouseId || !warehouse || warehouse.status !== "active") errors.warehouseId = "Vui lòng chọn kho xuất hàng hợp lệ.";
  if (!draft.documentDate) errors.documentDate = "Vui lòng chọn ngày chứng từ.";
  if (draft.lines.length === 0) errors.lines = "Cần có ít nhất một dòng hàng.";
  let subtotal = 0; let vatAmount = 0; const availableByLine: number[] = []; const requestedByItem = new Map<string, number>();
  draft.lines.forEach((line) => requestedByItem.set(line.itemId, (requestedByItem.get(line.itemId) ?? 0) + (Number(line.quantity) || 0)));
  draft.lines.forEach((line, index) => {
    const product = productById(line.itemId); const available = availableToSell(line.itemId, draft.warehouseId); availableByLine.push(available);
    if (!product) errors[`line-${index}`] = "Vui lòng chọn sản phẩm.";
    else if (!Number.isFinite(line.quantity) || line.quantity <= 0) errors[`line-${index}`] = "Số lượng phải lớn hơn 0.";
    else if (!Number.isFinite(line.unitPrice) || line.unitPrice < 0) errors[`line-${index}`] = "Đơn giá không hợp lệ.";
    else if (!Number.isFinite(line.discountAmount) || line.discountAmount < 0 || line.discountAmount > line.quantity * line.unitPrice) errors[`line-${index}`] = "Chiết khấu không được vượt thành tiền dòng hàng.";
    else if (draft.kind === "order" && isStockManaged(product) && (requestedByItem.get(line.itemId) ?? 0) > available) errors[`line-${index}`] = `Tổng số lượng xuất vượt tồn khả dụng (${available.toLocaleString("vi-VN")} ${product.unit}).`;
    const lineAmount = Math.max(0, line.quantity * line.unitPrice - line.discountAmount); subtotal += lineAmount; vatAmount += lineAmount * (product?.vatRate ?? 0);
  });
  const totalAmount = subtotal + vatAmount;
  // Invoice balances are already included in the customer's outstanding balance.  For a
  // confirmed order, reserve credit only for the portion that has not yet been invoiced;
  // otherwise an unpaid invoice would be counted once as receivables and again as an order.
  // Draft orders are not credit exposure, so the current draft must not reduce this check.
  const confirmedExposure = documents("order")
    .filter((order) => order.customerId === draft.customerId && order.id !== draft.id && ["confirmed", "partially_completed", "completed", "partially_invoiced", "invoiced"].includes(order.status))
    .reduce((total, order) => {
      const invoicedAmount = invoicesForOrder(order.id).reduce((sum, invoice) => sum + invoice.totalAmount, 0);
      return total + Math.max(0, order.totalAmount - invoicedAmount);
    }, 0);
  if (draft.kind === "order" && customer && totalAmount + customer.outstandingBalance + confirmedExposure > customer.creditLimit) errors.creditLimit = `Đơn hàng vượt hạn mức công nợ còn lại ${Math.max(0, customer.creditLimit - customer.outstandingBalance - confirmedExposure).toLocaleString("vi-VN")} ₫.`;
  if (draft.kind === "quotation" && !draft.validUntil) errors.validUntil = "Vui lòng chọn ngày hết hiệu lực báo giá.";
  if (draft.kind === "quotation" && draft.validUntil && draft.documentDate && draft.validUntil < draft.documentDate) errors.validUntil = "Ngày hết hiệu lực phải từ ngày chứng từ trở đi.";
  if (draft.kind === "order" && !draft.requestedDeliveryDate) errors.requestedDeliveryDate = "Vui lòng chọn ngày giao dự kiến.";
  if (draft.kind === "order" && draft.requestedDeliveryDate && draft.documentDate && draft.requestedDeliveryDate < draft.documentDate) errors.requestedDeliveryDate = "Ngày giao dự kiến không được trước ngày chứng từ.";
  return { errors, subtotal, vatAmount, totalAmount, availableByLine };
}
function documentDraft(document: SalesDocument, kind: SalesDocumentKind = document.kind): SalesDocumentDraft { return { id: document.id, kind, customerId: document.customerId, warehouseId: document.warehouseId ?? "wh-hcm-main", documentDate: document.documentDate, validUntil: document.validUntil, requestedDeliveryDate: document.requestedDeliveryDate, lines: document.lines.map((line) => ({ itemId: line.itemId, quantity: line.quantity, unitPrice: line.unitPrice, discountAmount: line.discountAmount })) }; }
type QuotationConversionPreparation = { errors: Record<string, string>; draft?: SalesDocumentDraft; validation?: SalesValidation };
function prepareQuotationConversion(quote: SalesDocument | undefined): QuotationConversionPreparation {
  if (!quote) return { errors: { form: "Không tìm thấy báo giá." } };
  if (quote.status !== "approved") return { errors: { form: "Chỉ báo giá đã duyệt mới được chuyển thành đơn bán." } };
  if (quote.validUntil && quote.validUntil < now) return { errors: { form: "Báo giá đã hết hiệu lực." } };
  if (documents("order").some((order) => order.sourceQuotationId === quote.id)) return { errors: { form: "Báo giá này đã được chuyển thành đơn bán." } };

  const draft: SalesDocumentDraft = { ...documentDraft(quote, "order"), id: undefined, kind: "order", requestedDeliveryDate: addDays(now, 5), validUntil: undefined };
  const validation = calculate(draft);
  if (Object.keys(validation.errors).length) return { errors: { form: "Không thể tạo đơn bán do tồn kho hoặc hạn mức công nợ.", ...validation.errors } };
  return { errors: {}, draft, validation };
}
function draftToDocument(draft: SalesDocumentDraft, validation: SalesValidation, status = "draft", sourceQuotationId: string | null = null): SalesDocument {
  const existing = draft.id ? documents(draft.kind).find((document) => document.id === draft.id) : undefined; const kindPrefix = draft.kind === "order" ? "SO" : "SQ";
  return { id: draft.id ?? `${draft.kind}-${Date.now()}`, documentNo: existing?.documentNo ?? `${kindPrefix}-2026-${pad(documentCount(draft.kind))}`, kind: draft.kind, customerId: draft.customerId, opportunityId: existing?.opportunityId ?? null, sourceQuotationId: existing?.sourceQuotationId ?? sourceQuotationId, status: existing?.status ?? status, documentDate: draft.documentDate, validUntil: draft.validUntil, requestedDeliveryDate: draft.requestedDeliveryDate, warehouseId: draft.warehouseId, subtotal: validation.subtotal, discountAmount: draft.lines.reduce((total, line) => total + line.discountAmount, 0), vatAmount: validation.vatAmount, totalAmount: validation.totalAmount, paidAmount: existing?.paidAmount ?? 0, balanceAmount: validation.totalAmount - (existing?.paidAmount ?? 0), lines: draft.lines.map((line, index) => { const product = productById(line.itemId)!; return { id: existing?.lines[index]?.id ?? `${draft.kind}-line-${Date.now()}-${index}`, itemId: product.id, description: product.name, unit: product.unit, quantity: line.quantity, fulfilledQuantity: existing?.lines[index]?.fulfilledQuantity ?? 0, unitPrice: line.unitPrice, discountAmount: line.discountAmount, vatRate: product.vatRate, lineTotal: Math.max(0, line.quantity * line.unitPrice - line.discountAmount) }; }) };
}
function storeDocument(document: SalesDocument) { documentOverrides.set(document.id, clone(document)); }
function invoicesForOrder(orderId: string) { return invoices().filter((invoice) => invoice.salesOrderId === orderId); }
function quantityInvoiced(orderId: string, orderLineId: string) { return invoicesForOrder(orderId).flatMap((invoice) => invoice.lines).filter((line) => line.salesOrderLineId === orderLineId).reduce((total, line) => total + line.quantity, 0); }
function allocateDiscount(totalDiscount: number, orderedQuantity: number, invoicedBefore: number, invoicedNow: number) { if (orderedQuantity <= 0) return 0; const before = Math.round(totalDiscount * invoicedBefore / orderedQuantity); const throughCurrent = Math.round(totalDiscount * (invoicedBefore + invoicedNow) / orderedQuantity); return throughCurrent - before; }
function updateCustomerOutstanding(customerId: string, delta: number) { const customer = customerById(customerId); if (customer) customer.outstandingBalance = Math.max(0, customer.outstandingBalance + delta); }
function refreshOrderFinance(orderId: string) {
  const order = documents("order").find((item) => item.id === orderId); if (!order) return;
  const orderInvoices = invoicesForOrder(orderId); const paidAmount = orderInvoices.reduce((sum, invoice) => sum + invoice.paidAmount, 0);
  const allPhysicalDelivered = order.lines.filter((line) => isStockManaged(productById(line.itemId))).every((line) => (line.fulfilledQuantity ?? 0) >= line.quantity);
  const allInvoiceEligibleInvoiced = order.lines.every((line) => { const eligible = isStockManaged(productById(line.itemId)) ? line.fulfilledQuantity ?? 0 : line.quantity; return quantityInvoiced(orderId, line.id) >= eligible; });
  let status = order.status;
  if (paidAmount >= order.totalAmount && order.totalAmount > 0) status = "paid";
  else if (orderInvoices.length && allPhysicalDelivered && allInvoiceEligibleInvoiced) status = "invoiced";
  else if (orderInvoices.length) status = "partially_invoiced";
  else if (allPhysicalDelivered) status = "completed";
  storeDocument({ ...order, status, paidAmount, balanceAmount: Math.max(0, order.totalAmount - paidAmount) });
}

function rawToPurchaseOrder(raw: any): PurchaseOrder {
  return {
    id: raw.id,
    documentNo: raw.documentNo,
    supplierId: raw.supplierId,
    sourcePurchaseRequestId: raw.sourcePurchaseRequestId ?? null,
    sourceRfqId: raw.sourceRfqId ?? null,
    sourceSupplierQuotationId: raw.sourceSupplierQuotationId ?? null,
    amendsPurchaseOrderId: raw.amendsPurchaseOrderId ?? null,
    status: raw.status,
    orderDate: raw.orderDate,
    expectedReceiptDate: raw.expectedReceiptDate,
    warehouseId: raw.warehouseId,
    subtotal: raw.subtotal,
    discountAmount: raw.discountAmount,
    vatAmount: raw.vatAmount,
    totalAmount: raw.totalAmount,
    lines: raw.lines.map((line: any) => ({ ...line, receivedQuantity: line.receivedQuantity ?? line.fulfilledQuantity ?? 0 })),
  };
}
function rawToPurchaseRequest(raw: any): PurchaseRequest {
  return { id: raw.id, documentNo: raw.documentNo, status: raw.status, requestDate: raw.requestDate, requiredDate: raw.requiredDate, requestedBy: raw.requestedBy ?? "Người dùng demo", requestingDepartment: raw.requestingDepartment ?? "Kho vận", warehouseId: raw.warehouseId ?? "wh-hcm-rm", estimatedAmount: raw.estimatedAmount, lines: raw.lines.map((line: any) => ({ id: line.id, itemId: line.itemId, description: line.description, unit: line.unit, quantity: line.quantity, unitPrice: line.unitPrice, lineTotal: line.lineTotal })) };
}
function purchaseRequests(): PurchaseRequest[] {
  const source = (data.purchasing.purchaseRequests as any[]).map(rawToPurchaseRequest);
  return [...source, ...generatedPurchaseRequests].map((request) => purchaseRequestOverrides.get(request.id) ?? request);
}
function purchaseRequestById(id: string) { return purchaseRequests().find((request) => request.id === id); }
function purchaseRequestCount() { return purchaseRequests().length + 40; }
function storePurchaseRequest(request: PurchaseRequest) { purchaseRequestOverrides.set(request.id, clone(request)); }
function rfqIdFromNo(documentNo: string) { return `rfq-${documentNo.toLowerCase()}`; }
function rawRfqs(): RequestForQuotation[] {
  return (data.purchasing.supplierQuotations as any[]).map((quotation) => {
    return { id: rfqIdFromNo(quotation.rfqNo), documentNo: quotation.rfqNo, sourcePurchaseRequestId: null, selectedSupplierQuotationId: null, status: "sent" as const, rfqDate: "2026-08-22", deadline: quotation.validUntil, warehouseId: "wh-hcm-rm", supplierIds: [quotation.supplierId], lines: quotation.lines.map((line: any, index: number) => ({ id: `rfql-${quotation.id}-${index}`, itemId: line.itemId, description: line.description, unit: line.unit, quantity: line.quantity, unitPrice: line.unitPrice, lineTotal: line.quantity * line.unitPrice - (line.discountAmount ?? 0) })) };
  });
}
function resolveRfqStatus(rfq: RequestForQuotation): RequestForQuotation { return rfq.status === "sent" && rfq.deadline < now ? { ...rfq, status: "overdue" } : rfq; }
function rfqs(): RequestForQuotation[] { return [...rawRfqs(), ...generatedRfqs].map((rfq) => resolveRfqStatus(rfqOverrides.get(rfq.id) ?? rfq)); }
function rfqById(id: string) { return rfqs().find((rfq) => rfq.id === id); }
function rfqCount() { return rfqs().length + 22; }
function storeRfq(rfq: RequestForQuotation) { rfqOverrides.set(rfq.id, clone(rfq)); }
function rawSupplierQuotations(): SupplierQuotation[] {
  return (data.purchasing.supplierQuotations as any[]).map((quotation) => ({ id: quotation.id, documentNo: quotation.quotationNo, rfqId: rfqIdFromNo(quotation.rfqNo), rfqNo: quotation.rfqNo, supplierId: quotation.supplierId, status: quotation.status === "approved" ? "approved" as const : "draft" as const, validUntil: quotation.validUntil, leadTimeDays: quotation.leadTimeDays, totalAmount: quotation.totalAmount, lines: quotation.lines.map((line: any, index: number) => ({ id: line.id ?? `vql-${quotation.id}-${index}`, itemId: line.itemId, description: line.description, unit: line.unit, quantity: line.quantity, unitPrice: line.unitPrice, discountAmount: line.discountAmount ?? 0, vatRate: line.vatRate ?? productById(line.itemId)?.vatRate ?? 0, lineTotal: line.lineTotal ?? Math.max(0, line.quantity * line.unitPrice - (line.discountAmount ?? 0)) })) }));
}
function supplierQuotations(): SupplierQuotation[] { return [...rawSupplierQuotations(), ...generatedSupplierQuotations].map((quotation) => supplierQuotationOverrides.get(quotation.id) ?? quotation); }
function supplierQuotationById(id: string) { return supplierQuotations().find((quotation) => quotation.id === id); }
function supplierQuotationCount() { return supplierQuotations().length + 2; }
function storeSupplierQuotation(quotation: SupplierQuotation) { supplierQuotationOverrides.set(quotation.id, clone(quotation)); }
function purchaseOrders(): PurchaseOrder[] {
  const source = (data.purchasing.purchaseOrders as any[]).map(rawToPurchaseOrder);
  return [...source, ...generatedPurchaseOrders].map((order) => purchaseOrderOverrides.get(order.id) ?? order);
}
function purchaseOrderById(id: string) { return purchaseOrders().find((order) => order.id === id); }
function purchaseOrderCount() { return purchaseOrders().length + 61; }
function purchaseReceipts(): PurchaseReceipt[] {
  const source = (data.purchasing.receipts as any[]).map((receipt) => {
    const order = purchaseOrderById(receipt.purchaseOrderId);
    return {
      id: receipt.id,
      documentNo: receipt.documentNo,
      purchaseOrderId: receipt.purchaseOrderId,
      status: "completed" as const,
      receivedDate: receipt.receivedDate,
      warehouseId: receipt.warehouseId,
      lines: receipt.lines.map((line: any, index: number) => {
        const orderLine = order?.lines.find((candidate) => candidate.itemId === line.itemId);
        return { id: line.id ?? `grnl-${receipt.id}-${index}`, purchaseOrderLineId: orderLine?.id ?? `legacy-${receipt.id}-${line.id}`, itemId: line.itemId, quantity: line.acceptedQuantity ?? line.quantity, rejectedQuantity: line.rejectedQuantity ?? 0, rejectionReason: line.rejectionReason, batchNo: line.batchNo, manufacturingDate: line.manufacturingDate, expiryDate: line.expiryDate, description: line.description, unit: line.unit, unitPrice: line.unitPrice, discountAmount: line.discountAmount ?? 0, vatRate: line.vatRate ?? orderLine?.vatRate ?? productById(line.itemId)?.vatRate ?? 0 };
      }),
    };
  });
  return [...source, ...generatedPurchaseReceipts];
}
function rawPurchaseInvoices(): PurchaseInvoice[] {
  return ((data.finance?.purchaseInvoices ?? []) as any[]).map((invoice) => {
    const receipt = purchaseReceipts().find((entry) => entry.id === invoice.purchaseReceiptId);
    const order = receipt ? purchaseOrderById(receipt.purchaseOrderId) : undefined;
    const lines: PurchaseInvoiceLine[] = invoice.lines.map((line: any, index: number) => {
      const receiptLine = receipt?.lines.find((entry) => entry.itemId === line.itemId);
      return { purchaseReceiptLineId: receiptLine?.id ?? `legacy-${invoice.id}-${index}`, itemId: line.itemId, description: line.description, unit: line.unit, quantity: line.quantity, unitPrice: line.unitPrice, discountAmount: line.discountAmount ?? 0, vatRate: line.vatRate ?? receiptLine?.vatRate ?? productById(line.itemId)?.vatRate ?? 0, lineTotal: line.lineTotal ?? Math.max(0, line.quantity * line.unitPrice - (line.discountAmount ?? 0)) };
    });
    return { id: invoice.id, documentNo: invoice.documentNo, supplierInvoiceNo: invoice.supplierInvoiceNo ?? invoice.documentNo, attachmentName: invoice.attachmentName, purchaseReceiptId: receipt?.id ?? invoice.purchaseReceiptId ?? `legacy-receipt-${invoice.id}`, purchaseOrderId: order?.id ?? invoice.purchaseOrderId ?? `legacy-order-${invoice.id}`, supplierId: invoice.supplierId ?? order?.supplierId, status: invoice.status as PurchaseInvoiceStatus, invoiceDate: invoice.issueDate ?? invoice.invoiceDate, dueDate: invoice.dueDate, subtotal: invoice.subtotal, discountAmount: invoice.discountAmount ?? 0, vatAmount: invoice.vatAmount, totalAmount: invoice.totalAmount, paidAmount: invoice.paidAmount ?? 0, adjustedAmount: invoice.adjustedAmount ?? 0, balanceAmount: invoice.balanceAmount ?? invoice.totalAmount, lines };
  });
}
function purchaseInvoices() { return [...rawPurchaseInvoices(), ...generatedPurchaseInvoices].map((invoice) => purchaseInvoiceOverrides.get(invoice.id) ?? invoice); }
function purchaseInvoiceCount() { return purchaseInvoices().length + 84; }
function purchaseInvoiceAdjustments() { return generatedPurchaseInvoiceAdjustments; }
function purchasePayments() { return generatedPurchasePayments; }
function quantityInvoicedForReceiptLine(receiptLineId: string) { return purchaseInvoices().filter((invoice) => invoice.status !== "cancelled").flatMap((invoice) => invoice.lines).filter((line) => line.purchaseReceiptLineId === receiptLineId).reduce((total, line) => total + line.quantity, 0); }
function adjustedAmountForPurchaseInvoice(invoiceId: string) { return purchaseInvoiceAdjustments().filter((adjustment) => adjustment.purchaseInvoiceId === invoiceId).reduce((total, adjustment) => total + adjustment.amount, 0); }
function paidAmountForPurchaseInvoice(invoiceId: string) { return purchasePayments().filter((payment) => payment.purchaseInvoiceId === invoiceId).reduce((total, payment) => total + payment.totalAmount, 0); }
function refreshPurchaseInvoice(invoiceId: string) {
  const invoice = purchaseInvoices().find((entry) => entry.id === invoiceId); if (!invoice || invoice.status === "cancelled") return;
  const adjustedAmount = adjustedAmountForPurchaseInvoice(invoice.id); const paidAmount = paidAmountForPurchaseInvoice(invoice.id); const balanceAmount = Math.max(0, invoice.totalAmount - adjustedAmount - paidAmount);
  const status: PurchaseInvoiceStatus = balanceAmount <= 0 ? (adjustedAmount > 0 ? "adjusted" : "paid") : paidAmount > 0 ? "partially_paid" : adjustedAmount > 0 ? "adjusted" : "approved";
  purchaseInvoiceOverrides.set(invoice.id, { ...invoice, status, adjustedAmount, paidAmount, balanceAmount });
}
function purchaseInvoiceCandidates(): PurchaseInvoiceCandidate[] {
  return purchaseReceipts().flatMap((receipt) => {
    const order = purchaseOrderById(receipt.purchaseOrderId); const supplier = order && supplierById(order.supplierId);
    if (!order || !supplier) return [];
    const totalAmount = receipt.lines.reduce((sum, line) => { const invoicedQuantity = quantityInvoicedForReceiptLine(line.id ?? ""); const remainingQuantity = Math.max(0, line.quantity - invoicedQuantity); if (!remainingQuantity) return sum; const discountAmount = allocateDiscount(line.discountAmount, line.quantity, invoicedQuantity, remainingQuantity); return sum + Math.max(0, remainingQuantity * line.unitPrice - discountAmount) * (1 + line.vatRate); }, 0);
    return totalAmount > 0 ? [{ receipt, order, supplier, totalAmount }] : [];
  });
}
function stockBalanceViews(): StockBalanceView[] {
  const baseBalances = data.inventory.stockBalances as Array<{ id: string; itemId: string; warehouseId: string; quantityOnHand: number; reservedQuantity: number; availableQuantity: number; averageCost: number; stockValue: number; updatedAt: string }>;
  const keys = new Set([...baseBalances.map((balance) => inventoryKey(balance.itemId, balance.warehouseId)), ...inventoryAdjustments.keys()]);
  return [...keys].flatMap((key) => {
    const [itemId, warehouseId] = key.split(":"); const item = productById(itemId); const warehouse = warehouses().find((entry) => entry.id === warehouseId);
    if (!item || !warehouse) return [];
    const base = baseBalances.find((balance) => balance.itemId === itemId && balance.warehouseId === warehouseId);
    const adjustment = inventoryAdjustment(itemId, warehouseId); const quantityOnHand = Math.max(0, (base?.quantityOnHand ?? 0) + adjustment.quantity);
    if (!base && quantityOnHand <= 0 && reservedQuantity(itemId, warehouseId) <= 0) return [];
    const stockValue = Math.max(0, (base?.stockValue ?? 0) + adjustment.value); const averageCost = quantityOnHand > 0 ? stockValue / quantityOnHand : item.costPrice;
    if (!canAccessWarehouse(warehouse.code)) return []; return [{ id: base?.id ?? `bal-${itemId}-${warehouseId}`, itemId, warehouseId, quantityOnHand, reservedQuantity: (base?.reservedQuantity ?? 0) + reservedQuantity(itemId, warehouseId), availableQuantity: availableToSell(itemId, warehouseId), averageCost, stockValue, updatedAt: now, item, warehouse }];
  }).sort((left, right) => left.warehouse.code.localeCompare(right.warehouse.code) || left.item.sku.localeCompare(right.item.sku));
}
function stockBalanceFor(itemId: string, warehouseId: string) {
  return stockBalanceViews().find((balance) => balance.itemId === itemId && balance.warehouseId === warehouseId);
}
function virtualWarehouses() { return warehouses().filter((warehouse) => warehouse.status === "active" && warehouse.warehouseType === "virtual"); }
function physicalWarehouses() { return warehouses().filter((warehouse) => warehouse.status === "active" && warehouse.warehouseType === "physical"); }
function returnedQuantity(deliveryId: string, salesOrderLineId: string) {
  return generatedSalesReturns.filter((entry) => entry.deliveryId === deliveryId).flatMap((entry) => entry.lines).filter((line) => line.salesOrderLineId === salesOrderLineId).reduce((total, line) => total + line.quantity, 0);
}
function returnableDeliveries(): ReturnableDelivery[] {
  return deliveries().filter((delivery) => delivery.status === "completed").flatMap((delivery) => {
    const order = documents("order").find((item) => item.id === delivery.salesOrderId); const customer = order && customerById(order.customerId);
    if (!order || !customer) return [];
    const lines = delivery.lines.flatMap((line) => {
      const product = productById(line.itemId); if (!product || !isStockManaged(product)) return [];
      const returned = returnedQuantity(delivery.id, line.salesOrderLineId); const returnable = Math.max(0, line.deliveredQuantity - returned);
      return [{ ...line, product, returnedQuantity: returned, returnableQuantity: returnable }];
    });
    return lines.some((line) => line.returnableQuantity > 0) ? [{ delivery, order, customer, lines }] : [];
  });
}
function pickListsForOrder(orderId: string) { return generatedPickLists.filter((entry) => entry.salesOrderId === orderId); }
function pickListCount() { return generatedPickLists.length + 1; }
function calculatePurchase(draft: PurchaseOrderDraft): PurchaseValidation {
  const errors: Record<string, string> = {}; const supplier = supplierById(draft.supplierId); const warehouse = warehouses().find((entry) => entry.id === draft.warehouseId);
  if (!supplier || supplier.status !== "active") errors.supplierId = "Vui lòng chọn nhà cung cấp đang hoạt động.";
  if (!warehouse || warehouse.status !== "active" || warehouse.warehouseType !== "physical") errors.warehouseId = "Vui lòng chọn kho nhập hợp lệ.";
  if (!draft.orderDate) errors.orderDate = "Vui lòng chọn ngày đơn mua.";
  if (!draft.expectedReceiptDate) errors.expectedReceiptDate = "Vui lòng chọn ngày nhận dự kiến.";
  else if (draft.orderDate && draft.expectedReceiptDate < draft.orderDate) errors.expectedReceiptDate = "Ngày nhận dự kiến không được trước ngày đơn mua.";
  if (!draft.lines.length) errors.lines = "Cần có ít nhất một dòng hàng.";
  let subtotal = 0; let vatAmount = 0;
  draft.lines.forEach((line, index) => {
    const product = productById(line.itemId);
    if (!product || product.status !== "active") errors[`line-${index}`] = "Vui lòng chọn mặt hàng đang hoạt động.";
    else if (!isStockManaged(product)) errors[`line-${index}`] = "Dịch vụ không thể nhận vào kho.";
    else if (!Number.isFinite(line.quantity) || line.quantity <= 0) errors[`line-${index}`] = "Số lượng phải lớn hơn 0.";
    else if (!Number.isFinite(line.unitPrice) || line.unitPrice < 0) errors[`line-${index}`] = "Đơn giá không hợp lệ.";
    else if (!Number.isFinite(line.discountAmount) || line.discountAmount < 0 || line.discountAmount > line.quantity * line.unitPrice) errors[`line-${index}`] = "Chiết khấu không được vượt thành tiền dòng hàng.";
    const lineAmount = Math.max(0, line.quantity * line.unitPrice - line.discountAmount); subtotal += lineAmount; vatAmount += lineAmount * (product?.vatRate ?? 0);
  });
  return { errors, subtotal, vatAmount, totalAmount: subtotal + vatAmount };
}
function validatePurchaseRequest(draft: PurchaseRequestDraft): PurchaseRequestValidation {
  const errors: Record<string, string> = {}; const warehouse = warehouses().find((entry) => entry.id === draft.warehouseId);
  if (!draft.requestingDepartment.trim()) errors.requestingDepartment = "Vui lòng nhập bộ phận yêu cầu mua.";
  if (!warehouse || warehouse.status !== "active" || warehouse.warehouseType !== "physical") errors.warehouseId = "Vui lòng chọn kho nhận hợp lệ.";
  if (!draft.requestDate) errors.requestDate = "Vui lòng chọn ngày yêu cầu.";
  if (!draft.requiredDate) errors.requiredDate = "Vui lòng chọn ngày cần hàng.";
  else if (draft.requestDate && draft.requiredDate < draft.requestDate) errors.requiredDate = "Ngày cần hàng không được trước ngày yêu cầu.";
  else if (draft.requiredDate < now) errors.requiredDate = "Ngày cần hàng không thể ở quá khứ.";
  if (!draft.lines.length) errors.lines = "Cần có ít nhất một dòng hàng.";
  let estimatedAmount = 0;
  draft.lines.forEach((line, index) => {
    const product = productById(line.itemId);
    if (!product || !isStockManaged(product)) errors[`line-${index}`] = "Vui lòng chọn hàng hóa có quản lý tồn kho.";
    else if (!Number.isFinite(line.quantity) || line.quantity <= 0) errors[`line-${index}`] = "Số lượng phải lớn hơn 0.";
    else if (!Number.isFinite(line.unitPrice) || line.unitPrice < 0) errors[`line-${index}`] = "Đơn giá dự kiến không hợp lệ.";
    estimatedAmount += Math.max(0, line.quantity * line.unitPrice);
  });
  return { errors, estimatedAmount };
}
function purchaseRequestDraft(request: PurchaseRequest): PurchaseRequestDraft {
  return { id: request.id, requestingDepartment: request.requestingDepartment, warehouseId: request.warehouseId, requestDate: request.requestDate, requiredDate: request.requiredDate, lines: request.lines.map((line) => ({ itemId: line.itemId, quantity: line.quantity, unitPrice: line.unitPrice })) };
}
function draftToPurchaseRequest(draft: PurchaseRequestDraft, validation: PurchaseRequestValidation): PurchaseRequest {
  const existing = draft.id ? purchaseRequestById(draft.id) : undefined;
  return { id: existing?.id ?? `purchase-request-${Date.now()}`, documentNo: existing?.documentNo ?? `PR-2026-${pad(purchaseRequestCount())}`, status: existing?.status ?? "draft", requestDate: draft.requestDate, requiredDate: draft.requiredDate, requestedBy: existing?.requestedBy ?? "Người dùng demo", requestingDepartment: draft.requestingDepartment.trim(), warehouseId: draft.warehouseId, estimatedAmount: validation.estimatedAmount, lines: draft.lines.map((line, index) => { const product = productById(line.itemId)!; const previous = existing?.lines[index]; return { id: previous?.id ?? `prl-${Date.now()}-${index}`, itemId: product.id, description: product.name, unit: product.unit, quantity: line.quantity, unitPrice: line.unitPrice, lineTotal: line.quantity * line.unitPrice }; }) };
}
function calculateSupplierQuotation(draft: SupplierQuotationDraft) {
  const errors: Record<string, string> = {}; const rfq = rfqById(draft.rfqId); const supplier = supplierById(draft.supplierId);
  if (!rfq) errors.rfqId = "Vui lòng chọn RFQ đang gửi báo giá.";
  else if (rfq.status === "overdue") errors.rfqId = "RFQ đã quá hạn nhận báo giá.";
  else if (rfq.status !== "sent") errors.rfqId = "RFQ đã chốt hoặc chưa được gửi nhà cung cấp.";
  else if (!rfq.supplierIds.includes(draft.supplierId)) errors.supplierId = "Nhà cung cấp này không thuộc danh sách mời báo giá của RFQ.";
  else if (supplierQuotations().some((quotation) => quotation.rfqId === rfq.id && quotation.supplierId === draft.supplierId && quotation.status !== "rejected")) errors.supplierId = "Nhà cung cấp này đã có báo giá cho RFQ.";
  if (!supplier || supplier.status !== "active") errors.supplierId = "Vui lòng chọn nhà cung cấp đang hoạt động.";
  if (!draft.validUntil) errors.validUntil = "Vui lòng chọn hạn hiệu lực báo giá.";
  else if (draft.validUntil < now) errors.validUntil = "Hạn hiệu lực không thể ở quá khứ.";
  else if (rfq && draft.validUntil < rfq.rfqDate) errors.validUntil = "Hạn hiệu lực không được trước ngày RFQ.";
  if (!Number.isFinite(draft.leadTimeDays) || draft.leadTimeDays < 0) errors.leadTimeDays = "Thời gian giao hàng không hợp lệ.";
  if (!draft.lines.length) errors.lines = "Cần có ít nhất một dòng báo giá.";
  if (rfq) {
    const quantityByItem = new Map<string, number>();
    draft.lines.forEach((line, index) => {
      const sourceLine = rfq.lines.find((candidate) => candidate.itemId === line.itemId);
      quantityByItem.set(line.itemId, (quantityByItem.get(line.itemId) ?? 0) + 1);
      if (!sourceLine) errors[`line-${index}`] = "Hàng hóa không thuộc RFQ đã chọn.";
      else if (line.quantity !== sourceLine.quantity) errors[`line-${index}`] = `Số lượng báo giá phải bằng ${sourceLine.quantity.toLocaleString("vi-VN")} ${sourceLine.unit} theo RFQ.`;
      else if ((quantityByItem.get(line.itemId) ?? 0) > 1) errors[`line-${index}`] = "Mỗi hàng hóa của RFQ chỉ được báo giá một lần.";
    });
    if (draft.lines.length !== rfq.lines.length || rfq.lines.some((sourceLine) => !draft.lines.some((line) => line.itemId === sourceLine.itemId))) errors.lines = "Báo giá phải bao gồm đầy đủ các dòng hàng của RFQ.";
  }
  let subtotal = 0; let vatAmount = 0;
  draft.lines.forEach((line, index) => {
    const product = productById(line.itemId);
    if (!product || !isStockManaged(product)) errors[`line-${index}`] = "Hàng hóa báo giá không hợp lệ.";
    else if (!Number.isFinite(line.quantity) || line.quantity <= 0) errors[`line-${index}`] = "Số lượng phải lớn hơn 0.";
    else if (!Number.isFinite(line.unitPrice) || line.unitPrice < 0) errors[`line-${index}`] = "Đơn giá không hợp lệ.";
    else if (!Number.isFinite(line.discountAmount) || line.discountAmount < 0 || line.discountAmount > line.quantity * line.unitPrice) errors[`line-${index}`] = "Chiết khấu không hợp lệ.";
    const lineAmount = Math.max(0, line.quantity * line.unitPrice - line.discountAmount); subtotal += lineAmount; vatAmount += lineAmount * (product?.vatRate ?? 0);
  });
  return { errors, totalAmount: subtotal + vatAmount };
}
function purchaseOrderDraft(order: PurchaseOrder): PurchaseOrderDraft {
  return { id: order.id, supplierId: order.supplierId, warehouseId: order.warehouseId, orderDate: order.orderDate, expectedReceiptDate: order.expectedReceiptDate, lines: order.lines.map((line) => ({ itemId: line.itemId, quantity: line.quantity, unitPrice: line.unitPrice, discountAmount: line.discountAmount })) };
}
function draftToPurchaseOrder(draft: PurchaseOrderDraft, validation: PurchaseValidation): PurchaseOrder {
  const existing = draft.id ? purchaseOrderById(draft.id) : undefined;
  return { id: draft.id ?? `purchase-order-${Date.now()}`, documentNo: existing?.documentNo ?? `PO-2026-${pad(purchaseOrderCount())}`, supplierId: draft.supplierId, sourcePurchaseRequestId: existing?.sourcePurchaseRequestId ?? null, sourceRfqId: existing?.sourceRfqId ?? null, sourceSupplierQuotationId: existing?.sourceSupplierQuotationId ?? null, amendsPurchaseOrderId: existing?.amendsPurchaseOrderId ?? null, status: existing?.status ?? "draft", orderDate: draft.orderDate, expectedReceiptDate: draft.expectedReceiptDate, warehouseId: draft.warehouseId, subtotal: validation.subtotal, discountAmount: draft.lines.reduce((total, line) => total + line.discountAmount, 0), vatAmount: validation.vatAmount, totalAmount: validation.totalAmount, lines: draft.lines.map((line, index) => { const product = productById(line.itemId)!; const previous = existing?.lines[index]; return { id: previous?.id ?? `pol-${Date.now()}-${index}`, itemId: product.id, description: product.name, unit: product.unit, quantity: line.quantity, receivedQuantity: previous?.receivedQuantity ?? 0, unitPrice: line.unitPrice, discountAmount: line.discountAmount, vatRate: product.vatRate, lineTotal: Math.max(0, line.quantity * line.unitPrice - line.discountAmount) }; }) };
}
function storePurchaseOrder(order: PurchaseOrder) { purchaseOrderOverrides.set(order.id, clone(order)); }
function inventoryMovements(): InventoryMovement[] {
  const source = (data.inventory.stockEntries as any[]).flatMap((entry) => entry.lines.map((line: any, index: number) => {
    const isDelivery = entry.entryType === "delivery";
    return { id: `${entry.id}-${index}`, referenceNo: entry.entryNo, movementType: isDelivery ? "sales_delivery" as const : entry.entryType === "purchase_receipt" ? "purchase_receipt" as const : "transfer_in" as const, itemId: line.itemId, warehouseId: isDelivery ? line.sourceWarehouseId : line.targetWarehouseId ?? entry.warehouseId, quantity: isDelivery ? -Math.abs(line.quantity) : line.quantity, postingDate: entry.postingDate, description: line.description ?? (isDelivery ? "Xuất giao hàng" : entry.entryType) };
  }));
  return [...generatedInventoryMovements, ...source].sort((left, right) => right.postingDate.localeCompare(left.postingDate));
}

function manufacturingBoms(): ManufacturingBom[] {
  return ((data.manufacturing?.boms ?? []) as any[]).map((bom) => ({ id: bom.id, bomNo: bom.bomNo, outputItemId: bom.outputItemId, outputQuantity: bom.outputQuantity, unit: bom.unit, status: bom.status, effectiveFrom: bom.effectiveFrom, lines: bom.lines.map((line: any) => ({ id: line.id, itemId: line.itemId, quantity: line.quantity, unit: line.unit, scrapRate: line.scrapRate ?? 0 })) }));
}
function manufacturingBomById(id: string) { return manufacturingBoms().find((bom) => bom.id === id); }
function manufacturingWorkOrders(): ManufacturingWorkOrder[] {
  const source = ((data.manufacturing?.workOrders ?? []) as any[]).map((order) => ({ id: order.id, workOrderNo: order.workOrderNo, bomId: order.bomId, outputItemId: order.outputItemId, inputWarehouseId: order.inputWarehouseId ?? "wh-hcm-rm", outputWarehouseId: order.outputWarehouseId ?? "wh-hcm-main", plannedQuantity: order.plannedQuantity, completedQuantity: order.completedQuantity ?? 0, rejectedQuantity: order.rejectedQuantity ?? 0, plannedStartDate: order.plannedStartDate, plannedEndDate: order.plannedEndDate, status: order.status as ManufacturingWorkOrderStatus, sourceSalesOrderId: order.sourceSalesOrderId ?? null, progressPercent: order.progressPercent ?? 0 }));
  return [...source, ...generatedWorkOrders].map((order) => workOrderOverrides.get(order.id) ?? order).sort((left, right) => right.plannedStartDate.localeCompare(left.plannedStartDate) || right.workOrderNo.localeCompare(left.workOrderNo));
}
function manufacturingWorkOrderById(id: string) { return manufacturingWorkOrders().find((order) => order.id === id); }
function manufacturingWorkOrderCount() { return manufacturingWorkOrders().length + 33; }
function manufacturingJobCards(): ManufacturingJobCard[] {
  const source = ((data.manufacturing?.jobCards ?? []) as any[]).map((card) => ({ id: card.id, workOrderId: card.workOrderId, workCenterId: card.workCenterId, operation: card.operation, assignedEmployeeIds: card.assignedEmployeeIds ?? [], startedAt: card.startedAt, endedAt: card.endedAt ?? null, completedQuantity: card.completedQuantity ?? 0, rejectedQuantity: card.rejectedQuantity ?? 0, status: card.status }));
  return [...generatedManufacturingJobCards, ...source].sort((left, right) => right.startedAt.localeCompare(left.startedAt));
}
function manufacturingRequirements(bom: ManufacturingBom, quantity: number) {
  return bom.lines.map((line) => {
    const product = productById(line.itemId)!;
    return { ...line, product, requiredQuantity: quantity * line.quantity / bom.outputQuantity * (1 + line.scrapRate) };
  });
}
function manufacturingOptions(): ManufacturingFormOptions { return { boms: manufacturingBoms().filter((bom) => bom.status === "active"), warehouses: physicalWarehouses(), stockBalances: stockBalanceViews() }; }
function validateManufacturingWorkOrder(draft: ManufacturingWorkOrderDraft) {
  const errors: Record<string, string> = {}; const bom = manufacturingBomById(draft.bomId); const inputWarehouse = warehouses().find((warehouse) => warehouse.id === draft.inputWarehouseId); const outputWarehouse = warehouses().find((warehouse) => warehouse.id === draft.outputWarehouseId);
  if (!bom || bom.status !== "active") errors.bomId = "Vui lòng chọn BOM đang hiệu lực.";
  if (!inputWarehouse || inputWarehouse.status !== "active" || inputWarehouse.warehouseType !== "physical") errors.inputWarehouseId = "Vui lòng chọn kho nguyên liệu hợp lệ.";
  if (!outputWarehouse || outputWarehouse.status !== "active" || outputWarehouse.warehouseType !== "physical") errors.outputWarehouseId = "Vui lòng chọn kho nhận thành phẩm hợp lệ.";
  if (!Number.isFinite(draft.plannedQuantity) || draft.plannedQuantity <= 0) errors.plannedQuantity = "Số lượng kế hoạch phải lớn hơn 0.";
  if (!draft.plannedStartDate) errors.plannedStartDate = "Vui lòng chọn ngày bắt đầu.";
  if (!draft.plannedEndDate) errors.plannedEndDate = "Vui lòng chọn ngày hoàn thành kế hoạch.";
  else if (draft.plannedStartDate && draft.plannedEndDate < draft.plannedStartDate) errors.plannedEndDate = "Ngày hoàn thành không được trước ngày bắt đầu.";
  return errors;
}
function manufacturingExpiryDate(date: string) {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + 180);
  return value.toISOString().slice(0, 10);
}
function eligibleManufacturingBatches(itemId: string, warehouseId: string, date: string) {
  return stockBatchViews().filter((batch) => batch.itemId === itemId && batch.warehouseId === warehouseId && batch.qualityStatus === "released" && (!batch.manufacturingDate || batch.manufacturingDate <= date) && (!batch.expiryDate || batch.expiryDate >= date));
}
function validateManufacturingCompletion(draft: ManufacturingCompletionDraft) {
  const errors: Record<string, string> = {}; const order = manufacturingWorkOrderById(draft.workOrderId); const bom = order && manufacturingBomById(order.bomId);
  if (!order || !bom) errors.workOrderId = "Không tìm thấy lệnh sản xuất hoặc BOM nguồn.";
  else if (!["planned", "in_progress"].includes(order.status)) errors.workOrderId = "Chỉ có thể ghi nhận lệnh đang kế hoạch hoặc đang sản xuất.";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.completionDate) || !Number.isFinite(Date.parse(`${draft.completionDate}T00:00:00Z`)) || new Date(`${draft.completionDate}T00:00:00Z`).toISOString().slice(0, 10) !== draft.completionDate) errors.completionDate = "Vui lòng chọn ngày ghi nhận hợp lệ.";
  else if (order && draft.completionDate < order.plannedStartDate) errors.completionDate = "Ngày ghi nhận không được trước ngày bắt đầu lệnh.";
  if (!Number.isFinite(draft.completedQuantity) || draft.completedQuantity < 0) errors.completedQuantity = "Số lượng hoàn thành không hợp lệ.";
  if (!Number.isFinite(draft.rejectedQuantity) || draft.rejectedQuantity < 0) errors.rejectedQuantity = "Số lượng loại không hợp lệ.";
  const processedQuantity = Math.max(0, Number(draft.completedQuantity) || 0) + Math.max(0, Number(draft.rejectedQuantity) || 0);
  if (!processedQuantity) errors.form = "Cần ghi nhận ít nhất một đơn vị hoàn thành hoặc loại.";
  if (order && processedQuantity > order.plannedQuantity - order.completedQuantity - order.rejectedQuantity) errors.form = `Số lượng ghi nhận vượt phần còn lại ${(order.plannedQuantity - order.completedQuantity - order.rejectedQuantity).toLocaleString("vi-VN")} ${productById(order.outputItemId)?.unit ?? "đơn vị"}.`;
  const outputProduct = order && productById(order.outputItemId);
  if (outputProduct?.trackBatch && draft.completedQuantity > 0 && !draft.batchNo?.trim()) errors.batchNo = "Thành phẩm quản lý theo lô, vui lòng nhập mã lô thành phẩm.";
  if (order && outputProduct?.trackBatch && draft.completedQuantity > 0 && draft.batchNo?.trim() && !errors.completionDate) {
    // Inspect even empty lots, and lots in other warehouses, to preserve lot identity.
    const existing = stockBatchRecords().filter((batch) => batch.itemId === order.outputItemId && normalizeBatchNo(batch.batchNo) === normalizeBatchNo(draft.batchNo));
    if (existing.some((batch) => batch.manufacturingDate !== draft.completionDate || batch.expiryDate !== manufacturingExpiryDate(draft.completionDate) || batch.qualityStatus !== "released")) errors.batchNo = "Mã lô đã tồn tại với ngày sản xuất, hạn dùng hoặc trạng thái QC khác. Vui lòng dùng mã lô mới cho mẻ này.";
  }
  if (order && bom && processedQuantity > 0) manufacturingRequirements(bom, processedQuantity).forEach((line) => {
    const available = stockBalanceFor(line.itemId, order.inputWarehouseId)?.availableQuantity ?? 0;
    if (available + 0.000001 < line.requiredQuantity) errors[`material-${line.itemId}`] = `${line.product.name} chỉ còn khả dụng ${available.toLocaleString("vi-VN", { maximumFractionDigits: 2 })} ${line.product.unit}, cần ${line.requiredQuantity.toLocaleString("vi-VN", { maximumFractionDigits: 2 })}.`;
    if (line.product.trackBatch) {
      const batchQuantity = eligibleManufacturingBatches(line.itemId, order.inputWarehouseId, draft.completionDate).reduce((total, batch) => total + batch.quantityOnHand, 0);
      if (batchQuantity < line.requiredQuantity) errors[`material-${line.itemId}`] = `${line.product.name} không đủ tồn lô đã đạt QC và còn hạn tại ngày ghi nhận. Lô hết hạn hoặc chưa đến ngày sản xuất không được xuất.`;
    }
  });
  return { errors, order, bom, processedQuantity };
}
function consumeManufacturingMaterial(itemId: string, warehouseId: string, quantity: number, unitCost: number, date: string) {
  const product = productById(itemId); postInventoryAdjustment(itemId, warehouseId, -quantity, unitCost);
  if (!product?.trackBatch) return;
  let remaining = quantity;
  eligibleManufacturingBatches(itemId, warehouseId, date).sort((left, right) => (left.expiryDate ?? "9999-12-31").localeCompare(right.expiryDate ?? "9999-12-31") || left.batchNo.localeCompare(right.batchNo)).forEach((batch) => {
    if (remaining <= 0) return;
    const issuedQuantity = Math.min(remaining, batch.quantityOnHand);
    postBatchAdjustment(itemId, warehouseId, batch.batchNo, -issuedQuantity);
    remaining -= issuedQuantity;
  });
}

function validateLead(draft: LeadDraft, id?: string) { const errors: Record<string, string> = {}; if (!draft.fullName.trim()) errors.fullName = "Vui lòng nhập họ tên lead."; if (!draft.companyName.trim()) errors.companyName = "Vui lòng nhập tên công ty."; if (!/^0\d{9,10}$/.test(draft.phone.replace(/\s/g, ""))) errors.phone = "Số điện thoại chưa hợp lệ."; if (!/^\S+@\S+\.\S+$/.test(draft.email)) errors.email = "Email chưa hợp lệ."; else if (leadStore.some((item) => item.email.toLowerCase() === draft.email.toLowerCase() && item.id !== id)) errors.email = "Email lead đã tồn tại."; if (!Number.isFinite(draft.score) || draft.score < 0 || draft.score > 100) errors.score = "Điểm lead phải từ 0 đến 100."; if (draft.status === "lost" && !draft.lostReason?.trim()) errors.lostReason = "Vui lòng nêu lý do không thành công."; return errors; }
function validateCustomer(draft: CustomerDraft, id?: string) { const errors: Record<string, string> = {}; if (!draft.name.trim()) errors.name = "Vui lòng nhập tên khách hàng."; if (!draft.taxCode.trim()) errors.taxCode = "Vui lòng nhập mã số thuế."; else if (customerStore.some((item) => item.taxCode === draft.taxCode.trim() && item.id !== id)) errors.taxCode = "Mã số thuế đã tồn tại."; if (!/^0\d{9,10}$/.test(draft.phone.replace(/\s/g, ""))) errors.phone = "Số điện thoại chưa hợp lệ."; if (!/^\S+@\S+\.\S+$/.test(draft.email)) errors.email = "Email chưa hợp lệ."; if (!draft.address.trim()) errors.address = "Vui lòng nhập địa chỉ."; if (!Number.isFinite(draft.creditLimit) || draft.creditLimit < 0) errors.creditLimit = "Hạn mức công nợ không hợp lệ."; if (!Number.isFinite(draft.paymentTermDays) || draft.paymentTermDays < 0) errors.paymentTermDays = "Hạn thanh toán không hợp lệ."; return errors; }
function validateOpportunity(draft: OpportunityDraft, id?: string) { const errors: Record<string, string> = {}; if (!draft.name.trim()) errors.name = "Vui lòng nhập tên cơ hội."; if (!draft.leadId && !draft.customerId) errors.related = "Cần liên kết một lead hoặc khách hàng."; if (!Number.isFinite(draft.expectedValue) || draft.expectedValue <= 0) errors.expectedValue = "Giá trị dự kiến phải lớn hơn 0."; if (!Number.isFinite(draft.probability) || draft.probability < 0 || draft.probability > 100) errors.probability = "Xác suất phải từ 0 đến 100%."; if (!draft.expectedCloseDate) errors.expectedCloseDate = "Vui lòng chọn ngày chốt dự kiến."; if (draft.stage === "lost" && !draft.lostReason?.trim()) errors.lostReason = "Vui lòng nêu lý do thất bại."; if (draft.leadId && !leadStore.some((item) => item.id === draft.leadId)) errors.related = "Lead liên kết không tồn tại."; if (draft.customerId && !customerById(draft.customerId)) errors.related = "Khách hàng liên kết không tồn tại."; if (id && !opportunityStore.some((item) => item.id === id)) errors.form = "Không tìm thấy cơ hội cần cập nhật."; return errors; }
const statusFromStage = (stage: OpportunityStage): Opportunity["status"] => stage === "won" ? "won" : stage === "lost" ? "lost" : "open";
const probabilityFromStage = (stage: OpportunityStage) => ({ qualification: 25, proposal: 60, negotiation: 80, won: 100, lost: 0 } as Record<OpportunityStage, number>)[stage];
function normalizeOpportunityDraft(draft: OpportunityDraft): OpportunityDraft {
  const terminalProbability = draft.stage === "won" ? 100 : draft.stage === "lost" ? 0 : draft.probability;
  return { ...draft, probability: terminalProbability, lostReason: draft.stage === "lost" ? draft.lostReason?.trim() : undefined };
}
function crmActivities() { return [...crmActivityStore].sort((left, right) => left.status === "planned" && right.status !== "planned" ? -1 : right.status === "planned" && left.status !== "planned" ? 1 : left.scheduledAt.localeCompare(right.scheduledAt)); }
function validateCrmActivity(draft: CrmActivityDraft) {
  const errors: Record<string, string> = {};
  if (!draft.subject.trim()) errors.subject = "Vui lòng nhập nội dung hoạt động.";
  else if (draft.subject.trim().length < 3) errors.subject = "Nội dung hoạt động cần tối thiểu 3 ký tự.";
  if (!draft.scheduledAt) errors.scheduledAt = "Vui lòng chọn thời điểm thực hiện.";
  if (!draft.assignedTo) errors.assignedTo = "Vui lòng chọn người phụ trách.";
  if (!draft.customerId && !draft.leadId && !draft.opportunityId) errors.related = "Cần liên kết hoạt động với lead, khách hàng hoặc cơ hội.";
  if (draft.customerId && !customerById(draft.customerId)) errors.related = "Khách hàng liên kết không tồn tại.";
  if (draft.leadId && !leadStore.some((lead) => lead.id === draft.leadId)) errors.related = "Lead liên kết không tồn tại.";
  if (draft.opportunityId && !opportunityStore.some((opportunity) => opportunity.id === draft.opportunityId)) errors.related = "Cơ hội liên kết không tồn tại.";
  return errors;
}
function customerActivities(customerId: string, opportunities: Opportunity[]) {
  const opportunityIds = new Set(opportunities.map((opportunity) => opportunity.id));
  return crmActivities().filter((activity) => activity.customerId === customerId || (activity.opportunityId && opportunityIds.has(activity.opportunityId)));
}

function financeOverview(): FinanceOverview {
  const receivables: FinanceDocument[] = invoices().map((invoice) => ({
    id: invoice.id,
    documentNo: invoice.documentNo,
    direction: "receivable",
    counterpartyId: invoice.customerId,
    counterpartyName: customerById(invoice.customerId)?.name ?? invoice.customerId,
    sourceDocumentNo: documents("order").find((order) => order.id === invoice.salesOrderId)?.documentNo,
    status: invoice.status,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    totalAmount: invoice.totalAmount,
    paidAmount: invoice.paidAmount,
    balanceAmount: invoice.balanceAmount,
  }));
  const payables: FinanceDocument[] = purchaseInvoices().map((invoice) => ({
    id: invoice.id,
    documentNo: invoice.documentNo,
    direction: "payable",
    counterpartyId: invoice.supplierId,
    counterpartyName: supplierById(invoice.supplierId)?.name ?? invoice.supplierId,
    sourceDocumentNo: purchaseOrders().find((order) => order.id === invoice.purchaseOrderId)?.documentNo,
    status: invoice.status,
    issueDate: invoice.invoiceDate,
    dueDate: invoice.dueDate,
    totalAmount: invoice.totalAmount,
    paidAmount: invoice.paidAmount,
    balanceAmount: invoice.balanceAmount,
  }));

  const salesInvoiceById = new Map(receivables.map((invoice) => [invoice.id, invoice]));
  const purchaseInvoiceById = new Map(payables.map((invoice) => [invoice.id, invoice]));
  const staticPayments: FinancePayment[] = ((data.finance?.payments ?? []) as any[]).flatMap((payment) => payment.allocations.map((allocation: any, index: number) => {
    const isIncoming = payment.paymentType === "incoming";
    const document = isIncoming ? salesInvoiceById.get(allocation.invoiceId) : purchaseInvoiceById.get(allocation.invoiceId);
    const counterparty = isIncoming ? customerById(payment.counterpartyId) : supplierById(payment.counterpartyId);
    return {
      id: `${payment.id}-${index}`,
      paymentNo: payment.paymentNo,
      direction: isIncoming ? "incoming" : "outgoing",
      counterpartyName: counterparty?.name ?? payment.counterpartyId,
      paymentDate: payment.paymentDate,
      methodName: paymentMethods().find((method) => method.id === payment.methodId)?.name ?? payment.methodId,
      sourceDocumentNo: document?.documentNo ?? allocation.invoiceId,
      referenceNo: payment.bankReference,
      totalAmount: allocation.allocatedAmount,
      status: "completed" as const,
    };
  }));
  const currentSalesPayments: FinancePayment[] = generatedPayments.map((payment) => {
    const invoice = salesInvoiceById.get(payment.invoiceId);
    return { id: payment.id, paymentNo: payment.paymentNo, direction: "incoming", counterpartyName: invoice?.counterpartyName ?? "Khách hàng", paymentDate: payment.paymentDate, methodName: payment.methodName, sourceDocumentNo: invoice?.documentNo ?? payment.invoiceId, totalAmount: payment.totalAmount, status: payment.status };
  });
  const currentPurchasePayments: FinancePayment[] = generatedPurchasePayments.map((payment) => {
    const invoice = purchaseInvoiceById.get(payment.purchaseInvoiceId);
    return { id: payment.id, paymentNo: payment.paymentNo, direction: "outgoing", counterpartyName: invoice?.counterpartyName ?? supplierById(payment.supplierId)?.name ?? payment.supplierId, paymentDate: payment.paymentDate, methodName: payment.methodName, sourceDocumentNo: invoice?.documentNo ?? payment.purchaseInvoiceId, referenceNo: payment.referenceNo, totalAmount: payment.totalAmount, status: payment.status };
  });
  const payments = [...generatedPosPayments, ...currentSalesPayments, ...currentPurchasePayments, ...staticPayments].sort((left, right) => right.paymentDate.localeCompare(left.paymentDate) || right.paymentNo.localeCompare(left.paymentNo));
  const baseCash = ((data.finance?.bankAccounts ?? []) as any[]).reduce((total, account) => total + Number(account.balance ?? 0), 0);
  // Only bank transfers hit the displayed bank-account balance. Cash, cards and e-wallets
  // are posted to their own settlement accounts and must not silently alter bank cash.
  const sessionCashImpact = generatedPayments.filter((payment) => isBankSettlement(payment.methodId)).reduce((total, payment) => total + payment.totalAmount, 0) - generatedPurchasePayments.filter((payment) => isBankSettlement(payment.methodId)).reduce((total, payment) => total + payment.totalAmount, 0);
  const outstandingReceivables = receivables.filter((invoice) => invoice.status !== "cancelled" && invoice.balanceAmount > 0);
  const outstandingPayables = payables.filter((invoice) => invoice.status !== "cancelled" && invoice.balanceAmount > 0);
  return {
    asOfDate: now,
    cashBalance: baseCash + sessionCashImpact,
    receivableBalance: outstandingReceivables.reduce((total, invoice) => total + invoice.balanceAmount, 0),
    payableBalance: outstandingPayables.reduce((total, invoice) => total + invoice.balanceAmount, 0),
    overdueReceivableBalance: outstandingReceivables.filter((invoice) => invoice.status === "overdue" || invoice.dueDate < now).reduce((total, invoice) => total + invoice.balanceAmount, 0),
    receivables: receivables.sort((left, right) => left.dueDate.localeCompare(right.dueDate)),
    payables: payables.sort((left, right) => left.dueDate.localeCompare(right.dueDate)),
    payments,
    journalEntries: journalEntryViews(),
  };
}

function dateRangesOverlap(fromDate: string, toDate: string, comparedFrom: string, comparedTo: string) {
  return fromDate <= comparedTo && comparedFrom <= toDate;
}
function businessDaysBetween(fromDate: string, toDate: string) {
  let total = 0; const cursor = new Date(`${fromDate}T00:00:00`); const end = new Date(`${toDate}T00:00:00`);
  while (cursor <= end) { const day = cursor.getDay(); if (day !== 0 && day !== 6) total += 1; cursor.setDate(cursor.getDate() + 1); }
  return total;
}
function periodBounds(period: string) { return { from: `${period}-01`, to: `${period}-${String(new Date(Number(period.slice(0, 4)), Number(period.slice(5, 7)), 0).getDate()).padStart(2, "0")}` }; }
function overlapBusinessDays(fromDate: string, toDate: string, comparedFrom: string, comparedTo: string) {
  const from = fromDate > comparedFrom ? fromDate : comparedFrom; const to = toDate < comparedTo ? toDate : comparedTo;
  return from <= to ? businessDaysBetween(from, to) : 0;
}
function validTime(value?: string) { return Boolean(value && /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/.test(value)); }
function hrOverview(): HrOverview {
  const businessDate = hrToday();
  const approvedLeaveToday = new Set(leaveRequestStore.filter((request) => request.status === "approved" && request.fromDate <= businessDate && businessDate <= request.toDate).map((request) => request.employeeId));
  const recordsByEmployee = new Map(attendanceStore.filter((record) => record.workDate === businessDate).map((record) => [record.employeeId, record]));
  const attendance = hrEmployees.filter((employee) => employee.status === "active").map((employee) => {
    const record = recordsByEmployee.get(employee.id);
    if (record) return record;
    return { id: `attendance-view-${employee.id}-${businessDate}`, employeeId: employee.id, workDate: businessDate, status: approvedLeaveToday.has(employee.id) ? "on_leave" as const : "absent" as const };
  });
  return { asOfDate: businessDate, employees: hrEmployees, attendance, leaveRequests: leaveRequestStore, salaryStructures: salaryStructureStore, contracts: contractStore, payrollEntries: payrollEntryStore };
}

function employeeSelfServiceOverview(employeeId: string): EmployeeSelfServiceOverview | undefined {
  const overview = hrOverview(); const employee = overview.employees.find((item) => item.id === employeeId); const attendance = overview.attendance.find((item) => item.employeeId === employeeId);
  if (!employee || !attendance) return undefined;
  return { asOfDate: overview.asOfDate, employee, attendance, leaveRequests: overview.leaveRequests.filter((item) => item.employeeId === employeeId) };
}

function payrollLinesForPeriod(period: string): PayrollLine[] {
  const { from: periodStart, to: periodEnd } = periodBounds(period); const scheduledWorkdays = businessDaysBetween(periodStart, periodEnd);
  return hrEmployees.filter((employee) => employee.status === "active").flatMap((employee) => {
    const contract = contractStore.find((item) => item.employeeId === employee.id && item.status === "active" && item.startDate.slice(0, 7) <= period && item.endDate.slice(0, 7) >= period);
    const structure = salaryStructureStore.find((item) => item.id === contract?.salaryStructureId && item.status === "active");
    if (!structure) return [];
    const contractualWorkdays = overlapBusinessDays(periodStart, periodEnd, contract!.startDate, contract!.endDate);
    const unpaidLeaveDays = leaveRequestStore.filter((request) => request.employeeId === employee.id && request.status === "approved" && request.leaveType === "unpaid").reduce((total, request) => total + overlapBusinessDays(periodStart, periodEnd, request.fromDate, request.toDate), 0);
    const payableWorkdays = Math.max(0, contractualWorkdays - unpaidLeaveDays);
    const baseSalary = Math.round(structure.baseSalary * payableWorkdays / scheduledWorkdays);
    const allowanceAmount = Math.round(structure.allowanceAmount * payableWorkdays / scheduledWorkdays);
    const grossAmount = baseSalary + allowanceAmount;
    const deductionAmount = Math.round(grossAmount * structure.insuranceRate);
    return [{ id: `payline-${period}-${employee.id}`, employeeId: employee.id, baseSalary, allowanceAmount, grossAmount, deductionAmount, netAmount: grossAmount - deductionAmount, scheduledWorkdays, payableWorkdays, unpaidLeaveDays }];
  });
}
function posProfiles(): PosProfile[] {
  const storesById = new Map(((data.pos?.stores ?? []) as any[]).map((store) => [store.id, store]));
  return ((data.pos?.profiles ?? []) as any[]).map((profile) => ({ id: profile.id, code: profile.code, name: profile.name, storeName: storesById.get(profile.storeId)?.name ?? "Cửa hàng", warehouseId: profile.warehouseId, status: profile.status }));
}
function posShifts(): PosShift[] {
  const staticShifts = ((data.pos?.shifts ?? []) as any[]).map((shift) => ({ id: shift.id, shiftNo: shift.shiftNo, profileId: shift.profileId, cashierName: shift.cashierId === "emp-005" ? "Võ Đức Long" : shift.cashierId, openedAt: shift.openedAt, closedAt: shift.closedAt ?? undefined, openingCash: shift.openingCash, expectedCash: shift.expectedCash, actualCash: shift.actualCash, difference: shift.difference, status: shift.status }));
  return [...generatedPosShifts, ...staticShifts].sort((left, right) => right.openedAt.localeCompare(left.openedAt));
}
function posInvoices(): PosInvoice[] {
  const methods = new Map(paymentMethods().map((method) => [method.id, method.name]));
  const staticInvoices = ((data.pos?.invoices ?? []) as any[]).map((invoice) => ({ id: invoice.id, receiptNo: invoice.receiptNo, shiftId: invoice.shiftId, postedAt: invoice.postedAt, subtotal: invoice.subtotal, vatAmount: invoice.vatAmount, totalAmount: invoice.totalAmount, paymentMethodName: methods.get(invoice.payments?.[0]?.methodId) ?? "Thanh toán", lines: invoice.lines.map((line: any) => ({ itemId: line.itemId, name: line.name, quantity: line.quantity, unitPrice: line.unitPrice })) }));
  return [...generatedPosInvoices, ...staticInvoices].sort((left, right) => right.postedAt.localeCompare(left.postedAt));
}
function posOverview(): PosOverview { return { profiles: posProfiles(), shifts: posShifts(), invoices: posInvoices(), products: products().filter((product) => product.status === "active"), paymentMethods: paymentMethods().filter((method) => method.isActive), stockBalances: stockBalanceViews() }; }
function projectOverview(): ProjectOverview {
  const employees = hrEmployees; const nameFor = (id?: string) => employees.find((employee) => employee.id === id)?.fullName ?? "Chưa phân công";
  const rawProjects = [...((data.projects?.projects ?? []) as any[]), ...generatedProjects].map((project) => projectOverrides.get(project.id) ?? project);
  const rawTasks = [...((data.projects?.tasks ?? []) as any[]), ...generatedProjectTasks];
  const taskNameById = new Map(rawTasks.map((task) => [task.id, task.title]));
  const tasks = rawTasks.map((task) => projectTaskOverrides.get(task.id) ?? ({ id: task.id, projectId: task.projectId, code: task.code, title: task.title, assigneeId: task.assigneeId, assigneeName: nameFor(task.assigneeId), startDate: task.startDate, dueDate: task.dueDate, status: task.status, progressPercent: task.progressPercent, priority: task.priority ?? "medium", isMilestone: task.isMilestone ?? false, predecessorIds: task.predecessorIds ?? [], predecessorNames: (task.predecessorIds ?? []).map((id: string) => taskNameById.get(id) ?? id), comments: task.comments ?? [], attachments: task.attachments ?? [] }));
  const staticTimesheets: ProjectTimesheet[] = ((data.projects?.timesheets ?? []) as any[]).map((entry) => projectTimesheetOverrides.get(entry.id) ?? ({ id: entry.id, projectId: entry.projectId, taskId: entry.taskId, taskTitle: taskNameById.get(entry.taskId) ?? entry.taskId, employeeId: entry.employeeId, employeeName: nameFor(entry.employeeId), workDate: entry.workDate, hours: entry.hours, status: entry.status, note: entry.note ?? "", createdByEmployeeId: entry.createdByEmployeeId }));
  const timesheets = [...generatedProjectTimesheets, ...staticTimesheets].sort((left, right) => right.workDate.localeCompare(left.workDate));
  const staticEntries: ProjectFinancialEntry[] = ((data.projects?.financialEntries ?? []) as any[]).map((entry) => ({ id: entry.id, projectId: entry.projectId, postingDate: entry.postingDate, entryType: entry.entryType, sourceDocumentNo: entry.sourceDocumentNo, description: entry.description, amount: entry.amount }));
  const financialEntries = [...generatedProjectFinancialEntries, ...staticEntries].sort((left, right) => right.postingDate.localeCompare(left.postingDate));
  const financialSources: ProjectFinancialSource[] = [...purchaseInvoices().filter((invoice) => invoice.status !== "cancelled").map((invoice) => ({ documentNo: invoice.documentNo, entryType: "expense" as const, postingDate: invoice.invoiceDate, description: `Hóa đơn mua ${invoice.supplierInvoiceNo}`, amount: invoice.subtotal })), ...invoices().filter((invoice) => invoice.status !== "cancelled").map((invoice) => ({ documentNo: invoice.documentNo, entryType: "revenue" as const, postingDate: invoice.issueDate, description: `Hóa đơn bán hàng`, amount: invoice.subtotal, customerId: invoice.customerId }))];
  const projects: Project[] = rawProjects.map((project) => { const projectTasks = tasks.filter((task) => task.projectId === project.id); const progressPercent = projectTasks.length ? Math.round(projectTasks.reduce((total, task) => total + task.progressPercent, 0) / projectTasks.length) : project.progressPercent; const derivedStatus: ProjectStatus = projectTasks.length ? (projectTasks.every((task) => task.status === "completed") ? "completed" : projectTasks.every((task) => task.status === "not_started") ? "not_started" : "in_progress") : project.status; const status: ProjectStatus = ["on_hold", "cancelled", "completed"].includes(project.status) ? project.status : derivedStatus; const entries = financialEntries.filter((entry) => entry.projectId === project.id); const documentCost = entries.filter((entry) => entry.entryType === "expense").reduce((total, entry) => total + entry.amount, 0); const laborCost = timesheets.filter((entry) => entry.projectId === project.id && entry.status === "approved").reduce((total, entry) => total + entry.hours * 125_000, 0); const actualCost = documentCost + laborCost; const actualRevenue = entries.filter((entry) => entry.entryType === "revenue").reduce((total, entry) => total + entry.amount, 0); const teamMemberIds = project.teamMemberIds ?? [project.managerId]; return { id: project.id, code: project.code, name: project.name, customerId: project.customerId, customerName: customerById(project.customerId)?.name, managerId: project.managerId, managerName: nameFor(project.managerId), teamMemberIds, teamMemberNames: teamMemberIds.map(nameFor), startDate: project.startDate, endDate: project.endDate, budgetAmount: project.budgetAmount, actualCost, laborCost, actualRevenue, budgetRemaining: project.budgetAmount - actualCost, budgetUtilization: project.budgetAmount ? Math.round(actualCost / project.budgetAmount * 100) : 0, status, progressPercent }; }); return { projects, tasks, timesheets, financialEntries, financialSources, activities: projectActivities.filter((activity) => rawProjects.some((project) => project.id === activity.projectId)), employees, customers: customerStore.filter((customer) => customer.status === "active") };
}
function projectOverviewForActiveUser(): ProjectOverview {
  const overview = projectOverview(); const employeeId = activeEmployeeId(); const isActualAdmin = activeUser()?.role === "System Admin";
  if (isActualAdmin || !employeeId) return overview;
  const allowedProjectIds = new Set(overview.projects.filter((project) => project.managerId === employeeId || project.teamMemberIds.includes(employeeId)).map((project) => project.id));
  return { ...overview, projects: overview.projects.filter((project) => allowedProjectIds.has(project.id)), tasks: overview.tasks.filter((task) => allowedProjectIds.has(task.projectId)), timesheets: overview.timesheets.filter((entry) => allowedProjectIds.has(entry.projectId)), financialEntries: overview.financialEntries.filter((entry) => allowedProjectIds.has(entry.projectId)), activities: overview.activities.filter((entry) => allowedProjectIds.has(entry.projectId)) };
}
function logProjectActivity(projectId: string, action: string, detail: string) { projectActivities.unshift({ id: `project-activity-${Date.now()}-${projectActivities.length}`, projectId, at: `${now}T12:00:00+07:00`, actor: currentActor(), action, detail }); }

const mockApiBase = {
  dashboard: { getOverview: () => respond<DashboardOverview>({ period: data.dashboard.period, metrics: data.dashboard.metrics, revenueByDay: data.dashboard.revenueByDay, salesByChannel: data.dashboard.salesByChannel, recentActivities: data.dashboard.recentActivities, approvals: data.auth.approvalInbox, lowStockAlerts: data.inventory.lowStockAlerts }) },
  finance: { getOverview: () => respond<FinanceOverview>(financeOverview()) },
  hr: {
    getOverview: () => respond<HrOverview>(hrOverview()),
    getSelfServiceOverview: () => respond<EmployeeSelfServiceOverview | undefined>(activeEmployeeId() ? employeeSelfServiceOverview(activeEmployeeId()!) : undefined),
    checkIn: (employeeId: string) => {
      const businessDate = hrToday(); const time = currentTime(); const errors: Record<string, string> = {}; const ownEmployeeId = activeEmployeeId(); const employee = hrEmployees.find((item) => item.id === employeeId); const existing = attendanceStore.find((item) => item.employeeId === employeeId && item.workDate === businessDate); const onApprovedLeave = leaveRequestStore.some((request) => request.employeeId === employeeId && request.status === "approved" && request.fromDate <= businessDate && businessDate <= request.toDate);
      if (isSelfServiceOnly() && ownEmployeeId !== employeeId) errors.employeeId = "Bạn chỉ có thể chấm công cho chính mình."; else if (!employee || employee.status !== "active") errors.employeeId = "Nhân viên không ở trạng thái làm việc."; else if (onApprovedLeave) errors.form = "Nhân viên đang có đơn nghỉ đã được duyệt hôm nay."; else if (existing?.checkIn) errors.form = "Nhân viên đã chấm công vào hôm nay.";
      if (Object.keys(errors).length) return respond(mutation<AttendanceRecord>(null, errors));
      const entity: AttendanceRecord = existing ? { ...existing, checkIn: time, status: time > "08:15" ? "late" : "present" } : { id: `att-${Date.now()}`, employeeId, workDate: businessDate, checkIn: time, status: time > "08:15" ? "late" : "present" };
      if (existing) attendanceStore.splice(attendanceStore.indexOf(existing), 1, entity); else attendanceStore.unshift(entity); return respond(mutation(entity));
    },
    checkOut: (employeeId: string) => {
      const businessDate = hrToday(); const time = currentTime(); const ownEmployeeId = activeEmployeeId(); if (isSelfServiceOnly() && ownEmployeeId !== employeeId) return respond(mutation<AttendanceRecord>(null, { employeeId: "Bạn chỉ có thể chấm công cho chính mình." })); const record = attendanceStore.find((item) => item.employeeId === employeeId && item.workDate === businessDate); if (!record?.checkIn) return respond(mutation<AttendanceRecord>(null, { form: "Cần chấm công vào trước khi chấm công ra." })); if (record.checkOut) return respond(mutation<AttendanceRecord>(null, { form: "Nhân viên đã chấm công ra." })); if (time <= record.checkIn) return respond(mutation<AttendanceRecord>(null, { form: "Giờ chấm công ra phải sau giờ vào." }));
      const entity = { ...record, checkOut: time }; attendanceStore.splice(attendanceStore.indexOf(record), 1, entity); return respond(mutation(entity));
    },
    adjustAttendance: (draft: AttendanceAdjustmentDraft) => {
      const businessDate = hrToday(); const errors: Record<string, string> = {}; const employee = hrEmployees.find((item) => item.id === draft.employeeId); const existing = attendanceStore.find((item) => item.employeeId === draft.employeeId && item.workDate === businessDate); const onApprovedLeave = leaveRequestStore.some((request) => request.employeeId === draft.employeeId && request.status === "approved" && request.fromDate <= businessDate && businessDate <= request.toDate); const finalCheckIn = draft.checkIn || existing?.checkIn; const finalCheckOut = draft.checkOut || existing?.checkOut; const checkIn = finalCheckIn ?? "";
      if (!employee || employee.status !== "active") errors.employeeId = "Chỉ có thể điều chỉnh cho nhân viên đang làm việc."; else if (onApprovedLeave) errors.form = "Không thể điều chỉnh chấm công cho ngày nhân viên đã nghỉ được duyệt."; else if (!validTime(checkIn)) errors.checkIn = "Cần có giờ vào hợp lệ trước khi ghi nhận giờ ra."; else if (finalCheckOut && !validTime(finalCheckOut)) errors.checkOut = "Giờ ra không hợp lệ."; else if (finalCheckOut && finalCheckOut <= checkIn) errors.checkOut = "Giờ ra phải sau giờ vào."; if (!draft.reason.trim()) errors.reason = "Bắt buộc nêu lý do điều chỉnh chấm công.";
      if (Object.keys(errors).length) return respond(mutation<AttendanceRecord>(null, errors));
      const entity: AttendanceRecord = { id: existing?.id ?? `att-${Date.now()}`, employeeId: draft.employeeId, workDate: businessDate, checkIn, checkOut: finalCheckOut, status: checkIn > "08:15" ? "late" : "present", note: draft.reason.trim(), adjustedBy: currentActor(), adjustedAt: `${businessDate} ${currentTime()}` };
      if (existing) attendanceStore.splice(attendanceStore.indexOf(existing), 1, entity); else attendanceStore.unshift(entity); return respond(mutation(entity));
    },
    createLeaveRequest: (draft: Omit<LeaveRequest, "id" | "requestNo" | "totalDays" | "status">) => {
      const errors: Record<string, string> = {}; const ownEmployeeId = activeEmployeeId(); const employee = hrEmployees.find((item) => item.id === draft.employeeId);
      if (isSelfServiceOnly() && ownEmployeeId !== draft.employeeId) errors.employeeId = "Bạn chỉ có thể tạo đơn nghỉ cho chính mình."; else if (!employee) errors.employeeId = "Không tìm thấy nhân viên."; else if (employee.status !== "active") errors.employeeId = "Chỉ có thể tạo đơn cho nhân viên đang làm việc.";
      const businessDate = hrToday(); const attendance = attendanceStore.find((record) => record.employeeId === draft.employeeId && record.workDate === businessDate);
      if (!draft.fromDate || !draft.toDate || draft.toDate < draft.fromDate) errors.dates = "Khoảng thời gian nghỉ không hợp lệ."; else if (draft.fromDate < businessDate) errors.dates = "Không thể tạo đơn nghỉ cho ngày đã qua."; else if (draft.fromDate <= businessDate && businessDate <= draft.toDate && attendance?.checkIn) errors.dates = "Nhân viên đã có chấm công hôm nay; cần dùng quy trình điều chỉnh chấm công hoặc tạo nghỉ nửa ngày."; else if (leaveRequestStore.some((request) => request.employeeId === draft.employeeId && ["pending", "approved"].includes(request.status) && dateRangesOverlap(draft.fromDate, draft.toDate, request.fromDate, request.toDate))) errors.dates = "Nhân viên đã có đơn nghỉ chờ duyệt hoặc đã duyệt trong khoảng thời gian này.";
      if (!draft.reason.trim()) errors.reason = "Vui lòng nêu lý do nghỉ.";
      if (Object.keys(errors).length) return respond(mutation<LeaveRequest>(null, errors)); const days = businessDaysBetween(draft.fromDate, draft.toDate); const entity: LeaveRequest = { ...draft, id: `leave-${Date.now()}`, requestNo: `LV-2026-${pad(leaveRequestStore.length + 1)}`, totalDays: days, status: "pending" }; leaveRequestStore.unshift(entity); return respond(mutation(entity));
    },
    decideLeaveRequest: (id: string, approved: boolean) => { const request = leaveRequestStore.find((item) => item.id === id); const businessDate = hrToday(); const hasConflict = request && leaveRequestStore.some((item) => item.id !== request.id && item.employeeId === request.employeeId && item.status === "approved" && dateRangesOverlap(request.fromDate, request.toDate, item.fromDate, item.toDate)); const attendance = request && attendanceStore.find((record) => record.employeeId === request.employeeId && record.workDate === businessDate); if (!request || request.status !== "pending") return respond(mutation<LeaveRequest>(null, { form: "Đơn nghỉ không còn chờ phê duyệt." })); if (activeEmployeeId() === request.employeeId) return respond(mutation<LeaveRequest>(null, { form: "Không thể tự duyệt hoặc từ chối đơn nghỉ của chính mình." })); if (approved && hasConflict) return respond(mutation<LeaveRequest>(null, { form: "Không thể duyệt vì nhân viên đã có đơn nghỉ được duyệt trùng thời gian." })); if (approved && request.fromDate <= businessDate && businessDate <= request.toDate && attendance?.checkIn) return respond(mutation<LeaveRequest>(null, { form: "Nhân viên đã có chấm công hôm nay; không thể duyệt nghỉ cả ngày." })); const entity = { ...request, status: approved ? "approved" as const : "rejected" as const, decidedBy: currentActor(), decidedAt: `${businessDate} ${currentTime()}` }; leaveRequestStore.splice(leaveRequestStore.indexOf(request), 1, entity); return respond(mutation(entity)); },
    createEmploymentContract: (draft: EmploymentContractDraft) => {
      const errors: Record<string, string> = {}; if (isSelfServiceOnly()) errors.form = "Nhân viên không có quyền lập hợp đồng lao động."; const employee = hrEmployees.find((item) => item.id === draft.employeeId); const structure = salaryStructureStore.find((item) => item.id === draft.salaryStructureId && item.status === "active");
      if (!employee || employee.status !== "active") errors.employeeId = "Chỉ có thể lập hợp đồng cho nhân viên đang làm việc."; if (!structure) errors.salaryStructureId = "Vui lòng chọn cấu trúc lương đang hiệu lực."; if (!draft.startDate || !draft.endDate || draft.endDate < draft.startDate) errors.dates = "Thời hạn hợp đồng không hợp lệ.";
      const overlaps = contractStore.some((item) => item.employeeId === draft.employeeId && item.status === "active" && dateRangesOverlap(draft.startDate, draft.endDate, item.startDate, item.endDate)); if (overlaps) errors.dates = "Nhân viên đã có hợp đồng còn hiệu lực trùng thời gian.";
      if (Object.keys(errors).length) return respond(mutation<EmploymentContract>(null, errors)); const entity: EmploymentContract = { ...draft, id: `contract-${Date.now()}`, contractNo: `HDLD-2026-${pad(contractStore.length + 1)}`, status: "active" }; contractStore.unshift(entity); return respond(mutation(entity));
    },
    createPayroll: (draft: PayrollDraft) => {
      const errors: Record<string, string> = {}; if (isSelfServiceOnly()) errors.form = "Nhân viên không có quyền lập bảng lương."; if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(draft.period)) errors.period = "Kỳ lương phải theo định dạng YYYY-MM."; if (!draft.paymentDate || draft.paymentDate.slice(0, 7) < draft.period) errors.paymentDate = "Ngày dự kiến chi không được trước kỳ lương."; if (payrollEntryStore.some((item) => item.period === draft.period)) errors.period = "Kỳ lương này đã được lập.";
      const lines = payrollLinesForPeriod(draft.period); if (!lines.length) errors.form = "Không có nhân viên có hợp đồng và cấu trúc lương hợp lệ trong kỳ này."; if (Object.keys(errors).length) return respond(mutation<PayrollEntry>(null, errors));
      const totalGross = lines.reduce((sum, line) => sum + line.grossAmount, 0); const totalDeduction = lines.reduce((sum, line) => sum + line.deductionAmount, 0); const entity: PayrollEntry = { id: `payroll-${Date.now()}`, payrollNo: `PAYROLL-${draft.period}`, period: draft.period, paymentDate: draft.paymentDate, status: "draft", lines, totalGross, totalDeduction, totalNet: totalGross - totalDeduction, createdBy: currentActor() }; payrollEntryStore.unshift(entity); return respond(mutation(entity));
    },
    approvePayroll: (id: string) => { const entry = payrollEntryStore.find((item) => item.id === id); const actor = currentActor(); if (!entry || entry.status !== "draft") return respond(mutation<PayrollEntry>(null, { form: "Chỉ có thể duyệt bảng lương đang ở trạng thái nháp." })); if (entry.createdBy === actor) return respond(mutation<PayrollEntry>(null, { form: "Người lập không thể tự duyệt bảng lương. Hãy chuyển cho người có thẩm quyền khác." })); const entity: PayrollEntry = { ...entry, status: "approved", approvedBy: actor }; payrollEntryStore.splice(payrollEntryStore.indexOf(entry), 1, entity); postJournalEntry(entity.payrollNo, hrToday(), [{ accountCode: "642", debit: entity.totalGross, credit: 0 }, { accountCode: "334", debit: 0, credit: entity.totalNet }, { accountCode: "338", debit: 0, credit: entity.totalDeduction }]); return respond(mutation(entity)); },
    payPayroll: (id: string, paymentDate: string) => { const entry = payrollEntryStore.find((item) => item.id === id); const actor = currentActor(); if (!entry || entry.status !== "approved") return respond(mutation<PayrollEntry>(null, { form: "Chỉ có thể chi trả bảng lương đã được duyệt." })); if (entry.approvedBy === actor) return respond(mutation<PayrollEntry>(null, { form: "Người duyệt không thể tự ghi nhận chi lương. Hãy chuyển cho kế toán hoặc người có thẩm quyền khác." })); if (!paymentDate || paymentDate < entry.period + "-01") return respond(mutation<PayrollEntry>(null, { paymentDate: "Ngày chi lương không hợp lệ." })); const entity: PayrollEntry = { ...entry, status: "paid", paymentDate, paidBy: actor }; payrollEntryStore.splice(payrollEntryStore.indexOf(entry), 1, entity); postJournalEntry(`PAY-${entry.payrollNo}`, paymentDate, [{ accountCode: "334", debit: entry.totalNet, credit: 0 }, { accountCode: "1121", debit: 0, credit: entry.totalNet }]); return respond(mutation(entity)); },
  },
  pos: {
    getOverview: () => respond<PosOverview>(posOverview()),
    openShift: (profileId: string, openingCash: number) => { const profile = posProfiles().find((item) => item.id === profileId); if (!profile) return respond(mutation<PosShift>(null, { profileId: "Không tìm thấy quầy POS." })); if (posShifts().some((shift) => shift.profileId === profileId && shift.status === "open")) return respond(mutation<PosShift>(null, { form: "Quầy này đang có ca mở." })); if (!Number.isFinite(openingCash) || openingCash < 0) return respond(mutation<PosShift>(null, { openingCash: "Tiền đầu ca không hợp lệ." })); const entity: PosShift = { id: `pos-shift-${Date.now()}`, shiftNo: `SHIFT-HCM-20260829-${pad(posShifts().length + 1)}`, profileId, cashierName: "Nguyễn Ngọc Nam", openedAt: `${now}T08:00:00+07:00`, openingCash, expectedCash: openingCash, status: "open" }; generatedPosShifts.unshift(entity); return respond(mutation(entity)); },
    checkout: (draft: PosCheckoutDraft) => { const profile = posProfiles().find((item) => item.id === draft.profileId); const shift = posShifts().find((item) => item.profileId === draft.profileId && item.status === "open"); const errors: Record<string, string> = {}; if (!profile) errors.profileId = "Vui lòng chọn quầy POS."; if (!shift) errors.form = "Cần mở ca trước khi thanh toán."; const method = paymentMethods().find((method) => method.id === draft.paymentMethodId && method.isActive); if (!method) errors.paymentMethodId = "Vui lòng chọn phương thức thanh toán."; if (!draft.lines.length) errors.lines = "Giỏ hàng đang trống.";
      const quantities = new Map<string, number>(); draft.lines.forEach((line, index) => { if (!line.itemId || !Number.isFinite(line.quantity) || line.quantity <= 0) errors[`line-${index}`] = "Số lượng hàng hóa phải lớn hơn 0."; else quantities.set(line.itemId, (quantities.get(line.itemId) ?? 0) + line.quantity); }); const normalized = [...quantities.entries()].map(([itemId, quantity]) => ({ itemId, quantity }));
      normalized.forEach((line) => { const product = productById(line.itemId); if (!product) errors[`item-${line.itemId}`] = "Hàng hóa không tồn tại."; else if (isStockManaged(product) && availableToSell(line.itemId, profile?.warehouseId ?? "") < line.quantity) errors[`item-${line.itemId}`] = `Tồn khả dụng ${availableToSell(line.itemId, profile?.warehouseId ?? "")} không đủ.`; else if (product.trackBatch) { const sellableBatches = stockBatchViews().filter((batch) => batch.itemId === line.itemId && batch.warehouseId === profile?.warehouseId && batch.qualityStatus === "released" && (!batch.expiryDate || batch.expiryDate >= now)); const batchAvailable = sellableBatches.reduce((total, batch) => total + batch.quantityOnHand, 0); if (batchAvailable < line.quantity) errors[`item-${line.itemId}`] = `Chỉ còn ${batchAvailable} đơn vị ở lô đạt QC và còn hạn dùng.`; } }); if (Object.keys(errors).length || !profile || !shift || !method) return respond(mutation<PosInvoice>(null, errors));
      const lines = normalized.map((line) => { const product = productById(line.itemId)!; return { itemId: product.id, name: product.name, quantity: line.quantity, unitPrice: product.sellingPrice }; }); const subtotal = lines.reduce((total, line) => total + line.quantity * line.unitPrice, 0); const vatAmount = lines.reduce((total, line) => total + line.quantity * line.unitPrice * (productById(line.itemId)?.vatRate ?? 0), 0);
      const entity: PosInvoice = { id: `pos-invoice-${Date.now()}`, receiptNo: `POS-Q1-20260829-${pad(posInvoices().length + 48)}`, shiftId: shift.id, postedAt: `${now}T08:15:00+07:00`, subtotal, vatAmount, totalAmount: subtotal + vatAmount, paymentMethodName: method.name, lines }; let costOfGoods = 0; lines.forEach((line) => { const product = productById(line.itemId)!; if (!isStockManaged(product)) return; const cost = stockBalanceFor(line.itemId, profile.warehouseId)?.averageCost ?? product.costPrice; costOfGoods += cost * line.quantity; postInventoryAdjustment(line.itemId, profile.warehouseId, -line.quantity, cost); let remaining = line.quantity; stockBatchViews().filter((batch) => batch.itemId === line.itemId && batch.warehouseId === profile.warehouseId && batch.qualityStatus === "released" && (!batch.expiryDate || batch.expiryDate >= now)).sort((a, b) => (a.expiryDate ?? "9999-12-31").localeCompare(b.expiryDate ?? "9999-12-31")).forEach((batch) => { const used = Math.min(remaining, batch.quantityOnHand); if (used > 0) { postBatchAdjustment(line.itemId, profile.warehouseId, batch.batchNo, -used); remaining -= used; } }); generatedInventoryMovements.unshift({ id: `movement-pos-${Date.now()}-${line.itemId}`, referenceNo: entity.receiptNo, movementType: "pos_sale", itemId: line.itemId, warehouseId: profile.warehouseId, quantity: -line.quantity, postingDate: now, description: `Bán tại quầy ${profile.code}` }); });
      generatedPosInvoices.unshift(entity); generatedPosPayments.unshift({ id: `pos-payment-${entity.id}`, paymentNo: `PAY-POS-${entity.receiptNo}`, direction: "incoming", counterpartyName: "Khách lẻ tại quầy", paymentDate: now, methodName: method.name, sourceDocumentNo: entity.receiptNo, totalAmount: entity.totalAmount, status: "completed" }); postJournalEntry(entity.receiptNo, now, [{ accountCode: settlementAccount(method.id), debit: entity.totalAmount, credit: 0 }, { accountCode: "511", debit: 0, credit: entity.subtotal }, { accountCode: "33311", debit: 0, credit: entity.vatAmount }, { accountCode: "632", debit: costOfGoods, credit: 0 }, { accountCode: "156", debit: 0, credit: costOfGoods }]); const updatedShift = { ...shift, expectedCash: shift.expectedCash + (method.type === "cash" ? entity.totalAmount : 0) }; if (generatedPosShifts.some((item) => item.id === shift.id)) generatedPosShifts.splice(generatedPosShifts.findIndex((item) => item.id === shift.id), 1, updatedShift); return respond(mutation(entity)); },
    closeShift: (shiftId: string, actualCash: number) => { const shift = generatedPosShifts.find((item) => item.id === shiftId); if (!shift || shift.status !== "open") return respond(mutation<PosShift>(null, { form: "Chỉ có thể đóng ca đang mở trong phiên hiện tại." })); if (!Number.isFinite(actualCash) || actualCash < 0) return respond(mutation<PosShift>(null, { actualCash: "Tiền thực tế không hợp lệ." })); const entity: PosShift = { ...shift, closedAt: `${now}T17:30:00+07:00`, actualCash, difference: actualCash - shift.expectedCash, status: "closed" }; generatedPosShifts.splice(generatedPosShifts.indexOf(shift), 1, entity); return respond(mutation(entity)); },
  },
  projects: {
    getOverview: () => respond<ProjectOverview>(projectOverviewForActiveUser()),
    updateTask: (id: string, patch: Pick<ProjectTask, "status" | "progressPercent">) => { const overview = projectOverview(); const task = overview.tasks.find((item) => item.id === id); const errors: Record<string, string> = {}; if (!task) errors.form = "Không tìm thấy nhiệm vụ."; if (!Number.isFinite(patch.progressPercent) || patch.progressPercent < 0 || patch.progressPercent > 100) errors.progressPercent = "Tiến độ phải từ 0 đến 100%."; if (patch.status === "completed" && patch.progressPercent !== 100) errors.progressPercent = "Nhiệm vụ hoàn thành phải có tiến độ 100%."; const blockedBy = task?.predecessorIds.map((predecessorId) => overview.tasks.find((item) => item.id === predecessorId)).find((predecessor) => predecessor?.status !== "completed"); if (patch.progressPercent > 0 && blockedBy) errors.progressPercent = `Cần hoàn thành nhiệm vụ phụ thuộc: ${blockedBy.title}.`; const downstream = task ? overview.tasks.find((candidate) => candidate.predecessorIds.includes(task.id) && candidate.progressPercent > 0) : undefined; if (task && patch.progressPercent < task.progressPercent && downstream) errors.progressPercent = `Không thể lùi tiến độ vì nhiệm vụ sau "${downstream.title}" đã bắt đầu.`; if (Object.keys(errors).length || !task) return respond(mutation<ProjectTask>(null, errors)); const entity = { ...task, ...patch }; projectTaskOverrides.set(id, entity); return respond(mutation(entity)); },
    createTimesheet: (draft: ProjectTimesheetDraft) => { const overview = projectOverview(); const errors: Record<string, string> = {}; const project = overview.projects.find((item) => item.id === draft.projectId); const task = overview.tasks.find((item) => item.id === draft.taskId); const employee = overview.employees.find((item) => item.id === draft.employeeId); const actorEmployeeId = activeEmployeeId(); const canApprove = can(activeRole(), "Dự án", "Duyệt"); if (!project) errors.projectId = "Vui lòng chọn dự án hợp lệ."; if (!task || task.projectId !== draft.projectId) errors.taskId = "Nhiệm vụ không thuộc dự án đã chọn."; if (!employee || employee.status !== "active") errors.employeeId = "Vui lòng chọn nhân viên đang làm việc."; if (project && employee && !project.teamMemberIds.includes(employee.id)) errors.employeeId = "Nhân viên chưa thuộc team dự án."; if (task && employee && task.assigneeId !== employee.id) errors.employeeId = "Chỉ người được phân công nhiệm vụ mới được ghi giờ công."; if (!canApprove && actorEmployeeId !== draft.employeeId) errors.employeeId = "Bạn chỉ có thể ghi giờ công cho chính mình."; if (!draft.workDate || (task && (draft.workDate < task.startDate || draft.workDate > task.dueDate))) errors.workDate = "Ngày công phải nằm trong thời gian của nhiệm vụ."; const dailyHours = overview.timesheets.filter((entry) => entry.employeeId === draft.employeeId && entry.workDate === draft.workDate && entry.status !== "rejected").reduce((total, entry) => total + entry.hours, 0); if (!Number.isFinite(draft.hours) || draft.hours <= 0 || draft.hours > 24 || dailyHours + draft.hours > 24) errors.hours = "Tổng giờ công của nhân viên trong ngày không được vượt quá 24 giờ."; if (!draft.note.trim()) errors.note = "Vui lòng nêu nội dung công việc."; if (Object.keys(errors).length || !project || !task || !employee) return respond(mutation<ProjectTimesheet>(null, errors)); const entity: ProjectTimesheet = { id: `time-${Date.now()}`, projectId: project.id, taskId: task.id, taskTitle: task.title, employeeId: employee.id, employeeName: employee.fullName, workDate: draft.workDate, hours: draft.hours, status: "submitted", note: draft.note.trim(), createdByEmployeeId: actorEmployeeId }; generatedProjectTimesheets.unshift(entity); return respond(mutation(entity)); },
    reviewTimesheet: (id: string, status: "approved" | "rejected", reason = "") => { const overview = projectOverview(); const item = overview.timesheets.find((entry) => entry.id === id); const project = item && overview.projects.find((entry) => entry.id === item.projectId); const actorEmployeeId = activeEmployeeId(); const isActualAdmin = activeUser()?.role === "System Admin"; if (!item || item.status !== "submitted") return respond(mutation<ProjectTimesheet>(null, { form: "Chỉ có thể duyệt hoặc từ chối bảng công đang chờ duyệt." })); if (!project || (!isActualAdmin && project.managerId !== actorEmployeeId)) return respond(mutation<ProjectTimesheet>(null, { form: "Chỉ quản lý dự án hoặc System Admin được duyệt bảng công." })); if (item.employeeId === actorEmployeeId || item.createdByEmployeeId === actorEmployeeId) return respond(mutation<ProjectTimesheet>(null, { form: "Không thể tự duyệt bảng công do chính mình tạo hoặc thực hiện." })); if (status === "rejected" && !reason.trim()) return respond(mutation<ProjectTimesheet>(null, { decisionReason: "Vui lòng nhập lý do từ chối." })); const entity: ProjectTimesheet = { ...item, status, decidedBy: currentActor(), decidedAt: `${now}T12:00:00+07:00`, decisionReason: status === "rejected" ? reason.trim() : undefined }; if (generatedProjectTimesheets.some((entry) => entry.id === id)) generatedProjectTimesheets.splice(generatedProjectTimesheets.findIndex((entry) => entry.id === id), 1, entity); else projectTimesheetOverrides.set(id, entity); return respond(mutation(entity)); },
    createFinancialEntry: (draft: ProjectFinancialEntryDraft) => { const overview = projectOverview(); const errors: Record<string, string> = {}; const project = overview.projects.find((item) => item.id === draft.projectId); const source = overview.financialSources.find((item) => item.documentNo === draft.sourceDocumentNo); const usedSource = overview.financialEntries.find((item) => item.sourceDocumentNo === draft.sourceDocumentNo); if (!project) errors.projectId = "Vui lòng chọn dự án hợp lệ."; if (!source) errors.sourceDocumentNo = "Chỉ có thể phân bổ từ hóa đơn mua hoặc hóa đơn bán đã ghi nhận."; if (usedSource) errors.sourceDocumentNo = `Chứng từ đã được phân bổ cho dự án ${usedSource.projectId}.`; if (source && project && (source.postingDate < project.startDate || source.postingDate > project.endDate)) errors.sourceDocumentNo = "Ngày chứng từ không thuộc thời gian thực hiện dự án."; if (source?.entryType === "revenue" && project?.customerId && source.customerId !== project.customerId) errors.sourceDocumentNo = "Hóa đơn bán không thuộc khách hàng của dự án này."; if (source?.entryType === "expense" && project && project.actualCost + source.amount > project.budgetAmount) errors.sourceDocumentNo = `Phân bổ này sẽ vượt ngân sách ${project.budgetAmount.toLocaleString("vi-VN")} đ.`; if (Object.keys(errors).length || !project || !source) return respond(mutation<ProjectFinancialEntry>(null, errors)); const entity: ProjectFinancialEntry = { id: `pfe-${Date.now()}`, projectId: project.id, postingDate: source.postingDate, entryType: source.entryType, sourceDocumentNo: source.documentNo, description: source.description, amount: source.amount }; generatedProjectFinancialEntries.unshift(entity); return respond(mutation(entity)); },
    saveProject: (draft: ProjectDraft) => { const overview = projectOverview(); const errors: Record<string, string> = {}; const manager = overview.employees.find((employee) => employee.id === draft.managerId); if (!draft.name.trim()) errors.name = "Vui lòng nhập tên dự án."; if (!overview.customers.some((customer) => customer.id === draft.customerId)) errors.customerId = "Vui lòng chọn khách hàng."; if (!manager) errors.managerId = "Vui lòng chọn quản lý dự án."; if (!draft.startDate || !draft.endDate || draft.endDate < draft.startDate) errors.endDate = "Thời gian dự án không hợp lệ."; if (!Number.isFinite(draft.budgetAmount) || draft.budgetAmount <= 0) errors.budgetAmount = "Ngân sách phải lớn hơn 0."; const teamMemberIds = [...new Set([draft.managerId, ...draft.teamMemberIds])]; if (teamMemberIds.some((id) => !overview.employees.some((employee) => employee.id === id))) errors.teamMemberIds = "Team có nhân viên không hợp lệ."; if (Object.keys(errors).length) return respond(mutation<Project>(null, errors)); const original = draft.id ? overview.projects.find((project) => project.id === draft.id) : undefined; if (draft.id && !original) return respond(mutation<Project>(null, { form: "Không tìm thấy dự án cần cập nhật." })); if (original && (draft.startDate > original.startDate || draft.endDate < original.endDate) && overview.tasks.some((task) => task.projectId === original.id && (task.startDate < draft.startDate || task.dueDate > draft.endDate))) return respond(mutation<Project>(null, { endDate: "Không thể thu hẹp thời gian dự án khi vẫn còn nhiệm vụ nằm ngoài khoảng mới." })); const entity = { id: original?.id ?? `project-${Date.now()}`, code: original?.code ?? `PRJ-2026-${pad(5 + overview.projects.length)}`, name: draft.name.trim(), customerId: draft.customerId, managerId: draft.managerId, teamMemberIds, startDate: draft.startDate, endDate: draft.endDate, budgetAmount: draft.budgetAmount, status: draft.status, progressPercent: original?.progressPercent ?? 0 }; if (original) projectOverrides.set(original.id, entity); else generatedProjects.unshift(entity); logProjectActivity(entity.id, original ? "Cập nhật dự án" : "Tạo dự án", entity.name); return respond(mutation(projectOverview().projects.find((project) => project.id === entity.id) ?? null)); },
    saveTask: (draft: ProjectTaskDraft) => { const overview = projectOverview(); const errors: Record<string, string> = {}; const project = overview.projects.find((item) => item.id === draft.projectId); const assignee = overview.employees.find((employee) => employee.id === draft.assigneeId); const original = draft.id ? overview.tasks.find((task) => task.id === draft.id) : undefined; if (!project) errors.projectId = "Vui lòng chọn dự án hợp lệ."; if (!draft.title.trim()) errors.title = "Vui lòng nhập tên nhiệm vụ."; if (!assignee || !project?.teamMemberIds.includes(draft.assigneeId)) errors.assigneeId = "Người phụ trách phải thuộc team dự án."; if (!draft.startDate || !draft.dueDate || draft.dueDate < draft.startDate) errors.dueDate = "Thời gian nhiệm vụ không hợp lệ."; if (project && (draft.startDate < project.startDate || draft.dueDate > project.endDate)) errors.dueDate = "Nhiệm vụ phải nằm trong thời gian dự án."; if (draft.predecessorIds.includes(draft.id ?? "")) errors.predecessorIds = "Nhiệm vụ không thể phụ thuộc chính nó."; const predecessors = draft.predecessorIds.map((id) => overview.tasks.find((task) => task.id === id)); if (predecessors.some((task) => !task || task.projectId !== draft.projectId)) errors.predecessorIds = "Nhiệm vụ phụ thuộc không hợp lệ."; if (predecessors.some((task) => task && task.dueDate > draft.startDate)) errors.predecessorIds = "Ngày bắt đầu phải sau ngày kết thúc của nhiệm vụ phụ thuộc."; if (original && overview.tasks.some((task) => task.predecessorIds.includes(original.id) && task.progressPercent > 0) && (draft.dueDate < original.dueDate || draft.startDate > original.startDate)) errors.dueDate = "Không thể thu hẹp lịch vì nhiệm vụ phụ thuộc đã bắt đầu."; if (Object.keys(errors).length || !project || !assignee) return respond(mutation<ProjectTask>(null, errors)); const entity = { id: original?.id ?? `task-${Date.now()}`, projectId: draft.projectId, code: original?.code ?? `${project.code}-${pad(overview.tasks.filter((task) => task.projectId === project.id).length + 1)}`, title: draft.title.trim(), assigneeId: assignee.id, startDate: draft.startDate, dueDate: draft.dueDate, status: original?.status ?? "not_started", progressPercent: original?.progressPercent ?? 0, priority: draft.priority, isMilestone: draft.isMilestone, predecessorIds: draft.predecessorIds, comments: original?.comments ?? [], attachments: original?.attachments ?? [] }; if (original) projectTaskOverrides.set(original.id, { ...entity, assigneeName: assignee.fullName, predecessorNames: predecessors.filter(Boolean).map((task) => task!.title) }); else generatedProjectTasks.unshift(entity); logProjectActivity(project.id, original ? "Cập nhật nhiệm vụ" : "Tạo nhiệm vụ", entity.title); return respond(mutation(projectOverview().tasks.find((task) => task.id === entity.id) ?? null)); },
    setProjectStatus: (id: string, status: ProjectStatus) => { const overview = projectOverview(); const project = overview.projects.find((item) => item.id === id); if (!project) return respond(mutation<Project>(null, { form: "Không tìm thấy dự án." })); if (status === "completed" && (overview.tasks.some((task) => task.projectId === id && task.status !== "completed") || overview.timesheets.some((entry) => entry.projectId === id && entry.status === "submitted"))) return respond(mutation<Project>(null, { form: "Chỉ được đóng dự án khi toàn bộ nhiệm vụ hoàn thành và không còn bảng công chờ duyệt." })); const raw = { ...projectOverrides.get(id), ...(generatedProjects.find((item) => item.id === id) ?? {}), id: project.id, code: project.code, name: project.name, customerId: project.customerId, managerId: project.managerId, teamMemberIds: project.teamMemberIds, startDate: project.startDate, endDate: project.endDate, budgetAmount: project.budgetAmount, status, progressPercent: project.progressPercent }; projectOverrides.set(id, raw); logProjectActivity(id, "Đổi trạng thái", status); return respond(mutation(projectOverview().projects.find((item) => item.id === id) ?? null)); },
    updateTimesheet: (id: string, draft: Pick<ProjectTimesheetDraft, "workDate" | "hours" | "note">) => { const overview = projectOverview(); const entry = overview.timesheets.find((item) => item.id === id); const task = entry && overview.tasks.find((item) => item.id === entry.taskId); const errors: Record<string, string> = {}; if (!entry || entry.status !== "submitted") errors.form = "Chỉ có thể sửa bảng công đang chờ duyệt."; if (entry && activeEmployeeId() && entry.employeeId !== activeEmployeeId()) errors.form = "Bạn chỉ có thể sửa bảng công của chính mình."; if (task && (!draft.workDate || draft.workDate < task.startDate || draft.workDate > task.dueDate)) errors.workDate = "Ngày công phải nằm trong thời gian nhiệm vụ."; if (!Number.isFinite(draft.hours) || draft.hours <= 0 || draft.hours > 24) errors.hours = "Số giờ không hợp lệ."; if (!draft.note.trim()) errors.note = "Vui lòng nêu nội dung công việc."; if (Object.keys(errors).length || !entry) return respond(mutation<ProjectTimesheet>(null, errors)); const entity = { ...entry, ...draft, note: draft.note.trim() }; if (generatedProjectTimesheets.some((item) => item.id === id)) generatedProjectTimesheets.splice(generatedProjectTimesheets.findIndex((item) => item.id === id), 1, entity); else projectTimesheetOverrides.set(id, entity); logProjectActivity(entity.projectId, "Sửa giờ công", `${entity.employeeName}: ${entity.hours} giờ`); return respond(mutation(entity)); },
    withdrawTimesheet: (id: string) => { const entry = projectOverview().timesheets.find((item) => item.id === id); if (!entry || entry.status !== "submitted") return respond(mutation<ProjectTimesheet>(null, { form: "Chỉ có thể thu hồi bảng công đang chờ duyệt." })); if (activeEmployeeId() && entry.employeeId !== activeEmployeeId()) return respond(mutation<ProjectTimesheet>(null, { form: "Bạn chỉ có thể thu hồi bảng công của chính mình." })); const entity = { ...entry, status: "rejected" as const, decisionReason: "Người lập thu hồi" }; if (generatedProjectTimesheets.some((item) => item.id === id)) generatedProjectTimesheets.splice(generatedProjectTimesheets.findIndex((item) => item.id === id), 1, entity); else projectTimesheetOverrides.set(id, entity); logProjectActivity(entity.projectId, "Thu hồi giờ công", entity.taskTitle); return respond(mutation(entity)); },
    addTaskComment: (taskId: string, message: string, attachmentName?: string) => { const task = projectOverview().tasks.find((item) => item.id === taskId); if (!task || (!message.trim() && !attachmentName?.trim())) return respond(mutation<ProjectTask>(null, { message: "Cần nhập bình luận hoặc chọn tệp đính kèm." })); const entity: ProjectTask = { ...task, comments: message.trim() ? [{ id: `comment-${Date.now()}`, author: currentActor(), message: message.trim(), createdAt: `${now}T12:00:00+07:00` }, ...task.comments] : task.comments, attachments: attachmentName?.trim() ? [{ id: `attachment-${Date.now()}`, name: attachmentName.trim(), addedBy: currentActor(), addedAt: `${now}T12:00:00+07:00` }, ...task.attachments] : task.attachments }; projectTaskOverrides.set(task.id, entity); logProjectActivity(task.projectId, "Cập nhật trao đổi", task.title); return respond(mutation(entity)); },
  },
  manufacturing: {
    getOverview: () => respond<ManufacturingOverview>({ boms: manufacturingBoms(), workOrders: manufacturingWorkOrders(), jobCards: manufacturingJobCards(), workCenters: clone(data.manufacturing?.workCenters ?? []), products: products(), warehouses: physicalWarehouses(), stockBalances: stockBalanceViews() }),
    getFormOptions: () => respond<ManufacturingFormOptions>(manufacturingOptions()),
    createWorkOrder: (draft: ManufacturingWorkOrderDraft) => {
      const errors = validateManufacturingWorkOrder(draft); const bom = manufacturingBomById(draft.bomId);
      if (Object.keys(errors).length || !bom) return respond(mutation<ManufacturingWorkOrder>(null, errors));
      const entity: ManufacturingWorkOrder = { id: `work-order-${Date.now()}`, workOrderNo: `WO-2026-${pad(manufacturingWorkOrderCount())}`, bomId: bom.id, outputItemId: bom.outputItemId, inputWarehouseId: draft.inputWarehouseId, outputWarehouseId: draft.outputWarehouseId, plannedQuantity: draft.plannedQuantity, completedQuantity: 0, rejectedQuantity: 0, plannedStartDate: draft.plannedStartDate, plannedEndDate: draft.plannedEndDate, status: "planned", sourceSalesOrderId: draft.sourceSalesOrderId?.trim() || null, progressPercent: 0 };
      generatedWorkOrders.unshift(entity);
      return respond(mutation(entity));
    },
    recordCompletion: (draft: ManufacturingCompletionDraft) => {
      const validation = validateManufacturingCompletion(draft);
      if (Object.keys(validation.errors).length || !validation.order || !validation.bom) return respond(mutation<ManufacturingWorkOrder>(null, validation.errors));
      const { order, bom, processedQuantity } = validation;
      const requirements = manufacturingRequirements(bom, processedQuantity);
      let materialCost = 0;
      requirements.forEach((line) => {
        const unitCost = stockBalanceFor(line.itemId, order.inputWarehouseId)?.averageCost ?? line.product.costPrice;
        materialCost += line.requiredQuantity * unitCost;
        consumeManufacturingMaterial(line.itemId, order.inputWarehouseId, line.requiredQuantity, unitCost, draft.completionDate);
        generatedInventoryMovements.unshift({ id: `movement-production-consume-${Date.now()}-${line.itemId}`, referenceNo: order.workOrderNo, movementType: "manufacturing_consumption", itemId: line.itemId, warehouseId: order.inputWarehouseId, quantity: -line.requiredQuantity, postingDate: draft.completionDate, description: `Xuất nguyên liệu cho ${order.workOrderNo}` });
      });
      if (draft.completedQuantity > 0) {
        const outputProduct = productById(order.outputItemId)!; const outputUnitCost = materialCost / draft.completedQuantity;
        postInventoryAdjustment(order.outputItemId, order.outputWarehouseId, draft.completedQuantity, outputUnitCost);
        if (outputProduct.trackBatch && draft.batchNo) postBatchAdjustment(order.outputItemId, order.outputWarehouseId, draft.batchNo, draft.completedQuantity, { manufacturingDate: draft.completionDate, expiryDate: manufacturingExpiryDate(draft.completionDate), qualityStatus: "released" });
        generatedInventoryMovements.unshift({ id: `movement-production-output-${Date.now()}-${order.id}`, referenceNo: order.workOrderNo, movementType: "manufacturing_receipt", itemId: order.outputItemId, warehouseId: order.outputWarehouseId, quantity: draft.completedQuantity, postingDate: draft.completionDate, description: `Nhập thành phẩm từ ${order.workOrderNo}${draft.batchNo ? ` · lô ${normalizeBatchNo(draft.batchNo)}` : ""}` });
      }
      const completedQuantity = order.completedQuantity + draft.completedQuantity; const rejectedQuantity = order.rejectedQuantity + draft.rejectedQuantity;
      const isComplete = completedQuantity + rejectedQuantity >= order.plannedQuantity;
      const progressPercent = isComplete ? 100 : Math.min(99, Math.floor((completedQuantity + rejectedQuantity) / order.plannedQuantity * 100));
      const entity: ManufacturingWorkOrder = { ...order, completedQuantity, rejectedQuantity, progressPercent, status: isComplete ? "completed" : "in_progress" };
      workOrderOverrides.set(entity.id, entity);
      generatedManufacturingJobCards.unshift({ id: `job-card-${Date.now()}`, workOrderId: entity.id, workCenterId: (data.manufacturing?.workCenters?.[1]?.id ?? data.manufacturing?.workCenters?.[0]?.id ?? "production"), operation: "Ghi nhận hoàn thành mẻ", assignedEmployeeIds: [], startedAt: `${draft.completionDate}T08:00:00+07:00`, endedAt: `${draft.completionDate}T17:00:00+07:00`, completedQuantity: draft.completedQuantity, rejectedQuantity: draft.rejectedQuantity, status: "completed" });
      return respond(mutation(entity));
    },
  },
  purchasing: {
    getSuppliers: () => respond<Supplier[]>(suppliers()),
    getPaymentMethods: () => respond<PaymentMethod[]>(paymentMethods().filter((method) => method.isActive)),
    getPurchaseRequests: () => respond<PurchaseRequest[]>(purchaseRequests()),
    getPurchaseRequest: (id: string) => respond<PurchaseRequest | undefined>(purchaseRequestById(id)),
    getRfqs: () => respond<RequestForQuotation[]>(rfqs()),
    getSupplierQuotations: () => respond<SupplierQuotation[]>(supplierQuotations()),
    getPurchaseInvoices: () => respond<PurchaseInvoice[]>(purchaseInvoices()),
    getPurchaseInvoiceCandidates: () => respond<PurchaseInvoiceCandidate[]>(purchaseInvoiceCandidates()),
    getPurchaseReturns: () => respond<PurchaseReturn[]>(generatedPurchaseReturns),
    getPurchaseInvoiceAdjustments: () => respond<PurchaseInvoiceAdjustment[]>(purchaseInvoiceAdjustments()),
    getPurchasePayments: () => respond<PurchasePayment[]>(purchasePayments()),
    createPurchaseRequest: (draft: PurchaseRequestDraft) => {
      const validation = validatePurchaseRequest(draft); if (Object.keys(validation.errors).length) return respond(mutation<PurchaseRequest>(null, validation.errors));
      const entity = draftToPurchaseRequest(draft, validation);
      generatedPurchaseRequests.unshift(entity); return respond(mutation(entity));
    },
    validatePurchaseRequest: (draft: PurchaseRequestDraft) => respond<PurchaseRequestValidation>(validatePurchaseRequest(draft)),
    updatePurchaseRequest: (id: string, draft: PurchaseRequestDraft) => {
      const request = purchaseRequestById(id);
      if (!request) return respond(mutation<PurchaseRequest>(null, { form: "Không tìm thấy yêu cầu mua." }));
      if (request.status !== "draft") return respond(mutation<PurchaseRequest>(null, { form: "Chỉ yêu cầu mua nháp mới được chỉnh sửa." }));
      const validation = validatePurchaseRequest({ ...draft, id });
      if (Object.keys(validation.errors).length) return respond(mutation<PurchaseRequest>(null, validation.errors));
      const entity = draftToPurchaseRequest({ ...draft, id }, validation); storePurchaseRequest(entity); return respond(mutation(entity));
    },
    submitPurchaseRequest: (id: string) => {
      const request = purchaseRequestById(id); if (!request) return respond(mutation<PurchaseRequest>(null, { form: "Không tìm thấy yêu cầu mua." }));
      if (request.status !== "draft") return respond(mutation<PurchaseRequest>(null, { form: "Chỉ yêu cầu mua nháp mới được gửi duyệt." }));
      const entity = { ...request, status: "pending_approval" as const }; storePurchaseRequest(entity); return respond(mutation(entity));
    },
    approvePurchaseRequest: (id: string) => {
      const request = purchaseRequestById(id); if (!request) return respond(mutation<PurchaseRequest>(null, { form: "Không tìm thấy yêu cầu mua." }));
      if (request.status !== "pending_approval") return respond(mutation<PurchaseRequest>(null, { form: "Yêu cầu mua cần ở trạng thái chờ duyệt." }));
      if (request.requiredDate < now) return respond(mutation<PurchaseRequest>(null, { form: "Ngày cần hàng đã qua, không thể duyệt yêu cầu mua." }));
      const entity = { ...request, status: "approved" as const }; storePurchaseRequest(entity); return respond(mutation(entity));
    },
    createRfqFromPurchaseRequest: (purchaseRequestId: string) => {
      const request = purchaseRequestById(purchaseRequestId); const errors: Record<string, string> = {};
      if (!request) errors.form = "Không tìm thấy yêu cầu mua.";
      else if (request.status !== "approved") errors.form = "Chỉ yêu cầu mua đã duyệt mới có thể tạo RFQ.";
      else if (request.requiredDate < now) errors.form = "Ngày cần hàng đã qua, không thể tạo RFQ mới.";
      else if (rfqs().some((rfq) => rfq.sourcePurchaseRequestId === request.id && rfq.status !== "cancelled")) errors.form = "Yêu cầu mua này đã có RFQ.";
      if (Object.keys(errors).length || !request) return respond(mutation<RequestForQuotation>(null, errors));
      const supplierIds = suppliers().filter((supplier) => supplier.status === "active").slice(0, 2).map((supplier) => supplier.id);
      const entity: RequestForQuotation = { id: `rfq-${Date.now()}`, documentNo: `RFQ-2026-${pad(rfqCount())}`, sourcePurchaseRequestId: request.id, selectedSupplierQuotationId: null, status: "draft", rfqDate: now, deadline: request.requiredDate, warehouseId: request.warehouseId, supplierIds, lines: request.lines.map((line, index) => ({ ...line, id: `rfql-${Date.now()}-${index}` })) };
      generatedRfqs.unshift(entity); storePurchaseRequest({ ...request, status: "converted" }); return respond(mutation(entity));
    },
    sendRfq: (id: string) => {
      const rfq = rfqById(id); if (!rfq) return respond(mutation<RequestForQuotation>(null, { form: "Không tìm thấy RFQ." }));
      if (rfq.status !== "draft") return respond(mutation<RequestForQuotation>(null, { form: "Chỉ RFQ nháp mới được gửi nhà cung cấp." }));
      if (rfq.deadline < now) return respond(mutation<RequestForQuotation>(null, { form: "Hạn nhận báo giá đã qua, không thể gửi RFQ." }));
      if (!rfq.supplierIds.length) return respond(mutation<RequestForQuotation>(null, { form: "RFQ cần có ít nhất một nhà cung cấp được mời." }));
      const entity = { ...rfq, status: "sent" as const }; storeRfq(entity); return respond(mutation(entity));
    },
    cancelRfq: (id: string) => {
      const rfq = rfqById(id); if (!rfq) return respond(mutation<RequestForQuotation>(null, { form: "Không tìm thấy RFQ." }));
      if (!["draft", "sent"].includes(rfq.status)) return respond(mutation<RequestForQuotation>(null, { form: "Chỉ RFQ nháp hoặc đã gửi mới có thể hủy." }));
      if (supplierQuotations().some((quotation) => quotation.rfqId === rfq.id && quotation.status === "converted")) return respond(mutation<RequestForQuotation>(null, { form: "RFQ đã được chuyển thành PO nên không thể hủy." }));
      supplierQuotations().filter((quotation) => quotation.rfqId === rfq.id && ["draft", "approved"].includes(quotation.status)).forEach((quotation) => storeSupplierQuotation({ ...quotation, status: "rejected" }));
      storeRfq({ ...rfq, status: "cancelled" });
      const request = rfq.sourcePurchaseRequestId ? purchaseRequestById(rfq.sourcePurchaseRequestId) : undefined;
      if (request?.status === "converted") storePurchaseRequest({ ...request, status: "approved" });
      return respond(mutation({ ...rfq, status: "cancelled" as const }));
    },
    reopenRfq: (id: string) => {
      const rfq = rfqById(id); if (!rfq) return respond(mutation<RequestForQuotation>(null, { form: "Không tìm thấy RFQ." }));
      if (rfq.status !== "cancelled") return respond(mutation<RequestForQuotation>(null, { form: "Chỉ RFQ đã hủy mới có thể mở lại." }));
      if (rfq.deadline < now) return respond(mutation<RequestForQuotation>(null, { form: "Hạn nhận báo giá đã qua. Hãy tạo RFQ mới với thời hạn mới." }));
      const entity = { ...rfq, status: "draft" as const }; storeRfq(entity);
      const request = rfq.sourcePurchaseRequestId ? purchaseRequestById(rfq.sourcePurchaseRequestId) : undefined;
      if (request?.status === "approved") storePurchaseRequest({ ...request, status: "converted" });
      return respond(mutation(entity));
    },
    createSupplierQuotation: (draft: SupplierQuotationDraft) => {
      const validation = calculateSupplierQuotation(draft); const rfq = rfqById(draft.rfqId);
      if (Object.keys(validation.errors).length || !rfq) return respond(mutation<SupplierQuotation>(null, validation.errors));
      const entity: SupplierQuotation = { id: `supplier-quotation-${Date.now()}`, documentNo: `VQ-2026-${pad(supplierQuotationCount())}`, rfqId: rfq.id, rfqNo: rfq.documentNo, supplierId: draft.supplierId, status: "draft", validUntil: draft.validUntil, leadTimeDays: draft.leadTimeDays, totalAmount: validation.totalAmount, lines: draft.lines.map((line, index) => { const product = productById(line.itemId)!; const lineTotal = Math.max(0, line.quantity * line.unitPrice - line.discountAmount); return { id: `vql-${Date.now()}-${index}`, itemId: product.id, description: product.name, unit: product.unit, quantity: line.quantity, unitPrice: line.unitPrice, discountAmount: line.discountAmount, vatRate: product.vatRate, lineTotal }; }) };
      generatedSupplierQuotations.unshift(entity); return respond(mutation(entity));
    },
    approveSupplierQuotation: (id: string) => {
      const quotation = supplierQuotationById(id); if (!quotation) return respond(mutation<SupplierQuotation>(null, { form: "Không tìm thấy báo giá nhà cung cấp." }));
      if (quotation.status !== "draft") return respond(mutation<SupplierQuotation>(null, { form: "Chỉ báo giá nháp mới được duyệt." }));
      const rfq = quotation.rfqId ? rfqById(quotation.rfqId) : undefined;
      if (!rfq || rfq.status === "overdue") return respond(mutation<SupplierQuotation>(null, { form: "RFQ đã quá hạn, không thể duyệt báo giá." }));
      if (rfq.status !== "sent") return respond(mutation<SupplierQuotation>(null, { form: "RFQ đã chốt, không thể duyệt thêm báo giá." }));
      const entity = { ...quotation, status: "approved" as const }; storeSupplierQuotation(entity); return respond(mutation(entity));
    },
    createPurchaseOrderFromSupplierQuotation: (supplierQuotationId: string) => {
      const quotation = supplierQuotationById(supplierQuotationId); const errors: Record<string, string> = {};
      if (!quotation) errors.form = "Không tìm thấy báo giá nhà cung cấp.";
      else if (quotation.status !== "approved") errors.form = "Chỉ báo giá đã duyệt mới được chuyển thành đơn mua.";
      else if (quotation.validUntil < now) errors.form = "Báo giá nhà cung cấp đã hết hiệu lực.";
      else if (purchaseOrders().some((order) => order.sourceSupplierQuotationId === quotation.id)) errors.form = "Báo giá này đã được chuyển thành đơn mua.";
      const rfq = quotation?.rfqId ? rfqById(quotation.rfqId) : undefined;
      if (!rfq) errors.form = "Không tìm thấy RFQ nguồn của báo giá.";
      else if (rfq.status === "overdue") errors.form = "RFQ đã quá hạn, không thể chọn báo giá để tạo PO.";
      else if (rfq.status !== "sent") errors.form = "RFQ đã chốt bằng một báo giá khác.";
      else if (rfq.selectedSupplierQuotationId && rfq.selectedSupplierQuotationId !== quotation?.id) errors.form = "RFQ này đã có báo giá được chọn.";
      else if (purchaseOrders().some((order) => order.sourceRfqId === rfq.id)) errors.form = "RFQ này đã được chuyển thành đơn mua.";
      if (Object.keys(errors).length || !quotation || !rfq) return respond(mutation<PurchaseOrder>(null, errors));
      const draft: PurchaseOrderDraft = { supplierId: quotation.supplierId, warehouseId: rfq.warehouseId, orderDate: now, expectedReceiptDate: addDays(now, quotation.leadTimeDays), lines: quotation.lines.map((line) => ({ itemId: line.itemId, quantity: line.quantity, unitPrice: line.unitPrice, discountAmount: line.discountAmount })) };
      const validation = calculatePurchase(draft); if (Object.keys(validation.errors).length) return respond(mutation<PurchaseOrder>(null, validation.errors));
      const entity = { ...draftToPurchaseOrder(draft, validation), sourcePurchaseRequestId: rfq.sourcePurchaseRequestId ?? null, sourceRfqId: rfq.id, sourceSupplierQuotationId: quotation.id };
      generatedPurchaseOrders.unshift(entity); storeSupplierQuotation({ ...quotation, status: "converted" }); supplierQuotations().filter((candidate) => candidate.rfqId === rfq.id && candidate.id !== quotation.id && ["draft", "approved"].includes(candidate.status)).forEach((candidate) => storeSupplierQuotation({ ...candidate, status: "rejected" })); storeRfq({ ...rfq, selectedSupplierQuotationId: quotation.id, status: "closed" }); return respond(mutation(entity));
    },
    getPurchaseOrders: () => respond<PurchaseOrder[]>(purchaseOrders()),
    getPurchaseOrder: (id: string) => respond<PurchaseOrder | undefined>(purchaseOrderById(id)),
    getReceipts: () => respond<PurchaseReceipt[]>(purchaseReceipts()),
    getFormOptions: () => respond<PurchaseFormOptions>({ suppliers: suppliers().filter((supplier) => supplier.status === "active"), products: products().filter((product) => product.status === "active" && isStockManaged(product)), warehouses: warehouses().filter((warehouse) => warehouse.status === "active" && warehouse.warehouseType === "physical") }),
    getPurchaseOrderDetail: (id: string) => {
      const order = purchaseOrderById(id); const supplier = order && supplierById(order.supplierId); const warehouse = order && warehouses().find((entry) => entry.id === order.warehouseId);
      return respond<PurchaseOrderDetail | undefined>(order && supplier && warehouse ? { order, supplier, warehouse, receipts: purchaseReceipts().filter((receipt) => receipt.purchaseOrderId === order.id), invoices: purchaseInvoices().filter((invoice) => invoice.purchaseOrderId === order.id) } : undefined);
    },
    validatePurchaseOrder: (draft: PurchaseOrderDraft) => respond<PurchaseValidation>(calculatePurchase(draft), 100),
    savePurchaseOrder: (draft: PurchaseOrderDraft) => {
      const validation = calculatePurchase(draft); const existing = draft.id ? purchaseOrderById(draft.id) : undefined;
      if (draft.id && !existing) validation.errors.form = "Không tìm thấy đơn mua cần cập nhật.";
      if (existing && existing.status !== "draft") validation.errors.form = "Chỉ đơn mua nháp mới được phép chỉnh sửa.";
      if (existing?.sourceSupplierQuotationId) validation.errors.form = "Đơn mua được tạo từ báo giá đã chọn không thể chỉnh sửa. Hãy tạo quy trình điều chỉnh riêng nếu cần thay đổi.";
      if (Object.keys(validation.errors).length) return respond({ document: null, validation });
      const entity = draftToPurchaseOrder(draft, validation); if (draft.id) storePurchaseOrder(entity); else generatedPurchaseOrders.unshift(entity);
      return respond({ document: entity, validation });
    },
    createPurchaseOrderAmendment: (id: string) => {
      const order = purchaseOrderById(id); const errors: Record<string, string> = {};
      if (!order) errors.form = "Không tìm thấy đơn mua.";
      else if (!["draft", "pending_approval", "approved"].includes(order.status)) errors.form = "Chỉ PO chưa xác nhận đặt hàng mới có thể tạo điều chỉnh.";
      else if (purchaseReceipts().some((receipt) => receipt.purchaseOrderId === order.id)) errors.form = "Không thể điều chỉnh PO đã phát sinh nhập kho.";
      if (Object.keys(errors).length || !order) return respond(mutation<PurchaseOrder>(null, errors));
      const entity: PurchaseOrder = { ...order, id: `purchase-order-${Date.now()}`, documentNo: `PO-2026-${pad(purchaseOrderCount())}`, sourceRfqId: null, sourceSupplierQuotationId: null, amendsPurchaseOrderId: order.id, status: "draft", orderDate: now, lines: order.lines.map((line, index) => ({ ...line, id: `pol-${Date.now()}-${index}`, receivedQuantity: 0 })) };
      generatedPurchaseOrders.unshift(entity); storePurchaseOrder({ ...order, status: "cancelled" });
      return respond(mutation(entity));
    },
    submitPurchaseOrder: (id: string) => {
      const order = purchaseOrderById(id); if (!order) return respond(mutation<PurchaseOrder>(null, { form: "Không tìm thấy đơn mua." }));
      if (order.status !== "draft") return respond(mutation<PurchaseOrder>(null, { form: "Chỉ đơn mua nháp mới được gửi duyệt." }));
      const entity = { ...order, status: "pending_approval" }; storePurchaseOrder(entity); return respond(mutation(entity));
    },
    approvePurchaseOrder: (id: string) => {
      const order = purchaseOrderById(id); if (!order) return respond(mutation<PurchaseOrder>(null, { form: "Không tìm thấy đơn mua." }));
      if (order.status !== "pending_approval") return respond(mutation<PurchaseOrder>(null, { form: "Đơn mua cần ở trạng thái chờ duyệt." }));
      const entity = { ...order, status: "approved" }; storePurchaseOrder(entity); return respond(mutation(entity));
    },
    confirmPurchaseOrder: (id: string) => {
      const order = purchaseOrderById(id); if (!order) return respond(mutation<PurchaseOrder>(null, { form: "Không tìm thấy đơn mua." }));
      if (order.status !== "approved") return respond(mutation<PurchaseOrder>(null, { form: "Chỉ đơn mua đã duyệt mới có thể xác nhận đặt hàng." }));
      const entity = { ...order, status: "confirmed" }; storePurchaseOrder(entity); return respond(mutation(entity));
    },
    createReceipt: (purchaseOrderId: string, draft: PurchaseReceiptDraft) => {
      const order = purchaseOrderById(purchaseOrderId); const errors: Record<string, string> = {};
      if (!order) errors.form = "Không tìm thấy đơn mua.";
      else if (!["confirmed", "partially_completed"].includes(order.status)) errors.form = "Đơn mua phải được xác nhận trước khi nhập kho.";
      if (!draft.receivedDate) errors.receivedDate = "Vui lòng chọn ngày nhận hàng.";
      else if (order && draft.receivedDate < order.orderDate) errors.receivedDate = "Ngày nhận hàng không được trước ngày đơn mua.";
      if (!draft.lines.some((line) => line.quantity > 0 || (line.rejectedQuantity ?? 0) > 0)) errors.lines = "Cần ghi nhận số lượng nhận hoặc từ chối cho ít nhất một dòng.";
      if (order) draft.lines.forEach((line, index) => {
        const orderLine = order.lines.find((candidate) => candidate.id === line.purchaseOrderLineId); const product = orderLine && productById(orderLine.itemId); const remaining = orderLine ? orderLine.quantity - orderLine.receivedQuantity : 0; const rejectedQuantity = Number(line.rejectedQuantity) || 0;
        if (!orderLine) errors[`line-${index}`] = "Dòng hàng không thuộc đơn mua.";
        else if (!Number.isFinite(line.quantity) || line.quantity < 0 || !Number.isFinite(rejectedQuantity) || rejectedQuantity < 0 || line.quantity + rejectedQuantity > remaining) errors[`line-${index}`] = `Tổng số lượng đạt và từ chối tối đa là ${remaining}.`;
        else if (rejectedQuantity > 0 && !line.rejectionReason?.trim()) errors[`line-${index}`] = "Vui lòng nêu lý do từ chối hàng.";
        else if (line.quantity > 0 && product?.trackBatch && !line.batchNo?.trim()) errors[`line-${index}`] = "Mặt hàng này cần nhập số lô.";
        else if (line.expiryDate && line.expiryDate < draft.receivedDate) errors[`line-${index}`] = "Hạn dùng phải sau ngày nhận hàng.";
      });
      if (Object.keys(errors).length || !order) return respond(mutation<PurchaseReceipt>(null, errors));
      const entity: PurchaseReceipt = { id: `purchase-receipt-${Date.now()}`, documentNo: `GRN-2026-${pad(88 + purchaseReceipts().length)}`, purchaseOrderId: order.id, status: "completed", receivedDate: draft.receivedDate, warehouseId: order.warehouseId, lines: draft.lines.filter((line) => line.quantity > 0 || (line.rejectedQuantity ?? 0) > 0).map((line, index) => { const orderLine = order.lines.find((candidate) => candidate.id === line.purchaseOrderLineId)!; return { ...line, id: `grnl-${Date.now()}-${index}`, itemId: orderLine.itemId, rejectedQuantity: line.rejectedQuantity ?? 0, description: orderLine.description, unit: orderLine.unit, unitPrice: orderLine.unitPrice, discountAmount: allocateDiscount(orderLine.discountAmount, orderLine.quantity, orderLine.receivedQuantity, line.quantity), vatRate: orderLine.vatRate }; }) };
      generatedPurchaseReceipts.unshift(entity);
      entity.lines.forEach((line) => {
        if (line.quantity <= 0) return;
        const source = order.lines.find((candidate) => candidate.id === line.purchaseOrderLineId)!; const unitCost = Math.max(0, source.unitPrice - source.discountAmount / source.quantity);
        postInventoryAdjustment(line.itemId, order.warehouseId, line.quantity, unitCost);
        if (productById(line.itemId)?.trackBatch && line.batchNo) postBatchAdjustment(line.itemId, order.warehouseId, line.batchNo, line.quantity, { manufacturingDate: line.manufacturingDate ?? entity.receivedDate, expiryDate: line.expiryDate });
        generatedInventoryMovements.unshift({ id: `movement-${Date.now()}-${line.purchaseOrderLineId}`, referenceNo: entity.documentNo, movementType: "purchase_receipt", itemId: line.itemId, warehouseId: order.warehouseId, quantity: line.quantity, postingDate: entity.receivedDate, description: `Nhập mua từ ${supplierById(order.supplierId)?.name ?? "nhà cung cấp"}` });
      });
      const lines = order.lines.map((line) => ({ ...line, receivedQuantity: line.receivedQuantity + (entity.lines.find((receiptLine) => receiptLine.purchaseOrderLineId === line.id)?.quantity ?? 0) }));
      const completed = lines.every((line) => line.receivedQuantity >= line.quantity); const receivedAny = lines.some((line) => line.receivedQuantity > 0); storePurchaseOrder({ ...order, lines, status: completed ? "completed" : receivedAny ? "partially_completed" : "confirmed" });
      return respond(mutation(entity));
    },
    createPurchaseReturn: (draft: PurchaseReturnDraft) => {
      const receipt = purchaseReceipts().find((entry) => entry.id === draft.purchaseReceiptId); const errors: Record<string, string> = {};
      if (!receipt) errors.purchaseReceiptId = "Vui lòng chọn phiếu nhập hợp lệ.";
      if (!draft.returnDate) errors.returnDate = "Vui lòng chọn ngày trả hàng.";
      else if (receipt && draft.returnDate < receipt.receivedDate) errors.returnDate = "Ngày trả hàng không được trước ngày nhập.";
      if (!draft.reason.trim()) errors.reason = "Vui lòng nêu lý do trả nhà cung cấp.";
      if (!draft.lines.some((line) => line.quantity > 0)) errors.lines = "Cần chọn ít nhất một dòng hàng trả.";
      const requestedByReceiptLine = new Map<string, number>();
      draft.lines.forEach((line) => requestedByReceiptLine.set(line.purchaseReceiptLineId, (requestedByReceiptLine.get(line.purchaseReceiptLineId) ?? 0) + (Number(line.quantity) || 0)));
      if (receipt) draft.lines.forEach((line, index) => {
        const receiptLine = receipt.lines.find((entry) => entry.id === line.purchaseReceiptLineId); const alreadyReturned = generatedPurchaseReturns.filter((entry) => entry.purchaseReceiptId === receipt.id).flatMap((entry) => entry.lines).filter((entry) => entry.purchaseReceiptLineId === line.purchaseReceiptLineId).reduce((total, entry) => total + entry.quantity, 0); const requested = requestedByReceiptLine.get(line.purchaseReceiptLineId) ?? 0; const product = receiptLine && productById(receiptLine.itemId);
        if (!receiptLine) errors[`line-${index}`] = "Dòng hàng không thuộc phiếu nhập.";
        else if (!Number.isFinite(line.quantity) || line.quantity < 0 || requested > receiptLine.quantity - alreadyReturned) errors[`line-${index}`] = `Số lượng còn có thể trả là ${Math.max(0, receiptLine.quantity - alreadyReturned).toLocaleString("vi-VN")} ${receiptLine.unit}.`;
        else if (line.quantity > 0 && product?.trackBatch && !line.batchNo?.trim()) errors[`line-${index}`] = "Mặt hàng theo lô cần chọn số lô trả.";
        else if (line.quantity > 0 && product?.trackBatch && normalizeBatchNo(line.batchNo) !== normalizeBatchNo(receiptLine.batchNo)) errors[`line-${index}`] = "Lô trả phải trùng với lô đã nhận trên phiếu nhập.";
        else if (line.quantity > 0 && product?.trackBatch && (stockBatchViews().find((batch) => batch.itemId === receiptLine.itemId && batch.warehouseId === receipt.warehouseId && batch.batchNo === normalizeBatchNo(line.batchNo))?.quantityOnHand ?? 0) < line.quantity) errors[`line-${index}`] = "Tồn của lô hàng không đủ để trả nhà cung cấp.";
        else if (line.quantity > 0 && availableToSell(receiptLine.itemId, receipt.warehouseId) < line.quantity) errors[`line-${index}`] = "Tồn khả dụng không đủ để trả nhà cung cấp.";
      });
      const order = receipt && purchaseOrderById(receipt.purchaseOrderId);
      if (Object.keys(errors).length || !receipt || !order) return respond(mutation<PurchaseReturn>(null, errors));
      const entity: PurchaseReturn = { id: `purchase-return-${Date.now()}`, documentNo: `PRT-2026-${pad(generatedPurchaseReturns.length + 1)}`, purchaseReceiptId: receipt.id, purchaseOrderId: order.id, warehouseId: receipt.warehouseId, returnDate: draft.returnDate, reason: draft.reason.trim(), status: "completed", lines: draft.lines.filter((line) => line.quantity > 0).map((line) => { const receiptLine = receipt.lines.find((entry) => entry.id === line.purchaseReceiptLineId)!; return { purchaseReceiptLineId: receiptLine.id!, purchaseOrderLineId: receiptLine.purchaseOrderLineId, itemId: receiptLine.itemId, description: receiptLine.description, unit: receiptLine.unit, quantity: line.quantity, batchNo: line.batchNo ?? receiptLine.batchNo }; }) };
      generatedPurchaseReturns.unshift(entity);
      entity.lines.forEach((line) => { const receiptLine = receipt.lines.find((entry) => entry.id === line.purchaseReceiptLineId)!; const unitCost = Math.max(0, receiptLine.unitPrice - receiptLine.discountAmount / Math.max(1, receiptLine.quantity)); postInventoryAdjustment(line.itemId, receipt.warehouseId, -line.quantity, unitCost); if (productById(line.itemId)?.trackBatch && line.batchNo) postBatchAdjustment(line.itemId, receipt.warehouseId, line.batchNo, -line.quantity); generatedInventoryMovements.unshift({ id: `movement-return-${Date.now()}-${line.purchaseReceiptLineId}`, referenceNo: entity.documentNo, movementType: "purchase_return", itemId: line.itemId, warehouseId: receipt.warehouseId, quantity: -line.quantity, postingDate: entity.returnDate, description: `Trả nhà cung cấp: ${entity.reason}` }); });
      const refreshedLines = order.lines.map((line) => ({ ...line, receivedQuantity: Math.max(0, line.receivedQuantity - entity.lines.filter((returnLine) => returnLine.purchaseOrderLineId === line.id).reduce((total, returnLine) => total + returnLine.quantity, 0)) })); const completed = refreshedLines.every((line) => line.receivedQuantity >= line.quantity); const receivedAny = refreshedLines.some((line) => line.receivedQuantity > 0); storePurchaseOrder({ ...order, lines: refreshedLines, status: completed ? "completed" : receivedAny ? "partially_completed" : "confirmed" });
      return respond(mutation(entity));
    },
    createPurchaseInvoice: (draft: PurchaseInvoiceDraft) => {
      const candidate = purchaseInvoiceCandidates().find((entry) => entry.receipt.id === draft.purchaseReceiptId); const errors: Record<string, string> = {};
      if (!candidate) errors.purchaseReceiptId = "Vui lòng chọn phiếu nhập còn giá trị chưa lập hóa đơn.";
      if (!draft.supplierInvoiceNo.trim()) errors.supplierInvoiceNo = "Vui lòng nhập số hóa đơn của nhà cung cấp.";
      else if (candidate && purchaseInvoices().some((invoice) => invoice.supplierId === candidate.supplier.id && invoice.supplierInvoiceNo.toLowerCase() === draft.supplierInvoiceNo.trim().toLowerCase() && invoice.status !== "cancelled")) errors.supplierInvoiceNo = "Số hóa đơn này đã được ghi nhận cho nhà cung cấp.";
      if (!draft.invoiceDate) errors.invoiceDate = "Vui lòng chọn ngày hóa đơn.";
      else if (candidate && draft.invoiceDate < candidate.receipt.receivedDate) errors.invoiceDate = "Ngày hóa đơn không được trước ngày nhập kho.";
      if (!draft.dueDate) errors.dueDate = "Vui lòng chọn hạn thanh toán.";
      else if (draft.invoiceDate && draft.dueDate < draft.invoiceDate) errors.dueDate = "Hạn thanh toán không được trước ngày hóa đơn.";
      if (!draft.lines.some((line) => line.quantity > 0)) errors.lines = "Cần lập hóa đơn cho ít nhất một dòng hàng.";
      const requestedByReceiptLine = new Map<string, number>();
      draft.lines.forEach((line) => requestedByReceiptLine.set(line.purchaseReceiptLineId, (requestedByReceiptLine.get(line.purchaseReceiptLineId) ?? 0) + (Number(line.quantity) || 0)));
      if (candidate) draft.lines.forEach((line, index) => { const receiptLine = candidate.receipt.lines.find((entry) => entry.id === line.purchaseReceiptLineId); const invoicedQuantity = receiptLine ? quantityInvoicedForReceiptLine(receiptLine.id ?? "") : 0; const requested = requestedByReceiptLine.get(line.purchaseReceiptLineId) ?? 0; if (!receiptLine) errors[`line-${index}`] = "Dòng hàng không thuộc phiếu nhập."; else if (!Number.isFinite(line.quantity) || line.quantity < 0 || requested > receiptLine.quantity - invoicedQuantity) errors[`line-${index}`] = `Số lượng còn có thể lập hóa đơn là ${Math.max(0, receiptLine.quantity - invoicedQuantity).toLocaleString("vi-VN")} ${receiptLine.unit}.`; });
      if (Object.keys(errors).length || !candidate) return respond(mutation<PurchaseInvoice>(null, errors));
      const lines = draft.lines.filter((line) => line.quantity > 0).map((line) => { const receiptLine = candidate.receipt.lines.find((entry) => entry.id === line.purchaseReceiptLineId)!; const invoicedQuantity = quantityInvoicedForReceiptLine(receiptLine.id ?? ""); const discountAmount = allocateDiscount(receiptLine.discountAmount, receiptLine.quantity, invoicedQuantity, line.quantity); const lineTotal = Math.max(0, line.quantity * receiptLine.unitPrice - discountAmount); return { purchaseReceiptLineId: receiptLine.id!, itemId: receiptLine.itemId, description: receiptLine.description, unit: receiptLine.unit, quantity: line.quantity, unitPrice: receiptLine.unitPrice, discountAmount, vatRate: receiptLine.vatRate, lineTotal }; });
      const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0); const discountAmount = lines.reduce((sum, line) => sum + line.discountAmount, 0); const vatAmount = lines.reduce((sum, line) => sum + line.lineTotal * line.vatRate, 0); const totalAmount = subtotal + vatAmount;
      const entity: PurchaseInvoice = { id: `purchase-invoice-${Date.now()}`, documentNo: `PI-2026-${pad(purchaseInvoiceCount())}`, supplierInvoiceNo: draft.supplierInvoiceNo.trim(), attachmentName: draft.attachmentName?.trim() || undefined, purchaseReceiptId: candidate.receipt.id, purchaseOrderId: candidate.order.id, supplierId: candidate.supplier.id, status: "approved", invoiceDate: draft.invoiceDate, dueDate: draft.dueDate, subtotal, discountAmount, vatAmount, totalAmount, paidAmount: 0, adjustedAmount: 0, balanceAmount: totalAmount, lines };
      generatedPurchaseInvoices.unshift(entity);
      postJournalEntry(entity.documentNo, entity.invoiceDate, [{ accountCode: "156", debit: entity.subtotal, credit: 0 }, { accountCode: "1331", debit: entity.vatAmount, credit: 0 }, { accountCode: "331", debit: 0, credit: entity.totalAmount }]);
      return respond(mutation(entity));
    },
    cancelPurchaseInvoice: (id: string, reason: string) => {
      const invoice = purchaseInvoices().find((entry) => entry.id === id); const errors: Record<string, string> = {};
      if (!invoice) errors.form = "Không tìm thấy hóa đơn mua.";
      else if (invoice.status === "cancelled") errors.form = "Hóa đơn đã được hủy.";
      else if (invoice.paidAmount > 0 || invoice.adjustedAmount > 0) errors.form = "Hóa đơn đã có thanh toán hoặc điều chỉnh, không thể hủy trực tiếp.";
      if (!reason.trim()) errors.reason = "Vui lòng nêu lý do hủy hóa đơn.";
      if (Object.keys(errors).length || !invoice) return respond(mutation<PurchaseInvoice>(null, errors));
      const entity = { ...invoice, status: "cancelled" as const, cancellationReason: reason.trim(), balanceAmount: 0 };
      purchaseInvoiceOverrides.set(invoice.id, entity);
      postJournalEntry(`${invoice.documentNo}-REV`, now, [{ accountCode: "331", debit: invoice.totalAmount, credit: 0 }, { accountCode: "156", debit: 0, credit: invoice.subtotal }, { accountCode: "1331", debit: 0, credit: invoice.vatAmount }]);
      return respond(mutation(entity));
    },
    createPurchaseInvoiceAdjustment: (draft: PurchaseInvoiceAdjustmentDraft) => {
      const invoice = purchaseInvoices().find((entry) => entry.id === draft.purchaseInvoiceId); const errors: Record<string, string> = {};
      if (!invoice || invoice.status === "cancelled") errors.purchaseInvoiceId = "Vui lòng chọn hóa đơn mua còn hiệu lực.";
      if (!draft.adjustmentDate) errors.adjustmentDate = "Vui lòng chọn ngày điều chỉnh.";
      else if (invoice && draft.adjustmentDate < invoice.invoiceDate) errors.adjustmentDate = "Ngày điều chỉnh không được trước ngày hóa đơn.";
      if (!draft.reason.trim()) errors.reason = "Vui lòng nêu lý do điều chỉnh.";
      if (!Number.isFinite(draft.amount) || draft.amount <= 0) errors.amount = "Số tiền điều chỉnh phải lớn hơn 0.";
      else if (invoice && draft.amount > invoice.balanceAmount) errors.amount = `Số tiền điều chỉnh không được vượt ${invoice.balanceAmount.toLocaleString("vi-VN")} ₫.`;
      if (Object.keys(errors).length || !invoice) return respond(mutation<PurchaseInvoiceAdjustment>(null, errors));
      const entity: PurchaseInvoiceAdjustment = { id: `purchase-adjustment-${Date.now()}`, adjustmentNo: `PADJ-2026-${pad(generatedPurchaseInvoiceAdjustments.length + 1)}`, purchaseInvoiceId: invoice.id, adjustmentDate: draft.adjustmentDate, amount: draft.amount, reason: draft.reason.trim(), status: "completed" };
      generatedPurchaseInvoiceAdjustments.unshift(entity);
      postJournalEntry(entity.adjustmentNo, entity.adjustmentDate, [{ accountCode: "331", debit: entity.amount, credit: 0 }, { accountCode: "156", debit: 0, credit: entity.amount }]);
      refreshPurchaseInvoice(invoice.id);
      return respond(mutation(entity));
    },
    recordPurchasePayment: (draft: PurchasePaymentDraft) => {
      const invoice = purchaseInvoices().find((entry) => entry.id === draft.purchaseInvoiceId); const errors: Record<string, string> = {}; const method = paymentMethods().find((entry) => entry.id === draft.methodId && entry.isActive);
      if (!invoice || invoice.status === "cancelled" || invoice.balanceAmount <= 0) errors.purchaseInvoiceId = "Vui lòng chọn hóa đơn còn phải thanh toán.";
      if (!draft.paymentDate) errors.paymentDate = "Vui lòng chọn ngày thanh toán.";
      else if (invoice && draft.paymentDate < invoice.invoiceDate) errors.paymentDate = "Ngày thanh toán không được trước ngày hóa đơn.";
      if (!method) errors.methodId = "Vui lòng chọn phương thức thanh toán hợp lệ.";
      if (!Number.isFinite(draft.totalAmount) || draft.totalAmount <= 0) errors.totalAmount = "Số tiền thanh toán phải lớn hơn 0.";
      else if (invoice && draft.totalAmount > invoice.balanceAmount) errors.totalAmount = `Số tiền thanh toán không được vượt ${invoice.balanceAmount.toLocaleString("vi-VN")} ₫.`;
      if (Object.keys(errors).length || !invoice || !method) return respond(mutation<PurchasePayment>(null, errors));
      const entity: PurchasePayment = { id: `purchase-payment-${Date.now()}`, paymentNo: `PAY-OUT-2026-${pad(generatedPurchasePayments.length + 1)}`, purchaseInvoiceId: invoice.id, supplierId: invoice.supplierId, paymentDate: draft.paymentDate, methodId: method.id, methodName: method.name, totalAmount: draft.totalAmount, referenceNo: draft.referenceNo?.trim() || undefined, status: "completed" };
      generatedPurchasePayments.unshift(entity);
      postJournalEntry(entity.paymentNo, entity.paymentDate, [{ accountCode: "331", debit: entity.totalAmount, credit: 0 }, { accountCode: settlementAccount(entity.methodId), debit: 0, credit: entity.totalAmount }]);
      refreshPurchaseInvoice(invoice.id);
      return respond(mutation(entity));
    },
  },
  inventory: {
    getStockBalances: () => respond<StockBalanceView[]>(stockBalanceViews()),
    getBatchBalances: () => respond<StockBatchView[]>(stockBatchViews()),
    getWarehouses: () => respond<Warehouse[]>(warehouses().filter((warehouse) => warehouse.status === "active" && warehouse.warehouseType === "physical")),
    getMovements: () => respond<InventoryMovement[]>(inventoryMovements()),
    getTransfers: () => respond<InventoryTransfer[]>(generatedTransfers),
    createTransfer: (draft: InventoryTransferDraft) => {
      const errors: Record<string, string> = {}; const from = warehouses().find((warehouse) => warehouse.id === draft.fromWarehouseId); const to = warehouses().find((warehouse) => warehouse.id === draft.toWarehouseId);
      if (!from || from.status !== "active" || from.warehouseType !== "physical") errors.fromWarehouseId = "Vui lòng chọn kho xuất hợp lệ.";
      if (!to || to.status !== "active" || to.warehouseType !== "physical") errors.toWarehouseId = "Vui lòng chọn kho nhận hợp lệ.";
      else if (to.id === from?.id) errors.toWarehouseId = "Kho nhận phải khác kho xuất.";
      if (!draft.transferDate) errors.transferDate = "Vui lòng chọn ngày chuyển kho.";
      if (!draft.lines.length) errors.lines = "Cần có ít nhất một dòng hàng.";
      const requestedByItem = new Map<string, number>();
      const requestedByBatch = new Map<string, number>();
      draft.lines.forEach((line) => {
        const quantity = Number(line.quantity) || 0;
        requestedByItem.set(line.itemId, (requestedByItem.get(line.itemId) ?? 0) + quantity);
        if (line.itemId && line.batchNo?.trim()) {
          const key = stockBatchKey(line.itemId, draft.fromWarehouseId, line.batchNo);
          requestedByBatch.set(key, (requestedByBatch.get(key) ?? 0) + quantity);
        }
      });
      draft.lines.forEach((line, index) => {
        const product = productById(line.itemId); const available = availableToSell(line.itemId, draft.fromWarehouseId);
        if (!product || !isStockManaged(product)) errors[`line-${index}`] = "Vui lòng chọn hàng hóa có quản lý tồn kho.";
        else if (!Number.isFinite(line.quantity) || line.quantity <= 0) errors[`line-${index}`] = "Số lượng chuyển phải lớn hơn 0.";
        else if (line.quantity > available) errors[`line-${index}`] = `Tồn khả dụng tại kho xuất chỉ còn ${available.toLocaleString("vi-VN")} ${product.unit}.`;
      });
      if (from) {
        [...requestedByItem.entries()].forEach(([itemId, quantity]) => {
          const available = availableToSell(itemId, from.id);
          if (quantity > available) draft.lines.forEach((line, index) => {
            if (line.itemId === itemId && line.quantity > 0) errors["line-" + index] = "Tổng số lượng chuyển vượt tồn khả dụng tại kho xuất (" + available.toLocaleString("vi-VN") + " " + (productById(itemId)?.unit ?? "") + ").";
          });
        });
        draft.lines.forEach((line, index) => {
          const product = productById(line.itemId);
          if (product?.trackBatch && line.quantity > 0 && !normalizeBatchNo(line.batchNo)) errors["line-" + index] = "Mặt hàng này yêu cầu chọn lô hàng.";
        });
        [...requestedByBatch.entries()].forEach(([key, quantity]) => {
          const affectedLines = draft.lines.map((line, index) => ({ line, index })).filter(({ line }) => stockBatchKey(line.itemId, from.id, line.batchNo ?? "") === key);
          const first = affectedLines[0]?.line;
          const batch = first && stockBatchViews().find((entry) => entry.itemId === first.itemId && entry.warehouseId === from.id && entry.batchNo === normalizeBatchNo(first.batchNo));
          if (!batch || batch.qualityStatus !== "released" || quantity > batch.quantityOnHand) affectedLines.forEach(({ index }) => {
            errors["line-" + index] = !batch || batch.qualityStatus !== "released" ? "Lô hàng không tồn tại hoặc chưa được phép xuất." : "Tổng số lượng chuyển vượt tồn của lô (" + batch.quantityOnHand.toLocaleString("vi-VN") + " " + batch.item.unit + ").";
          });
        });
      }
      if (Object.keys(errors).length || !from || !to) return respond(mutation<InventoryTransfer>(null, errors));
      const entity: InventoryTransfer = { id: `transfer-${Date.now()}`, documentNo: `ST-2026-${pad(generatedTransfers.length + 1)}`, status: "completed", fromWarehouseId: from.id, toWarehouseId: to.id, transferDate: draft.transferDate, lines: draft.lines.map((line) => ({ ...line, unit: productById(line.itemId)!.unit })) };
      entity.lines.forEach((line) => {
        const source = stockBalanceViews().find((balance) => balance.itemId === line.itemId && balance.warehouseId === from.id); const unitCost = source?.averageCost ?? productById(line.itemId)!.costPrice;
        postInventoryAdjustment(line.itemId, from.id, -line.quantity, unitCost); postInventoryAdjustment(line.itemId, to.id, line.quantity, unitCost);
        if (productById(line.itemId)?.trackBatch && line.batchNo) {
          const batch = stockBatchViews().find((entry) => entry.itemId === line.itemId && entry.warehouseId === from.id && entry.batchNo === normalizeBatchNo(line.batchNo));
          postBatchAdjustment(line.itemId, from.id, line.batchNo, -line.quantity);
          postBatchAdjustment(line.itemId, to.id, line.batchNo, line.quantity, { manufacturingDate: batch?.manufacturingDate, expiryDate: batch?.expiryDate, qualityStatus: batch?.qualityStatus });
        }
        generatedInventoryMovements.unshift({ id: `movement-out-${Date.now()}-${line.itemId}`, referenceNo: entity.documentNo, movementType: "transfer_out", itemId: line.itemId, warehouseId: from.id, quantity: -line.quantity, postingDate: entity.transferDate, description: `Chuyển đến ${to.name}` });
        generatedInventoryMovements.unshift({ id: `movement-in-${Date.now()}-${line.itemId}`, referenceNo: entity.documentNo, movementType: "transfer_in", itemId: line.itemId, warehouseId: to.id, quantity: line.quantity, postingDate: entity.transferDate, description: `Nhận từ ${from.name}` });
      });
      generatedTransfers.unshift(entity); return respond(mutation(entity));
    },
    getAllWarehouses: () => respond<Warehouse[]>(warehouses().filter((warehouse) => warehouse.status === "active")),
    getStockItems: () => respond<Product[]>(products().filter((product) => product.status === "active" && isStockManaged(product))),
    getAdjustments: () => respond<InventoryAdjustment[]>(generatedInventoryAdjustments),
    getSalesReturns: () => respond<SalesReturn[]>(generatedSalesReturns),
    getReturnableDeliveries: () => respond<ReturnableDelivery[]>(returnableDeliveries()),
    getVirtualStockProcesses: () => respond<VirtualStockProcess[]>(generatedVirtualStockProcesses),
    getPickLists: () => respond<PickList[]>(generatedPickLists),
    createAdjustment: (draft: InventoryAdjustmentDraft) => {
      const errors: Record<string, string> = {}; const warehouse = warehouses().find((item) => item.id === draft.warehouseId);
      if (!warehouse || warehouse.status !== "active") errors.warehouseId = "Vui lòng chọn kho hợp lệ.";
      if (!draft.adjustmentDate) errors.adjustmentDate = "Vui lòng chọn ngày điều chỉnh.";
      if (!draft.reason) errors.reason = "Vui lòng chọn lý do điều chỉnh.";
      if (!draft.note.trim()) errors.note = "Vui lòng ghi nhận diễn giải điều chỉnh.";
      if (!draft.lines.some((line) => line.quantityDelta !== 0)) errors.lines = "Cần có ít nhất một dòng có số lượng điều chỉnh khác 0.";
      const removalByItem = new Map<string, number>(); const removalByBatch = new Map<string, number>();
      draft.lines.forEach((line) => {
        if (line.quantityDelta < 0) {
          removalByItem.set(line.itemId, (removalByItem.get(line.itemId) ?? 0) + Math.abs(line.quantityDelta));
          if (line.batchNo?.trim()) {
            const key = stockBatchKey(line.itemId, draft.warehouseId, line.batchNo);
            removalByBatch.set(key, (removalByBatch.get(key) ?? 0) + Math.abs(line.quantityDelta));
          }
        }
      });
      draft.lines.forEach((line, index) => {
        const product = productById(line.itemId);
        if (!product || !isStockManaged(product)) errors["line-" + index] = "Vui lòng chọn hàng hóa có quản lý tồn kho.";
        else if (!Number.isFinite(line.quantityDelta) || line.quantityDelta === 0) errors["line-" + index] = "Số lượng điều chỉnh phải khác 0.";
        else if (draft.reason !== "opening_balance" && !stockBalanceFor(line.itemId, draft.warehouseId)) errors["line-" + index] = "Hàng hóa chưa có tồn tại kho đã chọn. Hãy chọn đúng kho đang có hàng, hoặc dùng Số dư đầu kỳ để khởi tạo tồn mới.";
        else if (product.trackBatch && !normalizeBatchNo(line.batchNo)) errors["line-" + index] = "Mặt hàng này yêu cầu số lô.";
        else if (product.trackBatch && draft.reason !== "opening_balance" && !stockBatchViews().some((batch) => batch.itemId === line.itemId && batch.warehouseId === draft.warehouseId && batch.batchNo === normalizeBatchNo(line.batchNo))) errors["line-" + index] = "Lô hàng chưa có tại kho đã chọn. Vui lòng chọn lô đang có, hoặc dùng Số dư đầu kỳ để khởi tạo lô mới.";
      });
      if (warehouse) {
        [...removalByItem.entries()].forEach(([itemId, quantity]) => {
          const balance = stockBalanceFor(itemId, warehouse.id); const canRemove = Math.max(0, (balance?.quantityOnHand ?? 0) - (balance?.reservedQuantity ?? 0));
          if (quantity > canRemove) draft.lines.forEach((line, index) => { if (line.itemId === itemId && line.quantityDelta < 0) errors["line-" + index] = "Tổng giảm tồn không được vượt số lượng chưa giữ chỗ (" + canRemove.toLocaleString("vi-VN") + " " + (productById(itemId)?.unit ?? "") + ")."; });
        });
        [...removalByBatch.entries()].forEach(([key, quantity]) => {
          const affected = draft.lines.map((line, index) => ({ line, index })).filter(({ line }) => line.quantityDelta < 0 && stockBatchKey(line.itemId, warehouse.id, line.batchNo ?? "") === key);
          const first = affected[0]?.line; const batch = first && stockBatchViews().find((entry) => entry.itemId === first.itemId && entry.warehouseId === warehouse.id && entry.batchNo === normalizeBatchNo(first.batchNo));
          if (!batch || quantity > batch.quantityOnHand) affected.forEach(({ index }) => { errors["line-" + index] = !batch ? "Lô hàng không tồn tại tại kho đã chọn." : "Tổng giảm tồn vượt số lượng của lô (" + batch.quantityOnHand.toLocaleString("vi-VN") + " " + batch.item.unit + ")."; });
        });
      }
      if (Object.keys(errors).length || !warehouse) return respond(mutation<InventoryAdjustment>(null, errors));
      const entity: InventoryAdjustment = { id: "adjustment-" + Date.now(), documentNo: "IA-2026-" + pad(generatedInventoryAdjustments.length + 1), status: "completed", warehouseId: warehouse.id, adjustmentDate: draft.adjustmentDate, reason: draft.reason, note: draft.note.trim(), lines: draft.lines.filter((line) => line.quantityDelta !== 0).map((line) => ({ ...line, batchNo: line.batchNo?.trim(), unit: productById(line.itemId)!.unit })) };
      entity.lines.forEach((line) => {
        const product = productById(line.itemId)!; const unitCost = stockBalanceFor(line.itemId, warehouse.id)?.averageCost ?? product.costPrice;
        postInventoryAdjustment(line.itemId, warehouse.id, line.quantityDelta, unitCost);
        if (product.trackBatch && line.batchNo) postBatchAdjustment(line.itemId, warehouse.id, line.batchNo, line.quantityDelta, { manufacturingDate: entity.adjustmentDate, qualityStatus: warehouse.warehouseType === "virtual" ? "quality_hold" : "released" });
        generatedInventoryMovements.unshift({ id: "movement-adjustment-" + Date.now() + "-" + line.itemId, referenceNo: entity.documentNo, movementType: line.quantityDelta > 0 ? "adjustment_in" : "adjustment_out", itemId: line.itemId, warehouseId: warehouse.id, quantity: line.quantityDelta, postingDate: entity.adjustmentDate, description: "Điều chỉnh tồn: " + entity.note });
      });
      generatedInventoryAdjustments.unshift(entity); return respond(mutation(entity));
    },
    createSalesReturn: (draft: SalesReturnDraft) => {
      const errors: Record<string, string> = {}; const source = returnableDeliveries().find((entry) => entry.delivery.id === draft.deliveryId); const warehouse = warehouses().find((item) => item.id === draft.returnWarehouseId);
      if (!source) errors.deliveryId = "Vui lòng chọn phiếu giao còn có thể trả hàng.";
      if (!warehouse || warehouse.warehouseType !== "virtual") errors.returnWarehouseId = "Hàng trả phải được đưa vào kho ảo chờ kiểm định.";
      if (!draft.returnDate) errors.returnDate = "Vui lòng chọn ngày nhận trả.";
      if (!draft.reason.trim()) errors.reason = "Vui lòng nêu lý do trả hàng.";
      if (!draft.lines.some((line) => line.quantity > 0)) errors.lines = "Cần có ít nhất một dòng trả hàng.";
      const returnedInDraft = new Map<string, number>();
      draft.lines.forEach((line) => returnedInDraft.set(line.salesOrderLineId, (returnedInDraft.get(line.salesOrderLineId) ?? 0) + (Number(line.quantity) || 0)));
      if (source) draft.lines.forEach((line, index) => {
        const deliveryLine = source.delivery.lines.find((item) => item.salesOrderLineId === line.salesOrderLineId); const product = deliveryLine && productById(deliveryLine.itemId); const returnable = deliveryLine ? Math.max(0, deliveryLine.deliveredQuantity - returnedQuantity(source.delivery.id, line.salesOrderLineId)) : 0;
        if (!deliveryLine || !product) errors["line-" + index] = "Dòng hàng không thuộc phiếu giao.";
        else if (!Number.isFinite(line.quantity) || line.quantity < 0 || (returnedInDraft.get(line.salesOrderLineId) ?? 0) > returnable) errors["line-" + index] = "Tổng số lượng trả tối đa là " + returnable.toLocaleString("vi-VN") + " " + product.unit + ".";
        else if (product.trackBatch && (!normalizeBatchNo(line.batchNo) || normalizeBatchNo(line.batchNo) !== normalizeBatchNo(deliveryLine.batchNo))) errors["line-" + index] = "Hàng theo lô phải trả đúng lô đã giao.";
      });
      if (Object.keys(errors).length || !source || !warehouse) return respond(mutation<SalesReturn>(null, errors));
      const entity: SalesReturn = { id: "sales-return-" + Date.now(), documentNo: "SR-2026-" + pad(generatedSalesReturns.length + 1), status: "completed", deliveryId: source.delivery.id, salesOrderId: source.order.id, customerId: source.customer.id, returnDate: draft.returnDate, returnWarehouseId: warehouse.id, reason: draft.reason.trim(), lines: draft.lines.filter((line) => line.quantity > 0).map((line) => { const deliveryLine = source.delivery.lines.find((item) => item.salesOrderLineId === line.salesOrderLineId)!; return { ...line, batchNo: line.batchNo?.trim() ?? deliveryLine.batchNo, itemId: deliveryLine.itemId, unit: productById(deliveryLine.itemId)!.unit }; }) };
      entity.lines.forEach((line) => {
        const product = productById(line.itemId)!; const cost = stockBalanceFor(line.itemId, source.order.warehouseId ?? "")?.averageCost ?? product.costPrice; const sourceBatch = line.batchNo ? stockBatchViews().find((entry) => entry.itemId === line.itemId && entry.warehouseId === (source.order.warehouseId ?? "") && entry.batchNo === normalizeBatchNo(line.batchNo)) : undefined;
        postInventoryAdjustment(line.itemId, warehouse.id, line.quantity, cost);
        if (product.trackBatch && line.batchNo) postBatchAdjustment(line.itemId, warehouse.id, line.batchNo, line.quantity, { manufacturingDate: sourceBatch?.manufacturingDate ?? entity.returnDate, expiryDate: sourceBatch?.expiryDate, qualityStatus: "quality_hold" });
        generatedInventoryMovements.unshift({ id: "movement-return-" + Date.now() + "-" + line.itemId, referenceNo: entity.documentNo, movementType: "sales_return", itemId: line.itemId, warehouseId: warehouse.id, quantity: line.quantity, postingDate: entity.returnDate, description: "Khách trả hàng: " + entity.reason });
      });
      generatedSalesReturns.unshift(entity); return respond(mutation(entity));
    },
    processVirtualStock: (draft: VirtualStockProcessDraft) => {
      const errors: Record<string, string> = {}; const source = warehouses().find((item) => item.id === draft.sourceWarehouseId); const target = draft.targetWarehouseId ? warehouses().find((item) => item.id === draft.targetWarehouseId) : undefined;
      if (!source || source.warehouseType !== "virtual") errors.sourceWarehouseId = "Vui lòng chọn kho ảo nguồn.";
      if (draft.action === "release" && (!target || target.warehouseType !== "physical")) errors.targetWarehouseId = "Vui lòng chọn kho vật lý để nhả QC.";
      if (!draft.processDate) errors.processDate = "Vui lòng chọn ngày xử lý.";
      if (!draft.reason.trim()) errors.reason = "Vui lòng ghi nhận kết quả xử lý.";
      if (!draft.lines.some((line) => line.quantity > 0)) errors.lines = "Cần có ít nhất một dòng hàng xử lý.";
      const processByItem = new Map<string, number>(); const processByBatch = new Map<string, number>();
      draft.lines.forEach((line) => {
        processByItem.set(line.itemId, (processByItem.get(line.itemId) ?? 0) + (Number(line.quantity) || 0));
        if (line.batchNo?.trim()) { const key = stockBatchKey(line.itemId, draft.sourceWarehouseId, line.batchNo); processByBatch.set(key, (processByBatch.get(key) ?? 0) + (Number(line.quantity) || 0)); }
      });
      draft.lines.forEach((line, index) => {
        const product = productById(line.itemId);
        if (!product || !isStockManaged(product)) errors["line-" + index] = "Vui lòng chọn hàng hóa tồn kho.";
        else if (!Number.isFinite(line.quantity) || line.quantity <= 0) errors["line-" + index] = "Số lượng xử lý phải lớn hơn 0.";
        else if (product.trackBatch && !normalizeBatchNo(line.batchNo)) errors["line-" + index] = "Mặt hàng này yêu cầu chọn lô.";
      });
      if (source) {
        [...processByItem.entries()].forEach(([itemId, quantity]) => {
          const balance = stockBalanceFor(itemId, source.id); if (quantity > (balance?.quantityOnHand ?? 0)) draft.lines.forEach((line, index) => { if (line.itemId === itemId && line.quantity > 0) errors["line-" + index] = "Tổng số lượng xử lý vượt tồn kho ảo (" + (balance?.quantityOnHand ?? 0).toLocaleString("vi-VN") + " " + (productById(itemId)?.unit ?? "") + ")."; });
        });
        [...processByBatch.entries()].forEach(([key, quantity]) => {
          const affected = draft.lines.map((line, index) => ({ line, index })).filter(({ line }) => stockBatchKey(line.itemId, source.id, line.batchNo ?? "") === key);
          const first = affected[0]?.line; const batch = first && stockBatchViews().find((entry) => entry.itemId === first.itemId && entry.warehouseId === source.id && entry.batchNo === normalizeBatchNo(first.batchNo));
          if (!batch || quantity > batch.quantityOnHand) affected.forEach(({ index }) => { errors["line-" + index] = !batch ? "Lô không tồn tại trong kho ảo." : "Tổng số lượng xử lý vượt tồn lô (" + batch.quantityOnHand.toLocaleString("vi-VN") + " " + batch.item.unit + ")."; });
        });
      }
      if (Object.keys(errors).length || !source || (draft.action === "release" && !target)) return respond(mutation<VirtualStockProcess>(null, errors));
      const entity: VirtualStockProcess = { id: "virtual-process-" + Date.now(), documentNo: "VSP-2026-" + pad(generatedVirtualStockProcesses.length + 1), status: "completed", sourceWarehouseId: source.id, targetWarehouseId: target?.id, action: draft.action, processDate: draft.processDate, reason: draft.reason.trim(), lines: draft.lines.filter((line) => line.quantity > 0).map((line) => ({ ...line, batchNo: line.batchNo?.trim(), unit: productById(line.itemId)!.unit })) };
      entity.lines.forEach((line) => {
        const product = productById(line.itemId)!; const batch = line.batchNo ? stockBatchViews().find((entry) => entry.itemId === line.itemId && entry.warehouseId === source.id && entry.batchNo === normalizeBatchNo(line.batchNo)) : undefined; const cost = stockBalanceFor(line.itemId, source.id)?.averageCost ?? product.costPrice;
        postInventoryAdjustment(line.itemId, source.id, -line.quantity, cost);
        if (product.trackBatch && line.batchNo) postBatchAdjustment(line.itemId, source.id, line.batchNo, -line.quantity);
        generatedInventoryMovements.unshift({ id: "movement-qc-out-" + Date.now() + "-" + line.itemId, referenceNo: entity.documentNo, movementType: entity.action === "release" ? "qc_release_out" : "qc_scrap", itemId: line.itemId, warehouseId: source.id, quantity: -line.quantity, postingDate: entity.processDate, description: entity.action === "release" ? "Nhả QC: " + entity.reason : "Hủy tại QC: " + entity.reason });
        if (entity.action === "release" && target) {
          postInventoryAdjustment(line.itemId, target.id, line.quantity, cost);
          if (product.trackBatch && line.batchNo) postBatchAdjustment(line.itemId, target.id, line.batchNo, line.quantity, { manufacturingDate: batch?.manufacturingDate, expiryDate: batch?.expiryDate, qualityStatus: "released" });
          generatedInventoryMovements.unshift({ id: "movement-qc-in-" + Date.now() + "-" + line.itemId, referenceNo: entity.documentNo, movementType: "qc_release_in", itemId: line.itemId, warehouseId: target.id, quantity: line.quantity, postingDate: entity.processDate, description: "Nhận hàng đạt QC từ " + source.name });
        }
      });
      generatedVirtualStockProcesses.unshift(entity); return respond(mutation(entity));
    },
    createPickList: (salesOrderId: string) => {
      const order = documents("order").find((item) => item.id === salesOrderId); const errors: Record<string, string> = {};
      if (!order) errors.form = "Không tìm thấy đơn bán.";
      else if (!["confirmed", "partially_completed", "partially_invoiced"].includes(order.status)) errors.form = "Đơn bán cần được xác nhận trước khi tạo Pick List.";
      else if (pickListsForOrder(order.id).some((entry) => entry.status !== "cancelled")) errors.form = "Đơn bán đã có Pick List đang xử lý hoặc đã hoàn tất.";
      const lines = order?.lines.flatMap((line) => { const product = productById(line.itemId); const quantity = Math.max(0, line.quantity - (line.fulfilledQuantity ?? 0)); return product && isStockManaged(product) && quantity > 0 ? [{ salesOrderLineId: line.id, itemId: line.itemId, description: line.description, unit: line.unit, requestedQuantity: quantity, pickedQuantity: 0 }] : []; }) ?? [];
      if (!lines.length) errors.form = "Đơn bán không còn hàng hóa cần soạn.";
      if (Object.keys(errors).length || !order) return respond(mutation<PickList>(null, errors));
      const entity: PickList = { id: "pick-list-" + Date.now(), documentNo: "PL-2026-" + pad(pickListCount()), salesOrderId: order.id, warehouseId: order.warehouseId ?? "", status: "ready", createdDate: now, lines };
      generatedPickLists.unshift(entity); return respond(mutation(entity));
    },
    startPickList: (id: string) => {
      const index = generatedPickLists.findIndex((entry) => entry.id === id); const entity = generatedPickLists[index];
      if (!entity) return respond(mutation<PickList>(null, { form: "Không tìm thấy Pick List." }));
      if (entity.status !== "ready") return respond(mutation<PickList>(null, { form: "Pick List cần ở trạng thái sẵn sàng." }));
      const updated = { ...entity, status: "in_progress" as const }; generatedPickLists[index] = updated; return respond(mutation(updated));
    },
    completePickList: (id: string, draft: PickListCompletionDraft) => {
      const index = generatedPickLists.findIndex((entry) => entry.id === id); const entity = generatedPickLists[index]; const errors: Record<string, string> = {};
      if (!entity) errors.form = "Không tìm thấy Pick List.";
      else if (!["ready", "in_progress"].includes(entity.status)) errors.form = "Pick List này không thể hoàn tất.";
      if (!draft.pickDate) errors.pickDate = "Vui lòng chọn ngày soạn hàng.";
      const allocatedByBatch = new Map<string, number>();
      generatedPickLists.filter((entry) => entry.id !== id && entry.status === "picked").flatMap((entry) => entry.lines).forEach((line) => { if (line.batchNo) { const key = stockBatchKey(line.itemId, entity?.warehouseId ?? "", line.batchNo); allocatedByBatch.set(key, (allocatedByBatch.get(key) ?? 0) + line.pickedQuantity); } });
      if (entity) entity.lines.forEach((line, index) => {
        const draftLine = draft.lines.find((item) => item.salesOrderLineId === line.salesOrderLineId); const product = productById(line.itemId);
        if (!draftLine) errors["line-" + index] = "Thiếu dòng soạn hàng.";
        else if (!Number.isFinite(draftLine.pickedQuantity) || draftLine.pickedQuantity !== line.requestedQuantity) errors["line-" + index] = "Cần soạn đủ " + line.requestedQuantity.toLocaleString("vi-VN") + " " + line.unit + ".";
        else if (product?.trackBatch && !normalizeBatchNo(draftLine.batchNo)) errors["line-" + index] = "Mặt hàng này yêu cầu chọn lô.";
        else if (product?.trackBatch && draftLine.batchNo) {
          const batch = stockBatchViews().find((entry) => entry.itemId === line.itemId && entry.warehouseId === entity.warehouseId && entry.batchNo === normalizeBatchNo(draftLine.batchNo));
          const allocated = allocatedByBatch.get(stockBatchKey(line.itemId, entity.warehouseId, draftLine.batchNo)) ?? 0;
          if (!batch || batch.qualityStatus !== "released" || draftLine.pickedQuantity + allocated > batch.quantityOnHand) errors["line-" + index] = !batch ? "Lô không tồn tại tại kho xuất." : "Số lượng soạn vượt tồn lô còn lại.";
        }
      });
      if (Object.keys(errors).length || !entity) return respond(mutation<PickList>(null, errors));
      const lines = entity.lines.map((line) => { const draftLine = draft.lines.find((item) => item.salesOrderLineId === line.salesOrderLineId)!; return { ...line, pickedQuantity: draftLine.pickedQuantity, batchNo: draftLine.batchNo?.trim() }; });
      const updated: PickList = { ...entity, status: "picked", pickedDate: draft.pickDate, lines }; generatedPickLists[index] = updated; return respond(mutation(updated));
    },
    cancelPickList: (id: string) => {
      const index = generatedPickLists.findIndex((entry) => entry.id === id); const entity = generatedPickLists[index];
      if (!entity) return respond(mutation<PickList>(null, { form: "Không tìm thấy Pick List." }));
      if (entity.status === "picked") return respond(mutation<PickList>(null, { form: "Pick List đã hoàn tất không thể hủy." }));
      const updated: PickList = { ...entity, status: "cancelled" }; generatedPickLists[index] = updated; return respond(mutation(updated));
    },
  },
  sales: {
    getLeads: () => respond<Lead[]>(leadStore),
    getCustomers: () => respond<Customer[]>(customerStore),
    getOpportunities: () => respond<Opportunity[]>(opportunityStore),
    getCrmActivities: () => respond<CrmActivity[]>(crmActivities()),
    getCrmFormOptions: () => respond<CrmFormOptions>({ leads: leadStore.filter((lead) => !["lost", "converted"].includes(lead.status)), customers: customerStore.filter((customer) => customer.status === "active") }),
    getCrmActivityFormOptions: () => respond<CrmActivityFormOptions>({ leads: leadStore.filter((lead) => !["lost", "converted"].includes(lead.status)), customers: customerStore.filter((customer) => customer.status === "active"), opportunities: opportunityStore.filter((opportunity) => opportunity.status === "open") }),
    getCustomer360: (id: string) => {
      const customer = customerById(id);
      if (!customer) return respond<Customer360 | undefined>(undefined);
      const opportunities = opportunityStore.filter((opportunity) => opportunity.customerId === customer.id);
      const quotations = documents("quotation").filter((document) => document.customerId === customer.id);
      const orders = documents("order").filter((document) => document.customerId === customer.id);
      const invoicesForCustomer = invoices().filter((invoice) => invoice.customerId === customer.id);
      const invoiceIds = new Set(invoicesForCustomer.map((invoice) => invoice.id));
      const paymentRows = payments().filter((payment) => invoiceIds.has(payment.invoiceId));
      const knownOrderIds = new Set(orders.map((order) => order.id));
      const historicalOrderAmount = invoicesForCustomer.filter((invoice) => !knownOrderIds.has(invoice.salesOrderId)).reduce((total, invoice) => total + invoice.totalAmount, 0);
      const summary = { quotationAmount: quotations.reduce((total, quotation) => total + quotation.totalAmount, 0), orderAmount: orders.reduce((total, order) => total + order.totalAmount, 0) + historicalOrderAmount, invoicedAmount: invoicesForCustomer.reduce((total, invoice) => total + invoice.totalAmount, 0), paidAmount: paymentRows.reduce((total, payment) => total + payment.totalAmount, 0), openOpportunityAmount: opportunities.filter((opportunity) => opportunity.status === "open").reduce((total, opportunity) => total + opportunity.expectedValue, 0) };
      return respond<Customer360>({ customer, opportunities, quotations, orders, invoices: invoicesForCustomer, payments: paymentRows, activities: customerActivities(customer.id, opportunities), summary });
    },
    createCrmActivity: (draft: CrmActivityDraft) => {
      const errors = validateCrmActivity(draft);
      if (Object.keys(errors).length) return respond(mutation<CrmActivity>(null, errors));
      const entity: CrmActivity = { id: `crm-activity-${Date.now()}`, type: draft.type, subject: draft.subject.trim(), description: draft.description?.trim() || undefined, scheduledAt: draft.scheduledAt, assignedTo: draft.assignedTo, status: "planned", customerId: draft.customerId || null, leadId: draft.leadId || null, opportunityId: draft.opportunityId || null, createdAt: `${now}T09:00:00+07:00` };
      crmActivityStore.unshift(entity);
      return respond(mutation(entity));
    },
    completeCrmActivity: (id: string, result: string) => {
      const index = crmActivityStore.findIndex((activity) => activity.id === id); const activity = crmActivityStore[index]; const errors: Record<string, string> = {};
      if (!activity) errors.form = "Không tìm thấy hoạt động CRM.";
      else if (activity.status !== "planned") errors.form = "Chỉ hoạt động đang lên lịch mới có thể hoàn tất.";
      if (!result.trim()) errors.result = "Vui lòng ghi nhận kết quả hoạt động.";
      if (Object.keys(errors).length || !activity) return respond(mutation<CrmActivity>(null, errors));
      const entity: CrmActivity = { ...activity, status: "completed", result: result.trim(), completedAt: `${now}T12:00:00+07:00` };
      crmActivityStore[index] = entity;
      return respond(mutation(entity));
    },
    cancelCrmActivity: (id: string, reason: string) => {
      const index = crmActivityStore.findIndex((activity) => activity.id === id); const activity = crmActivityStore[index]; const errors: Record<string, string> = {};
      if (!activity) errors.form = "Không tìm thấy hoạt động CRM.";
      else if (activity.status !== "planned") errors.form = "Chỉ hoạt động đang lên lịch mới có thể hủy.";
      if (!reason.trim()) errors.reason = "Vui lòng nêu lý do hủy hoạt động.";
      if (Object.keys(errors).length || !activity) return respond(mutation<CrmActivity>(null, errors));
      const entity: CrmActivity = { ...activity, status: "cancelled", cancellationReason: reason.trim() };
      crmActivityStore[index] = entity;
      return respond(mutation(entity));
    },
    createLead: (draft: LeadDraft) => { const errors = validateLead(draft); if (draft.status === "converted") errors.status = "Chỉ dùng thao tác Chuyển đổi để đổi trạng thái lead."; if (Object.keys(errors).length) return respond(mutation<Lead>(null, errors)); const entity: Lead = { ...draft, id: `lead-${Date.now()}`, code: nextCode("LEAD", 180 + leadStore.length), createdAt: `${now}T09:00:00+07:00` }; leadStore.unshift(entity); return respond(mutation(entity)); },
    updateLead: (id: string, draft: LeadDraft) => {
      const errors = validateLead(draft, id); const index = leadStore.findIndex((lead) => lead.id === id); const existing = leadStore[index];
      if (index === -1) errors.form = "Không tìm thấy lead cần cập nhật.";
      else if (existing.status === "converted" && draft.status !== "converted") errors.status = "Lead đã chuyển đổi không thể quay lại trạng thái chưa chuyển đổi.";
      else if (existing.status !== "converted" && draft.status === "converted") errors.status = "Chỉ dùng thao tác Chuyển đổi để đổi trạng thái lead.";
      if (Object.keys(errors).length) return respond(mutation<Lead>(null, errors));
      const entity = { ...existing, ...draft }; leadStore[index] = entity; return respond(mutation(entity));
    },
    deleteLead: (id: string) => { const index = leadStore.findIndex((lead) => lead.id === id); const errors: Record<string, string> = {}; if (index === -1) errors.form = "Lead không tồn tại."; if (opportunityStore.some((opportunity) => opportunity.leadId === id)) errors.form = "Không thể xóa lead đang được liên kết với cơ hội."; else if (crmActivityStore.some((activity) => activity.leadId === id)) errors.form = "Không thể xóa lead đã có lịch sử hoạt động CRM."; if (Object.keys(errors).length) return respond(mutation<Lead>(null, errors)); const [entity] = leadStore.splice(index, 1); return respond(mutation(entity)); },
    convertLead: (id: string) => { const lead = leadStore.find((item) => item.id === id); const errors: Record<string, string> = {}; if (!lead) errors.form = "Không tìm thấy lead cần chuyển đổi."; else if (lead.status === "lost") errors.form = "Không thể chuyển đổi lead đã không thành công."; else if (lead.status === "converted") errors.form = "Lead này đã được chuyển đổi."; if (Object.keys(errors).length || !lead) return respond({ customer: null, opportunity: null, errors }); const customer: Customer = { id: `cus-${Date.now()}`, code: nextCode("CUS", customerStore.length), name: lead.companyName, taxCode: `PENDING-${lead.code.slice(-4)}`, phone: lead.phone, email: lead.email, address: "Chưa cập nhật", creditLimit: 50_000_000, outstandingBalance: 0, paymentTermDays: 30, assignedSalesperson: lead.ownerId, status: "active" }; const opportunity: Opportunity = { id: `opp-${Date.now()}`, code: nextCode("OPP", 70 + opportunityStore.length), leadId: lead.id, customerId: customer.id, name: `Cơ hội từ ${lead.companyName}`, stage: "qualification", probability: 25, expectedValue: 10_000_000, expectedCloseDate: "2026-09-30", ownerId: lead.ownerId, status: "open" }; customerStore.unshift(customer); opportunityStore.unshift(opportunity); lead.status = "converted"; return respond({ customer, opportunity, errors: {} }); },
    createCustomer: (draft: CustomerDraft) => { const errors = validateCustomer(draft); if (Object.keys(errors).length) return respond(mutation<Customer>(null, errors)); const entity: Customer = { ...draft, id: `cus-${Date.now()}`, code: nextCode("CUS", customerStore.length) }; customerStore.unshift(entity); return respond(mutation(entity)); },
    updateCustomer: (id: string, draft: CustomerDraft) => { const errors = validateCustomer(draft, id); const index = customerStore.findIndex((customer) => customer.id === id); if (index === -1) errors.form = "Không tìm thấy khách hàng cần cập nhật."; if (Object.keys(errors).length) return respond(mutation<Customer>(null, errors)); const entity = { ...customerStore[index], ...draft }; customerStore[index] = entity; return respond(mutation(entity)); },
    deleteCustomer: (id: string) => { const index = customerStore.findIndex((customer) => customer.id === id); const errors: Record<string, string> = {}; if (index === -1) errors.form = "Khách hàng không tồn tại."; if (documents("quotation").some((document) => document.customerId === id) || documents("order").some((document) => document.customerId === id) || opportunityStore.some((opportunity) => opportunity.customerId === id)) errors.form = "Không thể xóa khách hàng đã phát sinh cơ hội hoặc chứng từ."; else if (crmActivityStore.some((activity) => activity.customerId === id)) errors.form = "Không thể xóa khách hàng đã có lịch sử hoạt động CRM."; if (Object.keys(errors).length) return respond(mutation<Customer>(null, errors)); const [entity] = customerStore.splice(index, 1); return respond(mutation(entity)); },
    createOpportunity: (draft: OpportunityDraft) => { const normalized = normalizeOpportunityDraft(draft); const errors = validateOpportunity(normalized); if (Object.keys(errors).length) return respond(mutation<Opportunity>(null, errors)); const entity: Opportunity = { ...normalized, id: `opp-${Date.now()}`, code: nextCode("OPP", 70 + opportunityStore.length), status: statusFromStage(normalized.stage) }; opportunityStore.unshift(entity); return respond(mutation(entity)); },
    updateOpportunity: (id: string, draft: OpportunityDraft) => { const normalized = normalizeOpportunityDraft(draft); const errors = validateOpportunity(normalized, id); const index = opportunityStore.findIndex((opportunity) => opportunity.id === id); if (Object.keys(errors).length) return respond(mutation<Opportunity>(null, errors)); const entity: Opportunity = { ...opportunityStore[index], ...normalized, status: statusFromStage(normalized.stage) }; opportunityStore[index] = entity; return respond(mutation(entity)); },
    moveOpportunity: (id: string, stage: OpportunityStage, lostReason?: string) => {
      const entity = opportunityStore.find((opportunity) => opportunity.id === id);
      if (!entity) return respond(mutation<Opportunity>(null, { form: "Không tìm thấy cơ hội cần di chuyển." }));

      if (stage === "lost") {
        const reason = lostReason?.trim();
        if (!reason) return respond(mutation<Opportunity>(null, { lostReason: "Vui lòng nhập lý do không thành công." }));
        entity.lostReason = reason;
      } else if (entity.stage === "lost") {
        delete entity.lostReason;
      }

      entity.stage = stage;
      entity.status = statusFromStage(stage);
      entity.probability = probabilityFromStage(stage);
      return respond(mutation(entity));
    },
    deleteOpportunity: (id: string) => { const index = opportunityStore.findIndex((opportunity) => opportunity.id === id); if (index === -1) return respond(mutation<Opportunity>(null, { form: "Cơ hội không tồn tại." })); if (documents("quotation").some((document) => document.opportunityId === id) || documents("order").some((document) => document.opportunityId === id)) return respond(mutation<Opportunity>(null, { form: "Không thể xóa cơ hội đã phát sinh báo giá hoặc đơn bán." })); if (crmActivityStore.some((activity) => activity.opportunityId === id)) return respond(mutation<Opportunity>(null, { form: "Không thể xóa cơ hội đã có lịch sử hoạt động CRM." })); const [entity] = opportunityStore.splice(index, 1); return respond(mutation(entity)); },

    getQuotations: () => respond<SalesDocument[]>(documents("quotation")),
    getOrders: () => respond<SalesDocument[]>(documents("order")),
    getOrder: (id: string) => respond<SalesDocument | undefined>(documents("order").find((order) => order.id === id)),
    getQuotation: (id: string) => respond<SalesDocument | undefined>(documents("quotation").find((quote) => quote.id === id)),
    getFormOptions: () => respond<SalesFormOptions>({ customers: customerStore.filter((customer) => customer.status === "active"), products: products().filter((product) => product.status === "active"), warehouses: warehouses().filter((warehouse) => warehouse.status === "active" && warehouse.warehouseType === "physical"), stockAvailability: stockBalanceViews().map((balance) => ({ itemId: balance.itemId, warehouseId: balance.warehouseId, availableQuantity: balance.availableQuantity })) }),
    getPaymentMethods: () => respond<PaymentMethod[]>(paymentMethods().filter((method) => method.isActive)),
    validateDocument: (draft: SalesDocumentDraft) => respond<SalesValidation>(calculate(draft), 100),
    saveDocument: (draft: SalesDocumentDraft) => {
      const validation = calculate(draft); const existing = draft.id ? documents(draft.kind).find((document) => document.id === draft.id) : undefined;
      if (draft.id && !existing) validation.errors.form = "Không tìm thấy chứng từ cần cập nhật.";
      if (existing && existing.status !== "draft") validation.errors.form = "Chỉ chứng từ nháp mới được phép chỉnh sửa. Hãy tạo chứng từ điều chỉnh cho giao dịch đã xác nhận.";
      if (Object.keys(validation.errors).length) return respond({ document: null, validation });
      const document = draftToDocument(draft, validation); if (draft.id) storeDocument(document); else (draft.kind === "order" ? generatedOrders : generatedQuotations).push(document); return respond({ document, validation });
    },
    submitQuotation: (id: string) => { const quote = documents("quotation").find((item) => item.id === id); if (!quote) return respond(mutation<SalesDocument>(null, { form: "Không tìm thấy báo giá." })); if (quote.status !== "draft") return respond(mutation<SalesDocument>(null, { form: "Chỉ báo giá nháp mới có thể gửi duyệt." })); const entity = { ...quote, status: "pending_approval" }; storeDocument(entity); return respond(mutation(entity)); },
    approveQuotation: (id: string) => { const quote = documents("quotation").find((item) => item.id === id); if (!quote) return respond(mutation<SalesDocument>(null, { form: "Không tìm thấy báo giá." })); if (quote.status !== "pending_approval") return respond(mutation<SalesDocument>(null, { form: "Báo giá cần ở trạng thái chờ duyệt." })); const entity = { ...quote, status: "approved" }; storeDocument(entity); return respond(mutation(entity)); },
    getQuotationConversionReadiness: (id: string) => {
      const quote = documents("quotation").find((item) => item.id === id);
      const { errors } = prepareQuotationConversion(quote);
      return respond<QuotationConversionReadiness>({ canConvert: Object.keys(errors).length === 0, errors });
    },
    convertQuotationToOrder: (id: string) => {
      const quote = documents("quotation").find((item) => item.id === id);
      const prepared = prepareQuotationConversion(quote);
      if (Object.keys(prepared.errors).length || !quote || !prepared.draft || !prepared.validation) return respond(mutation<SalesDocument>(null, prepared.errors));
      const entity = { ...draftToDocument(prepared.draft, prepared.validation, "draft", quote.id), opportunityId: quote.opportunityId ?? null };
      generatedOrders.unshift(entity); storeDocument({ ...quote, status: "converted" }); return respond(mutation(entity));
    },
    confirmOrder: (id: string) => {
      const order = documents("order").find((item) => item.id === id); if (!order) return respond(mutation<SalesDocument>(null, { form: "Không tìm thấy đơn bán." })); if (order.status !== "draft") return respond(mutation<SalesDocument>(null, { form: "Chỉ đơn bán nháp mới có thể xác nhận." })); const validation = calculate(documentDraft(order)); if (Object.keys(validation.errors).length) return respond(mutation<SalesDocument>(null, validation.errors)); const entity = { ...order, status: "confirmed" }; reserveOrder(entity); storeDocument(entity); return respond(mutation(entity));
    },
    cancelOrder: (id: string) => {
      const order = documents("order").find((item) => item.id === id); if (!order) return respond(mutation<SalesDocument>(null, { form: "Không tìm thấy đơn bán." })); if (!["draft", "confirmed"].includes(order.status)) return respond(mutation<SalesDocument>(null, { form: "Chỉ đơn nháp hoặc đơn đã xác nhận nhưng chưa giao mới có thể hủy." })); if (deliveries().some((delivery) => delivery.salesOrderId === id) || invoicesForOrder(id).length > 0) return respond(mutation<SalesDocument>(null, { form: "Không thể hủy đơn đã phát sinh giao hàng hoặc hóa đơn." })); if (pickListsForOrder(id).some((entry) => entry.status !== "cancelled")) return respond(mutation<SalesDocument>(null, { form: "Hãy hủy Pick List đang xử lý trước khi hủy đơn bán." })); releaseReservation(id); const entity = { ...order, status: "cancelled" }; storeDocument(entity); return respond(mutation(entity));
    },
    createDelivery: (orderId: string, draft: DeliveryDraft) => {
      const order = documents("order").find((item) => item.id === orderId); const errors: Record<string, string> = {};
      if (!order) errors.form = "Không tìm thấy đơn bán."; else if (!["confirmed", "partially_completed", "partially_invoiced"].includes(order.status)) errors.form = "Đơn bán cần được xác nhận trước khi giao hàng.";
      if (!draft.recipientName.trim()) errors.recipientName = "Vui lòng nhập người nhận."; if (!/^0\d{9,10}$/.test(draft.recipientPhone.replace(/\s/g, ""))) errors.recipientPhone = "Số điện thoại người nhận chưa hợp lệ."; if (!draft.deliveryDate) errors.deliveryDate = "Vui lòng chọn ngày giao."; else if (order && draft.deliveryDate < order.documentDate) errors.deliveryDate = "Ngày giao không được trước ngày đơn bán."; if (!draft.lines.some((line) => line.deliveredQuantity > 0)) errors.lines = "Cần nhập số lượng giao cho ít nhất một dòng.";
      const requestedByItem = new Map<string, number>();
      const requestedByOrderLine = new Map<string, number>();
      const requestedByBatch = new Map<string, number>();
      const completedPickList = order ? pickListsForOrder(order.id).find((entry) => entry.status === "picked") : undefined;
      if (order) draft.lines.forEach((line, index) => {
        const orderLine = order.lines.find((item) => item.id === line.salesOrderLineId); const product = orderLine && productById(orderLine.itemId); const remaining = orderLine ? orderLine.quantity - (orderLine.fulfilledQuantity ?? 0) : 0;
        const requestedQuantity = Number(line.deliveredQuantity) || 0;
        requestedByOrderLine.set(line.salesOrderLineId, (requestedByOrderLine.get(line.salesOrderLineId) ?? 0) + requestedQuantity);
        if (!orderLine) errors[`line-${index}`] = "Dòng hàng không thuộc đơn bán.";
        else if (!isStockManaged(product) && line.deliveredQuantity > 0) errors[`line-${index}`] = "Dịch vụ không cần lập phiếu giao hàng.";
        else if (!Number.isFinite(line.deliveredQuantity) || line.deliveredQuantity < 0 || (requestedByOrderLine.get(line.salesOrderLineId) ?? 0) > remaining) errors[`line-${index}`] = `Tổng số lượng giao tối đa là ${remaining}.`;
        else if (isStockManaged(product)) {
          requestedByItem.set(orderLine.itemId, (requestedByItem.get(orderLine.itemId) ?? 0) + line.deliveredQuantity);
          const pickLine = completedPickList?.lines.find((entry) => entry.salesOrderLineId === line.salesOrderLineId);
          if (completedPickList && (!pickLine || line.deliveredQuantity > pickLine.pickedQuantity || (product?.trackBatch && normalizeBatchNo(line.batchNo) !== normalizeBatchNo(pickLine.batchNo)))) errors["line-" + index] = "Phiếu giao phải dùng đúng số lượng và lô đã được soạn trên Pick List.";
          if (product?.trackBatch && line.deliveredQuantity > 0 && line.batchNo?.trim()) {
            const batchKey = stockBatchKey(orderLine.itemId, order.warehouseId ?? "", line.batchNo);
            requestedByBatch.set(batchKey, (requestedByBatch.get(batchKey) ?? 0) + line.deliveredQuantity);
          }
        }
      });
      if (order) [...requestedByItem.entries()].forEach(([itemId, quantity]) => { const available = availableToDeliver(itemId, order.warehouseId ?? "", order.id); if (quantity > available) draft.lines.forEach((line, index) => { const orderLine = order.lines.find((item) => item.id === line.salesOrderLineId); if (orderLine?.itemId === itemId && line.deliveredQuantity > 0) errors[`line-${index}`] = `Tổng số lượng giao vượt tồn có thể giao (${available.toLocaleString("vi-VN")} ${orderLine.unit}).`; }); });
      if (order) {
        draft.lines.forEach((line, index) => {
          const orderLine = order.lines.find((item) => item.id === line.salesOrderLineId);
          const product = orderLine && productById(orderLine.itemId);
          if (product?.trackBatch && line.deliveredQuantity > 0 && !normalizeBatchNo(line.batchNo)) errors["line-" + index] = "Mặt hàng này yêu cầu chọn lô hàng.";
        });
        [...requestedByBatch.entries()].forEach(([key, quantity]) => {
          const affectedLines = draft.lines.map((line, index) => ({ line, index })).filter(({ line }) => {
            const orderLine = order.lines.find((item) => item.id === line.salesOrderLineId);
            return !!orderLine && stockBatchKey(orderLine.itemId, order.warehouseId ?? "", line.batchNo ?? "") === key;
          });
          const firstOrderLine = order.lines.find((item) => item.id === affectedLines[0]?.line.salesOrderLineId);
          const batch = firstOrderLine && stockBatchViews().find((entry) => entry.itemId === firstOrderLine.itemId && entry.warehouseId === (order.warehouseId ?? "") && entry.batchNo === normalizeBatchNo(affectedLines[0]?.line.batchNo));
          if (!batch || batch.qualityStatus !== "released" || quantity > batch.quantityOnHand) affectedLines.forEach(({ index }) => {
            errors["line-" + index] = !batch || batch.qualityStatus !== "released" ? "Lô hàng không tồn tại hoặc chưa được phép xuất." : "Tổng số lượng giao vượt tồn của lô (" + batch.quantityOnHand.toLocaleString("vi-VN") + " " + batch.item.unit + ").";
          });
        });
      }
      if (Object.keys(errors).length || !order) return respond(mutation<Delivery>(null, errors));
      const entity: Delivery = { id: `delivery-${Date.now()}`, documentNo: `DN-2026-${pad(118 + deliveries().length)}`, salesOrderId: order.id, status: "completed", deliveryDate: draft.deliveryDate, recipientName: draft.recipientName, recipientPhone: draft.recipientPhone, lines: draft.lines.filter((line) => line.deliveredQuantity > 0).map((line) => ({ ...line, batchNo: line.batchNo?.trim(), itemId: order.lines.find((item) => item.id === line.salesOrderLineId)!.itemId })) };
      generatedDeliveries.unshift(entity);
      entity.lines.forEach((line) => {
        const product = productById(line.itemId); const warehouseId = order.warehouseId ?? "";
        if (isStockManaged(product)) {
          const balance = stockBalanceViews().find((entry) => entry.itemId === line.itemId && entry.warehouseId === warehouseId);
          const unitCost = balance?.averageCost ?? product?.costPrice ?? 0;
          postInventoryAdjustment(line.itemId, warehouseId, -line.deliveredQuantity, unitCost);
          if (product?.trackBatch && line.batchNo) postBatchAdjustment(line.itemId, warehouseId, line.batchNo, -line.deliveredQuantity);
          generatedInventoryMovements.unshift({ id: `movement-delivery-${Date.now()}-${line.salesOrderLineId}`, referenceNo: entity.documentNo, movementType: "sales_delivery", itemId: line.itemId, warehouseId, quantity: -line.deliveredQuantity, postingDate: entity.deliveryDate, description: `Xuất giao cho ${customerById(order.customerId)?.name ?? "khách hàng"}` });
        }
        releaseReservation(order.id, line.salesOrderLineId, line.deliveredQuantity);
      });
      const deliveredByOrderLine = new Map<string, number>();
      entity.lines.forEach((line) => deliveredByOrderLine.set(line.salesOrderLineId, (deliveredByOrderLine.get(line.salesOrderLineId) ?? 0) + line.deliveredQuantity));
      const lines = order.lines.map((line) => ({ ...line, fulfilledQuantity: (line.fulfilledQuantity ?? 0) + (deliveredByOrderLine.get(line.id) ?? 0) })); const completed = lines.filter((line) => isStockManaged(productById(line.itemId))).every((line) => (line.fulfilledQuantity ?? 0) >= line.quantity); storeDocument({ ...order, lines, status: completed ? "completed" : "partially_completed" }); return respond(mutation(entity));
    },
    createInvoiceFromDelivered: (orderId: string, issueDate = now) => {
      const order = documents("order").find((item) => item.id === orderId); const errors: Record<string, string> = {}; const serviceOnly = order?.lines.every((line) => !isStockManaged(productById(line.itemId))) ?? false;
      if (!order) errors.form = "Không tìm thấy đơn bán."; else if (!issueDate) errors.issueDate = "Vui lòng chọn ngày hóa đơn."; else if (issueDate < order.documentDate) errors.issueDate = "Ngày hóa đơn không được trước ngày đơn bán."; else if (!["partially_completed", "completed", "partially_invoiced"].includes(order.status) && !(serviceOnly && order.status === "confirmed")) errors.form = "Cần giao ít nhất một phần đơn bán trước khi lập hóa đơn."; if (!order || Object.keys(errors).length) return respond(mutation<SalesInvoice>(null, errors));
      const lines: InvoiceLine[] = order.lines.flatMap((line) => { const eligibleQuantity = isStockManaged(productById(line.itemId)) ? line.fulfilledQuantity ?? 0 : line.quantity; const invoicedBefore = quantityInvoiced(order.id, line.id); const quantity = Math.max(0, eligibleQuantity - invoicedBefore); if (quantity <= 0) return []; const discountAmount = allocateDiscount(line.discountAmount, line.quantity, invoicedBefore, quantity); return [{ ...line, id: `invoice-line-${Date.now()}-${line.id}`, salesOrderLineId: line.id, quantity, fulfilledQuantity: quantity, discountAmount, lineTotal: Math.max(0, quantity * line.unitPrice - discountAmount) }]; });
      if (!lines.length) return respond(mutation<SalesInvoice>(null, { form: "Không còn hàng đã giao chưa được lập hóa đơn." }));
      const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0); const vatAmount = lines.reduce((sum, line) => sum + line.lineTotal * line.vatRate, 0); const customer = customerById(order.customerId)!; const entity: SalesInvoice = { id: `invoice-${Date.now()}`, documentNo: `SI-2026-${pad(122 + invoices().length)}`, salesOrderId: order.id, customerId: order.customerId, status: "approved", issueDate, dueDate: addDays(issueDate, customer.paymentTermDays), subtotal, discountAmount: lines.reduce((sum, line) => sum + line.discountAmount, 0), vatAmount, totalAmount: subtotal + vatAmount, paidAmount: 0, balanceAmount: subtotal + vatAmount, lines };
      generatedInvoices.unshift(entity);
      postJournalEntry(entity.documentNo, entity.issueDate, [{ accountCode: "131", debit: entity.totalAmount, credit: 0 }, { accountCode: "511", debit: 0, credit: entity.subtotal }, { accountCode: "33311", debit: 0, credit: entity.vatAmount }]);
      updateCustomerOutstanding(order.customerId, entity.totalAmount);
      refreshOrderFinance(orderId);
      return respond(mutation(entity));
    },
    recordPayment: (invoiceId: string, draft: PaymentDraft) => {
      const invoice = invoices().find((item) => item.id === invoiceId); const errors: Record<string, string> = {}; if (!invoice) errors.form = "Không tìm thấy hóa đơn."; else if (!["approved", "partially_paid", "overdue"].includes(invoice.status)) errors.form = "Hóa đơn hiện không thể ghi nhận thanh toán."; if (!draft.paymentDate) errors.paymentDate = "Vui lòng chọn ngày thu tiền."; else if (invoice && draft.paymentDate < invoice.issueDate) errors.paymentDate = "Ngày thu tiền không được trước ngày hóa đơn."; const method = paymentMethods().find((item) => item.id === draft.methodId && item.isActive); if (!method) errors.methodId = "Vui lòng chọn phương thức thanh toán."; if (!Number.isFinite(draft.totalAmount) || draft.totalAmount <= 0) errors.totalAmount = "Số tiền thu phải lớn hơn 0."; else if (invoice && draft.totalAmount > invoice.balanceAmount) errors.totalAmount = `Số tiền thu không được vượt ${invoice.balanceAmount.toLocaleString("vi-VN")} ₫.`; if (Object.keys(errors).length || !invoice || !method) return respond(mutation<Payment>(null, errors)); const entity: Payment = { id: `payment-${Date.now()}`, paymentNo: `PAY-2026-${pad(192 + payments().length)}`, invoiceId, paymentDate: draft.paymentDate, totalAmount: draft.totalAmount, status: "completed", methodId: method.id, methodName: method.name };
      generatedPayments.unshift(entity);
      postJournalEntry(entity.paymentNo, entity.paymentDate, [{ accountCode: settlementAccount(entity.methodId), debit: entity.totalAmount, credit: 0 }, { accountCode: "131", debit: 0, credit: entity.totalAmount }]);
      const paidAmount = invoice.paidAmount + entity.totalAmount;
      invoiceOverrides.set(invoice.id, { ...invoice, paidAmount, balanceAmount: Math.max(0, invoice.totalAmount - paidAmount), status: paidAmount >= invoice.totalAmount ? "paid" : "partially_paid" });
      updateCustomerOutstanding(invoice.customerId, -entity.totalAmount);
      refreshOrderFinance(invoice.salesOrderId);
      return respond(mutation(entity));
    },
    getOrderDetail: (id: string) => { const order = documents("order").find((entry) => entry.id === id); if (!order) return respond<OrderDetail | undefined>(undefined); const customer = customerById(order.customerId); if (!customer) return respond<OrderDetail | undefined>(undefined); const invoiceRows = invoicesForOrder(id); const invoiceIds = new Set(invoiceRows.map((invoice) => invoice.id)); return respond<OrderDetail>({ order, customer, lines: order.lines.map((line) => ({ ...line, product: productById(line.itemId)!, availableQuantity: isStockManaged(productById(line.itemId)) ? availableToDeliver(line.itemId, order.warehouseId ?? "", order.id) : 0 })), deliveries: deliveries().filter((entry) => entry.salesOrderId === id), invoices: invoiceRows, payments: payments().filter((payment) => invoiceIds.has(payment.invoiceId)), pickLists: pickListsForOrder(id) }); },
  },
};

type PermissionRule = { module: PermissionModule; action: PermissionAction };
const mutationPermissions: Record<string, PermissionRule> = {
  "hr.checkIn": { module: "Nhân sự", action: "Tạo" }, "hr.checkOut": { module: "Nhân sự", action: "Tạo" }, "hr.adjustAttendance": { module: "Nhân sự", action: "Sửa" }, "hr.createLeaveRequest": { module: "Nhân sự", action: "Tạo" }, "hr.decideLeaveRequest": { module: "Nhân sự", action: "Duyệt" }, "hr.createEmploymentContract": { module: "Nhân sự", action: "Tạo" }, "hr.createPayroll": { module: "Nhân sự", action: "Tạo" }, "hr.approvePayroll": { module: "Nhân sự", action: "Duyệt" }, "hr.payPayroll": { module: "Nhân sự", action: "Duyệt" },
  "pos.openShift": { module: "POS", action: "Tạo" }, "pos.checkout": { module: "POS", action: "Tạo" }, "pos.closeShift": { module: "POS", action: "Tạo" },
  "manufacturing.createWorkOrder": { module: "Sản xuất", action: "Tạo" }, "manufacturing.recordCompletion": { module: "Sản xuất", action: "Duyệt" },
  "purchasing.createPurchaseRequest": { module: "Mua hàng", action: "Tạo" }, "purchasing.updatePurchaseRequest": { module: "Mua hàng", action: "Sửa" }, "purchasing.submitPurchaseRequest": { module: "Mua hàng", action: "Tạo" }, "purchasing.approvePurchaseRequest": { module: "Mua hàng", action: "Duyệt" }, "purchasing.createRfqFromPurchaseRequest": { module: "Mua hàng", action: "Tạo" }, "purchasing.sendRfq": { module: "Mua hàng", action: "Tạo" }, "purchasing.cancelRfq": { module: "Mua hàng", action: "Hủy" }, "purchasing.reopenRfq": { module: "Mua hàng", action: "Sửa" }, "purchasing.createSupplierQuotation": { module: "Mua hàng", action: "Tạo" }, "purchasing.approveSupplierQuotation": { module: "Mua hàng", action: "Duyệt" }, "purchasing.createPurchaseOrderFromSupplierQuotation": { module: "Mua hàng", action: "Tạo" }, "purchasing.savePurchaseOrder": { module: "Mua hàng", action: "Sửa" }, "purchasing.createPurchaseOrderAmendment": { module: "Mua hàng", action: "Tạo" }, "purchasing.submitPurchaseOrder": { module: "Mua hàng", action: "Tạo" }, "purchasing.approvePurchaseOrder": { module: "Mua hàng", action: "Duyệt" }, "purchasing.confirmPurchaseOrder": { module: "Mua hàng", action: "Duyệt" }, "purchasing.createReceipt": { module: "Mua hàng", action: "Tạo" }, "purchasing.createPurchaseReturn": { module: "Mua hàng", action: "Tạo" }, "purchasing.createPurchaseInvoice": { module: "Mua hàng", action: "Tạo" }, "purchasing.cancelPurchaseInvoice": { module: "Mua hàng", action: "Hủy" }, "purchasing.createPurchaseInvoiceAdjustment": { module: "Mua hàng", action: "Sửa" }, "purchasing.recordPurchasePayment": { module: "Mua hàng", action: "Tạo" },
  "inventory.createTransfer": { module: "Kho hàng", action: "Tạo" }, "inventory.createAdjustment": { module: "Kho hàng", action: "Tạo" }, "inventory.createSalesReturn": { module: "Kho hàng", action: "Tạo" }, "inventory.processVirtualStock": { module: "Kho hàng", action: "Tạo" }, "inventory.createPickList": { module: "Kho hàng", action: "Tạo" }, "inventory.startPickList": { module: "Kho hàng", action: "Duyệt" }, "inventory.completePickList": { module: "Kho hàng", action: "Duyệt" }, "inventory.cancelPickList": { module: "Kho hàng", action: "Hủy" },
  "projects.updateTask": { module: "Dự án", action: "Sửa" }, "projects.saveProject": { module: "Dự án", action: "Sửa" }, "projects.saveTask": { module: "Dự án", action: "Sửa" }, "projects.setProjectStatus": { module: "Dự án", action: "Duyệt" }, "projects.createTimesheet": { module: "Dự án", action: "Tạo" }, "projects.updateTimesheet": { module: "Dự án", action: "Sửa" }, "projects.withdrawTimesheet": { module: "Dự án", action: "Hủy" }, "projects.reviewTimesheet": { module: "Dự án", action: "Duyệt" }, "projects.createFinancialEntry": { module: "Dự án", action: "Tạo" }, "projects.addTaskComment": { module: "Dự án", action: "Tạo" },
  "sales.createCrmActivity": { module: "Bán hàng & CRM", action: "Tạo" }, "sales.completeCrmActivity": { module: "Bán hàng & CRM", action: "Sửa" }, "sales.cancelCrmActivity": { module: "Bán hàng & CRM", action: "Hủy" }, "sales.createLead": { module: "Bán hàng & CRM", action: "Tạo" }, "sales.updateLead": { module: "Bán hàng & CRM", action: "Sửa" }, "sales.deleteLead": { module: "Bán hàng & CRM", action: "Hủy" }, "sales.convertLead": { module: "Bán hàng & CRM", action: "Tạo" }, "sales.createCustomer": { module: "Bán hàng & CRM", action: "Tạo" }, "sales.updateCustomer": { module: "Bán hàng & CRM", action: "Sửa" }, "sales.deleteCustomer": { module: "Bán hàng & CRM", action: "Hủy" }, "sales.createOpportunity": { module: "Bán hàng & CRM", action: "Tạo" }, "sales.updateOpportunity": { module: "Bán hàng & CRM", action: "Sửa" }, "sales.moveOpportunity": { module: "Bán hàng & CRM", action: "Sửa" }, "sales.deleteOpportunity": { module: "Bán hàng & CRM", action: "Hủy" }, "sales.saveDocument": { module: "Bán hàng & CRM", action: "Sửa" }, "sales.submitQuotation": { module: "Bán hàng & CRM", action: "Tạo" }, "sales.approveQuotation": { module: "Bán hàng & CRM", action: "Duyệt" }, "sales.convertQuotationToOrder": { module: "Bán hàng & CRM", action: "Tạo" }, "sales.confirmOrder": { module: "Bán hàng & CRM", action: "Duyệt" }, "sales.cancelOrder": { module: "Bán hàng & CRM", action: "Hủy" }, "sales.createDelivery": { module: "Bán hàng & CRM", action: "Tạo" }, "sales.createInvoiceFromDelivered": { module: "Bán hàng & CRM", action: "Tạo" }, "sales.recordPayment": { module: "Bán hàng & CRM", action: "Tạo" },
};
function permissionDenied(area: string, method: string, rule: PermissionRule, args: unknown[]) {
  const message = `Role ${activeRole()} không có quyền ${rule.action} tại ${rule.module}.`;
  if (area === "sales" && method === "saveDocument") { const validation = calculate(args[0] as SalesDocumentDraft); validation.errors.form = message; return respond({ document: null, validation }); }
  if (area === "purchasing" && method === "savePurchaseOrder") { const validation = calculatePurchase(args[0] as PurchaseOrderDraft); validation.errors.form = message; return respond({ document: null, validation }); }
  return respond(mutation<unknown>(null, { form: message }));
}
function canPerformMutation(area: string, method: string, rule: PermissionRule) {
  const selfServiceMethods = new Set(["checkIn", "checkOut", "createLeaveRequest"]);
  if (area === "hr" && selfServiceMethods.has(method) && isSelfServiceOnly() && activeEmployeeId()) return true;
  return can(activeRole(), rule.module, rule.action);
}
function protectMutationArea<T extends Record<string, unknown>>(area: string, source: T): T {
  return new Proxy(source, { get(target, property, receiver) { const value = Reflect.get(target, property, receiver); const method = String(property); const rule = mutationPermissions[`${area}.${method}`]; if (!rule || typeof value !== "function") return value; const fn = value as (...args: unknown[]) => unknown; return (...args: unknown[]) => canPerformMutation(area, method, rule) ? fn(...args) : permissionDenied(area, method, rule, args); } }) as T;
}
export const mockApi = {
  ...mockApiBase,
  hr: protectMutationArea("hr", mockApiBase.hr), pos: protectMutationArea("pos", mockApiBase.pos), projects: protectMutationArea("projects", mockApiBase.projects), manufacturing: protectMutationArea("manufacturing", mockApiBase.manufacturing), purchasing: protectMutationArea("purchasing", mockApiBase.purchasing), inventory: protectMutationArea("inventory", mockApiBase.inventory), sales: protectMutationArea("sales", mockApiBase.sales),
};
