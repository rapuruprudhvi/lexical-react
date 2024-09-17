"use client";
import { $getRoot, $getSelection } from 'lexical';
import { useEffect } from 'react';

import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { Toolbar } from './toolbar';
import { HeadingNode } from '@lexical/rich-text';

const theme = {
    heading: {
        h1: 'text-5xl font-bold',
        h2: 'text-4xl font-bold',
        h3: 'text-3xl font-bold',
    }
}

function onError(error: Error) {
    console.error(error);
}

export function Editor() {
    const initialConfig = {
        namespace: 'MyEditor',
        nodes: [HeadingNode],
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
            <HistoryPlugin />
            <AutoFocusPlugin />
        </LexicalComposer>
    );
}