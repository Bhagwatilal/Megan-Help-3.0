import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface AnalysisVisualizationProps {
  scores: Record<string, number>;
  questions: Array<{
    id: string;
    text: string;
  }>;
  period: "week" | "month" | "year";
  onDownload: () => void;
}

const AnalysisVisualization: React.FC<AnalysisVisualizationProps> = ({
  scores,
  questions,
  period,
  onDownload
}) => {
  const radarData = Object.entries(scores).map(([id, score]) => {
    const question = questions.find(q => q.id === id);
    return {
      subject: question ? question.text.split('?')[0] : id,
      score: score,
      fullMark: 5,
    };
  });

  const barData = Object.entries(scores).map(([id, score]) => {
    const question = questions.find(q => q.id === id);
    return {
      name: question ? question.id : id,
      score: score,
      fullText: question ? question.text : id,
    };
  });

  const chartConfig = {
    radar: {
      theme: {
        light: "#8B5CF6",
        dark: "#A78BFA",
      },
      label: "Performance",
    },
    barScore: {
      theme: {
        light: "#10B981",
        dark: "#34D399",
      },
      label: "Score",
    },
  };

  const getPeriodTitle = () => {
    switch(period) {
      case "week": return "Weekly";
      case "month": return "Monthly";
      case "year": return "Yearly";
      default: return "Weekly";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">{getPeriodTitle()} Analysis</h3>
        <Button onClick={onDownload} variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-medium mb-4">Performance Radar</h4>
          <div className="h-80">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="var(--color-radar)"
                    fill="var(--color-radar)"
                    fillOpacity={0.6}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-medium mb-4">Category Scores</h4>
          <div className="h-80">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 5]} />
                  <YAxis dataKey="name" type="category" width={100} />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-lg border bg-background p-2 shadow-sm">
                            <div className="font-medium mb-1">{data.fullText}</div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>Score:</div>
                              <div>{data.score}/5</div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="score" fill="var(--color-barScore)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisVisualization;
