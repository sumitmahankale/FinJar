import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Users, 
  Target, 
  Award, 
  ChevronRight, 
  Zap, 
  Shield, 
  TrendingUp, 
  Star, 
  ArrowRight,
  PiggyBank,
  DollarSign,
  Lock,
  Smartphone,
  BarChart3,
  Clock,
  CheckCircle
} from 'lucide-react';

const AboutPage = ({ isDarkMode = false }) => {
  const [isVisible, setIsVisible] = useState({});
  const [animationStep, setAnimationStep] = useState(0);
  const [floatingCoins, setFloatingCoins] = useState([]);
  const observerRef = useRef(null);

  // Create floating coins animation
  useEffect(() => {
    const coins = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2
    }));
    setFloatingCoins(coins);
  }, []);

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
      setAnimationStep(prev => Math.min(prev + 1, 5));
    }, 400);
    return () => clearTimeout(timer);
  }, [animationStep]);

  // Custom SVG Components
  const JarSVG = ({ className = "w-64 h-64", isDarkMode = false }) => (
    <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Jar Body */}
      <path
        d="M50 80 L50 160 Q50 170 60 170 L140 170 Q150 170 150 160 L150 80 Z"
        fill={isDarkMode ? "url(#jarGradientDark)" : "url(#jarGradientLight)"}
        stroke={isDarkMode ? "#4F46E5" : "#3B82F6"}
        strokeWidth="2"
        className="animate-pulse"
      />
      
      {/* Jar Lid */}
      <ellipse
        cx="100"
        cy="80"
        rx="55"
        ry="8"
        fill={isDarkMode ? "#374151" : "#E5E7EB"}
        stroke={isDarkMode ? "#4F46E5" : "#3B82F6"}
        strokeWidth="2"
      />
      
      {/* Jar Handle */}
      <path
        d="M45 90 Q35 90 35 100 L35 110 Q35 120 45 120"
        fill="none"
        stroke={isDarkMode ? "#4F46E5" : "#3B82F6"}
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Coins inside jar */}
      <circle cx="80" cy="140" r="8" fill="#F59E0B" className="animate-bounce" style={{animationDelay: '0.5s'}} />
      <circle cx="120" cy="130" r="8" fill="#F59E0B" className="animate-bounce" style={{animationDelay: '0.8s'}} />
      <circle cx="100" cy="150" r="8" fill="#F59E0B" className="animate-bounce" style={{animationDelay: '1.1s'}} />
      
      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="jarGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EBF8FF" />
          <stop offset="100%" stopColor="#DBEAFE" />
        </linearGradient>
        <linearGradient id="jarGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>
    </svg>
  );

  const GrowthChartSVG = ({ className = "w-48 h-48", isDarkMode = false }) => (
    <svg className={className} viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Chart bars */}
      {[30, 50, 70, 90, 110].map((height, index) => (
        <rect
          key={index}
          x={20 + index * 30}
          y={130 - height}
          width="20"
          height={height}
          fill={isDarkMode ? "#4F46E5" : "#3B82F6"}
          className="animate-pulse"
          style={{animationDelay: `${index * 0.3}s`}}
        />
      ))}
      
      {/* Trend line */}
      <path
        d="M30 115 L50 100 L80 85 L110 70 L140 55"
        stroke="#10B981"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        className="animate-pulse"
      />
      
      {/* Arrow up */}
      <path
        d="M135 60 L140 55 L145 60"
        stroke="#10B981"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );

  const SecurityShieldSVG = ({ className = "w-40 h-40", isDarkMode = false }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 10 L70 20 L70 45 Q70 65 50 80 Q30 65 30 45 L30 20 Z"
        fill={isDarkMode ? "url(#shieldGradientDark)" : "url(#shieldGradientLight)"}
        stroke={isDarkMode ? "#10B981" : "#059669"}
        strokeWidth="2"
        className="animate-pulse"
      />
      
      {/* Check mark */}
      <path
        d="M40 45 L45 50 L60 35"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      <defs>
        <linearGradient id="shieldGradientLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="shieldGradientDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#065F46" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>
      </defs>
    </svg>
  );

  const values = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your financial data is protected with enterprise-level encryption and security protocols.",
      color: "green"
    },
    {
      icon: Heart,
      title: "User-First Design",
      description: "Every feature is crafted with your financial goals and user experience as our top priority.",
      color: "red"
    },
    {
      icon: Zap,
      title: "Smart Technology",
      description: "AI-powered insights and automated savings help you reach your goals faster.",
      color: "yellow"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a thriving community of savers sharing tips, motivation, and financial wisdom.",
      color: "blue"
    }
  ];

  const features = [
    {
      icon: PiggyBank,
      title: "Smart Jar Management",
      description: "Create unlimited savings jars for different goals - vacation, emergency fund, new car, or anything you dream of."
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Visual progress indicators and detailed analytics help you stay motivated and on track."
    },
    {
      icon: Target,
      title: "Goal Setting",
      description: "Set realistic targets with our smart goal calculator and get personalized saving strategies."
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Bank-level security ensures your financial data stays safe and private at all times."
    }
  ];

  const getColorClasses = (color, isDarkMode) => {
    const colors = {
      blue: isDarkMode ? 'bg-blue-900/30 border-blue-500/30 text-blue-300' : 'bg-blue-50 border-blue-200 text-blue-600',
      green: isDarkMode ? 'bg-green-900/30 border-green-500/30 text-green-300' : 'bg-green-50 border-green-200 text-green-600',
      red: isDarkMode ? 'bg-red-900/30 border-red-500/30 text-red-300' : 'bg-red-50 border-red-200 text-red-600',
      yellow: isDarkMode ? 'bg-yellow-900/30 border-yellow-500/30 text-yellow-300' : 'bg-yellow-50 border-yellow-200 text-yellow-600',
      purple: isDarkMode ? 'bg-purple-900/30 border-purple-500/30 text-purple-300' : 'bg-purple-50 border-purple-200 text-purple-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Floating Coins Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {floatingCoins.map((coin) => (
          <div
            key={coin.id}
            className="absolute w-4 h-4 bg-yellow-400 rounded-full opacity-20"
            style={{
              left: `${coin.x}%`,
              top: `${coin.y}%`,
              animation: `float ${coin.duration}s ease-in-out infinite`,
              animationDelay: `${coin.delay}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className={`relative pt-24 pb-20 overflow-hidden transition-colors duration-500 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-tr from-green-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div>
              {/* Badge */}
              <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full mb-8 transition-all duration-700 transform ${
                animationStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } ${
                isDarkMode 
                  ? 'bg-gray-800/60 border border-gray-700 backdrop-blur-sm' 
                  : 'bg-white/80 border border-gray-200 backdrop-blur-sm'
              }`}>
                <Star className={`w-5 h-5 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} />
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Trusted by 10,000+ Smart Savers
                </span>
              </div>

              {/* Main Title */}
              <h1 className={`text-5xl lg:text-6xl font-bold mb-6 transition-all duration-700 transform ${
                animationStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Meet{' '}
                <span className={`bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  FinJar
                </span>
              </h1>

              {/* Subtitle */}
              <p className={`text-xl lg:text-2xl mb-8 leading-relaxed transition-all duration-700 transform ${
                animationStep >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your intelligent savings companion that makes reaching financial goals 
                <span className={`font-semibold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {' '}simple, fun, and rewarding
                </span>.
              </p>

              {/* Quick Stats */}
              <div className={`grid grid-cols-3 gap-6 transition-all duration-700 transform ${
                animationStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                {[
                  { number: "₹5M+", label: "Total Saved" },
                  { number: "10K+", label: "Active Users" },
                  { number: "98%", label: "Goal Success Rate" }
                ].map((stat, index) => (
                  <div key={index} className={`text-center p-4 rounded-lg ${
                    isDarkMode ? 'bg-gray-800/50' : 'bg-white/60'
                  } backdrop-blur-sm`}>
                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      {stat.number}
                    </div>
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Illustration */}
            <div className={`relative transition-all duration-1000 transform ${
              animationStep >= 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}>
              <div className="relative">
                <JarSVG isDarkMode={isDarkMode} className="w-full max-w-md mx-auto" />
                
                {/* Floating elements */}
                <div className="absolute top-1/4 -left-4 animate-bounce" style={{animationDelay: '0.5s'}}>
                  <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-900' : 'bg-green-100'}`}>
                    <DollarSign className={`w-6 h-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                </div>
                
                <div className="absolute top-1/3 -right-4 animate-bounce" style={{animationDelay: '1s'}}>
                  <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                    <Target className={`w-6 h-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                </div>
                
                <div className="absolute bottom-1/4 -left-6 animate-bounce" style={{animationDelay: '1.5s'}}>
                  <div className={`p-3 rounded-full ${isDarkMode ? 'bg-purple-900' : 'bg-purple-100'}`}>
                    <TrendingUp className={`w-6 h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                </div>
              </div>
            </div>
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
                Democratizing 
                <span className={`block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  Financial Wellness
                </span>
              </h2>
              
              <p className={`text-lg mb-8 leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                At FinJar, we believe everyone deserves access to smart financial tools. We're transforming 
                how people save money by making it intuitive, engaging, and accessible to all.
              </p>
              
              <div className="space-y-4">
                {[
                  'Eliminate financial stress with intuitive jar-based savings',
                  'Provide AI-powered insights for personalized financial growth',
                  'Build a supportive community of motivated savers',
                  'Make financial education engaging and actionable'
                ].map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 ${
                      isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
                    }`}>
                      <CheckCircle className="w-3 h-3 text-white" />
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
                <GrowthChartSVG isDarkMode={isDarkMode} className="w-full max-w-sm mx-auto" />
                
                {/* Achievement badges */}
                <div className="absolute -top-4 -right-4 animate-pulse">
                  <div className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-900' : 'bg-yellow-100'} border-4 ${isDarkMode ? 'border-gray-800' : 'border-white'}`}>
                    <Award className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        data-animate
        className={`py-20 transition-colors duration-500 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className={`text-center mb-16 transition-all duration-1000 transform ${
            isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Why Choose FinJar?
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Discover the features that make FinJar the smartest way to save money
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`group p-6 rounded-2xl transition-all duration-700 transform hover:scale-105 hover:rotate-1 ${
                    isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  } ${
                    isDarkMode 
                      ? 'bg-gray-800 border border-gray-700 hover:border-blue-500/50' 
                      : 'bg-white border border-gray-200 hover:border-blue-300'
                  } shadow-lg hover:shadow-xl`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className={`w-14 h-14 rounded-xl mb-4 flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                    isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <Icon size={28} className="transition-transform duration-500 group-hover:rotate-12" />
                  </div>
                  
                  <h3 className={`text-lg font-bold mb-3 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`text-sm leading-relaxed ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section
        id="values"
        data-animate
        className={`py-20 transition-colors duration-500 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
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
              The principles that drive everything we do at FinJar
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
                      ? 'bg-gray-900 border border-gray-700' 
                      : 'bg-gray-50 border border-gray-200'
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

      {/* Security Section */}
      <section className={`py-20 transition-colors duration-500 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <SecurityShieldSVG isDarkMode={isDarkMode} className="w-full max-w-xs mx-auto" />
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Your Money is 
                <span className={`block ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  100% Secure
                </span>
              </h2>
              
              <p className={`text-lg mb-8 leading-relaxed ${
                isDarkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                We take security seriously. Your financial data is protected with the same level 
                of security used by major banks and financial institutions.
              </p>
              
              <div className="space-y-4">
                {[
                  'End-to-end encryption for all transactions',
                  'Multi-factor authentication (MFA)',
                  'Regular security audits and compliance checks',
                  'Zero-knowledge architecture'
                ].map((point, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className={`w-5 h-5 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                    <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 transition-colors duration-500 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="container mx-auto px-6 text-center">
          <div className={`max-w-4xl mx-auto p-12 rounded-3xl relative overflow-hidden ${
            isDarkMode 
              ? 'bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900' 
              : 'bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500'
          }`}>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 20 }).map((_, i) => (
                <PiggyBank
                  key={i}
                  className="absolute w-8 h-8 text-white animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
                Start Your Financial
                <br />
                Success Story Today
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Join thousands of smart savers who've transformed their financial future with FinJar
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-lg font-medium text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg">
                  <PiggyBank className="w-5 h-5" />
                  <span>Start Saving Now</span>
                </button>
                
                <button className="inline-flex items-center space-x-2 px-8 py-4 border-2 border-white/30 text-white rounded-lg font-medium text-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                  <span>Learn More</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-8 flex justify-center space-x-8 text-blue-100">
                <div className="text-center">
                  <div className="text-2xl font-bold">Free</div>
                  <div className="text-sm">Forever</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">2 min</div>
                  <div className="text-sm">Setup</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-sm">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;