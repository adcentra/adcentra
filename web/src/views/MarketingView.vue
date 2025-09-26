<script setup lang="ts">
import { motion } from 'motion-v'
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
} from 'lucide-vue-next'

import billboardImage from '@/assets/images/marketing/billboard-abstract.png'
import mapImage from '@/assets/images/marketing/map.png'
import inventoryImage from '@/assets/images/marketing/inventory.png'
import dashboardImage from '@/assets/images/marketing/dashboard.png'
import lightLogoImage from '@/assets/images/logo/light-logo.png'
import aravindImage from '@/assets/images/marketing/aravind.jpeg'
import zihaanImage from '@/assets/images/marketing/zihaan.jpeg'

const problems = [
  'Fragmented DOOH inventory makes it hard to plan at scale.',
  'Manual booking processes waste time.',
  'Advertisers lack real-time visibility into performance.',
  'Media owners struggle with yield optimization and compliance.',
]

const solutions = [
  {
    icon: Combine,
    text: 'One platform to connect advertisers and DOOH media owners.',
  },
  {
    icon: Zap,
    text: 'Programmatic trading engine for instant booking & fair auctions.',
  },
  {
    icon: BrainCircuit,
    text: 'AI-driven optimization for targeting and smarter placements.',
  },
  {
    icon: ShieldCheck,
    text: 'Real-time proof of play for transparency and trust.',
  },
]

const advertiserFeatures = [
  { icon: Map, text: 'Interactive map to explore available DOOH screens.' },
  {
    icon: LayoutGrid,
    text: 'Smart campaign planner with drag-and-drop scheduling.',
  },
  {
    icon: BrainCircuit,
    text: 'AI-enhanced targeting (Traffic, Weather, Audience Prediction).',
  },
  { icon: BadgePercent, text: 'Instant pricing & booking confirmation.' },
  {
    icon: BarChart,
    text: 'Real-time performance analytics & ROI dashboard.',
  },
]

const mediaOwnerFeatures = [
  {
    icon: UploadCloud,
    text: 'Easy screen onboarding with GPS, specs, and pricing.',
  },
  {
    icon: TrendingUp,
    text: 'Dynamic pricing engine powered by AI yield optimization.',
  },
  {
    icon: ClipboardCheck,
    text: 'Campaign approval workflows with compliance auto-check.',
  },
  {
    icon: Wallet,
    text: 'Earnings dashboard with real-time payout tracking.',
  },
  {
    icon: Users,
    text: 'Access to premium advertisers through a private marketplace.',
  },
]

const steps = [
  {
    number: '1',
    title: 'Onboard',
    description: 'Media owners onboard their DOOH screens.',
  },
  {
    number: '2',
    title: 'Discover',
    description: 'Advertisers discover & book through auctions or direct buys.',
  },
  {
    number: '3',
    title: 'Match',
    description: 'AI matches campaigns to best-fit slots (traffic, time, weather).',
  },
  {
    number: '4',
    title: 'Verify',
    description: 'Content is distributed & verified in real time.',
  },
  {
    number: '5',
    title: 'Analyze',
    description: 'Proof of play & performance analytics close the loop.',
  },
]

const platformFeatures = [
  {
    icon: Zap,
    title: 'Programmatic Trading Engine',
    description: 'OpenRTB-ready',
  },
  {
    icon: LayoutGrid,
    title: 'Multi-format CMS',
    description: 'Manage your creatives effortlessly',
  },
  {
    icon: ShieldCheck,
    title: 'Proof of Play',
    description: 'Hardware/software-based verification',
  },
  {
    icon: BrainCircuit,
    title: 'AI-Powered Optimization',
    description: 'Dynamic creative, predictive modeling, yield management',
  },
  {
    icon: ClipboardCheck,
    title: 'Compliance & License Automation',
    description: 'ASCI + State rules',
  },
  {
    icon: Wallet,
    title: 'Escrow-based Payments',
    description: 'Secure & transparent billing',
  },
]

const analyticsFeatures = [
  'Live campaign monitoring dashboard.',
  'Heatmaps of ad exposure by time & geography.',
  'Benchmark comparisons across campaigns.',
  'ROI tracking per screen, per campaign.',
]

const teamMembers = [
  {
    name: 'Zihaan Mohamed',
    role: 'Co-founder, CEO',
    description: 'Leading product strategy and market expansion at AdCentra',
    college: 'IIT Kharagpur',
    image: zihaanImage,
    linkedin: 'https://www.linkedin.com/in/zihaan-mohamed/',
  },
  {
    name: 'Aravind Unnikrishnan',
    role: 'Co-founder, CTO',
    description: 'Heading engineering and platform development at AdCentra',
    college: 'IIIT Pune',
    image: aravindImage,
    linkedin: 'https://www.linkedin.com/in/aravind-unnikrishnan/',
    website: 'https://aravindunnikrishnan.in/',
  },
]

const footerLinks = {
  product: [
    { name: 'For Advertisers', href: '#features' },
    { name: 'For Media Owners', href: '#features' },
    { name: 'Platform Features', href: '#features' },
    { name: 'Analytics', href: '#analytics' },
  ],
  company: [
    { name: 'About Us', href: '#about-team' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contact', href: '#cta' },
  ],
  resources: [
    { name: 'Help Center', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'DOOH Guide', href: '#' },
  ],
}

const scrollToSection = (sectionId: string) => {
  if (sectionId.startsWith('#')) {
    const element = document.getElementById(sectionId.slice(1))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<template>
  <div class="text-[#F5F5F5]">
    <!-- Hero Section -->
    <section
      id="hero"
      class="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      <!-- Background with overlay -->
      <div class="absolute inset-0 bg-[#09080b]">
        <div
          class="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-transparent"
        ></div>
        <!-- Animated background elements -->
        <div
          class="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-3xl animate-pulse"
        ></div>
        <div
          class="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"
        ></div>
      </div>

      <!-- Billboard Image - Left Bottom Corner -->
      <div class="absolute bottom-5 left-5 hidden lg:block lg:w-3/12 max-w-lg z-0">
        <img
          :src="billboardImage"
          alt="Digital billboard screens in city"
          class="object-contain opacity-70"
        />
      </div>

      <div class="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.h1
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8 }"
          class="text-5xl md:text-6xl lg:text-7xl font-bold text-[#F5F5F5] mb-6 leading-tight"
        >
          The Central Hub for
          <span class="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Digital Out-of-Home
          </span>
          Advertising
        </motion.h1>

        <motion.p
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, delay: 0.2 }"
          class="text-xl md:text-2xl text-[#A3A3A3] mb-12 max-w-3xl mx-auto leading-relaxed"
        >
          Discover, book, and optimize DOOH screens across India — in one powerful platform.
        </motion.p>

        <motion.div
          :initial="{ opacity: 0, y: 30 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.8, delay: 0.4 }"
          class="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <button
            class="group bg-white text-black px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-3 hover:bg-gray-100"
          >
            Start a Campaign
            <ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <router-link to="/login">
            <button
              class="group border border-white/20 hover:border-white/40 text-[#F5F5F5] px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-white/5"
            >
              Onboard Your Screens
            </button>
          </router-link>
        </motion.div>
      </div>
    </section>

    <!-- Problem Section -->
    <section class="py-24 px-12">
      <div class="max-w-5xl mx-auto">
        <motion.h2
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          :viewport="{ once: true }"
          class="text-5xl md:text-6xl font-bold text-[#F5F5F5] text-center mb-16"
        >
          The old way is <span class="text-red-400">broken</span>.
        </motion.h2>

        <div class="grid md:grid-cols-2 gap-8">
          <motion.div
            v-for="(problem, index) in problems"
            :key="index"
            :initial="{ opacity: 0 }"
            :whileInView="{ opacity: 1 }"
            :transition="{ duration: 0.6, delay: index * 0.1 }"
            :viewport="{ once: true }"
            class="p-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
          >
            <p class="text-lg text-[#A3A3A3] leading-relaxed">
              {{ problem }}
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    <!-- Solution Section -->
    <section id="solutions" class="py-24 px-12 relative">
      <!-- Background glow -->
      <div
        class="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-blue-500/5 rounded-3xl blur-3xl"
      ></div>

      <div class="max-w-5xl mx-auto relative z-10">
        <motion.h2
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          :viewport="{ once: true }"
          class="text-5xl md:text-6xl font-bold text-[#F5F5F5] text-center mb-16"
        >
          Welcome to the
          <span class="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Future of DOOH </span
          >.
        </motion.h2>

        <div class="grid md:grid-cols-2 gap-8">
          <motion.div
            v-for="(solution, index) in solutions"
            :key="index"
            :initial="{ opacity: 0 }"
            :whileInView="{ opacity: 1 }"
            :transition="{ duration: 0.6, delay: index * 0.1 }"
            :viewport="{ once: true }"
            class="group p-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300"
          >
            <component
              :is="solution.icon"
              class="w-8 h-8 text-purple-400 mb-4 group-hover:text-purple-300 transition-colors"
            />
            <p class="text-lg text-[#A3A3A3] leading-relaxed">
              {{ solution.text }}
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    <!-- For Advertisers Section -->
    <section id="features" class="py-24 px-12">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <!-- Left Column - Text -->
          <div>
            <motion.h2
              :initial="{ opacity: 0, x: -30 }"
              :whileInView="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.6 }"
              :viewport="{ once: true }"
              class="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-6"
            >
              For Advertisers
            </motion.h2>
            <motion.p
              :initial="{ opacity: 0, x: -30 }"
              :whileInView="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.6, delay: 0.1 }"
              :viewport="{ once: true }"
              class="text-xl text-[#A3A3A3] mb-12"
            >
              Your entire DOOH strategy, simplified.
            </motion.p>

            <div class="space-y-6">
              <motion.div
                v-for="(feature, index) in advertiserFeatures"
                :key="index"
                :initial="{ opacity: 0, x: -30 }"
                :whileInView="{ opacity: 1, x: 0 }"
                :transition="{ duration: 0.6, delay: index * 0.1 }"
                :viewport="{ once: true }"
                class="flex items-start gap-4"
              >
                <div
                  class="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-purple-500/30"
                >
                  <component :is="feature.icon" class="w-6 h-6 text-purple-400" />
                </div>
                <p class="text-[#A3A3A3] text-lg leading-relaxed">
                  {{ feature.text }}
                </p>
              </motion.div>
            </div>
          </div>

          <!-- Right Column - Visual -->
          <motion.div
            :initial="{ opacity: 0, x: 30 }"
            :whileInView="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6 }"
            :viewport="{ once: true }"
            class="relative"
          >
            <div
              class="aspect-video rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-white/10 flex items-center justify-center"
            >
              <div
                class="w-full h-full rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-600/5 border border-white/5 flex items-center justify-center"
              >
                <img
                  :src="mapImage"
                  alt="AdCentra Dashboard - Real-time analytics and performance metrics"
                  class="object-cover rounded-2xl w-full h-full"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    <!-- For Media Owners Section -->
    <section class="py-24 px-12 bg-white/[0.02]">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <!-- Left Column - Visual -->
          <motion.div
            :initial="{ opacity: 0, x: -30 }"
            :whileInView="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6 }"
            :viewport="{ once: true }"
            class="relative order-2 lg:order-1"
          >
            <div
              class="aspect-video rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-600/10 border border-white/10 flex items-center justify-center"
            >
              <div
                class="w-full h-full rounded-xl bg-gradient-to-br from-purple-500/5 to-blue-600/5 border border-white/5 flex items-center justify-center overflow-hidden"
              >
                <img
                  :src="inventoryImage"
                  alt="AdCentra Dashboard - Real-time analytics and performance metrics"
                  class="object-cover rounded-2xl w-full h-full"
                />
              </div>
            </div>
          </motion.div>

          <!-- Right Column - Text -->
          <div class="order-1 lg:order-2">
            <motion.h2
              :initial="{ opacity: 0, x: 30 }"
              :whileInView="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.6 }"
              :viewport="{ once: true }"
              class="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-6"
            >
              For Media Owners
            </motion.h2>
            <motion.p
              :initial="{ opacity: 0, x: 30 }"
              :whileInView="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.6, delay: 0.1 }"
              :viewport="{ once: true }"
              class="text-xl text-[#A3A3A3] mb-12"
            >
              Maximize your revenue and streamline operations.
            </motion.p>

            <div class="space-y-6">
              <motion.div
                v-for="(feature, index) in mediaOwnerFeatures"
                :key="index"
                :initial="{ opacity: 0, x: 30 }"
                :whileInView="{ opacity: 1, x: 0 }"
                :transition="{ duration: 0.6, delay: index * 0.1 }"
                :viewport="{ once: true }"
                class="flex items-start gap-4"
              >
                <div
                  class="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-600/20 border border-blue-500/30"
                >
                  <component :is="feature.icon" class="w-6 h-6 text-blue-400" />
                </div>
                <p class="text-[#A3A3A3] text-lg leading-relaxed">
                  {{ feature.text }}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="py-24 px-12">
      <div class="max-w-4xl mx-auto">
        <motion.h2
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          :viewport="{ once: true }"
          class="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-20"
        >
          How It Works
        </motion.h2>

        <div class="relative">
          <!-- Vertical line -->
          <div
            class="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500"
          ></div>

          <div class="space-y-16">
            <motion.div
              v-for="(step, index) in steps"
              :key="index"
              :initial="{ opacity: 0, x: -30 }"
              :whileInView="{ opacity: 1, x: 0 }"
              :transition="{ duration: 0.6, delay: index * 0.1 }"
              :viewport="{ once: true }"
              class="relative flex items-start gap-8"
            >
              <!-- Step number -->
              <div
                class="relative z-10 w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl"
              >
                {{ step.number }}
              </div>

              <!-- Content -->
              <div class="flex-1 pt-3">
                <h3 class="text-2xl font-bold text-[#F5F5F5] mb-2">
                  {{ step.title }}
                </h3>
                <p class="text-lg text-[#A3A3A3] leading-relaxed">
                  {{ step.description }}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>

    <!-- Platform Features Section -->
    <section class="py-24 px-12 bg-white/[0.02]">
      <div class="max-w-7xl mx-auto">
        <motion.h2
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          :viewport="{ once: true }"
          class="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-20"
        >
          An End-to-End Platform
        </motion.h2>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div
            v-for="(feature, index) in platformFeatures"
            :key="index"
            :initial="{ opacity: 0 }"
            :whileInView="{ opacity: 1 }"
            :transition="{ duration: 0.6, delay: index * 0.1 }"
            :viewport="{ once: true }"
            class="group p-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
          >
            <component
              :is="feature.icon"
              class="w-8 h-8 text-purple-400 mb-6 group-hover:text-purple-300 transition-colors"
            />
            <h3 class="text-xl font-bold text-[#F5F5F5] mb-3">
              {{ feature.title }}
            </h3>
            <p class="text-[#A3A3A3] leading-relaxed">
              {{ feature.description }}
            </p>
          </motion.div>
        </div>
      </div>
    </section>

    <!-- Analytics Section -->
    <section id="analytics" class="py-24 px-12">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <motion.h2
            :initial="{ opacity: 0, y: 30 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6 }"
            :viewport="{ once: true }"
            class="text-4xl md:text-5xl font-bold text-[#F5F5F5] mb-6"
          >
            Data-Driven Decisions
          </motion.h2>
          <motion.p
            :initial="{ opacity: 0, y: 30 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: 0.1 }"
            :viewport="{ once: true }"
            class="text-xl text-[#A3A3A3]"
          >
            Unprecedented transparency in DOOH.
          </motion.p>
        </div>

        <!-- Dashboard Screenshot -->
        <motion.div
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.2 }"
          :viewport="{ once: true }"
          class="relative mb-16"
        >
          <div
            class="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-blue-500/5 to-purple-600/5"
          >
            <div class="aspect-video w-full relative">
              <img
                :src="dashboardImage"
                alt="AdCentra Dashboard - Real-time analytics and performance metrics"
                class="object-cover rounded-2xl w-full h-full"
              />
            </div>

            <!-- Optional overlay for better presentation -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"
            ></div>
          </div>

          <!-- Caption -->
          <motion.p
            :initial="{ opacity: 0 }"
            :whileInView="{ opacity: 1 }"
            :transition="{ duration: 0.6, delay: 0.2 }"
            :viewport="{ once: true }"
            class="text-center text-[#A3A3A3] text-sm mt-4"
          >
            Real-time analytics dashboard with comprehensive DOOH campaign insights
          </motion.p>
        </motion.div>

        <!-- Features List -->
        <div class="grid md:grid-cols-2 gap-6">
          <motion.div
            v-for="(feature, index) in analyticsFeatures"
            :key="index"
            :initial="{ opacity: 0, y: 20 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: index * 0.1 }"
            :viewport="{ once: true }"
            class="flex items-center gap-3 text-[#A3A3A3] text-lg"
          >
            <div class="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-600"></div>
            {{ feature }}
          </motion.div>
        </div>
      </div>
    </section>

    <!-- About the Team Section -->
    <section id="about-team" class="py-24 px-12">
      <div class="max-w-4xl mx-auto">
        <motion.h2
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          :viewport="{ once: true }"
          class="text-4xl md:text-5xl font-bold text-[#F5F5F5] text-center mb-6"
        >
          Meet the
          <span class="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Team
          </span>
        </motion.h2>

        <motion.p
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.1 }"
          :viewport="{ once: true }"
          class="text-xl text-[#A3A3A3] text-center mb-16"
        >
          Building the future of DOOH advertising together
        </motion.p>

        <div class="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
          <motion.div
            v-for="(member, index) in teamMembers"
            :key="index"
            :initial="{ opacity: 0, y: 30 }"
            :whileInView="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.6, delay: index * 0.2 }"
            :viewport="{ once: true }"
            class="text-center group"
          >
            <!-- Profile Image -->
            <div class="relative mb-6 mx-auto w-32 h-32 md:w-40 md:h-40">
              <div
                class="w-full h-full rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 p-1 group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all duration-300"
              >
                <img
                  :src="member.image"
                  :alt="member.name"
                  class="w-full h-full rounded-full object-cover border-2 border-white/10 group-hover:border-white/20 transition-all duration-300 grayscale contrast-[110%]"
                />
              </div>
            </div>

            <!-- Member Info -->
            <div class="space-y-2 mb-6">
              <h3
                class="text-2xl font-bold text-[#F5F5F5] group-hover:text-white transition-colors duration-300"
              >
                {{ member.name }}
              </h3>
              <p
                class="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
              >
                {{ member.role }}
              </p>
              <p class="text-[#A3A3A3] text-base leading-relaxed">
                {{ member.description }}
              </p>
              <p class="text-sm text-[#A3A3A3]/70">
                {{ member.college }}
              </p>
            </div>

            <!-- Social Links -->
            <div class="flex justify-center items-center gap-4">
              <a
                :href="member.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="group/link flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-blue-400/50 hover:bg-blue-400/10 transition-all duration-300 text-[#A3A3A3] hover:text-blue-400"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
                <span class="text-sm font-medium">LinkedIn</span>
              </a>

              <a
                v-if="member.website"
                :href="member.website"
                target="_blank"
                rel="noopener noreferrer"
                class="group/link flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-purple-400/50 hover:bg-purple-400/10 transition-all duration-300 text-[#A3A3A3] hover:text-purple-400"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"
                  />
                </svg>
                <span class="text-sm font-medium">Website</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="cta" class="py-24 px-6">
      <div class="max-w-4xl mx-auto text-center">
        <motion.h2
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6 }"
          :viewport="{ once: true }"
          class="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F5F5F5] mb-12 leading-tight"
        >
          Ready to Transform
          <span class="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            DOOH Advertising </span
          >?
        </motion.h2>

        <motion.div
          :initial="{ opacity: 0, y: 30 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.6, delay: 0.2 }"
          :viewport="{ once: true }"
          class="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <button
            class="group bg-white text-black px-7 py-5 md:px-10 md:py-5 rounded-full font-semibold text-xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-100"
          >
            Launch Your Campaign
          </button>
          <button
            class="group border border-white/20 hover:border-white/40 text-[#F5F5F5] px-6 py-5 md:px-10 md:py-5 rounded-full font-semibold text-xl transition-all duration-300 hover:bg-white/5"
          >
            Grow Your Revenues
          </button>
        </motion.div>
      </div>
    </section>

    <!-- Footer Section -->
    <footer class="bg-[#09080b] border-t border-white/10 py-16 px-12">
      <div class="max-w-7xl mx-auto">
        <!-- Main Footer Content -->
        <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <!-- Brand Section -->
          <div class="lg:col-span-2">
            <div class="flex items-center gap-2 mb-6">
              <span class="flex items-center gap-2 font-bold text-2xl">
                <img :src="lightLogoImage" alt="AdCentra" class="w-12 h-12" />
                AdCentra
              </span>
            </div>
            <p class="text-[#A3A3A3] text-lg leading-relaxed mb-6 max-w-md">
              India's first standardized DOOH marketplace. Connecting advertisers and media owners
              through AI-powered programmatic advertising.
            </p>

            <!-- Contact Information -->
            <div class="space-y-3 mb-6">
              <div class="flex items-center gap-3 text-[#A3A3A3]">
                <svg
                  class="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:connect@adcentra.ai"
                  class="hover:text-[#F5F5F5] transition-colors duration-200"
                >
                  connect@adcentra.ai
                </a>
              </div>
              <div class="flex items-center gap-3 text-[#A3A3A3]">
                <svg
                  class="w-5 h-5 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+918921167610"
                  class="hover:text-[#F5F5F5] transition-colors duration-200"
                >
                  +91 89211 67610
                </a>
              </div>
            </div>

            <div class="flex items-center gap-4">
              <button
                class="bg-white text-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>

          <!-- Product Links -->
          <div>
            <h3 class="text-[#F5F5F5] font-semibold text-lg mb-6">Product</h3>
            <ul class="space-y-4">
              <li v-for="link in footerLinks.product" :key="link.name">
                <button
                  @click="scrollToSection(link.href)"
                  class="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors duration-200 text-sm"
                >
                  {{ link.name }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Company Links -->
          <div>
            <h3 class="text-[#F5F5F5] font-semibold text-lg mb-6">Company</h3>
            <ul class="space-y-4">
              <li v-for="link in footerLinks.company" :key="link.name">
                <button
                  @click="scrollToSection(link.href)"
                  class="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors duration-200 text-sm"
                >
                  {{ link.name }}
                </button>
              </li>
            </ul>
          </div>

          <!-- Resources Links -->
          <div>
            <h3 class="text-[#F5F5F5] font-semibold text-lg mb-6">Resources</h3>
            <ul class="space-y-4">
              <li v-for="link in footerLinks.resources" :key="link.name">
                <button
                  @click="scrollToSection(link.href)"
                  class="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors duration-200 text-sm"
                >
                  {{ link.name }}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="border-t border-white/10 pt-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-6">
            <div class="flex items-center gap-8">
              <p class="text-[#A3A3A3] text-sm">© 2025 Adcentra. All rights reserved.</p>
            </div>

            <div class="flex items-center gap-6">
              <span class="text-[#A3A3A3] text-sm">Made in India 🇮🇳</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
