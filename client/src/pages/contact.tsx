import { motion } from "framer-motion";
import { COMPANY_INFO } from "@/lib/constants";
import { Mail, Linkedin, Twitter, Github } from "lucide-react";
import ContactForm from "@/components/sections/contact-form";

export default function Contact() {
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
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Get In Touch</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ready to transform your business with cutting-edge technology? 
              Let's discuss your project and explore how we can help you achieve your goals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Let's Start a Conversation
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  We'd love to hear about your project and discuss how our expertise
                  can help bring your vision to life.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-deep-green rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Us</h3>
                    <p className="text-gray-600">{COMPANY_INFO.contact.email}</p>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a
                    href={COMPANY_INFO.social.linkedin}
                    className="w-10 h-10 bg-deep-green rounded-lg flex items-center justify-center text-white hover:bg-deep-green/80 transition-colors"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href={COMPANY_INFO.social.twitter}
                    className="w-10 h-10 bg-deep-green rounded-lg flex items-center justify-center text-white hover:bg-deep-green/80 transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a
                    href={COMPANY_INFO.social.github}
                    className="w-10 h-10 bg-deep-green rounded-lg flex items-center justify-center text-white hover:bg-deep-green/80 transition-colors"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to common questions about our services and processes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How long does a typical project take?",
                answer: "Project timelines vary based on complexity and scope. Simple projects may take 4-6 weeks, while complex enterprise solutions can take 3-6 months. We'll provide a detailed timeline during our initial consultation."
              },
              {
                question: "Do you work with startups?",
                answer: "Absolutely! We work with companies of all sizes, from early-stage startups to large enterprises. We offer flexible engagement models to accommodate different budgets and requirements."
              },
              {
                question: "What's your development process?",
                answer: "We follow an agile development methodology with regular sprints, continuous feedback, and iterative improvements. You'll be involved throughout the process with regular updates and demos."
              },
              {
                question: "Do you provide ongoing support?",
                answer: "Yes, we offer comprehensive support and maintenance packages. This includes bug fixes, updates, performance monitoring, and feature enhancements as needed."
              },
              {
                question: "Can you help with cloud migration?",
                answer: "Definitely! We have extensive experience with cloud migrations across AWS, Azure, and Google Cloud. We'll help you move your infrastructure safely and efficiently."
              },
              {
                question: "What industries do you serve?",
                answer: "We serve a wide range of industries including FinTech, EdTech, healthcare, e-commerce, manufacturing, and more. Our adaptable approach works across various sectors."
              }
            ].map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Response Time Section */}
      <section className="py-20 bg-deep-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold mb-4">Quick Response Guarantee</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              We understand that time is valuable. That's why we guarantee a response
              to all inquiries within 24 hours, and most within 4 hours.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">4 Hours</div>
                <div className="text-sm opacity-90">Average Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24 Hours</div>
                <div className="text-sm opacity-90">Guaranteed Response</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">48 Hours</div>
                <div className="text-sm opacity-90">Initial Consultation</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
