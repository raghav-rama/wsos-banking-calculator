import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

function App() {
  return (
    <div className="App">
      <div>
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 1rem",
            backgroundColor: "#0d0d0e",
            boxShadow: "5px 5px 5px 5px rgba(255, 255, 255, 0.4)",
          }}
        >
          <h1
            style={{
              flexGrow: 1,
              fontSize: 30,
              fontWeight: 700,
              textAlign: "left",
              color: "whitesmoke",
            }}
          >
            Solana
          </h1>
          <WalletMultiButton />
        </nav>
      </div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>The one and only blockchain you'll ever need!</p>
        <a
          className="App-link"
          href="https://Solana.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Fuck Yeah!
        </a>
      </header>
    </div>
  );
}

export default App;
