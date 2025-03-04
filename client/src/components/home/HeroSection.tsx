import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7')", 
          filter: "brightness(0.4)"
        }}
      ></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 lg:py-40 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          {t("home.hero.title")}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
          {t("home.hero.subtitle")}
        </p>
        
        {/* Search Form */}
        <form 
          onSubmit={handleSearch}
          className="w-full max-w-3xl mx-auto flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-grow">
            <Input
              type="search"
              placeholder={t("home.hero.searchPlaceholder")}
              className="w-full pl-10 h-12 text-base bg-white/95 border-0 shadow-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
          <Button 
            type="submit" 
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white h-12 px-8 flex-shrink-0"
          >
            {t("home.hero.searchButton")}
          </Button>
        </form>
        
        {/* Quick Category Access */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {["new", "used", "luxury", "sports", "suv", "electric"].map((category) => (
            <Button 
              key={category}
              variant="outline" 
              onClick={() => setLocation(`/cars?category=${category}`)}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20"
            >
              {t(`home.categories.${category}`)}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
