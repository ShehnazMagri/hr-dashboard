import React from "react";
import Modal from "react-modal";

// Bind modal to your app's root element (required for accessibility)
Modal.setAppElement("#root");

const CustomModal = ({ isOpen, onRequestClose, title, children }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      shouldCloseOnOverlayClick={false} // Prevents closing on overlay click
      shouldCloseOnEsc={false}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "19px",
          padding: "0", // Remove padding from content as we'll handle it internally
          width: "90%",
          maxWidth: "900px",
          maxHeight: "90vh", // Limit height to viewport height
          border: "none",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          overflow: "hidden", // Hide overflow from the entire modal
        },
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      }}
      contentLabel={title}
    >
      <div
        className="modal-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h5 className="modal-title" style={{ margin: 341 }}>{title}</h5>
  <button onClick={onRequestClose} className="close" style={{
            background: "none",
            border: "none",
            fontSize: "24px",
            color: "#fff",
            cursor: "pointer",
            padding: "0",
            lineHeight: 1,
            marginRight: "45px",
          }}>X</button>
        
      </div>
      <div className="modal-content-wrapper">
        <div className="modal-body">{children}</div>
      </div>
    </Modal>
  );
};

export default CustomModal;
