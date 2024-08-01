const express = require("express");
const {  
    createCourse, 
    getAllCourses, 
    getCourse, 
    deleteCourse, 
    updateCourse 
} = require("../controllers/courseController");
const router = express();
const {verifyIsLoggedIn, verifyIsAdmin} = require("../middleware/verifyAuthToken")


router.post("/", verifyIsLoggedIn, verifyIsAdmin, createCourse);
router.get("/",  getAllCourses);
router.get("/:id", getCourse);
router.put('/:id', updateCourse);
router.delete("/:id", verifyIsLoggedIn, verifyIsAdmin, deleteCourse);

module.exports = router;