const { publicPosts, privatePosts } = require("../db");
const checkAuth = require("../middleware/checkAuth");

const router = require("express").Router();


router.get("/public", (req,res)=>{
    res.json(publicPosts)

})

router.get("/private",checkAuth, (req,res)=>{
    res.json(privatePosts)

})
module.exports=router;