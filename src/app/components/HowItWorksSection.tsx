import { BookOpen, ScanLine, Shield, Users } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      icon: BookOpen,
      title: "Learn",
      description: "Complete interactive missions that teach you to spot scams, deepfakes, and misinformation",
      color: "bg-blue-500"
    },
    {
      icon: ScanLine,
      title: "Scan",
      description: "Use our AI-powered scanner to verify suspicious messages, images, and QR codes instantly",
      color: "bg-purple-500"
    },
    {
      icon: Shield,
      title: "Protect",
      description: "Apply your skills in real-world scenarios and protect yourself and your community",
      color: "bg-red-500"
    },
    {
      icon: Users,
      title: "Community",
      description: "Join a network of digital protectors building Singapore's collective resilience",
      color: "bg-green-500"
    }
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your journey to becoming a digital protector in 4 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-gray-50 rounded-2xl p-8 h-full hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`${step.color} w-12 h-12 rounded-xl flex items-center justify-center text-white`}>
                    <step.icon className="w-6 h-6" />
                  </div>
                  <span className="text-4xl font-bold text-gray-300">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-gray-300"></div>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
