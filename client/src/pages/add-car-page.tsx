import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Layout from "@/components/shared/Layout";
import AddCarForm from "@/components/cars/AddCarForm";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AddCarPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/auth?redirect=/add-car");
    }
  }, [user, isLoading, setLocation]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If not authenticated, show login prompt
  if (!user) {
    return (
      <Layout>
        <div className="container py-16 min-h-[60vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to be logged in to sell a car.
            </p>
            <Button onClick={() => setLocation("/auth?redirect=/add-car")}>
              Login or Register
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <AddCarForm />
      </div>
    </Layout>
  );
}
