@story:STORY-205 @platform:ios
Feature: Premier upsell for Basic members
  As a Basic member
  I want to understand why contributions are locked
  So that I can decide whether to upgrade

  @persona:restricted
  Scenario: A Basic member opens contributions and looks at Premier
    Given the login screen is displayed
    When I enter username "{restricted.username}"
    And I enter password "{restricted.password}"
    And I tap Sign in
    Then the home screen is displayed
    When I tap Contribute
    Then the contribute locked panel is displayed
    And the contribute form is not displayed
    When I tap the contribute upgrade button
    Then the upgrade screen is displayed
    When I tap Not now
    Then the contribute locked panel is displayed
