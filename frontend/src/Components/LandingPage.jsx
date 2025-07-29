import React, { useState, useEffect, useRef } from 'react';
import { Target, PiggyBank, TrendingUp, Shield, Bell, Award, Zap, Users, Menu, X, Moon, Sun, MessageCircle, Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Chatbot Component
const FinJarChatbot = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Hi! I'm FinBot, your FinJar assistant. I can help you learn about our savings app, features, and answer any questions you have!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Quick action buttons
  const quickActions = [
    "What is FinJar?",
    "How does it work?",
    "Is it free?",
    "Security features",
    "Get started"
  ];

  // Chatbot knowledge base
  const responses = {
    greetings: [
      "Hello! Welcome to FinJar! How can I help you today?",
      "Hi there! Ready to start your savings journey?",
      "Hey! Great to see you here. What would you like to know about FinJar?"
    ],
    
    whatIsFinjar: [
      "FinJar is a goal-based fintech app that helps you build strong savings habits using a virtual jar system. Think of it as your personal savings companion that makes financial goals achievable and fun!",
      "FinJar transforms the way you save money by organizing your savings into different 'jars' for different goals - like vacation, emergency fund, or that new gadget you want!"
    ],
    
    howItWorks: [
      "It's simple! 1. Create virtual jars for your savings goals 2. Set target amounts and deadlines 3. Add money to your jars regularly 4. Track your progress with beautiful visualizations 5. Celebrate when you reach your goals!",
      "FinJar works by breaking down your big financial goals into manageable chunks. Create separate jars, set realistic targets, and watch your savings grow with our smart tracking system!"
    ],
    
    features: [
      "Our key features include: Goal-based savings jars, Progress tracking & analytics, Bank-grade security, Smart reminders, Achievement system, Auto-save options, and Family sharing!",
      "FinJar offers smart jar management, visual progress tracking, secure data protection, automated savings, achievement badges, and the ability to share goals with family members!"
    ],
    
    security: [
      "Your security is our top priority! We use bank-grade encryption, multi-factor authentication, regular security audits, and zero-knowledge architecture to protect your financial data. Your information is never shared with third parties!",
      "We implement enterprise-level security including end-to-end encryption, secure data storage, compliance with financial regulations, and 24/7 monitoring to keep your money and data safe."
    ],
    
    pricing: [
      "FinJar is completely FREE to use! No hidden fees, no subscription costs, no premium tiers. We believe everyone deserves access to smart financial tools regardless of their income level.",
      "Yes, it's 100% free forever! We're committed to making financial wellness accessible to everyone. No strings attached, no hidden costs."
    ],
    
    gettingStarted: [
      "Getting started is super easy! 1. Click 'Start Now' on our homepage 2. Create your account (takes 2 minutes) 3. Set up your first savings jar 4. Start saving! You'll be amazed how quickly you reach your goals!",
      "Ready to begin? Simply register for free, create your first jar with a goal (like 'Vacation Fund - $1000'), and start adding money. Our app will guide you through everything!"
    ],
    
    support: [
      "Need help? We're here for you! Email: support@finjar.com Phone: +1 (555) 123-4567 Live chat available 24/7. Our response time is typically under 24 hours!",
      "Our support team is amazing! Reach out via email, phone, or live chat. We also have comprehensive help guides and video tutorials in the app."
    ],
    
    benefits: [
      "FinJar helps you: Build consistent saving habits, Reach financial goals faster, Reduce money stress, Stay motivated with visual progress, Learn better financial management, Celebrate achievements!",
      "Users love FinJar because it makes saving money feel like a game! You'll develop better financial habits, reach goals you never thought possible, and actually enjoy managing your money."
    ]
  };

  // AI-powered response generator
  const generateResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Greeting patterns
    if (input.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return getRandomResponse(responses.greetings);
    }
    
    // What is FinJar
    if (input.includes('what is finjar') || input.includes('what is this') || input.includes('tell me about finjar')) {
      return getRandomResponse(responses.whatIsFinjar);
    }
    
    // How it works
    if (input.includes('how') && (input.includes('work') || input.includes('use') || input.includes('function'))) {
      return getRandomResponse(responses.howItWorks);
    }
    
    // Features
    if (input.includes('feature') || input.includes('what can') || input.includes('capabilities')) {
      return getRandomResponse(responses.features);
    }
    
    // Security
    if (input.includes('security') || input.includes('secure') || input.includes('safe') || input.includes('protect')) {
      return getRandomResponse(responses.security);
    }
    
    // Pricing
    if (input.includes('free') || input.includes('cost') || input.includes('price') || input.includes('pay') || input.includes('money')) {
      return getRandomResponse(responses.pricing);
    }
    
    // Getting started
    if (input.includes('start') || input.includes('begin') || input.includes('sign up') || input.includes('register')) {
      return getRandomResponse(responses.gettingStarted);
    }
    
    // Support
    if (input.includes('help') || input.includes('support') || input.includes('contact') || input.includes('problem')) {
      return getRandomResponse(responses.support);
    }
    
    // Benefits
    if (input.includes('benefit') || input.includes('why') || input.includes('advantage') || input.includes('good')) {
      return getRandomResponse(responses.benefits);
    }
    
    // Savings related
    if (input.includes('save') || input.includes('saving') || input.includes('goal') || input.includes('jar')) {
      return "FinJar makes saving money simple and fun! Create virtual jars for different goals, track your progress, and celebrate when you reach your targets. Our users save 3x more than traditional methods! Want to know more about any specific feature?";
    }
    
    // Thank you
    if (input.includes('thank') || input.includes('thanks')) {
      return "You're very welcome! I'm here whenever you need help. Feel free to ask me anything about FinJar - I love talking about how we can help you achieve your financial goals!";
    }
    
    // Goodbye
    if (input.includes('bye') || input.includes('goodbye') || input.includes('see you')) {
      return "Goodbye! Thanks for chatting with me. Remember, FinJar is here to help you turn your financial dreams into reality. Have a great day!";
    }
    
    // Default response
    return "That's a great question! I'd love to help you learn more about FinJar. You can ask me about our features, how to get started, security, pricing, or anything else. What interests you most?";
  };

  const getRandomResponse = (responseArray) => {
    return responseArray[Math.floor(Math.random() * responseArray.length)];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: generateResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickAction = (action) => {
    setInputMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  // Floating chat button
  // ...existing code...

// Floating chat button
if (!isOpen) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(true)}
        className={`group relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
        }`}
      >
        <MessageCircle className="w-8 h-8 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        
        {/* Notification badge */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">1</span>
        </div>
        
        {/* Removed pulse animation - this line was causing the glow effect */}
        {/* <div className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping"></div> */}
        
        {/* Tooltip */}
        <div className={`absolute bottom-full right-0 mb-2 px-3 py-1 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'
        }`}>
          Chat with FinBot
          <div className={`absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent ${
            isDarkMode ? 'border-t-gray-800' : 'border-t-gray-900'
          }`}></div>
        </div>
      </button>
    </div>
  );
}

// ...existing code...
  // Full screen overlay chatbot
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className={`w-full max-w-2xl mx-4 transition-all duration-300 ${
          isMinimized ? 'h-16' : 'h-[80vh]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-full h-full rounded-2xl shadow-2xl border overflow-hidden ${
          isDarkMode 
            ? 'bg-gray-900 border-gray-700' 
            : 'bg-white border-gray-200'
        }`}>
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  FinBot
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Online • Instant replies
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-600'
                }`}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className={`flex-1 p-6 space-y-4 overflow-y-auto ${
                isDarkMode ? 'bg-gray-900' : 'bg-white'
              }`} style={{ height: 'calc(80vh - 180px)' }}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-3 max-w-md ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-blue-600' 
                          : 'bg-gradient-to-r from-blue-600 to-purple-600'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      
                      <div className={`px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : isDarkMode 
                            ? 'bg-gray-800 text-gray-200 border border-gray-700'
                            : 'bg-gray-100 text-gray-900 border border-gray-200'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' 
                            ? 'text-blue-200' 
                            : isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3 max-w-md">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className={`px-4 py-3 rounded-2xl ${
                        isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-100 border border-gray-200'
                      }`}>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              {messages.length === 1 && (
                <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Quick questions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action)}
                        className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                          isDarkMode 
                            ? 'border-gray-600 text-gray-300 hover:bg-gray-800' 
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex space-x-3">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask me anything about FinJar..."
                    disabled={isTyping}
                    className={`flex-1 px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Rest of the existing components remain the same...
// Navbar Component with smooth scrolling
const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleAbout = () => {
    navigate('/about');
    window.scrollTo(0, 0);
    console.log('Navigate to About');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${
      isDarkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'
    } border-b`}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => scrollToSection('home')}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              isDarkMode ? 'bg-blue-600' : 'bg-blue-600'
            }`}>
              <span className="text-white font-bold text-sm">FJ</span>
            </div>
            <span className={`text-xl font-bold transition-colors duration-300 ${
              isDarkMode ? 'text-blue-400' : 'text-blue-800'
            }`}>
              FinJar
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-14">
            <button onClick={() => scrollToSection('home')} className={`transition-all duration-300 hover:scale-105 bg-transparent border-none ${
              isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
            }`}>
              Home
            </button>
            <button onClick={() => scrollToSection('features')} className={`transition-all duration-300 hover:scale-105 bg-transparent border-none ${
              isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
            }`}>
              Features
            </button>
            <button onClick={handleAbout} className={`transition-all duration-300 hover:scale-105 bg-transparent border-none ${
              isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
            }`}>
              About
            </button>
            <button onClick={() => scrollToSection('contact')} className={`transition-all duration-300 hover:scale-105 bg-transparent border-none ${
              isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
            }`}>
              Contact
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={toggleMenu}
              className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
                isDarkMode ? 'text-blue-400 hover:bg-gray-800' : 'text-blue-600 hover:bg-gray-100'
              }`}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden mt-4 py-4 border-t transition-colors duration-300 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('home')} className={`text-left transition-colors duration-300 bg-transparent border-none ${
                isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
              }`}>
                Home
              </button>
              <button onClick={() => scrollToSection('features')} className={`text-left transition-colors duration-300 bg-transparent border-none ${
                isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
              }`}>
                Features
              </button>
              <button onClick={handleAbout} className={`text-left transition-colors duration-300 bg-transparent border-none ${
                isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
              }`}>
                About
              </button>
              <button onClick={() => scrollToSection('contact')} className={`text-left transition-colors duration-300 bg-transparent border-none ${
                isDarkMode ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'
              }`}>
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

// Features Component
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
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${
                  isDarkMode ? 'bg-gradient-to-br from-blue-400 to-purple-600' : 'bg-gradient-to-br from-blue-500 to-purple-700'
                }`}></div>
                
                <div className={`relative w-16 h-16 rounded-xl mb-6 flex items-center justify-center border-2 transition-all duration-500 group-hover:scale-110 ${
                  getColorClasses(feature.color, isDarkMode)
                }`}>
                  <Icon size={28} className="transition-transform duration-500 group-hover:rotate-12" />
                </div>

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

      <div className="absolute top-1/4 right-0 w-64 h-64 bg-gradient-to-l from-blue-500 to-purple-600 rounded-full opacity-5 blur-3xl"></div>
      <div className="absolute bottom-1/4 left-0 w-48 h-48 bg-gradient-to-r from-green-500 to-blue-600 rounded-full opacity-5 blur-3xl"></div>
    </section>
  );
};

// Main Landing Page Component
export default function FinJarLanding({ isDarkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  
  const handleStartNowClick = () => {
    navigate('/registration');
    console.log('Navigate to registration');
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <section id="home" className={`pt-24 pb-12 min-h-screen flex items-center transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="container mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 lg:pl-12">
              <div className="space-y-6">
                <h1 className={`text-5xl lg:text-6xl font-bold transition-colors duration-300 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>FinJar</span>
                  <br />
                  <span className={`transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Your Personalized
                    <br />
                    Savings
                    <br />
                    Companion
                  </span>
                </h1>
                
                <p className={`text-lg lg:text-xl leading-relaxed transition-colors duration-300 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  FinJar is a goal-based fintech app that helps individuals build strong savings habits — one jar at a time.
                </p>
              </div>

              <button 
                onClick={handleStartNowClick}
                className={`inline-flex items-center space-x-2 px-8 py-4 rounded-lg font-medium text-lg transition-all duration-300 transform hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                }`}
              >
                <span>Start Now</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 10.28a.75.75 0 000-1.06l-3-3a.75.75 0 10-1.06 1.06l1.72 1.72H8.25a.75.75 0 000 1.5h5.69l-1.72 1.72a.75.75 0 101.06 1.06l3-3z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            <div className="flex justify-center">
              <div className="w-full max-w-lg">
                <img 
                  src="/mobile-application.png" 
                  alt="FinJar App Interface" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 left-0 w-32 h-32 bg-blue-500 rounded-full opacity-10 blur-xl transform -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-0 w-40 h-40 bg-blue-400 rounded-full opacity-10 blur-xl"></div>
      </section>

      <Features isDarkMode={isDarkMode} />

      <section className={`py-20 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className={`text-4xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Why Choose FinJar?</h2>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Discover the power of goal-based savings and transform your financial future...</p>
        </div>
      </section>

      <section id="contact" className={`py-20 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className={`text-4xl font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Get In Touch</h2>
          <p className={`text-lg ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Contact us for support or questions...</p>
        </div>
      </section>

      {/* Add the Chatbot */}
      <FinJarChatbot isDarkMode={isDarkMode} />
    </div>
  );
}