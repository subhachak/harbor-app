// A stand-in for the portfolio service behind the overview: an answer after a
// short wait, like a network call, so the overview shows its spinner first.
import { MONTHLY_BALANCES, PLANS, TOTAL_BALANCE } from './mock';

export interface Overview {
  total: number;
  ytdChange: number;
  ytdPercent: number;
  asOf: string; // MM/DD/YYYY
  projectedAtRetirement: number;
}

export function fetchOverview(): Promise<Overview> {
  const start = MONTHLY_BALANCES[0];
  return new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          total: TOTAL_BALANCE,
          ytdChange: TOTAL_BALANCE - start,
          ytdPercent: ((TOTAL_BALANCE - start) / start) * 100,
          asOf: '09/24/2026',
          projectedAtRetirement: Math.round(PLANS.reduce((s, p) => s + p.balance, 0) * 14.6),
        }),
      600,
    ),
  );
}
