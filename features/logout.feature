@logout
Feature: User logout

  Background:
    Given User is on the e-bebek home page
    When User navigates to the login page
    And User logs in with valid credentials
    Then User should verify successful login

  Scenario: Successful logout
    When User logs out
    Then User should verify logout success