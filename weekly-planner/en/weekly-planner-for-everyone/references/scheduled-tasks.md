# Scheduled tasks

At the end of setup, create two kinds of scheduled tasks (`create_trigger`; if that tool isn't available, first use `ToolSearch` to look for scheduling tools). Every run is a brand-new conversation, so the prompts must be complete and include the page URL. Replace `{{PAGE_URL}}` and `{{TZ}}` (IANA time zone) with the actual values before creating them.

- Cron uses the user's time zone: `CRON_TZ={{TZ}} minute hour * * weekday`.
- Weekly check-in: based on `settings.weeklyCheckin`; the time can be moved a few minutes earlier (e.g. 20:00 → 19:51) so the draft arrives just before the agreed time.
- Daily check: based on `settings.inboxChecks`, once a day by default (08:00). Each run uses some of the plan's usage allowance; only increase to 2–3 if the user wants faster responses. A single cron can only have one minute value, so times with different minutes must be split into separate tasks (e.g. one for 07:50, one for 12:00 and 18:00).
- Scheduled tasks require a paid Claude plan. If there's no scheduling tool, don't force it; tell the user to open a conversation each week and say "plan next week" instead.
- Notifications: `notifications: {push: true}`.
- Once created, remind the user to turn on "Automatically approve" in the task settings.
- To pause: `update_trigger` with `enabled: false`; to remove: `delete_trigger`. Record all ids in `settings.scheduledTasks`.

## Weekly check-in

```
This is the weekly schedule check-in. Use the weekly-planner-for-everyone skill and follow "Scenario A: Weekly confirmation".

The data is at {{PAGE_URL}} (read and write with ArtifactData). All times are in {{TZ}}; first confirm the current time with TZ={{TZ}} date in bash.

If the skill can't be found, follow these steps:
1. Read settings/main, courses, recurring, deadlines, inbox (handled=false), and weeks (this week and next). All personal rules are in settings/main. Deadlines or messages the user deleted on the page are gone from the database; always go by what the database holds now and don't add them back. If a deadline no longer exists but the calendar still has its [Planned by Claude] all-day event or prep blocks made just for it, delete those too and tell the user.
2. Draft specific time blocks for next week (Monday to Sunday): place fixed commitments, commutes, and fixed appointments first; arrange the rest in the order of settings.priorities; put focus work in settings.focusPeak, no more than settings.maxFocusBlocks blocks a day, keeping settings.bufferRatio free; roll anything unfinished this week into next week. For items whose completion means a deadline is done, add dls: [deadline id].
3. Write the draft to weeks/<next Monday's date> with status set to "draft".
4. Send it to the user with SendUserMessage: if settings.semesterStart is set, open with "Next week is week N of M of the semester"; then a one-sentence overview, a day-by-day table, a countdown to major deadlines in the next 3 weeks, and ask only two questions: "Anything new next week: assignments, deadlines, appointments, or events without a fixed time?" "Last week's time estimates: too long, about right, or too short?"
5. Don't write to the calendar until the user confirms. Once they do, write according to settings.calendar (add [Planned by Claude] as the last line of the description; all-day events use midnight ending in Z), and change status to "synced".
```

## Daily check

```
Check for changes the user left on the weekly planner page. Use Scenarios B, D, and E of the weekly-planner-for-everyone skill.

The data is at {{PAGE_URL}} (read and write with ArtifactData). All times are in {{TZ}}; first confirm the current time with TZ={{TZ}} date in bash.

1. Read inbox messages with handled=false, plus weeks for this week and next. Find items "finished early": done=true, no freed=true, the scheduled end time hasn't passed yet, and kind is admin, due, read, focus, or routine.
2. If there are neither: do nothing, send no message, and end.
3. If there are, read settings/main, courses, recurring, and deadlines, then:
   - Course schedule changes (mentions a course plus a chapter, reading, cancelled class, make-up class, or a changed exam or due date): update courses/<id>.schedule, add updated (today's date) and announce (a one-sentence reason) to changed entries, and set lastAnnounce on the course; if dates changed, sync deadlines and the calendar; adjust any pre-class reading already scheduled.
   - Recurring arrangements ("every week / every day / every month", "N times a week", "from now on"): write to recurring; for ones with a fixed time, also create a repeating calendar event; for ones with only a frequency, fit them into free time this week.
   - One-off changes: write to deadlines or the relevant collection; if this week is affected, fit it straight into free time, moving lower-priority items if needed.
   - Finished early: add "✅ " to the start of the calendar event title and remove its reminders; set the matching deadline to done=true; move later, not-yet-done flexible items forward into the free time (by priority, series in order, sensible locations, within the daily focus limit), leave the moved items' original slots empty, and don't cascade the backfill; when done, set freed=true.
   - Set handled messages to handled=true. Messages the user deleted on the page won't appear in inbox and need no handling.
4. Rules: only touch calendar events whose description contains [Planned by Claude]; reschedule with update_event; use the correct UTC offset for that day; do all data writes in a single batch, each with if_version. If settings.confirmBeforeCalendar is true, send the user what you plan to change without writing it, keep the message handled=false, and record "Proposed, waiting for confirmation" in its note (don't propose again for messages that already have this note); otherwise make the changes directly, without asking for approval.
5. Tell the user briefly what you did with SendUserMessage, in a sentence or two.
```
