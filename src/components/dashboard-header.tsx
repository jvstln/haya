import Image from "next/image";

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
          linear-gradient(var(--background), var(--background)) padding-box,
          linear-gradient(221.57deg, #FFAFA4 1.43%, #493B99 77.18%) border-box
          `,
      }}
    >
      {/* Decorative Background */}
      <div
        className="pointer-events-none max-md:hidden absolute size-44"
        style={{
          left: "calc(50% - 176px/2 - 0.5px)",
          top: "91px",
          background:
            "linear-gradient(261.15deg, rgba(255, 175, 164, 0.8) -29.14%, rgba(122, 99, 255, 0.8) 99.41%)",
          filter: "blur(52.8px)",
        }}
      />

      <div className="z-10 flex basis-full md:basis-3/5 flex-col items-start gap-6 p-6">
        <h1 className="text-base text-white lg:text-h3">{title}</h1>
        {cta}
      </div>
      <div className="relative basis-2/5 max-md:hidden">
        <Image
          src="/images/archive-illustration.svg"
          alt="New audit"
          fill
          className="object-contain object-left-center"
        />
      </div>
    </div>
  );
};

export const GradientBackground = () => (
  <div
    className="-z-10 absolute inset-x-0 top-0 h-39.25"
    style={{
      background:
        "linear-gradient(152.36deg, rgba(122, 99, 255, 0.38) 22.82%, #121212 82.58%)",
      opacity: 0.7,
      filter: "blur(50px)",
    }}
  />
);
