import React from 'react'
import { motion } from 'framer-motion'
import Card from '@components/ui/Card'
import { useAnalytics } from '@hooks/useAnalytics'
import { interfaceImages } from '@assets/index'

const socialLinks = [
  {
    platform: 'instagram',
    url: 'https://www.instagram.com/rumomaisumarota',
    handle: '@rumomaisumarota',
    description: 'Nos siga no Instagram',
    icon: interfaceImages.instagramIcon,
    color: 'from-pink-500 to-purple-500'
  },
  {
    platform: 'tiktok',
    url: 'https://www.tiktok.com/@rumomaisumarota',
    handle: '@rumomaisumarota',
    description: 'Nos siga no TikTok',
    icon: interfaceImages.tiktokIcon,
    color: 'from-black to-red-500'
  },
  {
    platform: 'whatsapp',
    url: 'https://chat.whatsapp.com/LU3tAk9CtdILP2XZwyyxsA',
    handle: 'Comunidade',
    description: 'Entre no grupo do WhatsApp',
    icon: interfaceImages.whatsappIcon,
    color: 'from-green-500 to-green-600'
  }
]

const SocialMedia: React.FC = () => {
  const { trackSocialClick } = useAnalytics()

  const handleSocialClick = (platform: string, url: string) => {
    trackSocialClick(platform, url)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card variant="glass" className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          📱 Nos siga nas redes sociais
        </h2>
        <p className="text-white/70 mt-2">Para nos conhecer melhor e tirar suas dúvidas!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {socialLinks.map((social, index) => (
          <motion.div
            key={social.platform}
            className={`bg-gradient-to-br ${social.color} p-6 rounded-xl cursor-pointer text-white relative overflow-hidden`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              y: -5,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
            onClick={() => handleSocialClick(social.platform, social.url)}
          >
            {/* Background overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
            
            <div className="relative z-10 flex flex-col items-center text-center space-y-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src={social.icon} 
                  alt={social.platform}
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const nextEl = e.currentTarget.nextElementSibling as HTMLElement
                    if (nextEl) nextEl.style.display = 'block'
                  }}
                />
                <span className="text-3xl hidden">
                  {social.platform === 'instagram' && '📷'}
                  {social.platform === 'tiktok' && '🎵'}
                  {social.platform === 'whatsapp' && '💬'}
                </span>
              </div>
              
              <div>
                <h3 className="font-bold text-lg capitalize">{social.platform}</h3>
                <p className="text-sm opacity-90">{social.handle}</p>
                <span className="inline-block mt-2 bg-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                  {social.platform === 'whatsapp' ? 'Entrar' : 'Seguir'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  )
}

export default SocialMedia
