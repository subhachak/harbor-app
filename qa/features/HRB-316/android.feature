@story:HRB-316 @platform:android
Feature: HRB-316 Login screen
  The sign-in screen and where each of its actions leads, written the way a
  production team wrote the same story (HRB-316 mirrors it step for step, in
  Harbor's words), flaws included, so the harness shows what it does with
  them: a setup step, two checks in one step, a copyright text that differs
  from the app's, an outline whose scenarios share a name, and a tap on a
  feature that is not built yet (Set up access).

  @TEST_HRB-316
  Scenario: Display Login screen
    Given User starts a native app session on Sauce Labs

  @loginScreen_launch
  Scenario: Login screen is displayed on app launch
    Given the Login screen should be displayed
    Then the Harbor logo should be visible on the Login screen
    And the Username field should be visible and editable
    And the Password input field should be visible and editable
    And the Sign In button should be visible on the Login screen
    And the Enroll button should be visible on the Login screen
    And the Set Up Access button should be visible on the Login screen
    And the "Forgot Username or Password?" link should be visible on the Login screen
    And Sign in with Face ID\Biometrics option should be displayed on the Login screen

  @loginScreen_greeting_first_time
  Scenario: Welcome text and supporting text are displayed for a first time login
    Then the text "Welcome" should be displayed on the Login screen
    And the supporting text "Sign in to manage your retirement accounts." should be displayed

  @loginScreen_greeting_returning
  Scenario: Welcome back text and supporting text are displayed for a returning participant
    Given User has previously logged in to the app
    Then the text "Welcome back" should be displayed on the Login screen
    And the supporting text "Sign in to manage your retirement accounts." should be displayed

  @loginScreen_footer
  Scenario: Footer links and copyright text are displayed on the Login screen
    Given the Login screen is displayed
    When the User scrolls to the footer area on the Login screen
    Then the Contact link should be visible in the footer
    And the Terms of Use link should be visible in the footer
    And the Privacy link should be visible in the footer
    And the copyright text "2026 Harbor Retirement, Inc All right reserved" should be displayed in the footer

  @loginScreen_navigation
  Scenario Outline: User is navigated to the correct flow when tapping action links on the Login screen
    When User taps the "<link>" on the Login screen
    Then User should be navigated to the "<destination>"

    Examples:
      | link                          | destination             |
      | Sign in                       | Accounts screen         |
      | Enroll button                 | Enrollment screen       |
      | Set Up Access button          | Set Up Access screen    |
      | Forgot Username or Password?  | Account recovery screen |

  @loginScreen_signed_in
  Scenario: A participant signs in and lands on the portfolio overview
    Given the Login screen is displayed
    When User enters "{entitled.username}" in the Username field
    And User enters "{entitled.password}" in the Password field
    And User taps the "Sign in" on the Login screen
    Then the portfolio greeting should be displayed
    And the total portfolio value should be displayed
    And the Plan Snapshot should be displayed
