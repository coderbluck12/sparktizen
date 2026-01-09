import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Header from '../components/Head';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const CommunityLoginPage = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const subscribersRef = collection(db, 'subscribers');
      const q = query(subscribersRef, where('email', '==', email), where('code', '==', code));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError('Invalid credentials. Check your email and code.');
        setLoading(false);
        return;
      }

      authContext?.loginAsCommunityMember();
      navigate('/store');

    } catch (err) {
      setError('Login failed. Try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        {/* Header */}
        <div className="mb-12">
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Access
            </h1>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            Enter your credentials to view exclusive inventory.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="border-l-4 border-destructive bg-destructive/10 p-4">
              <p className="text-sm text-foreground">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label 
                htmlFor="email" 
                className="block text-xs font-medium uppercase tracking-wider mb-2 text-muted-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                required
                className="w-full px-4 py-3 bg-background text-foreground border-2 border-input focus:outline-none focus:border-foreground transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label 
                htmlFor="code" 
                className="block text-xs font-medium uppercase tracking-wider mb-2 text-muted-foreground"
              >
                Access Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="XXXXXXXX"
                disabled={loading}
                required
                className="w-full px-4 py-3 bg-background text-foreground border-2 border-input focus:outline-none focus:border-foreground transition-colors disabled:opacity-50 font-mono tracking-wider"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-foreground text-background font-medium uppercase tracking-wider text-sm border-2 border-foreground hover:bg-background hover:text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground disabled:hover:text-background"
          >
            {loading ? 'Verifying...' : 'Enter'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Don't have access?{' '}
            <button
              onClick={() => navigate('/join')}
              className="text-foreground hover:underline font-medium"
            >
              Request an invite
            </button>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default CommunityLoginPage;