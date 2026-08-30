import { MetadataRoute } from 'next'
import { projectsData } from '@/config/portfolio'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ayush.design'

  const staticRoutes = ['', '/projects', '/blog', '/resume'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const projectRoutes = projectsData.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes]
}
