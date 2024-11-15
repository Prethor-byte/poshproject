export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to Poshmark Automation!</h1>
      <p className="mt-4 text-lg">Streamline your Poshmark reselling tasks with our powerful tools.</p>
      <div className="mt-6 space-x-4">
        <a href="/login" className="inline-block rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90">Sign In</a>
        <a href="/register" className="inline-block rounded-md bg-secondary px-4 py-2 text-white hover:bg-secondary/90">Sign Up</a>
      </div>
    </div>
  );
}
