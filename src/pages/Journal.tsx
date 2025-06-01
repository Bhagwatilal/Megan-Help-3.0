import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ChatbotPreview from "../components/ui/ChatbotPreview";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookCopy, 
  Calendar, 
  LineChart, 
  PlusCircle, 
  Save, 
  Trash2, 
  Edit, 
  ArrowLeft,
  List,
  CheckSquare,
  BarChart,
  Mountain,
  Map,
  MapPin,
  Brain
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import MoodChartVisualizations from "../components/journal/MoodChartVisualizations";
import AnalysisVisualization from "../components/journal/AnalysisVisualization";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Mood = "great" | "good" | "okay" | "bad" | "awful";

interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  mood: Mood;
  gratitude: string[];
}

interface AnalysisEntry {
  id: string;
  date: Date;
  answers: Record<string, number>;
  completed: boolean;
}

interface WeeklyAnalysis {
  weekOf: Date;
  averageScores: Record<string, number>;
  totalScore: number;
  recommendations: string[];
}

interface MonthlyAnalysis {
  monthOf: Date;
  averageScores: Record<string, number>;
  totalScore: number;
  recommendations: string[];
}

interface YearlyAnalysis {
  yearOf: number;
  averageScores: Record<string, number>;
  totalScore: number;
  recommendations: string[];
}

const moodEmojis: Record<Mood, string> = {
  great: "😄",
  good: "🙂",
  okay: "😐",
  bad: "😔",
  awful: "😞"
};

const moodColors: Record<Mood, string> = {
  great: "bg-green-500",
  good: "bg-green-300",
  okay: "bg-yellow-300",
  bad: "bg-orange-300",
  awful: "bg-red-300"
};

const JournalEntryComponent: React.FC<{ entry: JournalEntry; onDelete: () => void; onEdit: () => void }> = ({ 
  entry, 
  onDelete,
  onEdit
}) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span className="text-xl">{moodEmojis[entry.mood]}</span>
              {new Date(entry.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric' 
              })}
            </CardTitle>
            <CardDescription>
              {new Date(entry.date).toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={onEdit}
              className="p-1 text-gray-500 hover:text-mentii-500 rounded-full transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button 
              onClick={onDelete}
              className="p-1 text-gray-500 hover:text-red-500 rounded-full transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line text-sm">{entry.content}</p>
        
        {entry.gratitude.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Grateful for:</h4>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {entry.gratitude.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const NewJournalEntry: React.FC<{ onSave: (entry: Omit<JournalEntry, 'id'>) => void; onCancel: () => void }> = ({ 
  onSave,
  onCancel 
}) => {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood>("okay");
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(["", "", ""]);
  
  const handleGratitudeChange = (index: number, value: string) => {
    const newItems = [...gratitudeItems];
    newItems[index] = value;
    setGratitudeItems(newItems);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date: new Date(),
      content,
      mood,
      gratitude: gratitudeItems.filter(item => item.trim() !== "")
    });
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">New Journal Entry</CardTitle>
            <button 
              type="button" 
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          <CardDescription>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">How are you feeling today?</label>
            <div className="flex justify-between">
              {(Object.keys(moodEmojis) as Mood[]).map(moodKey => (
                <button
                  key={moodKey}
                  type="button"
                  onClick={() => setMood(moodKey)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                    mood === moodKey ? 'ring-2 ring-mentii-500 bg-mentii-50' : ''
                  }`}
                >
                  {moodEmojis[moodKey]}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="journal-content" className="block text-sm font-medium mb-2">
              Write your thoughts...
            </label>
            <textarea
              id="journal-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind today?"
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mentii-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              What are you grateful for today? (Optional)
            </label>
            <div className="space-y-2">
              {gratitudeItems.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) => handleGratitudeChange(index, e.target.value)}
                  placeholder={`I'm grateful for...`}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mentii-500"
                />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-mentii-500 text-white rounded-md hover:bg-mentii-600 transition-colors flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Save Entry
          </button>
        </CardFooter>
      </form>
    </Card>
  );
};

const EditJournalEntry: React.FC<{ entry: JournalEntry; onSave: (entry: JournalEntry) => void; onCancel: () => void }> = ({ 
  entry,
  onSave,
  onCancel 
}) => {
  const [content, setContent] = useState(entry.content);
  const [mood, setMood] = useState<Mood>(entry.mood);
  const [gratitudeItems, setGratitudeItems] = useState<string[]>(
    entry.gratitude.length > 0 
      ? [...entry.gratitude, ...Array(3 - entry.gratitude.length).fill("")]
      : ["", "", ""]
  );
  
  const handleGratitudeChange = (index: number, value: string) => {
    const newItems = [...gratitudeItems];
    newItems[index] = value;
    setGratitudeItems(newItems);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...entry,
      content,
      mood,
      gratitude: gratitudeItems.filter(item => item.trim() !== "")
    });
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Edit Journal Entry</CardTitle>
            <button 
              type="button" 
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          <CardDescription>
            {new Date(entry.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'short', 
              day: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">How were you feeling?</label>
            <div className="flex justify-between">
              {(Object.keys(moodEmojis) as Mood[]).map(moodKey => (
                <button
                  key={moodKey}
                  type="button"
                  onClick={() => setMood(moodKey)}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                    mood === moodKey ? 'ring-2 ring-mentii-500 bg-mentii-50' : ''
                  }`}
                >
                  {moodEmojis[moodKey]}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label htmlFor="journal-content" className="block text-sm font-medium mb-2">
              Your thoughts
            </label>
            <textarea
              id="journal-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mentii-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              What were you grateful for?
            </label>
            <div className="space-y-2">
              {gratitudeItems.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) => handleGratitudeChange(index, e.target.value)}
                  placeholder={`I'm grateful for...`}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mentii-500"
                />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-mentii-500 text-white rounded-md hover:bg-mentii-600 transition-colors flex items-center gap-1"
          >
            <Save className="h-4 w-4" />
            Update Entry
          </button>
        </CardFooter>
      </form>
    </Card>
  );
};

const MoodTrackerView: React.FC<{ entries: JournalEntry[] }> = ({ entries }) => {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  
  const groupedByDate: Record<string, JournalEntry[]> = {};
  
  entries.forEach(entry => {
    const dateStr = new Date(entry.date).toISOString().split('T')[0];
    if (!groupedByDate[dateStr]) {
      groupedByDate[dateStr] = [];
    }
    groupedByDate[dateStr].push(entry);
  });
  
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const calendarDays = Array.from({ length: firstDayOfMonth }, () => null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  
  const moodCounts: Record<Mood, number> = {
    great: 0,
    good: 0,
    okay: 0,
    bad: 0,
    awful: 0
  };
  
  entries.forEach(entry => {
    moodCounts[entry.mood]++;
  });
  
  // Prepare chart data
  const getMoodValue = (mood: Mood): number => {
    const moodValues: Record<Mood, number> = {
      great: 5,
      good: 4,
      okay: 3,
      bad: 2,
      awful: 1
    };
    return moodValues[mood];
  };
  
  const getFilteredEntries = () => {
    const now = new Date();
    let filterDate = new Date();
    
    if (period === "week") {
      filterDate.setDate(now.getDate() - 7);
    } else if (period === "month") {
      filterDate.setMonth(now.getMonth() - 1);
    } else {
      filterDate.setFullYear(now.getFullYear() - 1);
    }
    
    return entries.filter(entry => new Date(entry.date) >= filterDate);
  };
  
  const chartData = getFilteredEntries().map(entry => ({
    date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    mood: getMoodValue(entry.mood),
    moodLabel: entry.mood
  }));
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Mood Tracking</h2>
        <Select value={period} onValueChange={(value: "week" | "month" | "year") => setPeriod(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 days</SelectItem>
            <SelectItem value="month">Last 30 days</SelectItem>
            <SelectItem value="year">Last 365 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-mentii-500" />
          Mood Calendar
        </h3>
        
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
          
          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }
            
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEntries = groupedByDate[dateStr] || [];
            const dayMood = dayEntries.length > 0 
              ? dayEntries[dayEntries.length - 1].mood 
              : null;
            
            return (
              <div 
                key={`day-${day}`} 
                className={`aspect-square rounded flex flex-col items-center justify-center ${
                  dayMood ? moodColors[dayMood] : 'bg-gray-100'
                } ${today.getDate() === day && today.getMonth() === currentMonth ? 'ring-2 ring-mentii-500' : ''}`}
              >
                <span className="text-sm font-medium">{day}</span>
                {dayMood && (
                  <span className="text-lg">{moodEmojis[dayMood]}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <MoodChartVisualizations data={chartData} period={period} />
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <LineChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No mood data for this period</h3>
            <p className="text-gray-500 mb-6">Start journaling to track your moods over time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const questions = [
  {
    id: "accomplishment",
    text: "How much did you accomplish today?",
    options: [
      { value: 1, label: "Nothing at all" },
      { value: 2, label: "Very little" },
      { value: 3, label: "A few things" },
      { value: 4, label: "A good amount" },
      { value: 5, label: "Everything I wanted to" }
    ]
  },
  {
    id: "stress",
    text: "How stressed did you feel today?",
    options: [
      { value: 5, label: "Not at all stressed" },
      { value: 4, label: "Slightly stressed" },
      { value: 3, label: "Moderately stressed" },
      { value: 2, label: "Very stressed" },
      { value: 1, label: "Extremely stressed" }
    ]
  },
  {
    id: "sleep",
    text: "How well did you sleep last night?",
    options: [
      { value: 1, label: "Very poorly" },
      { value: 2, label: "Poorly" },
      { value: 3, label: "Average" },
      { value: 4, label: "Well" },
      { value: 5, label: "Very well" }
    ]
  },
  {
    id: "social",
    text: "How socially connected did you feel today?",
    options: [
      { value: 1, label: "Very isolated" },
      { value: 2, label: "Somewhat isolated" },
      { value: 3, label: "Neutral" },
      { value: 4, label: "Connected" },
      { value: 5, label: "Very connected" }
    ]
  },
  {
    id: "physical",
    text: "How physically active were you today?",
    options: [
      { value: 1, label: "Not active at all" },
      { value: 2, label: "Slightly active" },
      { value: 3, label: "Moderately active" },
      { value: 4, label: "Very active" },
      { value: 5, label: "Extremely active" }
    ]
  },
  {
    id: "nutrition",
    text: "How healthy were your food choices today?",
    options: [
      { value: 1, label: "Very unhealthy" },
      { value: 2, label: "Somewhat unhealthy" },
      { value: 3, label: "Average" },
      { value: 4, label: "Healthy" },
      { value: 5, label: "Very healthy" }
    ]
  },
  {
    id: "mindfulness",
    text: "How mindful or present were you today?",
    options: [
      { value: 1, label: "Not at all mindful" },
      { value: 2, label: "Rarely mindful" },
      { value: 3, label: "Sometimes mindful" },
      { value: 4, label: "Often mindful" },
      { value: 5, label: "Very mindful" }
    ]
  }
];

const generateRecommendations = (scores: Record<string, number>): string[] => {
  const recommendations: string[] = [];
  
  if (scores.stress <= 2) {
    recommendations.push("Try guided meditation sessions to reduce stress");
  }
  
  if (scores.sleep <= 3) {
    recommendations.push("Consider improving your sleep routine with calming music before bed");
  }
  
  if (scores.social <= 2) {
    recommendations.push("Schedule a meetup with friends or join community activities");
  }
  
  if (scores.physical <= 2) {
    recommendations.push("Add more physical activity like walking or yoga to your routine");
  }
  
  if (scores.nutrition <= 3) {
    recommendations.push("Focus on improving your nutrition with more whole foods");
  }
  
  if (scores.mindfulness <= 3) {
    recommendations.push("Practice mindfulness exercises daily");
  }
  
  if (scores.accomplishment <= 2) {
    recommendations.push("Try setting smaller, achievable goals to build momentum");
  }
  
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  const averageScore = totalScore / Object.keys(scores).length;
  
  if (averageScore <= 2.5) {
    recommendations.push("Consider a peaceful retreat to reconnect with yourself");
    recommendations.push("Try meditation sessions to improve mental wellbeing");
  } else if (averageScore <= 3.5) {
    recommendations.push("A day trip to nature could help refresh your mind");
    recommendations.push("Follow a guided walking route for light exercise and mindfulness");
  } else {
    recommendations.push("Plan an active adventure to maintain your positive momentum");
    recommendations.push("Visit new places to keep expanding your horizons");
  }
  
  return recommendations;
};

const AnalysisQuestionView: React.FC<{
  question: typeof questions[0];
  selected: number | null;
  onSelect: (value: number) => void;
}> = ({ question, selected, onSelect }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">{question.text}</h3>
      <div className="space-y-2">
        {question.options.map((option) => (
          <div
            key={option.value}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selected === option.value
                ? "border-mentii-500 bg-mentii-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onSelect(option.value)}
          >
            <div className="flex items-center">
              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                  selected === option.value
                    ? "border-mentii-500 bg-mentii-500 text-white"
                    : "border-gray-300"
                }`}
              >
                {selected === option.value && <CheckSquare className="w-3 h-3" />}
              </div>
              <span>{option.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DailyAnalysisView: React.FC<{
  onSave: (answers: Record<string, number>) => void;
  onCancel: () => void;
}> = ({ onSave, onCancel }) => {
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const handleSelect = (questionId: string, value: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };
  
  const handleSubmit = () => {
    const allAnswered = questions.every(q => answers[q.id] !== undefined && answers[q.id] !== null);
    
    if (!allAnswered) {
      toast({
        title: "Please answer all questions",
        description: "Complete all questions before submitting your daily analysis.",
        variant: "destructive"
      });
      return;
    }
    
    const validAnswers = Object.entries(answers).reduce((acc, [key, value]) => {
      acc[key] = value !== null ? value : 3;
      return acc;
    }, {} as Record<string, number>);
    
    onSave(validAnswers);
    toast({
      title: "Analysis saved",
      description: "Your daily analysis has been recorded.",
    });
  };
  
  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;
  const isFirstQuestion = currentQuestion === 0;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Daily Check-in</CardTitle>
          <button 
            type="button" 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        </div>
        <CardDescription>
          {currentQuestion + 1} of {questions.length} questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AnalysisQuestionView
          question={question}
          selected={answers[question.id] || null}
          onSelect={(value) => handleSelect(question.id, value)}
        />
        
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-mentii-500 h-full"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          className={`px-4 py-2 border rounded-md ${
            isFirstQuestion
              ? "border-gray-200 text-gray-400 cursor-not-allowed"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          Previous
        </button>
        
        {isLastQuestion ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-mentii-500 text-white rounded-md hover:bg-mentii-600 transition-colors"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={answers[question.id] === undefined || answers[question.id] === null}
            className={`px-4 py-2 rounded-md ${
              answers[question.id] === undefined || answers[question.id] === null
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-mentii-500 text-white hover:bg-mentii-600"
            }`}
          >
            Next
          </button>
        )}
      </CardFooter>
    </Card>
  );
};

const AnalysisListView: React.FC<{
  entries: AnalysisEntry[];
  weeklyAnalysis: WeeklyAnalysis[];
  monthlyAnalysis: MonthlyAnalysis[];
  yearlyAnalysis: YearlyAnalysis[];
  questions: typeof questions;
  onNewEntry: () => void;
}> = ({ 
  entries, 
  weeklyAnalysis, 
  monthlyAnalysis,
  yearlyAnalysis,
  questions,
  onNewEntry 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("week");
  const [selectedWeek, setSelectedWeek] = useState<WeeklyAnalysis | null>(
    weeklyAnalysis.length > 0 ? weeklyAnalysis[0] : null
  );
  const [selectedMonth, setSelectedMonth] = useState<MonthlyAnalysis | null>(
    monthlyAnalysis.length > 0 ? monthlyAnalysis[0] : null
  );
  const [selectedYear, setSelectedYear] = useState<YearlyAnalysis | null>(
    yearlyAnalysis.length > 0 ? yearlyAnalysis[0] : null
  );
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hasTodayEntry = entries.some(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
  
  const streakDays = (() => {
    let streak = 0;
    const sortedEntries = [...entries].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    if (sortedEntries.length === 0) return 0;
    
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sortedEntries.length; i++) {
      const entryDate = new Date(sortedEntries[i].date);
      entryDate.setHours(0, 0, 0, 0);
      
      if (entryDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  })();

  const getCurrentAnalysis = () => {
    switch(selectedPeriod) {
      case "week": return selectedWeek;
      case "month": return selectedMonth;
      case "year": return selectedYear;
      default: return selectedWeek;
    }
  };

  const getAnalysisList = () => {
    switch(selectedPeriod) {
      case "week": return weeklyAnalysis;
      case "month": return monthlyAnalysis;
      case "year": return yearlyAnalysis;
      default: return weeklyAnalysis;
    }
  };

  const handleDownloadReport = () => {
    const analysis = getCurrentAnalysis();
    if (!analysis) return;

    let reportContent = `Mentii Mental Health Analysis Report\n`;
    reportContent += `Period: ${selectedPeriod === "week" ? "Weekly" : selectedPeriod === "month" ? "Monthly" : "Yearly"}\n`;
    reportContent += `Date: ${new Date().toLocaleDateString()}\n\n`;
    
    reportContent += `Overall Score: ${(
      Object.values(analysis.averageScores).reduce((sum, score) => sum + score, 0) / 
      Object.keys(analysis.averageScores).length
    ).toFixed(1)}/5\n\n`;
    
    reportContent += `Category Scores:\n`;
    Object.entries(analysis.averageScores).forEach(([key, score]) => {
      const question = questions.find(q => q.id === key);
      if (question) {
        reportContent += `${question.text}: ${score.toFixed(1)}/5\n`;
      }
    });
    
    reportContent += `\nRecommendations:\n`;
    analysis.recommendations.forEach((rec, i) => {
      reportContent += `${i+1}. ${rec}\n`;
    });
    
    const blob = new Blob([reportContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mentii-analysis-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report downloaded",
      description: `Your ${selectedPeriod}ly analysis report has been downloaded.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Activity Analysis</CardTitle>
          <CardDescription>Track your daily activities and get personalized recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-mentii-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-1">Check-in Streak</p>
              <p className="text-2xl font-bold text-mentii-700">{streakDays} days</p>
            </div>
            <div className="bg-mentii-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-1">Total Check-ins</p>
              <p className="text-2xl font-bold text-mentii-700">{entries.length}</p>
            </div>
            <div className="bg-mentii-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500 mb-1">Analysis Reports</p>
              <p className="text-2xl font-bold text-mentii-700">
                {weeklyAnalysis.length + monthlyAnalysis.length + yearlyAnalysis.length}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              onClick={onNewEntry}
              disabled={hasTodayEntry}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                hasTodayEntry
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-mentii-500 text-white hover:bg-mentii-600"
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              {hasTodayEntry ? "Today's check-in completed" : "Complete today's check-in"}
            </button>
          </div>
        </CardContent>
      </Card>
      
      {weeklyAnalysis.length > 0 || monthlyAnalysis.length > 0 || yearlyAnalysis.length > 0 ? (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-mentii-500" />
              Analysis Dashboard
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-2">
              <Tabs value={selectedPeriod} onValueChange={value => setSelectedPeriod(value as "week" | "month" | "year")}>
                <TabsList>
                  <TabsTrigger value="week">Weekly</TabsTrigger>
                  <TabsTrigger value="month">Monthly</TabsTrigger>
                  <TabsTrigger value="year">Yearly</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Select 
                value={
                  selectedPeriod === "week" 
                    ? selectedWeek ? selectedWeek.weekOf.toISOString() : ""
                    : selectedPeriod === "month"
                    ? selectedMonth ? selectedMonth.monthOf.toISOString() : ""
                    : selectedYear ? selectedYear.yearOf.toString() : ""
                }
                onValueChange={value => {
                  if (selectedPeriod === "week") {
                    const week = weeklyAnalysis.find(w => w.weekOf.toISOString() === value);
                    if (week) setSelectedWeek(week);
                  } else if (selectedPeriod === "month") {
                    const month = monthlyAnalysis.find(m => m.monthOf.toISOString() === value);
                    if (month) setSelectedMonth(month);
                  } else {
                    const year = yearlyAnalysis.find(y => y.yearOf.toString() === value);
                    if (year) setSelectedYear(year);
                  }
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={`Select ${selectedPeriod}`} />
                </SelectTrigger>
                <SelectContent>
                  {selectedPeriod === "week" && weeklyAnalysis.map((analysis, index) => (
                    <SelectItem key={index} value={analysis.weekOf.toISOString()}>
                      Week of {new Date(analysis.weekOf).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </SelectItem>
                  ))}
                  {selectedPeriod === "month" && monthlyAnalysis.map((analysis, index) => (
                    <SelectItem key={index} value={analysis.monthOf.toISOString()}>
                      {new Date(analysis.monthOf).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </SelectItem>
                  ))}
                  {selectedPeriod === "year" && yearlyAnalysis.map((analysis, index) => (
                    <SelectItem key={index} value={analysis.yearOf.toString()}>
                      {analysis.yearOf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {getCurrentAnalysis() ? (
              <AnalysisVisualization 
                scores={getCurrentAnalysis()!.averageScores}
                questions={questions}
                period={selectedPeriod}
                onDownload={handleDownloadReport}
              />
            ) : (
              <div className="text-center py-8">
                <p>No analysis available for the selected period.</p>
              </div>
            )}
            
            {getCurrentAnalysis() && (
              <div className="mt-8">
                <div className="bg-mentii-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <LineChart className="h-4 w-4 text-mentii-500" />
                    Overall Score
                  </h4>
                  <div className="text-3xl font-bold text-mentii-700">
                    {(getCurrentAnalysis()!.totalScore / 7).toFixed(1)}<span className="text-lg font-normal text-gray-500">/5</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-3">Recommendations</h4>
                  <ul className="space-y-2">
                    {getCurrentAnalysis()!.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        <div className="text-green-600 mt-1 shrink-0">
                          {recommendation.toLowerCase().includes("meditation") && <Brain className="h-4 w-4" />}
                          {recommendation.toLowerCase().includes("trip") && <Mountain className="h-4 w-4" />}
                          {recommendation.toLowerCase().includes("route") && <Map className="h-4 w-4" />}
                          {recommendation.toLowerCase().includes("visit") && <MapPin className="h-4 w-4" />}
                          {!recommendation.toLowerCase().includes("meditation") && 
                           !recommendation.toLowerCase().includes("trip") && 
                           !recommendation.toLowerCase().includes("route") && 
                           !recommendation.toLowerCase().includes("visit") && 
                           <CheckSquare className="h-4 w-4" />}
                        </div>
                        <div>
                          <span>{recommendation}</span>
                          {recommendation.toLowerCase().includes("meditation") && (
                            <Link to="/activities?filter=meditation" className="block text-xs text-mentii-600 hover:underline mt-1">
                              Try a meditation activity →
                            </Link>
                          )}
                          {recommendation.toLowerCase().includes("physical") && (
                            <Link to="/activities?filter=physical" className="block text-xs text-mentii-600 hover:underline mt-1">
                              Browse physical activities →
                            </Link>
                          )}
                          {recommendation.toLowerCase().includes("community") && (
                            <Link to="/activities?filter=social" className="block text-xs text-mentii-600 hover:underline mt-1">
                              Find social activities →
                            </Link>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-gray-50">
          <CardContent className="text-center py-12">
            <BarChart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No analysis yet</h3>
            <p className="text-gray-500 mb-6">Complete at least 5 daily check-ins to get your first weekly analysis.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Journal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      content: "Today was a pretty good day overall. I went for a walk in the park and the fresh air really helped clear my mind. I've been feeling less anxious lately and I'm proud of myself for sticking to my meditation practice.",
      mood: "good",
      gratitude: [
        "My morning coffee",
        "The sunny weather",
        "My supportive friends"
      ]
    },
    {
      id: "2",
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      content: "I had a stressful day at work today. Too many deadlines and not enough time. I need to remember to take breaks and breathe when things get overwhelming.",
      mood: "bad",
      gratitude: [
        "My comfortable bed",
        "My favorite TV show"
      ]
    }
  ]);
  
  const [view, setView] = useState<"list" | "new" | "edit" | "analyze" | null>("list");
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  
  const [analysisEntries, setAnalysisEntries] = useState<AnalysisEntry[]>([
    {
      id: "a1",
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
      answers: {
        accomplishment: 4,
        stress: 3,
        sleep: 4,
        social: 3,
        physical: 2,
        nutrition: 3,
        mindfulness: 3
      },
      completed: true
    },
    {
      id: "a2",
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      answers: {
        accomplishment: 3,
        stress: 2,
        sleep: 3,
        social: 4,
        physical: 3,
        nutrition: 4,
        mindfulness: 2
      },
      completed: true
    },
    {
      id: "a3",
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      answers: {
        accomplishment: 5,
        stress: 4,
        sleep: 4,
        social: 5,
        physical: 4,
        nutrition: 3,
        mindfulness: 4
      },
      completed: true
    },
    {
      id: "a4",
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      answers: {
        accomplishment: 4,
        stress: 3,
        sleep: 5,
        social: 3,
        physical: 4,
        nutrition: 4,
        mindfulness: 3
      },
      completed: true
    },
    {
      id: "a5",
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      answers: {
        accomplishment: 3,
        stress: 2,
        sleep: 3,
        social: 2,
        physical: 3,
        nutrition: 3,
        mindfulness: 2
      },
      completed: true
    }
  ]);
  
  const [weeklyAnalysis, setWeeklyAnalysis] = useState<WeeklyAnalysis[]>([
    {
      weekOf: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      averageScores: {
        accomplishment: 3.8,
        stress: 2.8,
        sleep: 3.8,
        social: 3.4,
        physical: 3.2,
        nutrition: 3.4,
        mindfulness: 2.8
      },
      totalScore: 23.2,
      recommendations: [
        "Try guided meditation sessions to improve mindfulness",
        "Consider a day trip to nature to refresh your mind",
        "Follow a walking route for light exercise and stress relief",
        "Practice mindfulness exercises daily"
      ]
    }
  ]);
  
  const [monthlyAnalysis, setMonthlyAnalysis] = useState<MonthlyAnalysis[]>([
    {
      monthOf: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
      averageScores: {
        accomplishment: 3.5,
        stress: 3.0,
        sleep: 3.6,
        social: 3.2,
        physical: 2.9,
        nutrition: 3.3,
        mindfulness: 2.7
      },
      totalScore: 22.2,
      recommendations: [
        "Consider joining a meditation group for improved mindfulness",
        "Plan a weekend nature retreat to recharge",
        "Try a new physical activity to boost your energy levels",
        "Establish a consistent sleep schedule to improve rest quality"
      ]
    }
  ]);
  
  const [yearlyAnalysis, setYearlyAnalysis] = useState<YearlyAnalysis[]>([
    {
      yearOf: new Date().getFullYear(),
      averageScores: {
        accomplishment: 3.6,
        stress: 3.1,
        sleep: 3.7,
        social: 3.3,
        physical: 3.0,
        nutrition: 3.4,
        mindfulness: 2.9
      },
      totalScore: 23.0,
      recommendations: [
        "Consider taking a mindfulness course to deepen your practice",
        "Plan seasonal outdoor activities to connect with nature",
        "Try different workout routines throughout the year",
        "Explore social groups aligned with your interests"
      ]
    }
  ]);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const hasTodayEntry = entries.some(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
  
  const handleNewEntry = () => {
    setView("new");
  };
  
  const handleEditEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setView("edit");
  };
  
  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };
  
  const handleSaveNewEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entry,
      id: Date.now().toString()
    };
    setEntries([newEntry, ...entries]);
    setView("list");
    toast({
      title: "Journal entry saved",
      description: "Your journal entry has been recorded."
    });
  };
  
  const handleUpdateEntry = (updatedEntry: JournalEntry) => {
    setEntries(entries.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
    setView("list");
    setCurrentEntry(null);
    toast({
      title: "Journal entry updated",
      description: "Your journal entry has been updated."
    });
  };
  
  const handleCancelEdit = () => {
    setView("list");
    setCurrentEntry(null);
  };
  
  const handleNewAnalysis = () => {
    setView("analyze");
  };
  
  const handleSaveAnalysis = (answers: Record<string, number>) => {
    const newAnalysis: AnalysisEntry = {
      id: Date.now().toString(),
      date: new Date(),
      answers,
      completed: true
    };
    
    setAnalysisEntries([newAnalysis, ...analysisEntries]);
    setView("list");
    
    // Check if we should generate a weekly report
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentEntries = [...analysisEntries, newAnalysis].filter(
      entry => new Date(entry.date) >= oneWeekAgo
    );
    
    if (recentEntries.length >= 5) {
      generateNewWeeklyAnalysis(recentEntries);
    }
    
    // Check if we should generate a monthly report
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const monthEntries = [...analysisEntries, newAnalysis].filter(
      entry => new Date(entry.date) >= oneMonthAgo
    );
    
    if (monthEntries.length >= 15) {
      generateNewMonthlyAnalysis(monthEntries);
    }
    
    // Check if we should generate a yearly report
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    const yearEntries = [...analysisEntries, newAnalysis].filter(
      entry => new Date(entry.date) >= oneYearAgo
    );
    
    if (yearEntries.length >= 50) {
      generateNewYearlyAnalysis(yearEntries);
    }
  };
  
  const generateNewWeeklyAnalysis = (entries: AnalysisEntry[]) => {
    const totalScores: Record<string, number> = {};
    let entryCount = 0;
    
    entries.forEach(entry => {
      Object.entries(entry.answers).forEach(([key, value]) => {
        if (!totalScores[key]) totalScores[key] = 0;
        totalScores[key] += value;
      });
      entryCount++;
    });
    
    const averageScores: Record<string, number> = {};
    Object.entries(totalScores).forEach(([key, total]) => {
      averageScores[key] = total / entryCount;
    });
    
    const totalScore = Object.values(averageScores).reduce((sum, score) => sum + score, 0);
    
    const recommendations = generateRecommendations(averageScores);
    
    const newWeeklyAnalysis: WeeklyAnalysis = {
      weekOf: new Date(),
      averageScores,
      totalScore,
      recommendations
    };
    
    setWeeklyAnalysis([newWeeklyAnalysis, ...weeklyAnalysis]);
    
    toast({
      title: "Weekly analysis generated",
      description: "Your weekly activity analysis is now available.",
    });
  };
  
  const generateNewMonthlyAnalysis = (entries: AnalysisEntry[]) => {
    const totalScores: Record<string, number> = {};
    let entryCount = 0;
    
    entries.forEach(entry => {
      Object.entries(entry.answers).forEach(([key, value]) => {
        if (!totalScores[key]) totalScores[key] = 0;
        totalScores[key] += value;
      });
      entryCount++;
    });
    
    const averageScores: Record<string, number> = {};
    Object.entries(totalScores).forEach(([key, total]) => {
      averageScores[key] = total / entryCount;
    });
    
    const totalScore = Object.values(averageScores).reduce((sum, score) => sum + score, 0);
    
    const recommendations = generateRecommendations(averageScores);
    
    const newMonthlyAnalysis: MonthlyAnalysis = {
      monthOf: new Date(),
      averageScores,
      totalScore,
      recommendations: [
        ...recommendations,
        "Consider setting monthly goals for your personal growth",
        "Review your patterns and habits from the past month"
      ]
    };
    
    setMonthlyAnalysis([newMonthlyAnalysis, ...monthlyAnalysis]);
    
    toast({
      title: "Monthly analysis generated",
      description: "Your monthly activity analysis is now available.",
    });
  };
  
  const generateNewYearlyAnalysis = (entries: AnalysisEntry[]) => {
    const totalScores: Record<string, number> = {};
    let entryCount = 0;
    
    entries.forEach(entry => {
      Object.entries(entry.answers).forEach(([key, value]) => {
        if (!totalScores[key]) totalScores[key] = 0;
        totalScores[key] += value;
      });
      entryCount++;
    });
    
    const averageScores: Record<string, number> = {};
    Object.entries(totalScores).forEach(([key, total]) => {
      averageScores[key] = total / entryCount;
    });
    
    const totalScore = Object.values(averageScores).reduce((sum, score) => sum + score, 0);
    
    const recommendations = generateRecommendations(averageScores);
    
    const newYearlyAnalysis: YearlyAnalysis = {
      yearOf: new Date().getFullYear(),
      averageScores,
      totalScore,
      recommendations: [
        ...recommendations,
        "Reflect on your long-term goals and aspirations",
        "Plan a significant personal development activity for the coming year",
        "Consider a multi-day retreat or wellness vacation"
      ]
    };
    
    setYearlyAnalysis([newYearlyAnalysis, ...yearlyAnalysis]);
    
    toast({
      title: "Yearly analysis generated",
      description: "Your yearly activity analysis is now available.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Journal & Tracker</h1>
          <p className="text-center text-lg text-muted-foreground mb-8">
            Track your moods, express your thoughts, and analyze your daily activities for better well-being.
          </p>
          
          <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="journal" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList>
                  <TabsTrigger value="journal" className="flex items-center gap-1">
                    <BookCopy className="h-4 w-4" />
                    <span>Journal</span>
                  </TabsTrigger>
                  <TabsTrigger value="mood-tracker" className="flex items-center gap-1">
                    <LineChart className="h-4 w-4" />
                    <span>Mood Tracker</span>
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="flex items-center gap-1">
                    <BarChart className="h-4 w-4" />
                    <span>Analysis</span>
                  </TabsTrigger>
                </TabsList>
                
                {view === "list" && (
                  <button
                    onClick={handleNewEntry}
                    className="bg-mentii-500 text-white px-4 py-2 rounded-md hover:bg-mentii-600 transition-colors flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>New Entry</span>
                  </button>
                )}
              </div>
              
              <TabsContent value="journal" className="m-0">
                {view === "new" && (
                  <NewJournalEntry onSave={handleSaveNewEntry} onCancel={handleCancelEdit} />
                )}
                
                {view === "edit" && currentEntry && (
                  <EditJournalEntry 
                    entry={currentEntry} 
                    onSave={handleUpdateEntry} 
                    onCancel={handleCancelEdit} 
                  />
                )}
                
                {view === "list" && (
                  <div className="space-y-4">
                    {entries.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <BookCopy className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No journal entries yet</h3>
                        <p className="text-gray-500 mb-6">Start writing your thoughts to track your mood and feelings.</p>
                        <button 
                          onClick={handleNewEntry}
                          className="bg-mentii-500 text-white px-4 py-2 rounded-md hover:bg-mentii-600 transition-colors"
                        >
                          Create your first entry
                        </button>
                      </div>
                    ) : (
                      entries
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map(entry => (
                          <JournalEntryComponent 
                            key={entry.id} 
                            entry={entry} 
                            onDelete={() => handleDeleteEntry(entry.id)}
                            onEdit={() => handleEditEntry(entry)}
                          />
                        ))
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="mood-tracker" className="m-0">
                <MoodTrackerView entries={entries} />
              </TabsContent>
              
              <TabsContent value="analysis" className="m-0">
                {view === "analyze" ? (
                  <DailyAnalysisView 
                    onSave={handleSaveAnalysis} 
                    onCancel={handleCancelEdit} 
                  />
                ) : (
                  <AnalysisListView 
                    entries={analysisEntries}
                    weeklyAnalysis={weeklyAnalysis}
                    monthlyAnalysis={monthlyAnalysis}
                    yearlyAnalysis={yearlyAnalysis}
                    questions={questions}
                    onNewEntry={handleNewAnalysis}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
      <ChatbotPreview />
    </div>
  );
};

export default Journal;
