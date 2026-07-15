@cart @smoke
Feature: Cart workflow

  Scenario: Update cart quantity, remove product and verify subtotal
    Given User is on the e-bebek home page
    When User adds two different products to the cart
    And User goes to the cart page
    And User increases the quantity of the first product
    And User removes the second product from the cart
    Then Cart subtotal should be calculated correctly