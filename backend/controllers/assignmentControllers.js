const { Assignment, AssignmentSubmission } = require('../model/assignmentModel');
const { Student } = require('../model/userModel');
const { Course } = require('../model/courseModel');

// @desc    Get student's assignments
// @route   GET /api/assignments/student/:id
// @access  Private/Student
const getStudentAssignments = async (req, res) => {
  try {
    const studentId = req.params.id;
    
    const student = await Student.findByPk(studentId, {
      include: [{
        model: Course,
        include: [{
          model: Assignment,
          include: [{
            model: AssignmentSubmission,
            where: { studentId },
            required: false
          }]
        }]
      }]
    });

    if (!student) {
      res.status(404);
      throw new Error('Student not found');
    }

    const assignments = student.Courses.flatMap(course => 
      course.Assignments.map(assignment => ({
        id: assignment.id,
        title: assignment.title,
        courseId: course.id,
        dueDate: assignment.dueDate,
        status: getAssignmentStatus(assignment.AssignmentSubmissions[0])
      }))
    );

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to determine assignment status
const getAssignmentStatus = (submission) => {
  if (!submission) return 'pending';
  return submission.grade ? 'graded' : 'submitted';
};

module.exports = {
  getStudentAssignments
};