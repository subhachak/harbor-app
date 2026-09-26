// Stub sign-in: who logged in decides the member shown and whether they are
// entitled (Premier) or restricted (Basic). Usernames match the personas in
// test-data/testdata.json; there is no real authentication.
import React, { createContext, useContext, useState } from 'react';
import { MEMBERS, type Member } from './data/mock';

export type Frequency = 'One-time' | 'Monthly' | 'Quarterly';

export interface ContributionDraft {
  planId: string;
  amount: string;
  frequency: Frequency;
  startDate: Date;
}

interface Session {
  member: Member | null;
  // The last member who signed in, and whether anyone has, for as long as
  // the app runs: the sign-in screen greets them back and shows their
  // username masked, with "Not you?" to clear it (a real app keeps this on
  // the device; a fresh install has neither).
  lastUsername: string | null;
  signedInBefore: boolean;
  isEntitled: boolean;
  signIn: (username: string) => boolean;
  signOut: () => void;
  draft: ContributionDraft;
  updateDraft: (change: Partial<ContributionDraft>) => void;
}

const SessionContext = createContext<Session | null>(null);

const newDraft = (): ContributionDraft => ({ planId: 'p1', amount: '', frequency: 'Monthly', startDate: new Date() });

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [lastUsername, setLastUsername] = useState<string | null>(null);
  const [draft, setDraft] = useState<ContributionDraft>(newDraft);
  const value: Session = {
    member,
    lastUsername,
    signedInBefore: lastUsername !== null,
    isEntitled: member?.isEntitled ?? false,
    signIn: (username) => {
      const found = MEMBERS[username.trim().toLowerCase()];
      setMember(found ?? null);
      if (found) setLastUsername(found.username);
      return Boolean(found);
    },
    signOut: () => {
      setMember(null);
      setDraft(newDraft());
    },
    draft,
    updateDraft: (change) => setDraft((d) => ({ ...d, ...change })),
  };
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error('useSession outside SessionProvider');
  return session;
}
