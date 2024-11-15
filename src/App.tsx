import { ThemeProvider } from '@/lib/theme';
import { Sidebar } from '@/components/layout/sidebar';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="poshmark-theme">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {/* Routes will be added here */}
          <div>Content area - routes coming next</div>
        </main>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;