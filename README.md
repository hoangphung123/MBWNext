# MBWNext Frontend

Giao diện React/Vite cho giai đoạn đầu của MBWNext ERP. Bản hiện tại gồm:

- Trang đăng nhập với kiểm tra tài khoản demo.
- Routing bảo vệ sau đăng nhập với `react-router-dom`.
- Layout dùng chung: sidebar, topbar và trang placeholder cho từng phân hệ.
- Dashboard tổng quan lấy dữ liệu từ `src/data/mockData.ts` qua `src/lib/mockApi.ts`.
- Phân hệ Bán hàng & CRM: CRUD Lead, Customer, Opportunity; chuyển đổi Lead
  thành Customer + Opportunity; Pipeline Kanban có thể kéo thả hoặc chỉnh sửa
  giai đoạn.
- Vòng đời bán hàng: Báo giá nháp → gửi duyệt → duyệt → tạo đơn bán → xác nhận
  → phiếu giao → hóa đơn → ghi nhận thanh toán.
- Validation mock data cho đơn bán: bắt buộc chọn khách hàng/sản phẩm, số lượng
  dương, cộng gộp tồn theo mặt hàng, tồn khả dụng theo kho, hạn mức công nợ,
  chiết khấu và ngày giao dự kiến.
- Khi xác nhận, đơn bán giữ tồn kho. Chỉ chứng từ nháp được sửa; đơn đã xác
  nhận phải tạo chứng từ điều chỉnh ở giai đoạn tích hợp backend.
- Giao nhiều đợt và lập hóa đơn nhiều đợt đối chiếu theo đúng dòng đơn, đồng
  thời phân bổ chiết khấu theo số lượng của từng đợt.
- Bộ UI tái sử dụng: `DataTable`, `FilterBar`, `StatusBadge`, `Pagination`, `EmptyState`, `Modal`, `ConfirmDialog` và `Toast`.

## Chạy dự án

Yêu cầu Node.js 20+ và pnpm 9+.

```bash
pnpm install
pnpm dev
```

Mở địa chỉ do Vite hiển thị, thông thường là `http://localhost:5173`.

Tài khoản demo:

```text
Email: ngoc.nguyen@example.vn
Mật khẩu: MBWNext@2026
```

## Cấu trúc chính

```text
src/
  App.tsx              # Routing và trạng thái xác thực
  app/navigation.ts    # Cấu hình menu
  components/          # Layout và reusable UI components
  pages/               # Login, dashboard, placeholder pages
  routes/              # Protected route
  lib/mockApi.ts       # Lớp mô phỏng API bất đồng bộ
  styles.css           # Giao diện responsive
  data/mockData.ts     # Fake data nghiệp vụ ERP
```

## Các màn hình Bán hàng & CRM

Sau khi đăng nhập, truy cập trực tiếp các URL sau hoặc từ menu **Bán hàng & CRM**:

```text
/sales                    # Lead
/sales/customers          # Customer
/sales/opportunities      # Opportunity
/sales/pipeline           # Pipeline cơ hội dạng Kanban
/sales/quotations         # Danh sách báo giá
/sales/quotations/new     # Tạo báo giá
/sales/orders             # Danh sách đơn bán
/sales/orders/new         # Tạo đơn bán
```

## Thao tác nghiệp vụ mẫu

1. Tạo hoặc sửa Lead/Customer/Opportunity từ từng danh sách. Lead đủ điều kiện
   có thể **Chuyển đổi** để sinh Customer và Opportunity liên kết.
2. Trên **Pipeline**, kéo thẻ cơ hội sang cột khác để cập nhật giai đoạn và xác
   suất; có cả cột Không thành công.
3. Tạo Báo giá, dùng các thao tác **Gửi duyệt** → **Duyệt** → **Tạo đơn**.
   Báo giá chỉ được chuyển khi còn hiệu lực, tồn kho và hạn mức công nợ phù hợp.
4. Trong chi tiết Đơn bán: **Xác nhận đơn** → **Tạo phiếu giao** → **Lập hóa
   đơn** → **Thu tiền**. Trạng thái và công nợ được cập nhật sau mỗi bước.
   Phiếu giao chỉ áp dụng cho hàng tồn kho; dịch vụ được đưa trực tiếp vào hóa
   đơn. Đơn chỉ có thể hủy trước khi phát sinh giao hàng hoặc hóa đơn.

Toàn bộ CRUD và các trạng thái nghiệp vụ được lưu trong mock API ở bộ nhớ của
phiên trình duyệt. Dữ liệu sẽ trở về trạng thái mẫu khi tải lại trang; đây là
điểm thay thế bằng API thật ở giai đoạn tích hợp backend.

Để thay API thật sau này, giữ nguyên shape dữ liệu trong `mockData.ts` và thay
nguồn `mbwNextMockData` bằng các API client tương ứng.
