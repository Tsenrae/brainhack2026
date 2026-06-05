import { Target, Clock, Award, ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function FeaturedMissionSection() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-red-600 to-red-700 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <Target className="w-4 h-4" />
              <span className="text-sm">Featured Mission</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              Mission 1: Digital Shield
            </h2>
            <h3 className="text-2xl text-red-100">
              Spot the Spin
            </h3>

            <p className="text-xl text-red-50 leading-relaxed">
              Learn to identify manipulated news headlines, fake social media posts, and misleading statistics. Master the art of critical thinking in the digital age.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Clock className="w-4 h-4" />
                <span className="text-sm">15 minutes</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Award className="w-4 h-4" />
                <span className="text-sm">+500 XP</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Target className="w-4 h-4" />
                <span className="text-sm">Beginner</span>
              </div>
            </div>

            <button className="flex items-center gap-2 px-8 py-4 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-all shadow-lg">
              <span className="font-medium">Start Mission</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1565688256340-249dbb31f25d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800"
                alt="Students learning digital literacy"
                className="w-full rounded-2xl"
              />
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-red-100">Progress</span>
                  <span className="font-bold">0%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div className="bg-white h-3 rounded-full w-0"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
