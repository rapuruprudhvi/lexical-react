import { ElementNode, NodeKey, SerializedElementNode } from 'lexical';

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
    };
  }
}

export function $createLineBreakNode(): LineBreakNode {
  return new LineBreakNode();
}

export function $isLineBreakNode(node: any): node is LineBreakNode {
  return node instanceof LineBreakNode;
}
