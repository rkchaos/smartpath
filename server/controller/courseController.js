const Course = require("../models/Course");


// dynamic error handler function
const handleError = (res, error, defaultMessage) => {
    if (error.name === 'ValidationError') {
        const errorMessage = {};
        for (let field in error.errors) {
            errorMessage[field] = error.errors[field].message
        }
        return res.status(400).json({ message: "Valid failed", errors: errorMessage })
    }
    console.error(`Error:${defaultMessage}`, error)
    res.status(500).json({ message: defaultMessage, error: 'An unexpected error occured' })
}

// create a new course
exports.createCourse = async (req, res) => {
    try {
        const couseData = req.body;
        if (!couseData || Object.keys(couseData).length === 0) {
            return res.status(400).json({ msg: "courseData is required" })
        }
        const newCourse = new Course(couseData)

        const validationError = newCourse.validateSync();
        if (validationError) {
            const errorMessage = {};
            for (let field in validationError.errors) {
                errorMessage[field] = validationError.errors[field].message;
            }
            return res.status(400).json({ message: "Validation failed", errors: errorMessage })

        }
        const savedCourse = await newCourse.save();
        res.status(201).json({
            message: 'Course created successfully',
            course: savedCourse
        });

    }

    catch (error) {
        handleError(res, error, 'Failed to create course');
    }
}


// Get all courses
exports.getAllcourses = async (req, res) => {
    try {
        const courses = await Course.find();

        if (!courses || courses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No courses found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Courses retrieved successfully',
            data: courses,
        });
    } catch (error) {
        handleError(res, error, 'Failed to retrieve courses');
    }
};

// GET a specific course by ID
exports.retriveSpecificCourse = async (req, res) => {
    try {
        let { id } = req.params
        if (!id.trim()) {
            return res.status(400).json({ msg: "id is required" })
        }
        const course = await Course.findById(id.trim());
        if (!course || Object.keys(course).length === 0) {
            return res.status(400).json({ msg: "Course not found" })
        }
        res.status(200).json(course)

    }
    catch (error) {
        handleError(res, error, 'Failed to retrieve course by id ');
    }
}

// PUT (update) a course
exports.updateCourses = async (req, res) => {
    try {
        let { id } = req.params
        const courseUpdated = req.body

        if (!id.trim() || !courseUpdated || Object.keys(courseUpdated).length === 0) {
            return res.status(400).json({ msg: "id and courseUpdate require" })
        }
        if (courseUpdated.createdAt) {
            courseUpdated.createdAt = new Date(courseUpdated.createdAt);
        }
        if (courseUpdated.updatedAt) {
            courseUpdated.updatedAt = new Date(courseUpdated.updatedAt);
        }
        const existingCourse = await Course.findById(id.trim());
        if (!existingCourse) {
            return res.status(400).json({ message: "Course not found" });
        }
        const updateCourses = await Course.findByIdAndUpdate(id.trim(), courseUpdated, { new: true, runValidators: true })
        if (!updateCourses) {
            return res.status(400).json({ message: "Course not found" })
        }
        if (!updateCourses) {
            return res.status(400).json({ message: "Course not found" })
        }
        res.status(200).json({ message: 'Course updated successfully', course: updateCourses })
    }
    catch (error) {
        handleError(res, error, 'Failed to update course');
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        let { id } = req.params
        if (!id.trim()) {
            return res.status(400).json({ msg: "id require" })
        }
        const deleteCourse = await Course.findByIdAndDelete(id.trim())
        if (!deleteCourse) {
            return res.status(400).json({ message: "Course not found" })
        }
        res.status(200).json({ message: 'Course delete Successfully', course: deleteCourse })
    }
    catch (error) {
        handleError(res, error, 'Failed to delete course');
    }

}