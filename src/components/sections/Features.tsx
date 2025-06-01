import React, { useEffect, useRef } from "react";
import { MessageSquare, Gamepad2, Music, BookOpen } from "lucide-react";
import MemeCarousel from "../ui/MemeCarousel";
import { Link } from "react-router-dom";

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
  link: string;
}

const Feature: React.FC<FeatureProps> = ({
  title,
  description,
  icon,
  delay = 0,
  link,
}) => {
  const featureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("animate-scale-up");
              entry.target.classList.remove("opacity-0");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (featureRef.current) {
      observer.observe(featureRef.current);
    }

    return () => {
      if (featureRef.current) {
        observer.unobserve(featureRef.current);
      }
    };
  }, [delay]);

  return (
    <Link to={link}>
      <div
        ref={featureRef}
        className="glass-card p-6 opacity-0 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-mentii-500 to-lavender-500 flex items-center justify-center mb-4 shadow-glow-sm">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
};

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const memeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === titleRef.current) {
              entry.target.classList.add("animate-slide-up");
              entry.target.classList.remove("opacity-0");
            }
            if (entry.target === memeRef.current) {
              entry.target.classList.add("animate-scale-up");
              entry.target.classList.remove("opacity-0");
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    if (memeRef.current) observer.observe(memeRef.current);

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      if (memeRef.current) observer.unobserve(memeRef.current);
    };
  }, []);

  const features = [
    {
      title: "AI Companion",
      description:
        "Chat with our friendly AI for support, guidance, and a listening ear whenever you need it.",
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      delay: 100,
      link: "/chat",
    },
    {
      title: "Mind Games",
      description:
        "Engage with fun games designed to distract your mind from stress and anxiety.",
      icon: <Gamepad2 className="h-6 w-6 text-white" />,
      delay: 200,
      link: "/games",
    },
    {
      title: "Mood Music",
      description:
        "Listen to curated playlists or sing along with karaoke to boost your mood.",
      icon: <Music className="h-6 w-6 text-white" />,
      delay: 300,
      link: "/music",
    },
    {
      title: "Journaling",
      description:
        "Track your moods and express your thoughts with our guided journaling tools.",
      icon: <BookOpen className="h-6 w-6 text-white" />,
      delay: 400,
      link: "/journal",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-20 px-4 bg-gradient-to-b from-white to-mentii-50"
    >
      <div className="container mx-auto">
        <h2
          ref={titleRef}
          className="text-3xl md:text-4xl font-bold text-center mb-16 opacity-0"
        >
          Find <span className="gradient-text">Balance</span> in Your Day
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div 
            ref={memeRef}
            className="opacity-0"
          >
            <MemeCarousel className="shadow-lg" />
          </div>

          <div className="space-y-8 flex flex-col justify-center">
            <div className="space-y-2">
              <p className="text-sm font-medium text-mentii-600 uppercase tracking-wider">
                Daily Dose of Laughter
              </p>
              <h3 className="text-2xl md:text-3xl font-bold">
                Enjoy Memes & Boost Your Mood
              </h3>
              <p className="text-muted-foreground">
                Laughter is powerful medicine! Our curated meme collection
                refreshes daily to bring a smile to your face and help you
                destress instantly.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
