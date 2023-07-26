Feature: Login

  Rule: Happy paths
    Background:
      Given User go to login page

    Scenario: DN-01 Verify that Đăng nhập successfully with valid Email and Mật khẩu
      When Login to admin

  Rule: Bad paths
    Background:
      Given User go to login page

    Scenario: DN-03 Verify that Đăng nhập unsuccessfully with invalid Email
      When Enter "text" in "Email" with "_RANDOM_"
      When Enter "text" in "Mật khẩu" with "123123"
      When Click "Đăng nhập" button
      Then User look message "Tài khoản _@Email@_ không tồn tại trong hệ thống. Vui lòng đăng ký mới." popup

    Scenario: DN-04 Verify that Đăng nhập unsuccessfully with invalid Mật khẩu
      When Enter "text" in "Email" with "admin@gmail.com"
      When Enter "text" in "Mật khẩu" with "_RANDOM_"
      When Click "Đăng nhập" button
      Then User look message "Sai mật khẩu cho tài khoản _@Email@_" popup

    Scenario: DN-07 Verify that Đăng nhập unsuccessfully because no enter Email and Mật khẩu
      When Click "Đăng nhập" button
      Then Required message "Email" displayed under "Xin vui lòng nhập email" field
      Then Required message "Mật khẩu" displayed under "Xin vui lòng nhập mật khẩu" field

    Scenario: DN-05 Verify that Đăng nhập unsuccessfully because no enter Email
      When Enter "text" in "Mật khẩu" with "123123"
      When Click "Đăng nhập" button
      Then Required message "Email" displayed under "Xin vui lòng nhập email" field

    Scenario: DN-06 Verify that Đăng nhập unsuccessfully because no enter Password
      When Enter "text" in "Email" with "admin@gmail.com"
      When Click "Đăng nhập" button
      Then Required message "Mật khẩu" displayed under "Xin vui lòng nhập mật khẩu" field

