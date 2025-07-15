import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { PORTFOLIO_PROJECTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Portfolio & Case Studies
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our recent projects and success stories that showcase our
            expertise across various industries.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {PORTFOLIO_PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={project.image}
                alt={project.description}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className="bg-tech-gold text-black">
                    {project.category}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-200 text-sm">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/portfolio">
            <Button
              size="lg"
              className="bg-deep-green text-white hover:bg-deep-green/90"
            >
              View All Projects
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
