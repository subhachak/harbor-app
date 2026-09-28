# Source: HRB-319
# Turning on Face ID after the first sign-in, written the way a production
# team wrote the same kind of story: iOS only (a Background step says so), a
# Background of states no screen shows, steps about the app's internal
# sign-in state ("the sign-in step becomes ..."), and taps on testIDs of a
# screen Harbor does not have yet. The harness keeps it to iOS, reports which
# steps a device cannot check, and tells engineering the enrollment screen's
# testIDs are nowhere in the app.
Feature: HRB-319 Turn on Face ID after the first sign-in on iOS
  As a participant signing in on iOS for the first time
  I want to turn on Face ID for later sign-ins
  So that I can sign in without typing my username and password every time

  Background:
    Given the participant is on iOS
    And biometric sign-in is not set up yet
    And the participant has not declined biometric sign-in

  Scenario: The first successful sign-in offers Face ID once
    Given a valid username and password are submitted
    When the sign-in succeeds
    Then the sign-in step becomes "biometrics_offered"
    And the Face ID offer screen is shown

  Scenario: The participant turns on Face ID
    Given the Face ID offer screen is shown
    And the button "biometrics-enable-button" is visible
    When the participant taps "biometrics-enable-button"
    Then the credentials are saved to secure storage
    And the sign-in step becomes "signed_in"

  Scenario: The participant says no to Face ID
    Given the Face ID offer screen is shown
    And the button "biometrics-not-now-button" is visible
    When the participant taps "biometrics-not-now-button"
    Then the choice not to use biometrics is saved
    And the sign-in step becomes "signed_in"
    And the Face ID offer is not shown at the next sign-in
