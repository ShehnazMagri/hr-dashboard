import React, { useState } from "react";
import { Nav, Navbar, Form, FormControl } from "react-bootstrap";
import {
  FaUsers,
  FaUserClock,
  FaSignOutAlt,
  FaSearch,
  FaUsersCog,
  FaEllipsisH,
} from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie"; 
import { Modal, Button } from "react-bootstrap"
import CustomModal from "../../common/Modal/modal";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  // Function to determine if the link is active
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const handleLogout = () => {
    // Remove token from cookies
    Cookies.remove("token"); // Replace "token" with your actual cookie name
    // Redirect to login page
    navigate("/login");
    setShowLogout(false);
  };

  return (
    <Navbar
      className="sidebar"
      expand="lg"
      style={{
        minHeight: "100%",
        backgroundColor: "#fff",
        borderRight: "1px solid #eee",
      }}
    >
      <Nav className="flex-column">
        <Navbar.Brand href="/candidates" className="logo">
          <div
            style={{
              backgroundColor: "#4D007D",
              color: "#fff",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            <span style={{ marginRight: "5px" }}>□</span> LOGO
          </div>
        </Navbar.Brand>
        <Form inline className="search-bar">
          <FaSearch className="search-icon" />
          <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        </Form>
        <Link
          to="#"
          className="itm"
        >
          Recruitment
        </Link>
        <Link
          to="/candidates"
          className={`nav-link ${isActive("/candidates")}`}
        >
          {/* <FaUsers /> Candidates */}
          <FaUsers style={{ marginRight: "8px" }} />
         <span>Candidates</span>
        </Link>
        <Link
          to="#"
           className="itm"
        >
          Organization
        </Link>
        <Link
          to="/employees"
          className={`nav-link ${isActive("/dashboard/employees")}`}
          style={{ display: "inline-flex", alignItems: "center", gap: "1px" }}
        >
          {/* <FaUsersCog /> Employees */}
          <FaUsersCog style={{ marginRight: "8px" }} />
  <span>Employees</span>
        </Link>
        <Link
          to="/attendences"
          className={`nav-link ${isActive("/dashboard/attendance")}`}
        >
          {/* <FaUserClock /> Attendance */}
          <FaUserClock style={{ marginRight: "8px" }} />
          <span>Attendance</span>
        </Link>
        <Link
          to="#"
          className={`nav-link ${isActive("/dashboard/leaves")}`}
        >
          <FaEllipsisH style={{ marginRight: "8px" }} />
          <span>Leaves</span>
        </Link>
        <Link
          to="/dashboard/others"
           className="itm"
        >
          Others
        </Link>
        <Link
          to="#"
          className={`nav-link logout ${isActive("/dashboard/logout")}`}
          onClick={(e) => {
            e.preventDefault();
            setShowLogout(true);
          }}
        >
          <FaSignOutAlt style={{ marginRight: "8px" }} />
          <span>Logout</span>
        </Link>
      </Nav>

      <CustomModal
        isOpen={showLogout}
        onRequestClose={() => setShowLogout(false)}
        title="Log Out"
      >
        <div
          style={{
            padding: "20px",
            textAlign: "center",
            fontSize: "20px",
            color: "#333",
          }}
        >
          Are you sure you want to log out?
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "10px",
            borderBottomLeftRadius: "19px",
            borderBottomRightRadius: "19px",
            backgroundColor: "#fff",
          }}
        >
          <button
            onClick={() => setShowLogout(false)}
            style={{
              backgroundColor: "#4D007D",
              borderColor: "#4D007D",
              borderRadius: "20px",
              padding: "8px 20px",
              marginRight: "10px",
              color: "white",
              border: "none",
              cursor: "pointer",
              height: "40px",
              width: "200px",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#DC3545",
              borderColor: "#DC3545",
              borderRadius: "20px",
              padding: "5px 20px",
              color: "white",
              border: "none",
              cursor: "pointer",
              height: "40px",
              width: "200px",
            }}
          >
            Logout
          </button>
        </div>
      </CustomModal>

      
    </Navbar>
  );
};

export default Sidebar;
