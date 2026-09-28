Precondition:

Given the participant is authenticated

And the Dashboard is displayed

And the Plan snapshot section is visible

─────────────────────────────────────────────
Positive Scenarios
─────────────────────────────────────────────

@positive @AC1 @AC2
Scenario: View Add new plan and start enrollment

Given the participant is on the Dashboard

When the participant views the Plan snapshot section

Then the "+ Add new plan" option should be displayed as per approved design

When the participant selects "+ Add new plan"

Then the Enroll into a New Plan flow should be initiated

And the participant should be navigated to the applicable starting enrollment screen

─────────────────────────────────────────────
Negative Scenarios
─────────────────────────────────────────────

@negative @AC3
Scenario: Prevent duplicate enrollment flow launch on fast double tap

Given the "+ Add new plan" option is displayed

When the participant taps "+ Add new plan" quickly two times

Then the Enroll into a New Plan flow should open only once

And duplicate screens should not be opened
