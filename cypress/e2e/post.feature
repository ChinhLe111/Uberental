Feature: Post

  Rule: Happy paths
    Background:
      When Login to admin
      When Click "QUẢN LÝ DANH MỤC" menu
      When Click "Post" sub menu to "/post"
      When Click "Tạo mới bài viết" button
#     When Click radio "Html" in line "Editor Format"
      When Select file in "Ảnh cover" with "image.jpg"
      When Select file in "Ảnh thumbnail" with "image.jpg"
      When Click select "Chuyên mục" with "Press release"
      When Click radio "Longform" in line "Định dạng bài viết"
      When Enter "color" in "Background Color" with "_RANDOM_"
      When Enter "color" in "Title Fore Color" with "_RANDOM_"
      When Click switch "Show Title" to be activated
      When Click switch "Ghim" to be activated
      When Enter "text" in "Custom Class" with "text-blue-600"
      When Enter "text" in textarea "Custom CSS" with "{color:1px;}"
      When Click "English" tab button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "text" in "Tác giả" with "_RANDOM_"
      When Enter "paragraph" in "Mô tả ảnh cover" with "_RANDOM_"
      When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
      When Enter "paragraph" in editor "Nội dung" with "_RANDOM_"
      When Enter "text" in "Tiêu đề SEO" with "_RANDOM_"
      When Enter "text" in "Từ khóa SEO" with "_RANDOM_"
      When Enter "paragraph" in textarea "Mô tả SEO" with "_RANDOM_"
      When Click "Tiếng Việt" tab button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "text" in "Tác giả" with "_RANDOM_"
      When Enter "paragraph" in "Mô tả ảnh cover" with "_RANDOM_"
      When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
      When Enter "paragraph" in editor "Nội dung" with "_RANDOM_"
      When Enter "text" in "Tiêu đề SEO" with "_RANDOM_"
      When Enter "text" in "Từ khóa SEO" with "_RANDOM_"
      When Enter "paragraph" in textarea "Mô tả SEO" with "_RANDOM_"
      When Click "Lưu lại" button

    Scenario: PO_01 Verify that Add New successfully with enter the data
      Then User look message "Thêm mới bài viết thành công" popup
      When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
      Then User look message "Đã xóa thành công" popup

    Scenario: PO_02 Verify that  add successfully with enter "Tiêu đề" and categories
      When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
      When Click "Tạo mới bài viết" button
      When Click select "Chuyên mục" with "Press release"
      When Click "English" tab button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Click "Tiếng Việt" tab button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Thêm mới bài viết thành công" popup
      When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
      Then User look message "Đã xóa thành công" popup

    Scenario: PO_03 Verify that edit successfully
      Then User look message "Thêm mới bài viết thành công" popup
      When Click on the "Sửa" button in the "_@Tiêu đề@_" table line
      When Click "English" tab button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "text" in "Tác giả" with "_RANDOM_"
      When Enter "paragraph" in "Mô tả ảnh cover" with "_RANDOM_"
      When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
      When Click "Tiếng Việt" tab button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "text" in "Tác giả" with "_RANDOM_"
      When Enter "paragraph" in "Mô tả ảnh cover" with "_RANDOM_"
      When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Cập nhật bài viết thành công" popup
      When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
      Then User look message "Đã xóa thành công" popup

    Scenario: PO_04 Verify that "Public" successfully
      Then User look message "Thêm mới bài viết thành công" popup
      When Click on the "Đăng bài" button in the "_@Tiêu đề@_" table line
      Then User look message "Cập nhật thành công" popup
      When Click on the "Hủy đăng" button in the "_@Tiêu đề@_" table line
      When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
      Then User look message "Đã xóa thành công" popup

    Scenario: PO_05 Verify that "Hide" successfully
      Then User look message "Thêm mới bài viết thành công" popup
      When Click on the "Đăng bài" button in the "_@Tiêu đề@_" table line
      When Click on the "Hủy đăng" button in the "_@Tiêu đề@_" table line
      Then User look message "Cập nhật thành công" popup
      When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
      Then User look message "Đã xóa thành công" popup

    Scenario: PO_06 Verify that "Delete" successfully
      When Click on the "Xóa" button in the "_@Tiêu đề@_" table line
      Then User look message "Đã xóa thành công" popup

  Rule: Bad paths
    Background:
      When Login to admin
      When Click "QUẢN LÝ DANH MỤC" menu
      When Click "Post" sub menu to "/post"

    Scenario: PO_16 Verify when Create Post unsuccessfully when leaving all fields blank
      When Click "Tạo mới bài viết" button
      When Click "Lưu lại" button
      Then Required message "Chuyên mục" displayed under "Xin vui lòng chọn chuyên mục" field
      When Click "English" tab button
      Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field
      When Click "Tiếng Việt" tab button
      Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field

    Scenario: PO_17 Verify when Create Post unsuccessfully when leaving Categories fields blank
      When Click "Tạo mới bài viết" button
      When Click radio "Longform" in line "Định dạng bài viết"
      When Enter "color" in "Background Color" with "_RANDOM_"
      When Enter "color" in "Title Fore Color" with "_RANDOM_"
      When Click switch "Show Title" to be activated
      When Click switch "Ghim" to be activated
      When Click "English" tab button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "text" in "Tác giả" with "_RANDOM_"
      When Click "Tiếng Việt" tab button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "text" in "Tác giả" with "_RANDOM_"
      When Click "Lưu lại" button
      Then Required message "Chuyên mục" displayed under "Xin vui lòng chọn chuyên mục" field

    Scenario: PO_18 Verify when Create Post unsuccessfully when leaving "Tiêu đề" fields blank
      When Click "Tạo mới bài viết" button
      When Select file in "Ảnh cover" with "image.jpg"
      When Select file in "Ảnh thumbnail" with "image.jpg"
      When Click select "Chuyên mục" with "Press release"
      When Click radio "Longform" in line "Định dạng bài viết"
      When Enter "color" in "Background Color" with "_RANDOM_"
      When Enter "color" in "Title Fore Color" with "_RANDOM_"
      When Click switch "Show Title" to be activated
      When Click switch "Ghim" to be activated
      When Enter "text" in "Custom Class" with "text-blue-600"
      When Enter "text" in textarea "Custom CSS" with "{color:1px;}"
      When Click "English" tab button
      When Enter "text" in "Tác giả" with "_RANDOM_"
      When Enter "paragraph" in "Mô tả ảnh cover" with "_RANDOM_"
      When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
      When Enter "paragraph" in editor "Nội dung" with "_RANDOM_"
      When Enter "text" in "Tiêu đề SEO" with "_RANDOM_"
      When Enter "text" in "Từ khóa SEO" with "_RANDOM_"
      When Enter "paragraph" in textarea "Mô tả SEO" with "_RANDOM_"
      When Click "Tiếng Việt" tab button
      When Enter "text" in "Tác giả" with "_RANDOM_"
      When Enter "paragraph" in "Mô tả ảnh cover" with "_RANDOM_"
      When Enter "paragraph" in textarea "Giới thiệu" with "_RANDOM_"
      When Enter "paragraph" in editor "Nội dung" with "_RANDOM_"
      When Enter "text" in "Tiêu đề SEO" with "_RANDOM_"
      When Enter "text" in "Từ khóa SEO" with "_RANDOM_"
      When Enter "paragraph" in textarea "Mô tả SEO" with "_RANDOM_"
      When Click "Lưu lại" button
      When Click "English" tab button
      Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field
      When Click "Tiếng Việt" tab button
      Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field

    Scenario: PO_19 Verify when Create Post unsuccessfully when leaving "Tiêu đề" blank in VietNamese format
      When Click "Tạo mới bài viết" button
      When Click select "Chuyên mục" with "Press release"
      When Click "English" tab button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Click "Lưu lại" button
      When Click "Tiếng Việt" tab button
      Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field

    Scenario: PO_20 Verify when Create Post unsuccessfully when leaving "Tiêu đề" blank in English format
      When Click "Tạo mới bài viết" button
      When Click select "Chuyên mục" with "Press release"
      When Click "Tiếng Việt" tab button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Click "Lưu lại" button
      When Click "English" tab button
      Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field

    Scenario: PO_22 Verify when Create Post unsuccessfully when article "Tiêu đề" already exist
      When Click "Tạo mới bài viết" button
      When Click select "Chuyên mục" with "Press release"
      When Click "English" tab button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Click "Tiếng Việt" tab button
      When Enter "test name" in "Tiêu đề" with "_@Tiêu đề@_"
      When Click "Lưu lại" button
      Then User look message "Tiêu đề bản dịch bị trùng lặp" popup
