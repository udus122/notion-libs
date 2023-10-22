import { Divider } from "./Divider.js";
import DividerObject from "./Divider.json";

import type { Meta, StoryObj } from "@storybook/react";
import type { DividerBlockObject } from "src/libs/notion/blocks/divider.js";

const meta: Meta<typeof Divider> = {
  title: "Blocks/Divider",
  component: Divider,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Default: Story = {
  args: {
    block: DividerObject as DividerBlockObject,
  },
};
