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
        "surface-panel flex flex-col gap-4 px-5 py-5 md:gap-6 md:px-6 md:py-7 lg:flex-row lg:items-end lg:justify-between",
        className,
      )}
    >
      <div className="max-w-3xl">
        <p className="text-xs font-medium tracking-[0.04em] text-slate-500">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-[2.15rem] font-semibold tracking-tight text-slate-950 md:mt-3 md:text-[2.75rem]">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
          {description}
        </p>
      </div>
      {actions ? (
        <div className="flex flex-wrap gap-2 md:gap-3">{actions}</div>
      ) : null}
    </section>
  );
}
