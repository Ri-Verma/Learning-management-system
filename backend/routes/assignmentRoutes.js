const express = require('express');
const router = express.Router();
const { getStudentAssignments } = require('../controllers/assignmentControllers');

router.get('/student/:id', getStudentAssignments);

module.exports = router;