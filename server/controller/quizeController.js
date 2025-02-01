const Course = require("../models/Course");
const Quize = require("../models/Quize");




// Helper function for error handling
const handleError = (res, error, defaultMessage) => {
    if (error.name === 'ValidationError') {
        const errorMessages = {};
        for (let field in error.errors) {
            errorMessages[field] = error.errors[field].message;
        }
        return res.status(400).json({
            message: 'Validation failed',
            errors: errorMessages
        });
    }

    console.error(`Error: ${defaultMessage}`, error);
    res.status(500).json({
        message: defaultMessage,
        error: 'An unexpected error occurred'
    });
};

// Create a quize for a course
exports.createQuize = async (req, res) => {
    try {
        const { courseId } = req.params
        const quizeData = req.body
        if (!courseId.trim() || !quizeData || Object.keys(quizeData).length === 0) {
            return res.status(400).json({
                msg: 'Both courseId and quizeData are required, and quizeData must not be empty'
            });
        }
        const course = await Course.findById(courseId.trim())
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        quizeData.courseId = courseId.trim()
        const newQuize = new Quize(quizeData)
        const validationError = newQuize.validateSync();
        if (validationError) {
            const errorMessages = {};
            for (let field in validationError.errors) {
                errorMessages[field] = validationError.errors[field].message;
            }
            return res.status(400).json({ message: "Validation failed", errors: errorMessages });
        }

        const savedQuiz = await newQuize.save();
        res.status(201).json({
            message: 'Quiz created successfully',
            quiz: savedQuiz
        });
    }
    catch (error) {
        handleError(res, error, 'Failed to create quiz');
    }
}

// GET /api/courses/:courseId/quizzes – Retrieve all quizzes for a course
exports.RetrieveallQuizes = async (req, res) => {
    try {
        const { coursesId } = req.params;
        if (!coursesId.trim()) {
            return res.status(404).json({ message: 'courseId required' });
        }
        const quizzes = await Quize.find({ courseId: coursesId.trim() })
        if (!quizzes){
            return res.status(404).json({ message: 'Quizzes not found' });
        }
        res.status(200).json({ mag: "fetched", quizzes })
    }
    catch (error) {
        handleError(res, error, 'Failed to retrieve quizzes');
    }
}

// GET /api/quizzes/:id – Retrieve a specific quize
exports.RetriveSpecific = async (req, res) => {
    try {
        let { id } = req.params
        if (!id.trim()) {
            return res.status(404).json({ message: 'id required' });
        }
        const quiz = await Quize.findById(id.trim());
        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json(quiz);
    }
    catch (error) {
        handleError(res, error, 'Failed to retrieve quiz');
    }
}

// PUT /api/quizzes/:id – Update a quiz

exports.updateQuize = async (req, res) => {
    try {
        let { id } = req.params
        let quizData = req.body
        if (!id.trim() || !quizData || Object.keys(quizData).length === 0) {
            return res.status(400).json({ message: 'id and quizData are required' });
        }
        const updateQuiz = await Quize.findByIdAndUpdate(id.trim(), quizData, { new: true, runValidators: true })
        if (!updateQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json({ message: 'Quiz updated successfully', quiz: updateQuiz });
    }
    catch (error) {
        handleError(res, error, 'Failed to update quiz');
    }
}

// DELETE /api/quizzes/:id – Delete a quiz
exports.deleteQuize = async (req, res) => {
    try {
        let { id } = req.params
        if (!id.trim()) {
            return res.status(400).json({ message: 'id is required' });
        }
        const deletedQuiz = await Quize.findByIdAndDelete(id.trim());
        if (!deletedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        res.status(200).json({ message: 'Quiz deleted successfully', quiz: deletedQuiz });
    }
    catch (error) {
        handleError(res, error, 'Failed to delete quiz');
    }
}

//submit quiz and give result
exports.submitQuiz = async (req, res) => {
    try {
        const { id } = req.params
        const { answer } = req.body

        if (!answer || typeof answer !== 'object' || Object.keys(answer).length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Answers must be provided as a valid object with questionId: answer pairs.',
            });
        }
        const quiz = await Quize.findById(id.trim())
        if (!quiz) {
            return res.status(400).json({
                status: 'error',
                message: 'Quiz not found',
            })
        }
        let score = 0;
        const evaluatedQuestions = quiz.questions.map((questions) => {
            const userAnswer = answer[questions._id];
            const isCorrect =
                userAnswer?.toString().trim().toLowerCase() === questions.correctAnswer.toString().trim().toLowerCase();
            if (isCorrect) {
                score += 1;
            }

            return {
                questionId: questions._id,
                question: questions.question,
                correctAnswer: questions.correctAnswer,
                userAnswer: userAnswer || null,
                isCorrect,
            };
        })
        const nonAttemptedQuestionsDetails = evaluatedQuestions
        .filter((q) => q.userAnswer === null)
        .map((q) => ({
          questionId: q.questionId,
          question: q.question,
          correctAnswer: q.correctAnswer,
        }));
  
      res.status(200).json({
        status: 'success',
        message: 'Quiz submitted successfully',
        data: {
          score,
          totalQuestions: quiz.questions.length,
          nonAttemptedQuestions: nonAttemptedQuestionsDetails.length, 
          nonAttemptedQuestionsDetails, 
          evaluatedQuestions,
        },
      });
    }
    catch (error) {
        handleError(res, error, 'Failed to submit quiz');
    }
}