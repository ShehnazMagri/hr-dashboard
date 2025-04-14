import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import {
  DropdownButton,
  Dropdown,
  Form,
} from "react-bootstrap";
import CommonTable from "../../common/Table/commonTable";
import {
  deleteCandidate,
  updateCandidate,
  getCandidates,
  searchCandidatesByName,
} from "../../context/contextapi";
import { toast } from "react-toastify";
import CustomModal from "../../common/Modal/modal";

const Employee = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allEmployees, setAllEmployees] = useState([]);
  const [employeesData, setEmployeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noDataFound, setNoDataFound] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    department: "",
    dateOfjoining: "",
    status: "selected",
  });
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState("All");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await getCandidates();
        console.log("employee response", response);
        // const transformedData = response.data.map((employee) => ({
        //   profile: employee.profile || null, // Handle profile image if available
        //   employeename: employee.fullName || "N/A",
        //   emailaddress: employee.emailAddress || employee.email || "N/A",
        //   phonenumber: employee.phoneNumber || employee.phone || "N/A",
        //   position: employee.position || "N/A",
        //   department: employee.department || "N/A",
        //   dateOfjoining: employee.dateOfjoining || "N/A", // Add if API provides, else "N/A"
        //   status: employee.status
        //     ? employee.status.charAt(0).toUpperCase() + employee.status.slice(1)
        //     : "N/A",
        //   experience: employee.experience || "N/A",
        //   _id: employee._id || null,
        // }));

        const transformedData = response.data.map((candidate, index) => ({
          profile: candidate.profile || null,
          employeename: candidate.fullName || "N/A",
          emailaddress: candidate.email || "N/A",
          phonenumber: candidate.phone || "N/A",
          position: candidate.position || "N/A",
          department: candidate.department || "N/A",
          dateOfjoining: candidate.dateOfjoining || "N/A",
          status: candidate.status || "selected",
          _id: candidate._id || null,
        }));
        // setEmployeesData(transformedData);
        // console.log(transformedData, "Transformed Employees");
        // setAllEmployees(transformedData);
        // setEmployeesData(transformedData);
        // setNoDataFound(transformedData.length === 0);
        // setLoading(false);
        setAllEmployees(transformedData);
        // Filter to show only "selected" status by default
        const filteredData = transformedData.filter(
          (employee) => employee.status === "selected"
        );
        setEmployeesData(filteredData);
        setNoDataFound(filteredData.length === 0);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch employees");
        setLoading(false);
        setNoDataFound(true);
      }
    };

    fetchEmployees();
  }, []);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleSearch = async (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
    try {
      setLoading(true);
      let filteredData = allEmployees;
      filteredData = filteredData.filter(
        (employee) => employee.status === "selected"
      );
      if (selectedPosition !== "All") {
        filteredData = filteredData.filter(
          (employee) => employee.position === selectedPosition
        );
      }
      if (query.trim() !== "") {
        const response = await searchCandidatesByName(query);
        if (response.success) {
          filteredData = response.data
            .map((candidate) => ({
              profile: candidate.profile || null,
              employeename: candidate.fullName || "N/A",
              emailaddress: candidate.email || "N/A",
              phonenumber: candidate.phone || "N/A",
              position: candidate.position || "N/A",
              department: candidate.department || "N/A",
              dateOfjoining: candidate.dateOfjoining || "N/A",
              status: candidate.status || "selected",
              _id: candidate._id || null,
            }))
            .filter(
              (employee) =>
                employee.status === "selected" && 
                (selectedPosition === "All" ||
                  employee.position === selectedPosition) 
            );
        } else {
          filteredData = [];
        }
      }

      setEmployeesData(filteredData);
      setNoDataFound(filteredData.length === 0);
    } catch (err) {
      setEmployeesData([]);
      setNoDataFound(true);
      // toast.error("Failed to search employees");
    } finally {
      setLoading(false);
    }
  };

  const handlePositionFilter = (position) => {
    setSelectedPosition(position);
    setLoading(true);
    let filteredData = allEmployees.filter(
      (employee) => employee.status === "selected" // Only show "selected" status
    );
    if (position !== "All") {
      filteredData = filteredData.filter(
        (employee) => employee.position === position
      );
    }
    if (searchTerm.trim() !== "") {
      filteredData = filteredData.filter((employee) =>
        employee.employeename.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setEmployeesData(filteredData);
    setNoDataFound(filteredData.length === 0);
    setLoading(false);
  };

  // New functionality: Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedPosition("All");
    const filteredData = allEmployees.filter(
      (employee) => employee.status === "selected"
    );
    setEmployeesData(filteredData);
    setNoDataFound(filteredData.length === 0);
  };

  const handleDropdownAction = async (index, action) => {
    const employee = employeesData[index];
    console.log("Dropdown action:", action, "for employee:", employee);
    if (action === "Delete") {
      if (
        window.confirm(
          `Are you sure you want to delete ${employee.employeeName}?`
        )
      ) {
        try {
          setLoading(true);
          console.log("Deleting employee with ID:", employee._id);
          const response = await deleteCandidate(employee._id);
          if (response.success) {
            toast.success(response.data.msg);
            setEmployeesData(employeesData.filter((_, i) => i !== index));
            setAllEmployees(
              allEmployees.filter((emp) => emp._id !== employee._id)
            );
            setNoDataFound(employeesData.length === 1);
          } else {
            toast.error(response.error);
          }
        } catch (err) {
          toast.error("Failed to delete employee");
        } finally {
          setLoading(false);
        }
      }
    } else if (action === "Edit") {
      setSelectedEmployee(employee);
      setFormData({
        // fullName: employee.employeeName,
        // email: employee.emailAddress,
        // phone: employee.phoneNumber,
        // position: employee.position,
        // department: employee.department,
        // dateOfjoining:employee.dateOfjoining,
        fullName: employee.employeename || "",
        email: employee.emailaddress || "",
        phone: employee.phonenumber || "",
        position: employee.position || "",
        department: employee.department || "",
        dateOfjoining: employee.dateOfjoining || "",
        // experience: employee.experience,
        // resume: null,
      });
      setShowEditModal(true);
    }
    //  else if (action === "Download Resume") {
    //   try {
    //     const response = await downloadResume(employee._id);
    //     if (response.success) {
    //       toast.success("Resume downloaded successfully");
    //     } else {
    //       toast.error(response.error);
    //     }
    //   } catch (err) {
    //     toast.error("Failed to download resume");
    //   }
    // }
    setDropdownOpen(null);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") {
      setFormData((prev) => ({ ...prev, resume: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("position", formData.position);
    formDataToSend.append("department", formData.department);
    formDataToSend.append("dateOfjoining", formData.dateOfjoining);
    // if (formData.resume) {
    //   formDataToSend.append("resume", formData.resume);
    // }
    try {
      const response = await updateCandidate(
        selectedEmployee._id,
        formDataToSend
      );
      if (response.success) {
        const updatedEmployee = {
          ...selectedEmployee,
          employeeName: response.data.candidate.fullName,
          emailAddress: response.data.candidate.email,
          phoneNumber: response.data.candidate.phone,
          position: response.data.candidate.position,
          experience: response.data.candidate.experience,
          department: response.data.candidate.department,
          dateOfjoining: response.data.candidate.dateOfjoining,
          // status:
          //   response.data.candidate.status.charAt(0).toUpperCase() +
          //   response.data.candidate.status.slice(1),
        };
        setEmployeesData((prev) =>
          prev.map((emp) =>
            emp._id === selectedEmployee._id ? updatedEmployee : emp
          )
        );
        setAllEmployees((prev) =>
          prev.map((emp) =>
            emp._id === selectedEmployee._id ? updatedEmployee : emp
          )
        );
        toast.success("Employee updated successfully");
        setShowEditModal(false);
      } else {
        setFormError(response.error);
        toast.error(response.error);
      }
    } catch (err) {
      setFormError("Failed to update employee");
      toast.error("Failed to update employee");
    }
  };

  const columns = [
    "Profile",
    "Employee Name",
    "Email Address",
    "Phone Number",
    "Position",
    "Department",
    "Date of Joining",
    "Action",
  ];

  const dropdownOptions = [
    { label: "Edit", color: "black" },
    { label: "Delete", color: "black" },
  ];

  return (
    <div className="employee-container">
      <h2>Employees</h2>
      <Row
        className="mb-3 align-items-center"
        style={{ justifyContent: "space-between" }}
      >
        <Col
          md={4}
          style={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}
        >
          <Form.Control
            as="select"
            value={selectedPosition}
            onChange={(e) => handlePositionFilter(e.target.value)}
            className="mr-2"
            style={{
              width: "40%",
              borderRadius: "15px",
              padding: "6px",
              borderColor: "#ccc",
            }}
          >
            <option value="All">Position</option>
            <option value="Intern">Intern</option>
            <option value="Full Time">Full Time</option>
            <option value="Senior">Senior</option>
            <option value="Junior">Junior</option>
            <option value="Team Lead">Team Lead</option>
          </Form.Control>
        </Col>
        <Col
          md={6}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            alignItems: "center",
            width: "500px",
          }}
        >
          <Form.Control
            type="text"
            placeholder="Search "
            value={searchTerm}
            onChange={handleSearch}
            className="mr-2"
            style={{
              borderRadius: "15px",
              padding: "6px 12px",
              borderColor: "#ccc",
              paddingLeft: "35px",
              width: "45%",
            }}
          />
        </Col>
      </Row>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <CommonTable
          columns={columns}
          data={employeesData.map((employee, index) => ({
            ...employee,
            Profile: <span>Profile Icon</span>,
            Action: (
              <DropdownButton
                id={`dropdown-${index}`}
                title="Actions"
                onToggle={() => toggleDropdown(index)}
                show={dropdownOpen === index}
              >
                {dropdownOptions.map((option, i) => (
                  <Dropdown.Item
                    key={i}
                    style={{ color: option.color }}
                    onClick={() => handleDropdownAction(index, option.label)}
                  >
                    {option.label}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            ),
          }))}
          toggleDropdown={toggleDropdown}
          dropdownOpen={dropdownOpen}
          dropdownOptions={dropdownOptions}
          onDropdownAction={handleDropdownAction}
        />
      )}

      {/* Edit Employee Modal */}
      <CustomModal
        isOpen={showEditModal}
        onRequestClose={() => setShowEditModal(false)}
        title="Edit Employee Details"
        style={{
          content: {
            padding: "0",
            borderRadius: "15px",
            maxWidth: "600px",
            margin: "auto",
            position: "relative",
          },
        }}
      >
        <div style={{ padding: "18px", position: "relative" }}>
          <form onSubmit={handleUpdateEmployee} className="employee-form">
            <div style={{ display: "flex", gap: "20px", marginBottom: "5px" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  required
                  placeholder="Full Name *"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #D1D5DB",
                    backgroundColor: "#FFFFFF",
                    fontSize: "14px",
                    color: "#111827",
                  }}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                  placeholder="Email Address *"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #D1D5DB",
                    backgroundColor: "#FFFFFF",
                    fontSize: "14px",
                    color: "#111827",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", marginBottom: "5px" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                  placeholder="Phone Number *"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #D1D5DB",
                    backgroundColor: "#FFFFFF",
                    fontSize: "14px",
                    color: "#111827",
                  }}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleFormChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #D1D5DB",
                    backgroundColor: "#FFFFFF",
                    fontSize: "14px",
                    color: formData.position ? "#111827" : "#6B7280",
                    appearance: "auto",
                  }}
                >
                  <option value="" disabled>
                    Select Position *
                  </option>
                  <option value="Intern">Intern</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Senior">Senior</option>
                  <option value="Junior">Junior</option>
                  <option value="Team Lead">Team Lead</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "20px", marginBottom: "5px" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleFormChange}
                  required
                  placeholder="Department *"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #D1D5DB",
                    backgroundColor: "#FFFFFF",
                    fontSize: "14px",
                    color: "#111827",
                  }}
                />
              </div>

              <div className="form-group" style={{ flex: 1 }}>
                <input
                  type="date"
                  name="dateOfjoining"
                  value={formData.dateOfjoining}
                  onChange={handleFormChange}
                  required
                  placeholder="dateOfJoining *"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #D1D5DB",
                    backgroundColor: "#FFFFFF",
                    fontSize: "14px",
                    color: "#111827",
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              style={{
                width: "20%",
                backgroundColor: "#4D007D",
                border: "none",
                color: "#fff",
                borderRadius: "15px",
                padding: "12px",
                fontSize: "16px",
                fontWeight: "500",
                cursor: "pointer",
                display: "block",
                margin: "15px auto 0",
              }}
            >
              Save
            </button>
          </form>
        </div>
      </CustomModal>
    </div>
  );
};

export default Employee;
