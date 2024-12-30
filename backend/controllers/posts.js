import mongoose from "mongoose";
import Post from "../models/Post.js"
import User from "../models/User.js";

export const updateComment = async (req, res) => {
  try {
    const { postId, userId, comment } = req.body; // Get postId, userId, and comment from the request body

    // Validate the input
    if (!postId || !userId || !comment) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Find the post by its ID and update it by adding the new comment
    const updatedPost = await Post.findByIdAndUpdate(
      postId, 
      {
        $push: {
          comments: {
            userId,  
            comment, 
          },
        },
      },
      { new: true } 
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: err.message });
  }
};



export const createPost = async(req,res) => {
    try{
        const {userId,description,picturePath} = req.body;

        const user = await User.findById(userId)
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath:user.picturePath,
            picturePath,
            likes:{},
            comments:[]
        })
        await newPost.save();
        const post = await Post.find()
        res.status(201).json(post)
    }catch(err){
        res.status(409).json({message:err.message})
    }
}

export const getFeedPosts = async(req,res) => {
    try{
        const post = await Post.find()
        res.status(201).json(post)
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

export const getUserPosts = async(req,res) => {
    try{
        const {userId} = req.params;
        const post = await Post.find({userId})
        res.status(201).json(post)
    }catch(err){
        res.status(404).json({message:err.message})
    }
}

export const likePost = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const post = await Post.findById(id);
      const isLiked = post.likes.get(userId);
  
      if (isLiked) {
        post.likes.delete(userId);
      } else {
        post.likes.set(userId, true);
      }
  
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
      );
  
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };