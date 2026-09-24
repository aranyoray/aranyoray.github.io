import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./style.css";
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="fatal">
        <p className="eyebrow">BUTTERFLY / RECOVERY</p>
        <h1>The dispatch was interrupted.</h1>
        <p>
          Your last saved turn is still in this browser. Reload to continue.
        </p>
        <button className="primary" onClick={() => location.reload()}>
          Reload the game
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
