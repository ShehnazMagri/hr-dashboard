const Candidate = require("../models/Candidate");
const upload = require("../middleware/multer"); // Import multer configuration
const path = require('path');
const fs = require('fs');



exports.createCandidate = [
  upload.single("resume"), // Multer middleware for resume upload
  async (req, res) => {
    const { fullName, email, phone, position, experience } = req.body;

    // Validation checks
    if (!fullName || fullName.trim() === "") {
      return res.status(400).json({ msg: "Full name is required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ msg: "Please include a valid email" });
    }
    if (!phone || phone.trim() === "") {
      return res.status(400).json({ msg: "Phone number is required" });
    }
    if (!position || position.trim() === "") {
      return res.status(400).json({ msg: "Position is required" });
    }
    if (!experience || experience.trim() === "") {
      return res.status(400).json({ msg: "Experience is required" });
    }
    if (!req.file) {
      return res.status(400).json({ msg: "Resume is required" });
    }
    //   if (declaration !== "true" && declaration !== "false") {
    //     return res.status(400).json({ msg: "Declaration confirmation is required" });
    //   }

    try {
      const existingCandidate = await Candidate.findOne({ email });
      if (existingCandidate) {
        return res
          .status(400)
          .json({ msg: "Candidate with this email already exists" });
      }

      // Create new candidate with userId from authenticated user
      const candidate = new Candidate({
        fullName,
        email,
        phone,
        position,
        experience,
        resume: req.file.filename,
        //   declaration: declaration === "true",
        userId: req.user.user.id, // Changed from req.user._id to req.user.user.id
      });

      await candidate.save();
      res
        .status(201)
        .json({ msg: "Candidate created successfully", candidate });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  },
];


exports.updateCandidate = [
  upload.single("resume"), // Use the same multer instance for resume upload
  async (req, res) => {
    const { id } = req.params;
    const { fullName, email, phone, position, dateOfjoining, department,status } = req.body;

    try {
      // Find the candidate by ID
      const candidate = await Candidate.findById(id);
      if (!candidate) {
        return res.status(404).json({ msg: "Candidate not found" });
      }

      // Check for duplicate email (exclude current candidate) only if email is provided
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ msg: "Please include a valid email" });
        }
        const existingCandidate = await Candidate.findOne({
          email,
          _id: { $ne: id },
        });
        if (existingCandidate) {
          return res
            .status(400)
            .json({ msg: "Candidate with this email already exists" });
        }
        candidate.email = email;
      }

      // Update only the fields that are provided
      if (fullName) candidate.fullName = fullName;
      if (phone) candidate.phone = phone;
      if (position) candidate.position = position;
      if (dateOfjoining) candidate.dateOfjoining = new Date(dateOfjoining);
      if (department) candidate.department = department;
      if (status) candidate.status = status;
      if (req.file) candidate.resume = req.file.filename;

      // Update the timestamp if any changes are made
      if (fullName || email || phone || position || dateOfjoining ||status || department || req.file) {
        candidate.updatedAt = Date.now();
      }

      await candidate.save();

      res.json({ msg: "Candidate profile updated successfully", candidate });
    } catch (err) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  },
];
exports.getCandidates = async (req, res) => {
  const { search, status } = req.query;
  try {
    let query = {};
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
      ];
    }
    if (status) {
      query.status = status;
    }
    const candidates = await Candidate.find(query);
    // res.json({ candidates });
    // Map candidates to include S.No
    const candidatesWithSerial = candidates.map((candidate, index) => ({
      srNo: String(index + 1).padStart(2, "0"), // Formats as 01, 02, etc.
      ...candidate._doc, // Spread the candidate document
    }));
    res.json({ candidates: candidatesWithSerial });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.deleteCandidate = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the candidate by ID
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ msg: "Candidate not found" });
    }
    // Optional: Check if the user is authorized to delete this candidate
    //   if (candidate.userId.toString() !== req.user.user.id) {
    //     return res.status(403).json({ msg: "Not authorized to delete this candidate" });
    //   }

    // Delete the candidate from the database
    await Candidate.findByIdAndDelete(id);

    res.json({ msg: "Candidate deleted successfully", success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.downloadResume = async (req, res) => {
  const { id } = req.params;
  try {
    const candidate = await Candidate.findById(id);
    if (!candidate) {
      return res.status(404).json({ msg: "Candidate not found" });
    }
    const resumePath = path.join(
      __dirname,
      "../Public/resumes",
      candidate.resume
    );
    if (fs.existsSync(resumePath)) {
      res.download(resumePath, candidate.resume, (err) => {
        if (err)
          res
            .status(500)
            .json({ msg: "Error downloading resume", error: err.message });
      });
    } else {
      res.status(404).json({ msg: "Resume file not found" });
    }
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

exports.getCandidatesByHR = async (req, res) => {
  try {
    const candidates = await Candidate.find({ userId: req.user.user.id });
    if (!candidates || candidates.length === 0) {
      return res.status(404).json({ msg: "No candidates found for this HR" });
    }
    res
      .status(200)
      .json({ msg: "Candidates retrieved successfully", candidates });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// New API to search candidates by name
exports.searchCandidatesByName = async (req, res) => {
  const { name } = req.query;
  try {
    if (!name || name.trim() === "") {
      return res.status(400).json({ msg: "Name is required for search" });
    }
    const candidates = await Candidate.find({
      fullName: { $regex: name, $options: "i" },
    });
    if (candidates.length === 0) {
      return res
        .status(404)
        .json({ msg: "No candidates found with the given name" });
    }
    res.json({ candidates });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
