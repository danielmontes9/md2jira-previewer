import type { List, ListItem, Paragraph } from 'mdast'
import { convertInlineChildren } from './formatting.js'

export function transformList(node: List, depth: number = 1): string {
  const marker = node.ordered ? '#' : '*'
  const prefix = marker.repeat(depth)

  const lines: string[] = []

  for (const item of node.children as ListItem[]) {
    for (const child of item.children) {
      if (child.type === 'paragraph') {
        const text = convertInlineChildren((child as Paragraph).children)
        lines.push(`${prefix} ${text}`)
      } else if (child.type === 'list') {
        lines.push(transformList(child as List, depth + 1))
      }
    }
  }

  return lines.join('\n')
}
