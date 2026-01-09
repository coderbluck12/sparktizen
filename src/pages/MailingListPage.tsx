import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import Header from '../components/Head';

const MailingListPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const generateUniqueCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setMessage('Please enter a valid email address.');
      setIsSuccess(false);
      return;
    }
    setLoading(true);
    setMessage('');
    setIsSuccess(false);

    try {
      const subscribersRef = collection(db, 'subscribers');
      const q = query(subscribersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingSubscriber = querySnapshot.docs[0].data();
        const existingCode = existingSubscriber.code;

        const serviceId = 'service_3v9zfba';
        const templateId = 'template_w2cu09k';
        const publicKey = 'E7svumdfQ47TSFFiy';

        const templateParams = {
          to_email: email,
          user_code: existingCode,
        };

        await emailjs.send(serviceId, templateId, templateParams, publicKey);

        setMessage('Already on the list. Code resent to your inbox.');
        setIsSuccess(true);
        setLoading(false);
        return;
      }

      const uniqueCode = generateUniqueCode();
      await addDoc(subscribersRef, {
        email: email,
        code: uniqueCode,
        createdAt: new Date().toISOString(),
      });

      const serviceId = 'service_3v9zfba';
      const templateId = 'template_w2cu09k';
      const publicKey = 'E7svumdfQ47TSFFiy';

      const templateParams = {
        to_email: email,
        user_code: uniqueCode,
      };

      await emailjs.send(serviceId, templateId, templateParams, publicKey);

      setMessage('Check your email for your access code.');
      setIsSuccess(true);
      setEmail('');

    } catch (error) {
      console.error('Failed to process subscription:', error);
      setMessage('Something went wrong. Please try again.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
    <div className="min-h-screen bg-background text-foreground">
      {/* Background pattern */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" 
           style={{ 
             backgroundImage: `repeating-linear-gradient(0deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 2px),
                               repeating-linear-gradient(90deg, currentColor 0px, currentColor 1px, transparent 1px, transparent 2px)`,
             backgroundSize: '32px 32px'
           }} 
      />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="mb-16 text-center space-y-6">
            <div className="inline-block">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-2">
                Join Us
              </h1>
              <div className="h-1 bg-foreground" />
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Get exclusive access to limited drops and early releases. 
              No spam, just the good stuff.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-card border-2 border-border p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium uppercase tracking-wider mb-3 text-foreground"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full px-4 py-4 bg-background text-foreground border-2 border-input text-base focus:outline-none focus:border-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-foreground text-background font-medium uppercase tracking-wider text-sm border-2 border-foreground hover:bg-background hover:text-foreground transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-foreground disabled:hover:text-background"
              >
                {loading ? 'Processing...' : 'Get Access'}
              </button>

              {message && (
                <div 
                  className={`p-4 border-2 text-sm ${
                    isSuccess 
                      ? 'border-foreground/20 bg-foreground/5 text-foreground' 
                      : 'border-destructive/20 bg-destructive/5 text-destructive'
                  }`}
                >
                  {message}
                </div>
              )}
            </form>
          </div>

          {/* Footer note */}
          <p className="mt-8 text-center text-sm text-muted-foreground">
            By signing up, you'll receive a unique access code via email.
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default MailingListPage;