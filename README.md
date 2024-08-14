# QLcantin
* USER:
- xem thống kê chi tiêu hàng tháng, tổng nợ căn tín(nếu có)
    + thông qua bảng hóa đơn - id hóa đơn, id user,id hàng hóa, số tiền, nội dung, ngày tháng, trạng thái- lấy dữ liệu
    + sẽ tổng chi tiêu sẽ là tổng số tiền trong hóa đơn mà người dùng tiêu (tương tự với hàng tháng)
- Đặt suất ăn theo bữa
    + TH1: thông qua bảng hóa đơn - người dùng sẽ tạo 1 yêu cầu về đặt món gửi tới admin, admin sẽ phê duyệt yêu cầu và trả lại thông báo về cho ng dùng
    +TH2: bảng suất ăn riêng (id, id user, tên món, số lượng,số tiền, ngày đặt, bữa ăn (sáng, trưa, chiều)) - tổng thu chi, nợ (sẽ tổng hợp từ 2 bảng hóa đơn và bảng suất ăn)
- thanh toán
- xem thông báo từ căn tin (nếu có) - 1 dạng tin tức
- đăng nhập/đăng ký
* ADMIN:
- Tạo User
- tạo thông báo nếu cần
- Tạo hóa đơn (nợ) Thêm, xóa
    + hóa đơn sẽ có 2 trạng thái: đã thanh toán (thì hóa đơn sẽ không tính và tổng nợ nhưng vẫn tính vào tổng chi user), ghi nợ 
- Theo dõi số lượng hàng hóa - quản lý nhập hàng
    + bảng hàng hóa - id hàng hóa, tên hàng hóa, số lượng, ngày nhập, số tiền
    + dựa vào bảng hóa đơn số lượng hàng hóa sẽ được trừ dần bên bảng hàng hóa để => số lượng hàng còn lại với từng loại mặt hàng
- Quản lý suất ăn theo từng ngày / bữa
    + từ bảng bữa ăn admin kiểm soát đc số lượng suất ăn đã đặt
- Quản lý thu chi 
    + tổng thu sẽ là tổng hợp của 2 bảng suất ăn, bảng hóa đơn
    + tổng chi lã là tổng hợp của bảng hàng hóa
# Table
- users (
    user_id uuid PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(15),
    role char CHECK (role IN ('admin', 'user')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
- items (
    item_id uuid PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(50, 2) NOT NULL,
    available_quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
- orders (
    order_id uuid PRIMARY KEY,
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE,
    total_amount NUMERIC(50, 2) NOT NULL,
    order_status VARCHAR(20) CHECK (order_status IN ('Ghi No', 'Da Thanh Toan', 'canceled')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
- order_items (
    order_item_id uuid PRIMARY KEY,
    order_id uuid REFERENCES orders(order_id) ON DELETE CASCADE,
    item_id uuid REFERENCES items(item_id),
    quantity INTEGER NOT NULL,
    price NUMERIC(50, 2) NOT NULL
)
- inventory (
    inventory_id uuid PRIMARY KEY,
    item_id uuid REFERENCES items(item_id),
    quantity INTEGER NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
- suppliers (
    supplier_id uuid PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    contact_name VARCHAR(100),
    contact_phone VARCHAR(15),
    email VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
- supplier_items (
    supplier_item_id uuid PRIMARY KEY,
    supplier_id uuid REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    item_id uuid REFERENCES items(item_id) ON DELETE CASCADE,
    cost_price NUMERIC(10, 2) NOT NULL,
    supply_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
- categories (
    category_id uuid PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
- item_categories (
    item_category_id uuid PRIMARY KEY,
    item_id uuid REFERENCES items(item_id) ON DELETE CASCADE,
    category_id uuid REFERENCES categories(category_id) ON DELETE CASCADE
)
- thongbao(
    idThongBao: uuid PK
    user_id: uuid Fk
    noidung: text
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

)

