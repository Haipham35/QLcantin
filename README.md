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
    item_id uuid PRIMARY KEY,// tham khao suk id
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
- inventory (// xem lai
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
    cost_price NUMERIC(50, 2) NOT NULL,
    supply_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
- categories (// xem lai thiet ke nhieu nhieu xem can thiet hay k???
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
    idThongBao uuid PRIMARY KEY,
    user_id uuid  REFERENCES users(user_id),// ko can thiet
    noidung text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);
- sau khi bo quan he nhieu nhieu giua loaij hang va mat hang
 categories (
    category_id uuid PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

 items (
    item_id uuid PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(50, 2) NOT NULL,
    available_quantity INTEGER NOT NULL,
    category_id uuid REFERENCES categories(category_id) ON DELETE SET NULL, -- Thêm cột này để liên kết với categories
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Các chức năng chính trong UI // các chức năng quản lý sẽ giống các nút trong slide bar
* User
- Xem thông báo : 
- click Thông kê chi tiêu: 
    + hiển thị thổng chi 
    + hiển thị tổng nợ
    + hiển thị bảng thống kê theo hàng tháng 
    + khi click vào cột chi tiêu trong 1 tháng bất kỳ sẽ hiển thị chi tiết tháng đó tiêu những gì in ra dánh ách hóa đơn
- Click mục đặt đồ ăn
    + hiển thị danh sách dặt đồ ăn đã đặt từ ngày .. đến ngày .. 
    + click button tạo yêu cầu đặt đồ ăn... -> hoản thành form 
- thanh toán: ..nếu còn tg..
* admin
- quản lý người dùng :
    + Click vào quản lý ng dùng trong slide bar
    + click button ra form tạo user, 
    + danh sách các user và thanh tìm kiếm, 
    + khi click vào 1 user bất kỳ có thể xem chi tiết và sửa nếu muốn
- quản lý nhập hàng: 
    + click vào quản lý kho hàng trónglide bar
    + bảng thống kê số lượng hàng hóa
    + click button nhập hàng -> hiển thị form nhập hàng
- Quản lý hóa đơn:
    + click vào quản lý hóa đơn trong slider bar
    + thanh thông kế những hóa đơn từ ngày.. đến.. nếu để trống sẽ là mặc định chỉ để tỏng hôm nay
    + click button tạo hóa đơn -> form hóa đơn
    + thanh tìm kiếm
??? quản lý suất ăn ???
- Truyền tải thông báo (thông tin)
    + click vào thong báo trong slide bar
    + hiển thị danh sách các thông báo// kèm thanh tìm kiếm
    + click button tạo thông báo mới _> hiển thì form
