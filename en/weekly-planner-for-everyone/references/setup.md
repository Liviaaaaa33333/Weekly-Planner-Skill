# First-time setup

Follow this flow when the user is using this skill for the first time, or when their weekly planner page can't be found. The goal is to finish everything in one conversation: build the page, fill in the data, plan the first week, and set up the automatic checks.

## 1. Check for an existing page

Use `Artifact` `list` to look for a page whose title contains "Weekly Planner" or 「週行程」. If there is one, read its `settings/main` and go straight into everyday use; if there are several, ask the user which one to use. Only start setup if there are none.

## 2. Opening

Explain in a sentence or two what you're going to do, and mention two things:
- The automatic weekly check-in and daily checks require a paid Claude plan (Pro, Max, Team, Enterprise). The free plan can still set up and plan the week; the user just has to open a conversation each week and say "plan next week".
- The schedule can be written to Google Calendar; other calendars (Outlook, Apple Calendar only) aren't supported yet, so the schedule will live on the page.

Then let the user choose a setup mode (use multiple choice if `AskUserQuestion` is available):
- **Quick setup (about 5 minutes, recommended):** Ask only the four essential questions, use defaults for everything else, and fine-tune during the weekly check-ins.
- **Full setup (about 20–30 minutes):** Cover routines, pacing, and recurring tasks all at once.

Either way, **don't ask for anything you can read from files the user uploads** (timetable screenshots, syllabus PDFs, work rosters).

## 3a. Quick setup: four questions

Ask them all at once:
1. What should I call you? What's your time zone (defaults to the one the conversation provides)? Do you want your schedule written to Google Calendar?
2. Please upload your class timetable or fixed schedule (a screenshot, syllabus, or work roster all work; if you don't have one, just say "none").
3. What's the earliest time each day I should schedule things, and the latest?
4. What deadlines, exams, or appointments do you already know about? (List as many as come to mind.)

Use the defaults from `references/data-schema.md` for the other fields: focus blocks in the evening, at most 3 blocks a day, 25–50 minutes each, 30% left free, priority order "admin > deadlines > reading > appointments > errands", weekly check-in Sundays at 20:00 (a draft first, written to the calendar after they confirm), 1 check a day (08:00), and mid-week changes made directly with a note afterward. **List these defaults in the confirmation summary and tell the user they can change them anytime** (for example, "I focus better in the morning", "Ask me before changing my calendar", or "Write the weekly plan straight to my calendar, don't wait for me").

If the user uploaded a timetable or syllabus, they're probably a student: work out the start date of week 1 and the number of weeks from the files; if you can't, ask about it in the confirmation summary.

## 3b. Full setup: four rounds

If the `AskUserQuestion` tool is available, use it (multiple choice, with a suggested answer); otherwise ask in a bulleted text list and have the user reply all at once.

**Round 1: Basics**
- What should I call you? Are you a student, working, or something else?
- Your time zone (defaults to the one the conversation provides); page interface in English or Chinese.
- Where the schedule should go: Google Calendar (on a phone, you can add your Google account to Apple Calendar), or just the page with no calendar.
- When to check in on next week's schedule each week (Sunday evening recommended).
- When things change mid-week: make the change and tell you afterward (recommended), or ask you first.
- Next week's plan: send you a draft to confirm before it goes on the calendar (recommended while you're getting started), or write it straight to the calendar and you say if anything should change (`weeklyAutoSync`).

**Round 2: Time skeleton**
- Class timetable or fixed schedule (have the user upload a timetable screenshot or syllabus; for working people, a roster or recurring meetings).
- Places you go regularly, with commute times and how you get there.
- The earliest and latest times to schedule things each day; fixed meal and rest breaks.
- When you focus best (morning / afternoon / evening / late night).

**Round 3: Pacing**
- How many focus blocks a day at most, and how long each (3 blocks of 25–50 minutes recommended).
- How much free time to leave (30% recommended).
- Priority order: "admin > deadlines > pre-class reading > fixed appointments > errands" is recommended; ask if the user wants to change it.
- Reminders: how many minutes before work blocks, and how far ahead for appointments.
- How many times a day to check "Tell Claude" messages: 1 is recommended. Each check uses some of the plan's usage allowance; for faster responses, increase to 2–3.

**Round 4: Content**
- Recurring tasks: doctor's follow-ups, the gym, haircuts, monthly bills or coupons to collect… how often, whether they need booking in advance, and when the last one was.
- Deadlines, exams, reports, applications, and appointments already known.
- Long-term projects (thesis, portfolio, certification): how much time to set aside each week.
- Students: the date week 1 of the semester starts, how many weeks there are, and which weeks are midterms and finals.

Once you've asked everything, summarize the settings as you understand them in one paragraph for the user to confirm, then start building.

## 4. Read the syllabus

When the user provides a syllabus, turn the weekly schedule into `courses/<id>.schedule` (one entry per class meeting: date + what to read or prepare). Put exams, reports, and submission deadlines separately in `deadlines`. Where the syllabus is unclear, write "(to be confirmed)" rather than guessing.

## 5. Create the page

1. Copy `assets/planner-page.html` and replace the `<title>` on line 2 with the title the user wants (for example, "Alex's Weekly Planner").
2. Publish it with `Artifact`, using `capabilities: {"db": {}}` and `icon: "calendar"`, plus a one-sentence `description`.
3. Note the page URL; the scheduled tasks and everyday use will both need it.

## 6. Fill in the data

Following `references/data-schema.md`, write `settings/main`, `courses`, `recurring`, and `deadlines` with a single `ArtifactData` `batch` (split into several batches if there are more than 50 entries). `settings.timezone` must be an IANA name (for example `Asia/Taipei`, `America/New_York`); the page uses it to calculate times. Generate a human-readable summary in `settings.rows`; the page's "Rules" tab displays it.

## 7. Plan the first week

Following the scheduling rules in SKILL.md, plan the rest of this week (today through Sunday) and write it to `weeks/<this Monday>`. Show the user a table; once they confirm, write it to the calendar and set `status` to `synced`. Also add major deadlines in the next 4 weeks as all-day events.

## 8. Set up scheduled tasks

Following `references/scheduled-tasks.md`, create two kinds of tasks: the weekly check-in and the daily check (1 by default). If there's no scheduling tool (for example, on the free plan), skip this step and tell the user to open a conversation each week and say "plan next week", and to tell Claude directly about any changes. Once the tasks are created, tell the user:
- They need to turn on "Automatically approve" in each task's settings (left sidebar → **Scheduled**), or the task will stall waiting for them to click allow. If the creation result shows automatic approval is already on, there's no need to mention it.
- Record the task ids in `settings.scheduledTasks`.

## 9. Wrap up

In three or four sentences, tell the user: where the page is, what the first thing tomorrow is, how to tell you about changes (say it directly in any conversation, or write it in the page's "Tell Claude" tab), and that on a phone they can add the page to the home screen (iPhone: open the page in Safari → Share → Add to Home Screen, with Open as Web App on).
