import {
    ElementNode,
    NodeKey,
    EditorConfig,
    LexicalNode,
    SerializedElementNode,
  } from 'lexical';
  
  type SerializedLinkNode = SerializedElementNode & {
    url: string;
  };
  
  export class LinkNode extends ElementNode {
    __url: string;
  
    static getType(): string {
      return 'link';
    }
  
    static clone(node: LinkNode): LinkNode {
      return new LinkNode(node.__url, node.__key);
    }
  
    constructor(url: string, key?: NodeKey) {
      super(key);
      this.__url = url;
    }
  
    createDOM(config: EditorConfig): HTMLAnchorElement {
      const anchor = document.createElement('a');
      anchor.href = this.__url;
      anchor.rel = 'noopener noreferrer ugc';
      anchor.textContent = this.__url; // Set the link text, if needed
      return anchor;
    }
  
    updateDOM(prevNode: LinkNode, dom: HTMLAnchorElement): boolean {
      if (prevNode.__url !== this.__url) {
        dom.href = this.__url;
        return true;
      }
      return false;
    }
  
    static importJSON(serializedNode: SerializedLinkNode): LinkNode {
      const node = $createLinkNode(serializedNode.url);
      node.setFormat(serializedNode.format);
      node.setIndent(serializedNode.indent);
      node.setDirection(serializedNode.direction);
      return node;
    }
  
    exportJSON(): SerializedLinkNode {
      return {
        ...super.exportJSON(),
        type: 'link',
        url: this.__url,
      };
    }
  
    getURL(): string {
      return this.__url;
    }
  
    setURL(url: string): void {
      const writable = this.getWritable();
      writable.__url = url;
    }
  }
  
  export function $createLinkNode(url: string): LinkNode {
    return new LinkNode(url);
  }
  
  export function $isLinkNode(node: LexicalNode | null | undefined): node is LinkNode {
    return node instanceof LinkNode;
  }
  