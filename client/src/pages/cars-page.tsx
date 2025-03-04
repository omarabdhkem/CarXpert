import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useSearch, useLocation } from "wouter";
import { Car } from "@shared/schema";
import Layout from "@/components/shared/Layout";
import CarCard from "@/components/cars/CarCard";
import AdvancedSearch from "@/components/cars/AdvancedSearch";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, Grid, List, SlidersHorizontal } from "lucide-react";

// Sort options
const sortOptions = [
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "year-new", label: "Year: Newest First" },
  { value: "year-old", label: "Year: Oldest First" },
  { value: "mileage-low", label: "Mileage: Low to High" },
  { value: "mileage-high", label: "Mileage: High to Low" },
];

export default function CarsPage() {
  const { t } = useTranslation();
  const search = useSearch();
  const [, setLocation] = useLocation();
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("price-low");

  // Parse search params
  useEffect(() => {
    const params = new URLSearchParams(search);
    const sort = params.get("sort");
    const view = params.get("view");

    if (sort) setSortBy(sort);
    if (view === "list" || view === "grid") setViewType(view);
  }, [search]);

  // Fetch cars data
  const { data: cars, isLoading, error } = useQuery<Car[]>({
    queryKey: ["/api/cars"],
  });

  // Update URL when sort or view changes
  useEffect(() => {
    const params = new URLSearchParams(search);
    params.set("sort", sortBy);
    params.set("view", viewType);
    setLocation(`/cars?${params.toString()}`);
  }, [sortBy, viewType]);

  // Sort cars based on selected option
  const sortedCars = [...(cars || [])].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "year-new":
        return b.year - a.year;
      case "year-old":
        return a.year - b.year;
      case "mileage-low":
        return (a.mileage || 0) - (b.mileage || 0);
      case "mileage-high":
        return (b.mileage || 0) - (a.mileage || 0);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-red-500">{error.message}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("cars.listings.title")}</h1>
        <p className="text-muted-foreground mb-8">
          {cars?.length || 0} cars available
        </p>

        {/* Filters and Sorting Bar */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <div className="flex gap-2">
            {/* Filter Sheet for Mobile */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  {t("cars.listings.filter")}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[320px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>{t("search.title")}</SheetTitle>
                  <SheetDescription>
                    Filter cars based on your preferences.
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <AdvancedSearch />
                </div>
              </SheetContent>
            </Sheet>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {t("cars.listings.sort")}:
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("cars.listings.sort")} />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t("cars.listings.view")}:
            </span>
            <Button
              variant={viewType === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewType("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewType === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewType("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with Advanced Search */}
          <div className="hidden md:block w-1/4 border rounded-lg p-4 h-fit sticky top-24">
            <h2 className="text-lg font-semibold mb-4">{t("search.title")}</h2>
            <AdvancedSearch />
          </div>

          {/* Car Listings */}
          <div className={`flex-1 ${viewType === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}`}>
            {sortedCars.length > 0 ? (
              sortedCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))
            ) : (
              <div className="text-center py-12 col-span-full">
                <p className="text-muted-foreground text-lg">No cars found matching your criteria.</p>
                <Button className="mt-4" onClick={() => window.location.href = "/cars"}>
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
