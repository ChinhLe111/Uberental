*** Settings ***
Resource                ../keywords/common.robot

*** Test Cases ***
Verify create account when inputting valid data into all fields
  [Tags]                @smoketest               @regression
  [Template]            Verify create account when inputting valid data into all fields
  IA_16 Verify create account when inputting valid data into all fields              Tài khoản Nội bộ        /internal-account   CSKH
  CA_16 Verify create account when inputting valid data into all fields              Tài khoản Khách hàng    /customer-account   Farmer Side

Verify "Sửa" when "Sửa" valid all fields
  [Tags]                @smoketest               @regression
  [Template]            Verify "Sửa" when "Sửa" valid all fields
  IA_21 Verify "Sửa" when "Sửa" valid all fields                Tài khoản Nội bộ        /internal-account   CSKH
  CA_21 Verify "Sửa" when "Sửa" valid all fields                Tài khoản Khách hàng    /customer-account   Farmer Side

Verify Change "Mật khẩu" when inputting valid data into all fields
  [Tags]                @smoketest               @regression
  [Template]            Verify Change "Mật khẩu" when inputting valid data into all fields
  IA_17 Verify Change "Mật khẩu" when inputting valid data into all fields               Tài khoản Nội bộ        /internal-account   CSKH
  CA_17 Verify Change "Mật khẩu" when inputting valid data into all fields               Tài khoản Khách hàng    /customer-account   Farmer Side

Verify item when clicking icon "Xóa" of item
  [Tags]                @smoketest               @regression
  [Template]            Verify item when clicking icon "Xóa" of item
  IA_19 Verify item when clicking icon "Xóa" of item    Tài khoản Nội bộ        /internal-account   CSKH
  CA_19 Verify item when clicking icon "Xóa" of item    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify detail when clicking OK button of popup
  [Tags]                @smoketest               @regression
  [Template]            Verify detail when clicking OK button of popup
  IA_26 Verify detail when clicking OK button of popup      Tài khoản Nội bộ        /internal-account   CSKH
  CA_26 Verify detail when clicking OK button of popup      Tài khoản Khách hàng    /customer-account   Farmer Side

Verify when unlock Account successful
  [Tags]                @smoketest               @regression
  [Template]            Verify when unlock Account successful
  IA_47 Verify when unlock Internal Account successful    Tài khoản Nội bộ        /internal-account   CSKH
  CA_47 Verify when unlock Customer Account successful    Tài khoản Khách hàng    /customer-account   Farmer Side


###  -----  Bad paths  -----  ###
Verify create account when leaving "Họ và tên" field blank and inputting valid into remaining fields
  [Tags]                @smoketest               @regression
  [Template]            Verify create account when leaving "Họ và tên" field blank and inputting valid into remaining fields
  IA_28 Verify create account when leaving "Họ và tên" field blank and inputting valid into remaining fields    Tài khoản Nội bộ        /internal-account   CSKH
  CA_28 Verify create account when leaving "Họ và tên" field blank and inputting valid into remaining fields    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify create account when leaving "Email" field blank and inputting valid into remaining fields
  [Tags]                @smoketest               @regression
  [Template]            Verify create account when leaving "Email" field blank and inputting valid into remaining fields
  IA_29 Verify create account when leaving "Email" field blank and inputting valid into remaining fields    Tài khoản Nội bộ        /internal-account   CSKH
  CA_29 Verify create account when leaving "Email" field blank and inputting valid into remaining fields    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify when create account unsuccessful because entered invalid email in Email field
  [Tags]                @smoketest               @regression
  [Template]            Verify when create account unsuccessful because entered invalid email in Email field
  IA_30 Verify when create account unsuccessful because entered invalid email in Email field    Tài khoản Nội bộ        /internal-account   CSKH
  CA_30 Verify when create account unsuccessful because entered invalid email in Email field    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify create account when leaving "Số điện thoại" field blank and inputting valid into remaining fields
  [Tags]                @smoketest               @regression
  [Template]            Verify create account when leaving "Số điện thoại" field blank and inputting valid into remaining fields
  IA_31 Verify create account when leaving "Số điện thoại" field blank and inputting valid into remaining fields    Tài khoản Nội bộ        /internal-account   CSKH
  CA_31 Verify create account when leaving "Số điện thoại" field blank and inputting valid into remaining fields    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify create account when leaving "Giới tính" field blank and inputting valid into remaining fields
  [Tags]                @smoketest               @regression
  [Template]            Verify create account when leaving "Giới tính" field blank and inputting valid into remaining fields
  IA_32 Verify create account when leaving "Giới tính" field blank and inputting valid into remaining fields    Tài khoản Nội bộ        /internal-account   CSKH
  CA_32 Verify create account when leaving "Giới tính" field blank and inputting valid into remaining fields    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify create account when leaving "Loại tài khoản" field blank and inputting valid into remaining fields
  [Tags]                @smoketest               @regression
  [Template]            Verify create account when leaving "Loại tài khoản" field blank and inputting valid into remaining fields
  IA_33 Verify create account when leaving "Loại tài khoản" field blank and inputting valid into remaining fields    Tài khoản Nội bộ        /internal-account   CSKH
  CA_33 Verify create account when leaving "Loại tài khoản" field blank and inputting valid into remaining fields    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify create account when leaving "Mật khẩu" field blank and inputting valid into remaining fields
  [Tags]                @smoketest               @regression
  [Template]            Verify create account when leaving "Mật khẩu" field blank and inputting valid into remaining fields
  IA_34 Verify create account when leaving "Mật khẩu" field blank and inputting valid into remaining fields    Tài khoản Nội bộ        /internal-account   CSKH
  CA_34 Verify create account when leaving "Mật khẩu" field blank and inputting valid into remaining fields    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify create account when leaving "Xác nhận mật khẩu" field blank and inputting valid into remaining fields
  [Tags]                @smoketest               @regression
  [Template]            Verify create account when leaving "Xác nhận mật khẩu" field blank and inputting valid into remaining fields
  IA_35 Verify create account when leaving "Xác nhận mật khẩu" field blank and inputting valid into remaining fields    Tài khoản Nội bộ        /internal-account   CSKH
  CA_35 Verify create account when leaving "Xác nhận mật khẩu" field blank and inputting valid into remaining fields    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify create account when inputting "Mật khẩu" and confirmation "Mật khẩu" do not match
  [Tags]                @smoketest               @regression
  [Template]            Verify create account when inputting "Mật khẩu" and confirmation "Mật khẩu" do not match
  IA_36 Verify create account when inputting "Mật khẩu" and confirmation "Mật khẩu" do not match    Tài khoản Nội bộ        /internal-account   CSKH
  CA_36 Verify create account when inputting "Mật khẩu" and confirmation "Mật khẩu" do not match    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify create account when leaving all fields
  [Tags]                @smoketest               @regression
  [Template]            Verify create account when leaving all fields
  IA_27 Verify create account when leaving all fields    Tài khoản Nội bộ        /internal-account   CSKH
  CA_27 Verify create account when leaving all fields    Tài khoản Khách hàng    /customer-account   Farmer Side

###  -----  Compare paths  -----  ###
Verify Change "Mật khẩu" when inputting "Mật khẩu" and confirmation "Mật khẩu" do not match
  [Tags]                @smoketest               @regression
  [Template]            Verify Change "Mật khẩu" when inputting "Mật khẩu" and confirmation "Mật khẩu" do not match
  IA_41 Verify Change "Mật khẩu" when inputting "Mật khẩu" and confirmation "Mật khẩu" do not match    Tài khoản Nội bộ        /internal-account   CSKH
  CA_41 Verify Change "Mật khẩu" when inputting "Mật khẩu" and confirmation "Mật khẩu" do not match    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify when change password unsuccessful because leaving Confirm password field
  [Tags]                @smoketest               @regression
  [Template]            Verify when change password unsuccessful because leaving Confirm password field
  IA_44 Verify when change password unsuccessful because leaving Confirm password field    Tài khoản Nội bộ        /internal-account   CSKH
  CA_44 Verify when change password unsuccessful because leaving Confirm password field    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify Change "Mật khẩu" when leaving all fields blank
  [Tags]                @smoketest               @regression
  [Template]            Verify Change "Mật khẩu" when leaving all fields blank
  IA_40 Verify Change "Mật khẩu" when leaving all fields blank    Tài khoản Nội bộ        /internal-account   CSKH
  CA_40 Verify Change "Mật khẩu" when leaving all fields blank    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify "Sửa" when deleting data in "Họ và tên" field
  [Tags]                @smoketest               @regression
  [Template]            Verify "Sửa" when deleting data in "Họ và tên" field
  IA_45 Verify "Sửa" when deleting data in "Họ và tên" field    Tài khoản Nội bộ        /internal-account   CSKH
  CA_45 Verify "Sửa" when deleting data in "Họ và tên" field    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify "Sửa" when deleting data in "Số điện thoại" field
  [Tags]                @smoketest               @regression
  [Template]            Verify "Sửa" when deleting data in "Số điện thoại" field
  IA_46 Verify "Sửa" when deleting data in "Số điện thoại" field    Tài khoản Nội bộ        /internal-account   CSKH
  CA_46 Verify "Sửa" when deleting data in "Số điện thoại" field    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify when create Account unsuccessful because same Email
  [Tags]                @smoketest               @regression
  [Template]            Verify when create Account unsuccessful because same Email
  IA_38 Verify when create Account unsuccessful because same Email    Tài khoản Nội bộ        /internal-account   CSKH
  CA_38 Verify when create Account unsuccessful because same Email    Tài khoản Khách hàng    /customer-account   Farmer Side

Verify when create Account unsuccessful because same Phone Number
  [Tags]                @smoketest               @regression
  [Template]            Verify when create Account unsuccessful because same Phone Number
  IA_39 Verify when create Account unsuccessful because same Phone Number    Tài khoản Nội bộ        /internal-account   CSKH
  CA_39 Verify when create Account unsuccessful because same Phone Number    Tài khoản Khách hàng    /customer-account   Farmer Side

*** Keywords ***
Go to page create account ${name} with ${url}
  When Setup
  When Login to admin
  When Click "QUẢN LÝ TÀI KHOẢN" menu
  When Click "${name}" sub menu to "${url}"
  When Click "Tạo mới" button

Background ${type} Happy paths ${name} with ${url}
  When Go to page create account ${name} with ${url}
  When Enter "test name" in "Họ và tên" with "_RANDOM_"
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "phone" in "Số điện thoại" with "_RANDOM_"
  When Click select "Giới tính" with "Nữ"
  When Click select "Loại tài khoản" with "${type}"
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  When Enter "text" in "Xác nhận mật khẩu" with "_@Mật khẩu@_"
  When Click "Lưu lại" button

Verify create account when inputting valid data into all fields
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Background ${type} Happy paths ${name} with ${url}
  Then User look message "Tạo tài khoản thành công" popup
  When Click on the "Xóa" button in the "_@Họ và tên@_" table line
  When Tear Down

Verify "Sửa" when "Sửa" valid all fields
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Background ${type} Happy paths ${name} with ${url}
  Then User look message "Tạo tài khoản thành công" popup
  When Click on the "Sửa" button in the "_@Họ và tên@_" table line
  When Wait Until Element Spin
  When Enter "test name" in "Họ và tên" with "_RANDOM_"
  When Click select "Giới tính" with "Nam"
  When Enter "phone" in "Số điện thoại" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Chỉnh sửa tài khoản thành công" popup
  When Click on the "Xóa" button in the "_@Họ và tên@_" table line
  When Tear Down

Verify Change "Mật khẩu" when inputting valid data into all fields
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Background ${type} Happy paths ${name} with ${url}
  Then User look message "Tạo tài khoản thành công" popup
  When Click on the "Đổi mật khẩu" button in the "_@Họ và tên@_" table line
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  When Enter "text" in "Xác nhận mật khẩu" with "_@Mật khẩu@_"
  When Click "Lưu lại" button
  Then User look message "Đổi mật khẩu thành công" popup
  When Click on the "Xóa" button in the "_@Họ và tên@_" table line
  When Tear Down

Verify item when clicking icon "Xóa" of item
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Background ${type} Happy paths ${name} with ${url}
  Then User look message "Tạo tài khoản thành công" popup
  When Click on the "Xóa" button in the "_@Họ và tên@_" table line
  When Tear Down

Verify detail when clicking OK button of popup
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Background ${type} Happy paths ${name} with ${url}
  Then User look message "Tạo tài khoản thành công" popup
  When Click on the "Chi tiết" button in the "_@Họ và tên@_" table line
  When Click "Mở Khóa" button
  Then User look message "Khóa tài khoản người dùng thành công !" popup
  When Click "Trở lại" button
  Then Click on the "Xóa" button in the "_@Họ và tên@_" table line
  When Tear Down

Verify when unlock Account successful
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Background ${type} Happy paths ${name} with ${url}
  Then User look message "Tạo tài khoản thành công" popup
  When Click on the "Chi tiết" button in the "_@Họ và tên@_" table line
  When Click "Mở Khóa" button
  Then User look message "Khóa tài khoản người dùng thành công !" popup
  When Click "Khóa" button
  Then User look message "Mở khóa tài khoản người dùng thành công." popup
  When Click "Trở lại" button
  Then Click on the "Xóa" button in the "_@Họ và tên@_" table line
  When Tear Down

###  -----  Bad paths  -----  ###
Verify create account when leaving "Họ và tên" field blank and inputting valid into remaining fields
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Go to page create account ${name} with ${url}
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "phone" in "Số điện thoại" with "_RANDOM_"
  When Click select "Giới tính" with "Nữ"
  When Click select "Loại tài khoản" with "${type}"
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  When Enter "text" in "Xác nhận mật khẩu" with "_@Mật khẩu@_"
  When Click "Lưu lại" button
  Then Required message "Họ và tên" displayed under "Xin vui lòng nhập họ và tên" field
  When Tear Down

Verify create account when leaving "Email" field blank and inputting valid into remaining fields
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Go to page create account ${name} with ${url}
  When Enter "test name" in "Họ và tên" with "_RANDOM_"
  When Enter "phone" in "Số điện thoại" with "_RANDOM_"
  When Click select "Giới tính" with "Nữ"
  When Click select "Loại tài khoản" with "${type}"
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  When Enter "text" in "Xác nhận mật khẩu" with "_@Mật khẩu@_"
  When Click "Lưu lại" button
  Then Required message "Email" displayed under "Xin vui lòng nhập email" field
  When Tear Down

Verify when create account unsuccessful because entered invalid email in Email field
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Go to page create account ${name} with ${url}
  When Enter "test name" in "Họ và tên" with "_RANDOM_"
  When Enter "text" in "Email" with "_RANDOM_"
  When Enter "phone" in "Số điện thoại" with "_RANDOM_"
  When Click select "Giới tính" with "Nữ"
  When Click select "Loại tài khoản" with "${type}"
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  When Enter "text" in "Xác nhận mật khẩu" with "_@Mật khẩu@_"
  When Click "Lưu lại" button
  Then Required message "Email" displayed under "Xin vui lòng nhập địa chỉ email hợp lệ!" field
  When Tear Down

Verify create account when leaving "Số điện thoại" field blank and inputting valid into remaining fields
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Go to page create account ${name} with ${url}
  When Enter "test name" in "Họ và tên" with "_RANDOM_"
  When Enter "email" in "Email" with "_RANDOM_"
  When Click select "Giới tính" with "Nữ"
  When Click select "Loại tài khoản" with "${type}"
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  When Enter "text" in "Xác nhận mật khẩu" with "_@Mật khẩu@_"
  When Click "Lưu lại" button
  Then Required message "Số điện thoại" displayed under "Xin vui lòng nhập số điện thoại" field
  When Tear Down

Verify create account when leaving "Giới tính" field blank and inputting valid into remaining fields
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Go to page create account ${name} with ${url}
  When Enter "test name" in "Họ và tên" with "_RANDOM_"
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "phone" in "Số điện thoại" with "_RANDOM_"
  When Click select "Loại tài khoản" with "${type}"
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  When Enter "text" in "Xác nhận mật khẩu" with "_@Mật khẩu@_"
  When Click "Lưu lại" button
  Then Required message "Giới tính" displayed under "Xin vui lòng chọn giới tính" field
  When Tear Down

Verify create account when leaving "Loại tài khoản" field blank and inputting valid into remaining fields
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Go to page create account ${name} with ${url}
  When Enter "test name" in "Họ và tên" with "_RANDOM_"
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "phone" in "Số điện thoại" with "_RANDOM_"
  When Click select "Giới tính" with "Nữ"
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  When Enter "text" in "Xác nhận mật khẩu" with "_@Mật khẩu@_"
  When Click "Lưu lại" button
  Then Required message "Loại tài khoản" displayed under "Xin vui lòng chọn loại tài khoản" field
  When Tear Down

Verify create account when leaving "Mật khẩu" field blank and inputting valid into remaining fields
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Go to page create account ${name} with ${url}
  When Enter "test name" in "Họ và tên" with "_RANDOM_"
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "phone" in "Số điện thoại" with "_RANDOM_"
  When Click select "Giới tính" with "Nữ"
  When Click select "Loại tài khoản" with "${type}"
  When Enter "text" in "Xác nhận mật khẩu" with "_RANDOM_"
  When Click "Lưu lại" button
  Then Required message "Mật khẩu" displayed under "Xin vui lòng nhập mật khẩu" field
  When Tear Down

Verify create account when leaving "Xác nhận mật khẩu" field blank and inputting valid into remaining fields
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Go to page create account ${name} with ${url}
  When Enter "test name" in "Họ và tên" with "_RANDOM_"
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "phone" in "Số điện thoại" with "_RANDOM_"
  When Click select "Giới tính" with "Nữ"
  When Click select "Loại tài khoản" with "${type}"
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  When Click "Lưu lại" button
  Then Required message "Xác nhận mật khẩu" displayed under "Xin vui lòng nhập xác nhận mật khẩu" field
  When Tear Down

Verify create account when inputting "Mật khẩu" and confirmation "Mật khẩu" do not match
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Go to page create account ${name} with ${url}
  When Enter "test name" in "Họ và tên" with "_RANDOM_"
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "phone" in "Số điện thoại" with "_RANDOM_"
  When Click select "Giới tính" with "Nữ"
  When Click select "Loại tài khoản" with "${type}"
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  When Enter "text" in "Xác nhận mật khẩu" with "_RANDOM_"
  When Click "Lưu lại" button
  Then Required message "Xác nhận mật khẩu" displayed under "Mật khẩu và mật khẩu xác nhận không khớp" field
  When Tear Down

Verify create account when leaving all fields
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Go to page create account ${name} with ${url}
  When Click "Lưu lại" button
  Then Required message "Họ và tên" displayed under "Xin vui lòng nhập họ và tên" field
  Then Required message "Email" displayed under "Xin vui lòng nhập email" field
  Then Required message "Giới tính" displayed under "Xin vui lòng chọn giới tính" field
  Then Required message "Số điện thoại" displayed under "Xin vui lòng nhập số điện thoại" field
  Then Required message "Loại tài khoản" displayed under "Xin vui lòng chọn loại tài khoản" field
  Then Required message "Mật khẩu" displayed under "Xin vui lòng nhập mật khẩu" field
  When Tear Down

###  -----  Compare paths  -----  ###
Verify Change "Mật khẩu" when inputting "Mật khẩu" and confirmation "Mật khẩu" do not match
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Background ${type} Happy paths ${name} with ${url}
  When Click on the "Đổi mật khẩu" button in the "_@Họ và tên@_" table line
  When Enter "text" in "Xác nhận mật khẩu" with "_RANDOM_"
  When Click "Lưu lại" button
  Then Required message "Mật khẩu" displayed under "Xin vui lòng nhập mật khẩu" field
  Then Required message "Xác nhận mật khẩu" displayed under "Mật khẩu và mật khẩu xác nhận không khớp" field
  When Click "Đóng lại" button
  Then Click on the "Xóa" button in the "_@Họ và tên@_" table line
  When Tear Down

Verify when change password unsuccessful because leaving Confirm password field
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Background ${type} Happy paths ${name} with ${url}
  When Click on the "Đổi mật khẩu" button in the "_@Họ và tên@_" table line
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  When Click "Lưu lại" button
  Then Required message "Xác nhận mật khẩu" displayed under "Xin vui lòng nhập xác nhận mật khẩu" field
  When Click "Đóng lại" button
  Then Click on the "Xóa" button in the "_@Họ và tên@_" table line
  When Tear Down

Verify Change "Mật khẩu" when leaving all fields blank
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Background ${type} Happy paths ${name} with ${url}
  When Click on the "Đổi mật khẩu" button in the "_@Họ và tên@_" table line
  When Click "Lưu lại" button
  Then Required message "Mật khẩu" displayed under "Xin vui lòng nhập mật khẩu" field
  Then Required message "Xác nhận mật khẩu" displayed under "Xin vui lòng nhập xác nhận mật khẩu" field
  When Click "Đóng lại" button
  Then Click on the "Xóa" button in the "_@Họ và tên@_" table line
  When Tear Down

Verify "Sửa" when deleting data in "Họ và tên" field
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Background ${type} Happy paths ${name} with ${url}
  Then User look message "Tạo tài khoản thành công" popup
  When Click on the "Sửa" button in the "_@Họ và tên@_" table line
  When Wait Until Element Spin
  When Enter "test name" in "Họ và tên" with ""
  When Click "Lưu lại" button
  Then Required message "Họ và tên" displayed under "Xin vui lòng nhập họ và tên" field
  When Click "Đóng lại" button
  Then Click on the "Xóa" button in the "_@Họ và tên@_" table line
  When Tear Down

Verify "Sửa" when deleting data in "Số điện thoại" field
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Background ${type} Happy paths ${name} with ${url}
  Then User look message "Tạo tài khoản thành công" popup
  When Click on the "Sửa" button in the "_@Họ và tên@_" table line
  When Wait Until Element Spin
  When Enter "text" in "Số điện thoại" with ""
  When Click "Lưu lại" button
  Then Required message "Số điện thoại" displayed under "Xin vui lòng nhập số điện thoại" field
  When Click "Đóng lại" button
  Then Click on the "Xóa" button in the "_@Họ và tên@_" table line
  When Tear Down

Verify when create Account unsuccessful because same Email
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Background ${type} Happy paths ${name} with ${url}
  Then User look message "Tạo tài khoản thành công" popup
  When Click "Tạo mới" button
  When Enter "test name" in "Họ và tên" with "_@Họ và tên@_"
  When Enter "email" in "Email" with "_@Email@_"
  When Enter "phone" in "Số điện thoại" with "_RANDOM_"
  When Click select "Giới tính" with "Nữ"
  When Click select "Loại tài khoản" with "${type}"
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  When Enter "text" in "Xác nhận mật khẩu" with "_@Mật khẩu@_"
  When Click "Lưu lại" button
  Then User look message "Tên người dùng/Email đã được sử dụng." popup
  When Click "Đóng lại" button
  Then Click on the "Xóa" button in the "_@Họ và tên@_" table line
  When Tear Down

Verify when create Account unsuccessful because same Phone Number
  [Arguments]           ${code}       ${name}   ${url}      ${type}
  Set Global Variable   ${TEST NAME}  ${code}
  When Background ${type} Happy paths ${name} with ${url}
  Then User look message "Tạo tài khoản thành công" popup
  When Click "Tạo mới" button
  When Enter "test name" in "Họ và tên" with "_@Họ và tên@_"
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "phone" in "Số điện thoại" with "_@Số điện thoại@_"
  When Click select "Giới tính" with "Nữ"
  When Click select "Loại tài khoản" with "${type}"
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  When Enter "text" in "Xác nhận mật khẩu" with "_@Mật khẩu@_"
  When Click "Lưu lại" button
  Then User look message "Số điện thoại đã được sử dụng." popup
  When Click "Đóng lại" button
  Then Click on the "Xóa" button in the "_@Họ và tên@_" table line
  When Tear Down
