import { motion } from "framer-motion";
import { COMPANY_INFO, TEAM_STATS } from "@/lib/constants";
import { Check, Users, Target, Award } from "lucide-react";

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pt-20"
    >
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-muted to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold text-foreground mb-6">
              About {COMPANY_INFO.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {COMPANY_INFO.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Target className="h-12 w-12 text-deep-green mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                To empower businesses with innovative technology solutions that drive growth,
                efficiency, and competitive advantage in the digital age.
              </p>
              <p className="text-lg text-muted-foreground">
                We believe that technology should serve humanity, and we're committed to
                creating solutions that make a meaningful impact on people's lives and businesses.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Award className="h-12 w-12 text-deep-green mb-6" />
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground mb-6">
                To be the leading technology partner for businesses worldwide, recognized
                for our innovation, reliability, and commitment to excellence.
              </p>
              <p className="text-lg text-muted-foreground">
                We envision a future where technology seamlessly integrates with business
                processes, creating unprecedented opportunities for growth and success.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
<section className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Users className="h-12 w-12 text-deep-green mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-foreground mb-4">Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We are a dynamic blend of young African software professionals dedicated to 
              providing cutting-edge software solutions across industries. Our team combines 
              fresh perspectives with technical expertise, bringing innovative approaches to 
              modern software development challenges.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-card rounded-xl p-12 shadow-lg mb-16 border border-border"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold text-card-foreground mb-6">Our Expertise</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Check className="h-6 w-6 text-deep-green mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      <strong>Full-Stack Development:</strong> Modern web and mobile applications 
                      built with the latest technologies
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-6 w-6 text-deep-green mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      <strong>Cloud Solutions:</strong> Scalable cloud-native architectures 
                      and deployment strategies
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-6 w-6 text-deep-green mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      <strong>UI/UX Design:</strong> User-centered design that creates 
                      intuitive and engaging experiences
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-card-foreground mb-6">Our Approach</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Check className="h-6 w-6 text-deep-green mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      <strong>Agile Methodology:</strong> Iterative development with continuous 
                      client collaboration and feedback
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-6 w-6 text-deep-green mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      <strong>Quality Assurance:</strong> Rigorous testing and code review 
                      processes to ensure reliability
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Check className="h-6 w-6 text-deep-green mt-1 flex-shrink-0" />
                    <p className="text-gray-600">
                      <strong>Innovation Focus:</strong> Staying ahead of technology trends 
                      to deliver future-ready solutions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white rounded-xl p-8 shadow-lg"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-deep-green mb-2">
                {TEAM_STATS.developers}+
              </div>
              <div className="text-gray-600">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-deep-green mb-2">
                {TEAM_STATS.designers}+
              </div>
              <div className="text-gray-600">Designers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-deep-green mb-2">
                {TEAM_STATS.consultants}+
              </div>
              <div className="text-gray-600">Consultants</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-deep-green mb-2">
                {TEAM_STATS.projects}+
              </div>
              <div className="text-gray-600">Projects</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core values guide everything we do and define who we are as a company.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description: "We continuously push the boundaries of what's possible with technology.",
                icon: "🚀"
              },
              {
                title: "Quality",
                description: "We deliver excellence in every project, no matter the size or complexity.",
                icon: "⭐"
              },
              {
                title: "Integrity",
                description: "We build trust through transparency, honesty, and reliable partnerships.",
                icon: "🤝"
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-6xl mb-6">{value.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
