

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./pages/Register";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar/Sidebar";
import CandidatesPage from "./components/Dashboard/Candidates";
import Employee from "./components/Dashboard/Employees";
import Attendence from "./components/Dashboard/Attendances";
import Leaves from "./components/Dashboard/Leaves";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/";

  return (
    <>
      {!isAuthPage ? (
        <div style={{ display: 'flex', height: '100vh' }}>
          <Sidebar />
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            <Routes>
              <Route path="/dashboard" element={<div><h2>Dashboard</h2><p>Welcome to the dashboard.</p></div>} />
              <Route path="/candidates" element={<CandidatesPage />} />
              <Route path="/employees" element={<Employee />} />
              <Route path="/attendences" element={<Attendence />} />
              <Route path="/leaves" element={<Leaves />} />
              
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
    <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;









// import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Register from "./pages/Register";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Sidebar from "./components/Sidebar/Sidebar";
// import CandidatesPage from "./components/Dashboard/Candidates";

// function App() {
//   return (
//     <BrowserRouter>
//       {/* <Routes>
//         <Route path="/" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={<Sidebar />} />
//         <Route path="/candidates" element={<CandidatesPage />} />
//       </Routes> */}
//       <div style={{ display: 'flex', height: '100vh' }}>
//         <Sidebar />
//         <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
//           <Routes>
//             <Route path="/" element={<Register />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/dashboard" element={<div><h2>Dashboard</h2><p>Welcome to the dashboard.</p></div>} />
//             <Route path="/candidates" element={<CandidatesPage />} />
//             {/* Add more routes for other sections if needed */}
//             {/* Catch-all for 404 */}
//             <Route path="*" element={<div>404 - Page Not Found</div>} />
//           </Routes>
//         </div>
//       </div>
//     </BrowserRouter>
//   );
// }

// export default App;
