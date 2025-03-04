import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Car } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { motion } from "framer-motion";
import { Link } from "wouter";
import SimpleMap from "../map/SimpleMap";
import {
  Calendar,
  CircleDollarSign,
  Gauge,
  MapPin,
  Share2,
  Heart,
  Flag,
  Phone,
  Mail,
  Info,
  ArrowLeft,
  MessageCircle,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CarDetailsCardProps {
  car: Car;
  isFavorite?: boolean;
}

export default function CarDetailsCard({ car, isFavorite = false }: CarDetailsCardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);
  const [favorite, setFavorite] = useState(isFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFavorite = async () => {
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

  const handleAddToCompare = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to add cars to comparison",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get existing comparison if any
      const existingComparisons = await queryClient.fetchQuery({
        queryKey: ["/api/comparisons"],
      });

      let comparisonId;
      if (existingComparisons && existingComparisons.length > 0) {
        // Add to the first comparison
        const comparison = existingComparisons[0];
        // Check if car is already in comparison
        if (comparison.carIds.includes(car.id)) {
          toast({
            title: "Car already in comparison",
            description: "This car is already in your comparison list",
            variant: "default",
          });
          return;
        }
        // Update comparison with new car
        await apiRequest("PUT", `/api/comparisons/${comparison.id}`, {
          carIds: [...comparison.carIds, car.id],
        });
        comparisonId = comparison.id;
      } else {
        // Create new comparison
        const newComparison = await apiRequest("POST", "/api/comparisons", {
          carIds: [car.id],
        });
        const data = await newComparison.json();
        comparisonId = data.id;
      }

      queryClient.invalidateQueries({ queryKey: ["/api/comparisons"] });
      
      toast({
        title: "Added to comparison",
        description: "Car has been added to your comparison list",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add car to comparison",
        variant: "destructive",
      });
    }
  };

  // Format price with locale
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(car.price);

  // Default image if none provided
  const carImages = car.imageUrls && car.imageUrls.length > 0
    ? car.imageUrls 
    : ['https://images.unsplash.com/photo-1485291571150-772bcfc10da5'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="ghost" asChild>
          <Link href="/cars">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("common.goBack")}
          </Link>
        </Button>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={toggleFavorite}
            disabled={isLoading}
            className={favorite ? "text-red-500" : ""}
          >
            <Heart className={`h-4 w-4 mr-2 ${favorite ? "fill-current" : ""}`} />
            {favorite ? t("cars.details.remove") : t("cars.details.save")}
          </Button>
          
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            {t("cars.details.share")}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAddToCompare}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            {t("cars.compare.addCar")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Images and Details */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-0 overflow-hidden">
              <div className="relative">
                {/* Main Image */}
                <div className="overflow-hidden">
                  <img
                    src={carImages[activeImage]}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-auto object-cover aspect-video"
                  />
                </div>
                
                {/* Thumbnail Navigation */}
                <div className="p-4 bg-white dark:bg-gray-900">
                  <Carousel>
                    <CarouselContent className="gap-2">
                      {carImages.map((image, index) => (
                        <CarouselItem key={index} className="basis-1/5">
                          <div
                            className={`cursor-pointer rounded-md overflow-hidden border-2 aspect-video ${
                              activeImage === index
                                ? "border-primary"
                                : "border-transparent"
                            }`}
                            onClick={() => setActiveImage(index)}
                          >
                            <img
                              src={image}
                              alt={`${car.make} ${car.model} - view ${index + 1}`}
                              className="w-full h-full object-cover aspect-video"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Car Details Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>{car.make} {car.model} {car.year}</CardTitle>
              <CardDescription className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {car.location || "Location not provided"}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="w-full grid grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">{t("cars.details.year")}</span>
                      <span className="font-medium">{car.year}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">{t("cars.details.make")}</span>
                      <span className="font-medium">{car.make}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">{t("cars.details.model")}</span>
                      <span className="font-medium">{car.model}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">{t("cars.details.mileage")}</span>
                      <span className="font-medium">{car.mileage ? `${car.mileage.toLocaleString()} mi` : "N/A"}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">{t("cars.details.fuelType")}</span>
                      <span className="font-medium">{car.fuelType || "N/A"}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">{t("cars.details.transmission")}</span>
                      <span className="font-medium">{car.transmission || "N/A"}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">{t("cars.details.color")}</span>
                      <span className="font-medium">{car.color || "N/A"}</span>
                    </div>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm text-muted-foreground">{t("cars.details.condition")}</span>
                      <span className="font-medium">{car.condition || "Used"}</span>
                    </div>
                  </div>

                  <Separator className="my-4" />
                  
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">
                    {car.description || "No description provided."}
                  </p>
                </TabsContent>
                
                <TabsContent value="features" className="pt-4">
                  {car.features && car.features.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {car.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Info className="h-4 w-4 text-primary" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No features listed for this vehicle.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="location" className="pt-4">
                  <div className="h-[300px] mb-4 rounded-md overflow-hidden">
                    {car.latitude && car.longitude ? (
                      <SimpleMap
                        lat={parseFloat(car.latitude)}
                        lng={parseFloat(car.longitude)}
                        zoom={14}
                        markers={[{
                          lat: parseFloat(car.latitude),
                          lng: parseFloat(car.longitude),
                          title: `${car.make} ${car.model}`
                        }]}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                        <p className="text-muted-foreground">Location data not available</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{car.location || "Location not provided"}</span>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Price and Contact Info */}
        <div className="space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl text-primary font-bold">
                {formattedPrice}
              </CardTitle>
              <CardDescription>
                <Badge className="mr-2">{car.condition || "Used"}</Badge>
                <Badge variant="outline">{car.listingType || "Regular"}</Badge>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <Calendar className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-sm font-medium">{car.year}</span>
                  <span className="text-xs text-muted-foreground">{t("cars.details.year")}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <Gauge className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-sm font-medium">{car.mileage ? `${car.mileage.toLocaleString()}` : "N/A"}</span>
                  <span className="text-xs text-muted-foreground">{t("cars.details.mileage")}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <CircleDollarSign className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-sm font-medium">{formattedPrice}</span>
                  <span className="text-xs text-muted-foreground">{t("cars.details.price")}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                  <MapPin className="h-5 w-5 text-muted-foreground mb-1" />
                  <span className="text-sm font-medium truncate max-w-full">
                    {car.location ? car.location.split(',')[0] : "N/A"}
                  </span>
                  <span className="text-xs text-muted-foreground">{t("cars.details.location")}</span>
                </div>
              </div>

              <Separator />
              
              {/* Contact Seller Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t("cars.details.contact")}</h3>
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    <Phone className="h-4 w-4 mr-2" />
                    Show Phone Number
                  </Button>
                  
                  <Button variant="outline" className="w-full" size="lg">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Seller
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full" size="lg">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat with Seller
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Start a conversation</DialogTitle>
                        <DialogDescription>
                          Please log in to chat with the seller about this {car.make} {car.model}.
                        </DialogDescription>
                      </DialogHeader>
                      {/* Chat UI would go here */}
                      <div className="h-[300px] flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-md">
                        <p className="text-muted-foreground">Chat feature coming soon</p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="justify-between">
              <Button variant="ghost" size="sm">
                <Flag className="h-4 w-4 mr-2" />
                {t("cars.details.report")}
              </Button>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={toggleFavorite}
                  disabled={isLoading}
                  className={favorite ? "text-red-500 hover:text-red-600" : ""}
                >
                  <Heart className={`h-4 w-4 mr-2 ${favorite ? "fill-current" : ""}`} />
                  {favorite ? "Saved" : "Save"}
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
