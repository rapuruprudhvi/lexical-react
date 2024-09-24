import { ElementNode, NodeKey, SerializedElementNode, ElementFormatType } from 'lexical';

export class LineBreakNode extends ElementNode {
  static getType(): string {
    return 'line-break';
  }

  constructor(key?: NodeKey) {
    super(key);
  }

  createDOM() {
    return document.createElement('br');
  }

  static importJSON(serializedNode: SerializedElementNode): LineBreakNode {
    return new LineBreakNode();
  }

  exportJSON(): SerializedElementNode {
    return {
      type: 'line-break',
      version: 1,
      children: [], // Required: Default to an empty array
      direction: null, // You can set this to "ltr" or "rtl" based on your needs
      format: 'normal' as ElementFormatType, // Set to a valid ElementFormatType
      indent: 0, // Required: Default indent value
    };
  }
}

export function $createLineBreakNode(): LineBreakNode {
  return new LineBreakNode();
}

export function $isLineBreakNode(node: any): node is LineBreakNode {
  return node instanceof LineBreakNode;
}
