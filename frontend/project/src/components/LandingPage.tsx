import React from "react";
import {
  Building2,
  Shield,
  Clock,
  TrendingUp,
  Users,
  CheckCircle,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

interface LandingPageProps {
  onShowLogin: () => void;
  onShowRegister: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onShowLogin,
  onShowRegister,
}) => {
  const features = [
    {
      icon: <Shield className='w-8 h-8 text-blue-600' />,
      title: "Secure & Trusted",
      description:
        "Bank-grade security with end-to-end encryption to protect your financial data.",
    },
    {
      icon: <Clock className='w-8 h-8 text-green-600' />,
      title: "Quick Approval",
      description:
        "Get loan approvals in as little as 24 hours with our streamlined process.",
    },
    {
      icon: <TrendingUp className='w-8 h-8 text-purple-600' />,
      title: "Competitive Rates",
      description:
        "Enjoy some of the most competitive interest rates in the market.",
    },
    {
      icon: <Users className='w-8 h-8 text-orange-600' />,
      title: "Expert Support",
      description:
        "Our dedicated loan officers are here to guide you every step of the way.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      quote:
        "LoanFlow helped me expand my business with their quick approval process and excellent customer service.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Home Buyer",
      quote:
        "The transparent process and competitive rates made my home loan journey stress-free.",
      rating: 5,
    },
    {
      name: "Priya Sharma",
      role: "Student",
      quote:
        "Their education loan helped me pursue my dreams without financial worries.",
      rating: 5,
    },
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "ETB 500Cr+", label: "Loans Disbursed" },
    { number: "24hrs", label: "Average Approval Time" },
    { number: "8.5%", label: "Starting Interest Rate" },
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50'>
      {/* Header */}
      <nav className='bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <div className='flex items-center space-x-3'>
              <div className='flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl'>
                <Building2 className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                  LoanFlow
                </h1>
                <p className='text-xs text-gray-500'>Your Financial Partner</p>
              </div>
            </div>

            <div className='flex items-center space-x-4'>
              <button
                onClick={onShowLogin}
                className='px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200'
              >
                Sign In
              </button>
              <button
                onClick={onShowRegister}
                className='px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium'
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto text-center'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight'>
              Your Dreams,{" "}
              <span className='bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent'>
                Our Support
              </span>
            </h1>
            <p className='text-xl text-gray-600 mb-8 leading-relaxed'>
              Experience seamless loan management with competitive rates, quick
              approvals, and personalized service. From home loans to business
              expansion, we're here to help.
            </p>

            {/* Quote Section */}
            <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20 shadow-lg'>
              <blockquote className='text-2xl font-medium text-gray-700 italic mb-4'>
                "Success is not just about what you accomplish in your life,
                it's about what you inspire others to do."
              </blockquote>
              <cite className='text-gray-500'>— Unknown</cite>
            </div>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button
                onClick={onShowRegister}
                className='flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold text-lg'
              >
                <span>Apply for Loan</span>
                <ArrowRight className='w-5 h-5' />
              </button>
              <button
                onClick={onShowLogin}
                className='px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 font-semibold text-lg'
              >
                Existing Customer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 px-4 sm:px-6 lg:px-8 bg-white/40 backdrop-blur-sm'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            {stats.map((stat, index) => (
              <div key={index} className='text-center'>
                <div className='text-3xl md:text-4xl font-bold text-gray-800 mb-2'>
                  {stat.number}
                </div>
                <div className='text-gray-600 font-medium'>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-gray-800 mb-4'>
              Why Choose LoanFlow?
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
              We combine cutting-edge technology with personalized service to
              make your loan journey smooth and transparent.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {features.map((feature, index) => (
              <div
                key={index}
                className='bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1'
              >
                <div className='bg-gray-50 w-16 h-16 rounded-xl flex items-center justify-center mb-6'>
                  {feature.icon}
                </div>
                <h3 className='text-xl font-semibold text-gray-800 mb-4'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl font-bold text-gray-800 mb-4'>
              What Our Customers Say
            </h2>
            <p className='text-xl text-gray-600'>
              Don't just take our word for it - hear from our satisfied
              customers
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className='bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-lg'
              >
                <div className='flex items-center mb-4'>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className='w-5 h-5 text-yellow-400 fill-current'
                    />
                  ))}
                </div>
                <blockquote className='text-gray-700 mb-6 italic'>
                  "{testimonial.quote}"
                </blockquote>
                <div>
                  <div className='font-semibold text-gray-800'>
                    {testimonial.name}
                  </div>
                  <div className='text-gray-600 text-sm'>
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto text-center'>
          <div className='bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white'>
            <h2 className='text-4xl font-bold mb-4'>Ready to Get Started?</h2>
            <p className='text-xl mb-8 opacity-90'>
              Join thousands of satisfied customers who chose LoanFlow for their
              financial needs.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              <button
                onClick={onShowRegister}
                className='px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gray-50 transition-all duration-200 font-semibold text-lg'
              >
                Apply Now
              </button>
              <button
                onClick={onShowLogin}
                className='px-8 py-4 border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all duration-200 font-semibold text-lg'
              >
                Customer Login
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mb-12'>
            {/* Company Info */}
            <div className='md:col-span-2'>
              <div className='flex items-center space-x-3 mb-6'>
                <div className='flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl'>
                  <Building2 className='w-6 h-6 text-white' />
                </div>
                <div>
                  <h3 className='text-xl font-bold'>LoanFlow</h3>
                  <p className='text-gray-400 text-sm'>
                    Your Financial Partner
                  </p>
                </div>
              </div>
              <p className='text-gray-300 mb-6 leading-relaxed'>
                LoanFlow is committed to providing transparent, efficient, and
                customer-centric financial solutions. We believe in empowering
                individuals and businesses to achieve their dreams through
                accessible lending.
              </p>
              <div className='flex items-center space-x-4'>
                <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-bold'>f</span>
                </div>
                <div className='w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-bold'>t</span>
                </div>
                <div className='w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center'>
                  <span className='text-sm font-bold'>in</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className='text-lg font-semibold mb-6'>Contact Us</h4>
              <div className='space-y-4'>
                <div className='flex items-center space-x-3'>
                  <Phone className='w-5 h-5 text-blue-400' />
                  <span className='text-gray-300'>+25190281347</span>
                </div>
                <div className='flex items-center space-x-3'>
                  <Mail className='w-5 h-5 text-blue-400' />
                  <span className='text-gray-300'>support@loanflow.com</span>
                </div>
                <div className='flex items-start space-x-3'>
                  <MapPin className='w-5 h-5 text-blue-400 mt-1' />
                  <span className='text-gray-300'>
                    123 Financial District,
                    <br />
                    Adama,Oromia,Ethiopia
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Guidelines */}
          <div className='border-t border-gray-800 pt-8 mb-8'>
            <h4 className='text-lg font-semibold mb-4'>Important Guidelines</h4>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300'>
              <div>
                <h5 className='font-medium text-white mb-2'>
                  Loan Eligibility
                </h5>
                <ul className='space-y-1'>
                  <li>• Minimum age: 21 years, Maximum age: 65 years</li>
                  <li>• Minimum income: 25,000 ETB per month</li>
                  <li>• Good credit score (CIBIL score 650+)</li>
                  <li>• Valid identity and address proof required</li>
                </ul>
              </div>
              <div>
                <h5 className='font-medium text-white mb-2'>
                  Terms & Conditions
                </h5>
                <ul className='space-y-1'>
                  <li>• Interest rates subject to credit assessment</li>
                  <li>• Processing fees: 1-2% of loan amount</li>
                  <li>• Prepayment charges may apply</li>
                  <li>• All loans subject to approval</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className='border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center'>
            <div className='text-gray-400 text-sm mb-4 md:mb-0'>
              © 2024 LoanFlow Financial Services. All rights reserved.
            </div>
            <div className='flex space-x-6 text-sm text-gray-400'>
              <a
                href='#'
                className='hover:text-white transition-colors duration-200'
              >
                Privacy Policy
              </a>
              <a
                href='#'
                className='hover:text-white transition-colors duration-200'
              >
                Terms of Service
              </a>
              <a
                href='#'
                className='hover:text-white transition-colors duration-200'
              >
                Cookie Policy
              </a>
              <a
                href='#'
                className='hover:text-white transition-colors duration-200'
              >
                Disclaimer
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
