import type { ReactNode } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";

export function StaticPage({
  title,
  lead,
  children,
  centered = false,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
  centered?: boolean;
}) {
  return (
    <SiteLayout>
      <section className="mx-auto min-w-0 max-w-3xl overflow-x-clip px-4 py-12 sm:px-6 sm:py-16 md:py-24">
        <header className={centered ? "text-center" : undefined}>
          <h1 className="break-words text-3xl font-bold leading-tight text-primary [overflow-wrap:anywhere] sm:text-4xl md:text-5xl">
            {title}
          </h1>
          {lead ? (
            <p className="mt-4 break-words text-base text-muted-foreground [overflow-wrap:anywhere] sm:text-lg">
              {lead}
            </p>
          ) : null}
        </header>
        <div className="prose prose-slate mt-8 min-w-0 max-w-none break-words text-foreground [overflow-wrap:anywhere] sm:mt-10 [&_a]:break-all [&_h2]:mt-10 [&_h2]:break-words [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-primary sm:[&_h2]:text-2xl [&_li]:mt-2 [&_li]:text-muted-foreground [&_p]:mt-4 [&_p]:text-muted-foreground [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
          {children}
        </div>
      </section>
    </SiteLayout>
  );
}
