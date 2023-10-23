import { convertResponseToRichText } from "../richText/richText.js";

import { fetchBlocks } from "./blocks.js";

import type { Heading1BlockObject } from "../../../types/notion.js";
import type { Heading1BlockObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";

export const convertHeading1ResponseToBlock = async (
  block: Heading1BlockObjectResponse
) => {
  if (block.has_children) {
    const children = await fetchBlocks(block.id);
    return {
      ...block,
      heading_1: {
        ...block.heading_1,
        rich_text: await convertResponseToRichText(block.heading_1.rich_text),
        children,
      },
    } satisfies Heading1BlockObject;
  }
  return {
    ...block,
    heading_1: {
      ...block.heading_1,
      rich_text: await convertResponseToRichText(block.heading_1.rich_text),
    },
  } satisfies Heading1BlockObject;
};
