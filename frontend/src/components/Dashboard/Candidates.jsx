import React, { useState, useEffect } from "react";
import { Button, Dropdown, Form, Row, Col } from "react-bootstrap";
import CustomModal from "../../common/Modal/modal";
import CommonTable from "../../common/Table/commonTable";
import { FaUpload } from "react-icons/fa6";
import {
  getCandidates,
  createCandidate,
  deleteCandidate,
  downloadResume,
  searchCandidatesByName,
  updateCandidate
} from "../../context/contextapi";
import { toast } from "react-toastify";

const CandidatesPage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [fileName, setFileName] = useState("Resume *");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allCandidates, setAllCandidates] = useState([]);
  const [candidatesData, setCandidatesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [noDataFound, setNoDataFound] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("All"); 
  const [selectedStatus, setSelectedStatus] = useState("New");

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    resume: null,
    
    // declaration: false,
  });

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        const response = await getCandidates();
        console.log("candidate response", response);

        // Transform API data to match table's expected format
        const transformedData = response.data.map((candidate, index) => {
          debugger;
          return {
            srNo: candidate.srNo,
            candidatesname: candidate.fullName,
            emailaddress: candidate.email,
            phonenumber: candidate.phone,
            position: candidate.position,
            // status:
            //   candidate.status.charAt(0).toUpperCase() +
            //   candidate.status.slice(1),
            status:
            candidate.status
              ? candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)
              : "New",
            experience: candidate.experience,
            _id: candidate._id,
          };
        });
        console.log(transformedData, "9999999999999");
        setAllCandidates(transformedData);

        // setCandidatesData(transformedData);
        // setLoading(false);
        // Filter to show only "New" status by default
        const filteredData = transformedData.filter(
          (candidate) => candidate.status.toLowerCase() === "new"
        );
        setCandidatesData(filteredData);
        setNoDataFound(filteredData.length === 0);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch candidates");
        setLoading(false);
        setNoDataFound(true);
      }
    };

    fetchCandidates();
  }, []);

  // Handle search input change and API call
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      // Use stored candidates instead of fetching again
      setCandidatesData(allCandidates);
      return;
    }
    try {
      setLoading(true);
      const response = await searchCandidatesByName(query);
      if (response.success) {
        const transformedData = response.data.map((candidate, index) => ({
          srNo: candidate.srNo || index + 1,
          candidatesname: candidate.fullName,
          emailaddress: candidate.email,
          phonenumber: candidate.phone,
          position: candidate.position,
          status:
            candidate.status.charAt(0).toUpperCase() +
            candidate.status.slice(1),
          experience: candidate.experience,
          _id: candidate._id,
        }));
        setCandidatesData(transformedData); // Set data, even if empty
      } else {
        // toast.error(response.error);
        setCandidatesData([]);
      }
      setLoading(false);
    } catch (err) {
      toast.error("Failed to search candidates");
      setCandidatesData([]);
      setLoading(false);
    }
  };
 

  const handlePositionFilter = (position) => {
    setSelectedPosition(position);
    setLoading(true);
    let filteredData = allCandidates;
    if (selectedStatus !== "All") {
      filteredData = filteredData.filter(
        (candidate) => candidate.status.toLowerCase() === selectedStatus.toLowerCase()
      );
    }
    if (position !== "All") {
      filteredData = filteredData.filter(
        (candidate) => candidate.position === position
      );
    }
    if (searchQuery.trim() !== "") {
      filteredData = filteredData.filter((candidate) =>
        candidate.candidatesname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setCandidatesData(filteredData);
    setNoDataFound(filteredData.length === 0);
    setLoading(false);
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    setLoading(true);
    let filteredData = allCandidates;
    if (status !== "All") {
      filteredData = filteredData.filter(
        (candidate) => candidate.status.toLowerCase() === status.toLowerCase()
      );
    }
    if (selectedPosition !== "All") {
      filteredData = filteredData.filter(
        (candidate) => candidate.position === selectedPosition
      );
    }
    if (searchQuery.trim() !== "") {
      filteredData = filteredData.filter((candidate) =>
        candidate.candidatesname.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setCandidatesData(filteredData);
    setNoDataFound(filteredData.length === 0);
    setLoading(false);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedPosition("All");
    setSelectedStatus("All");
    setCandidatesData(allCandidates);
    setNoDataFound(allCandidates.length === 0);
  };

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

 

  // Function to handle adding a new candidate
  const handleAddCandidate = () => {
    setIsModalOpen(true);
    setFormError(null); // Reset form error when opening modal
    setFileName("Resume *"); // Reset file name
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      resume: null,
      // declaration: false,
    });
  };

  // Function to handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData((prev) => ({ ...prev, resume: files[0] }));
      setFileName(files[0]?.name || "Resume *");
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, declaration: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    // Static error messages
    const errors = {
      fullName: "Full name is required",
      email: "Please include a valid email",
      phone: "Phone number is required",
      position: "Position is required",
      experience: "Experience is required",
      resume: "Resume is required",
      declaration: "Please Select the declaration",
      existingEmail: "Candidate with this email already exists",
      server: "Server error",
    };

    // Client-side validation
    if (!formData.fullName.trim()) {
      setFormError(errors.fullName);
      toast.error(errors.fullName);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      setFormError(errors.email);
      toast.error(errors.email);
      return;
    }
    if (!formData.phone.trim()) {
      setFormError(errors.phone);
      toast.error(errors.phone);
      return;
    }
    if (!formData.position.trim()) {
      setFormError(errors.position);
      toast.error(errors.position);
      return;
    }
    if (!formData.experience.trim()) {
      setFormError(errors.experience);
      toast.error(errors.experience);
      return;
    }
    if (!formData.resume) {
      setFormError(errors.resume);
      toast.error(errors.resume);
      return;
    }
    if (!formData.declaration) {
      setFormError(errors.declaration);
      toast.error(errors.declaration);
      return;
    }

    // Create FormData object (no declaration field sent to API)
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("position", formData.position);
    data.append("experience", formData.experience);
    data.append("resume", formData.resume);

    try {
      const response = await createCandidate(data);
      if (response.success) {
        toast.success(response.data.msg);
        // Fetch updated candidates list
        const candidatesResponse = await getCandidates();
        const transformedData = candidatesResponse.data.map(
          (candidate, index) => ({
            srNo: candidate.srNo || index + 1,
            candidatesname: candidate.fullName,
            emailaddress: candidate.email,
            phonenumber: candidate.phone,
            position: candidate.position,
            status:
              candidate.status.charAt(0).toUpperCase() +
              candidate.status.slice(1),
            experience: candidate.experience,
          })
        );
        setCandidatesData(transformedData);
        setIsModalOpen(false);
      } else {
        toast.error(response.error);
      }
    } catch (err) {
      // Handle API errors statically
      const errorMsg =
        err.response?.data?.msg === errors.existingEmail
          ? errors.existingEmail
          : errors.server;
      setFormError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // Handle dropdown option click
  const handleDropdownAction = async (index, action) => {
    const candidate = candidatesData[index];
    console.log("Dropdown action:", action, "for candidate:", candidate);
    if (action === "Delete Candidate") {
      if (
        window.confirm(
          `Are you sure you want to delete ${candidate.candidatesname}?`
        )
      ) {
        try {
          setLoading(true);
          console.log("Deleting candidate with ID:", candidate._id);
          const response = await deleteCandidate(candidate._id);
          if (response.success) {
            toast.success(response.data.msg);
            // Remove the deleted candidate from state
            setCandidatesData(candidatesData.filter((_, i) => i !== index));
          } else {
            toast.error(response.error);
          }
        } catch (err) {
          toast.error("Failed to delete candidate");
        } finally {
          setLoading(false);
        }
      }
    } else if (action === "Download Resume") {
      try {
        const response = await downloadResume(candidate._id);
        console.log("Download resume for", response);
        if (response.success) {
          toast.success("Resume downloaded successfully");
        } else {
          toast.error(response.error);
        }
      } catch (err) {
        toast.error("Failed to download resume");
      }
    }
    setDropdownOpen(null);
  };

  //  Handle status change and API call
  const handleStatusChange = async (index, newStatus) => {
    const candidate = candidatesData[index];
    const candidateData = { status: newStatus.toLowerCase() };
    try {
      setLoading(true);
      const response = await updateCandidate(candidate._id, candidateData);
      if (response.success) {
        const updatedCandidates = [...candidatesData];
        updatedCandidates[index].status = newStatus;
        setCandidatesData(updatedCandidates);
        toast.success("Status updated successfully");
      } else {
        toast.error(response.error);
      }
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    "Sr no",
    "Candidates Name",
    "Email Address",
    "Phone Number",
    "Position",
    "Status",
    "Experience",
    "Action",
  ];

  const statusOptions = ["New", "Scheduled", "Ongoing", "Selected", "Rejected"];
  
  const dropdownOptions = [
    { label: "Download Resume", color: "black" },
    { label: "Delete Candidate", color: "black" },
  ];

  return (
    <div
      className="content-area"
      style={{ padding: "20px", backgroundColor: "#fff" }}
    >
      <h2 style={{ color: "#333", marginBottom: "20px" }}>Candidates</h2>
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
            value={selectedStatus}
            onChange={(e) => handleStatusFilter(e.target.value)}
            className="mr-2"
            style={{
              width: "45%",
              borderRadius: "15px",
              padding: "6px",
              borderColor: "#ccc",
            }}
          >
           <option value="New">Status</option>
            {/* <option value="New">New</option> */}
            <option value="Scheduled">Scheduled</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </Form.Control>
          <Form.Control
            as="select"
            value={selectedPosition}
            onChange={(e) => handlePositionFilter(e.target.value)}
            className="mr-2"
            style={{
              width: "45%",
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
          }}
        >
          <Form.Control
            type="text"
            placeholder="Search by name"
            value={searchQuery}
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
          <Button
            onClick={handleAddCandidate}
            style={{
              width: "35%",
              backgroundColor: "#4D007D",
              borderColor: "#6e2594",
              color: "#fff",
              borderRadius: "15px",
              padding: "6px 12px",
            }}
          >
            Add Candidate
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <CommonTable
          columns={columns}
          // data={candidatesData}
          data={candidatesData.filter(
            (candidate) => candidate.status.toLowerCase() === "new"
          )}
          onStatusChange={handleStatusChange}
          statusOptions={statusOptions}
          toggleDropdown={toggleDropdown}
          dropdownOpen={dropdownOpen}
          dropdownOptions={dropdownOptions}
          onDropdownAction={handleDropdownAction}
        />
      )}

      <CustomModal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        title="Add New Candidate"
        style={{
          content: {
            padding: "0",
            borderRadius: "15px",
            maxWidth: "200px",
            margin: "auto",
            position: "relative",
          },
        }}
      >
        <div style={{ padding: "18px", position: "relative" }}>
          <form onSubmit={handleSubmit} className="candidate-form">
            <div style={{ display: "flex", gap: "20px", marginBottom: "5px" }}>
              <div className="form-group" style={{ flex: 1 }}>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                  onChange={handleInputChange}
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
                {/* <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  placeholder="Position *"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #D1D5DB",
                    backgroundColor: "#FFFFFF",
                    fontSize: "14px",
                    color: "#111827",
                  }} */}
                {/* /> */}
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #D1D5DB",
                    backgroundColor: "#FFFFFF",
                    fontSize: "14px",
                    color: formData.position ? "#111827" : "#6B7280",
                    appearance: "auto", // Ensures native dropdown arrow
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
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                  placeholder="Experience *"
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
              <div
                className="form-group"
                style={{ flex: 1, position: "relative" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #D1D5DB",
                    backgroundColor: "#FFFFFF",
                    cursor: "pointer",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      color: fileName === "Resume *" ? "#6B7280" : "#111827",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: "80%",
                    }}
                  >
                    {fileName}
                  </span>
                  <span
                    style={{
                      fontSize: "16px",
                      color: "#9CA3AF",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <FaUpload />
                  </span>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  name="resume"
                  onChange={handleInputChange}
                  required
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>

            <div
              className="declaration-checkbox"
              style={{ marginBottom: "15px" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start" }}>
                <input
                  type="checkbox"
                  id="declaration"
                  name="declaration"
                  checked={formData.declaration}
                  onChange={handleInputChange}
                  style={{
                    marginRight: "10px",
                    marginTop: "3px",
                    accentColor: "#6e2594",
                  }}
                />
                <label
                  htmlFor="declaration"
                  style={{
                    color: "#374151",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                >
                  I hereby declare that the above information is true to the
                  best of my knowledge and belief
                </label>
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
                margin: "0 auto",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </CustomModal>

    </div>
  );
};

export default CandidatesPage;

