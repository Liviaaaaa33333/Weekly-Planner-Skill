window.PLANNER_DEMO = ({day, today}) => {
  const zh = DEMO_LANG === "zh";
  const T = (a, b) => zh ? a : b;
  const settings = {
    ownerName: T("小安","Alex"), pageTitle: T("小安的週行程（範例）","Alex's week (demo)"),
    language: DEMO_LANG, timezone: "Asia/Taipei", tzOffsetHours: 8, tzLabel: T("台北時間","Taipei time"),
    role: "student", inboxChecks: ["08:00"],
    semesterStart: day(-21), semesterWeeks: 18, midtermWeeks: [9], finalWeeks: [18],
    rows: [
      [T("身分","Role"), T("大學生，住家裡，搭捷運到學校約 40 分鐘","University student, 40 min by metro to campus")],
      [T("可排時間","Planning hours"), "09:00–22:30"],
      [T("最能專心","Best focus"), T("上午","Mornings")],
      [T("專注時段","Focus blocks"), T("每天最多 3 段，每段 25–50 分，中間休息 20 分","Up to 3 a day, 25–50 min each, 20 min rest between")],
      [T("優先順序","Priorities"), T("行政 > 截止 > 課前閱讀 > 預約 > 小事","Admin > deadlines > readings > appointments > errands")],
      [T("提醒","Reminders"), T("工作前 10 分；預約前一天與 1 小時","10 min before work blocks; appointments 1 day and 1 hour before")],
      [T("每週確認","Weekly check-in"), T("週日 20:00","Sunday 20:00")],
    ]
  };
  const it = (d, s, e, title, kind, extra={}) => ({date: day(d), start: s, end: e, title, kind, done: false, ...extra});
  const items = [
    it(0,"08:20","09:00",T("通勤到學校","Commute to campus"),"commute"),
    it(0,"09:10","12:00",T("統計學","Statistics"),"class"),
    it(0,"13:30","13:45",T("填獎學金申請表","Fill in scholarship form"),"admin",{done:true, dls:["d1"]}),
    it(0,"14:00","14:50",T("國關導論課前閱讀：第 4 章前半","IR reading: ch. 4, first half"),"read",{done:true}),
    it(0,"15:10","16:00",T("國關導論課前閱讀：第 4 章後半","IR reading: ch. 4, second half"),"read",{done:true}),
    it(1,"09:30","10:20",T("期中報告：找文獻","Midterm paper: find sources"),"focus",{note:T("先列 5 篇就好","5 papers is enough")}),
    it(1,"10:40","11:30",T("期中報告：寫大綱","Midterm paper: outline"),"focus"),
    it(1,"14:00","16:00",T("牙醫回診","Dentist"),"appt",{note:T("帶健保卡","Bring your insurance card")}),
    it(1,"19:00","19:50",T("線上英文課","Online English class"),"class"),
    it(2,"08:20","09:00",T("通勤到學校","Commute to campus"),"commute"),
    it(2,"09:10","12:00",T("國際關係導論","Intro to International Relations"),"class"),
    it(2,"13:30","14:20",T("統計作業 3","Statistics homework 3"),"due",{dls:["d2"]}),
    it(2,"20:00","20:15",T("預約剪頭髮","Book a haircut"),"routine"),
    it(3,"09:30","10:20",T("期中報告：寫前言","Midterm paper: introduction"),"focus"),
    it(3,"13:00","13:50",T("學術英文寫作課前閱讀","Academic Writing reading"),"read"),
    it(3,"16:00","16:15",T("領本月咖啡優惠券","Claim this month's coffee coupon"),"routine"),
    it(4,"08:20","09:00",T("通勤到學校","Commute to campus"),"commute"),
    it(4,"10:10","12:00",T("學術英文寫作","Academic Writing"),"class"),
    it(4,"14:00","14:50",T("期中報告：第一節","Midterm paper: section 1"),"focus"),
    it(5,"10:00","10:50",T("期中報告：第二節","Midterm paper: section 2"),"focus"),
    it(5,"15:00","16:00",T("健身","Gym"),"routine"),
    it(6,"10:00","10:50",T("統計學課前預習：第 5 章","Statistics preview: ch. 5"),"read"),
    it(6,"20:00","20:20",T("每週確認下週行程","Weekly check-in with Claude"),"admin"),
  ];
  const next = [
    it(7,"08:20","09:00",T("通勤到學校","Commute to campus"),"commute"),
    it(7,"09:10","12:00",T("統計學","Statistics"),"class"),
    it(7,"13:30","13:50",T("上傳交換學生申請資料","Upload exchange application files"),"admin",{dls:["d5"]}),
    it(7,"14:10","15:00",T("國關導論課前閱讀：第 6 章","IR reading: ch. 6"),"read"),
    it(8,"09:30","10:20",T("期中報告：第三節","Midterm paper: section 3"),"focus"),
    it(8,"19:00","19:50",T("線上英文課","Online English class"),"class"),
    it(9,"08:20","09:00",T("通勤到學校","Commute to campus"),"commute"),
    it(9,"09:10","12:00",T("國際關係導論","Intro to International Relations"),"class"),
    it(9,"14:00","14:50",T("期中報告：結論","Midterm paper: conclusion"),"focus"),
    it(10,"10:00","10:50",T("學術英文寫作課前閱讀","Academic Writing reading"),"read"),
    it(10,"15:00","16:00",T("健身","Gym"),"routine"),
    it(11,"08:20","09:00",T("通勤到學校","Commute to campus"),"commute"),
    it(11,"10:10","12:00",T("學術英文寫作","Academic Writing"),"class"),
    it(12,"14:00","15:00",T("剪頭髮","Haircut"),"appt"),
    it(13,"10:00","10:50",T("期中報告：全文校對","Midterm paper: proofread"),"focus"),
  ];
  // 今天的前兩個可勾選項目在過去就標完成，看起來比較真實
  return {
    settings,
    weeks: [{_id: day(0), weekStart: day(0), weekEnd: day(6), label: T("本週行程","This week"), status: "synced", items},
             {_id: day(7), weekStart: day(7), weekEnd: day(13), label: T("下週行程","Next week"), status: "synced", items: next}],
    deadlines: [
      {_id:"d1", title:T("填獎學金申請表","Fill in scholarship form"), date:day(2), time:"17:00", cat:"admin", done:true, note:""},
      {_id:"d2", title:T("統計作業 3","Statistics homework 3"), date:day(4), time:"23:59", cat:"due", done:false, note:T("線上繳交","Submit online")},
      {_id:"d3", title:T("國關導論期中報告","IR midterm paper"), date:day(15), time:"", cat:"due", done:false, note:T("3000 字","3,000 words")},
      {_id:"d4", title:T("統計學期中考","Statistics midterm"), date:day(37), time:"09:10", cat:"exam", done:false, note:""},
      {_id:"d5", title:T("交換學生申請截止","Exchange program application"), date:day(11), time:"12:00", cat:"admin", done:false, note:T("要成績單與推薦信","Transcript and recommendation letter")},
    ],
    recurring: [
      {_id:"r1", name:T("線上英文課","Online English class"), rule:T("每週 2 次，時間不固定","Twice a week, times vary"), duration:T("50 分","50 min"), order:1},
      {_id:"r2", name:T("剪頭髮","Haircut"), rule:T("每 6 週，週末","Every 6 weeks, weekends"), duration:T("1 小時","1 hour"), next:day(12), note:T("提前一週提醒預約","Reminder to book one week before"), order:2},
      {_id:"r3", name:T("咖啡優惠券","Coffee coupon"), rule:T("每月 1–6 日","1st–6th of each month"), duration:T("5 分","5 min"), order:3},
      {_id:"r4", name:T("健身","Gym"), rule:T("每週 2 次","Twice a week"), duration:T("1 小時","1 hour"), order:4},
    ],
    courses: [
      {_id:"c1", name:T("統計學","Statistics"), teacher:T("林老師","Prof. Lin"), room:"B201", day:1, start:"09:10", end:"12:00", rule:"",
        schedule:[{date:day(-7),text:T("第 3 章 機率分配","Ch. 3 Probability distributions"),actual:T("第 3 章，只上到二項分配","Ch. 3, stopped at the binomial distribution")},{date:day(0),text:T("第 4 章 抽樣分配","Ch. 4 Sampling distributions")},{date:day(7),text:T("第 5 章 信賴區間","Ch. 5 Confidence intervals")},{date:day(14),text:T("第 6 章 假設檢定","Ch. 6 Hypothesis testing")}]},
      {_id:"c2", name:T("國際關係導論","Intro to International Relations"), teacher:T("陳老師","Prof. Chen"), room:"S310", day:3, start:"09:10", end:"12:00", rule:T("缺課 3 次扣學期成績","3 absences lower the final grade"),
        lastAnnounce:{date:day(-1), text:T("下週改上第 5 章，第 4 章自己讀","Next week moves to ch. 5; read ch. 4 on your own")},
        schedule:[{date:day(-5),text:T("第 4 章 國際體系","Ch. 4 The international system"),actual:T("第 4 章前半＋課堂討論","First half of ch. 4 and a class discussion")},{date:day(2),text:T("第 5 章 權力平衡","Ch. 5 Balance of power"),updated:day(-1),announce:T("老師調整進度","Schedule changed by the teacher")},{date:day(9),text:T("第 6 章 國際制度","Ch. 6 International institutions")}]},
      {_id:"c3", name:T("學術英文寫作","Academic Writing"), teacher:T("王老師","Prof. Wang"), room:"L105", day:5, start:"10:10", end:"12:00", rule:"",
        schedule:[{date:day(4),text:T("Paraphrasing 練習","Paraphrasing practice")},{date:day(11),text:T("文獻回顧寫法","Writing a literature review")}]},
    ],
    inbox: [
      {_id:"i1", text:T("國關老師說下週改上第 5 章","IR teacher says next week is chapter 5"), at:new Date(Date.now()-86400000).toISOString(), handled:true},
      {_id:"i2", text:T("週五想去看電影，晚上不要排事","I'm going to a movie Friday night, keep the evening free"), at:new Date(Date.now()-3600000).toISOString(), handled:false},
    ]
  };
};
