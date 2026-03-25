import { describe, it, expect } from 'vitest'
import { convertToAdf } from '../src/index.js'

describe('convertToAdf', () => {
  it('returns empty doc for empty input', () => {
    expect(convertToAdf('')).toEqual({
      version: 1,
      type: 'doc',
      content: [],
    })
  })

  it('converts heading', () => {
    const result = convertToAdf('# Title')
    expect(result.content).toEqual([
      {
        type: 'heading',
        attrs: { level: 1 },
        content: [{ type: 'text', text: 'Title' }],
      },
    ])
  })

  it('converts paragraph with bold', () => {
    const result = convertToAdf('Some **bold** text')
    expect(result.content).toEqual([
      {
        type: 'paragraph',
        content: [
          { type: 'text', text: 'Some ' },
          { type: 'text', text: 'bold', marks: [{ type: 'strong' }] },
          { type: 'text', text: ' text' },
        ],
      },
    ])
  })

  it('converts italic', () => {
    const result = convertToAdf('_italic_')
    expect(result.content[0]).toMatchObject({
      type: 'paragraph',
      content: [{ type: 'text', text: 'italic', marks: [{ type: 'em' }] }],
    })
  })

  it('converts strikethrough', () => {
    const result = convertToAdf('~~strike~~')
    expect(result.content[0]).toMatchObject({
      type: 'paragraph',
      content: [{ type: 'text', text: 'strike', marks: [{ type: 'strike' }] }],
    })
  })

  it('converts inline code', () => {
    const result = convertToAdf('`code`')
    expect(result.content[0]).toMatchObject({
      type: 'paragraph',
      content: [{ type: 'text', text: 'code', marks: [{ type: 'code' }] }],
    })
  })

  it('converts link', () => {
    const result = convertToAdf('[Google](https://google.com)')
    expect(result.content[0]).toMatchObject({
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Google',
          marks: [{ type: 'link', attrs: { href: 'https://google.com' } }],
        },
      ],
    })
  })

  it('converts unordered list', () => {
    const result = convertToAdf('- Item 1\n- Item 2')
    expect(result.content[0]).toMatchObject({
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Item 1' }] }],
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Item 2' }] }],
        },
      ],
    })
  })

  it('converts ordered list', () => {
    const result = convertToAdf('1. First\n2. Second')
    expect(result.content[0]).toMatchObject({
      type: 'orderedList',
      content: [
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'First' }] }],
        },
        {
          type: 'listItem',
          content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Second' }] }],
        },
      ],
    })
  })

  it('converts nested list', () => {
    const result = convertToAdf('- Item\n  - Nested')
    const outerItem = (result.content[0] as { content: { content: unknown[] }[] }).content[0]
    expect(outerItem.content).toHaveLength(2)
    expect(outerItem.content[1]).toMatchObject({ type: 'bulletList' })
  })

  it('converts code block with language', () => {
    const result = convertToAdf('```js\nconsole.log("hi")\n```')
    expect(result.content[0]).toMatchObject({
      type: 'codeBlock',
      attrs: { language: 'js' },
      content: [{ type: 'text', text: 'console.log("hi")' }],
    })
  })

  it('converts code block without language', () => {
    const result = convertToAdf('```\nsome code\n```')
    expect(result.content[0]).toMatchObject({
      type: 'codeBlock',
      content: [{ type: 'text', text: 'some code' }],
    })
  })

  it('converts blockquote', () => {
    const result = convertToAdf('> A quote')
    expect(result.content[0]).toMatchObject({
      type: 'blockquote',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'A quote' }] }],
    })
  })

  it('converts horizontal rule', () => {
    const result = convertToAdf('---')
    expect(result.content[0]).toEqual({ type: 'rule' })
  })

  it('converts table', () => {
    const result = convertToAdf('| Name | Age |\n|------|-----|\n| John | 30 |')
    expect(result.content[0]).toMatchObject({
      type: 'table',
      attrs: { isNumberColumnEnabled: false, layout: 'default' },
      content: [
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableHeader',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Name' }] }],
            },
            {
              type: 'tableHeader',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Age' }] }],
            },
          ],
        },
        {
          type: 'tableRow',
          content: [
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: 'John' }] }],
            },
            {
              type: 'tableCell',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: '30' }] }],
            },
          ],
        },
      ],
    })
  })

  it('converts table with formatting in cells', () => {
    const result = convertToAdf('| Status |\n|--------|\n| **High** |')
    const cell = (result.content[0] as { content: { content: { content: { content: unknown[] }[] }[] }[] })
      .content[1].content[0].content[0].content[0]
    expect(cell).toMatchObject({
      type: 'text',
      text: 'High',
      marks: [{ type: 'strong' }],
    })
  })

  it('ignores images silently', () => {
    const result = convertToAdf('![alt](image.png)')
    expect(result.content[0]).toMatchObject({
      type: 'paragraph',
      content: [],
    })
  })
})
