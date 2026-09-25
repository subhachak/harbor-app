# Source: HRB-311
# Written the way component tests are: a mocked service, internal state,
# one component rendered on its own, styling. Most of it is not a device
# step; triage says so, and /rewrite-story drafts a journey a device can run.
Feature: Statements list loading and error states

  Background:
    Given the user is authenticated with tier "Basic"

  Scenario: A loading indicator shows while statements are fetched
    Given the statements service is mocked to return 4 documents
    And isLoading is true
    When the DocumentsScreen renders
    Then the element with testID "documents-loading" is displayed
    And the element with testID "documents-error" is absent

  Scenario: An error banner shows when the service fails
    Given the statements service returns a 503 error
    When the DocumentsScreen renders
    Then the element with testID "documents-error-text" displays "Statements are unavailable right now."
    And the error banner has a red background
    When the user taps the button "documents-retry-button"
    Then the fetch is in progress
    And the element with testID "documents-loading" is displayed

  Scenario: Statements are listed after a successful load
    Given the statements service returns 4 documents
    When the DocumentsScreen has loaded
    Then the element with testID "statement-row-d1" is displayed
    And the element with testID "statement-row-d1-title" is styled bold
    And the element with testID "documents-loading" is absent
