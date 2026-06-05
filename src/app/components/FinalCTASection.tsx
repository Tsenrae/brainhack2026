import { Shield, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

export function FinalCTASection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-red-600 via-red-700 to-purple-700 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm">Join the Movement</span>
        </div>

        <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
          Become a Digital Protector
        </h2>

        <p className="text-2xl text-red-50 mb-12 leading-relaxed max-w-2xl mx-auto">
          Join 50,000+ young Singaporeans building a safer digital future. Start your journey today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/dashboard" className="flex items-center justify-center gap-2 px-10 py-5 bg-white text-red-600 rounded-xl hover:bg-red-50 transition-all shadow-2xl text-lg">
            <Shield className="w-6 h-6" />
            <span className="font-medium">Start Your Mission</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="flex items-center justify-center gap-2 px-10 py-5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 rounded-xl transition-all text-lg">
            <span className="font-medium">Learn More</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-white/20">
          <div>
            <div className="text-4xl font-bold mb-2">Free</div>
            <div className="text-sm text-red-100">Always Free</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">15min</div>
            <div className="text-sm text-red-100">First Mission</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-sm text-red-100">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
