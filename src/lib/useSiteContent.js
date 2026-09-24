import { useEffect, useState } from 'react'
import { getContent } from './api.js'
import { defaultContent } from './defaultContent.js'

export function useSiteContent() {
  const [content, setContent] = useState(defaultContent)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getContent()
      .then((data) => setContent({ ...defaultContent, ...data }))
      .catch(() => setContent(defaultContent))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (content.brand?.name) {
      document.title = `${content.brand.name} - ${content.brand.tagline || 'Consultoria de Viagens'}`
    }
    if (content.brand?.logoUrl) {
      let link = document.querySelector("link[rel~='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = content.brand.logoUrl
    }
  }, [content.brand?.name, content.brand?.tagline, content.brand?.logoUrl])

  return { content, loading }
}
