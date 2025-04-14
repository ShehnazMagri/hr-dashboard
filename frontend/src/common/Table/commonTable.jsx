import React from "react";

const CommonTable = ({ columns, data,onStatusChange,statusOptions,toggleDropdown, dropdownOpen, dropdownOptions,onDropdownAction }) => {
  console.log(data,'data')
  console.log(columns,'columns')
  if (!data || data.length === 0) {
    return <div className="nodata">No candidates found</div>;
  }
  return (
    <table className="custom-table">
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} 
            // style={index === 0 ? { borderTopLeftRadius: "8px" } : index === columns.length - 1 ? { borderTopRightRadius: "8px" } : {}}
            style={{
                backgroundColor: "#4D007D",
                color: "#fff",
                padding: "12px",
                textAlign: "left",
                border: "none",
                ...(index === 0 ? { borderTopLeftRadius: "8px" } : {}),
                ...(index === columns.length - 1 ? { borderTopRightRadius: "8px" } : {}),
              }}
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => {
          {/* debugger */}
          return(
          <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? "#fff" : "#f9f9f9" }}>
            {columns?.map((column, colIndex) => (
              <td key={colIndex} 
              style={{ padding: "8px",
              border: "none", 
                  verticalAlign: "middle",
              // borderColor: "#ddd" 
              }}
              >
                {column === "Profile" ? (
                  <img
                    src={`https://i.pravatar.cc/40?img=${rowIndex + 1}`}
                    alt="profile"
                    className="profile-img"
                  />
                )
                : column === "Status" ? (
                  <select
                    value={row.status || "New"}
                    onChange={(e) => onStatusChange(rowIndex, e.target.value)}
                    style={{
                      borderRadius: "15px",
                      padding: "6px",
                      borderColor: "#ccc",
                      backgroundColor: "#fff",
                      width: "60%",
                    }}
                  >
                    {statusOptions?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : column === "Action" ? (
                  <div className="action-cell" style={{ position: "relative" }}>
                    <button
                      onClick={() => toggleDropdown(rowIndex)}
                      style={{
                        color: "#6B7280",
                        textDecoration: "none",
                        boxShadow: "none",
                        padding: "0",
                        fontSize: "20px",
                        lineHeight: "0",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      ⋮
                    </button>
                    {dropdownOpen === rowIndex && (
                      <div
                        style={{
                          minWidth: "160px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "8px",
                          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.05)",
                          position: "absolute",
                          right: 0,
                          zIndex: 1000,
                          backgroundColor: "#fff",
                        }}
                      >
                        {dropdownOptions?.map((option, idx) => (
                          <div
                            key={idx}
                            style={{
                              fontSize: "14px",
                              padding: "8px 16px",
                              color: option.color || "#4F46E5",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              // console.log(`${option.label} clicked for row ${rowIndex}`);
                              onDropdownAction(rowIndex, option.label);
                              toggleDropdown(null); // Close dropdown after clicking
                            }}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  row[column.toLowerCase().replace(/ /g, "")] || rowIndex + 1 || <></>
                )}
              </td>
            ))}
          </tr>
        )
      }
        )}
      </tbody>
    </table>
  );
};

export default CommonTable;


