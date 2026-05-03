type DashboardHeaderProps = {
  title: string;
  cta: React.ReactNode;
};

export const DashboardHeader = ({ title, cta }: DashboardHeaderProps) => {
  return (
    <div
      className="relative flex overflow-hidden rounded-xl border border-transparent"
      style={{
        background: `
          linear-gradient(87.5deg, rgba(30, 30, 30, 0.26) 1.42%, rgba(122 99 255 / 0.26) 99.44%) padding-box,
          linear-gradient(var(--background), var(--background)) padding-box
          `,
      }}
    >
      <div className="z-10 flex basis-full flex-col items-start gap-6 p-6 md:basis-3/5">
        <h1 className="text-base text-white lg:text-h3">{title}</h1>
        {cta}
      </div>
    </div>
  );
};
