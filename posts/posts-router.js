const express = require('express');
const router = express.Router();
const db = require('../data/db.js');


router.get('/', async (req, res) => {
  try {
    const posts = await db.find();
    res.status(200).json({ success: true, posts });
  } catch {
    res.status(500).json({
      success: false,
      error: 'The posts information could not be retrieved.'
    });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await db.findById(id);
    if (!post.length) {
      res.status(404).json({
        success: false,
        message: 'The post with the specified ID does not exist.'
      });
    } else {
      res.status(200).json({ success: true, post });
    }
  } catch {
    res.status(500).json({
      success: false,
      error: 'The post information could not be retrieved.'
    });
  }
});

router.get('/:id/comments', async (req, res) => {
  const { id } = req.params;
  try{
    const comments = await db.findPostComments(id)
    if(!comments.length){
      res
        .status(404)
        .json({
          success: false,
          message: 'The post with the specified ID does not exist.'
        });
    } else {
      res.status(200).json({ success: true, comments })
    }
  } catch {
    res
      .status(500)
      .json({
        success: false,
        error: 'The comments information could not be retrieved.'
      });
  }
})

router.post('/', async (req, res) => {
  const { title, contents } = req.body;
  if (!title || !contents) {
    res.status(400).json({
      success: false,
      errorMessage: 'Please provide title and contents for the post.'
    });
  }
  try{
    const { id } = await db.insert({ title, contents });
    const post = await db.findById(id);
    res.status(201).json({
      success: true,
      post
    });
  } catch {
    res.status(500).json({ success: false, 
      error: 'There was an error while saving the post to the database'
    });
  }
})

router.post('/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if(!text){
    res
      .status(400)
      .json({
        success: false,
        errorMessage: 'Please provide text for the comment.'
      });
  }
  try {
    const post = await db.findById(id)
    if(!post.length){
      res.status(404).json({ success: false, message: "The post with the specified ID does not exist."})
    } else {
      const comment = await db.insertComment({text: text, post_id: id})
      res.status(201).json({ success: true, comment})
    } 
  } catch {
    res
      .status(500)
      .json({
        success: false,
        error: 'There was an error while saving the comment to the database'
      });
  }
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try{
    const post = await db.findById(id)
    if(!post.length){
      res.status(404).json({ success: false, message: "The post with the specified ID does not exist." })
    } else {
      await db.remove(id)
      res.status(200).json({ success: true, post })
    }
  } catch {
    res
      .status(500)
      .json({
        success: false,
        error: 'The post information could not be modified.'
      });
  }
})

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;
  if(!title || !contents){
    res
      .status(400)
      .json({
        success: false,
        errorMessage: 'Please provide title and contents for the post.'
      });
  } 
  try {
    const post = await db.findById(id)
    if(!post.length){
      res
        .status(404)
        .json({
          success: false,
          message: 'The post with the specified ID does not exist.'
        });
    } else {
      await db.update(id, req.body)
      const updated = await db.findById(id)
      res.status(200).json({ success: true, updated})
    }
  } catch {
    res
      .status(500)
      .json({
        success: false,
        error: 'The post information could not be modified.'
      });
  }
})

module.exports = router;