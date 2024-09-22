// "use client";
// import React, { useState, useEffect, useCallback } from "react";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import {
//   FORMAT_TEXT_COMMAND,
//   UNDO_COMMAND,
//   REDO_COMMAND,
//   FORMAT_ELEMENT_COMMAND,
//   TextFormatType,
// } from "lexical";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   UnderlineIcon,
//   FontBoldIcon,
//   FontItalicIcon,
//   StrikethroughIcon,
// } from "@radix-ui/react-icons";

// import { HeadingTagType, $createHeadingNode } from "@lexical/rich-text";
// import { ListType, $createListNode } from "@lexical/list";
// import { $getSelection, $isRangeSelection } from "lexical";
// import { $setBlocksType } from "@lexical/selection";
// import { Toggle } from '@/components/ui/toggle';
// import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
// import { INSERT_IMAGE_COMMAND } from '../components/plugins/ImageNode';
// import { FORMAT_FONTFAMILY_COMMAND } from "./plugins/FontFamilyPlugin";
// import { insertImage } from '../components/plugins/ImageNode'; // Ensure the path is correct
// import { InsertImageDialog } from '../components/InsertImageDialog';
// import { Button } from "@/components/ui/button";
// import { $patchStyleText } from "@lexical/selection";
// import { LinkDialog } from "../components/LinkDialog";
// import { $createLinkNode } from "./plugins/linkNode";


// type FontFamily =
//   | "Arial"
//   | "Courier New"
//   | "Georgia"
//   | "Times New Roman"
//   | "Trebuchet MS"
//   | "Verdana";

// type AlignmentType = "left" | "center" | "right" | "justify";
// // Define font size options from 8px to 40px
// const FONT_SIZE_OPTIONS: [string, string][] = Array.from({ length: 33 }, (_, i) => [
//   `${8 + i}px`,
//   `${8 + i}px`,
// ]);

// // Define font size limits and default values
// const MIN_ALLOWED_FONT_SIZE = 8;
// const MAX_ALLOWED_FONT_SIZE = 72;
// const DEFAULT_FONT_SIZE = 15;

// // Define types
// type UpdateFontSizeType = 'increment' | 'decrement';

// export function Toolbar() {
//   const [editor] = useLexicalComposerContext();
//   const [isUnderline, setIsUnderline] = useState(false);
//   const [isBold, setIsBold] = useState(false);
//   const [isItalic, setIsItalic] = useState(false);
//   const [isStrikethrough, setIsStrikethrough] = useState(false);
//   const [alignment, setAlignment] = useState<AlignmentType>("left");
//   const [fontFamily, setFontFamily] = useState<FontFamily>("Arial");
//   const [showInsertImageDialog, setShowInsertImageDialog] = useState(false);
//   const [fontSize, setFontSize] = useState<string>(DEFAULT_FONT_SIZE + 'px');
//   const [showLinkDialog, setShowLinkDialog] = useState(false);



//   useEffect(() => {
//     const updateFormattingStatus = () => {
//       editor.getEditorState().read(() => {
//         const selection = $getSelection();
//         if ($isRangeSelection(selection)) {
//           setIsUnderline(selection.hasFormat("underline"));
//           setIsBold(selection.hasFormat("bold"));
//           setIsItalic(selection.hasFormat("italic"));
//           setIsStrikethrough(selection.hasFormat("strikethrough"));
//         }
//       });
//     };

//     const removeUpdateListener = editor.registerUpdateListener(() => {
//       updateFormattingStatus();
//     });

//     return () => {
//       removeUpdateListener();
//     };
//   }, [editor]);

//   const formatHeading = (headingSize: HeadingTagType) => {
//     editor.update(() => {
//       const selection = $getSelection();
//       if ($isRangeSelection(selection)) {
//         $setBlocksType(selection, () => $createHeadingNode(headingSize));
//       }
//     });
//   };

//   const formatList = (listType: ListType) => {
//     editor.update(() => {
//       const selection = $getSelection();
//       if ($isRangeSelection(selection)) {
//         $setBlocksType(selection, () => $createListNode(listType));
//       }
//     });
//   };

//   const formatAlignment = (alignment: AlignmentType) => {
//     setAlignment(alignment);
//     editor.update(() => {
//       const selection = $getSelection();
//       if ($isRangeSelection(selection)) {
//         editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
//       }
//     });
//   };
//   const handleFontFamilyChange = (value: FontFamily) => {
//     setFontFamily(value);
//     editor.update(() => {
//       const selection = $getSelection();
//       if ($isRangeSelection(selection)) {
//         editor.dispatchCommand(FORMAT_FONTFAMILY_COMMAND, value);
//       }
//     });
//   };
//   const toggleUnderline = () => {
//     editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
//   };

//   const toggleBold = () => {
//     editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
//   };

//   const toggleItalic = () => {
//     editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
//   };

//   const handleValueChange = (value: string) => {
//     if (["bullet", "number"].includes(value)) {
//       formatList(value as ListType);
//     } else {
//       formatHeading(value as HeadingTagType);
//     }
//   };

//   const handleUndo = () => {
//     editor.dispatchCommand(UNDO_COMMAND, undefined);
//   };

//   const handleRedo = () => {
//     editor.dispatchCommand(REDO_COMMAND, undefined);
//   };
//   const insertHorizontalRule = () => {
//     editor.update(() => {
//       editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
//     });
//   };
//   const openInsertImageDialog = () => {
//     setShowInsertImageDialog(true);
//   };

//   const closeInsertImageDialog = () => {
//     setShowInsertImageDialog(false);
//   };

//   const insertImageHandler = (payload: { urls: string[] }) => {
//     payload.urls.forEach(url => insertImage(editor, url));
//   };

//   const toggleFormatting = (format: TextFormatType) => {
//     editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
//   };
//   const calculateNextFontSize = (currentFontSize: number, updateType: UpdateFontSizeType | null): number => {
//     let updatedFontSize = currentFontSize;
//     switch (updateType) {
//       case 'decrement':
//         switch (true) {
//           case currentFontSize > MAX_ALLOWED_FONT_SIZE:
//             updatedFontSize = MAX_ALLOWED_FONT_SIZE;
//             break;
//           case currentFontSize >= 48:
//             updatedFontSize -= 12;
//             break;
//           case currentFontSize >= 24:
//             updatedFontSize -= 4;
//             break;
//           case currentFontSize >= 14:
//             updatedFontSize -= 2;
//             break;
//           case currentFontSize >= 9:
//             updatedFontSize -= 1;
//             break;
//           default:
//             updatedFontSize = MIN_ALLOWED_FONT_SIZE;
//             break;
//         }
//         break;
//       case 'increment':
//         switch (true) {
//           case currentFontSize < MIN_ALLOWED_FONT_SIZE:
//             updatedFontSize = MIN_ALLOWED_FONT_SIZE;
//             break;
//           case currentFontSize < 12:
//             updatedFontSize += 1;
//             break;
//           case currentFontSize < 20:
//             updatedFontSize += 2;
//             break;
//           case currentFontSize < 36:
//             updatedFontSize += 4;
//             break;
//           case currentFontSize <= 60:
//             updatedFontSize += 12;
//             break;
//           default:
//             updatedFontSize = MAX_ALLOWED_FONT_SIZE;
//             break;
//         }
//         break;
//       default:
//         break;
//     }
//     return updatedFontSize;
//   };

//   const updateTextFontSize = useCallback((size: string | null) => {
//     editor.update(() => {
//       const selection = $getSelection();
//       if ($isRangeSelection(selection)) {
//         $patchStyleText(selection, { 'font-size': size });
//       }
//     });
//   }, [editor]);

//   const handleFontSizeChange = (value: string) => {
//     setFontSize(value);
//     updateTextFontSize(value);
//   };

//   const incrementFontSize = () => {
//     const currentSize = parseInt(fontSize, 10);
//     if (currentSize < MAX_ALLOWED_FONT_SIZE) {
//       const newSize = `${calculateNextFontSize(currentSize, 'increment')}px`;
//       setFontSize(newSize);
//       updateTextFontSize(newSize);
//     }
//   };

//   const decrementFontSize = () => {
//     const currentSize = parseInt(fontSize, 10);
//     if (currentSize > MIN_ALLOWED_FONT_SIZE) {
//       const newSize = `${calculateNextFontSize(currentSize, 'decrement')}px`;
//       setFontSize(newSize);
//       updateTextFontSize(newSize);
//     }
//   };
//   const openLinkDialog = () => setShowLinkDialog(true);
//   const closeLinkDialog = () => setShowLinkDialog(false);

//   const insertLink = (url: string) => {
//     editor.update(() => {
//       const selection = $getSelection();
//       if ($isRangeSelection(selection)) {
//         const linkNode = $createLinkNode(url);
//         selection.insertNodes([linkNode]);
//       }
//     });
//   };
//   return (
//     <div className="p-2 flex items-center border-b border-gray-700 bg-white shadow-sm">
//       <div className="flex items-center space-x-2">
//         {/* Undo Button with SVG */}
//         <button
//           onClick={handleUndo}
//           className="toolbar-item flex items-center"
//           aria-label="Undo"
//         >
//           <svg
//             className="w-[16px] h-[18px] fill-[gray] cursor-pointer"
//             viewBox="0 0 512 512"
//           >
//             <path d="M125.7 160H176c17.7 0 32 14.3 32 32s-14.3 32-32 32H48c-17.7 0-32-14.3-32-32V64c0-17.7 14.3-32 32-32s32 14.3 32 32v51.2L97.6 97.6c87.5-87.5 229.3-87.5 316.8 0s87.5 229.3 0 316.8-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3-163.8-62.5-226.3 0L125.7 160z" />
//           </svg>
//         </button>

//         {/* Redo Button with SVG */}
//         <button
//           onClick={handleRedo}
//           className="toolbar-item flex items-center"
//           aria-label="Redo"
//         >
//           <svg
//             className="w-[16px] h-[18px] fill-[gray] cursor-pointer"
//             viewBox="0 0 512 512"
//           >
//             <path d="M386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H464c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8 229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0-62.5-62.5-62.5-163.8 0-226.3s163.8-62.5 226.3 0L386.3 160z" />
//           </svg>
//         </button>
//       </div>

//       {/* Wrapper for Headings and Lists Select */}
//       <div className="mr-2">
//         <Select onValueChange={handleValueChange}>
//           <SelectTrigger className="w-[115px] border-0 bg-gray-70">
//             <SelectValue placeholder="Normal" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="h1">Heading 1</SelectItem>
//             <SelectItem value="h2">Heading 2</SelectItem>
//             <SelectItem value="h3">Heading 3</SelectItem>
//             <SelectItem value="bullet">Bullet List</SelectItem>
//             <SelectItem value="number">Numbered List</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Wrapper for Alignment Select */}
//       <div className="mr-2">
//         <Select
//           onValueChange={(value) => formatAlignment(value as AlignmentType)}
//           value={alignment}
//         >
//           <SelectTrigger className="w-[115px] border-0 bg-gray-70">
//             <SelectValue placeholder="Align" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="left" aria-label="Align Left">
//               Left
//             </SelectItem>
//             <SelectItem value="center" aria-label="Align Center">
//               Center
//             </SelectItem>
//             <SelectItem value="right" aria-label="Align Right">
//               Right
//             </SelectItem>
//             <SelectItem value="justify" aria-label="Justify">
//               Justify
//             </SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Bold Button */}
//       <Toggle
//         onClick={toggleBold}
//         aria-label="Toggle bold"
//         pressed={isBold}
//         className="hover:bg-gray-200 p-2 rounded"
//       >
//         <FontBoldIcon className="h-4 w-4" />
//       </Toggle>

//       <Toggle
//         onClick={toggleItalic}
//         aria-label="Toggle italic"
//         pressed={isItalic}
//         className="hover:bg-gray-200 p-2 rounded"
//       >
//         <FontItalicIcon className="h-4 w-4" />
//       </Toggle>

//       <Toggle
//         onClick={toggleUnderline}
//         aria-label="Toggle underline"
//         pressed={isUnderline}
//         disabled={isUnderline} // Adjust if you want to control the disabled state
//         className="hover:bg-gray-200 p-2 rounded"
//       >
//         <UnderlineIcon className="h-4 w-4" />
//       </Toggle>
//       <Toggle
//         onClick={insertHorizontalRule}
//         aria-label="Insert Horizontal Rule"
//         className="hover:bg-gray-200 p-2 rounded"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-break">
//           <path d="M0 10.5a.5.5 0 0 1 .5-.5h15a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5zM12 0H4a2 2 0 0 0-2 2v7h1V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v7h1V2a2 2 0 0 0-2-2zm2 12h-1v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2H2v2a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2z" />
//         </svg>
//       </Toggle>
//       <button
//         onClick={openInsertImageDialog}
//         aria-label="Insert Image"
//         className="ml-2 p-1"
//       >
//         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-image">
//           <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
//           <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12V2z" />
//         </svg>
//       </button>

//       {showInsertImageDialog && (
//         <InsertImageDialog
//           onClose={closeInsertImageDialog}
//           onInsert={insertImageHandler}
//         />
//       )}

//       <div className="mr-2">
//         <Select onValueChange={handleFontFamilyChange} value={fontFamily}>
//           <SelectTrigger className="w-[115px] border-0 bg-gray-70">
//             <SelectValue placeholder="Font Family" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="Arial">Arial</SelectItem>
//             <SelectItem value="Courier New">Courier New</SelectItem>
//             <SelectItem value="Georgia">Georgia</SelectItem>
//             <SelectItem value="Times New Roman">Times New Roman</SelectItem>
//             <SelectItem value="Trebuchet MS">Trebuchet MS</SelectItem>
//             <SelectItem value="Verdana">Verdana</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <button
//         onClick={() => toggleFormatting("strikethrough")}
//         className={`toolbar-item flex items-center ${isStrikethrough ? 'text-blue-500' : ''}`}
//         aria-label="Strikethrough"
//       >
//         <StrikethroughIcon className="w-[16px] h-[16px] fill-[gray]" />
//       </button>
//       <div className="mr-2 flex items-center">
//         <button onClick={decrementFontSize} aria-label="Decrease Font Size" className="p-1">
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash">
//             <path d="M3 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z" />
//           </svg>
//         </button>
//         <Select onValueChange={handleFontSizeChange}>
//           <SelectTrigger className="w-[115px] border-0 bg-gray-70">
//             <SelectValue placeholder={fontSize} />
//           </SelectTrigger>
//           <SelectContent>
//             {FONT_SIZE_OPTIONS.map(([value, label]) => (
//               <SelectItem key={value} value={value}>
//                 {label}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <button onClick={incrementFontSize} aria-label="Increase Font Size" className="p-1">
//           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus">
//             <path d="M8 3.5a.5.5 0 0 1 .5.5V8h4.5a.5.5 0 0 1 0 1H8.5v4.5a.5.5 0 0 1-1 0V9H3a.5.5 0 0 1 0-1h4.5V4a.5.5 0 0 1 .5-.5z" />
//           </svg>
//         </button>
//         <button onClick={openLinkDialog}>
//           Insert Link
//         </button>

//         <LinkDialog
//           isOpen={showLinkDialog}
//           onClose={closeLinkDialog}
//           onInsert={insertLink}
//         />
//       </div>
//     </div>
//   )
// }


"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import { $getSelection, $isRangeSelection, $getRoot, $insertNodes, } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { Toggle } from '@/components/ui/toggle';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { INSERT_IMAGE_COMMAND } from '../components/plugins/ImageNode';
import { FORMAT_FONTFAMILY_COMMAND } from "./plugins/FontFamilyPlugin";
import { insertImage } from '../components/plugins/ImageNode'; // Ensure the path is correct
import { InsertImageDialog } from '../components/InsertImageDialog';
import { Button } from "@/components/ui/button";
import { $patchStyleText } from "@lexical/selection";
import { LinkDialog } from "../components/LinkDialog";
import { $createLinkNode } from "./plugins/linkNode";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";


type FontFamily =
  | "Arial"
  | "Courier New"
  | "Georgia"
  | "Times New Roman"
  | "Trebuchet MS"
  | "Verdana";

type AlignmentType = "left" | "center" | "right" | "justify";
// Define font size options from 8px to 40px
const FONT_SIZE_OPTIONS: [string, string][] = Array.from({ length: 33 }, (_, i) => [
  `${8 + i}px`,
  `${8 + i}px`,
]);

// Define font size limits and default values
const MIN_ALLOWED_FONT_SIZE = 8;
const MAX_ALLOWED_FONT_SIZE = 72;
const DEFAULT_FONT_SIZE = 15;

// Define types
type UpdateFontSizeType = 'increment' | 'decrement';
//Html
type ToolbarProps = {
  setHtmlContent: (html: string) => void;
};

// export function Toolbar() {
export function Toolbar({ setHtmlContent }: ToolbarProps) {

  const [editor] = useLexicalComposerContext();
  const [isUnderline, setIsUnderline] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [alignment, setAlignment] = useState<AlignmentType>("left");
  const [fontFamily, setFontFamily] = useState<FontFamily>("Arial");
  const [showInsertImageDialog, setShowInsertImageDialog] = useState(false);
  const [fontSize, setFontSize] = useState<string>(DEFAULT_FONT_SIZE + 'px');
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [previousHtml, setPreviousHtml] = useState<string>(""); // State to store previous HTML



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

  const insertImageHandler = (payload: { urls: string[] }) => {
    payload.urls.forEach(url => insertImage(editor, url));
  };

  const toggleFormatting = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };
  const calculateNextFontSize = (currentFontSize: number, updateType: UpdateFontSizeType | null): number => {
    let updatedFontSize = currentFontSize;
    switch (updateType) {
      case 'decrement':
        switch (true) {
          case currentFontSize > MAX_ALLOWED_FONT_SIZE:
            updatedFontSize = MAX_ALLOWED_FONT_SIZE;
            break;
          case currentFontSize >= 48:
            updatedFontSize -= 12;
            break;
          case currentFontSize >= 24:
            updatedFontSize -= 4;
            break;
          case currentFontSize >= 14:
            updatedFontSize -= 2;
            break;
          case currentFontSize >= 9:
            updatedFontSize -= 1;
            break;
          default:
            updatedFontSize = MIN_ALLOWED_FONT_SIZE;
            break;
        }
        break;
      case 'increment':
        switch (true) {
          case currentFontSize < MIN_ALLOWED_FONT_SIZE:
            updatedFontSize = MIN_ALLOWED_FONT_SIZE;
            break;
          case currentFontSize < 12:
            updatedFontSize += 1;
            break;
          case currentFontSize < 20:
            updatedFontSize += 2;
            break;
          case currentFontSize < 36:
            updatedFontSize += 4;
            break;
          case currentFontSize <= 60:
            updatedFontSize += 12;
            break;
          default:
            updatedFontSize = MAX_ALLOWED_FONT_SIZE;
            break;
        }
        break;
      default:
        break;
    }
    return updatedFontSize;
  };

  const updateTextFontSize = useCallback((size: string | null) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { 'font-size': size });
      }
    });
  }, [editor]);

  const handleFontSizeChange = (value: string) => {
    setFontSize(value);
    updateTextFontSize(value);
  };

  const incrementFontSize = () => {
    const currentSize = parseInt(fontSize, 10);
    if (currentSize < MAX_ALLOWED_FONT_SIZE) {
      const newSize = `${calculateNextFontSize(currentSize, 'increment')}px`;
      setFontSize(newSize);
      updateTextFontSize(newSize);
    }
  };

  const decrementFontSize = () => {
    const currentSize = parseInt(fontSize, 10);
    if (currentSize > MIN_ALLOWED_FONT_SIZE) {
      const newSize = `${calculateNextFontSize(currentSize, 'decrement')}px`;
      setFontSize(newSize);
      updateTextFontSize(newSize);
    }
  };
  const openLinkDialog = () => setShowLinkDialog(true);
  const closeLinkDialog = () => setShowLinkDialog(false);

  const insertLink = (url: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const linkNode = $createLinkNode(url);
        selection.insertNodes([linkNode]);
      }
    });
  };

  const exportHTML = () => {
    editor.update(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      setHtmlContent(htmlString);
      setPreviousHtml(htmlString);
    });
  };

  const importHTML = () => {
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(previousHtml, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      $getRoot().select();
      $insertNodes(nodes);
    });
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
      <button
        onClick={openInsertImageDialog}
        aria-label="Insert Image"
        className="ml-2 p-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-image">
          <path d="M8.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
          <path d="M12 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v8l-2.083-2.083a.5.5 0 0 0-.76.063L8 11 5.835 9.7a.5.5 0 0 0-.611.076L3 12V2z" />
        </svg>
      </button>

      {showInsertImageDialog && (
        <InsertImageDialog
          onClose={closeInsertImageDialog}
          onInsert={insertImageHandler}
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
      <div className="mr-2 flex items-center">
        <button onClick={decrementFontSize} aria-label="Decrease Font Size" className="p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash">
            <path d="M3 8.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5z" />
          </svg>
        </button>
        <Select onValueChange={handleFontSizeChange}>
          <SelectTrigger className="w-[115px] border-0 bg-gray-70">
            <SelectValue placeholder={fontSize} />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZE_OPTIONS.map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button onClick={incrementFontSize} aria-label="Increase Font Size" className="p-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus">
            <path d="M8 3.5a.5.5 0 0 1 .5.5V8h4.5a.5.5 0 0 1 0 1H8.5v4.5a.5.5 0 0 1-1 0V9H3a.5.5 0 0 1 0-1h4.5V4a.5.5 0 0 1 .5-.5z" />
          </svg>
        </button>
        <button onClick={openLinkDialog}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-link">
            <path d="M6.354 5.5H4a3 3 0 0 0 0 6h3a3 3 0 0 0 2.83-4H9c-.086 0-.17.01-.25.031A2 2 0 0 1 7 10.5H4a2 2 0 1 1 0-4h1.535c.218-.376.495-.714.82-1z" />
            <path d="M9 5.5a3 3 0 0 0-2.83 4h1.098A2 2 0 0 1 9 6.5h3a2 2 0 1 1 0 4h-1.535a4.02 4.02 0 0 1-.82 1H12a3 3 0 1 0 0-6H9z" />
          </svg>
        </button>


        <LinkDialog
          isOpen={showLinkDialog}
          onClose={closeLinkDialog}
          onInsert={insertLink}
        />
      </div>
      <button onClick={exportHTML}>Import</button>
      <span> <button onClick={importHTML} className="p-3">Export</button></span>
    </div>
  )
}
