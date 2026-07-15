@login @negative
Feature: Negative user login

  Scenario Outline: Unsuccessful login with invalid email credentials
    Given User is on the e-bebek home page
    When User navigates to the login page
    And User attempts email login with "<emailType>" email and "<passwordType>" password
    Then User should verify "<expectedResult>" with "<expectedValue>"

    Examples:
      | emailType    | passwordType     | expectedResult | expectedValue|
      | registered   | invalid_password | error          | Kullanıcı adı veya parolanız hatalıdır. Lütfen tekrar deneyiniz.|
      | unregistered | valid            | register_page  | Hesap Oluştur |
      | empty        | empty            | error          | Bu alan gereklidir.|
      | registered   | empty            | error          | Bu alan gereklidir.|