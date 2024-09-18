import {
  ElementNode,
  LexicalCommand,
  NodeKey,
  createCommand,
  LexicalEditor,
  $getSelection,
  $isRangeSelection,
  SerializedElementNode,
} from 'lexical';

// Define the command for inserting images
export const INSERT_IMAGE_COMMAND: LexicalCommand<{ url: string }> = createCommand<{ url: string }>();

// Define a custom interface for the serialized node
interface SerializedImageNode extends SerializedElementNode {
  url: string;
}

// Define the ImageNode class
export class ImageNode extends ElementNode {
  url: string;

  constructor(url: string, key?: NodeKey) {
    super(key);
    this.url = url;
  }

  static getType() {
    return 'image';
  }

  static clone(node: ImageNode) {
    return new ImageNode(node.url, node.getKey());
  }

  createDOM() {
    const img = document.createElement('img');
    img.src = this.url;
    img.className = 'lexical-image'; // Apply a CSS class for styling
    img.style.maxWidth = '100%'; // Ensure image does not overflow
    img.style.display = 'block'; // Ensure the image is displayed as a block element
    img.addEventListener('click', () => this.openImageUploader());
    return img;
  }

  updateDOM(prevNode: ImageNode, dom: HTMLElement) {
    const img = dom as HTMLImageElement;
    if (prevNode.url !== this.url) {
      img.src = this.url;
    }
    return false;
  }

  openImageUploader() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';

    fileInput.addEventListener('change', async (event) => {
      const target = event.target as HTMLInputElement | null;
      if (target && target.files) {
        const file = target.files[0];
        if (file) {
          const reader = new FileReader();

          reader.onloadend = () => {
            const imageUrl = reader.result as string;
            this.updateImage(imageUrl);
          };

          reader.readAsDataURL(file);
        }
      }
    });

    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  }

  updateImage(url: string) {
    this.url = url;
    const writableDOM = this.getWritable() as unknown as HTMLImageElement;
    writableDOM.src = url;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { url } = serializedNode;
    return new ImageNode(url);
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      url: this.url,
      version: 1, // Or the appropriate version number
      children: [], // Or handle children if needed
      direction: 'ltr', // Or handle direction if needed
      format: '', // Or handle format if needed
      indent: 0, // Or handle indent if needed
    };
  }
}

// Function to insert an image into the editor
export function insertImage(editor: LexicalEditor, url: string) {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      selection.insertNodes([new ImageNode(url)]);
    }
  });
}
