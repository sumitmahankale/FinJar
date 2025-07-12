import React, { useState, useEffect, useRef } from 'react';
import { Heart, Users, Target, Award, ChevronRight, Zap, Shield, TrendingUp, Star, ArrowRight } from 'lucide-react';

const AboutPage = ({ isDarkMode = false }) => {
  const [isVisible, setIsVisible] = useState({});
  const [animationStep, setAnimationStep] = useState(0);
  const observerRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    // Observe all sections
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => {
      if (observerRef.current) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Staggered animation for hero elements
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationStep(prev => Math.min(prev + 1, 4));
    }, 300);
    return () => clearTimeout(timer);
  }, [animationStep]);

  

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "Bank-grade encryption and security protocols protect every transaction.",
      color: "blue"
    },
    {
      icon: Heart,
      title: "User-Centric",
      description: "Every feature is designed with our users' financial well-being in mind.",
      color: "red"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Cutting-edge technology meets timeless financial wisdom.",
      color: "yellow"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a supportive ecosystem for financial growth and learning.",
      color: "green"
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
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Hero Section with Staggered Animations */}
      <section className={`relative pt-24 pb-20 overflow-hidden transition-colors duration-500 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-to-l from-blue-500 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
          <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-gradient-to-r from-green-500 to-blue-600 rounded-full opacity-5 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Animated Badge */}
            <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full mb-8 transition-all duration-700 transform ${
              animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            } ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-gray-700 backdrop-blur-sm' 
                : 'bg-white/70 border border-gray-200 backdrop-blur-sm'
            }`}>
              <Star className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <span className={`text-sm font-medium ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Trusted by 50,000+ users worldwide
              </span>
            </div>

            {/* Main Title with Typewriter Effect */}
            <h1 className={`text-5xl lg:text-7xl font-bold mb-6 transition-all duration-700 transform ${
              animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              About{' '}
              <span className={`transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                FinJar
              </span>
            </h1>

            {/* Subtitle */}
            <p className={`text-xl lg:text-2xl mb-12 leading-relaxed transition-all duration-700 transform ${
              animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              We're on a mission to democratize financial wellness by making saving 
              <span className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {' '}simple, engaging, and rewarding
              </span> for everyone.
            </p>


          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section
        id="mission"
        data-animate
        className={`py-20 transition-colors duration-500 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`transition-all duration-1000 transform ${
              isVisible.mission ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}>
              <div className={`inline-flex items-center space-x-2 mb-6 px-4 py-2 rounded-full ${
                isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50'
              }`}>
                <Heart className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Our Mission
                </span>
              </div>
              
              <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Making Financial Wellness 
                <span className={`block ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Accessible to All
                </span>
              </h2>
              
              <p className={`text-lg mb-8 leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                We believe that everyone deserves the tools and knowledge to build a secure financial future. 
                FinJar was born from the simple idea that saving money shouldn't be stressful or complicated.
              </p>
              
              <div className="space-y-4">
                {[
                  'Simplify the savings process with intuitive design',
                  'Provide personalized financial insights and recommendations',
                  'Create a supportive community of savers',
                  'Make financial education accessible and engaging'
                ].map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                      isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                    }`}>
                      <ChevronRight className="w-3 h-3 text-white" />
                    </div>
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={`transition-all duration-1000 transform ${
              isVisible.mission ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r rounded-3xl blur opacity-75 ${
                  isDarkMode ? 'from-blue-600 to-purple-600' : 'from-blue-500 to-purple-500'
                }`}></div>
                <img
                  src="https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=600&h=400&fit=crop"
                  alt="Team collaboration"
                  className="relative rounded-3xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        id="values"
        data-animate
        className={`py-20 transition-colors duration-500 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 transform ${
            isVisible.values ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Our Core Values
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              These principles guide everything we do at FinJar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className={`group relative p-8 rounded-2xl transition-all duration-700 transform hover:scale-105 ${
                    isVisible.values ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  } ${
                    isDarkMode 
                      ? 'bg-gray-800 border border-gray-700' 
                      : 'bg-white border border-gray-200'
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`w-16 h-16 rounded-xl mb-6 flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110 ${
                    getColorClasses(value.color, isDarkMode)
                  }`}>
                    <Icon size={28} className="transition-transform duration-500 group-hover:rotate-12" />
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {value.title}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className={`py-20 transition-colors duration-500 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="container mx-auto px-6 text-center">
          <div className={`max-w-3xl mx-auto p-12 rounded-3xl ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-900 to-purple-900' 
              : 'bg-gradient-to-r from-blue-500 to-purple-600'
          }`}>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Ready to Start Your
              <br />
              Savings Journey?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of users who've transformed their financial future with FinJar
            </p>
            <button className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-medium text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105">
              <span>Get Started Today</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;