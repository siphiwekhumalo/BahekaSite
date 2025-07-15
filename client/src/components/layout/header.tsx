import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { COMPANY_INFO } from "../../lib/constants";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Careers", href: "/careers" },
  { name: "Blog", href: "/blog" },
];

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-deep-green">
                {COMPANY_INFO.name.split(" ")[0]}
              </span>
              <span className="text-sm text-tech-gold ml-1">
                {COMPANY_INFO.name.split(" ")[1]}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <div className="flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors duration-200 px-3 py-2 whitespace-nowrap ${
                    location === item.href
                      ? "text-deep-green"
                      : "text-gray-700 hover:text-deep-green"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link href="/contact">
                <Button className="bg-deep-green text-white hover:bg-deep-green/90 whitespace-nowrap">
                  Contact
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-3 py-2 font-medium transition-colors duration-200 ${
                        location === item.href
                          ? "text-deep-green"
                          : "text-gray-700 hover:text-deep-green"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-deep-green text-white hover:bg-deep-green/90">
                      Contact
                    </Button>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
