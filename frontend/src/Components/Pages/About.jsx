import React from 'react';
import { Link } from 'react-router-dom'; // <- Added for routing
import { Shield, Award, Clock, Star, Users, MapPin, TrendingUp, Heart, CheckCircle, Target } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, value: '500+', label: 'Verified Guides', color: 'from-blue-500 to-cyan-500' },
    { icon: MapPin, value: '50+', label: 'Cities Covered', color: 'from-purple-500 to-pink-500' },
    { icon: Star, value: '10K+', label: 'Happy Travelers', color: 'from-green-500 to-emerald-500' },
    { icon: TrendingUp, value: '4.9/5', label: 'Average Rating', color: 'from-amber-500 to-orange-500' },
  ];

  const features = [
    {
      icon: Shield,
      title: 'Verified Guides',
      description: 'All guides are background-checked, certified, and verified with proven expertise in Pakistan\'s history and culture.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Award,
      title: 'Expert Knowledge',
      description: 'Deep understanding of local history, culture, traditions, and hidden gems that only locals know about.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Clock,
      title: 'Flexible Booking',
      description: 'Easy scheduling, instant confirmation, and fair cancellation policies designed for your convenience.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Star,
      title: 'Quality Assured',
      description: 'Read genuine reviews and ratings from real travelers. We maintain high standards for all our guides.',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  const values = [
    { icon: Heart, title: 'Passion for Culture', description: 'We love sharing Pakistan\'s rich heritage' },
    { icon: Shield, title: 'Safety First', description: 'Your security is our top priority' },
    { icon: CheckCircle, title: 'Authenticity', description: 'Genuine local experiences guaranteed' },
    { icon: Target, title: 'Excellence', description: 'Committed to providing the best service' },
  ];

  return (
    <section id="about" className="py-16 md:py-20 px-4 bg-linear-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            About Pakistan Travel
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Connecting travelers with expert local guides for unforgettable journeys across Pakistan
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 animate-fadeIn">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 bg-linear-to-r ${stat.color} rounded-xl mb-4`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Description */}
          <div className="animate-slideInLeft">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">
              Your Gateway to Pakistan's Hidden Treasures
            </h3>
            <p className="text-gray-700 mb-4 leading-relaxed">
              We connect travelers with experienced local guides who have deep knowledge of Pakistan's rich history, diverse culture, and stunning landscapes. Our mission is to make your journey authentic, safe, and unforgettable.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Our platform ensures safe, authentic, and memorable travel experiences across all four provinces of Pakistan, from the ancient cities of Punjab to the mountainous beauty of KPK, the coastal charm of Sindh, and the rugged landscapes of Balochistan.
            </p>
            
            {/* Values Grid */}
            <div className="grid grid-cols-2 gap-4">
              {values.map((value, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg shrink-0">
                    <value.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{value.title}</h4>
                    <p className="text-xs text-gray-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Features */}
          <div className="animate-slideInRight">
            <div className="bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Why Choose Us?</h3>
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-xl shrink-0">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{feature.title}</h4>
                      <p className="text-blue-100 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl mb-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To bridge the gap between travelers and local experts, creating authentic cultural exchanges while promoting sustainable tourism across Pakistan. We aim to showcase the true beauty and diversity of our nation through the eyes of those who know it best.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl mb-4">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              To become the leading platform for cultural tourism in Pakistan, recognized globally for connecting travelers with exceptional local guides. We envision a future where every visitor experiences the warmth, beauty, and rich heritage of Pakistan.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered the real Pakistan with our expert guides
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/guides" // <- updated routing
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition shadow-lg transform hover:scale-105"
            >
              Find Your Guide
            </Link>
            <Link
              to="/destinations" // <- updated routing
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition transform hover:scale-105"
            >
              Explore Destinations
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
