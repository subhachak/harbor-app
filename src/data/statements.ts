// A stand-in for a statements service: an answer after a short wait, like a
// network call. For Basic members the first request fails (a simulated
// outage) and a retry succeeds, so the loading, error, and retry states can
// all be reached on a device, with no switch a test would have to flip.
import { DOCUMENTS, type Document } from './mock';

const LATENCY_MS = 800;
const failedOnce = new Set<string>();

export function fetchStatements(username: string): Promise<Document[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'member.restricted' && !failedOnce.has(username)) {
        failedOnce.add(username);
        reject(new Error('Statements are unavailable right now.'));
      } else resolve(DOCUMENTS);
    }, LATENCY_MS);
  });
}
