// ============================================================================
// TYPES & INTERFACES - Sistema de tipos profissional
// ============================================================================

export interface PrizeItem {
  id: string
  icon: string
  title: string
  description: string
  value?: string
}

export interface ComboOption {
  id: string
  tickets: number
  originalPrice: number
  salePrice: number
  discount?: number
  popular?: boolean
  icon?: string
}

export interface CarouselImage {
  id: string
  src: string
  alt: string
  title?: string
}

export interface TestimonialVideo {
  id: string
  src: string
  poster?: string
  title: string
  winner: string
}

export interface ExtraActionData {
  id: string
  title: string
  description: string
  price: number
  prize: string
  date: string
  availableNumbers: number
  status: 'active' | 'completed' | 'upcoming'
  url: string
}

export interface PreviousAction {
  id: string
  title: string
  price: number
  winner: string
  topBuyer?: string
  deliveryDate: string
  status: 'completed'
}

export interface SocialLink {
  id: string
  platform: 'instagram' | 'tiktok' | 'whatsapp'
  url: string
  handle: string
  description: string
  icon: string
  color: string
}

export interface AnalyticsEvent {
  eventName: string
  parameters?: Record<string, any>
}

export interface PromoConfig {
  active: boolean
  title: string
  deadline: string
  offer: string
  description: string
  buttonText: string
}

// Utility types
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'premium' | 'outline'
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
export type AnimationVariant = 'fade' | 'slide' | 'scale' | 'bounce'

// Component props types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface AnimatedComponentProps extends BaseComponentProps {
  animation?: AnimationVariant
  delay?: number
  duration?: number
}

// API response types (if needed for future integrations)
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

// Theme types
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    success: string
    warning: string
    error: string
  }
  fonts: {
    heading: string
    body: string
  }
  breakpoints: {
    sm: string
    md: string
    lg: string
    xl: string
  }
}
