Feature: Categories Post

  Rule: Happy paths
    Background:
      When Login to admin
      When Click "QUẢN LÝ DANH MỤC" menu
      When Click "Post" sub menu to "/post"
      When Click "Tạo mới" button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "text" in "Slug" with "_RANDOM_"
      When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Thêm mới danh mục bài viết thành công" popup

    Scenario: CA_PO_01 Verify when Create menu successfully
      When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
      Then User look message "Đã xóa thành công" popup

    Scenario: CA_PO_02 Verify that Add categories successfully with do no enter slug
      When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
      Then User look message "Đã xóa thành công" popup
      When Click "Tạo mới" button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Thêm mới danh mục bài viết thành công" popup
      When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
      Then User look message "Đã xóa thành công" popup

    Scenario: CA_PO_03 Verify that Add categories successfully with enter data "Tiêu đề"
      When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
      Then User look message "Đã xóa thành công" popup
      When Click "Tạo mới" button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Thêm mới danh mục bài viết thành công" popup
      When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
      Then User look message "Đã xóa thành công" popup

    Scenario: CA_PO_04 Verify that edit successfully
      When Click on the "Sửa" button in the "_@Tiêu đề@_" item line
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "text" in "Slug" with "_RANDOM_"
      When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Cập nhật bài viết thành công" popup
      When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
      Then User look message "Đã xóa thành công" popup

    Scenario: CA_PO_05 Verify that "Xóa" successfully
      When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
      Then User look message "Đã xóa thành công" popup

  Rule: Bad paths
    Background:
      When Login to admin
      When Click "QUẢN LÝ DANH MỤC" menu
      When Click "Post" sub menu to "/post"
      When Click "Tạo mới" button

    Scenario: CA_PO_06 Verify when Create Categories unsuccessfully when leaving all fields blank
      When Click "Lưu lại" button
      Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field

    Scenario: CA_PO_07 Verify when Create Categories unsuccessfully when leaving fields "Tiêu đề" blank
      When Enter "text" in "Slug" with "_RANDOM_"
      When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
      When Click "Lưu lại" button
      Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field


  Rule: Compare paths
    Background:
      When Login to admin
      When Click "QUẢN LÝ DANH MỤC" menu
      When Click "Post" sub menu to "/post"
      When Click "Tạo mới" button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "text" in "Slug" with "_RANDOM_"
      When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Thêm mới danh mục bài viết thành công" popup

    Scenario: CA_PO_09 Verify when Create Categories unsuccessfully when "Tiêu đề" already exist
      When Click "Tạo mới" button
      When Enter "test name" in "Tiêu đề" with "_@Tiêu đề@_"
      When Enter "text" in "Slug" with "_RANDOM_"
      When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Tiêu đề đã tồn tại" popup
      When Click "Trở lại" button
      When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
      Then User look message "Đã xóa thành công" popup
