import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { PublicLayout } from '@/components/layout/public-layout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";


export function RegisterPage() {
  // TODO: Refactor to match new login page style

  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, session, error: authError, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      // Navigate to the protected page they tried to visit or /app
      const from = location.state?.from || '/app';
      navigate(from);
    }
  }, [session, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      await signUp(email, password);
    } catch (err) {
      setError('Failed to create account');
    }
  };

  return (
    <PublicLayout>
      <div className="container relative min-h-[calc(100vh-4rem)] items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left: Illustration & Testimonial */}
        <div className="relative hidden h-full flex-col bg-gradient-to-br from-primary/90 to-secondary/80 p-10 text-white lg:flex dark:border-r rounded-r-3xl shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-secondary/60 opacity-80 rounded-3xl" />
          <div className="relative z-20 flex items-center text-2xl font-extrabold tracking-tight gap-2">
            <img src="/logo.svg" alt="PoshAuto Logo" className="h-8 w-8" />
            PoshAuto
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-3">
              <p className="text-xl font-semibold italic">
                “Starting my Poshmark business was daunting until I found PoshAuto. Now I can focus on growth while the platform handles the repetitive tasks.”
              </p>
              <footer className="text-base font-medium">Michael Chen</footer>
            </blockquote>
            <img src="/dashboard-preview.png" alt="Dashboard preview" className="mt-8 rounded-2xl shadow-lg border border-white/10 w-full max-w-xs" />
          </div>
        </div>
        {/* Right: Register Form */}
        <div className="flex flex-col justify-center items-center w-full py-12 lg:p-16">
          <Card className="w-full max-w-md mx-auto shadow-lg rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-1">Create your PoshAuto account</CardTitle>
              <CardDescription className="text-base text-gray-500 dark:text-gray-400">Start automating your Poshmark business today.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="mt-2"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="mt-2"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    className="mt-2"
                    placeholder="••••••••"
                  />
                </div>
                {error && (
                  <div className="rounded-md bg-red-100 text-red-700 px-4 py-2 text-sm font-medium dark:bg-red-900/30 dark:text-red-300 animate-pulse">
                    {error}
                  </div>
                )}
                {authError && (
                  <div className="rounded-md bg-red-100 text-red-700 px-4 py-2 text-sm font-medium dark:bg-red-900/30 dark:text-red-300 animate-pulse">
                    {typeof authError === 'string' ? authError : (authError && 'message' in authError ? authError.message : String(authError))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" size="lg" className="w-full text-lg font-semibold shadow-md transition-transform hover:-translate-y-1">
                  {loading ? <span className="animate-spin mr-2">⏳</span> : null} Create Account
                </Button>
                <div className="flex justify-between w-full text-sm mt-2">
                  <span className="text-gray-500 dark:text-gray-400">Already have an account?</span>
                  <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}

