*** Settings ***
Resource                ../keywords/common.robot
Test Setup              Setup
Test Teardown           Tear Down

*** Test Cases ***
DA-01 Verify that Add New successfully with enter the data
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

DA-02 Verify that add successfully with enter "Tiêu đề" and "Chuyên mục"
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
  When Click "Thêm mới dữ liệu" button
  When Click select "Chuyên mục" with "Danh mục 12"
  When Enter "test name" in "Tiêu đề" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Success" popup
  When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

DA-03 Verify that edit successfully
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
  When Wait Until Element Spin
  When Enter "test name" in "Tiêu đề" with "_RANDOM_"
  When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật thành công" popup
  When Click on the "Xóa" button in the "_@Tiêu đề@_" table line

DA-06 Verify that "Xóa" successfully
  [Tags]                @smoketest               @regression
  When Background Happy paths
  Then User look message "Success" popup
  When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
  Then User look message "Xóa thành công" popup

DA-09 Verify when Create Data unsuccessfully when leaving all fields blank
  [Tags]                @smoketest               @regression
  When Go to page create data
  When Click "Lưu lại" button
  Then Required message "Chuyên mục" displayed under "Xin vui lòng chọn chuyên mục" field
  Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field

DA-10 Verify when Create Post unsuccessfully when leaving Categories fields blank
  [Tags]                @smoketest               @regression
  When Go to page create data
  When Enter "test name" in "Tiêu đề" with "_RANDOM_"
  When Click "Lưu lại" button
  Then Required message "Chuyên mục" displayed under "Xin vui lòng chọn chuyên mục" field

DA-11 Verify when Create Post unsuccessfully when leaving "Tiêu đề" fields blank
  [Tags]                @smoketest               @regression
  When Go to page create data
  When Click select "Chuyên mục" with "Danh mục 12"
  When Click "Lưu lại" button
  Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field

DA-15 Verify when Create Post unsuccessfully when article "Tiêu đề" already exist
  [Tags]                @smoketest               @regression
  When Go to page create data
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

DA-16 Verify when Create Post unsuccessfully when click Cancel
  [Tags]                @smoketest               @regression
  When Go to page create data
  When Click select "Chuyên mục" with "Danh mục 12"
  When Enter "number" in "Thứ tự" with "_RANDOM_"
  When Enter "test name" in "Tiêu đề" with "_RANDOM_"
  When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
  When Enter "paragraph" in textarea "Nội dung" with "_RANDOM_"
  When Click "Đóng lại" button

*** Keywords ***
Go to page create data
  When Login to admin
  When Click "QUẢN LÝ DANH MỤC" menu
  When Click "Quản lý dữ liệu" sub menu to "/data"
  When Click "Thêm mới dữ liệu" button

Background Happy paths
  When Go to page create data
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
  Then User look message "Success" popup
