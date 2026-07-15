@negativeSearch @knownIssue
Feature: Negative product search

  Scenario: Search with no matching results
    Given User is on the e-bebek home page
    When User searches for no result term "aaasssssdd"
    Then User should verify no matching search result is displayed for "aaasssssdd"
    And Recommended products should be displayed