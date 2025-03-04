import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t">
      <div className="container py-12 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.about.title")}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{t("footer.about.desc")}</p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="#" aria-label="Youtube">
                  <Youtube className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.quickLinks.title")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  {t("footer.quickLinks.aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  {t("footer.quickLinks.contactUs")}
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  {t("footer.quickLinks.careers")}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  {t("footer.quickLinks.blog")}
                </Link>
              </li>
              <li>
                <Link href="/press" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  {t("footer.quickLinks.press")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.support.title")}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  {t("footer.support.help")}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  {t("footer.support.faq")}
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  {t("footer.support.policies")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  {t("footer.support.terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                  {t("footer.support.privacy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("footer.contact.title")}</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">{t("footer.contact.email")}</span>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">{t("footer.contact.phone")}</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">{t("footer.contact.address")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* App Download & Rate */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {t("footer.appDownload")}:
            </div>
            <div className="flex space-x-2">
              <a href="#" className="block h-9">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-current text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-5.5-7.5v1h11v-1h-11zm0-3v1h11v-1h-11zm0-3v1h11v-1h-11z" />
                </svg>
              </a>
              <a href="#" className="block h-9">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-current text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.74 3.51 7.1 8.66 6.89c1.37-.07 2.37.89 3.35.89 1 0 2.76-1.08 4.3-.58 4.92 1.59 4.3 9.33-.26 13.08zm-2.76-16.7c-3.35.4-6.19 6.21-3.94 8.34-1.09-4.76 2.79-7.05 3.94-8.34z" />
                </svg>
              </a>
              <a href="#" className="block h-9">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  className="fill-current text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  <path d="M4.06 4.08c-.22.28-.33.45-.33.6v14.64c0 .15.11.26.33.55l8.94-8.01-8.94-7.78zm10.13 7.76c-.82-.73-9.19-5.88-9.19-5.88l9.19 8.12s8.2-5.34 9.03-6.07c.33-.32.33-.74.004-1.08-.32-.32-.67.03-1 .33l-8.03 4.58z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              {t("footer.feedback")}
            </Link>
            <div className="h-4 border-r border-gray-300 dark:border-gray-700 hidden sm:block" />
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">{t("footer.rateUs")}:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-start lg:justify-end items-center">
            <Link href="/developer" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
              {t("footer.developer")}
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          {t("footer.copyright")}
        </div>
      </div>
    </footer>
  );
}
