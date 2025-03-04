import { useState, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
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
import { Loader2, SlidersHorizontal, Search as SearchIcon } from "lucide-react";

export default function SearchResultsPage() {
  const { t } = useTranslation();
  const search = useSearch();
  const [, setLocation] = useLocation();
  const [sortBy, setSortBy] = useState("price-low");
  const [searchParams, setSearchParams] = useState<Record<string, string>>({});
  
  // Parse search params
  useEffect(() => {
    const params = new URLSearchParams(search);
    const queryObj: Record<string, string> = {};
    
    for (const [key, value] of params.entries()) {
      queryObj[key] = value;
    }
    
    setSearchParams(queryObj);
    
    // Get sort parameter if present
    const sort = params.get("sort");
    if (sort) setSortBy(sort);
  }, [search]);
  
  // Build API query based on search params
  const buildApiQuery = () => {
    const apiQuery = new URLSearchParams();
    
    // Parse params that need special handling
    if (searchParams.q) apiQuery.append("q", searchParams.q);
    if (searchParams.make) apiQuery.append("make", searchParams.make);
    if (searchParams.model) apiQuery.append("model", searchParams.model);
    if (searchParams.minPrice && searchParams.maxPrice) {
      apiQuery.append("minPrice", searchParams.minPrice);
      apiQuery.append("maxPrice", searchParams.maxPrice);
    }
    if (searchParams.minYear && searchParams.maxYear) {
      apiQuery.append("minYear", searchParams.minYear);
      apiQuery.append("maxYear", searchParams.maxYear);
    }
    if (searchParams.condition) apiQuery.append("condition", searchParams.condition);
    if (searchParams.fuelType) apiQuery.append("fuelType", searchParams.fuelType);
    if (searchParams.transmission) apiQuery.append("transmission", searchParams.transmission);
    if (searchParams.location) apiQuery.append("location", searchParams.location);
    
    return apiQuery.toString();
  };
  
  // Fetch search results
  const { data: cars, isLoading, error } = useQuery<Car[]>({
    queryKey: [`/api/cars?${buildApiQuery()}`],
  });
  
  // Update URL when sort changes
  useEffect(() => {
    const params = new URLSearchParams(search);
    params.set("sort", sortBy);
    setLocation(`/search?${params.toString()}`);
  }, [sortBy]);
  
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
  
  // Get search summary text
  const getSearchSummary = () => {
    const parts = [];
    
    if (searchParams.q) parts.push(`"${searchParams.q}"`);
    if (searchParams.make) parts.push(searchParams.make);
    if (searchParams.model) parts.push(searchParams.model);
    if (searchParams.condition) parts.push(`${searchParams.condition} condition`);
    
    if (parts.length === 0) return "all cars";
    return parts.join(", ");
  };

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
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("search.results.title")}</h1>
        
        {sortedCars && sortedCars.length > 0 ? (
          <p className="text-muted-foreground mb-8">
            {t("search.results.found", { count: sortedCars.length })} for {getSearchSummary()}
          </p>
        ) : (
          <p className="text-muted-foreground mb-8">
            {t("search.results.notFound")}
          </p>
        )}

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
                    Refine your search results
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <AdvancedSearch initialValues={searchParams} />
                </div>
              </SheetContent>
            </Sheet>

            {/* Search Summary Badge */}
            <div className="flex items-center">
              <Button variant="outline" onClick={() => setLocation("/cars")} className="gap-2">
                <SearchIcon className="h-4 w-4" />
                {getSearchSummary()}
              </Button>
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {t("search.results.sortBy")}:
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("cars.listings.sort")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="year-new">Year: Newest First</SelectItem>
                  <SelectItem value="year-old">Year: Oldest First</SelectItem>
                  <SelectItem value="mileage-low">Mileage: Low to High</SelectItem>
                  <SelectItem value="mileage-high">Mileage: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Main Content with Sidebar */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with Advanced Search */}
          <div className="hidden md:block w-1/4 border rounded-lg p-4 h-fit sticky top-24">
            <h2 className="text-lg font-semibold mb-4">{t("search.title")}</h2>
            <AdvancedSearch initialValues={searchParams} />
          </div>

          {/* Search Results */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCars && sortedCars.length > 0 ? (
              sortedCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))
            ) : (
              <div className="text-center py-12 col-span-full">
                <h3 className="text-xl font-semibold mb-2">No cars found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any cars matching your search criteria.
                </p>
                <Button onClick={() => setLocation("/cars")}>
                  View All Cars
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
