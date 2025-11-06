import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Teams from "./pages/Teams";
import Problems from "./pages/Problems";
import Notify from "./pages/Notify";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/notify" element={<Notify/>}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
