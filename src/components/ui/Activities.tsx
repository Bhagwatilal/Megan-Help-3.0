import React from "react";
import { Link } from "react-router-dom";
import { Brush, Puzzle, BookCopy, Music } from "lucide-react";

interface ActivityCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  title,
  description,
  icon,
  color,
  link,
}) => {
  return (
    <Link
      to={link}
      className="glass-card p-6 flex flex-col items-center text-center hover:translate-y-[-5px] hover:shadow-lg transition-all duration-300"
    >
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${color}`}
      >
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </Link>
  );
};

const Activities: React.FC = () => {
  const activities = [
    {
      title: "Creative Drawing",
      description: "Express yourself through art with our digital drawing board",
      icon: <Brush className="h-6 w-6 text-white" />,
      color: "bg-mentii-500",
      link: "/activities#drawing",
    },
    {
      title: "Brain Puzzles",
      description: "Challenge your mind with puzzles and brain teasers",
      icon: <Puzzle className="h-6 w-6 text-white" />,
      color: "bg-lavender-500",
      link: "/activities#puzzles",
    },
    {
      title: "Guided Journaling",
      description: "Write your thoughts and feelings in a structured way",
      icon: <BookCopy className="h-6 w-6 text-white" />,
      color: "bg-sunset-500",
      link: "/journal",
    },
    {
      title: "Mood Music",
      description: "Listen to curated playlists based on your mood",
      icon: <Music className="h-6 w-6 text-white" />,
      color: "bg-mint-500",
      link: "/music",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {activities.map((activity, index) => (
        <ActivityCard
          key={index}
          {...activity}
        />
      ))}
    </div>
  );
};

export default Activities;
