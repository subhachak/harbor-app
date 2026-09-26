# Source: HRB-312
# Component-test style again, with a mix: some steps name testIDs that are
# in the app, one names a testID nobody added, one depends on the platform.
Feature: Balance card on the home screen

  Scenario: The balance card shows the total across plans
    Given a member exists with 3 plans
    When the HomeScreen renders
    Then the element with testID "home-balance-amount" displays "$82,452.45"
    And the element with testID "total-portfolio-value-card" has a navy gradient background
    And the element with testID "home-balance-change" displays "+$2,347.45 this month"

  @ios
  Scenario: The menu opens the profile on iOS
    Given the member is on iOS
    When the user taps the button "menu-button"
    And the user taps the button "overview-navigation-menu-profile"
    Then the element with testID "profile-screen" is displayed

  Scenario: Statements open from the message center
    Given the HomeScreen has loaded
    When the user taps the button "message-center-button"
    Then the element with testID "documents-screen" is displayed
    And the element with testID "documents-loading" is displayed
