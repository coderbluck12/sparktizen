import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { type User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';

interface AuthContextType {
  currentUser: User | null;
  isCommunityMember: boolean;
  loading: boolean;
  loginAsCommunityMember: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCommunityMember, setIsCommunityMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    const communityMemberStatus = sessionStorage.getItem('isCommunityMember');
    if (communityMemberStatus === 'true') {
      setIsCommunityMember(true);
    }

    return unsubscribe;
  }, []);

    const loginAsCommunityMember = () => {
    setIsCommunityMember(true);
    sessionStorage.setItem('isCommunityMember', 'true');
  };

  const logout = async () => {
    if (currentUser) {
      await signOut(auth);
    }
    setIsCommunityMember(false);
    sessionStorage.removeItem('isCommunityMember');
  };

  const value = {
    currentUser,
    isCommunityMember,
    loading,
    loginAsCommunityMember,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
