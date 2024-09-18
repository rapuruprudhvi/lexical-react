// FontFamilyPlugin.tsx
import {
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_HIGH,
    createCommand,
    LexicalCommand,
    NodeKey,
    TextNode,
    EditorConfig,
    LexicalEditor,
    $createTextNode,
    $isTextNode,
    SerializedTextNode as LexicalSerializedTextNode,
  } from "lexical";
  import { $patchStyleText } from '@lexical/selection';
  import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
  
  // Define the FontNode class extending TextNode
  export class FontNode extends TextNode {
    __font: string;
  
    constructor(text: string, font: string, key?: NodeKey) {
      super(text, key);
      this.__font = font || 'defaultFont';
    }
  
    static getType(): string {
      return "font";
    }
  
    static clone(node: FontNode): FontNode {
      return new FontNode(node.__text, node.__font, node.__key);
    }
  
    createDOM(config: EditorConfig): HTMLElement {
      const element = super.createDOM(config);
      element.style.fontFamily = this.__font;
      return element;
    }
  
    updateDOM(prevNode: TextNode, dom: HTMLElement, config: EditorConfig): boolean {
      if (prevNode instanceof FontNode) {
        dom.style.fontFamily = this.__font;
      }
      return false;
    }
  
    exportJSON(): SerializedTextNode {
      return {
        text: this.__text,
        type: "font",
        version: 2,
        font: this.__font,
        detail: 0,
        format: 0,
        mode: "normal",
        style: "",
      };
    }
  
    static importJSON(serializedNode: SerializedTextNode): FontNode {
      return $createFontNode(serializedNode.text, serializedNode.font || 'defaultFont');
    }
  }
  
  // Create a FontNode
  export function $createFontNode(text: string, font: string): FontNode {
    return new FontNode(text, font);
  }
  
  // Check if a node is a FontNode
  export function $isFontNode(node: TextNode): node is FontNode {
    return node instanceof FontNode;
  }
  
  // Define the font family command
  export const FORMAT_FONTFAMILY_COMMAND: LexicalCommand<string> = createCommand("changeFontFamily");
  
  // Create the FontFamilyPlugin component
  export function FontFamilyPlugin(): null {
    const [editor] = useLexicalComposerContext();
  
    if (!editor.hasNodes([FontNode])) {
      throw new Error("FontFamilyPlugin: FontNode not registered on editor");
    }
  
    editor.registerCommand(
      FORMAT_FONTFAMILY_COMMAND,
      (fontName: string) => {
        editor.update(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            $patchStyleText(selection, { "font-family": fontName || DEFAULT_FONT_FAMILIES[0] });
          }
        });
        editor.focus();
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );
  
    return null;
  }
  
  // Define the serialized TextNode type
  export type SerializedTextNode = LexicalSerializedTextNode & {
    font?: string;
    detail?: number;
    format?: number;
    mode?: "normal" | "token" | "segmented";
    style?: string;
  };
  
  // Default font families
  const DEFAULT_FONT_FAMILIES = ["Arial", "Times New Roman", "Courier New", "Georgia"];
  