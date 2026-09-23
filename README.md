# Harbor Retirement

An Expo / React Native demo app: a retirement account with two personas,
four tabs, plans, contributions, activity, and statements. It is the app
under test for the grounding harness
([grounding-harness](https://github.com/subhachak/grounding-harness)), which generates Appium tests
from the stories in `qa/` by reading this source.

## Run it

```bash
npm install
npx expo start          # Expo Go, or press i / a for a simulator/emulator
npm run ios             # a native build (Xcode)
npm run android         # a native build (Android SDK)
```

Demo accounts (any password): `member.entitled` (Alex Morgan, Premier) and
`member.restricted` (Jordan Lee, Basic). Basic members see locked panels
and an upsell instead of contributions.

## Layout

```
App.tsx                        entry point: safe area, session, navigation
src/theme.ts                   colors, spacing, type, money/date formatting
src/data/mock.ts               members, plans, transactions, documents
src/session.tsx                sign-in, persona (isEntitled), contribution draft
src/testIds.ts                 testIDs kept as constants (Home uses them)
src/components/                Button, Card, Chip, Field, ListRow, Badge, ... (wrappers that forward testID)
src/navigation/RootNavigator.tsx   stack + tabs
src/screens/                   one file per screen, each opening with the grounding case it shows
qa/features/<story>/           android.feature + ios.feature per story
qa/test-data/testdata.json     personas and records the stories use
```

The stories and test data live here, next to the code they describe, so
they change with it in the same pull request.

## Grounding cases in the app

| Case | Where |
|---|---|
| Literal testIDs | Login, Enroll, Plan details, Contribute, Confirmation |
| testIDs from constants (`testID={HOME.contributeAction}`) | Home |
| Wrapper components forwarding testID (`Button`, `Chip`, `Field`, `ListRow`, `SectionHeader`, same-file `QuickAction`, `TransactionRow`) | throughout |
| Templated IDs in lists, any loop variable (`plan-card-${plan.id}`, `activity-row-${t.id}`, `login-demo-${m.username}`) | Plans, Activity, Home, Contribute, Login |
| Persona-gated rendering (`isEntitled`, `plan.entitled`) | Plan details, Contribute, Profile, Plans badges |
| Platform-gated rendering (`Platform.OS === 'ios'`) | Schedule: inline picker on iOS, native dialog on Android |
| Runtime-state rendering (`error`, empty list) | Login and Contribute errors, Activity empty state |
| Weak locator (accessibilityLabel only) | Documents |
| Gaps: no testID, with text (Cancel), with only a placeholder (date of birth), with neither (frequency options) | Contribute, Enroll |
| Vendor component (`@react-native-community/datetimepicker`) | Schedule |


## Stories

`qa/features/` holds eight stories, each with an Android and an iOS feature
file. Most steps map by rules; the rest are left on purpose for what
follows them (Copilot, a fallback, a person):

| Story | What it shows | Left for later |
|---|---|---|
| STORY-201 Signing in and out | both personas, profile badges, sign out; an error that depends on runtime state (a G5 warning, not a failure) | none |
| STORY-202 Plans by membership | per-plan badges from test-data records; persona-gated plan details; an Android-only back step; `I open plan "p1"` is in three lists, and the screen context picks the one on Plans | none |
| STORY-203 Making a contribution | quick amounts from records, a Scenario Outline, a runtime-state error | `I tap Cancel` and `I tap Quarterly`: no testID, device-validated fallbacks (Quarterly's label comes from the constant FREQUENCIES list) |
| STORY-204 Scheduling the first contribution | platform-gated UI: iOS date wheels through the vendor adapter, the Android date button | none |
| STORY-205 Premier upsell for Basic members | a locked feature and the upgrade modal | none |
| STORY-206 Activity and statements | list filters and rows from records; a statement found only by its accessibilityLabel (a weak locator), named as a row of the DOCUMENTS list | none |
| STORY-207 Enrolling | typing into a form | `I enter date of birth`: no testID, placeholder only |
| STORY-208 Harbor showcase | every capability once, for a demo: rules, records as parameters, a Scenario Outline, screen context from navigation, two personas, platform-gated steps and the date-wheels adapter, a runtime-state warning | `I tap Quarterly`: fallback from the FREQUENCIES label, approved by a person; `I go to my statements`: Copilot maps it, a person approves |


## Testing it

Clone [grounding-harness](https://github.com/subhachak/grounding-harness)
next to this repository. It finds this app, its stories in `qa/features/`,
and its test data with no configuration:

```bash
git clone https://github.com/subhachak/grounding-harness.git
cd grounding-harness && npm install
npm run doctor          # what it found
npm run workspace       # a VS Code workspace with both repositories
npm run story -- STORY-201
```
