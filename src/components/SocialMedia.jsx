import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Instagram, MessageCircle, Music } from 'lucide-react'

const SocialMedia = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const socialPlatforms = [
    {
      name: "Instagram",
      handle: "@rumomaisumarota",
      url: "https://www.instagram.com/rumomaisumarota",
      icon: Instagram,
      color: "from-pink-500 to-purple-600",
      bgColor: "from-pink-50 to-purple-50",
      borderColor: "border-pink-200",
      description: "Siga para novidades e ações",
      cta: "Seguir"
    },
    {
      name: "TikTok",
      handle: "@rumomaisumarota",
      url: "https://www.tiktok.com/@rumomaisumarota",
      icon: Music,
      color: "from-black to-gray-800",
      bgColor: "from-gray-50 to-gray-100",
      borderColor: "border-gray-200",
      description: "Vídeos divertidos e dicas",
      cta: "Seguir"
    },
    {
      name: "WhatsApp",
      handle: "Comunidade",
      url: "https://chat.whatsapp.com/LU3tAk9CtdILP2XZwyyxsA",
      icon: MessageCircle,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      description: "Grupo exclusivo de participantes",
      cta: "Entrar"
    }
  ]

  const handleSocialClick = (platform) => {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'generate_lead', { 
        content_name: `social_${platform.name.toLowerCase()}`,
        method: 'social_media'
      })
    }
    if (typeof fbq !== 'undefined') {
      fbq('track', 'Lead', { content_name: `social_${platform.name.toLowerCase()}` })
    }
    
    window.open(platform.url, '_blank', 'noopener')
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <section id="redes" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 gradient-text"
          >
            📱 Nos Siga nas Redes Sociais
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Para nos conhecer melhor e tirar suas dúvidas!
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {socialPlatforms.map((platform) => {
            const IconComponent = platform.icon
            return (
              <motion.div
                key={platform.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -10 }}
                onClick={() => handleSocialClick(platform)}
                className={`card p-6 cursor-pointer bg-gradient-to-br ${platform.bgColor} border-2 ${platform.borderColor} hover:shadow-2xl transition-all duration-300`}
              >
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${platform.color} rounded-2xl flex items-center justify-center`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>

                {/* Platform Info */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {platform.name}
                  </h3>
                  <p className="text-gray-600 mb-2">{platform.handle}</p>
                  <p className="text-sm text-gray-500">{platform.description}</p>
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full bg-gradient-to-r ${platform.color} text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  {platform.cta}
                </motion.button>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              💬 Suporte e Comunidade
            </h3>
            <p className="text-gray-600 mb-6">
              Nossa equipe está sempre disponível para tirar suas dúvidas e ajudar com qualquer questão relacionada às ações.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Resposta Rápida</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span>Comunidade Ativa</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default SocialMedia
