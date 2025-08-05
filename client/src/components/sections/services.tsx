import { motion } from "framer-motion";
import { Link } from "wouter";
import { SERVICES } from "@/lib/constants";
import { 
  Code, 
  Palette, 
  Cloud, 
  Settings,
  ArrowRight
} from "lucide-react";

const iconMap = {
  Code,
  Palette,
  Cloud,
  Settings,
};

export default function Services() {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We deliver comprehensive technology solutions that drive business
            growth and digital transformation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap] || Code;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group border border-border"
              >
                <div className="w-12 h-12 bg-deep-green rounded-lg flex items-center justify-center mb-6 group-hover:bg-tech-gold transition-colors duration-300">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <Link
                  href={`/services#${service.id}`}
                  className="inline-flex items-center text-deep-green font-medium hover:text-tech-gold transition-colors group"
                >
                  Learn More
                  <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
