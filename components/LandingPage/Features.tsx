'use client';

import { motion } from 'framer-motion';
import { BarChartIcon as ChartBar, Users, Zap } from 'lucide-react';

const features = [
  {
    icon: ChartBar,
    title: "Comprehensive Analytics",
    description: "Gain valuable insights into your scholars' performance and earnings with in-depth analytics tools."
  },
  {
    icon: Users,
    title: "Scholar Management",
    description: "Effortlessly oversee your guild members, track their contributions, and optimize their performance."
  },
  {
    icon: Zap,
    title: "Live Performance Updates",
    description: "Monitor real-time updates on scholar activities, SLP earnings, and key Axie metrics."
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tools Built for Guild Managers
          </h2>
          <p className="text-xl text-muted-foreground">
            Manage your scholars like a pro with Masamune's suite of advanced features.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className="bg-card rounded-lg shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <feature.icon className="w-12 h-12 text-orange-500 mb-4" />
              
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

