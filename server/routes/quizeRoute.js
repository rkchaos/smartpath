const express=require('express')
const router=express.Router()
const authmiddleware=require("../middleware/auth")
const{createQuize,RetrieveallQuizes,RetriveSpecific,updateQuize,deleteQuize,submitQuiz}=require("../controller/quizeController")




router.post("/courses/:courseId/quizzess",authmiddleware.auth,createQuize)
router.get('/courses/:coursesId/quizzes',authmiddleware.auth,RetrieveallQuizes)
router.get("/quizzes/:id",authmiddleware.auth,RetriveSpecific)
router.put("/quizzes/:id",authmiddleware.auth,updateQuize)
router.delete("/quizzes/:id",authmiddleware.auth,deleteQuize)
router.post("/submit/:id",authmiddleware.auth,submitQuiz)




module.exports=router