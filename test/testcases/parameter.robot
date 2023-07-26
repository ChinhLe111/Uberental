*** Settings ***
Resource                ../keywords/common.robot
Test Setup              Setup
Test Teardown           Tear Down

*** Test Cases ***
CH_01 Verify "Tạo mới" successfully when clicking "Tạo mới" button
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the previously created "_@Tên tham số@_" tree to delete
  Then User look message "Success" popup

CH_02 Verify edit successfully when clicking item
  [Tags]                @smoketest               @regression
  When Background Happy paths
  Then User look message "Success" popup
  When Click on the previously created "_@Tên tham số@_" tree to edit
  When Enter "test name" in "Tên tham số" with "_RANDOM_"
  When Enter "text" in "Giá trị tham số" with "_RANDOM_"
  When Enter "text" in "Nhóm" with "Test"
  When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Success" popup
  When Click on the previously created "_@Tên tham số@_" tree to delete

CH_03 Verify delete successfully when clicking item
  [Tags]                @smoketest               @regression
  When Background Happy paths
  Then User look message "Success" popup
  When Click on the previously created "_@Tên tham số@_" tree to delete
  Then User look message "Success" popup

PR-04 Verify when Create menu successfully with off button System
  [Tags]                @smoketest               @regression
  When Background Happy paths
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

CH_04 Verify "Tạo mới" unsuccessfully when leaving all fields blank
  [Tags]                @smoketest               @regression
  When Go to page create data
  And Click "Lưu lại" button
  Then Required message "Tên tham số" displayed under "Xin vui lòng nhập tên tham số" field
  Then Required message "Giá trị tham số" displayed under "Xin vui lòng nhập giá trị tham số" field

CH_05 Verify "Tạo mới" unsuccessfully when leaving "Tên tham số" field
  [Tags]                @smoketest               @regression
  When Go to page create data
  When Enter "text" in "Giá trị tham số" with "_RANDOM_""
  When Enter "text" in "Nhóm" with "Test"
  When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
  And Click "Lưu lại" button
  Then Required message "Tên tham số" displayed under "Xin vui lòng nhập tên tham số" field

CH_06 Verify "Tạo mới" unsuccessfully when leaving "Giá trị tham số" field
  [Tags]                @smoketest               @regression
  When Go to page create data
  When Enter "test name" in "Tên tham số" with "_RANDOM_""
  When Enter "text" in "Nhóm" with "Test"
  When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
  And Click "Lưu lại" button
  Then Required message "Giá trị tham số" displayed under "Xin vui lòng nhập giá trị tham số" field

CH_08 Verify when creating menu unsuccessfully when clicking Notification of Content Check Management then clicking on add new button
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the previously created "_@Tên tham số@_" tree to edit
  When Click "Tạo mới" button
  And Click "Lưu lại" button
  Then Required message "Tên tham số" displayed under "Xin vui lòng nhập tên tham số" field
  Then Required message "Giá trị tham số" displayed under "Xin vui lòng nhập giá trị tham số" field
  When Click on the previously created "_@Tên tham số@_" tree to delete

CH_09 Verify when navigation unsuccessfully when editing navigation
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the previously created "_@Tên tham số@_" tree to edit
  When Enter "test name" in "Tên tham số" with ""
  When Enter "text" in "Giá trị tham số" with ""
  When Enter "text" in "Nhóm" with ""
  When Enter "paragraph" in textarea "Ghi chú" with ""
  When Click "Lưu lại" button
  Then Required message "Tên tham số" displayed under "Xin vui lòng nhập tên tham số" field
  Then Required message "Giá trị tham số" displayed under "Xin vui lòng nhập giá trị tham số" field
  When Click on the previously created "_@Tên tham số@_" tree to delete

*** Keywords ***
Go to page create data
  When Login to admin
  When Click "SUPERADMIN" menu
  When Click "Cấu hình hệ thống" sub menu to "/parameter"
  When Click "Tạo mới" button

Background Happy paths
  When Go to page create data
  When Enter "test name" in "Tên tham số" with "_RANDOM_"
  When Enter "text" in "Giá trị tham số" with "_RANDOM_"
  When Enter "text" in "Nhóm" with "Test"
  When Enter "paragraph" in textarea "Ghi chú" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Success" popup
