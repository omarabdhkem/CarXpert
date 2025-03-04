import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Car } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import CarDetailsCard from "@/components/cars/CarDetailsCard";
import Layout from "@/components/shared/Layout";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CarDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Fetch car details
  const { data: car, isLoading: isLoadingCar, error: carError } = useQuery<Car>({
    queryKey: [`/api/cars/${id}`],
  });

  // Fetch user favorites if logged in
  const { data: favorites, isLoading: isLoadingFavorites } = useQuery<Car[]>({
    queryKey: ["/api/favorites"],
    enabled: !!user, // Only run query if user is logged in
  });

  // Check if car is in favorites
  useEffect(() => {
    if (favorites && car) {
      setIsFavorite(favorites.some(fav => fav.id === car.id));
    }
  }, [favorites, car]);

  // Handle error case - car not found
  useEffect(() => {
    if (carError) {
      // Redirect after a delay
      const timer = setTimeout(() => {
        setLocation("/cars");
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [carError, setLocation]);

  // Loading state
  if (isLoadingCar || (user && isLoadingFavorites)) {
    return (
      <Layout>
        <div className="container py-16 flex justify-center items-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">{t("common.loading")}</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (carError || !car) {
    return (
      <Layout>
        <div className="container py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">{t("common.error")}</h1>
            <p className="text-muted-foreground mb-6">
              Sorry, we couldn't find the car you were looking for. It may have been removed or is no longer available.
            </p>
            <Button onClick={() => setLocation("/cars")}>
              Browse Other Cars
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <CarDetailsCard car={car} isFavorite={isFavorite} />

        {/* Similar Cars Section */}
        {/* This would be added here, but is out of scope for this MVP */}
      </div>
    </Layout>
  );
}
