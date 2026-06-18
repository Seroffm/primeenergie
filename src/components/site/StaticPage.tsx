import type { ReactNode } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";

export function StaticPage({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <SiteLayout>
      <section className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        <h1 className="text-4xl font-bold text-primary md:text-5xl">{title}</h1>
        {lead ? <p className="mt-4 text-lg text-muted-foreground">{lead}</p> : null}
        <div className="prose prose-slate mt-10 max-w-none text-foreground [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-primary [&_p]:mt-4 [&_p]:text-muted-foreground [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:mt-2 [&_li]:text-muted-foreground">
          {children}
        </div>
      </section>
    </SiteLayout>
  );
}
