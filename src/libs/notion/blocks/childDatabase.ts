import { fetchDatabase } from "../databases.js";

import type { ChildDatabaseBlockObject } from "../../../types/notion.js";
import type { ChildDatabaseBlockObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";

export const convertChildDatabaseResponseToBlock = async (
  block: ChildDatabaseBlockObjectResponse
) => {
  const childDatabase = await fetchDatabase(block.id);
  if (childDatabase) {
    return {
      ...block,
      child_database: {
        ...block.child_database,
        database: childDatabase ?? null,
      },
    } satisfies ChildDatabaseBlockObject;
  }
  return {
    ...block,
    child_database: {
      ...block.child_database,
    },
  } satisfies ChildDatabaseBlockObject;
};
