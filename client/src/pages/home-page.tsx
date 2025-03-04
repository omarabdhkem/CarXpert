import { useTranslation } from "react-i18next";
import Layout from "@/components/shared/Layout";
import HeroSection from "@/components/home/HeroSection";
import FeaturedCars from "@/components/home/FeaturedCars";
import SearchSection from "@/components/home/SearchSection";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Car, MapPin, Settings, BarChart3, ArrowRight } from "lucide-react";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />

      {/* Search Section */}
      <SearchSection />

      {/* Featured Cars */}
      <FeaturedCars />

      {/* Services Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
            {t("home.services.title")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Buy a Car */}
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Car className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("home.services.buy.title")}</h3>
              <p className="text-center text-muted-foreground mb-6">{t("home.services.buy.desc")}</p>
              <Button variant="outline" className="mt-auto" asChild>
                <Link href="/cars">
                  {t("home.categories.all")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Sell a Car */}
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Car className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("home.services.sell.title")}</h3>
              <p className="text-center text-muted-foreground mb-6">{t("home.services.sell.desc")}</p>
              <Button variant="outline" className="mt-auto" asChild>
                <Link href="/add-car">
                  {t("nav.addCar")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Compare Cars */}
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("home.services.compare.title")}</h3>
              <p className="text-center text-muted-foreground mb-6">{t("home.services.compare.desc")}</p>
              <Button variant="outline" className="mt-auto" asChild>
                <Link href="/compare">
                  {t("nav.compare")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Find Dealerships */}
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("home.services.dealerships.title")}</h3>
              <p className="text-center text-muted-foreground mb-6">{t("home.services.dealerships.desc")}</p>
              <Button variant="outline" className="mt-auto" asChild>
                <Link href="/dealers">
                  {t("nav.dealers")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Car Maintenance */}
            <div className="flex flex-col items-center p-6 bg-gray-50 dark:bg-gray-900 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Settings className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t("home.services.maintenance.title")}</h3>
              <p className="text-center text-muted-foreground mb-6">{t("home.services.maintenance.desc")}</p>
              <Button variant="outline" className="mt-auto" asChild>
                <Link href="/maintenance">
                  {t("nav.maintenance")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Find Your Perfect Car?</h2>
          <p className="max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who found their dream car on CarXpert.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/cars">
                Browse All Cars
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/20" asChild>
              <Link href="/add-car">
                Sell Your Car
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
