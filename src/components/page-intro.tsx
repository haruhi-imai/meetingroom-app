import { cn } from "@/lib/utils";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
  className,
}: PageIntroProps) {
  return (
    <section
      className={cn(
        "surface-card flex flex-col gap-4 border-slate-100 px-5 py-5 md:gap-6 md:px-6 md:py-7 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-[2rem] font-semibold tracking-tight text-slate-950 md:mt-3 md:text-[2.5rem]">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 md:mt-3 md:text-base md:leading-7">
          {description}
        </p>
      </div>
      {actions ? (
        <div className="flex flex-wrap gap-2 md:gap-3">{actions}</div>
      ) : null}
    </section>
  );
}
