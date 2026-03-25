import type { Code } from 'mdast'

export function transformCodeBlock(node: Code): string {
  if (node.lang) {
    return `{code:language=${node.lang}}\n${node.value}\n{code}`
  }
  return `{code}\n${node.value}\n{code}`
}
