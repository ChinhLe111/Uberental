Feature: Parameter

  Rule: Happy paths
    Background:
      When Login to admin
      When Click "SUPERADMIN" menu
      When Click "Cấu hình hệ thống" sub menu to "/parameter"
      When Click "Tạo mới" button
      When Enter "test name" in "Tên tham số" with "_RANDOM_"
      When Enter "text" in "Giá trị tham số" with "_RANDOM_"
      When Enter "text" in "Nhóm" with "Test"
#      When Click switch "Hệ thống" to be activated
      When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
      When Click "Lưu lại" button

    Scenario: CH_01 Verify "Tạo mới" successfully when clicking "Tạo mới" button
      Then User look message "Success" popup
      When Click on the previously created "_@Tên tham số@_" tree to delete

    Scenario: CH_02 Verify edit successfully when clicking item
      Then User look message "Success" popup
      When Click on the previously created "_@Tên tham số@_" tree to edit
      When Enter "test name" in "Tên tham số" with "_RANDOM_"
      When Enter "text" in "Giá trị tham số" with "_RANDOM_"
      When Enter "text" in "Nhóm" with "Test"
      When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Success" popup
      When Click on the previously created "_@Tên tham số@_" tree to delete

    Scenario: CH_03 Verify Delete menu successfully
      Then User look message "Success" popup
      When Click on the previously created "_@Tên tham số@_" tree to delete
      Then User look message "Success" popup

    Scenario: CH_03 Verify delete successfully when clicking item
      Then User look message "Success" popup
      When Click on the previously created "_@Tên tham số@_" tree to delete
      Then User look message "Success" popup
      When Click "Tạo mới" button
      When Enter "test name" in "Tên tham số" with "_RANDOM_"
      When Enter "text" in "Giá trị tham số" with "_RANDOM_""
      When Enter "text" in "Nhóm" with "Test"
      When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
      And Click "Lưu lại" button
      Then User look message "Success" popup
      When Click on the previously created "_@Tên tham số@_" tree to delete
      Then User look message "Success" popup

  Rule: Bad paths
    Background:
      When Login to admin
      When Click "SUPERADMIN" menu
      When Click "Cấu hình hệ thống" sub menu to "/parameter"
      When Click "Tạo mới" button

    Scenario: CH_04 Verify "Tạo mới" unsuccessfully when leaving all fields blank
      And Click "Lưu lại" button
      Then Required message "Tên tham số" displayed under "Xin vui lòng nhập tên tham số" field
      Then Required message "Giá trị tham số" displayed under "Xin vui lòng nhập giá trị tham số" field

    Scenario: CH_05 Verify "Tạo mới" unsuccessfully when leaving "Tên tham số" field
      When Enter "text" in "Giá trị tham số" with "_RANDOM_""
      When Enter "text" in "Nhóm" with "Test"
      When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
      And Click "Lưu lại" button
      Then Required message "Tên tham số" displayed under "Xin vui lòng nhập tên tham số" field

    Scenario: CH_06 Verify "Tạo mới" unsuccessfully when leaving "Giá trị tham số" field
      When Enter "test name" in "Tên tham số" with "_RANDOM_""
      When Enter "text" in "Nhóm" with "Test"
      When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
      And Click "Lưu lại" button
      Then Required message "Giá trị tham số" displayed under "Xin vui lòng nhập giá trị tham số" field

  Rule: Compare paths
    Background:
      When Login to admin
      When Click "SUPERADMIN" menu
      When Click "Cấu hình hệ thống" sub menu to "/parameter"
      When Click "Tạo mới" button
      When Enter "test name" in "Tên tham số" with "_RANDOM_"
      When Enter "text" in "Giá trị tham số" with "_RANDOM_"
      When Enter "text" in "Nhóm" with "Test"
#      When Click switch "Hệ thống" to be activated
      When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Success" popup

    Scenario: CH_08 Verify when creating menu unsuccessfully when clicking Notification of Content Check Management then clicking on add new button
      When Click on the previously created "_@Tên tham số@_" tree to edit
      When Click "Tạo mới" button
      And Click "Lưu lại" button
      Then Required message "Tên tham số" displayed under "Xin vui lòng nhập tên tham số" field
      Then Required message "Giá trị tham số" displayed under "Xin vui lòng nhập giá trị tham số" field
      When Click on the previously created "_@Tên tham số@_" tree to delete

    Scenario: PR_9 Verify when navigation unsuccessfully when editing navigation
      When Click on the previously created "_@Tên tham số@_" tree to edit
      When Enter "test name" in "Tên tham số" with ""
      When Enter "text" in "Giá trị tham số" with ""
      When Enter "text" in "Nhóm" with ""
      When Enter "paragraph" in textarea "Ghi chú" with ""
      When Click "Lưu lại" button
      Then Required message "Tên tham số" displayed under "Xin vui lòng nhập tên tham số" field
      Then Required message "Giá trị tham số" displayed under "Xin vui lòng nhập giá trị tham số" field
      When Click on the previously created "_@Tên tham số@_" tree to delete

