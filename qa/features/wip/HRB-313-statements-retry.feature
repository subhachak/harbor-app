# Source: HRB-313
# The same area written as a journey: every step is something a person does
# or sees on the device. A Basic member's first statements request fails,
# and a retry brings the list.
@persona:restricted
Feature: Statements retry after an outage

  Scenario: A Basic member retries their statements after an error
    Given the login screen is displayed
    When I enter username "member.restricted"
    And I enter password "Harbor123!"
    And I tap Log In
    Then the home screen is displayed
    When I tap Statements
    Then the element with testID "documents-error-text" displays "Statements are unavailable right now."
    When I tap the element with testID "documents-retry-button"
    And I open document "d1"
