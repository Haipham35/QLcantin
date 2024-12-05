# QLcantin

- USER:

* xem thống kê chi tiêu hàng tháng, tổng nợ căn tin
  - thông qua bảng hóa đơn - id hóa đơn, id user,id hàng hóa, số tiền, nội dung, ngày tháng, trạng thái- lấy dữ liệu
  - sẽ tổng chi tiêu sẽ là tổng số tiền trong hóa đơn mà người dùng tiêu (làm tương tự với chi tiêu hàng tháng)
* Đặt suất ăn theo bữa
  - TH1: thông qua bảng hóa đơn - người dùng sẽ tạo 1 yêu cầu về đặt món gửi tới admin, admin sẽ phê duyệt yêu cầu và trả lại thông báo về cho ng dùng
* thanh toán
* xem thông báo từ căn tin (nếu có) - 1 dạng tin tức
* đăng nhập/đăng ký

- ADMIN:

* Tạo User
* tạo thông báo nếu cần
* Tạo hóa đơn (nợ) Thêm, xóa
  - hóa đơn sẽ có 2 trạng thái: đã thanh toán (thì hóa đơn sẽ không tính và tổng nợ nhưng vẫn tính vào tổng chi user), ghi nợ
  - Nếu người tạo là Admin thì trạng thái của hóa đơn sẽ là Xác nhânnj-DA THANH TOAN hoặc Xác nhận - Ghi no
  - Nếu User là người tạo hóa đơn thì trạng thái xẽ là chưa xác nhận. ADMIN cần xác nhận đơn hàng
* Theo dõi số lượng hàng hóa - quản lý nhập hàng
  - bảng hàng hóa - id hàng hóa, tên hàng hóa, số lượng, ngày nhập, số tiền
  - dựa vào bảng hóa đơn số lượng hàng hóa sẽ được trừ dần bên bảng hàng hóa để => số lượng hàng còn lại với từng loại mặt hàng
* Quản lý suất ăn theo từng ngày / bữa
  - từ bảng bữa ăn admin kiểm soát đc số lượng suất ăn đã đặt
* Quản lý thu chi
  - tổng thu sẽ là tổng hợp số tiền của của các order có status là 'Xác nhận%'
  - tổng chi lã là tổng hợp của bảng hàng hóa

# Table(DataBase)

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
- thongbao(
  idThongBao uuid PRIMARY KEY,
  user_id uuid REFERENCES users(user_id),// ko can thiet
  noidung text,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

- sau khi bo quan he nhieu nhieu giua loaij hang va mat hang
  categories (// co the dung de phan loai suat an
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
category_id uuid REFERENCES categories(category_id) ON DELETE SET NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

# Các chức năng chính trong UI // các chức năng quản lý sẽ giống các nút trong slide bar

- User

* Cập nhật thông tin các nhân
* Xem thông báo :
* click Thông kê chi tiêu:

  - hiển thị tổng chi
  - hiển thị tổng nợ
  - hiển thị bảng thống kê theo hàng tháng
  - khi click vào cột chi tiêu trong 1 tháng bất kỳ sẽ hiển thị chi tiết tháng đó tiêu những gì in ra dánh ách hóa đơn

  # Những API cần thiết:

        + lấy tổng số tiền của các order trong tháng đó cộng lại in ra tổng cho ng dừng
        + lấy tổng số tièn của các order trong tháng có trạng thái ghi nợ r hiển htij ra UI
        + lấy chi tiết các hoá đơn trong tháng đó -> in ra cho ng dùng

* Click mục đặt đồ ăn
  - hiển thị danh sách đồ ăn có trong database
  - hiển thị danh sách dặt đồ ăn đã đặt từ ngày .. đến ngày ..
  - click button tạo yêu cầu đặt đồ ăn...
  # Những API cần thiết:
        + lấy dữ liệu hiển thị các order đã đặt trong ngày hôm đó
        + đẩy req tạo order
* thanh toán: ..nếu còn thời gian..

- admin

* quản lý người dùng :
  - Click vào quản lý ng dùng trong slide bar
  - click button ra form tạo user,
  - danh sách các user và thanh tìm kiếm,
  - khi click vào 1 user bất kỳ có thể xem chi tiết và sửa nếu muốn
  # Những API cần thiết :
  - lấy hết các danh sách dữ liệu ng dùng
  - create user với role
  - tìm kiếm user dựa trên dữ liệu ng dùng nhập vào sau đó so sánh với db rồi đưa ra kq
  - UD user nếu cần
* quản lý nhập hàng:
  - click vào quản lý kho hàng trong slide bar
  - bảng thống kê số lượng hàng hóa
  - click button nhập hàng -> hiển thị form nhập hàng
  # Những API cần thiết:
  - lấy dữ liệu item và category
  - lấy toàn bộ dữ liệu -> chọn vào category bất kỳ sẽ có nh items phù hợp với category đó
  - post phiếu nhập hàng gồm hàng gì những items nào , số lượng bao nhiêu
* Quản lý hóa đơn: + click vào quản lý hóa đơn trong slider bar + thanh thông kế những hóa đơn từ ngày.. đến.. nếu để trống sẽ là mặc định chỉ để tỏng hôm nay + click button tạo hóa đơn -> form hóa đơn + thanh tìm kiếm # Những API cần thiết: + lấy toàn bộ dnah sách order + tạo hóa đơn
* Truyền tải thông báo (thông tin)
  - click vào thong báo trong slide bar
  - hiển thị danh sách các thông báo// kèm thanh tìm kiếm
  - click button tạo thông báo mới \_> hiển thì form

# Lưu ý:

- khi truyền api nào cần check role người dùng thì với admin thì gán bình thường còn với user sẽ gán 'user ' thay vì 'user' vì kiểu dữ liệu được lưu trong database là 5 ký tự
