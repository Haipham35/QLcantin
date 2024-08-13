# QLcantin
* USER:
- xem thống kê chi tiêu hàng tháng, tổng nợ căn tín(nếu có)
    + thông qua bảng hóa đơn - id hóa đơn, id user,id hàng hóa, số tiền, nội dung, ngày tháng, trạng thái- lấy dữ liệu
    + sẽ tổng chi tiêu sẽ là tổng số tiền trong hóa đơn mà người dùng tiêu (tương tự với hàng tháng)
- Đặt suất ăn theo bữa
    + thông qua bảng hóa đơn - người dùng sẽ tạo 1 yêu cầu về đặt món gửi tới admin, admin sẽ phê duyệt yêu cầu và trả lại thông báo về cho ng dùng
- thanh toán
- xem thông báo từ căn tin (nếu có) - 1 dạng tin tức
- đăng nhập/đăng ký
* ADMIN:
- tạo thông báo nếu cần
- Tạo hóa đơn (nợ) Thêm, xóa
    + hóa đơn sẽ có 2 trạng thái: đã thanh toán (thì hóa đơn sẽ không tính và tổng nợ nhưng vẫn tính vào tổng chi user), ghi nợ 
- Tạo User
- Theo dõi số lượng hàng hóa - quản lý nhập hàng
    + bảng hàng hóa - id hàng hóa, tên hàng hóa, số lượng, ngày nhập
    + dựa vào bảng hóa đơn số lượng hàng hóa sẽ được trừ dần bên bảng hàng hóa để => số lượng hàng còn lại với từng loại mặt hàng
- quản lý suất ăn theo từng ngày / bữa
- quản lý thu chi 
- 