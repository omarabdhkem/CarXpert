import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { ThemeProvider } from "@/components/theme-provider";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import CarsPage from "@/pages/cars-page";
import CarDetailsPage from "@/pages/car-details-page";
import ProfilePage from "@/pages/profile-page";
import AddCarPage from "@/pages/add-car-page";
import ComparePage from "@/pages/compare-page";
import SearchResultsPage from "@/pages/search-results-page";
import { ProtectedRoute } from "@/lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/cars" component={CarsPage} />
      <Route path="/cars/:id" component={CarDetailsPage} />
      <Route path="/search" component={SearchResultsPage} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      <ProtectedRoute path="/add-car" component={AddCarPage} />
      <ProtectedRoute path="/compare" component={ComparePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="carxpert-theme">
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
