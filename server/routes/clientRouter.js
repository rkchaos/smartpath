const express=require("express")
const auth=require("../controller/clientController")
const router=express.Router()
const authmiddleware=require("../middleware/auth")



router.post("/register",auth.register)
router.post("/login",auth.login)
router.delete("/logout",authmiddleware.auth,auth.logout)
router.get("/alluser",authmiddleware.auth,auth.alluser)




module.exports=router