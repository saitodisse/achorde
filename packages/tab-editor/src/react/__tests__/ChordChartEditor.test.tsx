import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChordChartEditor } from "../ChordChartEditor";

describe("ChordChartEditor", () => {
  it("renders textarea fallback, diagnostics, and change callbacks", () => {
    const onChange = vi.fn();

    render(
      <ChordChartEditor
        value={"C        G\nCidade acordou\n"}
        originalValue={"C        G\nCidade acordou\n"}
        title="Cidade acordou"
        sourceKey="C"
        editorEngine="textarea"
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getByLabelText("Editor"), {
      target: { value: "E|--0--\n" },
    });

    expect(onChange).toHaveBeenCalledWith("E|--0--\n");
    expect(screen.getByText("No diagnostics.")).toBeTruthy();
    expect(screen.getByText("Chords found: 2")).toBeTruthy();
  });

  it("sends save payload derived from the current text", () => {
    const onSave = vi.fn();

    render(
      <ChordChartEditor
        value={"E|--0--\n"}
        originalValue={"C\n"}
        editorEngine="textarea"
        onChange={() => undefined}
        onSave={onSave}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        value: "E|--0--\n",
        hasChanges: true,
        isValid: false,
        status: "invalid",
      }),
    );
  });
});
