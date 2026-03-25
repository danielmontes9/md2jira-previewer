import type { Heading } from 'mdast'
import { convertInlineChildren } from './formatting.js'

export function transformHeading(node: Heading): string {
  const level = Math.min(node.depth, 6)
  const text = convertInlineChildren(node.children)
  return `h${level}. ${text}`
}
