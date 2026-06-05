import { Eye, Link2, Users, ScanLine, Heart, MapPin } from 'lucide-react';

export function FeatureCardsSection() {
  const features = [
    {
      icon: Eye,
      title: "Spot the Spin",
      description: "Learn to identify fake news, misleading headlines, and manipulated media through interactive challenges",
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      icon: Link2,
      title: "Chain Reaction",
      description: "Understand how misinformation spreads and learn to break the chain before it reaches your community",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      icon: Users,
      title: "Shield Squad",
      description: "Form teams with friends and compete in collaborative missions to protect your digital community",
      color: "from-green-500 to-green-600",
      iconBg: "bg-green-100",
      iconColor: "text-green-600"
    },
    {
      icon: ScanLine,
      title: "Shield Scanner",
      description: "AI-powered tool to instantly verify messages, images, QR codes, and URLs for potential threats",
      color: "from-red-500 to-red-600",
      iconBg: "bg-red-100",
      iconColor: "text-red-600"
    },
    {
      icon: Heart,
      title: "Cyberbullying Support",
      description: "Safe space to report incidents, get support, and learn strategies to stand up against online harassment",
      color: "from-pink-500 to-pink-600",
      iconBg: "bg-pink-100",
      iconColor: "text-pink-600"
    },
    {
      icon: MapPin,
      title: "Guardian Heatmap",
      description: "Real-time map showing scam hotspots and community alerts across Singapore",
      color: "from-orange-500 to-orange-600",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    }
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Your Digital Defense Arsenal
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful tools and features designed to keep you safe online
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer"
            >
              <div className={`${feature.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              <div className={`mt-6 h-1 bg-gradient-to-r ${feature.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
