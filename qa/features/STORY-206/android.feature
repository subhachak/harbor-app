@story:STORY-206 @platform:android
Feature: Activity and statements
  As a plan member
  I want to review my transactions and statements
  So that I can keep track of fees and withdrawals

  @persona:entitled
  Scenario: A member filters their activity
    Given the login screen is displayed
    When I enter username "{entitled.username}"
    And I enter password "{entitled.password}"
    And I tap Sign in
    Then the home screen is displayed
    When I tap Menu
    And I tap Activity
    Then the activity screen is displayed
    When I select filter "fee"
    Then activity "t3" shows the amount
    When I select filter "withdrawal"
    Then activity "t6" shows the row

  @persona:entitled
  Scenario: A member opens a statement
    Given the login screen is displayed
    When I enter username "{entitled.username}"
    And I enter password "{entitled.password}"
    And I tap Sign in
    Then the home screen is displayed
    When I tap Menu
    And I tap Statements
    Then the documents screen is displayed
    When I open document "d1"
