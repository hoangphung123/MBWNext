import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { ToastProvider } from "./components/ui/Toast";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { ModulePlaceholderPage } from "./pages/ModulePlaceholderPage";
import { SalesLayout } from "./pages/sales/SalesLayout";
import { LeadsPage } from "./pages/sales/LeadsPage";
import { CustomersPage } from "./pages/sales/CustomersPage";
import { Customer360Page } from "./pages/sales/Customer360Page";
import { OpportunitiesPage } from "./pages/sales/OpportunitiesPage";
import { CrmActivitiesPage } from "./pages/sales/CrmActivitiesPage";
import { PipelinePage } from "./pages/sales/PipelinePage";
import { SalesDocumentsPage } from "./pages/sales/SalesDocumentsPage";
import { SalesOrderDetailPage } from "./pages/sales/SalesOrderDetailPage";
import { SalesDocumentFormPage } from "./pages/sales/SalesDocumentFormPage";
import { PurchaseLayout } from "./pages/purchase/PurchaseLayout";
import { PurchaseOrdersPage } from "./pages/purchase/PurchaseOrdersPage";
import { PurchaseOrderFormPage } from "./pages/purchase/PurchaseOrderFormPage";
import { PurchaseOrderDetailPage } from "./pages/purchase/PurchaseOrderDetailPage";
import { PurchaseReceiptsPage } from "./pages/purchase/PurchaseReceiptsPage";
import { PurchaseRequestsPage } from "./pages/purchase/PurchaseRequestsPage";
import { PurchaseRfqsPage } from "./pages/purchase/PurchaseRfqsPage";
import { SupplierQuotationsPage } from "./pages/purchase/SupplierQuotationsPage";
import { PurchaseInvoicesPage } from "./pages/purchase/PurchaseInvoicesPage";
import { PurchasePaymentsPage } from "./pages/purchase/PurchasePaymentsPage";
import { PurchaseRequestDetailPage } from "./pages/purchase/PurchaseRequestDetailPage";
import { PurchaseRequestFormPage } from "./pages/purchase/PurchaseRequestFormPage";
import { InventoryPage } from "./pages/inventory/InventoryPage";
import { FinancePage } from "./pages/finance/FinancePage";
import { ManufacturingPage } from "./pages/manufacturing/ManufacturingPage";
import { HrPage } from "./pages/hr/HrPage";
import { EmployeeSelfServicePage } from "./pages/hr/EmployeeSelfServicePage";
import { PersonalProfilePage } from "./pages/profile/PersonalProfilePage";
import { PosPage } from "./pages/pos/PosPage";
import { ProjectsPage } from "./pages/projects/ProjectsPage";
import { ReportsPage } from "./pages/reports/ReportsPage";
import { SettingsPage } from "./pages/settings/SettingsPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { activeUser, readUsers, setActiveUser } from "./lib/accessControl";
import { DEMO_ACCOUNTS } from "./lib/demoAccounts";

const SESSION_KEY = "mbwnext_demo_session";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => window.localStorage.getItem(SESSION_KEY) === "active");
  const [identityReady, setIdentityReady] = useState(() => !isAuthenticated || Boolean(activeUser()));
  useEffect(() => { if (!isAuthenticated || activeUser()) { setIdentityReady(true); return; } const account = DEMO_ACCOUNTS[0]; setActiveUser(readUsers().find((item) => item.email === account.email) ?? { name: account.fullName, email: account.email, role: account.role, scope: "Tất cả chi nhánh", accountStatus: "active" }); setIdentityReady(true); }, [isAuthenticated]);

  const signIn = (email: string) => {
    const account = DEMO_ACCOUNTS.find((item) => item.email === email)!;
    const configured = readUsers().find((item) => item.email === email);
    if (configured?.accountStatus === "suspended") return "Tài khoản đang tạm khóa. Vui lòng liên hệ System Admin.";
    if (configured?.accountStatus === "invited") return "Tài khoản chưa được kích hoạt. Vui lòng hoàn tất lời mời từ System Admin.";
    setActiveUser(configured ?? { name: account.fullName, email: account.email, role: account.role, scope: "Tất cả chi nhánh" });
    window.localStorage.setItem(SESSION_KEY, "active");
    setIsAuthenticated(true); setIdentityReady(true);
    return undefined;
  };

  const signOut = () => {
    window.localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false); setIdentityReady(true);
  };

  if (isAuthenticated && !identityReady) return null;

  return <ToastProvider><BrowserRouter><Routes>
    <Route path="/login" element={isAuthenticated ? <Navigate to="/app" replace /> : <LoginPage onSuccess={signIn} />} />
    <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
      <Route element={<AppShell onSignOut={signOut} />}>
        <Route path="/app" element={<HomePage />} />
        <Route path="/sales" element={<SalesLayout />}>
          <Route index element={<LeadsPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:customerId" element={<Customer360Page />} />
          <Route path="opportunities" element={<OpportunitiesPage />} />
          <Route path="pipeline" element={<PipelinePage />} />
          <Route path="activities" element={<CrmActivitiesPage />} />
          <Route path="quotations" element={<SalesDocumentsPage kind="quotation" />} />
          <Route path="quotations/new" element={<SalesDocumentFormPage kind="quotation" />} />
          <Route path="quotations/:documentId/edit" element={<SalesDocumentFormPage kind="quotation" />} />
          <Route path="orders" element={<SalesDocumentsPage kind="order" />} />
          <Route path="orders/new" element={<SalesDocumentFormPage kind="order" />} />
          <Route path="orders/:documentId" element={<SalesOrderDetailPage />} />
          <Route path="orders/:documentId/edit" element={<SalesDocumentFormPage kind="order" />} />
        </Route>
        <Route path="/purchase" element={<PurchaseLayout />}>
          <Route index element={<Navigate to="requests" replace />} />
          <Route path="requests" element={<PurchaseRequestsPage />} />
          <Route path="requests/new" element={<PurchaseRequestFormPage />} />
          <Route path="requests/:documentId" element={<PurchaseRequestDetailPage />} />
          <Route path="requests/:documentId/edit" element={<PurchaseRequestFormPage />} />
          <Route path="rfqs" element={<PurchaseRfqsPage />} />
          <Route path="supplier-quotations" element={<SupplierQuotationsPage />} />
          <Route path="orders" element={<PurchaseOrdersPage />} />
          <Route path="orders/new" element={<PurchaseOrderFormPage />} />
          <Route path="orders/:documentId" element={<PurchaseOrderDetailPage />} />
          <Route path="orders/:documentId/edit" element={<PurchaseOrderFormPage />} />
          <Route path="receipts" element={<PurchaseReceiptsPage />} />
          <Route path="invoices" element={<PurchaseInvoicesPage />} />
          <Route path="payments" element={<PurchasePaymentsPage />} />
        </Route>
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/finance" element={<FinancePage />} />
        <Route path="/manufacturing" element={<ManufacturingPage />} />
        <Route path="/hr" element={<HrPage />} />
        <Route path="/me" element={<PersonalProfilePage />} />
        <Route path="/attendance" element={<EmployeeSelfServicePage />} />
        <Route path="/pos" element={<PosPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Route>
    <Route path="/" element={<Navigate to={isAuthenticated ? "/app" : "/login"} replace />} />
    <Route path="*" element={<Navigate to={isAuthenticated ? "/app" : "/login"} replace />} />
  </Routes></BrowserRouter></ToastProvider>;
}
