"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Combine,
  Zap,
  BrainCircuit,
  ShieldCheck,
  Map,
  LayoutGrid,
  BadgePercent,
  BarChart,
  UploadCloud,
  TrendingUp,
  ClipboardCheck,
  Wallet,
  Users,
  Asterisk,
} from "lucide-react";

// Hero Section Component
const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-[#09080b]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-transparent"></div>
        {/* Animated background elements */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Billboard Image - Left Bottom Corner */}
      <div className="absolute bottom-5 left-5 hidden lg:block lg:w-3/12 max-w-lg z-0">
        <Image
          src="/billboard-abstract.png"
          alt="Digital billboard screens in city"
          width={900}
          height={700}
          className="object-contain opacity-70"
          priority={false}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-6xl lg:text-7xl font-bold text-[#F5F5F5] mb-6 leading-tight"
        >
          The Central Hub for{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Digital Out-of-Home
          </span>{" "}
          Advertising
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-[#A3A3A3] mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Discover, book, and optimize DOOH screens across India — in one
          powerful platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <button className="group bg-white text-black px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 hover:bg-gray-100">
            Start a Campaign
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group border border-white/20 hover:border-white/40 text-[#F5F5F5] px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/5">
            Onboard Your Screens
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// Problem Section Component
const ProblemSection = () => {
  const problems = [
    "Fragmented DOOH inventory makes it hard to plan at scale.",
    "Manual booking processes waste time.",
    "Advertisers lack real-time visibility into performance.",
    "Media owners struggle with yield optimization and compliance.",
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-bold text-[#F5F5F5] text-center mb-16"
        >
          The old way is{" "}
          <span className="text-red-400">broken</span>.
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
            >
              <p className="text-lg text-[#A3A3A3] leading-relaxed">{problem}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main Landing Page Component
// Solution Section Component
const SolutionSection = () => {
  const solutions = [
    {
      icon: Combine,
      text: "One platform to connect advertisers and DOOH media owners.",
    },
    {
      icon: Zap,
      text: "Programmatic trading engine for instant booking & fair auctions.",
    },
    {
      icon: BrainCircuit,
      text: "AI-driven optimization for targeting and smarter placements.",
    },
    {
      icon: ShieldCheck,
      text: "Real-time proof of play for transparency and trust.",
    },
  ];

  return (
    <section id="solutions" className="py-24 px-6 relative">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 rounded-3xl blur-3xl"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-bold text-[#F5F5F5] text-center mb-16"
        >
          Welcome to the{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Future of DOOH
          </span>
          .
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0}}
              whileInView={{ opacity: 1}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300"
            >
              <solution.icon className="w-8 h-8 text-purple-400 mb-4 group-hover:text-purple-300 transition-colors" />
              <p className="text-lg text-[#A3A3A3] leading-relaxed">
                {solution.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// For Advertisers Section Component
const ForAdvertisersSection = () => {
  const features = [
    { icon: Map, text: "Interactive map to explore available DOOH screens." },
    {
      icon: LayoutGrid,
      text: "Smart campaign planner with drag-and-drop scheduling.",
    },
    {
      icon: BrainCircuit,
      text: "AI-enhanced targeting (Traffic, Weather, Audience Prediction).",
    },
    { icon: BadgePercent, text: "Instant pricing & booking confirmation." },
    {
      icon: BarChart,
      text: "Real-time performance analytics & ROI dashboard.",
    },
  ];

  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Text */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-6"
            >
              For Advertisers
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-[#A3A3A3] mb-12"
            >
              Your entire DOOH strategy, simplified.
            </motion.p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-purple-500/30">
                    <feature.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <p className="text-[#A3A3A3] text-lg leading-relaxed">
                    {feature.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-white/10 p-8 flex items-center justify-center">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-600/5 border border-white/5 flex items-center justify-center">
              <Image
                src="/map.png"
                alt="adCentra.ai Dashboard - Real-time analytics and performance metrics"
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority={false}
              />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// For Media Owners Section Component
const ForMediaOwnersSection = () => {
  const features = [
    {
      icon: UploadCloud,
      text: "Easy screen onboarding with GPS, specs, and pricing.",
    },
    {
      icon: TrendingUp,
      text: "Dynamic pricing engine powered by AI yield optimization.",
    },
    {
      icon: ClipboardCheck,
      text: "Campaign approval workflows with compliance auto-check.",
    },
    {
      icon: Wallet,
      text: "Earnings dashboard with real-time payout tracking.",
    },
    {
      icon: Users,
      text: "Access to premium advertisers through a private marketplace.",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative order-2 lg:order-1"
          >
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-600/10 border border-white/10 p-8 flex items-center justify-center">
              <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-500/5 to-blue-600/5 border border-white/5 flex items-center justify-center">
              <Image
                src="/inventory.png"
                alt="adCentra.ai Dashboard - Real-time analytics and performance metrics"
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority={false}
              />
              </div>
            </div>
          </motion.div>

          {/* Right Column - Text */}
          <div className="order-1 lg:order-2">
            <motion.h2
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-6"
            >
              For Media Owners
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-xl text-[#A3A3A3] mb-12"
            >
              Maximize your revenue and streamline operations.
            </motion.p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-600/20 border border-blue-500/30">
                    <feature.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <p className="text-[#A3A3A3] text-lg leading-relaxed">
                    {feature.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// How It Works Section Component
const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      title: "Onboard",
      description: "Media owners onboard their DOOH screens.",
    },
    {
      number: "2",
      title: "Discover",
      description: "Advertisers discover & book through auctions or direct buys.",
    },
    {
      number: "3",
      title: "Match",
      description: "AI matches campaigns to best-fit slots (traffic, time, weather).",
    },
    {
      number: "4",
      title: "Verify",
      description: "Content is distributed & verified in real time.",
    },
    {
      number: "5",
      title: "Analyze",
      description: "Proof of play & performance analytics close the loop.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-20"
        >
          How It Works
        </motion.h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500"></div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative flex items-start gap-8"
              >
                {/* Step number */}
                <div className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                  {step.number}
                </div>

                {/* Content */}
                <div className="flex-1 pt-3">
                  <h3 className="text-2xl font-bold text-[#F5F5F5] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-lg text-[#A3A3A3] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Platform Features Section Component
const PlatformFeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "Programmatic Trading Engine",
      description: "OpenRTB-ready",
    },
    {
      icon: LayoutGrid,
      title: "Multi-format CMS",
      description: "Manage your creatives effortlessly",
    },
    {
      icon: ShieldCheck,
      title: "Proof of Play",
      description: "Hardware/software-based verification",
    },
    {
      icon: BrainCircuit,
      title: "AI-Powered Optimization",
      description: "Dynamic creative, predictive modeling, yield management",
    },
    {
      icon: ClipboardCheck,
      title: "Compliance & License Automation",
      description: "ASCI + State rules",
    },
    {
      icon: Wallet,
      title: "Escrow-based Payments",
      description: "Secure & transparent billing",
    },
  ];

  return (
    <section className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-20"
        >
          An End-to-End Platform
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0}}
              whileInView={{ opacity: 1}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group p-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
            >
              <feature.icon className="w-8 h-8 text-purple-400 mb-6 group-hover:text-purple-300 transition-colors" />
              <h3 className="text-xl font-bold text-[#F5F5F5] mb-3">
                {feature.title}
              </h3>
              <p className="text-[#A3A3A3] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Analytics Section Component
const AnalyticsSection = () => {
  const analyticsFeatures = [
    "Live campaign monitoring dashboard.",
    "Heatmaps of ad exposure by time & geography.",
    "Benchmark comparisons across campaigns.",
    "ROI tracking per screen, per campaign.",
  ];

  return (
    <section id="analytics" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-6"
          >
            Data-Driven Decisions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-[#A3A3A3]"
          >
            Unprecedented transparency in DOOH.
          </motion.p>
        </div>

        {/* Dashboard Screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative mb-16"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-blue-500/5 to-purple-600/5">
            <div className="aspect-video w-full relative">
              <Image
                src="/dashboard.png"
                alt="adCentra.ai Dashboard - Real-time analytics and performance metrics"
                fill
                className="object-cover rounded-2xl"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                priority={false}
              />
            </div>
            
            {/* Optional overlay for better presentation */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
          </div>
          
          {/* Caption */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center text-[#A3A3A3] text-sm mt-4"
          >
            Real-time analytics dashboard with comprehensive DOOH campaign insights
          </motion.p>
        </motion.div>

        {/* Features List */}
        <div className="grid md:grid-cols-2 gap-6">
          {analyticsFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-[#A3A3A3] text-lg"
            >
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-600"></div>
              {feature}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Why Adcentra Section Component
const WhyAdcentraSection = () => {
  const differentiators = [
    {
      title: "India's First",
      description: "Standardized DOOH Marketplace.",
    },
    {
      title: "Built for Trust",
      description: "Proof of play + compliance.",
    },
    {
      title: "Smarter with AI",
      description: "Traffic, weather, and demographic intelligence.",
    },
    {
      title: "Scalable",
      description: "One campaign across 100s of screens, one-click.",
    },
  ];

  return (
    <section id="why-adcentra" className="py-24 px-6 bg-white/[0.02]">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-20"
        >
          Why{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            adCentra.ai
          </span>
          ?
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {differentiators.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-[#F5F5F5] mb-4">
                {item.title}
              </h3>
              <p className="text-[#A3A3A3] text-lg leading-relaxed">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Section Component
const CTASection = () => {
  return (
    <section id="cta" className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5F5F5] mb-12 leading-tight"
        >
          Ready to Transform{" "}
          <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            DOOH Advertising
          </span>
          ?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <button className="group bg-white text-black px-10 py-5 rounded-full font-semibold text-xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-100">
            Launch Your Campaign
          </button>
          <button className="group border border-white/20 hover:border-white/40 text-[#F5F5F5] px-10 py-5 rounded-full font-semibold text-xl transition-all duration-300 hover:bg-white/5">
            Grow Your Revenues
          </button>
        </motion.div>
      </div>
    </section>
  );
};

// Footer Section Component
const FooterSection = () => {
  const footerLinks = {
    product: [
      { name: "For Advertisers", href: "#features" },
      { name: "For Media Owners", href: "#features" },
      { name: "Platform Features", href: "#features" },
      { name: "Analytics", href: "#analytics" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Contact", href: "#cta" },
    ],
    resources: [
      { name: "Help Center", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "DOOH Guide", href: "#" },
    ],
  };

  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith("#")) {
      const element = document.getElementById(sectionId.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-[#09080b] border-t border-white/10 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className="flex items-center gap-2 font-bold text-2xl">
                <Asterisk className="w-6 h-6 pt-0.5" strokeWidth={3.5} />
                adCentra.ai
              </span>
            </div>
            <p className="text-[#A3A3A3] text-lg leading-relaxed mb-6 max-w-md">
              India's first standardized DOOH marketplace. Connecting advertisers 
              and media owners through AI-powered programmatic advertising.
            </p>
            <div className="flex items-center gap-4">
              <button className="bg-white text-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition-all duration-200 transform hover:scale-105">
                Get Started
              </button>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-[#F5F5F5] font-semibold text-lg mb-6">Product</h3>
            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-[#F5F5F5] font-semibold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-[#F5F5F5] font-semibold text-lg mb-6">Resources</h3>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors duration-200 text-sm"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-8">
              <p className="text-[#A3A3A3] text-sm">
                © 2025 adCentra.ai. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="text-[#A3A3A3] text-sm">Made in India 🇮🇳</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default function LandingPage() {
  return (
    <div className="text-[#F5F5F5] font-sans">
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <ForAdvertisersSection />
      <ForMediaOwnersSection />
      <HowItWorksSection />
      <PlatformFeaturesSection />
      <AnalyticsSection />
      <WhyAdcentraSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}