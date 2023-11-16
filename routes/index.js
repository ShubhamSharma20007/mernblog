var express = require('express');
var router = express.Router();
const userModel = require("./users")
const blogModel = require("./blogs")
const bcrypt = require("bcrypt")
    // const { getAllusers, registerController, loginController } = require("../controllers/userController")

// USER ROUTES

// get all user
router.get("/users/all-user", async(req, res) => {
    try {
        const data = await userModel.find({})
        res.status(201).json({
            success: true,
            data
        })
    } catch (error) {
        res.status(501).json({
            message: false,
            error
        })
    }

})

// create user
router.post("/users/register", async(req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(500).json({
                message: "Please enter all the fields",
                success: false
            })
        }
        // existing user or not 
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(500).json({
                message: "User already exists",
                success: false
            })
        }

        //hashing password
        const hasspass = await bcrypt.hash(password, 10)


        // new user save
        const model = await userModel.create({ username: username, email: email, password: hasspass })
        await model.save()
        res.status(201).json({
            message: "User created successfully",
            success: true,
            data: model
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error in Register callback",
            success: false,
            error
        })
    }
})

// login



router.post("/users/login", async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(500).json({
                message: "Please enter all the fields",
            });
        }

        const user = await userModel.findOne({ email });

        if (user) {
            const validPass = await bcrypt.compare(password, user.password);

            if (validPass) {
                res.status(200).json({
                    message: "Login Successfully",
                    success: true,
                });
            } else {
                res.status(400).json({
                    message: "Invalid Credentials",
                    success: false,
                });
            }
        } else {
            res.status(400).json({
                message: "Invalid Email",
                success: false,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Issues",
            error: error,
            success: false,
        });
    }
});



// BLOG ROUTER


// get single blogs
router.get("/blogs/get-blog/:id", async(req, res) => {

})


// get all blogs
router.get("/blogs/all-blog", async(req, res) => {
    try {
        const data = await blogModel.find({});
        if (!data) {
            res.status(200).send({
                success: false,
                message: "No blogs found"
            })
        }
        res.status(201).send({
            message: "All Blogs List",
            success: true,
            blogcount: data.length,
            data
        })
    } catch (error) {
        console.log(error)
    }
})


// post create blog
router.post("/blogs/create-blog", async(req, res) => {

})

// update blog
router.put("/blogs/update-blog/:id", async(req, res) => {

})


// delete blog
router.delete("/blogs/update-blog/:id", async(req, res) => {

})



module.exports = router;