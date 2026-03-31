export type TemplateId = 'basic' | 'gradient' | 'minimal' | 'branded'

export interface OGConfig {
  template: TemplateId
  title: string
  description?: string
  siteName?: string
  primaryColor?: string
  backgroundColor?: string
}

export interface Template {
  id: TemplateId
  name: string
  description: string
  preview: string
}

export const TEMPLATES: Template[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Clean dark gradient with large title',
    preview: '/templates/basic.png',
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Vibrant color gradient background',
    preview: '/templates/gradient.png',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean white background, minimal styling',
    preview: '/templates/minimal.png',
  },
  {
    id: 'branded',
    name: 'Branded',
    description: 'Custom brand color with logo placement',
    preview: '/templates/branded.png',
  },
]
