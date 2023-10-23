import type { TemplateBlockObject } from "../../../types/notion.js";
import type { TemplateBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";

export const convertTemplateResponseToBlock = async (
  block: TemplateBlockObjectResponse
) => {
  return { ...block } satisfies TemplateBlockObject;
};
