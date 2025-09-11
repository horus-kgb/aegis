import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { ErrorBoundary } from "./components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import OffensiveTools from "./pages/OffensiveTools";
import DefensiveTools from "./pages/DefensiveTools";
import Workflows from "./pages/Workflows";
import Projects from "./pages/Projects";
import Jobs from "./pages/Jobs";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Reconnaissance from "./pages/offensive/Reconnaissance";
import VulnerabilityAssessment from "./pages/offensive/VulnerabilityAssessment";
import Exploitation from "./pages/offensive/Exploitation";
import PostExploitation from "./pages/offensive/PostExploitation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  console.log('ProtectedRoute - user:', user, 'loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <div className="ml-4">Loading authentication...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/offensive" element={
              <ProtectedRoute>
                <OffensiveTools />
              </ProtectedRoute>
            } />
            <Route path="/defensive" element={
              <ProtectedRoute>
                <DefensiveTools />
              </ProtectedRoute>
            } />
            <Route path="/workflows" element={
              <ProtectedRoute>
                <Workflows />
              </ProtectedRoute>
            } />
            <Route path="/projects" element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } />
            <Route path="/jobs" element={
              <ProtectedRoute>
                <Jobs />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/offensive/recon" element={
              <ProtectedRoute>
                <Reconnaissance />
              </ProtectedRoute>
            } />
            <Route path="/offensive/vuln" element={
              <ProtectedRoute>
                <VulnerabilityAssessment />
              </ProtectedRoute>
            } />
            <Route path="/offensive/exploit" element={
              <ProtectedRoute>
                <Exploitation />
              </ProtectedRoute>
            } />
            <Route path="/offensive/post-exploit" element={
              <ProtectedRoute>
                <PostExploitation />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
