var express = require('express');
var router = express.Router();
const userModel = require("./users")
const blogModel = require("./blogModel")
const bcrypt = require("bcrypt");
const  mongoose = require('mongoose');
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
   try {
    const {id} = req.params
    const data = await blogModel.findById(id)
    return res.status(201).send({
        message: "Blogs Found",
        success: true,
        data,
    })
   } catch (error) {
    console.log(error)
   }

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
router.post("/blogs/create-blog", async (req, res) => {
    try {
      const { title, description, image, user } = req.body;
  
      if (!title || !description || !image || !user) {
        return res.status(400).send({
          message: "Fill all fields",
          success: false
        });
      }
  
      const existingUser = await userModel.findById(user);
  
      if (!existingUser) {
        return res.status(404).send({
          message: "User not found",
          success: false
        });
      }
  
      const data = await blogModel.create({ title, description, image, user });
  
      // Assuming 'blog' is an array field in the userModel
      existingUser.blog.push(data._id);
      await existingUser.save();
  
      res.status(201).send({
        message: "Blog Created Successfully",
        success: true,
        data
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Internal Server Error",
        success: false
      });
    }
  });

// update blog
router.put("/blogs/update-blog/:id", async(req, res) => {
try {
    const {id} = req.params;
    const{title,description,image} =  req.body;
    const data  = await blogModel.findByIdAndUpdate(id,{...req.body},{new:true});
    return res.status(200).send({
        message:"Blog Updated Successfully",
        success:true,
        data
    })

} catch (error) {
    console.log(error)
}
})


// delete blog
router.delete("/blogs/delete-blog/:id", async(req, res) => {
    try {
        const {id} = req.params
        const data = await blogModel.findById(id).populate('user')
        data.user.forEach(item=>{
            // data kai under user array kai under blog ko pull kiya 
            const val = item.blog.pull(data)
            return res.status(200).send({
                message:"Blog Deleted Successfully",
                success:true,
                data:val
            })
            
        })
        
    } catch (err){
        console.log(err)
        }
})


// Get User Blog
router.get("/user/user-blog/:id",async(req,res)=>{
    try {
        const model = await userModel.findById(req.params.id).populate('blog')
        if(!model){
            return res.status(404).send({
                message:"User Not Found",
                success:false
            })
        }

        return res.status(200).send({
            message:"blog found !",
            success :true,
            data :model
            
        })
    } catch (error) {
        console.log(error)
    }
})


module.exports = router;