// "use client";
// import React, { useState } from "react";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import { TOGGLE_LINK_COMMAND } from "@lexical/link";

// export function Toolbar() {
//   const [editor] = useLexicalComposerContext();
//   const [showLinkPrompt, setShowLinkPrompt] = useState(false);
//   const [linkURL, setLinkURL] = useState("");
//   const [linkAttributes, setLinkAttributes] = useState({ target: "_blank" });

//   const openLinkPrompt = () => {
//     setShowLinkPrompt(true);
//   };

//   const closeLinkPrompt = () => {
//     setShowLinkPrompt(false);
//   };

//   const insertLink = () => {
//     editor.update(() => {
//       if (linkURL) {
//         editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
//           url: linkURL,
//           ...linkAttributes,
//         });
//       }
//     });
//     setLinkURL("");
//     setLinkAttributes({ target: "_blank" });
//     closeLinkPrompt();
//   };

//   return (
//     <div className="p-2 flex items-center border-b border-gray-700 bg-white shadow-sm">
//       {/* Insert Link Button */}
//       <button
//         onClick={openLinkPrompt}
//         className="toolbar-item flex items-center"
//         aria-label="Insert Link"
//       >
//         link
//       </button>

//       {/* Show Link Prompt */}
//       {showLinkPrompt && (
//         <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-white shadow-lg rounded">
//           <input
//             type="text"
//             value={linkURL}
//             onChange={(e) => setLinkURL(e.target.value)}
//             placeholder="Enter link URL"
//             className="border p-2 rounded w-full"
//           />
//           <button
//             onClick={insertLink}
//             className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
//           >
//             Insert Link
//           </button>
//           <button
//             onClick={closeLinkPrompt}
//             className="bg-gray-500 text-white px-4 py-2 rounded mt-2 ml-2"
//           >
//             Cancel
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import React, { useState, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  TextFormatType,
} from "lexical";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UnderlineIcon,
  FontBoldIcon,
  FontItalicIcon,
  StrikethroughIcon,
} from "@radix-ui/react-icons";

import { HeadingTagType, $createHeadingNode } from "@lexical/rich-text";
import { ListType, $createListNode } from "@lexical/list";
import { $getSelection, $isRangeSelection } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { Toggle } from '@/components/ui/toggle';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { INSERT_IMAGE_COMMAND } from '../components/plugins/ImageNode';
import { InsertImageDialog } from '../components/InsertImageDialog';
import { FORMAT_FONTFAMILY_COMMAND } from "./plugins/FontFamilyPlugin";


type FontFamily =
  | "Arial"
  | "Courier New"
  | "Georgia"
  | "Times New Roman"
  | "Trebuchet MS"
  | "Verdana";

type AlignmentType = "left" | "center" | "right" | "justify";

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [isUnderline, setIsUnderline] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [alignment, setAlignment] = useState<AlignmentType>("left");
  const [showInsertImageDialog, setShowInsertImageDialog] = useState(false);
  const [fontFamily, setFontFamily] = useState<FontFamily>("Arial");

  useEffect(() => {
    const updateFormattingStatus = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsUnderline(selection.hasFormat("underline"));
          setIsBold(selection.hasFormat("bold"));
          setIsItalic(selection.hasFormat("italic"));
          setIsStrikethrough(selection.hasFormat("strikethrough"));
        }
      });
    };

    const removeUpdateListener = editor.registerUpdateListener(() => {
      updateFormattingStatus();
    });

    return () => {
      removeUpdateListener();
    };
  }, [editor]);

  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatList = (listType: ListType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createListNode(listType));
      }
    });
  };

  const formatAlignment = (alignment: AlignmentType) => {
    setAlignment(alignment);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
      }
    });
  };
  const handleFontFamilyChange = (value: FontFamily) => {
    setFontFamily(value);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        editor.dispatchCommand(FORMAT_FONTFAMILY_COMMAND, value);
      }
    });
  };
  const toggleUnderline = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  };

  const toggleBold = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  };

  const toggleItalic = () => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  };

  const handleValueChange = (value: string) => {
    if (["bullet", "number"].includes(value)) {
      formatList(value as ListType);
    } else {
      formatHeading(value as HeadingTagType);
    }
  };

  const handleUndo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  const handleRedo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };
  const insertHorizontalRule = () => {
    editor.update(() => {
      editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
    });
  };
  const openInsertImageDialog = () => {
    setShowInsertImageDialog(true);
  };

  const closeInsertImageDialog = () => {
    setShowInsertImageDialog(false);
  };
  const insertImage = (payload: { url: string }) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, { url: payload.url });
  };
  const toggleFormatting = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };
  return (
    <div className="p-2 flex items-center border-b border-gray-700 bg-white shadow-sm">
      <div className="flex items-center space-x-2">
        {/* Undo Button with SVG */}
        <button
          onClick={handleUndo}
          className="toolbar-item flex items-center"
          aria-label="Undo"
        >
          <svg
            className="w-[16px] h-[18px] fill-[gray] cursor-pointer"
            viewBox="0 0 512 512"
          >
            <path d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3-163.8-62.5-226.3 0L125.7 160z" />
          </svg>
        </button>

        {/* Redo Button with SVG */}
        <button
          onClick={handleRedo}
          className="toolbar-item flex items-center"
          aria-label="Redo"
        >
          <svg
            className="w-[16px] h-[18px] fill-[gray] cursor-pointer"
            viewBox="0 0 512 512"
          >
            <path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8 229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0-62.5-62.5-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z" />
          </svg>
        </button>
      </div>

      {/* Wrapper for Headings and Lists Select */}
      <div className="mr-2">
        <Select onValueChange={handleValueChange}>
          <SelectTrigger className="w-[115px] border-0 bg-gray-70">
            <SelectValue placeholder="Normal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="h1">Heading 1</SelectItem>
            <SelectItem value="h2">Heading 2</SelectItem>
            <SelectItem value="h3">Heading 3</SelectItem>
            <SelectItem value="bullet">Bullet List</SelectItem>
            <SelectItem value="number">Numbered List</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Wrapper for Alignment Select */}
      <div className="mr-2">
        <Select
          onValueChange={(value) => formatAlignment(value as AlignmentType)}
          value={alignment}
        >
          <SelectTrigger className="w-[115px] border-0 bg-gray-70">
            <SelectValue placeholder="Align" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left" aria-label="Align Left">
              Left
            </SelectItem>
            <SelectItem value="center" aria-label="Align Center">
              Center
            </SelectItem>
            <SelectItem value="right" aria-label="Align Right">
              Right
            </SelectItem>
            <SelectItem value="justify" aria-label="Justify">
              Justify
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bold Button */}
      <Toggle
        onClick={toggleBold}
        aria-label="Toggle bold"
        pressed={isBold}
        className="hover:bg-gray-200 p-2 rounded"
      >
        <FontBoldIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        onClick={toggleItalic}
        aria-label="Toggle italic"
        pressed={isItalic}
        className="hover:bg-gray-200 p-2 rounded"
      >
        <FontItalicIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        onClick={toggleUnderline}
        aria-label="Toggle underline"
        pressed={isUnderline}
        disabled={isUnderline} // Adjust if you want to control the disabled state
        className="hover:bg-gray-200 p-2 rounded"
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        onClick={insertHorizontalRule}
        aria-label="Insert Horizontal Rule"
        className="hover:bg-gray-200 p-2 rounded"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-break">
          <path d="M0 10.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zM12 0H4a2 2 0 0 0-2 2v7h1V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v7h1V2a2 2 0 0 0-2-2zm2 12h-1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2H2v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2z" />
        </svg>
      </Toggle>
      <button onClick={openInsertImageDialog} aria-label="Insert Image">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-image">
          <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12V2z" />
        </svg>
      </button>

      {showInsertImageDialog && (
        <InsertImageDialog
          onClose={closeInsertImageDialog}
          onInsert={insertImage}
        />
      )}

      <div className="mr-2">
        <Select onValueChange={handleFontFamilyChange} value={fontFamily}>
          <SelectTrigger className="w-[115px] border-0 bg-gray-70">
            <SelectValue placeholder="Font Family" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <button
        onClick={() => toggleFormatting("strikethrough")}
        className={`toolbar-item flex items-center ${isStrikethrough ? 'text-blue-500' : ''}`}
        aria-label="Strikethrough"
      >
        <StrikethroughIcon className="w-[16px] h-[16px] fill-[gray]" />
      </button>
    </div>
  )
}