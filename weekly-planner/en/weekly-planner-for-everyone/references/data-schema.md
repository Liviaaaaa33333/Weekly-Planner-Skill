# Data schema

The weekly planner page's database (`ArtifactData`) contains these collections. The page's code reads these fields, so don't rename them.

## settings/main: the user's personal settings

Filled in during setup, and updated whenever the user says "change a setting". **All scheduling rules are read from here**; the skill itself hard-codes no one's data.

| Field | Type | Description (default in parentheses) |
|---|---|---|
| `ownerName` | string | What to call the user |
| `pageTitle` | string | Page title ("My Weekly Planner") |
| `language` | string | Reply language, which also sets the page interface: starting with `en` means English, anything else Chinese (`zh-TW`) (`en`) |
| `timezone` | string | **Required.** IANA time zone, e.g. `Asia/Taipei`, `America/New_York`; the page uses it to calculate times and handles daylight saving automatically |
| `tzOffsetHours` | number | Offset from UTC, used only as a fallback when `timezone` is invalid (8) |
| `tzLabel` | string | Time zone name shown on the page, e.g. "Taipei time" |
| `role` | string | `student` / `worker` / `other`; determines whether to use a class timetable and semester weeks |
| `calendar` | object | `{type: "google" | "none", calendarId}`; only Google Calendar is supported, and `calendarId` is usually the user's Google account email |
| `dayStart` / `dayEnd` | "HH:MM" | Earliest and latest times that can be scheduled each day (09:00 / 23:00) |
| `earlyDays` | array | Days the user has to leave early, e.g. `[{day:3, leave:"08:00", note:"Class at 09:10"}]` |
| `mealBreaks` | array | Breaks when nothing is scheduled, e.g. `[{start:"18:10", end:"19:30", note:"Dinner"}]` |
| `focusPeak` | string | When the user focuses best: `morning` / `afternoon` / `evening` / `night` |
| `maxFocusBlocks` | number | Maximum focus blocks per day (3) |
| `blockMinutes` | `[min, max]` | Length of each focus block in minutes ([25, 50]) |
| `restBetween` | number | Minimum rest in minutes between two focus blocks (20) |
| `bufferRatio` | number | Share of each week kept free (0.3) |
| `priorities` | array | Priority order, highest first (`["admin","due","read","appt","routine"]`) |
| `adminAlwaysFirst` | boolean | Whether admin tasks always come first (true) |
| `places` | array | Places the user goes regularly, e.g. `[{id:"home", name:"Home"}, {id:"school", name:"School"}]` |
| `commutes` | array | Commute times, e.g. `[{from:"home", to:"school", minutes:60, mode:"car"}]` |
| `dayRules` | string array | Fixed daily rules in the user's own words, e.g. "Regular doctor's appointment Tuesday mornings, then straight to school" |
| `reminders` | object | Calendar reminder minutes (`{work:[10], appt:[1440,60], deadline:[900], bigDeadline:[9540,900]}`) |
| `weeklyCheckin` | object | Weekly check-in time, e.g. `{day:0, time:"20:00"}` (0 = Sunday) |
| `inboxChecks` | array | Times each day to check "Tell Claude" (`["08:00"]`). Each check uses some of the plan's allowance; at most 3 are recommended, e.g. `["07:50","12:00","18:00"]` |
| `confirmBeforeCalendar` | boolean | Whether mid-week changes (additions, filling time freed by early finishes, course schedule changes) should be proposed before they're made (false: make the change, then notify) |
| `semesterStart` | "YYYY-MM-DD" | First day of week 1 of the semester; leave empty for non-students and the page won't show week numbers |
| `semesterWeeks` | number | Number of weeks in the semester (18) |
| `midtermWeeks` / `finalWeeks` | number array | Midterm and final weeks (e.g. `[9]`, `[16,18]`) |
| `estimates` | array | Time estimates, e.g. `[["One textbook chapter","50–80 min"], ["Journal article","50 min per 8–10 pages"]]` |
| `calibration` | string | Result of the most recent time calibration ("too long", "about right", or "too short" + date) |
| `rows` | array | Summary shown on the page's "Rules" tab, `[["Item","Details"], …]`; regenerate it whenever settings change |
| `scheduledTasks` | array | Ids and purposes of the scheduled tasks created, for easy changes later |

## courses/<id>: courses or fixed commitments

Students put their courses here; working people can put recurring meetings or fixed shifts here, or skip this collection.

`name, teacher, room, day(0=Sun…6=Sat), start, end, rule, lastAnnounce:{date,text}, schedule:[{date,text,updated,announce}]`

- `schedule` is what to read or prepare for each class meeting. Built from the syllabus, one entry per meeting.
- `rule`: special rules for this course, e.g. "6 absences means a zero" or "No need to come in unless a meeting is booked".
- `updated` / `announce`: entries changed by a teacher announcement; the page marks them "Updated M/D".

## recurring/<id>: recurring tasks

`name, rule, note, duration, next, order`

- `rule` states the frequency in plain words: "Every Tuesday morning", "Every 28 days, Mondays", "1st–6th of each month", "Twice a week, times vary".
- `next`: the next date (only for items with a fixed cycle).
- `remindBookingDaysBefore` (optional): for things that need booking in advance (haircut, dental cleaning, doctor), how many days ahead to schedule a small "Book X" task.

## deadlines/<id>: deadlines and to-dos

`title, date, time, cat(admin/due/exam/appt/routine), done, note, source`

- The user can delete a deadline on the page; the document is removed from the database, and the page also removes its id from any `dls` in `weeks`.

## weeks/<that week's Monday date>: weekly schedules

`weekStart, weekEnd, label, status(draft/confirmed/synced), items:[{date,start,end,title,kind,note,done,freed,dls}]`

- `kind` uses only: `admin` admin, `due` deadline, `read` reading, `focus` focus, `appt` appointment, `class` class / fixed commitment, `commute` commute, `routine` errand.
- `dls`: for items whose completion means a deadline is done, the matching deadline id; leave it out for intermediate prep blocks.
- `freed`: finished early, and the freed-up time has already been handled.

## inbox/<id>: changes the user leaves on the page

The user can delete messages that haven't been handled yet (`handled: false`) on the page; the document is removed from the database.

`text, at, handled, note`

- `note`: Claude's handling note, e.g. when `confirmBeforeCalendar` is true, record "Proposed, waiting for confirmation".
