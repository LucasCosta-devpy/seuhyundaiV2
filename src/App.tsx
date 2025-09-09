import React from 'react'
import Header from './components/sections/Header'
import Hero from './components/sections/Hero'
import ParticipationLevels from './components/sections/ParticipationLevels'
import ImageCarousel from './components/sections/ImageCarousel'
import PrizeDetails from './components/sections/PrizeDetails'
import VideoSection from './components/sections/VideoSection'
import Testimonials from './components/sections/Testimonials'
import Footer from './components/sections/Footer'

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Simple Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900" />

      <Header />
      
      <main>
        <Hero />
        
        <div className="container mx-auto px-4 lg:px-8 space-y-16 py-16">
          <ParticipationLevels />
          <ImageCarousel />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3">
              <PrizeDetails />
            </div>
            <div className="lg:col-span-2">
              <ParticipationLevels variant="compact" />
            </div>
          </div>
          
          <VideoSection />
          <Testimonials />
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
