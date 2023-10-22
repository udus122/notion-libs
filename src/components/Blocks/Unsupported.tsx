import type { BlockObject } from "src/libs/notion/blocks/blocks.js";
import type { BlockProps } from "src/types/utils.js";

type Props = BlockProps<BlockObject>;

export const Unsupported: React.FC<Props> = ({ block }) => {
  console.warn(`${block.type} is not supported`);
  return null;
};
