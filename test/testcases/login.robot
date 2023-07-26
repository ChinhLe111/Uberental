*** Settings ***
Resource                ../keywords/common.robot
Test Setup              Setup
Test Teardown           Tear Down

*** Test Cases ***
DN-01 Verify that Đăng nhập successfully with valid Email and Mật khẩu
  [Tags]                @smoketest               @regression
  Then Login to admin

DN-03 Verify that Đăng nhập unsuccessfully with invalid Email
  [Tags]                @smoketest               @regression
  When Enter "email" in "Email" with "_RANDOM_"
  When Enter "text" in "Mật khẩu" with "123123"
  When Click "Đăng nhập" button
  Then User look message "Tài khoản _@Email@_ không tồn tại trong hệ thống. Vui lòng đăng ký mới." popup

DN-04 Verify that Đăng nhập unsuccessfully with invalid Mật khẩu
  [Tags]                @smoketest               @regression
  When Enter "email" in "Email" with "admin@gmail.com"
  When Enter "text" in "Mật khẩu" with "_RANDOM_"
  When Click "Đăng nhập" button
  Then User look message "Sai mật khẩu cho tài khoản _@Email@_" popup

DN-07 Verify that Đăng nhập unsuccessfully because no enter Email and Mật khẩu
  [Tags]                @smoketest               @regression
  When Click "Đăng nhập" button
  Then Required message "Email" displayed under "Xin vui lòng nhập email" field
  Then Required message "Mật khẩu" displayed under "Xin vui lòng nhập mật khẩu" field

DN-05 Verify that Đăng nhập unsuccessfully because no enter Email
  [Tags]                @smoketest               @regression
  When Enter "text" in "Mật khẩu" with "123123"
  When Click "Đăng nhập" button
  Then Required message "Email" displayed under "Xin vui lòng nhập email" field

DN-06 Verify that Đăng nhập unsuccessfully because no enter Password
  [Tags]                @smoketest               @regression
  When Enter "email" in "Email" with "admin@gmail.com"
  When Click "Đăng nhập" button
  Then Required message "Mật khẩu" displayed under "Xin vui lòng nhập mật khẩu" field
