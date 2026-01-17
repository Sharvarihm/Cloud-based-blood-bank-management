import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Donors from "./pages/Donors";
import Requests from "./pages/Requests";
import ViewStock from "./pages/ViewStock";  

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/viewstock" element={<ViewStock />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
