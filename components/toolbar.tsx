"use client";
import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $createHeadingNode,
    $isHeadingNode,
    HeadingTagType,
} from '@lexical/rich-text';
import {
    $isListNode,
    $createListNode,
    ListType,
} from '@lexical/list';
import {
    $getSelection,
    $isRangeSelection,
} from 'lexical';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { $setBlocksType } from '@lexical/selection';

export function Toolbar() {
    const [editor] = useLexicalComposerContext();


    const formatHeading = (headingSize: HeadingTagType) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection) && selection !== null) {
                $setBlocksType(selection, () => $createHeadingNode(headingSize));
            }
        });
    };

    const formatList = (listType: ListType) => {
        editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection) && selection !== null) {
                const nodes = selection.getNodes();
                if (nodes.length > 0) {
                    // Create a new list node of the selected type
                    const start = listType === 'number' ? 1 : undefined;
                    const listNode = $createListNode(listType, start);

                    // Replace the existing list node if present
                    if ($isListNode(nodes[0])) {
                        selection.insertNodes([listNode]);
                    } else {
                        // Create a new list node and set blocks type if not currently in a list
                        $setBlocksType(selection, () => listNode);
                    }
                }
            }
        });
    };

    const handleValueChange = (value: string) => {
        if (['bullet', 'number', 'check'].includes(value)) {
            formatList(value as ListType);
        } else {
            formatHeading(value as HeadingTagType);
        }
    };

    return (
        <div className="toolbar">
            <Select onValueChange={handleValueChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="h1">Heading 1</SelectItem>
                    <SelectItem value="h2">Heading 2</SelectItem>
                    <SelectItem value="h3">Heading 3</SelectItem>
                    <SelectItem value="bullet">Bullet List</SelectItem>
                    <SelectItem value="number">Numbered List</SelectItem>
                    {/* <SelectItem value="check">Check List</SelectItem> */}
                </SelectContent>
            </Select>
        </div>
    );
}
