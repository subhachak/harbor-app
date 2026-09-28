Feature: Sign in (written the way the client's QA team writes tickets)

  As a member
  I want to sign in with my username and password
  So that I can see my retirement accounts

  @positive @AC1 @persona:entitled
  Scenario: Signing in with a valid account
    Given the login screen should be displayed
    When the participant enters username "{entitled.username}"
    And the participant enters password "{entitled.password}"
    And the participant taps Sign in
    Then the home screen should be displayed

  @positive @AC2
  Scenario: Signing in shows the Harbor brand mark
    Given the login screen should be displayed
    Then Harbor should be displayed

  @negative @AC3
  Scenario: The forgot-username-or-password link opens account recovery
    Given the login screen should be displayed
    When the participant selects "Forgot username or password?"
    Then the account recovery screen should be displayed
