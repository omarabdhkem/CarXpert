import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { Car } from "@shared/schema";
import CarCard from "../cars/CarCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

export default function FeaturedCars() {
  const { t } = useTranslation();
  const [visibleCars, setVisibleCars] = useState(6);
  
  const { data: cars, isLoading, error } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });
  
  // Filter featured cars
  const featuredCars = cars?.filter(car => car.listingType === "featured") || [];
  
  const loadMore = () => {
    setVisibleCars(prev => Math.min(prev + 6, featuredCars.length));
  };
  
  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-16 text-center">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }
  
  if (featuredCars.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">{t("home.featured.title")}</h2>
            <p className="text-muted-foreground mt-2">{t("home.featured.subtitle")}</p>
          </div>
          <Button variant="ghost" className="hidden sm:flex items-center gap-2" asChild>
            <Link href="/cars">
              {t("home.featured.viewAll")}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.slice(0, visibleCars).map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
        
        {visibleCars < featuredCars.length && (
          <div className="flex justify-center mt-10">
            <Button onClick={loadMore} variant="outline" size="lg">
              {t("common.more")}
            </Button>
          </div>
        )}
        
        <div className="mt-10 flex justify-center sm:hidden">
          <Button asChild>
            <Link href="/cars">{t("home.featured.viewAll")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
