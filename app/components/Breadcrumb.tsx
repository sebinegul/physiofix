import { safeJsonLd } from "@/lib/json-ld";

interface Crumb {
  name: string;
  href: string;
}

/**
 * Visual breadcrumb trail + matching BreadcrumbList JSON-LD schema.
 * Server component; use on any inner page:
 *
 *   <Breadcrumb items={[{ name: "Blog", href: "/blog" }, { name: title, href: `/blog/${slug}` }]} />
 */
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `https://physiofix.net${c.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          {all.map((c, i) => {
            const last = i === all.length - 1;
            return (
              <li key={c.href} className="flex items-center gap-1.5">
                {i > 0 && <span aria-hidden>/</span>}
                {last ? (
                  <span className="font-medium text-slate-700">{c.name}</span>
                ) : (
                  <a
                    href={c.href}
                    className="transition-colors hover:text-blue-600"
                  >
                    {c.name}
                  </a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
