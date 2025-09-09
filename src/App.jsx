import React from 'react'
import { motion } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import DebugInfo from './components/DebugInfo'
import Header from './components/Header'
import Hero from './components/Hero'
import ParticipationLevels from './components/ParticipationLevels'
import CarGallery from './components/CarGallery'
import PrizeDetails from './components/PrizeDetails'
import VideoSection from './components/VideoSection'
import Testimonials from './components/Testimonials'
import ExtraAction from './components/ExtraAction'
import PreviousActions from './components/PreviousActions'
import SocialMedia from './components/SocialMedia'
import Footer from './components/Footer'
import FloatingPromo from './components/FloatingPromo'
import PromoModal from './components/PromoModal'

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <Header />
        
        <main className="relative">
          <Hero />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-16 py-16"
          >
            <ParticipationLevels />
            <CarGallery />
            <PrizeDetails />
            <VideoSection />
            <Testimonials />
            <ExtraAction />
            <PreviousActions />
            <SocialMedia />
          </motion.div>
        </main>
        
        <Footer />
        {/* <FloatingPromo /> - Desativado por enquanto */}
        {/* <PromoModal /> - Desativado por enquanto */}
      </div>
    </ErrorBoundary>
  )
}

export default App
