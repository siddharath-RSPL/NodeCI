const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const redis = require("redis");

const Blog = mongoose.model("Blog");

module.exports = (app) => {
  app.get("/api/blogs/:id", requireLogin, async (req, res) => {
    const blog = await Blog.findOne({
      _user: req.user.id,
      _id: req.params.id,
    });

    res.send(blog);
  });

  // app.get('/api/blogs', requireLogin, async (req, res) => {
  //   const redis = require('redis');
  //   const redisUrl = 'redis://127.0.0.1:6379';
  //   const client = redis.createClient(redisUrl);
  //   const util = require('util');
  //   client.get = util.promisify(client.get);
    
  //   //Check if we have cached data in redis related to query.
  //   const cachedBlogs =  await client.get(req.user.id);
    
  //   //If so, respond to request with result in cache and return.
  //   if (cachedBlogs) {
  //     console.log('SERVING FROM CACHE');
  //     return res.send(JSON.parse(cachedBlogs));
  //   }
    
  //   // If not, respond to request with mongo and update cache to store the data
  //   const blogs = await Blog.find({ _user: req.user.id });
  //   console.log('SERVING FROM MONGO.');
  //   res.send(blogs);
  //   client.set(req.user.id, JSON.stringify(blogs)); // key/value
  // });

  app.get("/api/blogs", requireLogin, async (req, res) => {
    // const redisUrl = 'redis://127.0.0.1:6379';
    // const client = redis.createClient(redisUrl);
    // const util = require('util');
    // client.get = util.promisify(client.get);

    //const client = redis.createClient();

    //client.on('error', err => console.log('Redis Client Error', err));
    //client.connect_timeout();

    // const cachedBlogs = await client.get(req.user.id);

    const blogs = await Blog.find({ _user: req.user.id });

    res.send(blogs);
  });

  app.post("/api/blogs", requireLogin, async (req, res) => {
    const { title, content } = req.body;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id,
    });

    try {
      await blog.save();
      res.send(blog);
    } catch (err) {
      res.send(400, err);
    }
  });
};
