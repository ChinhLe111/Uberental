*** Settings ***
Resource                ../keywords/common.robot
Test Setup              Setup
Test Teardown           Tear Down

*** Test Cases ***
DH-01 Verify when Create menu successfully
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the previously created "_@Tên điều hướng@_" tree to delete
  Then User look message "Success" popup

DH-02 Verify when Edit menu successfully
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the previously created "_@Tên điều hướng@_" tree to edit
  When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
  When Enter "word" in "Mã điều hướng" with "_RANDOM_"
  When Enter "word" in "Link" with "/_RANDOM_"
  When Enter "number" in "Số thứ tự" with "_RANDOM_"
  When Click "Lưu lại" button
  Then User look message "Success" popup
  When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH-03 Verify when Delete menu successfully
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the previously created "_@Tên điều hướng@_" tree to delete
  Then User look message "Success" popup

DH-04 Verify when Create menu successfully with off button activated
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the previously created "_@Tên điều hướng@_" tree to delete
  Then User look message "Success" popup
  When Click "Tạo mới" button
  When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
  When Enter "word" in "Mã điều hướng" with "_RANDOM_"
  When Enter "word" in "Link" with "/_RANDOM_"
  When Enter "number" in "Số thứ tự" with "_RANDOM_"
  When Enter "word" in "Biểu tượng" with "las la-folder-minus"
  When Click tree select "Điều hướng cha" with "SUPERADMIN"
  When Click assign list "Order Side, Farmer Side"
  And Click "Lưu lại" button
  Then User look message "Success" popup
  When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH-05 Verify when Create menu unsuccessfully when leaving all fields blank
  [Tags]                @smoketest               @regression
  When Go to page create data
  And Click "Lưu lại" button
  Then Required message "Tên điều hướng" displayed under "Xin vui lòng nhập tên điều hướng" field
  Then Required message "Mã điều hướng" displayed under "Xin vui lòng nhập mã điều hướng" field
  Then Required message "Link" displayed under "Xin vui lòng nhập link" field
  Then Required message "Số thứ tự" displayed under "Xin vui lòng nhập số thứ tự" field

DH-06 Verify when Create menu unsuccessfully when leaving "Tên điều hướng" field
  [Tags]                @smoketest               @regression
  When Go to page create data
  When Enter "word" in "Mã điều hướng" with "_RANDOM_"
  When Enter "word" in "Link" with "/_RANDOM_"
  When Enter "number" in "Số thứ tự" with "_RANDOM_"
  When Click switch "Kích hoạt" to be activated
  When Enter "word" in "Biểu tượng" with "las la-folder-minus"
  When Click tree select "Điều hướng cha" with "SUPERADMIN"
  When Click assign list "Order Side, Farmer Side"
  And Click "Lưu lại" button
  Then Required message "Tên điều hướng" displayed under "Xin vui lòng nhập tên điều hướng" field

DH-07 Verify when Create menu unsuccessfully when leaving the "Số thứ tự" field
  [Tags]                @smoketest               @regression
  When Go to page create data
  When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
  When Enter "word" in "Mã điều hướng" with "_@Tên điều hướng@_"
  When Enter "word" in "Link" with "/_RANDOM_"
  When Click switch "Kích hoạt" to be activated
  When Enter "word" in "Biểu tượng" with "las la-folder-minus"
  When Click tree select "Điều hướng cha" with "SUPERADMIN"
  When Click assign list "Order Side, Farmer Side"
  And Click "Lưu lại" button
  Then Required message "Số thứ tự" displayed under "Xin vui lòng nhập số thứ tự" field

DH-08 Verify when creating menu unsuccessfully when inputting alphabetic characters into the "Số thứ tự" field
  [Tags]                @smoketest               @regression
  When Go to page create data
  When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
  When Enter "word" in "Mã điều hướng" with "_RANDOM_"
  When Enter "word" in "Link" with "/_RANDOM_"
  ${passed}    Run Keyword And Return Status
               ...    Enter "word" in "Số thứ tự" with "_RANDOM_"
  IF    '${passed}' == 'True'
      Then Required message "Số thứ tự" displayed under "Xin vui lòng nhập số thứ tự" field
  ELSE
      When Click switch "Kích hoạt" to be activated
      When Enter "word" in "Biểu tượng" with "las la-folder-minus"
      When Click tree select "Điều hướng cha" with "SUPERADMIN"
      When Click assign list "Order Side, Farmer Side"
      When Click "Lưu lại" button
      Then Required message "Số thứ tự" displayed under "Xin vui lòng nhập số thứ tự" field
  END

DH-10 Verify when create menu unsuccessfully when leaving "Mã điều hướng" field
  [Tags]                @smoketest               @regression
  When Go to page create data
  When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
  When Enter "word" in "Link" with "/_RANDOM_"
  When Enter "number" in "Số thứ tự" with "_RANDOM_"
  When Click switch "Kích hoạt" to be activated
  When Enter "word" in "Biểu tượng" with "las la-folder-minus"
  When Click tree select "Điều hướng cha" with "SUPERADMIN"
  When Click assign list "Order Side, Farmer Side"
  And Click "Lưu lại" button
  Then Required message "Mã điều hướng" displayed under "Xin vui lòng nhập mã điều hướng" field

DH-11 Verify when creating menu unsuccessfully when inputting existing data into "Mã điều hướng" field
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click "Tạo mới" button
  When Enter "test name" in "Tên điều hướng" with "_@Tên điều hướng@_"
  When Enter "word" in "Mã điều hướng" with "_@Mã điều hướng@_"
  When Enter "word" in "Link" with "/_RANDOM_"
  When Enter "number" in "Số thứ tự" with "_RANDOM_"
  When Click switch "Kích hoạt" to be activated
  When Enter "word" in "Biểu tượng" with "las la-folder-minus"
  When Click tree select "Điều hướng cha" with "SUPERADMIN"
  When Click assign list "Order Side, Farmer Side"
  When Click "Lưu lại" button
  Then User look message "Mã: _@Mã điều hướng@_ đã tồn tại" popup
  When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_12 Verify when creating menu unsuccessfully when clicking Notification of Content Check Management then clicking on Tạo mới button
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the previously created "_@Tên điều hướng@_" tree to edit
  When Click "Tạo mới" button
  And Click "Lưu lại" button
  Then Required message "Tên điều hướng" displayed under "Xin vui lòng nhập tên điều hướng" field
  Then Required message "Mã điều hướng" displayed under "Xin vui lòng nhập mã điều hướng" field
  Then Required message "Link" displayed under "Xin vui lòng nhập link" field
  Then Required message "Số thứ tự" displayed under "Xin vui lòng nhập số thứ tự" field
  When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_13 Verify when editing unsuccessfully when selecting "Điều hướng cha" same name as "Tên điều hướng" field
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the previously created "_@Tên điều hướng@_" tree to edit
  When Enter "word" in "Mã điều hướng" with "_RANDOM_"
  When Click tree select "Điều hướng cha" with "_@Tên điều hướng@_"
  And Click "Lưu lại" button
  Then User look message "Không được chọn điều hướng cha là điều hướng con của điều hướng hiện tại" popup
  When Click on the previously created "_@Tên điều hướng@_" tree to delete

DH_14 Verify when navigation unsuccessfully when editing navigation
  [Tags]                @smoketest               @regression
  When Background Happy paths
  When Click on the previously created "_@Tên điều hướng@_" tree to edit
  When Enter "test name" in "Tên điều hướng" with ""
  When Enter "word" in "Mã điều hướng" with ""
  When Enter "word" in "Link" with ""
  When Enter "number" in "Số thứ tự" with ""
  When Click "Lưu lại" button
  Then Required message "Tên điều hướng" displayed under "Xin vui lòng nhập tên điều hướng" field
  Then Required message "Mã điều hướng" displayed under "Xin vui lòng nhập mã điều hướng" field
  Then Required message "Link" displayed under "Xin vui lòng nhập link" field
  Then Required message "Số thứ tự" displayed under "Xin vui lòng nhập số thứ tự" field
  When Click on the previously created "_@Tên điều hướng@_" tree to delete

*** Keywords ***
Go to page create data
  When Login to admin
  When Click "SUPERADMIN" menu
  When Click "Phân quyền điều hướng" sub menu to "/navigation"
  When Click "Tạo mới" button

Background Happy paths
  When Go to page create data
  When Enter "test name" in "Tên điều hướng" with "_RANDOM_"
  When Enter "word" in "Mã điều hướng" with "_RANDOM_"
  When Enter "word" in "Link" with "/_RANDOM_"
  When Enter "number" in "Số thứ tự" with "_RANDOM_"
  When Click switch "Kích hoạt" to be activated
  When Enter "word" in "Biểu tượng" with "las la-folder-minus"
  When Click tree select "Điều hướng cha" with "SUPERADMIN"
  When Click assign list "Order Side, Farmer Side"
  When Click "Lưu lại" button
  Then User look message "Success" popup
