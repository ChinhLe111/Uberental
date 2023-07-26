*** Settings ***
Resource                ../keywords/common.robot
Test Setup              Setup
Test Teardown           Tear Down

*** Test Cases ***
CA_PO_01 Verify when Create menu successfully
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
  Then User look message "Đã xóa thành công" popup

CA_PO_02 Verify that Add categories successfully with do no enter slug
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
  Then User look message "Đã xóa thành công" popup
  When Click "Tạo mới" button
  When Enter "test name" in "Tiêu đề" with "_RANDOM_"
  When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Thêm mới danh mục bài viết thành công" popup
  When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
  Then User look message "Đã xóa thành công" popup

CA_PO_03 Verify that Add categories successfully with enter data "Tiêu đề"
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
  Then User look message "Đã xóa thành công" popup
  When Click "Tạo mới" button
  When Enter "test name" in "Tiêu đề" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Thêm mới danh mục bài viết thành công" popup
  When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
  Then User look message "Đã xóa thành công" popup

CA_PO_04 Verify that edit successfully
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the "Sửa" button in the "_@Tiêu đề@_" item line
  When Wait Until Element Spin
  When Enter "test name" in "Tiêu đề" with "_RANDOM_"
  When Enter "text" in "Slug" with "_RANDOM_"
  When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Cập nhật bài viết thành công" popup
  When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
  Then User look message "Đã xóa thành công" popup

CA_PO_05 Verify that "Xóa" successfully
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
  Then User look message "Đã xóa thành công" popup

CA_PO_06 Verify when Create Categories unsuccessfully when leaving all fields blank
  [Tags]                @smoketest               @regression
  When Go to page create category post
  When Click "Lưu lại" button
  Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field

CA_PO_07 Verify when Create Categories unsuccessfully when leaving fields "Tiêu đề" blank
  [Tags]                @smoketest               @regression
  When Go to page create category post
  When Enter "text" in "Slug" with "_RANDOM_"
  When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
  When Click "Lưu lại" button
  Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field

CA_PO_08 Verify when Create Categories unsuccessfully when click Đóng lại
  [Tags]                @smoketest               @regression
  When Go to page create category post
  When Enter "test name" in "Tiêu đề" with "_RANDOM_"
  When Enter "text" in "Slug" with "_RANDOM_"
  When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
  When Click "Đóng lại" button

CA_PO_09 Verify when Create Categories unsuccessfully when "Tiêu đề" already exist
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click "Tạo mới" button
  When Enter "test name" in "Tiêu đề" with "_@Tiêu đề@_"
  When Enter "text" in "Slug" with "_RANDOM_"
  When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Tiêu đề đã tồn tại" popup
  When Click "Trở lại" button
  When Click on the "Xóa" button in the "_@Tiêu đề@_" item line
  Then User look message "Đã xóa thành công" popup

*** Keywords ***
Go to page create category post
  When Login to admin
  When Click "QUẢN LÝ DANH MỤC" menu
  When Click "Post" sub menu to "/post"
  When Click "Tạo mới" button

Background Happy paths
  When Go to page create category post
  When Enter "test name" in "Tiêu đề" with "_RANDOM_"
  When Enter "text" in "Slug" with "_RANDOM_"
  When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Thêm mới danh mục bài viết thành công" popup
