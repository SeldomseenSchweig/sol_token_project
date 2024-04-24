import React from "react";
import MintToken from "./MintToken";
import "./App.css";
import MintNft from "./MintNft";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <MintToken />
        <MintNft />
      </header>
    </div>
  );
}

export default App;
