import { Equation } from "./Equation.js";
import EquationObject from "./Equation.json";

import type { Meta, StoryObj } from "@storybook/react";
import type { EquationBlockObject } from "src/libs/notion/blocks/equation.js";

const meta: Meta<typeof Equation> = {
  title: "Blocks/Equation",
  component: Equation,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Equation>;

export const Default: Story = {
  args: {
    block: EquationObject as EquationBlockObject,
  },
};
