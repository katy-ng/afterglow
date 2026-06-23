import "./App.css";
//import { useState } from "react";
import { HashRouter, Routes, Route, Link } from "react-router-dom";
import { StickerEditor } from "./components/stickers/StickerEditor";
import { SignUpPage } from "./components/SignUpPage";

function App() {
  // Control the page that the window is displaying

  return (
    <HashRouter>
      <div className="app">
          {/*header here to navigate between webpages*/}
          <header className="header">
            <div>afterglow</div>
            <nav>
              <Link to="/" className="header-button">Sign Up</Link>
              <Link to="/sticker-editor" className="header-button">Stickers</Link>
            </nav>
          </header>

          <div className="below-header">
            <Routes>
              <Route path="/" element={<SignUpPage/>} />
              <Route path="/sticker-editor" element={<StickerEditor/>} />
            </Routes>
          </div>
        </div>
    </HashRouter>
  );
}

export default App;