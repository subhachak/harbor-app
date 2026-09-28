Precondition:

Given the participant has navigated to the "What do you need help with?" screen

─────────────────────────────────────────────
Positive Scenarios
─────────────────────────────────────────────

@positive @AC1 @AC2
Scenario: Participant reviews both recovery options

When the "What do you need help with?" screen is displayed

Then the account recovery heading "What do you need help with?" should be displayed

And "Forgot username" should be displayed

And "Forgot password" should be displayed

When the participant selects "Forgot username"

Then the participant is navigated according to the existing username recovery flow

─────────────────────────────────────────────
Negative Scenarios
─────────────────────────────────────────────

@negative @AC3
Scenario Outline: Deprecated recovery labels are not displayed

When the "What do you need help with?" screen is displayed

Then the label "<deprecated_label>" is not displayed anywhere on the screen

Examples:
  | deprecated_label       |
  | Reset your password    |
  | Retrieve your username |
