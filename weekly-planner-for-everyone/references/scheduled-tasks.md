# 排程任務

設定流程最後要建立兩種排程任務（`create_trigger`；找不到這個工具時，先用 `ToolSearch` 找排程相關工具）。每次執行都是全新的對話，所以提示詞要完整、要寫出頁面網址。把 `{{PAGE_URL}}`、`{{TZ}}`（IANA 時區）換成實際值再建立。

- cron 用使用者的時區：`CRON_TZ={{TZ}} 分 時 * * 星期`。
- 每週確認：依 `settings.weeklyCheckin`，時間可以提早幾分鐘（例如 20:00 → 19:51），讓草稿剛好在約定時間前送到。
- 每日檢查：依 `settings.inboxChecks`，預設每天 1 次（08:00）。每次執行都會用到方案的使用額度，她想要更快反應才加到 2–3 次。同一條 cron 只能有一個分鐘數，分鐘數不同的時間要拆成不同任務（例如 07:50 一個、12:00 與 18:00 一個）。
- 排程任務需要 Claude 付費方案。找不到排程工具時不要硬做，告訴她改成每週自己開對話說「排下週」。
- 通知：`notifications: {push: true}`。
- 建好後提醒她到任務設定打開「自動核准」。
- 停用：`update_trigger` 設 `enabled: false`；移除：`delete_trigger`。id 都記在 `settings.scheduledTasks`。

## 每週確認

```
這是每週的行程確認。請使用 weekly-planner-for-everyone skill，依「情境 A：每週確認」執行。

資料在 {{PAGE_URL}}（用 ArtifactData 讀寫）。時間一律以 {{TZ}} 為準，先用 bash 的 TZ={{TZ}} date 確認現在時間。

如果找不到這個 skill，照以下步驟做：
1. 讀取 settings/main、courses、recurring、deadlines、inbox（handled=false）、weeks（本週與下週）。所有個人規則都在 settings/main。她在頁面刪掉的截止日或留言，資料庫裡就沒有了；一律以資料庫現況為準，不要加回來。截止日已不存在、日曆上卻還有它的 [Claude安排] 全天活動或專為它排的準備時段時，一併刪除並告訴她。
2. 排出下週（週一到週日）的具體時段草稿：先放固定行程、通勤、固定預約；依 settings.priorities 的順序安排；專注工作排在 settings.focusPeak，每天不超過 settings.maxFocusBlocks 段，保留 settings.bufferRatio 的空白；本週沒完成的項目滾到下週。做完就代表某個截止日完成的項目，加上 dls: [deadline id]。
3. 草稿寫入 weeks/<下週一日期>，status 設為 "draft"。
4. 用 SendUserMessage 傳給她：若有 settings.semesterStart，開頭寫「下週是學期第 N 週（共 M 週）」；接著一句話總覽、逐日表格、未來 3 週的重大截止日倒數，並只問兩題：「下週有沒有新的作業、截止日、約診或時間不固定的行程？」「上週的預估時間：偏多／剛好／偏少？」
5. 她確認之前不要寫入日曆。確認後依 settings.calendar 寫入（description 最後一行加 [Claude安排]；全天活動用 Z 結尾的午夜），status 改為 "synced"。
```

## 每日檢查

```
檢查使用者在週行程頁面留下的變動。請使用 weekly-planner-for-everyone skill 的情境 B、D、E。

資料在 {{PAGE_URL}}（用 ArtifactData 讀寫）。時間一律以 {{TZ}} 為準，先用 bash 的 TZ={{TZ}} date 確認現在時間。

1. 讀取 inbox 中 handled=false 的留言，以及本週與下週的 weeks。找出「提前完成」的事項：done=true、沒有 freed=true、排定的結束時間還沒到，且 kind 為 admin、due、read、focus、routine。
2. 兩者都沒有：什麼都不做、不傳訊息，直接結束。
3. 有的話，讀取 settings/main、courses、recurring、deadlines，然後：
   - 課堂進度變動（提到某門課＋章節、閱讀、停課、補課、考試或繳交日期改變）：更新 courses/<id>.schedule，改過的條目加 updated（今天日期）與 announce（一句話原因），課程設 lastAnnounce；日期有變就同步 deadlines 與日曆；已排好的課前閱讀跟著改。
   - 週期性安排（「每週／每天／每月」「一週 N 次」「以後都」）：寫進 recurring；有固定時間的另建重複日曆活動，只有頻率的排進本週空檔。
   - 一次性變動：寫進 deadlines 或對應集合；影響本週就直接排進空檔、必要時挪動優先順序較低的事。
   - 提前完成：日曆活動標題前加「✅ 」並移除提醒；對應截止日設 done=true；把後面還沒做的彈性事項往前挪進空檔（依優先順序、系列照順序、地點合理、不超過每日專注上限），被挪走的原時段留白，不要連鎖補位；處理完設 freed=true。
   - 處理完的留言設 handled=true。她在頁面刪掉的留言不會出現在 inbox，不需要處理。
4. 規則：只動 description 含 [Claude安排] 的日曆活動；改期用 update_event；時間帶當天正確的時差；所有資料寫入用一次 batch、每筆帶 if_version。settings.confirmBeforeCalendar 為 true 時，先把打算怎麼改傳給她、不要寫入，留言保持 handled=false 並在 note 記「已提案，等確認」（已經有這個 note 的留言不要重複提案）；否則直接改，不需要徵求同意。
5. 用 SendUserMessage 簡短告訴她做了什麼，一兩句話就好。
```
