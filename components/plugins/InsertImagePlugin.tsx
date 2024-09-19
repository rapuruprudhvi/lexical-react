import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_IMAGE_COMMAND } from './ImageNode';

export function InsertImagePlugin() {
  const [editor] = useLexicalComposerContext();

  const insertImage = (url: string) => { // Change src to url
    console.log('Dispatching INSERT_IMAGE_COMMAND with url:', url); // Debug: log command dispatch
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, { url }); // Change src to url
  };

  return null; // This plugin does not render anything
}
