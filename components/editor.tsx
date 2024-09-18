"use client";
import React from 'react';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { Toolbar } from './toolbar';
import { LinkNode } from '@lexical/link';
import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ImageNode } from '../components/plugins/ImageNode';
import { FontFamilyPlugin, FontNode } from './plugins/FontFamilyPlugin';

const theme = {
  heading: {
    h1: 'text-5xl font-bold',
    h2: 'text-4xl font-bold',
    h3: 'text-3xl font-bold',
  },
  list: {
    ul: 'list-disc list-inside',
    ol: 'list-decimal list-inside',
  },
  text: {
    underline: 'underline',
    strikethrough: 'line-through',
  },
  link: 'text-blue-500 underline',
  alignment: {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify',
  },
  horizontalRule: 'my-6 border-t border-red-500',
  image: 'my-4 max-w-full h-auto',
};

function onError(error: Error) {
  console.error(error);
}

export function Editor() {
  const initialConfig = {
    namespace: 'MyEditor',
    nodes: [HeadingNode,
      ListNode,
      ListItemNode,
      LinkNode,
      HorizontalRuleNode,
      ImageNode,
      FontNode],
    theme,
    onError,
  };
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <Toolbar />
      <RichTextPlugin
        contentEditable={<ContentEditable className='border min-h-96 p-4' />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <LexicalLinkPlugin />
      <FontFamilyPlugin />
      <HistoryPlugin />
      <AutoFocusPlugin />
      <HorizontalRulePlugin />
    </LexicalComposer>
  );
}
