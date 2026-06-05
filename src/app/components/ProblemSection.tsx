import { AlertTriangle, TrendingUp, Users } from 'lucide-react';

export function ProblemSection() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full mb-4">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm text-red-800">The Challenge</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Online Harms Are Spreading Faster
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Than young people can verify them. Every day, thousands of scams, deepfakes, and misinformation pieces target Singaporean youths.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-t-4 border-red-600">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">300% Increase</h3>
            <p className="text-gray-600">
              in online scams targeting youths in Singapore over the past 2 years
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-t-4 border-red-600">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <AlertTriangle className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">$660M Lost</h3>
            <p className="text-gray-600">
              to scams in Singapore in 2024, with deepfakes becoming increasingly common
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-t-4 border-red-600">
            <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">1 in 3 Youths</h3>
            <p className="text-gray-600">
              have encountered cyberbullying or misinformation in the past month
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
