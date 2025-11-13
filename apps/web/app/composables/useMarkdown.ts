import { marked } from 'marked'
import DOMPurify from 'isomorphic-dompurify'

/**
 * Composable pour rendre le Markdown avec configuration SEO-friendly
 * Décale tous les headings de +1 niveau pour éviter plusieurs <h1> dans la page
 * - # devient <h2>
 * - ## devient <h3>
 * - ### devient <h4>
 * etc.
 *
 * ⚠️ Sécurité : Sanitize le HTML avec DOMPurify pour éviter les attaques XSS
 */
export function useMarkdown() {
  // Configure marked renderer to shift heading levels
  const renderer = new marked.Renderer()
  const originalHeading = renderer.heading.bind(renderer)

  renderer.heading = ({ tokens, depth }) => {
    // Shift all headings by +1 level (# becomes h2, ## becomes h3, etc.)
    const newDepth = Math.min(depth + 1, 6) as 1 | 2 | 3 | 4 | 5 | 6
    return originalHeading({ tokens, depth: newDepth })
  }

  // Set marked options
  marked.setOptions({
    renderer,
    breaks: true, // Convert \n to <br>
    gfm: true,    // GitHub Flavored Markdown
  })

  /**
   * Parse markdown content to HTML with heading level shift
   * ⚠️ Sanitize le HTML généré pour prévenir les attaques XSS
   */
  const parseMarkdown = (content: string): string => {
    if (!content) return ''

    // 1. Parse markdown to HTML
    const rawHtml = marked.parse(content) as string

    // 2. Sanitize HTML with DOMPurify (protection XSS)
    const cleanHtml = DOMPurify.sanitize(rawHtml, {
      ALLOWED_TAGS: [
        'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'br', 'strong', 'em', 'u', 's', 'code', 'pre',
        'a', 'ul', 'ol', 'li', 'blockquote', 'hr',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'img', 'figure', 'figcaption'
      ],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'],
      ALLOW_DATA_ATTR: false
    })

    return cleanHtml
  }

  return {
    parseMarkdown
  }
}
