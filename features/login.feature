@login
Feature: User login

  Scenario: Successful login with valid email credentials
    Given User is on the e-bebek home page
    When User navigates to the login page
    And User logs in with valid email credentials
    Then User should verify successful login

  Scenario: Successful login with valid phone credentials
    Given User is on the e-bebek home page
    When User navigates to the login page
    And User logs in with valid phone credentials
    Then User should verify successful login