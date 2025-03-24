"use client"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { useCallback, useEffect, useState } from "react"
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical"
import { ListNode } from "@lexical/list"
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils"
import { $isHeadingNode } from "@lexical/rich-text"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext()
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)
  const [isBulletList, setIsBulletList] = useState(false)
  const [isNumberList, setIsNumberList] = useState(false)

  const updateToolbar = useCallback(() => {
    const selection = $getSelection()
    if ($isRangeSelection(selection)) {
      // Text formatting
      setIsBold(selection.hasFormat("bold"))
      setIsItalic(selection.hasFormat("italic"))
      setIsUnderline(selection.hasFormat("underline"))

      // Node type
      const anchorNode = selection.anchor.getNode()
      const element = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow()

      const elementKey = element.getKey()
      const elementDOM = editor.getElementByKey(elementKey)

      // Lists
      const parentList = $getNearestNodeOfType(anchorNode, ListNode)
      setIsBulletList(parentList !== null && parentList.getListType() === "bullet")
      setIsNumberList(parentList !== null && parentList.getListType() === "number")
    }
  }, [editor])

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar()
        })
      }),
    )
  }, [editor, updateToolbar])

  return (
    <div className="toolbar">
      <div className="flex items-center gap-1 p-1 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Toggle
          pressed={isBold}
          onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
          title="Bold"
          size="sm"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={isItalic}
          onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
          title="Italic"
          size="sm"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          pressed={isUnderline}
          onPressedChange={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
          title="Underline"
          size="sm"
        >
          <Underline className="h-4 w-4" />
        </Toggle>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

