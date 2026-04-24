# Goal

Build a standalone Stamp Duty Land Tax (SDLT) calculator for residential property purchases in England.

The calculator sits in the quote flow between the client entering their property details and seeing the full quote. For this task, build a standalone version; it does not need to integrate with anything else.

# Scope

## In Scope

- Current standard residential SDLT for England
- First-time buyer relief
- Additional property surcharge
- A working browser-based UI a real client could use
- Automated tests covering the calculation logic

## Out of Scope

- Non-residential and mixed-use rates
- Linked transactions
- Multiple Dwellings Relief
- Welsh LTT
- Scottish LBTT
- The non-resident surcharge
- Leasehold rent calculations
- Historical rates
- Persistence
- Authentication

# What the User Does and Sees

The user enters their purchase details and sees the SDLT they would owe, broken down so they can follow where the number comes from, along with the effective rate as a percentage of the price.

What “purchase details” means in practice is partly a judgement call. The plan deliberately does not list the exact input fields. Work out what the calculator needs to know to produce a correct answer for the three rate scenarios below, and design the inputs accordingly.

If you find yourself wanting to ask a clarifying question about what to collect from the user, that is the call you are expected to make and note.

The breakdown should make sense to someone who has never heard the phrase “nil rate band.” Plain language beats jargon.

# Architecture

A dedicated Laravel service performs the calculation. It takes the user’s inputs and returns a structured result containing:

- The total
- The breakdown
- The effective rate

The service must be pure:

- Same inputs, same outputs
- No database queries
- No side effects
- No external calls

The SDLT rate bands, thresholds, and surcharge percentages must live in configuration, not in the calculation logic. When HMRC changes rates, the fix should be a config edit and a test update, not a code change.

How you structure that config, whether as a Laravel config file, JSON, YAML, or something else, is your call. The requirement is separation of data from logic.

Three rate scenarios need to be supported:

- Standard rates
- First-time buyer relief
- Additional property surcharge

Standard and first-time buyer rates are progressive band structures. The surcharge is a flat addition that applies on top.

Research the current rules from HMRC’s published guidance before you start. The details of how each scenario behaves at the edges matter, and getting them right is part of what is being assessed.

# Validation and UX

Invalid input, including non-numeric, empty, negative, or nonsensical combinations, should produce clear messages, never a server error or a blank page.

Loading, error, and result states should all be handled even if the interface is plain. Think about what happens when a user changes inputs after seeing a result.

A plain interface that handles every case well scores higher than a polished one that crashes on edge cases.

# Testing

Write tests that prove the maths is correct.

At minimum, cover:

- The three rate scenarios: standard, first-time buyer, and additional property
- At least one band-boundary case where the price falls exactly on a threshold

Add whatever else you think matters, including:

- Edge cases around zero or very low prices
- The interaction between first-time buyer relief and the price cap
- The surcharge’s effect on lower bands

Use your judgement on what is worth testing and what is not.

A mix of unit tests on the calculation service and feature tests on the HTTP endpoint is ideal.

Verify your test expectations against HMRC’s own calculator before submitting. If your numbers and HMRC’s disagree, one of you has the wrong rates, and it is almost certainly not HMRC.