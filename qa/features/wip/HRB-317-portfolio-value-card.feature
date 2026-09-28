# Source: HRB-317
# The portfolio value card on the Overview, written the way a production team
# wrote the same kind of story: for component tests. It mocks the portfolio
# service, names testIDs (some the app has, some it does not), checks colors,
# and ends with a loading and an error scenario that a device can reach. The
# Background assumes a signed-in participant on the Overview. The harness
# reports what a device test can do, asks how the signed-in state comes about,
# and says what belongs in component tests.
Feature: Portfolio value summary on the Overview

  Background:
    Given the user is authenticated and has navigated to the Portfolio Overview screen

  # Promote to: smoke
  @wip @hrb-317
  Scenario: PV-01 A gain this year shows an up arrow and signed values
    Given the portfolio service returns a total of 100000.00 and a YTD return of 5.5
    When the portfolio value card renders
    Then the element with testID "home-balance-amount" displays "$100,000.00"
    And the element with testID "home-ytd-change" displays "+$5,500.00 (5.5%) YTD"
    And the element with testID "home-ytd-up-arrow" is present
    And the element with testID "home-ytd-down-arrow" is absent
    And the element with testID "home-ytd-change" has style color "#16A34A"

  # Promote to: smoke
  @wip @hrb-317
  Scenario: PV-02 A loss this year shows a down arrow and signed values
    Given the portfolio service returns a total of 100000.00 and a YTD return of -3.2
    When the portfolio value card renders
    Then the element with testID "home-balance-amount" displays "$100,000.00"
    And the element with testID "home-ytd-change" displays "-$3,200.00 (-3.2%) YTD"
    And the element with testID "home-ytd-down-arrow" is present
    And the element with testID "home-ytd-up-arrow" is absent
    And the element with testID "home-ytd-change" has style color "#DC2626"

  # Promote to: regression
  @wip @hrb-317
  Scenario: PV-03 No change this year shows neutral text and no arrow
    Given the portfolio service returns a total of 50000.00 and a YTD return of 0.0
    When the portfolio value card renders
    Then the element with testID "home-balance-amount" displays "$50,000.00"
    And the element with testID "home-ytd-change" displays "$0.00 (0.0%) YTD"
    And the element with testID "home-ytd-change" has style color "#64748B"
    And the element with testID "home-ytd-up-arrow" is absent
    And the element with testID "home-ytd-down-arrow" is absent

  # Promote to: regression
  @wip @hrb-317
  Scenario: PV-04 Without a YTD return the card shows only the total
    Given the portfolio service returns a total of 75000.00 and no YTD return
    When the portfolio value card renders
    Then the element with testID "home-balance-amount" displays "$75,000.00"
    And the element with testID "home-ytd-row" is absent

  # Promote to: regression
  @wip @hrb-317
  Scenario: PV-05 The card's elements carry accessibility labels and testIDs
    Given the portfolio service returns a total of 100000.00 and a YTD return of 5.5
    When the portfolio value card renders
    Then the element with testID "home-balance-amount" has an accessibilityLabel
    And the element with testID "home-ytd-row" has an accessibilityLabel
    And the element with testID "home-ytd-up-arrow" has an accessibilityLabel

  # Promote to: e2e
  @wip @hrb-317 @suggested
  Scenario: PV-06 While the overview loads, the card is not shown
    Given the portfolio data is loading and isLoading is true
    When the Portfolio Overview screen renders
    Then the element with testID "total-portfolio-value-card" is absent
    And the element with testID "overview-loading-indicator" is present

  # Promote to: e2e
  @wip @hrb-317 @suggested
  Scenario: PV-07 When the service fails, a message and a retry are shown instead of the card
    Given the portfolio service returns an API error
    When the Portfolio Overview screen renders
    Then the element with testID "overview-error-text" is present
    And the element with testID "overview-retry-button" is present
    And the element with testID "total-portfolio-value-card" is absent
    And the app does not crash

  # Promote to: regression
  @wip @hrb-317 @suggested
  Scenario: PV-08 Large totals show a dollar sign and thousands separators
    Given the portfolio service returns a total of 1234567.89 and a YTD return of 1.0
    When the portfolio value card renders
    Then the element with testID "home-balance-amount" displays "$1,234,567.89"
