import React, { useState } from "react";
import { DropdownButton, Dropdown, Form } from "react-bootstrap";
import CommonTable from "../../common/Table/commonTable";

const Leaves = () => {
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Add your search filtering logic here
  };

  const columns = [
    "Profile",
    " Name",
    "Date",
    "Reason",
    "Status",
    "Docs",
  ];

  const employees = [
    {
      employeeName: "Jane Cooper",
      emailAddress: "jane.cooper@example.com",
      phoneNumber: "(704) 555-0127",
      position: "Intern",
      department: "Designer",
      dateofjoining: "10/06/13",
    },
    {
      employeeName: "Arlene McCoy",
      emailAddress: "arlene.mccoy@example.com",
      phoneNumber: "(302) 555-0107",
      position: "Full Time",
      department: "Designer",
      dateofjoining: "11/07/16",
    },
    {
      employeeName: "Cody Fisher",
      emailAddress: "deanna.curtis@example.com",
      phoneNumber: "(252) 555-0126",
      position: "Senior",
      department: "Backend Development",
      dateofjoining: "08/15/17",
    },
    {
      employeeName: "Janney Wilson",
      emailAddress: "janney.wilson@example.com",
      phoneNumber: "(252) 555-0126",
      position: "Junior",
      department: "Backend Development",
      dateofjoining: "12/04/17",
    },
    {
      employeeName: "Leslie Alexander",
      emailAddress: "willie.jennings@example.com",
      phoneNumber: "(207) 555-0119",
      position: "Team Lead",
      department: "Human Resource",
      dateofjoining: "05/30/14",
    },
  ];

  const dropdownOptions = [
    { label: "Edit", color: "black" },
    { label: "Delete", color: "black" },
  ];

  return (
    <div className="employee-container">
      <h2>Leaves</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          borderRadius:"15px"
        }}
      >
        <DropdownButton
          id="dropdown-basic-button"
          title="Status"
          className="mb-3"
          variant="light"
          style={{
            backgroundColor: "white",
            color: "#111827",
          }}
        >
          <Dropdown.Item href="#/action-1">All</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Intern</Dropdown.Item>
          <Dropdown.Item href="#/action-3">Full Time</Dropdown.Item>
          <Dropdown.Item href="#/action-4">Senior</Dropdown.Item>
          <Dropdown.Item href="#/action-5">Junior</Dropdown.Item>
          <Dropdown.Item href="#/action-6">Team Lead</Dropdown.Item>
        </DropdownButton>

        <Form.Control
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            borderRadius: "15px",
            padding: "8px 15px",
            width: "200px",
            border: "1px solid #ced4da",
            display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
          flexWrap: "wrap",
          marginRight:"7px"
          }}
        />
      </div>

      <CommonTable
        columns={columns}
        data={employees}
        toggleDropdown={toggleDropdown}
        dropdownOpen={dropdownOpen}
        dropdownOptions={dropdownOptions}
      />
    </div>
  );
};

export default Leaves;
