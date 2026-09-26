// testIDs kept as constants, the way many teams do. The grounding extractor
// resolves these references (testID={HOME.contributeAction}) to the literal
// values below.
export const HOME = {
  screen: 'home-screen',
  greeting: 'dashboard-greeting',
  messageCenter: 'message-center-button',
  menu: 'menu-button',
  loading: 'overview-loading-indicator',
  error: 'overview-error-text',
  retry: 'overview-retry-button',
  scroll: 'overview-scroll',
  balanceCard: 'total-portfolio-value-card',
  balanceAmount: 'home-balance-amount',
  snapshotHeader: 'plan-snapshot-header',
  snapshotTitle: 'plan-snapshot-title',
  snapshotAsOf: 'plan-snapshot-asof',
  contributeAction: 'home-contribute-action',
  projected: 'projected-at-retirement-card',
  navigationMenu: 'overview-navigation-menu',
  menuClose: 'overview-navigation-menu-close',
} as const;
