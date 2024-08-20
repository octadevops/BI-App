import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PrivateRoute from "./context/PrivateRoute";
import { useEffect, useState } from "react";
import Layout from "./shared/Layout";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import DLiveStock from "./stacks/DLiveStock";
import DLiveSales from "./stacks/DLiveSales";
import DAnalyzer from "./stacks/DAnalyzer";
import Reports from "./pages/Reports";
import DFootfall from "./stacks/DFootfall";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="/dashboard/livestock" element={<DLiveStock />} />
            <Route path="/dashboard/sales" element={<DLiveSales />} />
            <Route path="/dashboard/analyzer" element={<DAnalyzer />} />
            <Route path="/dashboard/footfall" element={<DFootfall />} />
            <Route path="/reports" element={<Reports />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
        {isLoggedIn && <Footer />}
      </Router>
    </>
  );
}

export default App;
