const express=require('express')
const{createCourse,getAllcourses,retriveSpecificCourse,updateCourses,deleteCourse}=require("../controller/courseController")
const authmiddleware=require("../middleware/auth")

const router=express.Router()

router.post("/createCourse",authmiddleware.auth,createCourse)
router.get("/getAllCourses",authmiddleware.auth,getAllcourses)
router.get("/retriveCourses/:id",authmiddleware.auth,retriveSpecificCourse)
router.put("/updateCourses/:id",authmiddleware.auth,updateCourses)
router.delete("/deleteCourse/:id",authmiddleware.auth,deleteCourse)



module.exports=router