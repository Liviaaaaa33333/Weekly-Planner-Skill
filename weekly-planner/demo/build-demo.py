"""Build demo-zh.html and demo-en.html from the page template and demo-data.js (fictional data)."""
import pathlib
here = pathlib.Path(__file__).parent
tpl = (here.parent / "weekly-planner-for-everyone/assets/planner-page.html").read_text()
data = (here / "demo-data.js").read_text()
marker = "<script>\nconst $ ="
assert tpl.count(marker) == 1
for lang, title in [("zh", "週行程範例"), ("en", "Weekly Planner Demo")]:
    s = tpl.replace("<title>我的週行程</title>", f"<title>{title}</title>", 1)
    s = s.replace(marker, f'<script>const DEMO_LANG="{lang}";\n{data}</script>\n' + marker, 1)
    (here / f"demo-{lang}.html").write_text(s)
print("built demo-zh.html, demo-en.html")
