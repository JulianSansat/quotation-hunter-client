import React from "react";
import Layout from "./components/Layout/Layout";
import Main from "./components/Main/Main";
import "./App.scss";

function App() {
  return (
    <div className="App">
      <Layout>
        <Main />
      </Layout>
    </div>
  );
}

export default App;
