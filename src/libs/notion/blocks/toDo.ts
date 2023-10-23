import { convertResponseToRichText } from "../richText/richText.js";

import { fetchBlocks } from "./blocks.js";

import type { ToDoBlockObject } from "../../../types/notion.js";
import type { ToDoBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";

export const convertToDoResponseToBlock = async (
  block: ToDoBlockObjectResponse
) => {
  if (block.has_children) {
    const children = await fetchBlocks(block.id);
    return {
      ...block,
      to_do: {
        ...block.to_do,
        rich_text: await convertResponseToRichText(block.to_do.rich_text),
        children,
      },
    } satisfies ToDoBlockObject;
  }
  return {
    ...block,
    to_do: {
      ...block.to_do,
      rich_text: await convertResponseToRichText(block.to_do.rich_text),
    },
  } satisfies ToDoBlockObject;
};
