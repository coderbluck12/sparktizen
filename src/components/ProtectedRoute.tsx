import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) => {
  const { currentUser, isCommunityMember } = useAuth();

  if (adminOnly) {
    // Admin routes require a Firebase-authenticated user
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
  } else {
    // Community/store routes accept either a Firebase user or a community member
    if (!currentUser && !isCommunityMember) {
      return <Navigate to="/community-login" />;
    }
  }

  return children;
};

export default ProtectedRoute;
