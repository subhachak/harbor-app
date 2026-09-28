# Source: HRB-318
# The plan cards in the Overview's Plan Snapshot, written the way a production
# team wrote the same kind of story: each scenario sets up its own plan data
# ("a plan exists with ..."), checks styling in words ("bold", "subtle gray"),
# and one describes a kind of card the app does not have (a plan that cannot
# be selected). The values quoted are the demo plans' own, so the checks a
# device can make pass against them; tapping a card really opens its plan.
Feature: Plan summary cards on the Overview
  As a participant
  I want to see each of my plans summarized on the Overview
  So that I can see how each is doing at a glance

  Background:
    Given the user is authenticated
    And the Overview has loaded plans successfully

  Scenario: The plan name is shown as the card's title
    Given a plan exists with name "Growth Fund 2045"
    When the Overview renders the plan card
    Then the plan name "Growth Fund 2045" is visible as bold title text on the card

  Scenario: The kind of plan is shown below its name
    Given a plan exists with kind "Target-date fund"
    When the Overview renders the plan card
    Then the plan kind "Target-date fund" is visible in subtle gray below the plan name

  Scenario: The plan's balance is shown as currency
    Given a plan exists with balance 48210.55
    When the Overview renders the plan card
    Then the balance "$48,210.55" is visible right-aligned on the card

  Scenario: A gain this year is shown in green with an up arrow
    Given a plan exists with ytdReturn 8.2
    When the Overview renders the plan card
    Then the YTD label "+8.2% YTD" is visible on the card
    And the YTD trend icon is shown in green with an upward arrow

  Scenario: A loss this year is shown in red with a down arrow
    Given a plan exists with ytdReturn -3.1
    When the Overview renders the plan card
    Then the YTD label "-3.1% YTD" is visible on the card
    And the YTD trend icon is shown in red with a downward arrow

  Scenario: The date the values are from is shown
    Given the plans are as of "09/24/2026"
    When the Overview renders the plan cards
    Then the text "As of 09/24/2026" is visible in small gray text above the cards

  Scenario: Without a YTD return, no YTD figure is shown
    Given a plan exists with no ytdReturn
    When the Overview renders the plan card
    Then no YTD percentage or trend icon is shown on the card

  Scenario: Tapping a plan card opens that plan
    Given a plan exists with id "p1"
    When the user taps the plan card with testID "employer-plan-card-p1"
    Then the app navigates to the PlanDetails screen for that plan

  Scenario: A plan that cannot be selected is not a button
    Given a personal plan exists with isSelectable false
    When the Overview renders the plan card
    Then the card is rendered as a non-interactive view without a button role
