import React from 'react';
import { Target, PiggyBank, TrendingUp, Shield, Bell, Award, Zap, Users } from 'lucide-react';

const Features = ({ isDarkMode }) => {
  const features = [
    {
      icon: Target,
      title: "Goal-Based Savings",
      description: "Set specific savings goals and track your progress with visual jar representations.",
      color: "blue"
    },
    {
      icon: PiggyBank,
      title: "Smart Jar System",
      description: "Organize your savings into different jars for different purposes - vacation, emergency, gadgets.",
      color: "green"
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your savings journey with detailed analytics and milestone celebrations.",
      color: "purple"
    },
    {
      icon: Shield,
      title: "Secure & Safe",
      description: "Bank-grade security ensures your financial data is protected with advanced encryption.",
      color: "red"
    },
    {
      icon: Bell,
      title: "Smart Reminders",
      description: "Personalized notifications to keep you motivated and on track with your savings goals.",
      color: "yellow"
    },
    {
      icon: Award,
      title: "Achievement System",
      description: "Earn badges and rewards as you hit savings milestones and build consistent habits.",
      color: "indigo"
    },
    {
      icon: Zap,
      title: "Auto-Save",
      description: "Set up automatic transfers to your jars based on your income and spending patterns.",
      color: "orange"
    },
    {
      icon: Users,
      title: "Family Sharing",
      description: "Share savings goals with family members and save together towards common objectives.",
      color: "pink"
    }
  ];

  const getColorClasses = (color, isDarkMode) => {
    const colors = {
      blue: isDarkMode ? 'bg-blue-900/20 border-blue-500/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-600',
      green: isDarkMode ? 'bg-green-900/20 border-green-500/30 text-green-300' : 'bg-green-50 border-green-200 text-green-600',
      purple: isDarkMode ? 'bg-purple-900/20 border-purple-500/30 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-600',
      red: isDarkMode ? 'bg-red-900/20 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-600',
      yellow: isDarkMode ? 'bg-yellow-900/20 border-yellow-500/30 text-yellow-300' : 'bg-yellow-50 border-yellow-200 text-yellow-600',
      indigo: isDarkMode ? 'bg-indigo-900/20 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-600',
      orange: isDarkMode ? 'bg-orange-900/20 border-orange-500/30 text-orange-300' : 'bg-orange-50 border-orange-200 text-orange-600',
      pink: isDarkMode ? 'bg-pink-900/20 border-pink-500/30 text-pink-300' : 'bg-pink-50 border-pink-200 text-pink-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <section 
      id="features" 
      className={`py-20 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></div>
            <span className={`text-sm font-medium tracking-wide uppercase ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Features
            </span>
            <div className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-blue-400' : 'bg-blue-600'}`}></div>
          </div>
          
          <h2 className={`text-4xl lg:text-5xl font-bold mb-6 transition-colors duration-300 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Everything You Need to
            <br />
            <span className={`transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-600'
            }`}>
              Build Your Savings
            </span>
          </h2>
          
          <p className={`text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            FinJar combines powerful savings tools with an intuitive interface to make managing your money feel effortless and rewarding.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl border-2 transition-all duration-500 hover:scale-105 hover:shadow-xl ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600' 
                    : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                } backdrop-blur-sm`}
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${
                  isDarkMode ? 'bg-gradient-to-br from-blue-400 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-700'
                }`}></div>
                
                {/* Icon Container */}
                <div className={`relative w-16 h-16 rounded-xl mb-6 flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110 ${
                  getColorClasses(feature.color, isDarkMode)
                }`}>
                  <Icon size={28} className="transition-transform duration-500 group-hover:rotate-12" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className={`text-xl font-bold mb-3 transition-colors duration-300 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className={`absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 ${
                  isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"/>
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className={`inline-flex items-center space-x-4 px-8 py-4 rounded-full transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 border border-gray-700' 
              : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-green-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-red-500 border-2 border-white"></div>
            </div>
            <span className={`text-sm font-medium ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Join 10,000+ users already saving smarter
            </span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-to-l from-blue-500 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-gradient-to-r from-green-500 to-blue-600 rounded-full opacity-5 blur-3xl"></div>
    </section>
  );
};

export default Features;