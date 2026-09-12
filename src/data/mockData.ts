/**
 * MBWNext frontend mock data
 *
 * All companies, names, contacts, account numbers and document data in this
 * file are fictional. Amounts are VND; dates are ISO 8601 strings.
 * The data models real ERP relationships (PR -> PO -> receipt -> invoice,
 * quotation -> sales order -> delivery -> invoice -> payment).
 */

export type DocumentStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "partially_completed"
  | "completed"
  | "overdue"
  | "cancelled";

export type CurrencyCode = "VND";

export interface Party {
  id: string;
  code: string;
  name: string;
  taxCode: string;
  phone: string;
  email: string;
  address: string;
  status: "active" | "inactive";
}

export interface Item {
  id: string;
  sku: string;
  name: string;
  categoryId: string;
  itemType: "raw_material" | "finished_good" | "packaging" | "service";
  unit: "kg" | "bag" | "box" | "service";
  barcode: string;
  costPrice: number;
  sellingPrice: number;
  vatRate: number;
  trackBatch: boolean;
  trackSerial: boolean;
  reorderLevel: number;
  status: "active" | "inactive";
}

export interface StockBalance {
  id: string;
  itemId: string;
  warehouseId: string;
  quantityOnHand: number;
  reservedQuantity: number;
  availableQuantity: number;
  averageCost: number;
  stockValue: number;
  updatedAt: string;
}

export interface DocumentLine {
  id: string;
  itemId: string;
  description: string;
  unit: string;
  quantity: number;
  fulfilledQuantity?: number;
  unitPrice: number;
  discountAmount: number;
  vatRate: number;
  lineTotal: number;
}

export interface FinancialDocument {
  id: string;
  documentNo: string;
  status: DocumentStatus;
  issueDate: string;
  dueDate?: string;
  currency: CurrencyCode;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  customerId?: string;
  supplierId?: string;
  salesOrderId?: string | null;
  purchaseReceiptId?: string | null;
  lines: DocumentLine[];
}

export interface MockData {
  metadata: {
    currency: CurrencyCode;
    timezone: string;
    generatedFor: string;
    lastUpdatedAt: string;
  };
  auth: Record<string, unknown>;
  dashboard: Record<string, unknown>;
  masterData: Record<string, unknown>;
  inventory: Record<string, unknown>;
  purchasing: Record<string, unknown>;
  crmAndSales: Record<string, unknown>;
  finance: Record<string, unknown>;
  manufacturing: Record<string, unknown>;
  hr: Record<string, unknown>;
  pos: Record<string, unknown>;
  projects: Record<string, unknown>;
  uiFixtures: Record<string, unknown>;
}

const vat10 = 0.1;

export const mbwNextMockData: MockData = {
  metadata: {
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",
    generatedFor: "MBWNext ERP frontend prototype",
    lastUpdatedAt: "2026-08-29T09:30:00+07:00",
  },

  auth: {
    currentUser: {
      id: "usr-001",
      employeeId: "emp-001",
      username: "ngoc.nguyen",
      fullName: "Nguyễn Hoàng Ngọc",
      email: "ngoc.nguyen@example.vn",
      avatarUrl: "https://i.pravatar.cc/160?img=47",
      branchId: "br-hcm",
      roleIds: ["role-admin", "role-finance-manager"],
      permissions: [
        "dashboard.read",
        "sales.read",
        "sales.approve",
        "purchase.read",
        "purchase.approve",
        "inventory.read",
        "finance.read",
        "finance.post",
        "reports.export",
      ],
    },
    roles: [
      { id: "role-admin", code: "ADMIN", name: "Quản trị hệ thống", userCount: 2 },
      { id: "role-finance-manager", code: "FIN_MGR", name: "Trưởng phòng tài chính", userCount: 1 },
      { id: "role-sales", code: "SALES", name: "Nhân viên kinh doanh", userCount: 8 },
      { id: "role-warehouse", code: "WH", name: "Thủ kho", userCount: 4 },
      { id: "role-cashier", code: "POS", name: "Thu ngân", userCount: 6 },
    ],
    approvalInbox: [
      {
        id: "apr-001",
        entityType: "purchase_request",
        entityId: "pr-2026-0041",
        documentNo: "PR-2026-0041",
        title: "Yêu cầu mua hạt Arabica loại 1",
        requestedBy: "Trần Minh Quân",
        submittedAt: "2026-08-28T15:20:00+07:00",
        amount: 126_000_000,
        currentStep: 2,
        totalSteps: 2,
        status: "pending_approval",
      },
      {
        id: "apr-002",
        entityType: "sales_quotation",
        entityId: "sq-2026-0034",
        documentNo: "SQ-2026-0034",
        title: "Báo giá chuỗi cửa hàng An Nhiên",
        requestedBy: "Lê Bảo Châu",
        submittedAt: "2026-08-29T08:15:00+07:00",
        amount: 168_300_000,
        currentStep: 1,
        totalSteps: 2,
        status: "pending_approval",
      },
    ],
  },

  dashboard: {
    period: { from: "2026-08-01", to: "2026-08-29", label: "Tháng 08/2026" },
    metrics: [
      { key: "revenue", label: "Doanh thu thuần", value: 1_248_600_000, previousValue: 1_109_400_000, format: "currency", trend: "up", trendPercent: 12.55 },
      { key: "grossProfit", label: "Lợi nhuận gộp", value: 372_450_000, previousValue: 318_800_000, format: "currency", trend: "up", trendPercent: 16.83 },
      { key: "openSalesOrders", label: "Đơn bán đang xử lý", value: 18, previousValue: 22, format: "number", trend: "down", trendPercent: -18.18 },
      { key: "lowStockItems", label: "Mặt hàng dưới mức tồn", value: 7, previousValue: 4, format: "number", trend: "up", trendPercent: 75 },
      { key: "receivables", label: "Công nợ phải thu", value: 486_250_000, previousValue: 439_000_000, format: "currency", trend: "up", trendPercent: 10.76 },
    ],
    revenueByDay: [
      { date: "2026-08-25", sales: 43_200_000, target: 40_000_000 },
      { date: "2026-08-26", sales: 49_800_000, target: 40_000_000 },
      { date: "2026-08-27", sales: 37_450_000, target: 40_000_000 },
      { date: "2026-08-28", sales: 55_600_000, target: 40_000_000 },
      { date: "2026-08-29", sales: 41_920_000, target: 40_000_000 },
    ],
    salesByChannel: [
      { channel: "B2B", revenue: 742_300_000, percentage: 59.45 },
      { channel: "POS", revenue: 318_750_000, percentage: 25.53 },
      { channel: "Online", revenue: 187_550_000, percentage: 15.02 },
    ],
    recentActivities: [
      { id: "act-001", at: "2026-08-29T09:12:00+07:00", actor: "Đặng Thu Hà", action: "đã đóng ca POS", reference: "SHIFT-HCM-20260829-01" },
      { id: "act-002", at: "2026-08-29T08:53:00+07:00", actor: "Phạm Nhật Minh", action: "đã xác nhận nhận hàng", reference: "GRN-2026-0088" },
      { id: "act-003", at: "2026-08-29T08:15:00+07:00", actor: "Lê Bảo Châu", action: "đã gửi báo giá", reference: "SQ-2026-0034" },
    ],
  },

  masterData: {
    company: {
      id: "cmp-001",
      code: "APV",
      legalName: "Công ty TNHH Thương mại An Phú Việt",
      taxCode: "0319998887",
      baseCurrency: "VND",
      fiscalYearStartMonth: 1,
    },
    branches: [
      { id: "br-hcm", code: "HCM", name: "Trụ sở Hồ Chí Minh", address: "Quận 1, TP. Hồ Chí Minh", status: "active" },
      { id: "br-hn", code: "HN", name: "Chi nhánh Hà Nội", address: "Quận Cầu Giấy, Hà Nội", status: "active" },
    ],
    customers: [
      { id: "cus-001", code: "CUS-MA", name: "Công ty Cổ phần Thực phẩm Minh Anh", taxCode: "0109988112", phone: "02873001234", email: "purchasing@minhanh.example.vn", address: "Quận 3, TP. Hồ Chí Minh", status: "active", creditLimit: 250_000_000, outstandingBalance: 74_030_000, paymentTermDays: 30, assignedSalesperson: "emp-004" },
      { id: "cus-002", code: "CUS-AN", name: "Chuỗi Cửa hàng An Nhiên", taxCode: "0317889001", phone: "02873005678", email: "orders@annhien.example.vn", address: "TP. Thủ Đức, TP. Hồ Chí Minh", status: "active", creditLimit: 500_000_000, outstandingBalance: 0, paymentTermDays: 45, assignedSalesperson: "emp-004" },
      { id: "cus-003", code: "CUS-LA", name: "Hộ kinh doanh Lộc An Coffee", taxCode: "0318881234", phone: "0908001122", email: "locan@example.vn", address: "Quận Bình Thạnh, TP. Hồ Chí Minh", status: "active", creditLimit: 50_000_000, outstandingBalance: 0, paymentTermDays: 7, assignedSalesperson: "emp-005" },
    ],
    suppliers: [
      { id: "sup-001", code: "SUP-TH", name: "Công ty TNHH Nông sản Tây Nguyên", taxCode: "6001888222", phone: "02623881122", email: "sales@taynguyen.example.vn", address: "Buôn Ma Thuột, Đắk Lắk", status: "active", paymentTermDays: 30, rating: 4.8 },
      { id: "sup-002", code: "SUP-PK", name: "Công ty Bao bì Phú Khang", taxCode: "0309777123", phone: "02837221122", email: "cs@phukhang.example.vn", address: "Quận 12, TP. Hồ Chí Minh", status: "active", paymentTermDays: 15, rating: 4.5 },
      { id: "sup-003", code: "SUP-MT", name: "Thiết bị Minh Tâm", taxCode: "0107712444", phone: "02437665544", email: "support@minhtam.example.vn", address: "Hai Bà Trưng, Hà Nội", status: "active", paymentTermDays: 30, rating: 4.2 },
    ],
    itemCategories: [
      { id: "cat-rm", code: "RM", name: "Nguyên vật liệu", parentId: null },
      { id: "cat-fg", code: "FG", name: "Thành phẩm", parentId: null },
      { id: "cat-pkg", code: "PKG", name: "Bao bì", parentId: null },
      { id: "cat-svc", code: "SVC", name: "Dịch vụ", parentId: null },
    ],
    unitsOfMeasure: [
      { code: "kg", name: "Kilogram", precision: 3 },
      { code: "bag", name: "Túi", precision: 0 },
      { code: "box", name: "Hộp", precision: 0 },
      { code: "service", name: "Dịch vụ", precision: 2 },
    ],
    items: [
      { id: "item-rm-arabica", sku: "RM-COF-001", name: "Hạt cà phê Arabica loại 1", categoryId: "cat-rm", itemType: "raw_material", unit: "kg", barcode: "8938501000011", costPrice: 210_000, sellingPrice: 275_000, vatRate: vat10, trackBatch: true, trackSerial: false, reorderLevel: 250, status: "active" },
      { id: "item-rm-robusta", sku: "RM-COF-002", name: "Hạt cà phê Robusta loại 1", categoryId: "cat-rm", itemType: "raw_material", unit: "kg", barcode: "8938501000028", costPrice: 128_000, sellingPrice: 170_000, vatRate: vat10, trackBatch: true, trackSerial: false, reorderLevel: 300, status: "active" },
      { id: "item-fg-250", sku: "FG-COF-250", name: "Cà phê rang xay Premium 250g", categoryId: "cat-fg", itemType: "finished_good", unit: "bag", barcode: "8938501000103", costPrice: 75_000, sellingPrice: 135_000, vatRate: vat10, trackBatch: true, trackSerial: false, reorderLevel: 300, status: "active" },
      { id: "item-fg-500", sku: "FG-COF-500", name: "Cà phê rang xay Premium 500g", categoryId: "cat-fg", itemType: "finished_good", unit: "bag", barcode: "8938501000110", costPrice: 136_000, sellingPrice: 245_000, vatRate: vat10, trackBatch: true, trackSerial: false, reorderLevel: 200, status: "active" },
      { id: "item-pkg-250", sku: "PKG-BAG-250", name: "Túi zipper kraft 250g", categoryId: "cat-pkg", itemType: "packaging", unit: "bag", barcode: "8938501000202", costPrice: 3_200, sellingPrice: 5_000, vatRate: vat10, trackBatch: false, trackSerial: false, reorderLevel: 1_000, status: "active" },
      { id: "item-svc-shipping", sku: "SVC-SHIP", name: "Phí giao hàng nội thành", categoryId: "cat-svc", itemType: "service", unit: "service", barcode: "SVC-SHIP", costPrice: 0, sellingPrice: 30_000, vatRate: vat10, trackBatch: false, trackSerial: false, reorderLevel: 0, status: "active" },
    ] as Item[],
    taxRates: [
      { id: "tax-0", code: "VAT0", name: "Không chịu thuế", rate: 0 },
      { id: "tax-10", code: "VAT10", name: "VAT 10%", rate: vat10 },
    ],
    paymentMethods: [
      { id: "pm-cash", code: "CASH", name: "Tiền mặt", type: "cash", isActive: true },
      { id: "pm-bank", code: "BANK", name: "Chuyển khoản", type: "bank_transfer", isActive: true },
      { id: "pm-card", code: "CARD", name: "Thẻ ngân hàng", type: "card", isActive: true },
      { id: "pm-ewallet", code: "EWALLET", name: "Ví điện tử", type: "e_wallet", isActive: true },
    ],
  },

  inventory: {
    warehouses: [
      { id: "wh-hcm-main", code: "HCM-MAIN", name: "Kho thành phẩm Hồ Chí Minh", branchId: "br-hcm", warehouseType: "physical", status: "active" },
      { id: "wh-hcm-rm", code: "HCM-RM", name: "Kho nguyên liệu Hồ Chí Minh", branchId: "br-hcm", warehouseType: "physical", status: "active" },
      { id: "wh-hn-main", code: "HN-MAIN", name: "Kho thành phẩm Hà Nội", branchId: "br-hn", warehouseType: "physical", status: "active" },
      { id: "wh-qc", code: "QC-HOLD", name: "Kho chờ kiểm định", branchId: "br-hcm", warehouseType: "virtual", status: "active" },
    ],
    locations: [
      { id: "loc-hcm-a01", warehouseId: "wh-hcm-main", code: "A-01-01", name: "Kệ A01 tầng 1", type: "storage" },
      { id: "loc-hcm-rm01", warehouseId: "wh-hcm-rm", code: "RM-01", name: "Khu nguyên liệu 01", type: "storage" },
      { id: "loc-qc-01", warehouseId: "wh-qc", code: "QC-01", name: "Khu chờ kiểm tra", type: "quality_hold" },
    ],
    stockBalances: [
      { id: "bal-001", itemId: "item-rm-arabica", warehouseId: "wh-hcm-rm", quantityOnHand: 185, reservedQuantity: 80, availableQuantity: 105, averageCost: 210_000, stockValue: 38_850_000, updatedAt: "2026-08-29T08:53:00+07:00" },
      { id: "bal-002", itemId: "item-rm-robusta", warehouseId: "wh-hcm-rm", quantityOnHand: 420, reservedQuantity: 120, availableQuantity: 300, averageCost: 128_000, stockValue: 53_760_000, updatedAt: "2026-08-29T08:53:00+07:00" },
      { id: "bal-003", itemId: "item-fg-250", warehouseId: "wh-hcm-main", quantityOnHand: 260, reservedQuantity: 90, availableQuantity: 170, averageCost: 75_000, stockValue: 19_500_000, updatedAt: "2026-08-29T09:12:00+07:00" },
      { id: "bal-004", itemId: "item-fg-250", warehouseId: "wh-hn-main", quantityOnHand: 200, reservedQuantity: 30, availableQuantity: 170, averageCost: 75_000, stockValue: 15_000_000, updatedAt: "2026-08-29T08:00:00+07:00" },
      { id: "bal-005", itemId: "item-fg-500", warehouseId: "wh-hcm-main", quantityOnHand: 140, reservedQuantity: 70, availableQuantity: 70, averageCost: 136_000, stockValue: 19_040_000, updatedAt: "2026-08-29T09:12:00+07:00" },
      { id: "bal-006", itemId: "item-fg-500", warehouseId: "wh-hn-main", quantityOnHand: 90, reservedQuantity: 20, availableQuantity: 70, averageCost: 136_000, stockValue: 12_240_000, updatedAt: "2026-08-29T08:00:00+07:00" },
      { id: "bal-007", itemId: "item-pkg-250", warehouseId: "wh-hcm-rm", quantityOnHand: 860, reservedQuantity: 500, availableQuantity: 360, averageCost: 3_200, stockValue: 2_752_000, updatedAt: "2026-08-29T08:53:00+07:00" },
    ] as StockBalance[],
    batches: [
      { id: "batch-ara-0826", itemId: "item-rm-arabica", batchNo: "ARA-20260815", manufacturingDate: "2026-08-15", expiryDate: "2027-08-14", warehouseId: "wh-hcm-rm", quantityOnHand: 185, qualityStatus: "released" },
      { id: "batch-rob-0826", itemId: "item-rm-robusta", batchNo: "ROB-20260818", manufacturingDate: "2026-08-18", expiryDate: "2027-08-17", warehouseId: "wh-hcm-rm", quantityOnHand: 420, qualityStatus: "released" },
      { id: "batch-fg250-0826", itemId: "item-fg-250", batchNo: "FG250-20260822", manufacturingDate: "2026-08-22", expiryDate: "2027-02-21", warehouseId: "wh-hcm-main", quantityOnHand: 260, qualityStatus: "released" },
      { id: "batch-fg250-hn-0826", itemId: "item-fg-250", batchNo: "FG250-20260820", manufacturingDate: "2026-08-20", expiryDate: "2027-02-19", warehouseId: "wh-hn-main", quantityOnHand: 200, qualityStatus: "released" },
      { id: "batch-fg500-0826", itemId: "item-fg-500", batchNo: "FG500-20260821", manufacturingDate: "2026-08-21", expiryDate: "2027-02-20", warehouseId: "wh-hcm-main", quantityOnHand: 140, qualityStatus: "released" },
      { id: "batch-fg500-hn-0826", itemId: "item-fg-500", batchNo: "FG500-20260819", manufacturingDate: "2026-08-19", expiryDate: "2027-02-18", warehouseId: "wh-hn-main", quantityOnHand: 90, qualityStatus: "released" },
    ],
    stockEntries: [
      { id: "se-001", entryNo: "GRN-2026-0088", entryType: "purchase_receipt", status: "completed", postingDate: "2026-08-29", sourceDocumentNo: "PO-2026-0061", lines: [{ id: "sel-001", itemId: "item-rm-arabica", description: "Hạt cà phê Arabica loại 1", unit: "kg", quantity: 185, unitPrice: 210_000, discountAmount: 0, vatRate: vat10, lineTotal: 38_850_000, targetWarehouseId: "wh-hcm-rm", batchNo: "ARA-20260815" }] },
      { id: "se-002", entryNo: "DN-2026-0118", entryType: "delivery", status: "completed", postingDate: "2026-08-28", sourceDocumentNo: "SO-2026-0094", lines: [{ id: "sel-002", itemId: "item-fg-250", description: "Cà phê rang xay Premium 250g", unit: "bag", quantity: 12, unitPrice: 75_000, discountAmount: 0, vatRate: 0, lineTotal: 900_000, sourceWarehouseId: "wh-hcm-main", batchNo: "FG250-20260822" }] },
    ],
    lowStockAlerts: [
      { itemId: "item-pkg-250", itemName: "Túi zipper kraft 250g", warehouseId: "wh-hcm-rm", onHand: 860, reorderLevel: 1_000, shortage: 140, severity: "high" },
      { itemId: "item-fg-500", itemName: "Cà phê rang xay Premium 500g", warehouseId: "wh-hcm-main", onHand: 140, reorderLevel: 200, shortage: 60, severity: "medium" },
    ],
  },

  purchasing: {
    purchaseRequests: [
      {
        id: "pr-2026-0041",
        documentNo: "PR-2026-0041",
        status: "pending_approval",
        requestDate: "2026-08-28",
        requiredDate: "2026-09-05",
        requestedBy: "emp-006",
        requestingDepartment: "Sản xuất",
        estimatedAmount: 126_000_000,
        lines: [
          { id: "prl-001", itemId: "item-rm-arabica", description: "Hạt cà phê Arabica loại 1", unit: "kg", quantity: 600, unitPrice: 210_000, discountAmount: 0, vatRate: vat10, lineTotal: 126_000_000 },
        ],
      },
      {
        id: "pr-2026-0039",
        documentNo: "PR-2026-0039",
        status: "approved",
        requestDate: "2026-08-20",
        requiredDate: "2026-08-28",
        requestedBy: "emp-007",
        requestingDepartment: "Kho vận",
        estimatedAmount: 9_600_000,
        lines: [
          { id: "prl-002", itemId: "item-pkg-250", description: "Túi zipper kraft 250g", unit: "bag", quantity: 3_000, unitPrice: 3_200, discountAmount: 0, vatRate: vat10, lineTotal: 9_600_000 },
        ],
      },
    ],
    supplierQuotations: [
      { id: "vquot-001", quotationNo: "VQ-TN-20260826", rfqNo: "RFQ-2026-0022", supplierId: "sup-001", status: "approved", validUntil: "2026-09-05", totalAmount: 138_600_000, leadTimeDays: 5, lines: [{ id: "vql-001", itemId: "item-rm-arabica", description: "Hạt cà phê Arabica loại 1", unit: "kg", quantity: 600, unitPrice: 210_000, discountAmount: 0, vatRate: vat10, lineTotal: 138_600_000 }] },
      { id: "vquot-002", quotationNo: "VQ-PK-20260822", rfqNo: "RFQ-2026-0021", supplierId: "sup-002", status: "approved", validUntil: "2026-08-30", totalAmount: 10_560_000, leadTimeDays: 3, lines: [{ id: "vql-002", itemId: "item-pkg-250", description: "Túi zipper kraft 250g", unit: "bag", quantity: 3_000, unitPrice: 3_200, discountAmount: 0, vatRate: vat10, lineTotal: 10_560_000 }] },
    ],
    purchaseOrders: [
      {
        id: "po-2026-0061",
        documentNo: "PO-2026-0061",
        supplierId: "sup-001",
        sourcePurchaseRequestId: null,
        status: "partially_completed",
        orderDate: "2026-08-25",
        expectedReceiptDate: "2026-08-29",
        warehouseId: "wh-hcm-rm",
        currency: "VND",
        subtotal: 126_000_000,
        discountAmount: 0,
        vatAmount: 12_600_000,
        totalAmount: 138_600_000,
        paidAmount: 0,
        balanceAmount: 138_600_000,
        lines: [{ id: "pol-001", itemId: "item-rm-arabica", description: "Hạt cà phê Arabica loại 1", unit: "kg", quantity: 600, fulfilledQuantity: 185, unitPrice: 210_000, discountAmount: 0, vatRate: vat10, lineTotal: 126_000_000 }],
      },
    ],
    receipts: [
      { id: "grn-2026-0088", documentNo: "GRN-2026-0088", purchaseOrderId: "po-2026-0061", status: "completed", receivedDate: "2026-08-29", warehouseId: "wh-hcm-rm", lines: [{ id: "grnl-001", itemId: "item-rm-arabica", description: "Hạt cà phê Arabica loại 1", unit: "kg", quantity: 185, unitPrice: 210_000, discountAmount: 0, vatRate: vat10, lineTotal: 38_850_000, batchNo: "ARA-20260815", acceptedQuantity: 185, rejectedQuantity: 0 }] },
    ],
  },

  crmAndSales: {
    leads: [
      { id: "lead-001", code: "LEAD-2026-0181", fullName: "Ngô Thanh Vũ", companyName: "Công ty Green Bean", phone: "0909123456", email: "vu.ngo@greenbean.example.vn", source: "Website", status: "qualified", score: 82, ownerId: "emp-004", createdAt: "2026-08-24T10:30:00+07:00" },
      { id: "lead-002", code: "LEAD-2026-0182", fullName: "Đỗ Hải Yến", companyName: "Hệ thống Mộc Nhiên", phone: "0918334455", email: "yen.do@mocnhien.example.vn", source: "Referral", status: "contacted", score: 61, ownerId: "emp-005", createdAt: "2026-08-26T14:10:00+07:00" },
      { id: "lead-003", code: "LEAD-2026-0174", fullName: "Trần Gia Bảo", companyName: "Bảo Long Trading", phone: "0903778899", email: "bao.tran@baolong.example.vn", source: "Event", status: "lost", score: 28, ownerId: "emp-004", lostReason: "Ngân sách chưa phù hợp", createdAt: "2026-08-10T09:00:00+07:00" },
    ],
    opportunities: [
      { id: "opp-001", code: "OPP-2026-0078", leadId: "lead-001", customerId: null, name: "Cung cấp cà phê cho Green Bean", stage: "proposal", probability: 65, expectedValue: 168_300_000, expectedCloseDate: "2026-09-10", ownerId: "emp-004", status: "open" },
      { id: "opp-002", code: "OPP-2026-0069", leadId: null, customerId: "cus-002", name: "Đơn hàng quý III - An Nhiên", stage: "negotiation", probability: 80, expectedValue: 362_340_000, expectedCloseDate: "2026-09-05", ownerId: "emp-004", status: "open" },
    ],
    activities: [
      { id: "crm-act-001", opportunityId: "opp-001", type: "meeting", subject: "Demo sản phẩm và chính sách chiết khấu", scheduledAt: "2026-08-30T14:00:00+07:00", assignedTo: "emp-004", status: "planned" },
      { id: "crm-act-002", opportunityId: "opp-002", type: "call", subject: "Xác nhận số lượng giao tháng 9", scheduledAt: "2026-08-29T10:30:00+07:00", assignedTo: "emp-004", status: "completed", result: "Khách xác nhận đặt thử 1.200 túi" },
    ],
    salesQuotations: [
      {
        id: "sq-2026-0034",
        documentNo: "SQ-2026-0034",
        customerId: "cus-002",
        opportunityId: "opp-002",
        status: "pending_approval",
        issueDate: "2026-08-29",
        validUntil: "2026-09-10",
        currency: "VND",
        subtotal: 153_000_000,
        discountAmount: 0,
        vatAmount: 15_300_000,
        totalAmount: 168_300_000,
        paidAmount: 0,
        balanceAmount: 168_300_000,
        lines: [{ id: "sql-001", itemId: "item-fg-250", description: "Cà phê rang xay Premium 250g", unit: "bag", quantity: 1_200, unitPrice: 127_500, discountAmount: 0, vatRate: vat10, lineTotal: 153_000_000 }],
      },
    ],
    salesOrders: [
      {
        id: "so-2026-0094",
        documentNo: "SO-2026-0094",
        customerId: "cus-001",
        sourceQuotationId: null,
        status: "partially_completed",
        orderDate: "2026-08-27",
        requestedDeliveryDate: "2026-08-30",
        warehouseId: "wh-hcm-main",
        currency: "VND",
        subtotal: 3_580_000,
        discountAmount: 0,
        vatAmount: 358_000,
        totalAmount: 3_938_000,
        paidAmount: 0,
        balanceAmount: 3_938_000,
        lines: [
          { id: "sol-001", itemId: "item-fg-250", description: "Cà phê rang xay Premium 250g", unit: "bag", quantity: 12, fulfilledQuantity: 12, unitPrice: 135_000, discountAmount: 0, vatRate: vat10, lineTotal: 1_620_000 },
          { id: "sol-002", itemId: "item-fg-500", description: "Cà phê rang xay Premium 500g", unit: "bag", quantity: 8, fulfilledQuantity: 0, unitPrice: 245_000, discountAmount: 0, vatRate: vat10, lineTotal: 1_960_000 },
        ],
      },
    ],
    deliveries: [
      { id: "dn-2026-0118", documentNo: "DN-2026-0118", salesOrderId: "so-2026-0094", status: "completed", deliveryDate: "2026-08-28", recipientName: "Nguyễn Thị Mai", recipientPhone: "0908112233", lines: [{ salesOrderLineId: "sol-001", itemId: "item-fg-250", deliveredQuantity: 12, batchNo: "FG250-20260822" }] },
    ],
  },

  finance: {
    chartOfAccounts: [
      { id: "coa-111", code: "1111", name: "Tiền mặt VND", type: "asset", allowPosting: true },
      { id: "coa-112", code: "1121", name: "Tiền gửi ngân hàng VND", type: "asset", allowPosting: true },
      { id: "coa-113", code: "113", name: "Tiền đang chuyển / chờ đối soát", type: "asset", allowPosting: true },
      { id: "coa-131", code: "131", name: "Phải thu khách hàng", type: "asset", allowPosting: true },
      { id: "coa-156", code: "156", name: "Hàng hóa", type: "asset", allowPosting: true },
      { id: "coa-331", code: "331", name: "Phải trả người bán", type: "liability", allowPosting: true },
      { id: "coa-511", code: "511", name: "Doanh thu bán hàng", type: "income", allowPosting: true },
      { id: "coa-632", code: "632", name: "Giá vốn hàng bán", type: "expense", allowPosting: true },
      { id: "coa-3331", code: "33311", name: "Thuế GTGT đầu ra", type: "liability", allowPosting: true },
    ],
    salesInvoices: [
      {
        id: "si-2026-0101",
        documentNo: "SI-2026-0101",
        status: "paid",
        issueDate: "2026-08-20",
        dueDate: "2026-08-27",
        currency: "VND",
        subtotal: 13_500_000,
        discountAmount: 0,
        vatAmount: 1_350_000,
        totalAmount: 14_850_000,
        paidAmount: 14_850_000,
        balanceAmount: 0,
        customerId: "cus-003",
        salesOrderId: "legacy-so-2026-0101",
        lines: [{ id: "sil-legacy-001", itemId: "item-fg-500", description: "Cà phê rang xay Premium 500g", unit: "bag", quantity: 55, unitPrice: 245_454.55, discountAmount: 0, vatRate: vat10, lineTotal: 13_500_000 }],
      },
      {
        id: "si-2026-0106",
        documentNo: "SI-2026-0106",
        status: "overdue",
        issueDate: "2026-07-20",
        dueDate: "2026-08-19",
        currency: "VND",
        subtotal: 65_680_000,
        discountAmount: 0,
        vatAmount: 6_568_000,
        totalAmount: 72_248_000,
        paidAmount: 0,
        balanceAmount: 72_248_000,
        customerId: "cus-001",
        salesOrderId: "so-2026-0071",
        lines: [{ id: "sil-001", itemId: "item-fg-250", description: "Cà phê rang xay Premium 250g", unit: "bag", quantity: 480, unitPrice: 135_000, discountAmount: 0, vatRate: vat10, lineTotal: 64_800_000 }, { id: "sil-002", itemId: "item-svc-shipping", description: "Phí giao hàng nội thành", unit: "service", quantity: 1, unitPrice: 880_000, discountAmount: 0, vatRate: vat10, lineTotal: 880_000 }],
      },
      {
        id: "si-2026-0122",
        documentNo: "SI-2026-0122",
        status: "approved",
        issueDate: "2026-08-28",
        dueDate: "2026-09-27",
        currency: "VND",
        subtotal: 1_620_000,
        discountAmount: 0,
        vatAmount: 162_000,
        totalAmount: 1_782_000,
        paidAmount: 0,
        balanceAmount: 1_782_000,
        customerId: "cus-001",
        salesOrderId: "so-2026-0094",
        lines: [{ id: "sil-003", itemId: "item-fg-250", description: "Cà phê rang xay Premium 250g", unit: "bag", quantity: 12, unitPrice: 135_000, discountAmount: 0, vatRate: vat10, lineTotal: 1_620_000 }],
      },
      {
        id: "si-2026-0124",
        documentNo: "SI-2026-0124",
        status: "approved",
        issueDate: "2026-08-28",
        dueDate: "2026-10-12",
        currency: "VND",
        subtotal: 112_000_000,
        discountAmount: 0,
        vatAmount: 11_200_000,
        totalAmount: 123_200_000,
        paidAmount: 0,
        balanceAmount: 123_200_000,
        customerId: "cus-002",
        salesOrderId: "legacy-so-project-005",
        lines: [{ id: "sil-project-005", itemId: "item-fg-250", description: "Doanh thu thử nghiệm kênh B2B miền Bắc", unit: "bag", quantity: 830, unitPrice: 134_939.76, discountAmount: 0, vatRate: vat10, lineTotal: 112_000_000 }],
      },
    ] as FinancialDocument[],
    purchaseInvoices: [
      {
        id: "pi-2026-0081",
        documentNo: "PI-2026-0081",
        supplierInvoiceNo: "PK-202608-081",
        status: "paid",
        issueDate: "2026-08-18",
        dueDate: "2026-09-02",
        currency: "VND",
        subtotal: 9_600_000,
        discountAmount: 0,
        vatAmount: 960_000,
        totalAmount: 10_560_000,
        paidAmount: 10_560_000,
        balanceAmount: 0,
        supplierId: "sup-002",
        purchaseReceiptId: "legacy-grn-2026-0081",
        purchaseOrderId: "legacy-po-2026-0081",
        lines: [{ id: "pil-legacy-001", itemId: "item-pkg-250", description: "Túi zipper kraft 250g", unit: "bag", quantity: 3_200, unitPrice: 3_000, discountAmount: 0, vatRate: vat10, lineTotal: 9_600_000 }],
      },
      {
        id: "pi-2026-0084",
        documentNo: "PI-2026-0084",
        status: "approved",
        issueDate: "2026-08-29",
        dueDate: "2026-09-28",
        currency: "VND",
        subtotal: 38_850_000,
        discountAmount: 0,
        vatAmount: 3_885_000,
        totalAmount: 42_735_000,
        paidAmount: 0,
        balanceAmount: 42_735_000,
        supplierId: "sup-001",
        purchaseReceiptId: "grn-2026-0088",
        lines: [{ id: "pil-001", itemId: "item-rm-arabica", description: "Hạt cà phê Arabica loại 1", unit: "kg", quantity: 185, unitPrice: 210_000, discountAmount: 0, vatRate: vat10, lineTotal: 38_850_000 }],
      },
      {
        id: "pi-2026-0086",
        documentNo: "PI-2026-0086",
        supplierInvoiceNo: "NCC-202608-086",
        status: "approved",
        issueDate: "2026-08-15",
        dueDate: "2026-09-14",
        currency: "VND",
        subtotal: 62_400_000,
        discountAmount: 0,
        vatAmount: 6_240_000,
        totalAmount: 68_640_000,
        paidAmount: 0,
        balanceAmount: 68_640_000,
        supplierId: "sup-001",
        purchaseReceiptId: "legacy-grn-project-005",
        purchaseOrderId: "legacy-po-project-005",
        lines: [{ id: "pil-project-005", itemId: "item-rm-arabica", description: "Chi phí nguyên liệu phục vụ mở rộng B2B miền Bắc", unit: "kg", quantity: 297.142857, unitPrice: 210_000, discountAmount: 0, vatRate: vat10, lineTotal: 62_400_000 }],
      },
    ] as FinancialDocument[],
    payments: [
      { id: "pay-001", paymentNo: "PAY-2026-0191", paymentDate: "2026-08-27", paymentType: "incoming", methodId: "pm-bank", counterpartyId: "cus-003", totalAmount: 14_850_000, allocations: [{ invoiceId: "si-2026-0101", allocatedAmount: 14_850_000 }], status: "completed", bankReference: "MB-20260827-90551" },
      { id: "pay-002", paymentNo: "PAY-2026-0192", paymentDate: "2026-08-29", paymentType: "outgoing", methodId: "pm-bank", counterpartyId: "sup-002", totalAmount: 10_560_000, allocations: [{ invoiceId: "pi-2026-0081", allocatedAmount: 10_560_000 }], status: "completed", bankReference: "MB-20260829-11082" },
    ],
    bankAccounts: [
      { id: "bank-001", bankName: "Ngân hàng Mẫu", accountNoMasked: "**** 8899", accountName: "CTY TNHH TM AN PHU VIET", balance: 1_425_800_000, currency: "VND" },
    ],
    journalEntries: [
      { id: "je-legacy-pi", entryNo: "JE-2026-0337", postingDate: "2026-08-18", sourceDocumentNo: "PI-2026-0081", status: "posted", lines: [{ accountCode: "156", debit: 9_600_000, credit: 0 }, { accountCode: "1331", debit: 960_000, credit: 0 }, { accountCode: "331", debit: 0, credit: 10_560_000 }] },
      { id: "je-legacy-si", entryNo: "JE-2026-0339", postingDate: "2026-08-20", sourceDocumentNo: "SI-2026-0101", status: "posted", lines: [{ accountCode: "131", debit: 14_850_000, credit: 0 }, { accountCode: "511", debit: 0, credit: 13_500_000 }, { accountCode: "33311", debit: 0, credit: 1_350_000 }] },
      { id: "je-legacy-incoming", entryNo: "JE-2026-0340", postingDate: "2026-08-27", sourceDocumentNo: "PAY-2026-0191", status: "posted", lines: [{ accountCode: "1121", debit: 14_850_000, credit: 0 }, { accountCode: "131", debit: 0, credit: 14_850_000 }] },
      { id: "je-001", entryNo: "JE-2026-0341", postingDate: "2026-08-28", sourceDocumentNo: "SI-2026-0122", status: "posted", lines: [{ accountCode: "131", debit: 1_782_000, credit: 0 }, { accountCode: "511", debit: 0, credit: 1_620_000 }, { accountCode: "33311", debit: 0, credit: 162_000 }] },
      { id: "je-002", entryNo: "JE-2026-0342", postingDate: "2026-08-29", sourceDocumentNo: "PI-2026-0084", status: "posted", lines: [{ accountCode: "156", debit: 38_850_000, credit: 0 }, { accountCode: "1331", debit: 3_885_000, credit: 0 }, { accountCode: "331", debit: 0, credit: 42_735_000 }] },
      { id: "je-legacy-outgoing", entryNo: "JE-2026-0343", postingDate: "2026-08-29", sourceDocumentNo: "PAY-2026-0192", status: "posted", lines: [{ accountCode: "331", debit: 10_560_000, credit: 0 }, { accountCode: "1121", debit: 0, credit: 10_560_000 }] },
    ],
  },

  manufacturing: {
    workCenters: [
      { id: "wc-roast", code: "ROAST", name: "Khu rang", hourlyCapacity: 120, hourlyCost: 450_000, status: "active" },
      { id: "wc-pack", code: "PACK", name: "Khu đóng gói", hourlyCapacity: 360, hourlyCost: 280_000, status: "active" },
    ],
    boms: [
      {
        id: "bom-fg250-v2", bomNo: "BOM-FG250-V2", outputItemId: "item-fg-250", outputQuantity: 100, unit: "bag", status: "active", effectiveFrom: "2026-07-01",
        lines: [
          { id: "boml-001", itemId: "item-rm-arabica", quantity: 16, unit: "kg", scrapRate: 0.02 },
          { id: "boml-002", itemId: "item-rm-robusta", quantity: 10, unit: "kg", scrapRate: 0.02 },
          { id: "boml-003", itemId: "item-pkg-250", quantity: 100, unit: "bag", scrapRate: 0 },
        ],
      },
    ],
    workOrders: [
      { id: "wo-2026-0033", workOrderNo: "WO-2026-0033", bomId: "bom-fg250-v2", outputItemId: "item-fg-250", plannedQuantity: 600, completedQuantity: 360, rejectedQuantity: 8, plannedStartDate: "2026-08-28", plannedEndDate: "2026-08-30", status: "in_progress", sourceSalesOrderId: "so-2026-0094", progressPercent: 60 },
    ],
    jobCards: [
      { id: "jc-001", workOrderId: "wo-2026-0033", workCenterId: "wc-roast", operation: "Rang hạt", assignedEmployeeIds: ["emp-006", "emp-007"], startedAt: "2026-08-28T08:00:00+07:00", endedAt: "2026-08-28T12:00:00+07:00", completedQuantity: 120, rejectedQuantity: 3, status: "completed" },
      { id: "jc-002", workOrderId: "wo-2026-0033", workCenterId: "wc-pack", operation: "Đóng gói", assignedEmployeeIds: ["emp-007"], startedAt: "2026-08-29T08:00:00+07:00", endedAt: null, completedQuantity: 240, rejectedQuantity: 5, status: "in_progress" },
    ],
  },

  hr: {
    employees: [
      { id: "emp-001", employeeCode: "NV-0001", fullName: "Nguyễn Hoàng Ngọc", department: "Tài chính - Kế toán", position: "Trưởng phòng tài chính", branchId: "br-hcm", email: "ngoc.nguyen@example.vn", phone: "0901122334", joinDate: "2023-02-15", employmentStatus: "active", managerId: null },
      { id: "emp-004", employeeCode: "NV-0024", fullName: "Lê Bảo Châu", department: "Kinh doanh", position: "Chuyên viên kinh doanh", branchId: "br-hcm", email: "chau.le@example.vn", phone: "0902233445", joinDate: "2024-01-08", employmentStatus: "active", managerId: "emp-001" },
      { id: "emp-005", employeeCode: "NV-0028", fullName: "Võ Đức Long", department: "Kinh doanh", position: "Chuyên viên kinh doanh", branchId: "br-hcm", email: "long.vo@example.vn", phone: "0903344556", joinDate: "2024-04-17", employmentStatus: "active", managerId: "emp-001" },
      { id: "emp-006", employeeCode: "NV-0031", fullName: "Trần Minh Quân", department: "Sản xuất", position: "Tổ trưởng sản xuất", branchId: "br-hcm", email: "quan.tran@example.vn", phone: "0904455667", joinDate: "2023-09-04", employmentStatus: "active", managerId: "emp-001" },
      { id: "emp-007", employeeCode: "NV-0038", fullName: "Phạm Nhật Minh", department: "Kho vận", position: "Nhân viên kho", branchId: "br-hcm", email: "minh.pham@example.vn", phone: "0905566778", joinDate: "2025-02-03", employmentStatus: "active", managerId: "emp-006" },
    ],
    shifts: [
      { id: "shift-office", code: "HC", name: "Hành chính", startTime: "08:00", endTime: "17:00", breakMinutes: 60 },
      { id: "shift-pos-am", code: "POS-A", name: "Ca sáng POS", startTime: "07:00", endTime: "15:00", breakMinutes: 30 },
    ],
    attendance: [
      { id: "att-001", employeeId: "emp-004", shiftId: "shift-office", date: "2026-08-29", checkInAt: "2026-08-29T07:56:00+07:00", checkOutAt: null, workingHours: 0, status: "present" },
      { id: "att-002", employeeId: "emp-006", shiftId: "shift-office", date: "2026-08-29", checkInAt: "2026-08-29T08:04:00+07:00", checkOutAt: null, workingHours: 0, status: "late" },
      { id: "att-003", employeeId: "emp-007", shiftId: "shift-office", date: "2026-08-29", checkInAt: null, checkOutAt: null, workingHours: 0, status: "leave_approved" },
    ],
    payroll: {
      id: "payroll-2026-08",
      period: "2026-08",
      status: "draft",
      totalGross: 428_500_000,
      totalDeductions: 52_780_000,
      totalNet: 375_720_000,
      lines: [
        { employeeId: "emp-004", baseSalary: 16_000_000, allowances: 2_000_000, commission: 8_400_000, deductions: 3_180_000, netSalary: 23_220_000 },
        { employeeId: "emp-006", baseSalary: 18_000_000, allowances: 1_500_000, commission: 0, deductions: 2_340_000, netSalary: 17_160_000 },
      ],
    },
  },

  pos: {
    stores: [
      { id: "store-001", code: "STORE-Q1", name: "Cửa hàng An Phú Quận 1", branchId: "br-hcm", address: "Quận 1, TP. Hồ Chí Minh", warehouseId: "wh-hcm-main", status: "active" },
    ],
    profiles: [
      { id: "pos-001", code: "POS-Q1-01", storeId: "store-001", name: "Quầy thu ngân 01", warehouseId: "wh-hcm-main", defaultCustomerId: "walk-in-customer", allowOffline: true, status: "active" },
    ],
    shifts: [
      { id: "pos-shift-001", shiftNo: "SHIFT-HCM-20260829-01", profileId: "pos-001", cashierId: "emp-005", openedAt: "2026-08-29T07:00:00+07:00", closedAt: "2026-08-29T15:00:00+07:00", openingCash: 2_000_000, expectedCash: 13_450_000, actualCash: 13_450_000, difference: 0, status: "closed" },
    ],
    invoices: [
      { id: "posi-001", receiptNo: "POS-Q1-20260829-0047", shiftId: "pos-shift-001", customerId: "walk-in-customer", postedAt: "2026-08-29T10:22:00+07:00", status: "completed", subtotal: 530_000, discountAmount: 15_000, vatAmount: 51_500, totalAmount: 566_500, lines: [{ itemId: "item-fg-250", name: "Cà phê rang xay Premium 250g", quantity: 2, unitPrice: 135_000, discountAmount: 0, lineTotal: 270_000 }, { itemId: "item-fg-500", name: "Cà phê rang xay Premium 500g", quantity: 1, unitPrice: 245_000, discountAmount: 15_000, lineTotal: 230_000 }, { itemId: "item-svc-shipping", name: "Phí giao hàng nội thành", quantity: 0.5, unitPrice: 30_000, discountAmount: 0, lineTotal: 15_000 }], payments: [{ methodId: "pm-card", amount: 566_500, referenceNo: "VISA-7761" }] },
    ],
    promotions: [
      { id: "promo-001", code: "AUG15", name: "Giảm 15.000đ sản phẩm 500g", type: "fixed_amount", value: 15_000, applicableItemIds: ["item-fg-500"], startDate: "2026-08-01", endDate: "2026-08-31", status: "active" },
    ],
  },

  projects: {
    projects: [
      { id: "proj-001", code: "PRJ-2026-005", name: "Mở rộng kênh B2B miền Bắc", customerId: "cus-002", managerId: "emp-004", teamMemberIds: ["emp-004", "emp-005"], startDate: "2026-07-01", endDate: "2026-10-31", budgetAmount: 180_000_000, actualCost: 62_400_000, actualRevenue: 112_000_000, status: "in_progress", progressPercent: 55 },
    ],
    tasks: [
      { id: "task-001", projectId: "proj-001", code: "PRJ-005-01", title: "Khảo sát vị trí cửa hàng", assigneeId: "emp-004", startDate: "2026-07-01", dueDate: "2026-07-15", status: "completed", progressPercent: 100, predecessorIds: [] },
      { id: "task-002", projectId: "proj-001", code: "PRJ-005-02", title: "Đàm phán điều khoản thương mại", assigneeId: "emp-004", startDate: "2026-07-16", dueDate: "2026-08-31", status: "in_progress", progressPercent: 70, predecessorIds: ["task-001"] },
      { id: "task-003", projectId: "proj-001", code: "PRJ-005-03", title: "Thiết lập kế hoạch giao hàng", assigneeId: "emp-005", startDate: "2026-09-01", dueDate: "2026-09-15", status: "not_started", progressPercent: 0, predecessorIds: ["task-002"] },
    ],
    timesheets: [
      { id: "time-001", projectId: "proj-001", taskId: "task-002", employeeId: "emp-004", workDate: "2026-08-28", hours: 5.5, status: "approved", note: "Họp đàm phán chính sách giá với khách hàng" },
      { id: "time-002", projectId: "proj-001", taskId: "task-002", employeeId: "emp-005", workDate: "2026-08-28", hours: 3, status: "submitted", note: "Chuẩn bị phương án logistics" },
    ],
    financialEntries: [
      { id: "pfe-001", projectId: "proj-001", postingDate: "2026-08-15", entryType: "expense", sourceDocumentNo: "PI-2026-0086", description: "Chi phí nguyên liệu phục vụ mở rộng B2B miền Bắc", amount: 62_400_000 },
      { id: "pfe-002", projectId: "proj-001", postingDate: "2026-08-28", entryType: "revenue", sourceDocumentNo: "SI-2026-0124", description: "Doanh thu thử nghiệm kênh B2B miền Bắc", amount: 112_000_000 },
    ],
  },

  uiFixtures: {
    tablePagination: { page: 1, pageSize: 20, totalItems: 128, totalPages: 7 },
    emptySearchResult: { items: [], page: 1, pageSize: 20, totalItems: 0, message: "Không tìm thấy dữ liệu phù hợp." },
    loadingRows: 8,
    formErrors: {
      requiredCustomer: "Vui lòng chọn khách hàng.",
      requiredWarehouse: "Vui lòng chọn kho xuất hàng.",
      invalidQuantity: "Số lượng phải lớn hơn 0.",
      insufficientStock: "Số lượng xuất vượt quá tồn khả dụng (70 túi).",
      creditLimitExceeded: "Đơn hàng vượt hạn mức công nợ của khách hàng.",
    },
    permissions: {
      canApprovePurchaseOrder: true,
      canViewCostPrice: true,
      canEditPostedJournal: false,
      canClosePOSShift: true,
    },
  },
};

export const formatVnd = (amount: number): string =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);

export const getItemById = (itemId: string) =>
  (mbwNextMockData.masterData.items as Item[]).find((item) => item.id === itemId);
