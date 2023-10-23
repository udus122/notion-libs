import { convertResponseToRichText } from "../richText/richText.js";

import { fetchBlocks } from "./blocks.js";

import type { BulletedListItemBlockObject } from "../../../types/notion.js";
import type { BulletedListItemBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";

export const convertBulletedListItemResponseToBlock = async (
  block: BulletedListItemBlockObjectResponse
) => {
  if (block.has_children) {
    const children = await fetchBlocks(block.id);
    return {
      ...block,
      bulleted_list_item: {
        ...block.bulleted_list_item,
        rich_text: await convertResponseToRichText(
          block.bulleted_list_item.rich_text
        ),
        children,
      },
    } satisfies BulletedListItemBlockObject;
  }
  return {
    ...block,
    bulleted_list_item: {
      ...block.bulleted_list_item,
      rich_text: await convertResponseToRichText(
        block.bulleted_list_item.rich_text
      ),
    },
  } satisfies BulletedListItemBlockObject;
};
