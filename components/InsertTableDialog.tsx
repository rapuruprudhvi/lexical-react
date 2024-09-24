"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface InsertTableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (rows: number, columns: number) => void;
}

export function InsertTableDialog({ isOpen, onClose, onInsert }: InsertTableDialogProps) {
  const [rows, setRows] = useState(2);
  const [columns, setColumns] = useState(2);

  const handleInsert = () => {
    onInsert(rows, columns);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-100">
        <DialogHeader>
          <DialogTitle>Insert Table</DialogTitle>
          <DialogDescription>
            Enter the number of rows and columns for the table.
          </DialogDescription>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <div className="p-4">
          <label>
            Rows:
            <input
              type="number"
              value={rows}
              min={1}
              onChange={(e) => setRows(Number(e.target.value))}
              className="ml-2 p-1 border border-gray-300 rounded"
            />
          </label>
          <label className="ml-4">
            Columns:
            <input
              type="number"
              value={columns}
              min={1}
              onChange={(e) => setColumns(Number(e.target.value))}
              className="ml-2 p-1 border border-gray-300 rounded"
            />
          </label>
          <DialogFooter>
            <Button onClick={handleInsert} className="mr-2">
              Insert
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}



// // import React, { useState } from "react";
// import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
// import {
//   $getSelection,
//   $isRangeSelection,
//   $createParagraphNode,
//   $createTextNode,
// } from "lexical";
// import {
//   $isTableNode,
//   $createTableNode,
//   $createTableCellNode,
//   $createTableRowNode,
// } from "@lexical/table";
// import { $createHeadingNode } from "@lexical/rich-text";
// import { $setBlocksType } from "@lexical/selection";
// import { InsertTableDialog } from "../components/InsertTableDialog";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
// import { jsPDF } from "jspdf";

// type HeadingTagType = "h1" | "h2" | "h3" | "h4" | "h5";

// export function Toolbar() {
//   const [editor] = useLexicalComposerContext();
//   const [showInsertTableDialog, setShowInsertTableDialog] = useState(false);
//   const [pdfName, setPdfName] = useState<string>("document");
//   const [fileFormat, setFileFormat] = useState<string>("pdf");

//   const formatHeading = (headingSize: HeadingTagType) => {
//     editor.update(() => {
//       const selection = $getSelection();
//       if ($isRangeSelection(selection)) {
//         $setBlocksType(selection, () => $createHeadingNode(headingSize));
//       } else {
//         console.warn("No valid selection to format heading.");
//       }
//     });
//   };

//   const handleHeadingChange = (value: string) => {
//     formatHeading(value as HeadingTagType);
//   };

//   const openInsertTableDialog = () => setShowInsertTableDialog(true);
//   const closeInsertTableDialog = () => setShowInsertTableDialog(false);

//   const insertTableHandler = (rows: number, cols: number) => {
//     editor.update(() => {
//       const selection = $getSelection();
//       if ($isRangeSelection(selection)) {
//         const tableNode = $createTableNode();
//         for (let i = 0; i < rows; i++) {
//           const tableRow = $createTableRowNode();
//           for (let j = 0; j < cols; j++) {
//             const tableCell = $createTableCellNode(0);
//             const paragraph = $createParagraphNode();
//             paragraph.append($createTextNode(""));
//             tableCell.append(paragraph);
//             tableRow.append(tableCell);
//           }
//           tableNode.append(tableRow);
//         }
//         selection.insertNodes([tableNode]);
//       } else {
//         console.warn("No valid selection to insert table.");
//       }
//     });
//   };

//   const exportHTML = () => {
//     editor.update(() => {
//       const htmlString = $generateHtmlFromNodes(editor, null);
//       const doc = new jsPDF();
//       doc.html(htmlString, {
//         callback: (doc) => {
//           doc.save(`${pdfName}.${fileFormat}`); // Use specified filename and format
//         },
//         x: 10,
//         y: 10,
//       });
//     });
//   };

//   const importHTML = async (file: File) => {
//     const reader = new FileReader();
//     reader.onload = () => {
//       const htmlString = reader.result as string;
//       editor.update(() => {
//         const parser = new DOMParser();
//         const dom = parser.parseFromString(htmlString, "text/html");
//         const nodes = $generateNodesFromDOM(editor, dom);
//         const selection = $getSelection();
//         if ($isRangeSelection(selection)) {
//           selection.insertNodes(nodes);
//         } else {
//           console.warn("No valid selection to import nodes.");
//         }
//       });
//     };
//     reader.readAsText(file);
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const files = event.target.files;
//     if (files && files.length > 0) {
//       importHTML(files[0]);
//     }
//   };

//   return (
//     <div className="p-2 flex items-center border-b border-gray-700 bg-white shadow-sm">
//       <div className="mr-2">
//         <Select onValueChange={handleHeadingChange}>
//           <SelectTrigger className="w-[115px] border-0 bg-gray-70">
//             <SelectValue placeholder="Heading" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="h1">Heading 1</SelectItem>
//             <SelectItem value="h2">Heading 2</SelectItem>
//             <SelectItem value="h3">Heading 3</SelectItem>
//             <SelectItem value="h4">Heading 4</SelectItem>
//             <SelectItem value="h5">Heading 5</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       <button onClick={openInsertTableDialog} className="mx-2">
//         Insert Table
//       </button>

//       <input
//         type="text"
//         placeholder="PDF Name"
//         value={pdfName}
//         onChange={(e) => setPdfName(e.target.value)}
//         className="mx-2 border p-1"
//       />

//       <select
//         value={fileFormat}
//         onChange={(e) => setFileFormat(e.target.value)}
//         className="mx-2 border p-1"
//       >
//         <option value="pdf">PDF</option>
//         <option value="png">PNG</option> {/* If you decide to add image export back */}
//       </select>

//       <button onClick={exportHTML} className="mx-2">
//         Export as PDF
//       </button>

//       <input
//         type="file"
//         accept=".html"
//         onChange={handleFileChange}
//         className="mx-2"
//       />

//       {showInsertTableDialog && (
//         <InsertTableDialog
//           isOpen={showInsertTableDialog}
//           onClose={closeInsertTableDialog}
//           onInsert={insertTableHandler}
//         />
//       )}
//     </div>
//   );
// }