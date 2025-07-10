import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY_INFO } from "@/lib/constants";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Portfolio", href: "/portfolio" },
  { name: "Careers", href: "/careers" },
  { name: "Blog", href: "/blog" },
];

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [location] = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Menu Panel */}
      <div className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link href="/" onClick={onClose} className="flex items-center">
              <span className="text-xl font-bold text-deep-green">
                {COMPANY_INFO.name.split(" ")[0]}
              </span>
              <span className="text-sm text-tech-gold ml-1">
                {COMPANY_INFO.name.split(" ")[1]}
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`block px-3 py-3 rounded-lg font-medium transition-colors duration-200 ${
                    location === item.href
                      ? "bg-deep-green text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-deep-green"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>

          {/* Contact Button */}
          <div className="p-4 border-t border-gray-200">
            <Link href="/contact" onClick={onClose}>
              <Button className="w-full bg-deep-green text-white hover:bg-deep-green/90">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
