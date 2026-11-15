export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="utf-8" />
    <title>تعذّر تحميل الصفحة</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 16px/1.6 system-ui, -apple-system, "Segoe UI", Tahoma, sans-serif; background: #e8f0f2; color: #2a3340; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.4rem; margin: 0 0 0.5rem; }
      p { color: #5c6a75; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.6rem 1.4rem; border-radius: 1rem; font: inherit; cursor: pointer; text-decoration: none; border: 1.5px solid #9a4555; }
      .primary { background: #9a4555; color: #fff; }
      .secondary { background: transparent; color: #9a4555; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>تعذّر تحميل الصفحة</h1>
      <p>حدث خطأ غير متوقع، حاول تحديث الصفحة.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">حاول مرة أخرى</button>
        <a class="secondary" href="/">العودة إلى الدعوة</a>
      </div>
    </div>
  </body>
</html>`;
}
