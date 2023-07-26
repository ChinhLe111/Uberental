Feature: Categories Data

  Rule: Happy paths
    Background:
      When Login to admin
      When Click "QUẢN LÝ DANH MỤC" menu
      When Click "Quản lý dữ liệu" sub menu to "/data"
      When Click "Tạo mới" button
      When Enter "test name" in "Tên loại" with "_RANDOM_"
      When Enter "number" in "Mã" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Success" popup

    Scenario: CA-DA-01 Verify that Add Chuyên mục successfully with enter the data
      When Click on the "Xóa" button in the "_@Tên loại@_" item line
      Then User look message "Success" popup

    Scenario: CA-DA-02 Verify that "Sửa" successfully
      When Click on the "Sửa" button in the "_@Tên loại@_" item line
      When Enter "test name" in "Tên loại" with "_RANDOM_"
      When Enter "number" in "Mã" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Success" popup
      When Click on the "Xóa" button in the "_@Tên loại@_" item line
      Then User look message "Success" popup

    Scenario: CA-DA-03 Verify that "Xóa" successfully
      When Click on the "Xóa" button in the "_@Tên loại@_" item line
      Then User look message "Success" popup

  Rule: Bad paths
    Background:
      When Login to admin
      When Click "QUẢN LÝ DANH MỤC" menu
      When Click "Quản lý dữ liệu" sub menu to "/data"
      When Click "Tạo mới" button

    Scenario: CA-DA-19 Verify when Create Chuyên mục unsuccessfully when leaving all fields blank
      When Click "Lưu lại" button
      Then Required message "Tên loại" displayed under "Xin vui lòng nhập tên loại" field
      Then Required message "Mã" displayed under "Xin vui lòng nhập mã" field

    Scenario: CA-DA-20 Verify when Create Chuyên mục unsuccessfully when leaving fields "Tên loại" blank
      When Enter "number" in "Mã" with "_RANDOM_"
      When Click "Lưu lại" button
      Then Required message "Tên loại" displayed under "Xin vui lòng nhập tên loại" field

    Scenario: CA-DA-21 Verify when Create Chuyên mục unsuccessfully when leaving fields "Mã" blank
      When Enter "text" in "Tên loại" with "_RANDOM_"
      When Click "Lưu lại" button
      Then Required message "Mã" displayed under "Xin vui lòng nhập mã" field

    Scenario: CA-DA-23 Verify when Create Chuyên mục unsuccessfully when "Tên loại" already exist
      When Enter "test name" in "Tên loại" with "_RANDOM_"
      When Enter "number" in "Mã" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Success" popup
      When Click "Tạo mới" button
      When Enter "test name" in "Tên loại" with "_@Tên loại@_"
      When Enter "number" in "Mã" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Tên danh mục đã tồn tại" popup
      When Click "Đóng lại" button
      When Click on the "Xóa" button in the "_@Tên loại@_" item line

    Scenario: CA-DA-24 Verify when Create Chuyên mục unsuccessfully when "Mã" already exist
      When Enter "test name" in "Tên loại" with "_RANDOM_"
      When Enter "number" in "Mã" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Success" popup
      When Click "Tạo mới" button
      When Enter "test name" in "Tên loại" with "_@Tên loại@_"
      When Enter "number" in "Mã" with "_@Mã@_"
      When Click "Lưu lại" button
      Then User look message "Code đã tồn tại" popup
      When Click "Đóng lại" button
      When Click on the "Xóa" button in the "_@Tên loại@_" item line
