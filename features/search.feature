@search @knownIssue
Feature: Positive product search

  Scenario: Search with results
    Given User is on the e-bebek home page
    When User searches for result term "emzik"
    Then Search results should be related to "emzik"