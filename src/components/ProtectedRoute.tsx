import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser, isCommunityMember } = useAuth();

  if (!currentUser && !isCommunityMember) {
    return <Navigate to="/community-login" />;
  }

  return children;
};

export default ProtectedRoute;
