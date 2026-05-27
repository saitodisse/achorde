import type { Meta } from "@storybook/react-vite";
import { Tab } from "../../Tab";
import { withTabStoryFrame } from "../story-decorators";
import {
  defaultStylingArgs,
  stylingFieldArgTypes,
  type StylingStoryArgs,
} from "./styling-argtypes";
import { tuaFlorBody } from "../story-tua-flor";

export const stylingMetaBase = {
  component: Tab,
  decorators: [withTabStoryFrame],
  parameters: { layout: "padded" as const },
  argTypes: {
    body: { control: false },
    ...stylingFieldArgTypes,
  },
  args: {
    ...defaultStylingArgs,
    body: tuaFlorBody,
  },
} satisfies Omit<Meta<StylingStoryArgs>, "title">;

export type StylingMeta = Meta<StylingStoryArgs>;
