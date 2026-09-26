@story:STORY-201 @platform:ios
Feature: Signing in and out
  As a plan member
  I want to sign in with my username and sign out when I am done
  So that my retirement account stays private

  @persona:entitled
  Scenario: A Premier member signs in and sees their balance
    Given the login screen is displayed
    When I enter username "{entitled.username}"
    And I enter password "{entitled.password}"
    And I tap Sign in
    Then the home screen is displayed
    And the greeting is displayed
    And the balance amount is displayed

  @persona:entitled
  Scenario: An unknown username is refused
    Given the login screen is displayed
    When I enter username "nobody"
    And I enter password "any-password"
    And I tap Sign in
    Then the text "We couldn't find an account with that username." is displayed
    And the login screen is displayed

  @persona:restricted
  Scenario: A Basic member checks their membership and signs out
    Given the login screen is displayed
    When I enter username "{restricted.username}"
    And I enter password "{restricted.password}"
    And I tap Sign in
    Then the home screen is displayed
    When I tap Menu
    And I tap Profile
    Then the profile screen is displayed
    And the basic badge is displayed
    And the premier badge is not displayed
    When I tap Sign out
    Then the login screen is displayed
