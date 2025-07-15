import { Link } from "wouter";
import { COMPANY_INFO, SERVICES } from "../../lib/constants";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-dark-gray text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-3xl font-bold text-white">
                {COMPANY_INFO.name.split(" ")[0]}
              </span>
              <span className="text-lg text-tech-gold ml-2">
                {COMPANY_INFO.name.split(" ")[1]}
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Transforming businesses through innovative technology solutions. 
              We build the future, one line of code at a time.
            </p>
            <div className="flex space-x-4">
              <a
                href={COMPANY_INFO.social.linkedin}
                className="text-gray-400 hover:text-tech-gold transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href={COMPANY_INFO.social.twitter}
                className="text-gray-400 hover:text-tech-gold transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href={COMPANY_INFO.social.github}
                className="text-gray-400 hover:text-tech-gold transition-colors"
              >
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              {SERVICES.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services#${service.id}`}
                    className="hover:text-tech-gold transition-colors"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-tech-gold transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-tech-gold transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-tech-gold transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-tech-gold transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-tech-gold transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-tech-gold transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 {COMPANY_INFO.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
