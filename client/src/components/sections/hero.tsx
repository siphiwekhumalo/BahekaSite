import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { COMPANY_INFO, TEAM_STATS } from "@/lib/constants";
import { Shield, CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-muted to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Building the
                <span className="text-deep-green"> Future</span>
                <br />
                of Technology
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {COMPANY_INFO.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-deep-green text-white hover:bg-deep-green/90 shadow-lg hover:shadow-xl"
                >
                  Get Started
                </Button>
              </Link>
              <Link href="/portfolio">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-deep-green text-deep-green hover:bg-deep-green hover:text-white"
                >
                  View Our Work
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-deep-green">
                  {TEAM_STATS.projects}+
                </div>
                <div className="text-sm text-muted-foreground">Projects Delivered</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-deep-green">
                  {TEAM_STATS.clients}+
                </div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-deep-green">
                  {TEAM_STATS.years}+
                </div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Modern tech office with multiple monitors and clean workspace"
              className="rounded-2xl shadow-2xl w-full h-auto"
            />

            {/* Floating cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs"
            >
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-light-green rounded-full"></div>
                <span className="text-sm font-medium">System Online</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">99.9% Uptime</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs"
            >
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-deep-green" />
                <span className="text-sm font-medium">Secure & Compliant</span>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Enterprise-grade security
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
