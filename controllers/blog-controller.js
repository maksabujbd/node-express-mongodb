import Blog from "../models/Blog.js";
import mongoose from "mongoose";
import User from "../models/User.js";

export const getAllBlog = async (req, res, next) => {
    let blogs;
    try {
        blogs = await Blog.find();
    } catch (err) {
        return console.log(err);
    }

    if (!blogs) {
        return res.status(404).json({message: "No Blogs Found"});
    }
    return res.status(200).json({blogs});
}

export const createBlog = async (req, res, next) => {
    const {title, description, image, user} = req.body;

    let existingUser;
    try {
        existingUser = await User.findById(user);
    } catch (err) {
        return console.log(err)
    }

    if (!existingUser) {
        return res.status(400).json({message: "Unable to find user by this ID"});
    }

    const blog = new Blog({
        title, description, image, user,
    });

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await blog.save({session});
        existingUser.blogs.push(blog);
        await existingUser.save({session});
        await session.commitTransaction();
    } catch (err) {
        return res.status(500).json({message: err});
    }

    return res.status(201).json({blog});
}

export const updateBlog = async (req, res, next) => {
    const blogId = req.params.id;
    const {title, description, image} = req.body;
    let blog;
    try {
        blog = await Blog.findByIdAndUpdate(blogId, {
            title, description, image
        });
    } catch (err) {
        return console.log(err);
    }

    if (!blog) {
        return res.status(500).json({message: "Unable to update"})
    }
    return res.status(200).json({blog});
}

export const getById = async (req, res, next) => {
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findById(blogId);
    } catch (err) {
        console.log(err)
    }

    if (!blog) {
        return res.status(500).json({message: "No blog found"});
    }

    return res.status(200).json({blog});
}

export const deleteBlog = async (req, res, next) => {
    const blogId = req.params.id;
    let blog;
    try {
        blog = await Blog.findByIdAndDelete(blogId).populate('user');
        await blog.user.blogs.pull(blog);
        await blog.user.save();
    } catch (err) {
        return console.log(err)
    }

    if (!blog) {
        return res.status(500).json({message: "Unable to delete"});
    }
    return res.status(200).json({message: "Deleted Successfully"});
}

export const getByUserId = async (req, res, next) => {
    const userId = req.params.id;
    let userBlogs;
    try {
        userBlogs = await User.findById(userId).populate("blogs");
    } catch (err) {
        return res.status(404).json({message: "No Blog found"});
    }
    return res.status(200).json({blogs: userBlogs});
}