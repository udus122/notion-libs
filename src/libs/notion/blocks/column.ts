import { fetchBlocks } from "./blocks.js";

import type { ColumnBlockObject } from "../../../types/notion.js";
import type { ColumnBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";

export const convertColumnResponseToBlock = async (
  block: ColumnBlockObjectResponse
) => {
  if (block.has_children) {
    const children = await fetchBlocks(block.id);
    return {
      ...block,
      column: {
        ...block.column,
        children,
      },
    };
  }
  return { ...block } satisfies ColumnBlockObject;
};
