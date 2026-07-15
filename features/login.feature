@login
Feature: User login

  Scenario: Successful login with valid credentials
    Given User is on the e-bebek home page
    When User navigates to the login page
    And User logs in with valid credentials
    Then User should verify successful login