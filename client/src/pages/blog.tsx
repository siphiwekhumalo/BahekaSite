import { motion } from "framer-motion";
import { BLOG_POSTS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, User, ArrowRight } from "lucide-react";

export default function Blog() {
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
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Tech Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Insights, tutorials, and industry trends from our team of technology experts.
              Stay updated with the latest in software development and digital innovation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row gap-4 items-center justify-between"
          >
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", "AI/ML", "FinTech", "Cybersecurity", "EdTech", "Cloud"].map((category) => (
                <Badge
                  key={category}
                  variant={category === "All" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-deep-green hover:text-white"
                >
                  {category}
                </Badge>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Article</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <img
                src={BLOG_POSTS[0].image}
                alt={BLOG_POSTS[0].title}
                className="rounded-xl shadow-lg w-full h-64 object-cover"
              />
            </div>
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <Badge className="bg-tech-gold text-black">Featured</Badge>
                <Badge variant="outline">{BLOG_POSTS[0].category}</Badge>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {BLOG_POSTS[0].title}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                {BLOG_POSTS[0].excerpt}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{BLOG_POSTS[0].author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(BLOG_POSTS[0].date).toLocaleDateString()}</span>
                </div>
              </div>
              <Button className="bg-deep-green text-white hover:bg-deep-green/90">
                Read Full Article
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Articles</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our latest insights and technical deep-dives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BLOG_POSTS.slice(1).map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow duration-300 group">
                  <div className="relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="outline" className="bg-white">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-deep-green transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button variant="ghost" className="w-full justify-between p-0 h-auto text-deep-green hover:text-tech-gold">
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-deep-green text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter to get the latest articles and insights
              delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white text-gray-900"
              />
              <Button variant="outline" className="bg-white text-deep-green hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore by Category</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dive deeper into specific topics that interest you most.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "AI & Machine Learning",
                description: "Latest developments in artificial intelligence and ML",
                count: 15,
                icon: "🤖"
              },
              {
                name: "Cybersecurity",
                description: "Security best practices and threat analysis",
                count: 12,
                icon: "🔐"
              },
              {
                name: "FinTech",
                description: "Financial technology trends and innovations",
                count: 18,
                icon: "💳"
              },
              {
                name: "Cloud Computing",
                description: "Cloud architecture and deployment strategies",
                count: 10,
                icon: "☁️"
              },
              {
                name: "EdTech",
                description: "Educational technology and learning platforms",
                count: 8,
                icon: "📚"
              },
              {
                name: "Software Development",
                description: "Coding tutorials and development best practices",
                count: 25,
                icon: "💻"
              }
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
              >
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-deep-green transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{category.count} articles</span>
                  <ArrowRight className="h-4 w-4 text-deep-green opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
