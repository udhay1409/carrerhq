import React from "react";
import Image from "next/image";
import { cn } from "../../lib/utils";

interface Logo {
  name: string;
  logo: string;
}

interface AnimatedCanopyProps extends React.HTMLAttributes<HTMLDivElement> {
  vertical?: boolean;
  repeat?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
  applyMask?: boolean;
}

const AnimatedCanopy = ({
  children,
  vertical = false,
  repeat = 4,
  pauseOnHover = false,
  reverse = false,
  className,
  applyMask = true,
  ...props
}: AnimatedCanopyProps) => (
  <div
    {...props}
    className={cn(
      "group relative flex h-full w-full overflow-hidden p-2 [--duration:10s] [--gap:12px] [gap:var(--gap)]",
      vertical ? "flex-col" : "flex-row",
      className
    )}
  >
    {Array.from({ length: repeat }).map((_, index) => (
      <div
        key={`item-${index}`}
        className={cn("flex shrink-0 [gap:var(--gap)]", {
          "group-hover:[animation-play-state:paused]": pauseOnHover,
          "[animation-direction:reverse]": reverse,
          "animate-canopy-horizontal flex-row": !vertical,
          "animate-canopy-vertical flex-col": vertical,
        })}
      >
        {children}
      </div>
    ))}
    {applyMask && (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-10 h-full w-full from-white/50 from-5% via-transparent via-50% to-white/50 to-95% dark:from-gray-800/50 dark:via-transparent dark:to-gray-800/50",
          vertical ? "bg-gradient-to-b" : "bg-gradient-to-r"
        )}
      />
    )}
  </div>
);

const LogoCard = ({ logo, className }: { logo: Logo; className?: string }) => (
  <div
    className={cn(
      "group mx-2 flex h-20 w-48 shrink-0 cursor-pointer overflow-hidden rounded-xl border border-transparent p-4 transition-all hover:border-primary-400 hover:shadow-[0_0_10px_#60a5fa] dark:hover:border-primary-400 bg-white dark:bg-gray-800",
      className
    )}
  >
    <div className="flex items-center justify-center w-full">
      <Image
        src={logo.logo}
        alt={logo.name}
        width={120}
        height={48}
        className="h-full w-auto max-h-12 object-contain filter dark:brightness-0 dark:invert-[.85] group-hover:scale-110 transition-all duration-300"
      />
    </div>
  </div>
);

interface AnimatedLogosProps {
  data: Logo[];
  className?: string;
  cardClassName?: string;
  repeat?: number;
}

export const AnimatedLogosCanopy: React.FC<AnimatedLogosProps> = ({
  data,
  className,
  cardClassName,
  repeat = 2,
}) => (
  <div className={cn("w-full overflow-x-hidden py-4", className)}>
    <AnimatedCanopy
      key="Canopy-0"
      className="[--duration:25s]"
      pauseOnHover
      applyMask={false}
      repeat={repeat}
    >
      {data.map((logo) => (
        <LogoCard key={logo.name} logo={logo} className={cardClassName} />
      ))}
    </AnimatedCanopy>
  </div>
);
