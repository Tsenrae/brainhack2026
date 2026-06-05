import { Shield, Scan } from 'lucide-react';
import { Link } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-red-50 py-20 px-6">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-800">Singapore Smart Nation Initiative</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Train. Scan. Protect.
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Learn to detect scams, deepfakes, fake QR codes, misinformation, and cyberbullying before they harm you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/dashboard" className="flex items-center justify-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
                <Shield className="w-5 h-5" />
                <span>Start Digital Shield</span>
              </Link>
              <Link to="/dashboard" className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-red-600 border-2 border-red-600 rounded-xl transition-all">
                <Scan className="w-5 h-5" />
                <span>Scan Suspicious Content</span>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">50K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">1M+</div>
                <div className="text-sm text-gray-600">Scans Completed</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">98%</div>
                <div className="text-sm text-gray-600">Detection Rate</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl transform rotate-3 opacity-10"></div>
            <div className="relative bg-white rounded-3xl shadow-2xl p-8 border-4 border-red-100">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1751448555253-f39c06e29d82?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
                alt="Digital Shield Protection Dashboard"
                className="w-full rounded-xl"
              />
              <div className="absolute -top-4 -right-4 bg-red-600 text-white p-4 rounded-2xl shadow-xl">
                <Shield className="w-8 h-8" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl border-2 border-red-200">
                <div className="text-xs text-gray-600">Protection Status</div>
                <div className="text-sm font-bold text-green-600">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
