import { BrowserRouter, Routes, Route } from "react-router-dom";
import Projects from "./pages/projects/Projects";
import Tasks from "./pages/tasks/Tasks";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/:id" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
