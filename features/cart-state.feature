@state @cartState
Feature: Cart state persistence

  Scenario: Guest cart should be preserved after login
    Given User is on the e-bebek home page
    When Guest user adds a product to the cart
    And Guest cart state is saved
    And User logs in from the same browser session
    And User opens the cart page from header
    Then Guest cart state should be preserved after login