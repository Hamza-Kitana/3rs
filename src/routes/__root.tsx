import {
  Outlet,
  Link,
  createRootRoute,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-body">
      <div className="max-w-md text-center">
        <h1 className="font-latin text-7xl text-rose">404</h1>
        <h2 className="mt-4 font-display text-2xl text-foreground">الصفحة غير موجودة</h2>
        <p className="mt-2 text-muted-foreground">الرابط الذي فتحته غير صحيح أو تم نقله.</p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn-primary inline-flex items-center justify-center rounded-2xl px-6 py-2.5 font-bold"
          >
            العودة إلى الدعوة
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 font-body">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl text-foreground">تعذّر تحميل الصفحة</h1>
        <p className="mt-2 text-muted-foreground">حدث خطأ غير متوقع، حاول تحديث الصفحة.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              void router.invalidate();
              reset();
            }}
            className="btn-primary inline-flex items-center justify-center rounded-2xl px-6 py-2.5 font-bold"
          >
            حاول مرة أخرى
          </button>
          <a href="/" className="btn-ghost inline-flex items-center justify-center rounded-2xl px-6 py-2.5">
            العودة إلى الدعوة
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#e8f0f2" },
      { title: "دعوة زفاف — محمد وضحى" },
      { name: "description", content: "دعوة زفاف كريمة لمحمد وضحى" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ar_JO" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Aref+Ruqaa:wght@400;700&family=Cormorant+Garamond:ital,wght@0,500;1,500&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    ],
  }),
  shellComponent: RootShell,
  component: Outlet,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
