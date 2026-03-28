import { useRef, useCallback } from 'react'

interface MarkdownInputProps {
  value: string
  onChange: (value: string) => void
}

export function MarkdownInput({ value, onChange }: MarkdownInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)

  const syncScroll = useCallback(() => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }, [])

  const handleImport = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,text/markdown,text/plain'
    input.onchange = () => {
      const file = input.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        if (typeof text === 'string') onChange(text)
      }
      reader.readAsText(file)
    }
    input.click()
  }, [onChange])

  const handleExport = useCallback(() => {
    const blob = new Blob([value], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.md'
    a.click()
    URL.revokeObjectURL(url)
  }, [value])

  const lineCount = value.split('\n').length

  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2 dark:border-neutral-800">
        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Markdown</span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleImport}
            className="rounded-md px-2 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            aria-label="Import Markdown file"
          >
            Import
          </button>
          <button
            onClick={handleExport}
            className="rounded-md px-2 py-1 text-xs text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            aria-label="Export Markdown file"
          >
            Export
          </button>
        </div>
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Line numbers gutter */}
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="select-none overflow-hidden border-r border-neutral-200 bg-neutral-50 px-3 py-4 text-right font-mono text-sm leading-6 text-neutral-400 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-600"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i + 1}>{i + 1}</div>
          ))}
        </div>
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="flex-1 resize-none bg-transparent p-4 font-mono text-sm leading-6 text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-600"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          placeholder="Paste your Markdown here..."
          spellCheck={false}
        />
      </div>
    </div>
  )
}
