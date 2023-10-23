import { convertResponseToRichText } from "../richText/richText.js";

import { fetchBlocks } from "./blocks.js";

import type { ParagraphBlockObject } from "../../../types/notion.js";
import type { ParagraphBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";

export const convertParagraphResponseToBlock = async (
  block: ParagraphBlockObjectResponse
) => {
  if (block.has_children) {
    const children = await fetchBlocks(block.id);
    return {
      ...block,
      paragraph: {
        ...block.paragraph,
        rich_text: await convertResponseToRichText(block.paragraph.rich_text),
        children,
      },
    } satisfies ParagraphBlockObject;
  }
  return {
    ...block,
    paragraph: {
      ...block.paragraph,
      rich_text: await convertResponseToRichText(block.paragraph.rich_text),
    },
  } satisfies ParagraphBlockObject;
};
