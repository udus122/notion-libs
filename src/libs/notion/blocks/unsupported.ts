import type { UnsupportedBlockObject } from "../../../types/notion.js";
import type { UnsupportedBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";

export const convertUnsupportedResponseToBlock = async (
  block: UnsupportedBlockObjectResponse
) => {
  return { ...block } satisfies UnsupportedBlockObject;
};
