import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startingIndex = (Number(page) - 1) * LIMIT;
    const total = await PostMessage.countDocuments({});

    const posts = await PostMessage.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startingIndex);

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;
  const modifiedTags = tags.split(",");
  const finalTags = modifiedTags.map((tag) => tag.trimStart().trimEnd());

  try {
    const title = new RegExp(searchQuery, "i");
    const posts = await PostMessage.find({
      $or: [{ title }, { tags: { $in: finalTags } }],
    });

    res.status(200).json({ data: posts });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const { tags } = req.body;
  const finalTags = tags.map((tag) => tag.trimStart().trimEnd());

  const newPost = new PostMessage({
    ...post,
    tags: finalTags,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const updatePost = async (req, res) => {
  const _id = req.params.id;
  const post = req.body;
  const { tags } = req.body;
  const finalTags = tags.map((tag) => tag.trimStart().trimEnd());

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ message: "No Posts With That Id" });
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id, tags: finalTags },
    {
      new: true,
    }
  );

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const _id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ message: "No Posts With That Id" });
  }

  await PostMessage.findByIdAndRemove(_id);

  res.json({ message: "Post deleted" });
};

export const likePost = async (req, res) => {
  const _id = req.params.id;

  if (!req.userId) {
    return res.json({ message: "unauthenticated" });
  }

  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ message: "No Posts With That Id" });
  }

  const post = await PostMessage.findById(_id);

  const index = post.likes.findIndex((id) => id === String(req.userId));

  if (index === -1) {
    post.likes.push(req.userId);
  } else {
    post.likes = post.likes.filter((id) => id !== String(req.userId));
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true,
  });

  res.json(updatedPost);
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const post = await PostMessage.findById(id);
  console.log(post);

  post.comments.push(comment);

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, {
    new: true,
  });

  res.json(updatedPost);
};
