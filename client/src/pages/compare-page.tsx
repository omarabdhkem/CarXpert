import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSearch, useLocation } from "wouter";
import { Car } from "@shared/schema";
import Layout from "@/components/shared/Layout";
import CarCompare from "@/components/cars/CarCompare";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ComparePage() {
  const { t } = useTranslation();
  const search = useSearch();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [comparisonId, setComparisonId] = useState<number | null>(null);

  // Get comparison ID from URL if it exists
  useEffect(() => {
    const params = new URLSearchParams(search);
    const id = params.get("id");
    if (id) {
      setComparisonId(parseInt(id));
    }
  }, [search]);

  // Fetch all cars for comparison
  const { data: cars, isLoading: isLoadingCars } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });

  // Fetch specific comparison if ID is available
  const { data: comparison, isLoading: isLoadingComparison } = useQuery({
    queryKey: [`/api/comparisons/${comparisonId}`],
    enabled: !!comparisonId,
  });

  // Get cars for selected comparison
  const comparisonCars = (() => {
    if (!comparison || !cars) return [];
    return cars.filter(car => comparison.carIds.includes(car.id));
  })();

  // Loading state
  if (isLoadingCars || (comparisonId && isLoadingComparison)) {
    return (
      <Layout>
        <div className="container py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("cars.compare.title")}</h1>
        <p className="text-muted-foreground mb-8">
          Compare specifications and features of different cars side by side
        </p>

        {/* Authentication Check */}
        {!user && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md mb-8">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-2">
              Authentication Required
            </h3>
            <p className="text-sm text-yellow-700 dark:text-yellow-300/80 mb-4">
              You need to be logged in to save comparisons. You can still compare cars, but your comparison won't be saved.
            </p>
            <Button variant="outline" onClick={() => setLocation("/auth")}>
              Login or Register
            </Button>
          </div>
        )}

        {/* Comparison Component */}
        <CarCompare
          initialCars={comparisonCars}
          mode="page"
          comparisonId={comparisonId || undefined}
        />
      </div>
    </Layout>
  );
}
