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

The sign-in screen and the portfolio overview after it are laid out the way
production retirement apps commonly are, element for element (and testID for
testID), in Harbor's own branding: a greeting that welcomes a returning
member back and masks their username with "Not you?", outlined fields with a
show/hide toggle, a Sign in button disabled until both fields are filled, a
biometric button, an OR divider, Enroll and Set up access (disabled: not
built yet), a forgot link to account recovery, footer links and a copyright,
and a spinner while signing in; a wrong username is an alert. The overview
has a time-of-day greeting, a message centre, a menu (Profile, Plans,
Activity, Statements), the total portfolio value with its year-to-date
change, a Plan Snapshot, a contribution card, and the projected balance at
retirement.

## Layout

```
App.tsx                        entry point: safe area, session, navigation
src/theme.ts                   colors, spacing, type, money/date formatting
src/data/mock.ts               members, plans, transactions, documents
src/data/statements.ts         a stand-in statements service: a delay, and a first failure for Basic members
src/data/overview.ts           a stand-in portfolio service for the overview: a delay
src/session.tsx                sign-in, persona (isEntitled), contribution draft
src/testIds.ts                 testIDs kept as constants (Home uses them)
src/components/                Button, Card, Chip, Field, FloatingLabelInput (forwardRef), ListRow, Badge, ... (wrappers that forward testID)
src/navigation/RootNavigator.tsx   stack + tabs
src/screens/                   one file per screen, each opening with the grounding case it shows
qa/features/<story>/           android.feature + ios.feature per story
qa/features/wip/               one file per story, named by its key (HRB-311-....feature)
qa/test-data/testdata.json     personas and records the stories use
```

The stories and test data live here, next to the code they describe, so
they change with it in the same pull request.

## Grounding cases in the app

| Case | Where |
|---|---|
| Literal testIDs | Login, Enroll, Account recovery, Plan details, Contribute, Confirmation |
| testIDs from constants (`testID={HOME.contributeAction}`) | Home |
| Wrapper components forwarding testID (`Button`, `Chip`, `Field`, `ListRow`, `SectionHeader`, `FloatingLabelInput` through `forwardRef`, same-file `MenuRow`, `TransactionRow`) | throughout |
| Texts chosen at runtime (`{isReturning ? 'Welcome back' : 'Welcome'}`, `{loading ? 'Signing in...' : 'Sign in'}`) and texts on no testID (the subtitle, the copyright) | Login |
| Not built yet: a button disabled in the source with a stub handler (Set up access) | Login |
| Navigation by route to nested screens (Enroll, Forgot, the menu) | Login, Home |
| Templated IDs in lists, any loop variable (`plan-card-${plan.id}`, `activity-row-${t.id}`, `employer-plan-card-${plan.id}`) | Plans, Activity, Home, Contribute |
| Persona-gated rendering (`isEntitled`, `plan.entitled`) | Plan details, Contribute, Profile, Plans badges |
| Platform-gated rendering (`Platform.OS === 'ios'`) | Schedule: inline picker on iOS, native dialog on Android |
| Runtime-state rendering (`error`, empty list, loading) | Contribute errors, Activity empty state, the sign-in spinner and "Not you?"; Documents and the overview load from a service: a spinner, then the content (Documents: or an error with a retry, since a Basic member's first request fails) |
| Weak locator (accessibilityLabel only) | Documents |
| Gaps: no testID, with text (Cancel), with only a placeholder (date of birth), with neither (frequency options) | Contribute, Enroll |
| Vendor component (`@react-native-community/datetimepicker`) | Schedule |


## Stories

`qa/features/` holds eight stories, each with an Android and an iOS feature
file. Most steps map by rules; the rest are left on purpose for what
follows them (Copilot, a fallback, a person). STORY-206 and STORY-208 open a
statement, whose row shows only after the list loads: a runtime-state
warning, which the wait for the element covers on a device.

| Story | What it shows | Left for later |
|---|---|---|
| STORY-201 Signing in and out | both personas, profile badges through the menu, sign out | the wrong-username alert: a system alert, looked for on the live screen |
| STORY-202 Plans by membership | per-plan badges from test-data records; persona-gated plan details; an Android-only back step; `I open plan "p1"` is in three lists, and the screen context picks the one on Plans | none |
| STORY-203 Making a contribution | quick amounts from records, a Scenario Outline, a runtime-state error | `I tap Cancel` and `I tap Quarterly`: no testID, device-validated fallbacks (Quarterly's label comes from the constant FREQUENCIES list) |
| STORY-204 Scheduling the first contribution | platform-gated UI: iOS date wheels through the vendor adapter, the Android date button | none |
| STORY-205 Premier upsell for Basic members | a locked feature and the upgrade modal | none |
| STORY-206 Activity and statements | list filters and rows from records; a statement found only by its accessibilityLabel (a weak locator), named as a row of the DOCUMENTS list | none |
| STORY-207 Enrolling | typing into a form | `I enter date of birth`: no testID, placeholder only |
| STORY-208 Harbor showcase | every capability once, for a demo: rules, records as parameters, a Scenario Outline, screen context from navigation, two personas, platform-gated steps and the date-wheels adapter, the system date dialog on Android, a runtime-state warning | `I tap Quarterly`: fallback from the FREQUENCIES label, approved by a person; `I go to my statements`: Copilot maps it, a person approves; on Android, `I tap Next month`, `I tap 15`, `I tap OK` in the system date dialog: not in the app's source, found on the live screen, a person approves |


### Stories in progress, written for component tests

`qa/features/wip/` holds stories the way many teams write them: one file
per story, named by its Jira-style key, for both platforms (`@ios` and
`@android` tags pick scenarios), and often written for component tests, with
mocked services, internal state, one component rendered on its own, styling,
and testIDs named in quotes. They show what the harness does with stories
like these: `npm run triage` sorts the steps, and `/rewrite-story` drafts a
journey a device can run, which a second person approves.

| Story | Written as | Triage |
|---|---|---|
| HRB-311 Statements loading and error states | component tests: a mocked service, `isLoading`, `DocumentsScreen renders`, a red banner, bold titles, and `statement-row-d1`, a testID the rows do not have | written for component tests: 9 of 16 steps are not device steps, 1 testID not found, 1 left for Copilot (`the user is authenticated with tier "Basic"`) |
| HRB-312 Balance card | component tests: test data set up in the step, a gradient background, `home-balance-change` (not in the app), and an iOS-only scenario started with `the member is on iOS` | written for component tests: 5 not device steps, 1 testID not found |
| HRB-313 Statements retry | a journey, with quoted testIDs: a Basic member signs in, sees the error, retries, and opens a statement | ready: every step maps by rules, with runtime-state warnings for the error, the retry, and the rows |
| HRB-314 Signed in with test data | journeys that start `Given I am signed in as "<persona>"` instead of typing credentials: two personas from the test data, and a third ("returning") the test data does not have | needs test data: the harness asks once which account "returning" is and for its password (`npm run testdata`, or before a run), and remembers who entered them |
| HRB-316 Login screen | the sign-in screen and where each action leads, written the way a production team wrote the same story (mirrored step for step, flaws included): a setup step, "should be visible and editable", a copyright that differs from the app's, an outline whose scenarios share a name, a tap on Set up access (not built yet); plus signing in and landing on the overview | before readings, the rules map 2 of 33 steps; with readings, 25 are grounded, 4 are looked for on the live screen (logo, biometric button, subtitle, copyright), the returning participant is set up by a seed from the test data, 2 go to a person ("Accounts" after an empty Sign in, Set up access), 1 is not built yet; `npm run quality` lists the story's fixes |
| HRB-315 Statements from a fresh start | a Background the way teams write them: `the member is on Android`, `the member has not signed in yet`, `no statements are cached yet` | Android only (iOS reports it as left out); the two starting states wait for one confirmation each, then every scenario starts from a fresh install |

The test data (`qa/test-data/testdata.json`) holds the accounts (personas,
with their passwords in plain text), records, and the app's sign-in as
`signIn` steps. Stories name what they use from it rather than spelling it
out: `I enter username "{entitled.username}"`, `I enter password
"{entitled.password}"`. The tests look each value up when they run, so the
same stories run against another environment's accounts by giving that
environment its own test data (`testdata.uat.json` beside this one, chosen
with `testDataEnv` or `TEST_DATA_ENV`). Any password signs in to Harbor.

Its `seeds` name states a story may start from and the steps that set them
up. HRB-316's "User has previously logged in to the app" is the seed
"previously logged in": sign in, sign out from Profile, and the Login screen
greets the participant with "Welcome back".

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
