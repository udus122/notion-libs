import { isFullBlock } from "@notionhq/client";

import {
  callAPIWithBackOff,
  generateUUID,
  notNullNorUndefined,
} from "../../utils.js";
import { notion } from "../auth.js";

import { convertAudioResponseToBlock } from "./audio.js";
import { convertBookmarkResponseToBlock } from "./bookmark.js";
import { convertBreadcrumbResponseToBlock } from "./breadcrumb.js";
import { convertBulletedListItemResponseToBlock } from "./bulletedListItem.js";
import { convertCalloutResponseToBlock } from "./callout.js";
import { convertChildDatabaseResponseToBlock } from "./childDatabase.js";
import { convertChildPageResponseToBlock } from "./childPage.js";
import { convertCodeResponseToBlock } from "./code.js";
import { convertColumnResponseToBlock } from "./column.js";
import { convertColumnListResponseToBlock } from "./columnList.js";
import { convertDividerResponseToBlock } from "./divider.js";
import { convertEmbedResponseToBlock } from "./embed.js";
import { convertEquationResponseToBlock } from "./equation.js";
import { convertFileResponseToBlock } from "./file.js";
import { convertHeading1ResponseToBlock } from "./heading1.js";
import { convertHeading2ResponseToBlock } from "./heading2.js";
import { convertHeading3ResponseToBlock } from "./heading3.js";
import { convertImageResponseToBlock } from "./image.js";
import { convertLinkPreviewResponseToBlock } from "./linkPreview.js";
import { convertLinkToPageResponseToBlock } from "./linkToPage.js";
import { convertNumberedListItemResponseToBlock } from "./numberedListItem.js";
import { convertParagraphResponseToBlock } from "./paragraph.js";
import { convertPdfResponseToBlock } from "./pdf.js";
import { convertQuoteResponseToBlock } from "./quote.js";
import { convertSyncedBlockResponseToBlock } from "./syncedBlock.js";
import { convertTableResponseToBlock } from "./table.js";
import { convertTableRowResponseToBlock } from "./table_row.js";
import { convertTableOfContentsResponseToBlock } from "./tableOfContents.js";
import { convertTemplateResponseToBlock } from "./template.js";
import { convertToDoResponseToBlock } from "./toDo.js";
import { convertToggleResponseToBlock } from "./toggle.js";
import { convertUnsupportedResponseToBlock } from "./unsupported.js";
import { convertVideoResponseToBlock } from "./video.js";

import type {
  BlockObject,
  BulletedListBlockObject,
  ListBlockChildrenResponseResults,
  NumberedListBlockObject,
} from "../../../types/notion.js";
import type {
  BlockObjectResponse,
  GetBlockParameters,
  GetBlockResponse,
  ListBlockChildrenParameters,
  ListBlockChildrenResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints.js";

export const retrieveBlock = async (
  args: GetBlockParameters
): Promise<GetBlockResponse | undefined> => {
  const { payload, error } = await callAPIWithBackOff<
    GetBlockParameters,
    GetBlockResponse
  >(notion.blocks.retrieve, args);

  if (!error) {
    return payload;
  }
  return;
};

export const listBlockChildren = async (
  args: ListBlockChildrenParameters
): Promise<ListBlockChildrenResponseResults> => {
  const { payload, error } = await callAPIWithBackOff<
    ListBlockChildrenParameters,
    ListBlockChildrenResponse
  >(notion.blocks.children.list, args);

  if (!error) {
    if (payload.next_cursor) {
      const nextResults = await listBlockChildren({
        ...args,
        start_cursor: payload.next_cursor,
      });
      payload.results = [...payload.results, ...nextResults];
    }

    return payload.results;
  }
  return [];
};

export const fetchBlock = async (
  blockId: string
): Promise<BlockObject | null> => {
  const block = await retrieveBlock({ block_id: blockId });
  if (block) {
    const blockComponent = convertResponseToBlock(block);
    return blockComponent;
  }
  return null;
};

export const fetchBlocks = async (blockId: string): Promise<BlockObject[]> => {
  const childrenBlockResponses = await listBlockChildren({
    block_id: blockId,
  });
  const childrenBlockComponents = await resolveBlockChildren(
    childrenBlockResponses
  );
  return childrenBlockComponents;
};

export const resolveBlockChildren = async (
  blocks: ListBlockChildrenResponseResults
): Promise<Array<BlockObject>> => {
  const blockObjectComponents = await Promise.all(
    blocks.map(async (child_block) => await convertResponseToBlock(child_block))
  );
  const nonNullBlockObjectComponents =
    blockObjectComponents.filter(notNullNorUndefined);
  return wrapListItems(nonNullBlockObjectComponents);
};

export const wrapListItems = (
  blocks: Array<BlockObject>
): Array<BlockObject> => {
  return blocks.reduce(
    (
      prevList: Array<BlockObject>,
      currBlock: BlockObject
    ): Array<BlockObject> => {
      /* If the block.type is neither
       * 'bulleted_list_item' nor 'numbered_list_item' nor 'bulleted_list' nor 'numbered_list',
       * return the block as it is.
       */
      if (
        currBlock.type !== "bulleted_list" &&
        currBlock.type !== "numbered_list" &&
        currBlock.type !== "bulleted_list_item" &&
        currBlock.type !== "numbered_list_item"
      ) {
        return [...prevList, currBlock];
      }
      const prevBlock = prevList[prevList.length - 1];

      // For the first time,
      // create a list object and add list_item to the list.
      const id = generateUUID();
      if (
        // bulleted_list_item
        currBlock.type === "bulleted_list_item" &&
        prevBlock?.type !== "bulleted_list"
      ) {
        const bulletedList = {
          id,
          type: "bulleted_list",
          bulleted_list: { items: [currBlock] },
        } satisfies BulletedListBlockObject;
        return [...prevList, bulletedList];
      }
      if (
        // numbered_list_item
        currBlock.type === "numbered_list_item" &&
        prevBlock?.type !== "numbered_list"
      ) {
        const numberedList = {
          id,
          type: "numbered_list",
          numbered_list: { items: [currBlock] },
        } satisfies NumberedListBlockObject;
        return [...prevList, numberedList];
      }

      // Intermediate,
      // add the second and subsequent list items to the previous list.
      if (
        // bulleted_list
        currBlock.type === "bulleted_list_item" &&
        prevBlock?.type === "bulleted_list"
      ) {
        prevBlock.bulleted_list.items = [
          ...prevBlock.bulleted_list.items,
          currBlock,
        ];
      }
      if (
        // numbered_list_item
        currBlock.type === "numbered_list_item" &&
        prevBlock?.type === "numbered_list"
      ) {
        prevBlock.numbered_list.items = [
          ...prevBlock.numbered_list.items,
          currBlock,
        ];
      }

      // If the condition is not met, do not display/render.
      return prevList;
    },
    []
  );
};

export const convertResponseToBlock = async (
  block: BlockObjectResponse | PartialBlockObjectResponse
): Promise<BlockObject | null> => {
  if (!isFullBlock(block)) {
    return null;
  }
  switch (block.type) {
    case "audio": {
      return await convertAudioResponseToBlock(block);
    }
    case "bookmark": {
      return await convertBookmarkResponseToBlock(block);
    }
    case "breadcrumb": {
      return await convertBreadcrumbResponseToBlock(block);
    }
    case "bulleted_list_item": {
      return await convertBulletedListItemResponseToBlock(block);
    }
    case "callout": {
      return await convertCalloutResponseToBlock(block);
    }
    case "child_database": {
      return await convertChildDatabaseResponseToBlock(block);
    }
    case "child_page": {
      return await convertChildPageResponseToBlock(block);
    }
    case "code": {
      return await convertCodeResponseToBlock(block);
    }
    case "column": {
      return await convertColumnResponseToBlock(block);
    }
    case "column_list": {
      return await convertColumnListResponseToBlock(block);
    }
    case "divider": {
      return await convertDividerResponseToBlock(block);
    }
    case "embed": {
      return await convertEmbedResponseToBlock(block);
    }
    case "equation": {
      return await convertEquationResponseToBlock(block);
    }
    case "file": {
      return await convertFileResponseToBlock(block);
    }
    case "heading_1": {
      return await convertHeading1ResponseToBlock(block);
    }
    case "heading_2": {
      return await convertHeading2ResponseToBlock(block);
    }
    case "heading_3": {
      return await convertHeading3ResponseToBlock(block);
    }
    case "image": {
      return await convertImageResponseToBlock(block);
    }
    case "link_preview": {
      return await convertLinkPreviewResponseToBlock(block);
    }
    case "link_to_page": {
      return await convertLinkToPageResponseToBlock(block);
    }
    case "numbered_list_item": {
      return await convertNumberedListItemResponseToBlock(block);
    }
    case "paragraph": {
      return await convertParagraphResponseToBlock(block);
    }
    case "pdf": {
      return await convertPdfResponseToBlock(block);
    }
    case "quote": {
      return await convertQuoteResponseToBlock(block);
    }
    case "synced_block": {
      return await convertSyncedBlockResponseToBlock(block);
    }
    case "table": {
      return await convertTableResponseToBlock(block);
    }
    case "table_of_contents": {
      return await convertTableOfContentsResponseToBlock(block);
    }
    case "table_row": {
      return await convertTableRowResponseToBlock(block);
    }
    case "template": {
      return await convertTemplateResponseToBlock(block);
    }
    case "to_do": {
      return await convertToDoResponseToBlock(block);
    }
    case "toggle": {
      return await convertToggleResponseToBlock(block);
    }
    case "unsupported": {
      return await convertUnsupportedResponseToBlock(block);
    }
    case "video": {
      return await convertVideoResponseToBlock(block);
    }
    default: {
      return null;
    }
  }
};
