# Source: HRB-315
# A Background the way teams write them: the platform, and how the app is
# when each scenario starts. "the member is on Android" keeps the whole story
# to Android (iOS leaves it out, and says why). The two "not ... yet" steps
# are starting states: each scenario starts from a fresh install, once a
# person confirms a fresh install gives that state.
Feature: Statements from a fresh start, on Android

  Background:
    Given the member is on Android
    And the member has not signed in yet
    And no statements are cached yet

  Scenario: A Basic member retries their statements after an outage
    Given I am signed in as "restricted"
    When I tap Statements
    Then the element with testID "documents-error-text" displays "Statements are unavailable right now."
    When I tap the element with testID "documents-retry-button"
    And I open document "d1"

  Scenario: A Premier member sees their statements straight away
    Given I am signed in as "entitled"
    When I tap Statements
    And I open document "d1"
