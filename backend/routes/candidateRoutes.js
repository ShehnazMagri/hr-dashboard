const express = require('express');
const router = express.Router();
const { createCandidate, downloadResume, updateCandidate, getCandidates, searchCandidatesByName, getCandidatesByHR, deleteCandidate } = require('../controllers/candidateController');
const authMiddleware = require('../middleware/auth');

// Assume HR role check
const isHR = (req, res, next) => {
  if (req.user && req.user.role === 'HR') {
    next();
  } else {
    res.status(403).json({ msg: 'Access denied. HR role required' });
  }
};

router.post('/candidates', authMiddleware,createCandidate);
router.get('/candidates/resume/:id', authMiddleware,  downloadResume);
router.put('/update-candidates/:id', authMiddleware,  updateCandidate);
router.get('/get-candidates', authMiddleware,  getCandidates);
router.get('/search-candidates', authMiddleware, searchCandidatesByName);
router.delete("/delete-candidate/:id", authMiddleware, deleteCandidate);
router.get('/my-candidates', authMiddleware, getCandidatesByHR);

module.exports = router;