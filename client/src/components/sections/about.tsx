import { motion } from "framer-motion";
import { COMPANY_INFO, TEAM_STATS } from "@/lib/constants";
import { Check } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-6">
              About {COMPANY_INFO.name}
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Founded with a vision to transform businesses through technology,
              {COMPANY_INFO.name} has become a trusted partner for organizations
              seeking innovative software solutions.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Our team of expert developers, designers, and strategists work
              collaboratively to deliver cutting-edge solutions that drive
              growth and efficiency.
            </p>

            <div className="space-y-4">
              {[
                "Industry-leading expertise",
                "Agile development methodology",
                "24/7 support and maintenance",
              ].map((item) => (
                <div key={item} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-deep-green rounded-full flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
              alt="Diverse software development team collaborating around a computer"
              className="rounded-2xl shadow-xl w-full h-auto"
            />

            {/* Team stats overlay */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg"
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-deep-green">
                    {TEAM_STATS.developers}+
                  </div>
                  <div className="text-sm text-gray-600">Developers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-deep-green">
                    {TEAM_STATS.designers}+
                  </div>
                  <div className="text-sm text-gray-600">Designers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-deep-green">
                    {TEAM_STATS.consultants}+
                  </div>
                  <div className="text-sm text-gray-600">Consultants</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
