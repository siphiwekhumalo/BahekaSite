import { motion } from "framer-motion";
import { PORTFOLIO_PROJECTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";

export default function Portfolio() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Portfolio & Case Studies
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our recent projects and success stories that showcase our
              expertise across various industries and technologies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Here are some of our most impactful projects that demonstrate our
              capabilities and commitment to excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {PORTFOLIO_PROJECTS.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-tech-gold text-black">
                        {project.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-2xl group-hover:text-deep-green transition-colors">
                      {project.title}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {project.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Technologies Used:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <Badge key={tech} variant="outline">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Key Results:</h4>
                        <ul className="space-y-1">
                          {project.results.map((result) => (
                            <li key={result} className="text-gray-600 text-sm">
                              • {result}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="flex space-x-4 pt-4">
                        <button className="flex items-center space-x-2 text-deep-green hover:text-tech-gold transition-colors">
                          <ExternalLink className="h-4 w-4" />
                          <span>View Project</span>
                        </button>
                        <button className="flex items-center space-x-2 text-deep-green hover:text-tech-gold transition-colors">
                          <Github className="h-4 w-4" />
                          <span>View Code</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse portfolio spans multiple industries, demonstrating our
              ability to adapt and deliver solutions across various sectors.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Financial Services", icon: "💰", projects: 12 },
              { name: "Healthcare", icon: "🏥", projects: 8 },
              { name: "Education", icon: "🎓", projects: 15 },
              { name: "E-commerce", icon: "🛒", projects: 10 },
              { name: "Manufacturing", icon: "🏭", projects: 6 },
              { name: "Real Estate", icon: "🏠", projects: 4 },
              { name: "Entertainment", icon: "🎬", projects: 7 },
              { name: "Non-profit", icon: "❤️", projects: 5 }
            ].map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{industry.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{industry.name}</h3>
                <p className="text-sm text-gray-600">{industry.projects} projects</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


    </motion.div>
  );
}
