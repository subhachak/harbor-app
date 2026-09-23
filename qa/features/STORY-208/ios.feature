@story:STORY-208 @platform:ios
Feature: Harbor showcase
  One story that touches every capability of the grounding harness once.
  Each scenario says in its description what it demonstrates.

  @persona:entitled
  Scenario: A Premier member plans a quarterly contribution from a plan
    Rules map steps by visible text and testID words; test-data records fill
    templated testIDs as parameters; navigation read from the source tells
    the rules which screen a tap lands on, so the plan tapped right after
    "manage plans" is the one on Plans; persona-gated elements are checked
    against the persona; "Quarterly" has no testID but its label comes from
    a constant list, so it runs on a device-validated fallback once a person
    approves it; the date step uses the vendor adapter on iOS and checks the
    platform-gated button on Android; "Done" is on two screens and the
    screen context picks the right one.
    Given the login screen is displayed
    When I enter username "member.entitled"
    And I enter password "Harbor123!"
    And I tap Log In
    Then the home screen is displayed
    When I tap manage plans
    And I open plan "p1"
    Then the contribution amount is displayed
    When I tap Make a contribution
    And I select amount "250"
    And I tap Quarterly
    And I tap First contribution
    When I choose "2026-10-15" in the date wheels
    Then the selected date is displayed
    When I tap Done
    Then the contribute summary is displayed
    When I tap Submit contribution
    Then the confirmation title is displayed
    And the confirmation reference is displayed

  @persona:entitled
  Scenario Outline: Each plan's badge follows its status
    A Scenario Outline; the gate checks each badge against the plan's record
    (Active needs plan.entitled, Restricted needs its opposite), and each
    step becomes one definition with the plan as a parameter.
    Given the login screen is displayed
    When I enter username "member.entitled"
    And I enter password "Harbor123!"
    And I tap Log In
    Then the home screen is displayed
    When I tap manage plans
    Then the plans screen is displayed
    And plan "<plan>" shows the <badge> badge

    Examples:
      | plan | badge      |
      | p1   | active     |
      | p2   | restricted |
      | p3   | active     |

  @persona:restricted
  Scenario: A Basic member meets the Premier lock
    The same app, another persona: the gate proves the locked panel renders
    and the form does not for this persona; "See Premier benefits" is on two
    screens, and the tap on Contribute says which.
    Given the login screen is displayed
    When I enter username "member.restricted"
    And I enter password "Harbor123!"
    And I tap Log In
    Then the home screen is displayed
    When I tap Contribute
    Then the contribute locked panel is displayed
    And the contribute form is not displayed
    When I tap See Premier benefits
    Then the upgrade screen is displayed

  @persona:entitled
  Scenario: Submitting without an amount explains why
    The error depends on runtime state, not on the persona: the gate warns
    that it cannot check it statically instead of failing the scenario.
    Given the login screen is displayed
    When I enter username "member.entitled"
    And I enter password "Harbor123!"
    And I tap Log In
    Then the home screen is displayed
    When I tap Contribute
    And I tap Submit contribution
    Then the contribute error is displayed

  @persona:entitled
  Scenario: A member opens a statement
    Statements carry only an accessibilityLabel (a weak locator) built from
    each document's title and period, so no rule can name one: the Copilot
    agent proposes the mapping, the gate checks it, and a person approves it.
    Given the login screen is displayed
    When I enter username "member.entitled"
    And I enter password "Harbor123!"
    And I tap Log In
    Then the home screen is displayed
    When I tap Statements
    Then the documents screen is displayed
    When I open document "d1"
