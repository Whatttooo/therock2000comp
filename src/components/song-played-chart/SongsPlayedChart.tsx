"use client";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const defaultChartData = [{ songsPlayed: 550, fill: "var(--color-primary)" }];

const chartConfig = {
  songsPlayed: {
    label: "Songs played",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface SongsPlayedChartProps {
  chartData?: {
    songsPlayed: number;
    fill: string;
  }[];
  endAngle: number;
  size?: "default" | "compact";
}

export function SongsPlayedChart({
  chartData = defaultChartData,
  endAngle,
  size = "default",
}: SongsPlayedChartProps) {
  const isCompact = size === "compact";
  const isMobile = useIsMobile();
  // Compact mode still shrinks on mobile (where card width is tight), but on
  // desktop it should fill the extra room a 4-column stat-card grid leaves
  // rather than sit small in a mostly-empty card. Default mode (the homepage
  // hero chart) is now responsive too, rather than one large fixed size.
  const outerRadius = isCompact ? (isMobile ? 46 : 85) : isMobile ? 60 : 78;
  const innerRadius = isCompact ? (isMobile ? 36 : 70) : isMobile ? 48 : 64;

  return (
    <Card
      size={isCompact ? "sm" : "default"}
      className={cn(
        "flex flex-col w-full md:gap-(--card-spacing) gap-2  md:mx-0 md:w-fit md:min-w-[220px]",
        isCompact && "mx-0 w-full md:w-full md:min-w-0",
      )}
    >
      <CardHeader className="items-center pb-0">
        <CardTitle className={cn(isCompact && "text-sm md:text-base")}>
          Songs played
        </CardTitle>
        {!isCompact && <CardDescription>2026</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className={cn(
            "mx-auto aspect-square max-h-[150px] md:max-h-[190px]",
            isCompact && "max-h-[110px] md:max-h-[200px]",
          )}
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={endAngle}
            outerRadius={outerRadius} // must be < (container size / 2) - 10px (so 100 container means max is 40 here)
            innerRadius={innerRadius}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[outerRadius, innerRadius]}
            />
            <RadialBar dataKey="songsPlayed" background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className={cn(
                            "fill-foreground font-bold",
                            isCompact
                              ? isMobile
                                ? "text-lg"
                                : "text-3xl"
                              : isMobile
                                ? "text-2xl"
                                : "text-3xl",
                          )}
                        >
                          {chartData[0].songsPlayed.toLocaleString()}
                        </tspan>
                        {!isCompact && (
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Songs played
                          </tspan>
                        )}
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
