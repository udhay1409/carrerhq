import { useId } from "react";

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: [number, number][];
  size?: number;
}) => {
  // Use deterministic pattern to avoid hydration mismatch
  const defaultPattern: [number, number][] = [
    [7, 2],
    [8, 3],
    [9, 1],
    [10, 4],
    [7, 5],
  ];

  const p: [number, number][] = pattern ?? defaultPattern;
  return (
    <div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r from-primary-100/30 to-primary-300/30 dark:from-primary-900/30 dark:to-primary-800/30 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay fill-primary-900/20 stroke-primary-900/20 dark:fill-primary-100/20 dark:stroke-primary-100/20"
        />
      </div>
    </div>
  );
};

interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
  width: number;
  height: number;
  x: string;
  y: string;
  squares?: [number, number][];
}

export function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: GridPatternProps) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares
            .filter(
              (
                square: [number, number],
                index: number,
                arr: [number, number][]
              ) => {
                // Remove duplicates by checking if this is the first occurrence
                const [sx, sy] = square;
                return (
                  arr.findIndex(([x, y]) => x === sx && y === sy) === index
                );
              }
            )
            .map(([squareX, squareY]: [number, number], index: number) => (
              <rect
                strokeWidth="0"
                key={`${squareX}-${squareY}-${index}`}
                width={width + 1}
                height={height + 1}
                x={squareX * width}
                y={squareY * height}
              />
            ))}
        </svg>
      )}
    </svg>
  );
}
