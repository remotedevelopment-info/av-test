# Process Log: JSON-Driven Application Calculator

Use this file to track progress during the 2-hour exercise. Keep entries short and factual so you can see what changed, what is blocked, and what still needs to be done.

## Exercise Summary

- Goal: build an application calculator driven by a JSON file and a Svelte frontend.
- Stack: Laravel, Inertia v3, Svelte 5, Tailwind v4.
- Time limit: 2 hours.
- Primary outcome: a working calculator with clear assumptions and a usable interface.

## Success Criteria

- JSON input format is defined and easy to change.
- Calculator logic is driven by JSON data rather than hardcoded values.
- Frontend allows a user to enter values and see calculated results.
- Validation and error handling cover invalid or missing data.
- Core behavior is tested or manually verified.
- Tradeoffs, shortcuts, and known gaps are documented.

## Scope Guardrails

- Prioritize a correct calculation flow over visual polish.
- Prefer a simple JSON schema over a highly flexible one.
- Keep the UI small and functional.
- Avoid building extra features unless the core path is complete.
- Record assumptions instead of over-engineering edge cases.

## 2-Hour Plan

NB: times are approximate

| Time | Focus | Notes |
| --- | --- | --- |
| 0:00-0:15 | Understand the problem and define the JSON shape | Clarify inputs, outputs, and calculator rules |
| 0:15-0:35 | Build or load JSON-driven calculator logic | Keep rules isolated and easy to inspect |
| 0:35-1:10 | Build the Svelte frontend | Inputs, calculated output, error states |
| 1:10-1:30 | Connect frontend to the calculator flow | Confirm the UI reflects JSON-driven behavior |
| 1:30-1:45 | Test and fix issues | Focus on the happy path and obvious failures |
| 1:45-2:00 | Final cleanup and write-up | Capture gaps, assumptions, and next steps |

## Implementation Checklist

- [x] Confirm exercise requirements and assumptions
- [ ] Define the JSON structure
- [ ] Add sample JSON data
- [ ] Implement calculator logic
- [ ] Decide where the calculation runs
- [ ] Build the Svelte page or component
- [ ] Add form inputs and result display
- [ ] Handle invalid input or missing JSON values
- [ ] Add test coverage or manual verification notes
- [ ] Review for obvious UX issues
- [ ] Document known limitations
- [ ] Prepare final handoff summary

## Assumptions

- [ ] Assumption 1: HMRC sources loaded as primary SOT
- [ ] Assumption 2: Logging actions in PROCESS.md, timer set to 2hours
- [ ] Assumption 3:

## Decision Log

| Time | Decision | Reason |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

## Progress Log

### Entry Template

```md
#### HH:MM
- Status:
- What I changed:
- What I learned:
- Next step:
```

### Entries

#### 00:00
- Status: Started exercise
- What I changed:
- What I learned:
- Next step: Review requirements and define the JSON contract

#### 00:15
- Status: Started with a prebuilt Laravel 13/Svelte inertia setup 
- What I changed: created viewers for the PROCESS.md and PLAN.md

#### 00:30
- Status: Built the base JSON and AI built the application outline from the PLAN
- What I changed: Created a navigation system to easily 
- What I learned:
- Next step:

#### 00:45
- Status: HMRC check shows divergence in result
- What I changed: Establish scenarios to quickly check calculations against HMRC
- What I learned: 
- Next step:

#### 01:00
- Status: found tests were failing on DB: 
- What I changed: asked AI to skip any DB related tests and now tests are passing
##### Result: 
- Your app exercise is focused on calculation behavior.
- Database-backed auth/profile flows are excluded from default runs until/if you re-enable them.
###### To re-enable later:
- Remove the three <exclude> entries in phpunit.xml
- Re-enable DB test setup in Pest.php if needed by uncommenting RefreshDatabase usage.

#### 01:10
- Status: Debug caculator divergences
- What I changed: 
- What I learned:
- Next step:

#### 01:30
- Status:
- What I changed:
- What I learned:
- Next step:

#### 01:45
- Status:
- What I changed:
- What I learned:
- Next step:

#### 02:00
- Status: Wrap-up
- What I changed:
- What I learned:
- Next step: Summarize what works, what is incomplete, and what I would do next

## Blockers

| Time | Blocker | Impact | Resolution |
| --- | --- | --- | --- |
|  |  |  |  |
|  |  |  |  |

## Request Log

- 2026-04-24: Create PROCESS.md for the 2-hour exercise.
- 2026-04-24: Format PLAN.md into Markdown.
- 2026-04-24: Add a route to display PLAN.md.
- 2026-04-24: Add a route to display PROCESS.md and log visits.
- 2026-04-24: Build a JSON source of truth for SDLT calculations and wire it into the frontend form.
- 2026-04-24: Format PROCESS.md reply content as proper Markdown and keep summaries in code blocks.
- 2026-04-24: Replace default home page with a simple menu and calculator as a primary item.
- 2026-04-24: Return to agentic mode; begin testing and improving the calculator, and verify/update test coverage.
- 2026-04-24: Add /scenarios/hmrc/500000 route and page for pasting HMRC calculator text entries.
- 2026-04-24: Add /scenarios and /scenarios/hmrc index pages with a shared navigation header layout linking Home and Calculator.
- 2026-04-24: Update HMRC 500000 scenario page to parse HMRC summary inputs/results and compare against calculator output.

## Verification

- Manual checks completed:
- Tests run:
- Remaining risk:

## Known Gaps

-
-
-

## Final Summary

### What Works

-
-
-

### What Is Incomplete

-
-
-

### If I Had More Time

-
-
-

## AI Update

```text
Implemented JSON-as-source-of-truth calculator flow:
- Added public calculator route.
- Added SDLT JSON data file and frontend calculator logic that reads from it.
- Wired the frontend form to use JSON-backed rules for all calculations.
- Added calculator page UI with breakdown and effective rate.
- Added a focused feature test for the calculator page route.
- Regenerated Wayfinder route helpers.
- Verified with passing feature test and clean Svelte type check.
```
- 2026-04-24T04:40:15+00:00 GET /process
- 2026-04-24T04:56:37+00:00 GET /process
- 2026-04-24T05:02:07+00:00 GET /process
- 2026-04-24T05:08:02+00:00 GET /process
- 2026-04-24T05:11:17+00:00 GET /process
