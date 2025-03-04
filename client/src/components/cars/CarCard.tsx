import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Car } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Heart, MapPin, Calendar, Gauge, Users, Share2 } from "lucide-react";

interface CarCardProps {
  car: Car;
  isFavorite?: boolean;
}

export default function CarCard({ car, isFavorite = false }: CarCardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add cars to favorites",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (favorite) {
        await apiRequest("DELETE", `/api/favorites/${car.id}`);
      } else {
        await apiRequest("POST", "/api/favorites", { carId: car.id });
      }
      setFavorite(!favorite);
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      
      toast({
        title: favorite ? "Removed from favorites" : "Added to favorites",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format price with locale
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(car.price);

  // Get first image or placeholder
  const mainImage = car.imageUrls && car.imageUrls.length > 0
    ? car.imageUrls[0]
    : 'https://images.unsplash.com/photo-1485291571150-772bcfc10da5';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/cars/${car.id}`}>
        <div className="relative">
          {/* Featured Badge */}
          {car.listingType === "featured" && (
            <Badge className="absolute top-2 left-2 z-10 bg-primary text-white">
              Featured
            </Badge>
          )}
          
          {/* Favorite Button */}
          <Button
            size="icon"
            variant="ghost"
            className={`absolute top-2 right-2 z-10 rounded-full bg-white/80 text-foreground hover:bg-white ${
              favorite ? "text-red-500" : ""
            }`}
            onClick={toggleFavorite}
            disabled={isLoading}
          >
            <Heart
              className={`h-5 w-5 ${favorite ? "fill-current" : ""}`}
            />
          </Button>
          
          {/* Car Image */}
          <div className="aspect-[16/9] relative">
            <img
              src={mainImage}
              alt={`${car.make} ${car.model}`}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            />
          </div>
        </div>
      </Link>

      <CardContent className="p-4">
        <Link href={`/cars/${car.id}`}>
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg line-clamp-1">
                {car.make} {car.model}
              </h3>
              <p className="font-bold text-lg text-primary">{formattedPrice}</p>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="line-clamp-1">{car.location || "Location not provided"}</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 py-2">
              <div className="flex flex-col items-center text-center">
                <Calendar className="h-4 w-4 mb-1 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{car.year}</span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Gauge className="h-4 w-4 mb-1 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {car.mileage ? `${car.mileage.toLocaleString()} mi` : "N/A"}
                </span>
              </div>
              <div className="flex flex-col items-center text-center">
                <Users className="h-4 w-4 mb-1 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{car.transmission || "Auto"}</span>
              </div>
            </div>
            
            {car.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{car.description}</p>
            )}
          </div>
        </Link>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Badge variant="outline" className="text-xs">
          {car.condition || "Used"}
        </Badge>
        
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4 mr-1" />
          {t("cars.details.share")}
        </Button>
      </CardFooter>
    </Card>
  );
}
