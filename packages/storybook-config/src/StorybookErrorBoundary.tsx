import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  layer: string;
  children: ReactNode;
};

type State = {
  error: Error | null;
};

export class StorybookErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[${this.props.layer}/story-render]`, {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            margin: "1rem",
            padding: "1rem",
            border: "2px solid #b23a48",
            borderRadius: "8px",
            fontFamily: "monospace",
            fontSize: "0.85rem",
            whiteSpace: "pre-wrap",
          }}
        >
          <strong>[{this.props.layer}] Story render error</strong>
          {"\n\n"}
          {this.state.error.message}
          {"\n\n"}
          {this.state.error.stack}
        </div>
      );
    }

    return this.props.children;
  }
}
