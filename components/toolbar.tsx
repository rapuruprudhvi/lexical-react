import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
    $createHeadingNode,
    $createQuoteNode,
    $isHeadingNode,
    HeadingTagType,
} from '@lexical/rich-text';
import {
    $getSelection,
} from 'lexical';

import {
    $setBlocksType,
} from '@lexical/selection';


export function Toolbar() {
    const [editor] = useLexicalComposerContext();

    const formatHeading = (headingSize: HeadingTagType) => {
        editor.update(() => {
            const selection = $getSelection();
            $setBlocksType(selection, () => $createHeadingNode(headingSize));
        });

    };

    const handleValueChange = (value: HeadingTagType) => {
        formatHeading(value);
    }

    return (
        <div>
            <Select onValueChange={handleValueChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="h1">Heading 1</SelectItem>
                    <SelectItem value="h2">Heading 2</SelectItem>
                    <SelectItem value="h3">Heading 3</SelectItem>
                </SelectContent>
            </Select>


        </div>
    );
}
