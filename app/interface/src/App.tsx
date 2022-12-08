import { useState } from "react";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import { Routes, Route } from "react-router-dom";
import Builder from "./pages/Builder";
import Templates from "./pages/Templates";
import Learning from "./pages/Learning";
import MockCases from "./pages/MockCases";
import Labs from "./pages/Labs";
import Assignments from "./pages/Assignments";
import Start from "./pages/Start";

function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  return (
    <div
      className={`min-h-screen w-full pb-2 scrollbar scrollbar-track-sky-500 ${
        darkMode
          ? " dark bg-slate-900 text-slate-200"
          : " bg-slate-100 text-slate-900"
      }`}
    >
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/builder" element={<Builder />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/learning" element={<Learning />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/mockcases" element={<MockCases />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/start" element={<Start />} />
      </Routes>
    </div>
  );
}

export default App;
