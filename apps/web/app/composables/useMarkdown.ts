import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'

/**
 * Composable pour rendre le Markdown avec configuration SEO-friendly
 * Décale tous les headings de +1 niveau pour éviter plusieurs <h1> dans la page
 * - # devient <h2>
 * - ## devient <h3>
 * - ### devient <h4>
 * etc.
 *
 * ⚠️ Sécurité : Sanitize le HTML avec sanitize-html pour éviter les attaques XSS
 * Même si le contenu vient d'admins, c'est une bonne pratique de défense en profondeur
 */
export function useMarkdown() {
  // Configure marked renderer to shift heading levels
  const renderer = new marked.Renderer()
  const originalHeading = renderer.heading.bind(renderer)

  renderer.heading = (heading) => {
    // Shift all headings by +1 level (# becomes h2, ## becomes h3, etc.)
    const newDepth = Math.min(heading.depth + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6
    return originalHeading({ ...heading, depth: newDepth })
  }

  // Set marked options
  marked.setOptions({
    renderer,
    breaks: true, // Convert \n to <br>
    gfm: true,    // GitHub Flavored Markdown
  })

  /**
   * Parse markdown content to HTML with heading level shift and XSS protection
   */
  const parseMarkdown = (content: string): string => {
    if (!content) return ''

    // 1. Parse markdown to HTML
    const rawHtml = marked.parse(content) as string

    // 2. Sanitize HTML to prevent XSS attacks
    const cleanHtml = sanitizeHtml(rawHtml, {
      allowedTags: [
        'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
        'a', 'ul', 'ol', 'li', 'blockquote', 'hr',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'img', 'figure', 'figcaption', 'div', 'span'
      ],
      // Prevent XSS via base tag and other dangerous tags (CVE-2025-54075)
      disallowedTagsMode: 'discard',
      allowedAttributes: {
        'a': ['href', 'title', 'target', 'rel'],
        'img': ['src', 'alt', 'title', 'width', 'height'],
        '*': ['class', 'id']
      },
      allowedSchemes: ['http', 'https', 'mailto'],
      allowedSchemesByTag: {
        img: ['http', 'https', 'data']
      },
      // Additional security: enforce rel=noopener for external links
      transformTags: {
        'a': (tagName: string, attribs: Record<string, string>) => {
          const target = attribs.href?.startsWith('http') ? '_blank' : undefined
          return {
            tagName: 'a',
            attribs: {
              ...attribs,
              rel: 'noopener noreferrer',
              ...(target && { target })
            }
          }
        }
      }
    })

    return cleanHtml
  }

  return {
    parseMarkdown
  }
}
