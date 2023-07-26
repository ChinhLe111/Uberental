*** Settings ***
Resource                ../keywords/common.robot
Test Setup              Setup
Test Teardown           Tear Down

*** Test Cases ***
CA-DA-01 Verify that Add Chuyên mục successfully with enter the data
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the "Xóa" button in the "_@Tên loại@_" item line
  Then User look message "Success" popup

CA-DA-02 Verify that "Sửa" successfully
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the "Sửa" button in the "_@Tên loại@_" item line
  When Wait Until Element Spin
  When Enter "test name" in "Tên loại" with "_RANDOM_"
  When Enter "number" in "Mã" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Success" popup
  When Click on the "Xóa" button in the "_@Tên loại@_" item line
  Then User look message "Success" popup

CA-DA-03 Verify that "Xóa" successfully
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the "Xóa" button in the "_@Tên loại@_" item line
  Then User look message "Success" popup

CA-DA-19 Verify when Create Chuyên mục unsuccessfully when leaving all fields blank
  [Tags]                @smoketest               @regression
  When Go to page create data
  When Click "Lưu lại" button
  Then Required message "Tên loại" displayed under "Xin vui lòng nhập tên loại" field
  Then Required message "Mã" displayed under "Xin vui lòng nhập mã" field

CA-DA-20 Verify when Create Chuyên mục unsuccessfully when leaving fields "Tên loại" blank
  [Tags]                @smoketest               @regression
  When Go to page create data
  When Enter "number" in "Mã" with "_RANDOM_"
  When Click "Lưu lại" button
  Then Required message "Tên loại" displayed under "Xin vui lòng nhập tên loại" field

CA-DA-21 Verify when Create Chuyên mục unsuccessfully when leaving fields "Mã" blank
  [Tags]                @smoketest               @regression
  When Go to page create data
  When Enter "text" in "Tên loại" with "_RANDOM_"
  When Click "Lưu lại" button
  Then Required message "Mã" displayed under "Xin vui lòng nhập mã" field

CA-DA-23 Verify when Create Chuyên mục unsuccessfully when "Tên loại" already exist
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click "Tạo mới" button
  When Enter "test name" in "Tên loại" with "_@Tên loại@_"
  When Enter "number" in "Mã" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Tên danh mục đã tồn tại" popup
  When Click "Đóng lại" button
  When Click on the "Xóa" button in the "_@Tên loại@_" item line

CA-DA-24 Verify when Create Chuyên mục unsuccessfully when "Mã" already exist
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click "Tạo mới" button
  When Enter "test name" in "Tên loại" with "_@Tên loại@_"
  When Enter "number" in "Mã" with "_@Mã@_"
  When Click "Lưu lại" button
  Then User look message "Code đã tồn tại" popup
  When Click "Đóng lại" button
  When Click on the "Xóa" button in the "_@Tên loại@_" item line

*** Keywords ***
Go to page create data
  When Login to admin
  When Click "QUẢN LÝ DANH MỤC" menu
  When Click "Quản lý dữ liệu" sub menu to "/data"
  When Click "Tạo mới" button

Background Happy paths
  When Go to page create data
  When Enter "test name" in "Tên loại" with "_RANDOM_"
  When Enter "number" in "Mã" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Success" popup
