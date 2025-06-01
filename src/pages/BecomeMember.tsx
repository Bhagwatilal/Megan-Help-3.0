
import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import BecomeMemberSection from "@/components/calmzone/BecomeMemberSection";
import { useMember } from "@/components/auth/MemberVerification";

const BecomeMember: React.FC = () => {
  const { isMember, isLoading } = useMember();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/activities";

  // If user is already a member and not in loading state, redirect to the requested page
  if (isMember && !isLoading) {
    return <Navigate to={from} replace />;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Join Our Community</h1>
      <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
        Complete your membership profile to access all features of Calm Zone including activities,
        meditation, and community support.
      </p>
      <BecomeMemberSection />
    </div>
  );
};

export default BecomeMember;
