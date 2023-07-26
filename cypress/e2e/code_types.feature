Feature: Code types

  Rule: Happy paths
    Background:
      When Login to admin
      When Click "QUẢN LÝ DANH MỤC" menu
      When Click "Danh mục" sub menu to "/code-types"

    Scenario Outline: <testCaseTitle>
      When Select on the "<type>" item line
      When Click "Thêm mới" button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "number" in "Thứ tự" with "_RANDOM_"
      When Enter "text" in "Mã" with "_RANDOM_"
      When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Success" popup
      Then Click on the "Xóa" button in the "_@Tiêu đề@_" table line
      Examples:
        | testCaseTitle                                                     | type                |
        | MPG_01 Verify when create Medical Procedure Group successful      | Nhóm thủ thuật      |
        | MPD_01 Verify when create Medical Procedure Difficulty successful | Độ khó              |
        | MD_01 Verify when create Medical Degree successful                | Bằng cấp chuyên môn |
        | NOT_01 Verify when create Number of Teeth successful              | Số răng             |

    Scenario Outline: <testCaseTitle>
      When Select on the "<type>" item line
      When Click "Thêm mới" button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "number" in "Thứ tự" with "_RANDOM_"
      When Enter "text" in "Mã" with "_RANDOM_"
      When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Success" popup
      Then Click on the "Sửa" button in the "_@Tiêu đề@_" table line
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "number" in "Thứ tự" with "_RANDOM_"
      When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
      When Click "Lưu lại" button
      Then Click on the "Xóa" button in the "_@Tiêu đề@_" table line
      Examples:
        | testCaseTitle                                                   | type                |
        | MPG_03 Verify that Sửa Medical Procedure Group successful      | Nhóm thủ thuật      |
        | MPD_03 Verify that Sửa Medical Procedure Difficulty successful | Độ khó              |
        | MD_03 Verify that Sửa Medical Degree successful                | Bằng cấp chuyên môn |
        | NOT_03 Verify that Sửa Number of Teeth successful              | Số răng             |

    Scenario Outline: <testCaseTitle>
      When Select on the "<type>" item line
      When Click "Thêm mới" button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "number" in "Thứ tự" with "_RANDOM_"
      When Enter "text" in "Mã" with "_RANDOM_"
      When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
      When Click "Lưu lại" button
      Then User look message "Success" popup
      Then Click on the "Xóa" button in the "_@Tiêu đề@_" table line
      Then User look message "Đã xóa thành công" popup
      Examples:
        | testCaseTitle                                                     | type                |
        | MPG_04 Verify that "Xóa" Medical Procedure Group successful      | Nhóm thủ thuật      |
        | MPD_04 Verify that "Xóa" Medical Procedure Difficulty successful | Độ khó              |
        | MD_04 Verify that "Xóa" Medical Degree successful                | Bằng cấp chuyên môn |
        | NOT_04 Verify that "Xóa" Number of Teeth successful              | Số răng             |

  Rule: Bad paths
    Background:
      When Login to admin
      When Click "QUẢN LÝ DANH MỤC" menu
      When Click "Danh mục" sub menu to "/code-types"

    Scenario Outline: <testCaseTitle>
      When Select on the "<type>" item line
      When Click "Thêm mới" button
      When Enter "number" in "Thứ tự" with "_RANDOM_"
      When Enter "text" in "Mã" with "_RANDOM_"
      When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
      When Click "Lưu lại" button
      Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field
      Examples:
        | testCaseTitle                                                                                              | type                |
        | MPG_22 Verify when create Medical Procedure Group unsuccessful beacause leaving "Tiêu đề" field blank      | Nhóm thủ thuật      |
        | MPD_22 Verify when create Medical Procedure Difficulty unsuccessful beacause leaving "Tiêu đề" field blank | Độ khó              |
        | MD_22 Verify when create Medical Degree unsuccessful beacause leaving "Tiêu đề" field blank                | Bằng cấp chuyên môn |
        | NOT_22 Verify when create Number of Teeth unsuccessful beacause leaving "Tiêu đề" field blank              | Số răng             |

    Scenario Outline: <testCaseTitle>
      When Select on the "<type>" item line
      When Click "Thêm mới" button
      When Enter "test name" in "Tiêu đề" with "_RANDOM_"
      When Enter "number" in "Thứ tự" with "_RANDOM_"
      When Enter "paragraph" in textarea "Mô tả" with "_RANDOM_"
      When Click "Lưu lại" button
      Then Required message "Mã" displayed under "Xin vui lòng nhập mã" field
      Examples:
        | testCaseTitle                                                                                          | type                |
        | MPG_23 Verify when create Medical Procedure Group unsuccessful beacause leaving "Mã" field blank       | Nhóm thủ thuật      |
        | MPD_23 Verify when create Medical Procedure Difficulty unsuccessful beacause leaving "Mã" field blank  | Độ khó              |
        | MD_23 Verify when create Medical Degree unsuccessful beacause leaving "Mã" field blank                 | Bằng cấp chuyên môn |
        | NOT_23 Verify when create Number of Teeth unsuccessful beacause leaving "Mã" field blank               | Số răng             |

    Scenario Outline: <testCaseTitle>
      When Select on the "<type>" item line
      When Click "Thêm mới" button
      When Click "Lưu lại" button
      Then Required message "Tiêu đề" displayed under "Xin vui lòng nhập tiêu đề" field
      Then Required message "Mã" displayed under "Xin vui lòng nhập mã" field
      Examples:
        | testCaseTitle                                                                                          | type                |
        | MPG_21 Verify when create Medical Procedure Group unsuccessful beacause leaving all fields blank       | Nhóm thủ thuật      |
        | MPD_21 Verify when create Medical Procedure Difficulty unsuccessful beacause leaving all fields blank  | Độ khó              |
        | MD_21 Verify when create Medical Degree unsuccessful beacause leaving all fields blank                 | Bằng cấp chuyên môn |
        | NOT_21 Verify when create Number of Teeth unsuccessful beacause leaving all fields blank               | Số răng             |
