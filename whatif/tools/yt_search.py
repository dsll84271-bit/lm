"""yts.py "query" [n] -> top YouTube search results: views, age, length, channel, title."""
import json, re, sys, urllib.parse, urllib.request
def search(q, n=20):
    url = "https://www.youtube.com/results?" + urllib.parse.urlencode({"search_query": q, "sp": "EgIQAQ%3D%3D"})  # videos only
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36", "Accept-Language": "en-GB,en;q=0.9", "Cookie": "CONSENT=YES+1"})
    html = urllib.request.urlopen(req, timeout=40).read().decode("utf-8", "ignore")
    m = re.search(r"var ytInitialData = (\{.*?\});</script>", html) or re.search(r'ytInitialData"\] = (\{.*?\});', html)
    data = json.loads(m.group(1))
    out = []
    def walk(o):
        if isinstance(o, dict):
            if "videoRenderer" in o:
                v = o["videoRenderer"]
                t = "".join(r.get("text", "") for r in v.get("title", {}).get("runs", []))
                views = v.get("viewCountText", {}).get("simpleText") or "".join(r.get("text","") for r in v.get("viewCountText", {}).get("runs", []))
                age = v.get("publishedTimeText", {}).get("simpleText", "")
                ln = v.get("lengthText", {}).get("simpleText", "")
                ch = "".join(r.get("text", "") for r in v.get("ownerText", {}).get("runs", []))
                out.append((views, age, ln, ch, t))
            for x in o.values(): walk(x)
        elif isinstance(o, list):
            for x in o: walk(x)
    walk(data)
    return out[:n]
def num(v):
    m = re.match(r"([\d,.]+)\s*([KMB]?)", v.replace("No", "0"))
    if not m: return 0
    x = float(m.group(1).replace(",", "")); return int(x * {"": 1, "K": 1e3, "M": 1e6, "B": 1e9}[m.group(2)])
if __name__ == "__main__":
    q = sys.argv[1]; n = int(sys.argv[2]) if len(sys.argv) > 2 else 20
    for views, age, ln, ch, t in search(q, n):
        print(f"{views:>18} | {age:>16} | {ln:>8} | {ch[:24]:24} | {t[:80]}")
