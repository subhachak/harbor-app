# Source: HRB-314
# Signs in with accounts from test data instead of typing them in the story.
# "entitled" and "restricted" are in the app's test data, with their
# passwords. "returning" is not
# in test data at all: the harness asks which account it is, once, and
# remembers who said so. Nothing is asked in the middle of a run.
Feature: Signed-in journeys with accounts from test data

  Scenario: A Premier member sees their balance and badge
    Given I am signed in as "entitled"
    Then the balance amount is displayed
    When I tap Menu
    And I tap Profile
    Then the premier badge is displayed

  Scenario: A Basic member sees their badge
    Given I am signed in as "restricted"
    When I tap Menu
    And I tap Profile
    Then the basic badge is displayed
    And the premier badge is not displayed

  Scenario: A returning member checks their recent activity
    Given I am signed in as "returning"
    When I tap Menu
    And I tap Activity
    Then the activity screen is displayed
