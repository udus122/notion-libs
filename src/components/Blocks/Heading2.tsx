import { RichText } from "../RichText/RichText.js";

import { Blocks } from "./Blocks.js";

import type { Heading2BlockObject } from "../../libs/notion/blocks/heading2.js";
import type { BlockProps } from "../../types/utils.js";

type Props = BlockProps<Heading2BlockObject>;

export const Heading2: React.FC<Props> = ({ block }) => {
  return (
    <>
      {block.heading_2.is_toggleable ? (
        <details
          id={block.id}
          className={`notion_heading notion_heading_2 notion_toggle notion_color_${block.heading_2.color}`}
        >
          <summary className="notion_toggle_summary">
            <h2>
              <RichText richText={block.heading_2.rich_text} />
            </h2>
          </summary>
          <div className="notion_toggle_details">
            {block.heading_2.children && (
              <Blocks blocks={block.heading_2.children} />
            )}
          </div>
        </details>
      ) : (
        <h1
          id={block.id}
          className={`notion_heading notion_heading_2 notion_color_${block.heading_2.color}`}
        >
          <RichText richText={block.heading_2.rich_text} />
        </h1>
      )}
    </>
  );
};
