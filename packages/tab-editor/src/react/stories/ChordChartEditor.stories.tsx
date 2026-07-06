import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChordChartEditor } from "../ChordChartEditor";

const demoChart = `[Intro]
C        G
Pulso da cidade

[Verse]
Am       F
Noite acesa no sinal
C        G
A gente aprende a respirar
`;

const meta = {
  title: "tab-editor/ChordChartEditor",
  component: ChordChartEditor,
  parameters: {
    layout: "fullscreen",
  },
  args: {
    originalValue: demoChart,
    title: "Pulso da cidade",
    sourceKey: "C",
  },
} satisfies Meta<typeof ChordChartEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

function StatefulEditor(args: Story["args"]) {
  const [value, setValue] = useState(demoChart);

  return (
    <div style={{ padding: 24 }}>
      <ChordChartEditor
        {...args}
        value={value}
        onChange={setValue}
        onSave={(payload) => console.log("save payload", payload)}
      />
    </div>
  );
}

export const MonacoLazy: Story = {
  name: "Monaco lazy",
  render: (args) => <StatefulEditor {...args} editorEngine="monaco-lazy" />,
};

export const TextareaFallback: Story = {
  name: "Textarea fallback",
  render: (args) => <StatefulEditor {...args} editorEngine="textarea" />,
};
