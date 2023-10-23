import { generateUUID } from "../../utils.js";

import type { TextRichTextItemResponse } from "@notionhq/client/build/src/api-endpoints.js";

export const convertTextRichTextItemResponse = async (
  response: TextRichTextItemResponse
) => {
  return {
    ...response,
    id: generateUUID(),
  };
};
