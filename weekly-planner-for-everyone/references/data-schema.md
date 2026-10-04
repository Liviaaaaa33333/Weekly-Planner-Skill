# 資料結構

週行程頁面的資料庫（`ArtifactData`）裡有這些集合。頁面的程式會讀取這些欄位，名稱不要改。

## settings/main：使用者的個人設定

設定流程填入，之後使用者說「改一下設定」時也更新這份文件。**所有排程規則都從這裡讀**，skill 本身不寫死任何人的資料。

| 欄位 | 型別 | 說明（括號內為預設） |
|---|---|---|
| `ownerName` | 字串 | 怎麼稱呼使用者 |
| `pageTitle` | 字串 | 頁面標題（「我的週行程」） |
| `language` | 字串 | 回覆語言，也決定頁面介面：`en` 開頭為英文，其他為中文（`zh-TW`） |
| `timezone` | 字串 | **必填**。IANA 時區，例如 `Asia/Taipei`、`America/New_York`；頁面用它計算時間，會自動處理夏令時間 |
| `tzOffsetHours` | 數字 | 與 UTC 的時差，只在 `timezone` 無效時備用（8） |
| `tzLabel` | 字串 | 頁面顯示的時區名稱，例如「台北時間」 |
| `role` | 字串 | `student`／`worker`／`other`，決定要不要用課表與學期週次 |
| `calendar` | 物件 | `{type: "google" | "none", calendarId}`；只支援 Google 日曆，`calendarId` 通常是使用者的 Google 帳號 email |
| `dayStart`／`dayEnd` | "HH:MM" | 每天最早、最晚可排的時間（09:00／23:00） |
| `earlyDays` | 陣列 | 要提早出門的日子，例如 `[{day:3, leave:"08:00", note:"09:10 有課"}]` |
| `mealBreaks` | 陣列 | 不排事的休息時段，例如 `[{start:"18:10", end:"19:30", note:"晚餐"}]` |
| `focusPeak` | 字串 | 最能專心的時段：`morning`／`afternoon`／`evening`／`night` |
| `maxFocusBlocks` | 數字 | 每天最多幾段專注時段（3） |
| `blockMinutes` | `[最短, 最長]` | 每段專注時間的分鐘數（[25, 50]） |
| `restBetween` | 數字 | 兩段專注之間至少休息幾分鐘（20） |
| `bufferRatio` | 數字 | 每週保留的空白比例（0.3） |
| `priorities` | 陣列 | 優先順序，由高到低（`["admin","due","read","appt","routine"]`） |
| `adminAlwaysFirst` | 布林 | 行政事項是否永遠最優先（true） |
| `places` | 陣列 | 常去地點，例如 `[{id:"home", name:"家"}, {id:"school", name:"學校"}]` |
| `commutes` | 陣列 | 通勤時間，例如 `[{from:"home", to:"school", minutes:60, mode:"開車"}]` |
| `dayRules` | 字串陣列 | 固定的每日規則，用她自己的話寫，例如「週二上午固定回診，回診後直接去學校」 |
| `reminders` | 物件 | 日曆提醒分鐘數（`{work:[10], appt:[1440,60], deadline:[900], bigDeadline:[9540,900]}`） |
| `weeklyCheckin` | 物件 | 每週確認時間，例如 `{day:0, time:"20:00"}`（0＝週日） |
| `inboxChecks` | 陣列 | 每天檢查「告訴 Claude」的時間（`["08:00"]`）。每次檢查都會用到方案額度，最多建議 3 次，例如 `["07:50","12:00","18:00"]` |
| `confirmBeforeCalendar` | 布林 | 週中改動（新增、提前完成補位、課程進度變動）要不要先問再改（false：直接改好再通知）。打勾同步 ✅ 不受影響 |
| `weeklyAutoSync` | 布林 | 每週排程排好就直接寫進日曆、不等她確認（false：先傳草稿，確認後才寫入） |
| `semesterStart` | "YYYY-MM-DD" | 學期第 1 週的第一天；非學生留空，頁面就不顯示週次 |
| `semesterWeeks` | 數字 | 學期共幾週（18） |
| `midtermWeeks`／`finalWeeks` | 數字陣列 | 期中週、期末週（例如 `[9]`、`[16,18]`） |
| `estimates` | 陣列 | 預估時間表，例如 `[["中文課本一章","50–80 分"], ["英文期刊文章","每 8–10 頁 50 分"]]` |
| `calibration` | 字串 | 最近一次時間校正結果（「偏多」「剛好」「偏少」＋日期） |
| `rows` | 陣列 | 頁面「規則」分頁顯示用的摘要，`[["項目","內容"], …]`；改設定時一起重新產生 |
| `scheduledTasks` | 陣列 | 建好的排程任務 id 與用途，方便之後修改 |

## courses/<id>：課程或固定行程

學生放課程；上班族可以放固定會議、固定班表，或是不用這個集合。

`name, teacher, room, day(0=日…6=六), start, end, rule, lastAnnounce:{date,text}, schedule:[{date,text,actual,updated,announce}]`

- `schedule` 是每次上課要讀或要準備的內容。從課綱（syllabus）整理出來，一次上課一筆。
- `actual`：這堂課實際上了什麼（一句話）。她說了或給了課堂筆記才填；頁面「全學期進度」表的「實際進度」欄。
- `rule`：這門課的特殊規則，例如「缺課 6 次 0 分」「沒約面談不用到校」。
- `updated`／`announce`：老師公告改過的條目，頁面會標「M/D 更新」。

## recurring/<id>：例行事項

`name, rule, note, duration, next, order`

- `rule` 用人話寫頻率：「每週二上午」「每 28 天，週一」「每月 1–6 日」「每週 2 次，時間不固定」。
- `next`：下一次日期（有固定週期的才填）。
- `remindBookingDaysBefore`（可選）：需要事先預約的事（剪頭髮、洗牙、看診），提前幾天排一個「預約○○」的小事。

## deadlines/<id>：截止日與待辦

`title, date, time, cat(admin/due/exam/appt/routine), done, note, source`

- 使用者可以在頁面刪除截止日；刪除後文件直接從資料庫移除，`weeks` 裡指向它的 `dls` 也會被頁面拿掉。

## weeks/<該週週一日期>：每週行程

`weekStart, weekEnd, label, status(draft/confirmed/synced), items:[{date,start,end,title,kind,note,done,freed,dls}]`

- `kind` 只用：`admin` 行政、`due` 截止、`read` 閱讀、`focus` 專注、`appt` 預約、`class` 上課／固定行程、`commute` 通勤、`routine` 小事。
- `dls`：做完就代表某個截止日完成的項目，填對應的 deadline id；準備中的中間段不要填。
- `freed`：提前完成、空出的時段已處理過。

## inbox/<id>：使用者在頁面留下的變動

使用者可以在頁面刪除還沒處理（`handled: false`）的留言；刪除後文件直接從資料庫移除。

`text, at, handled, note`

- `note`：Claude 的處理備註，例如 `confirmBeforeCalendar` 為 true 時記「已提案，等確認」。
