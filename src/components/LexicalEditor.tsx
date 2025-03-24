import { useEffect, useState } from "react"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table"
import { ListItemNode, ListNode } from "@lexical/list"
import { CodeHighlightNode, CodeNode } from "@lexical/code"
import { AutoLinkNode, LinkNode } from "@lexical/link"
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from '@lexical/markdown';

import { $getRoot, $insertNodes, type EditorState } from "lexical"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { ToolbarPlugin } from "./editor/ToolbarPlugin"

import "./editor/editor.css"

const theme = {
  // Theme styling goes here
  paragraph: "editor-paragraph",
  heading: {
    h1: "editor-heading-h1",
    h2: "editor-heading-h2",
    h3: "editor-heading-h3",
    h4: "editor-heading-h4",
    h5: "editor-heading-h5",
  },
  list: {
    ul: "editor-list-ul",
    ol: "editor-list-ol",
  },
  text: {
    bold: "editor-text-bold",
    italic: "editor-text-italic",
    underline: "editor-text-underline",
  },
}

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error)
}

type EditorProps = {
  initialContent?: string
  onChange?: (html: string) => void
  placeholder?: string
  editorClassName?: string
}

function SavePlugin({ onChange }: { onChange?: (html: string) => void }) {
  const [editor] = useLexicalComposerContext()
  
  const handleEditorChange = (editorState: EditorState) => {
    editorState.read(() => {
      if (onChange) {
        const markdownString = $convertToMarkdownString(TRANSFORMERS)
        onChange(markdownString)
      }
    })
  }
  return <OnChangePlugin onChange={handleEditorChange} />
}

export function LexicalEditor({
  initialContent,
  onChange,
  placeholder = "Enter some text...",
  editorClassName,
}: EditorProps) {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    editorState: () => $convertFromMarkdownString(initialContent || "", TRANSFORMERS),
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode,
    ],
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="editor-container">
        <ToolbarPlugin />
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className={`editor-input ${editorClassName || ""}`} />}
            placeholder={<div className="editor-placeholder">{placeholder}</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <SavePlugin onChange={onChange} />
        </div>
      </div>
    </LexicalComposer>
  )
}

