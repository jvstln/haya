import type React from "react";

export const MeshBackground = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="relative h-full w-full" {...props}>
      {/* Top Part */}
      <svg
        width="1247"
        height="358"
        viewBox="0 0 1247 358"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="-translate-x-1/2 absolute top-0 left-1/2 w-full max-w-[1247px]"
        aria-hidden="true"
      >
        <path
          d="M657.701 346.409L694.024 335.046L736.701 321.694L783.201 307.147L844.322 288.025L944.948 256.546L944.959 256.542L1046.71 225.975L1169.71 189.023L1223.42 172.89C1236.53 168.952 1245.5 156.886 1245.5 143.2V-230H1V143.197C1.00002 156.884 9.97619 168.952 23.085 172.888L72.2871 187.662L199.287 225.796L199.295 225.799L400.795 288.024L462.714 307.146L509.82 321.693L553.055 335.045L588.675 346.045L623.997 356.954L657.701 346.409Z"
          stroke="url(#paint0_linear_350_3121)"
          strokeWidth="2"
        />
        <defs>
          <linearGradient
            id="paint0_linear_350_3121"
            x1="623.25"
            y1="358"
            x2="623"
            y2="-38"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.223958" stopColor="white" stopOpacity="0" />
            <stop offset="0.5" stopColor="white" stopOpacity="0.2" />
            <stop offset="0.567708" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Bottom Part */}
      <svg
        width="1247"
        height="489"
        viewBox="0 0 1247 489"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="-translate-x-1/2 absolute bottom-0 left-1/2 w-full max-w-[1247px] translate-y-[20%]"
        aria-hidden="true"
      >
        <path
          d="M657.701 11.5908L694.024 22.9541L736.701 36.3057L783.201 50.8525L844.322 69.9746L944.948 101.454L944.959 101.458L1046.71 132.025L1169.71 168.977L1223.42 185.11C1236.53 189.048 1245.5 201.114 1245.5 214.8V588H1V214.803C1.00002 201.116 9.97619 189.048 23.085 185.112L72.2871 170.338L199.287 132.204L199.295 132.201L400.795 69.9756L462.714 50.8545L509.82 36.3066L553.055 22.9551L588.675 11.9551L623.997 1.0459L657.701 11.5908Z"
          stroke="url(#paint0_linear_369_1091)"
          strokeWidth="2"
        />
        <defs>
          <linearGradient
            id="paint0_linear_369_1091"
            x1="623.25"
            y1="-3.15353e-08"
            x2="623"
            y2="506"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.119792" stopColor="white" stopOpacity="0" />
            <stop offset="0.276042" stopColor="white" stopOpacity="0.2" />
            <stop offset="0.552083" stopColor="white" stopOpacity="0.1" />
            <stop offset="0.770833" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
