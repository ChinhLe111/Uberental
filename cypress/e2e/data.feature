Feature: Data

  Rule: Happy paths
    Background:
      When Login to admin
      When Click "QUẢN LÝ DANH MỤC" menu
      When Click "Quản lý dữ liệu" sub menu to "/data"
      When Click "Thêm mới dữ liệu" button
      When Click select "Chuyên mục" with "Danh mục 12"
      When Enter "number" in "Thứ tự" with "_RANDOM_"
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
      When Enter "paragraph" in textarea "Nội dung" with "_RANDOM_"
      When Select file in "Ảnh số 1" with "image.jpg"
      When Select file in "Ảnh số 2" with "image.jpg"
      When Select file in "Ảnh số 3" with "image.jpg"
      When Select file in "Ảnh số 4" with "image.jpg"
      When Click "Lưu lại" button

    Scenario: DA-01 Verify that Add New successfully with enter the data
      Then User look message "Success" popup
      When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

    Scenario: DA-02 Verify that add successfully with enter "Tiêu đề" and "Chuyên mục"
      Then User look message "Success" popup
      When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
      When Click "Thêm mới dữ liệu" button
      When Click select "Chuyên mục" with "Danh mục 12"
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Success" popup
      When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

    Scenario: DA-03 Verify that edit successfully
      When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Cập nhật thành công" popup
      When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

    Scenario: DA-06 Verify that "Xóa" successfully
      Then User look message "Success" popup
      When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

  Rule: Bad paths
    Background:
      When Login to admin
      When Click "QUẢN LÝ DANH MỤC" menu
      When Click "Quản lý dữ liệu" sub menu to "/data"

    Scenario: DA-09 Verify when Create Data unsuccessfully when leaving all fields blank
      When Click "Thêm mới dữ liệu" button
      When Click "Lưu lại" button
      Then Required message "Chuyên mục" displayed under "Xin vui lòng chọn chuyên mục" field
      Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field

    Scenario: DA-10 Verify when Create Post unsuccessfully when leaving Categories fields blank
      When Click "Thêm mới dữ liệu" button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Click "Lưu lại" button
      Then Required message "Chuyên mục" displayed under "Xin vui lòng chọn chuyên mục" field

    Scenario: DA-11 Verify when Create Post unsuccessfully when leaving "Tiêu đề" fields blank
      When Click "Thêm mới dữ liệu" button
      When Click select "Chuyên mục" with "Danh mục 12"
      When Click "Lưu lại" button
      Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field

    Scenario: DA-15 Verify when Create Post unsuccessfully when article "Tiêu đề" already exist
      When Click "Thêm mới dữ liệu" button
      When Click select "Chuyên mục" with "Danh mục 12"
      When Enter "number" in "Thứ tự" with "_RANDOM_"
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Success" popup
      When Click "Thêm mới dữ liệu" button
      When Click select "Chuyên mục" with "Danh mục 12"
      When Enter "test name" in "Tiêu đề" with "_@Tiêu đề@_"
      When Click "Lưu lại" button
      Then User look message "Tiêu đề đã tồn tại" popup
      When Click "Đóng lại" button
      When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

    Scenario: DA-16 Verify when Create Post unsuccessfully when click Cancel
      When Click "Thêm mới dữ liệu" button
      When Click select "Chuyên mục" with "Danh mục 12"
      When Enter "number" in "Thứ tự" with "_RANDOM_"
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
      When Enter "paragraph" in textarea "Nội dung" with "_RANDOM_"
      When Click "Đóng lại" button
