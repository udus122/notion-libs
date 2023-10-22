import EquationRichTextObject from "./RichTextItem.equation.json";
import { RichTextItem } from "./RichTextItem.js";
import MentionRichTextObject from "./RichTextItem.mention.json";
import TextRichTextObject from "./RichTextItem.text.json";

import type { Meta, StoryObj } from "@storybook/react";
import type { EquationRichTextItem } from "src/libs/notion/richText/equation.js";
import type { MentionRichTextItem } from "src/libs/notion/richText/mention.js";
import type { TextRichTextItem } from "src/libs/notion/richText/text.js";

const meta: Meta<typeof RichTextItem> = {
  title: "RichText/RichTextItem",
  component: RichTextItem,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof RichTextItem>;

export const Text: Story = {
  args: {
    richText: TextRichTextObject as TextRichTextItem,
  },
};
export const Mention: Story = {
  args: {
    richText: MentionRichTextObject as MentionRichTextItem,
  },
};
export const Equation: Story = {
  args: {
    richText: EquationRichTextObject as EquationRichTextItem,
  },
};
