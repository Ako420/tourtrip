// Lists a page's headings and font sizes. Run it in the browser console or with evaluate_script at 1440 x 900.
async () => {
  const S = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let i = 0; i < 40; i++) {
    const H = document.documentElement.scrollHeight;
    const y = i * 600;
    if (y > H) break;
    window.scrollTo(0, y);
    await S(350);
  }
  window.scrollTo(0, 0);
  await S(400);
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const hist = {};
  const heads = [];
  let n;
  while ((n = w.nextNode())) {
    const t = n.textContent.trim().replace(/\s+/g, " ");
    if (t.length < 2) continue;
    const e = n.parentElement;
    if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(e.tagName)) continue;
    const c = getComputedStyle(e);
    if (c.display === "none" || c.visibility === "hidden" || !e.getClientRects().length) continue;
    const s = Math.round(parseFloat(c.fontSize));
    hist[s] = (hist[s] || 0) + t.length;
    if (s >= 20 && +c.fontWeight >= 500 && t.length < 70 && !heads.some((h) => h[1] === t)) heads.push([s, t]);
  }
  const body = hist;
  const total = Object.values(body).reduce((a, b) => a + b, 0);
  const pct = Object.fromEntries(Object.entries(body).filter(([, v]) => v / total > 0.02).map(([k, v]) => [k, Math.round((v / total) * 100)]));
  return { url: location.pathname, title: document.title.slice(0, 60), height: document.documentElement.scrollHeight, font: getComputedStyle(document.body).fontFamily.slice(0, 40), sizes: pct, heads: heads.slice(0, 24) };
}
