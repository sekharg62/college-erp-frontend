export const SITE_CONFIG = {
  brandName: 'MAAR',
  brandFullName: 'MAAR — Mandatory Additional Requirements',
  tagline: 'Student activity points & institute management portal',

  contact: {
    phone: '+91 9876543210',
    email: 'support@maar.example.com',
    address: 'MAAR Academy, Kolkata, West Bengal, India',
  },

  support: {
    email: 'help@maar.example.com',
    phone: '+91 98765 43210',
    hours: 'Mon–Sat, 10:00 AM – 6:00 PM',
  },

  links: {
    website: 'https://maar.example.com',
    privacyPolicy: '/privacy',
    termsOfService: '/terms',
  },

  social: {
    facebook: '',
    instagram: '',
    linkedin: '',
  },

  legal: {
    copyrightHolder: 'MAAR Academy',
    copyrightYear: new Date().getFullYear(),
  },
} as const

export type SiteConfig = typeof SITE_CONFIG
