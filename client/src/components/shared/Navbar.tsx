import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Menu, 
  Car, 
  ShoppingBag, 
  Heart, 
  LogOut, 
  User, 
  Plus, 
  Settings, 
  BarChart3,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();
  const { user, logoutMutation } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setLocation("/");
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled 
          ? "bg-background/95 backdrop-blur-sm border-b shadow-sm" 
          : "bg-transparent"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Car className="h-6 w-6 text-primary" />
          {/* Replace text with logo */}
          <img
            src="/attached_assets/صورة واتساب بتاريخ 2025-03-04 في 13.40.30_94acabc3.jpg"
            alt={t("app.name")}
            className="h-8 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/">
                  <NavigationMenuLink className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    location === "/" && "bg-accent/50"
                  )}>
                    {t("nav.home")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/cars">
                  <NavigationMenuLink className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    location === "/cars" && "bg-accent/50"
                  )}>
                    {t("nav.cars")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>{t("nav.dealers")}</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="#"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            {t("dealerships.title")}
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            {t("dealerships.nearYou")}
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link href="/dealers?type=new">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">{t("home.categories.new")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("home.categories.new")}
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dealers?type=used">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">{t("home.categories.used")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("home.categories.used")}
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                    <li>
                      <Link href="/dealers?type=luxury">
                        <NavigationMenuLink className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          <div className="text-sm font-medium leading-none">{t("home.categories.luxury")}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {t("home.categories.luxury")}
                          </p>
                        </NavigationMenuLink>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/maintenance">
                  <NavigationMenuLink className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                    location === "/maintenance" && "bg-accent/50"
                  )}>
                    {t("nav.maintenance")}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              {user && (
                <NavigationMenuItem>
                  <Link href="/compare">
                    <NavigationMenuLink className={cn(
                      "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                      location === "/compare" && "bg-accent/50"
                    )}>
                      {t("nav.compare")}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex relative w-1/3">
          <Input
            type="search"
            placeholder={t("home.hero.searchPlaceholder")}
            className="w-full pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </form>

        {/* Right Side - User Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl || undefined} alt={user.username} />
                    <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>{t("nav.profile")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/add-car">
                    <Plus className="mr-2 h-4 w-4" />
                    <span>{t("nav.addCar")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favorites">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>{t("nav.favorites")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/compare">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>{t("nav.compare")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t("nav.settings")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("nav.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth?action=login">{t("nav.login")}</Link>
              </Button>
              <Button asChild>
                <Link href="/auth?action=register">{t("nav.signup")}</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col h-full">
                <div className="py-4">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Input
                        type="search"
                        placeholder={t("home.hero.searchPlaceholder")}
                        className="w-full pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </form>
                </div>

                <div className="flex flex-col space-y-3 py-4">
                  <Link href="/" className="flex items-center px-2 py-1.5 text-sm">
                    <Home className="mr-2 h-4 w-4" />
                    {t("nav.home")}
                  </Link>
                  <Link href="/cars" className="flex items-center px-2 py-1.5 text-sm">
                    <Car className="mr-2 h-4 w-4" />
                    {t("nav.cars")}
                  </Link>
                  <Link href="/dealers" className="flex items-center px-2 py-1.5 text-sm">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    {t("nav.dealers")}
                  </Link>
                  <Link href="/maintenance" className="flex items-center px-2 py-1.5 text-sm">
                    <Settings className="mr-2 h-4 w-4" />
                    {t("nav.maintenance")}
                  </Link>
                  {user && (
                    <>
                      <Link href="/compare" className="flex items-center px-2 py-1.5 text-sm">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        {t("nav.compare")}
                      </Link>
                      <Link href="/favorites" className="flex items-center px-2 py-1.5 text-sm">
                        <Heart className="mr-2 h-4 w-4" />
                        {t("nav.favorites")}
                      </Link>
                      <Link href="/profile" className="flex items-center px-2 py-1.5 text-sm">
                        <User className="mr-2 h-4 w-4" />
                        {t("nav.profile")}
                      </Link>
                      <Link href="/add-car" className="flex items-center px-2 py-1.5 text-sm">
                        <Plus className="mr-2 h-4 w-4" />
                        {t("nav.addCar")}
                      </Link>
                    </>
                  )}
                </div>

                {!user && (
                  <div className="flex flex-col gap-2 mt-auto">
                    <Button variant="outline" asChild>
                      <Link href="/auth?action=login">{t("nav.login")}</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/auth?action=register">{t("nav.signup")}</Link>
                    </Button>
                  </div>
                )}

                {user && (
                  <Button 
                    variant="destructive" 
                    className="mt-auto"
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t("nav.logout")}
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}