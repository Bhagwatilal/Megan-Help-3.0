import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { Spinner } from "@/components/ui/spinner";

interface MemberProfile {
  fullName: string;
  email: string;
  phone: string;
  interests: string;
  bio: string;
  joinDate: string;
  membershipLevel: string;
}

interface MemberContextType {
  isAuthenticated: boolean;
  isMember: boolean;
  profile: MemberProfile | null;
  isLoading: boolean;
}

const defaultContextValue: MemberContextType = {
  isAuthenticated: false,
  isMember: false,
  profile: null,
  isLoading: true
};

// Create context to share member profile data across components
export const MemberContext = createContext<MemberContextType>(defaultContextValue);

export const useMember = () => useContext(MemberContext);

interface MemberProviderProps {
  children: ReactNode;
}

export const MemberProvider: React.FC<MemberProviderProps> = ({ children }) => {
  const [memberState, setMemberState] = useState<MemberContextType>(defaultContextValue);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // User is logged in, check if they have a member profile
          const db = getFirestore();
          const docRef = doc(db, "memberProfiles", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // User has a member profile
            setMemberState({
              isAuthenticated: true,
              isMember: true,
              profile: docSnap.data() as MemberProfile,
              isLoading: false
            });
          } else {
            // User is authenticated but not a member
            setMemberState({
              isAuthenticated: true,
              isMember: false,
              profile: null,
              isLoading: false
            });
          }
        } catch (error) {
          console.error("Error checking membership:", error);
          setMemberState({
            isAuthenticated: true,
            isMember: false,
            profile: null,
            isLoading: false
          });
        }
      } else {
        // User is not logged in
        setMemberState({
          isAuthenticated: false,
          isMember: false,
          profile: null,
          isLoading: false
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <MemberContext.Provider value={memberState}>
      {children}
    </MemberContext.Provider>
  );
};

// Component to verify if user is a member
interface RequireMembershipProps {
  children: ReactNode;
}

export const RequireMembership: React.FC<RequireMembershipProps> = ({ children }) => {
  const { isAuthenticated, isMember, isLoading } = useMember();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mentii-500 mx-auto mb-4"></div>
          <p className="text-mentii-600">Verifying membership...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // User is not logged in, redirect to login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isMember) {
    // User is logged in but not a member, redirect to become-member
    return <Navigate to="/become-member" state={{ from: location }} replace />;
  }

  // User is a member, render the protected content
  return <>{children}</>;
};
