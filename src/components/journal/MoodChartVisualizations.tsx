import React from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

type MoodDataPoint = {
  date: string;
  mood: number;
  moodLabel: string;
};

const moodToScore = {
  "great": 5,
  "good": 4,
  "okay": 3,
  "bad": 2,
  "awful": 1
};

const scoresToMood: Record<number, string> = {
  5: "great",
  4: "good",
  3: "okay",
  2: "bad",
  1: "awful"
};

interface MoodChartVisualizationsProps {
  data: MoodDataPoint[];
  period: "week" | "month" | "year";
}

const moodColors = {
  moodLine: {
    light: "#8B5CF6",
    dark: "#A78BFA"
  },
  greatBar: {
    light: "#10B981",
    dark: "#34D399"
  },
  goodBar: {
    light: "#22C55E", 
    dark: "#4ADE80"
  },
  okayBar: {
    light: "#FBBF24",
    dark: "#FCD34D"
  },
  badBar: {
    light: "#F97316",
    dark: "#FB923C"
  },
  awfulBar: {
    light: "#EF4444",
    dark: "#F87171"
  }
};

export const MoodChartVisualizations: React.FC<MoodChartVisualizationsProps> = ({ data, period }) => {
  const getBarChartData = () => {
    const moodCounts: Record<string, number> = {
      "great": 0,
      "good": 0,
      "okay": 0,
      "bad": 0,
      "awful": 0
    };
    
    data.forEach(point => {
      moodCounts[point.moodLabel]++;
    });
    
    return Object.entries(moodCounts).map(([mood, count]) => ({
      mood,
      count,
      color: getMoodColor(mood)
    }));
  };
  
  const getMoodColor = (mood: string) => {
    switch(mood) {
      case "great": return "var(--color-greatBar)";
      case "good": return "var(--color-goodBar)";
      case "okay": return "var(--color-okayBar)";
      case "bad": return "var(--color-badBar)";
      case "awful": return "var(--color-awfulBar)";
      default: return "var(--color-okayBar)";
    }
  };
  
  const barChartData = getBarChartData();
  
  const chartConfig = {
    moodLine: {
      theme: {
        light: moodColors.moodLine.light,
        dark: moodColors.moodLine.dark,
      },
      label: "Mood",
    },
    greatBar: {
      theme: {
        light: moodColors.greatBar.light,
        dark: moodColors.greatBar.dark,
      },
      label: "Great",
    },
    goodBar: {
      theme: {
        light: moodColors.goodBar.light,
        dark: moodColors.goodBar.dark,
      },
      label: "Good",
    },
    okayBar: {
      theme: {
        light: moodColors.okayBar.light,
        dark: moodColors.okayBar.dark,
      },
      label: "Okay",
    },
    badBar: {
      theme: {
        light: moodColors.badBar.light,
        dark: moodColors.badBar.dark,
      },
      label: "Bad",
    },
    awfulBar: {
      theme: {
        light: moodColors.awfulBar.light,
        dark: moodColors.awfulBar.dark,
      },
      label: "Awful",
    },
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "week":
        return "Weekly";
      case "month":
        return "Monthly";
      case "year":
        return "Yearly";
      default:
        return "Weekly";
    }
  };

  if (data.length === 0) {
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-lg font-medium mb-4">
            {getPeriodLabel()} Mood Data
          </h3>
          <p className="text-gray-500">No mood data available for this period. Start tracking your mood to see trends.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">
          {getPeriodLabel()} Mood Trend
        </h3>
        <div className="h-64 max-h-64 overflow-hidden">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis 
                  domain={[0, 5]} 
                  ticks={[1, 2, 3, 4, 5]} 
                  tickFormatter={(value) => scoresToMood[value] || ""} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Date:</div>
                            <div>{data.date}</div>
                            <div className="font-medium">Mood:</div>
                            <div className="capitalize">{data.moodLabel}</div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="var(--color-moodLine)"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">
          {getPeriodLabel()} Mood Distribution
        </h3>
        <div className="h-64 max-h-64 overflow-hidden">
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={barChartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mood" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="font-medium">Mood:</div>
                            <div className="capitalize">{data.mood}</div>
                            <div className="font-medium">Count:</div>
                            <div>{data.count} entries</div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="count" 
                  name="Count" 
                  isAnimationActive={true}
                >
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default MoodChartVisualizations;
