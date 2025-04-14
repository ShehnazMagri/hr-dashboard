import React, { useState, useEffect } from "react";
import { DropdownButton, Dropdown, Form } from "react-bootstrap";
import CommonTable from "../../common/Table/commonTable";
import { getCandidates, searchCandidatesByName } from "../../context/contextapi";
import { toast } from "react-toastify";

const Attendence = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("All");
  const [allAttendees, setAllAttendees] = useState([]);
  const [attendeesData, setAttendeesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noDataFound, setNoDataFound] = useState(false);
  const [error, setError] = useState(null);

  // Fetch candidates from API
  useEffect(() => {
    const fetchAttendees = async () => {
      try {
        setLoading(true);
        const response = await getCandidates();
        console.log("Attendance API response", response);

        const transformedData = response.data.map((candidate) => ({
          profile: candidate.profile || null,
          employeename: candidate.fullName || "N/A",
          // emailaddress: candidate.email || "N/A",
          // phonenumber: candidate.phone || "N/A",
          position: candidate.position || "N/A",
          task: candidate.task || "N/A",
          status: candidate.status || "present",
          _id: candidate._id || null,
        }));

        setAllAttendees(transformedData);
        // Filter for "present" status
        const filteredData = transformedData.filter(
          (attendee) => attendee.status.toLowerCase() === "present"
        );
        setAttendeesData(filteredData);
        setNoDataFound(filteredData.length === 0);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch attendance data");
        setLoading(false);
        setNoDataFound(true);
        toast.error("Failed to fetch attendance data");
      }
    };

    fetchAttendees();
  }, []);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  // Handle search
  const handleSearch = async (e) => {
    const query = e.target.value.toLowerCase();
    setSearchTerm(query);
    try {
      setLoading(true);
      let filteredData = allAttendees.filter(
        (attendee) => attendee.status.toLowerCase() === "present"
      );

      if (selectedPosition !== "All") {
        filteredData = filteredData.filter(
          (attendee) => attendee.position === selectedPosition
        );
      }

      if (query.trim() !== "") {
        const response = await searchCandidatesByName(query);
        if (response.success) {
          filteredData = response.data
            .map((candidate) => ({
              profile: candidate.profile || null,
              employeeName: candidate.fullName || "N/A",
              position: candidate.position || "N/A",
              department: candidate.department || "N/A",
              task: candidate.task || "N/A",
              status: candidate.status || "N/A",
              _id: candidate._id || null,
            }))
            .filter(
              (attendee) =>
                attendee.status.toLowerCase() === "present" &&
                (selectedPosition === "All" ||
                  attendee.position === selectedPosition)
            );
        } else {
          filteredData = [];
        }
      }

      setAttendeesData(filteredData);
      setNoDataFound(filteredData.length === 0);
      setLoading(false);
    } catch (err) {
      setAttendeesData([]);
      setNoDataFound(true);
      setLoading(false);
      toast.error("Failed to search attendees");
    }
  };

  // Handle position filter
  const handlePositionFilter = (position) => {
    setSelectedPosition(position);
    setLoading(true);
    let filteredData = allAttendees.filter(
      (attendee) => attendee.status.toLowerCase() === "present"
    );

    if (position !== "All") {
      filteredData = filteredData.filter(
        (attendee) => attendee.position === position
      );
    }

    if (searchTerm.trim() !== "") {
      filteredData = filteredData.filter((attendee) =>
        attendee.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setAttendeesData(filteredData);
    setNoDataFound(filteredData.length === 0);
    setLoading(false);
  };

  const columns = [
    "Profile",
    "Employee Name",
    "Position",
    "Task",
    "Status",
    "Action",
  ];
  // Handle status change
  const handleStatusChange = (index, newStatus) => {
    setAttendeesData((prevData) => {
      const updatedData = [...prevData];
      updatedData[index] = {
        ...updatedData[index],
        status: newStatus,
      };
      return updatedData;
    });
  };

  const statusOptions = ["Present", "Absent", "Medical Leave", "Work From Home"];

  const dropdownOptions = [
    { label: "Edit", color: "black" },
    { label: "Delete", color: "black" },
  ];

  // Placeholder for dropdown actions (Edit/Delete)
  const handleDropdownAction = (index, action) => {
    const attendee = attendeesData[index];
    console.log("Dropdown action:", action, "for attendee:", attendee);
    // Implement Edit/Delete logic here if needed
    setDropdownOpen(null);
  };

  return (
    <div className="employee-container">
      <h2>Attendances</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          borderRadius: "15px",
        }}
      >
        <DropdownButton
          id="dropdown-basic-button"
          title={selectedPosition === "All" ? "Position" : selectedPosition}
          className="mb-3"
          variant="light"
          style={{
            backgroundColor: "white",
            color: "#111827",
          }}
        >
          <Dropdown.Item onClick={() => handlePositionFilter("All")}>
            All
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handlePositionFilter("Intern")}>
            Intern
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handlePositionFilter("Full Time")}>
            Full Time
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handlePositionFilter("Senior")}>
            Senior
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handlePositionFilter("Junior")}>
            Junior
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handlePositionFilter("Team Lead")}>
            Team Lead
          </Dropdown.Item>
        </DropdownButton>

        <Form.Control
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            borderRadius: "15px",
            padding: "8px 15px",
            width: "200px",
            border: "1px solid #ced4da",
            marginRight: "7px",
          }}
        />
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <CommonTable
          columns={columns}
          data={attendeesData.map((attendee, index) => ({
            ...attendee,
            Profile: <span>Profile Icon</span>, // Placeholder; adjust as needed
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
          statusOptions={statusOptions}
          onStatusChange={handleStatusChange}
          dropdownOptions={dropdownOptions}
          onDropdownAction={handleDropdownAction}
        />
      )}
    </div>
  );
};

export default Attendence;