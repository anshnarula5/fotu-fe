import React from 'react';
import { ArrowRight, Upload, Zap, Shield, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Analyze Your Images with
          <span className="text-blue-600"> AI Magic</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Get instant, professional analysis of your images using cutting-edge AI technology.
          Perfect for photographers, designers, and creative professionals.
        </p>
        <div className="flex justify-center gap-4">
          <Link href={'/image'} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition flex items-center">
            Try It Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <button className="bg-gray-100 text-gray-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
            View Pricing
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">Get detailed analysis in seconds, not minutes.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <ImageIcon className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Professional Insights</h3>
            <p className="text-gray-600">Technical and artistic analysis powered by Gemini AI.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">Your images are processed with complete privacy.</p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-2">Free</h3>
              <p className="text-gray-600 mb-4">Perfect for getting started</p>
              <div className="text-3xl font-bold mb-6">$0</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                  5 uploads per day
                </li>
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                  Basic analysis
                </li>
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                  Email support
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                Get Started
              </button>
            </div>
            <div className="bg-blue-600 p-8 rounded-xl shadow-lg text-white transform scale-105">
              <h3 className="text-xl font-semibold mb-2">Pro</h3>
              <p className="text-blue-100 mb-4">For serious creators</p>
              <div className="text-3xl font-bold mb-6">$29/mo</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Unlimited uploads
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Advanced analysis
                </li>
                <li className="flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Priority support
                </li>
              </ul>
              <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition">
                Start Free Trial
              </button>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-4">For teams and businesses</p>
              <div className="text-3xl font-bold mb-6">Custom</div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                  Custom upload limits
                </li>
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                  API access
                </li>
                <li className="flex items-center text-gray-600">
                  <ArrowRight className="h-4 w-4 mr-2 text-blue-600" />
                  24/7 support
                </li>
              </ul>
              <button className="w-full bg-gray-100 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;