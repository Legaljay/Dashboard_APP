// components/MentionEditor.tsx
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { cn } from "@/lib/utils";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { useCallback } from "react";
import { MentionEditorProps, Suggestion } from "./mention.type";
import { useMentionState } from "./hooks/useMentionState";
import { SuggestionList } from "./SuggestionList";

export const MainMentionEditor: React.FC<MentionEditorProps> = ({
  value,
  onChange,
  onMention,
  getSuggestions,
  mentionTrigger = "@",
  placeholder = "What's on your mind?",
  className = "",
  debounceMs = 300,
  disabled = false,
  ariaLabel,
}) => {
  const { suggestionGroups, mentionState, setMentionState, fetchSuggestions } =
    useMentionState(getSuggestions, debounceMs);

  const handleMentionTrigger = useCallback(
    (editor: Editor) => {
      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;

      const currentLineText = $from.nodeBefore?.text || "";
      const lastMentionTriggerPos = currentLineText.lastIndexOf(mentionTrigger);

      if (
        lastMentionTriggerPos !== -1 &&
        (lastMentionTriggerPos === 0 ||
          currentLineText[lastMentionTriggerPos - 1] === " " ||
          currentLineText[lastMentionTriggerPos - 1] === "\n")
      ) {
        const query = currentLineText.slice(lastMentionTriggerPos + 1);
        if (!query.includes(" ")) {
          const coords = editor.view.coordsAtPos($from.pos);
          setMentionState({
            isOpen: true,
            query,
            index: 0,
            position: {
              top: coords.top + 24,
              left: coords.left,
            },
          });

          fetchSuggestions(query);
          return;
        }
      }

      setMentionState((prev) => ({ ...prev, isOpen: false }));
    },
    [mentionTrigger, fetchSuggestions]
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        document: false,
        paragraph: false,
        text: false,
      }),
      Document,
      Paragraph,
      Text,
      TextStyle,
      Color,
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      handleMentionTrigger(editor);
    },
    editorProps: {
      attributes: {
        class: cn(
          "social-editor-content",
          disabled && "opacity-50 cursor-not-allowed"
        ),
        placeholder,
        "aria-label": ariaLabel || "Mention editor",
        role: "textbox",
        "aria-multiline": "true",
      },
    },
  });

  const insertMention = useCallback(
    (suggestion: Suggestion) => {
      if (!editor) return;

      const { state } = editor;
      const { selection } = state;
      const { $from } = selection;

      const currentLineText = $from.nodeBefore?.text || "";
      const lastMentionTriggerPos = currentLineText.lastIndexOf(mentionTrigger);

      if (lastMentionTriggerPos === -1) return;

      const mentionStart =
        $from.pos -
        ($from.nodeBefore?.text?.length || 0) +
        lastMentionTriggerPos;
      const mentionEnd = $from.pos;

      editor
        .chain()
        .focus()
        .deleteRange({ from: mentionStart, to: mentionEnd })
        .setColor("rgb(29, 155, 240)")
        .insertContent(`${mentionTrigger}${suggestion.name} `)
        .unsetColor()
        .run();

      onMention?.(suggestion);
      setMentionState((prev) => ({ ...prev, isOpen: false }));
    },
    [editor, mentionTrigger, onMention]
  );

  useKeyboardNavigation(
    mentionState.isOpen,
    suggestionGroups,
    mentionState.index,
    insertMention,
    () => setMentionState((prev) => ({ ...prev, isOpen: false })),
    (index) => setMentionState((prev) => ({ ...prev, index }))
  );

  return (
    <div className={cn("rounded-lg border bg-white shadow-sm", className)}>
      <EditorContent editor={editor} />

      <style>{`
        .social-editor-content {
          min-height: 100px;
          outline: none;
          padding: 1rem;
        }
        .social-editor-content p {
          margin: 0;
          line-height: 1.5;
        }
        .social-editor-content::placeholder {
          color: #9ca3af;
        }
        .mention {
          color: rgb(29, 155, 240);
          text-decoration: none;
          pointer-events: none;
          white-space: nowrap;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #9ca3af;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>

      {mentionState.isOpen && suggestionGroups.length > 0 && (
        <SuggestionList
          groups={suggestionGroups}
          selectedIndex={mentionState.index}
          onSelect={insertMention}
          position={mentionState.position}
        />
      )}
    </div>
  );
};
