var express = require('express');
var jwt = require('express-jwt');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var passport = require('passport');
var User = mongoose.model('User');

// middleware for authenticating jwt tokens
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/posts', function(req, res, next) {
  var user = req.query.currentUser
  var query = Post.find({ user: user });

  Post.find(function(err, posts){
    if(err){ return next(err); }
  });

  query.exec(function (err, posts){
    if(err){ return next(err); }

    res.json(posts);
  });
});

router.param('post', function(req, res, next, id) {
  var query = Post.findById(id);

  query.exec(function (err, post){
    if (err) { return next(err); }
    if (!post) { return next(new Error('can\'t find post')); }

    req.post = post;
    return next();
  });
});

router.get('/posts/:post', function(req, res, next) {
    req.post.populate('comments', function(err, post) {
        if (err) { return next(err) }

        res.json(req.post);
    })
});

router.post('/posts', auth, function(req, res, next) {
  var post = new Post(req.body);

  post.author = req.payload.username;

  post.save(function(err, post){
    if(err){ return next(err); }

    res.json(post);
  });
});

router.put('/posts/:post/upvote', auth, function(req, res, next) {
  req.post.upvote(function(err, post){
    if (err) { return next(err); }

    res.json(post);
  });
});

router.post('/posts/:post/comments', auth, function(req, res, next) {
	var comment = new Comment(req.body);
	comment.post = req.post;
  comment.author = req.payload.username;

	comment.save(function(err, comment){
		if(err) { return next(err); }

		req.post.comments.push(comment);
		req.post.save(function(err, post) {
			if(err) { return next(err); }

			res.json(comment);
		});
	});
});

router.param('comment', function(req, res, next, id) {
  var query = Comment.findById(id);

  query.exec(function (err, comment){
    if (err) { return next(err); }
    if (!comment) { return next(new Error('can\'t find comment')); }

    req.comment = comment;
    return next();
  });
});

router.put('/posts/:post/comments/:comment/upvote', auth, function(req, res, next) {

  req.comment.upvote(function(err, comment){
    if (err) { return next(err); }

    res.json(comment);
  });
});

router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password)

  user.save(function(err){
    if(err) { return next(err); }

    return res.json({token: user.generateJWT()})
  });

});

router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password) {
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err) { return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }

  })(req, res, next);

})

router.delete('/posts/:id', function(req, res, next) {
  Post.findById(req.params.id, function (err, post) {
    if(err) { return next(err); }
    if(!post) { return res.sendStatus(404); }
    post.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.sendStatus(204);
    });
  });
});


router.get('/photo', function(req, res, next) {

  // need to cache the following
  var API500px = require('500px');
  api500px = new API500px('NGELN6iDrvzFX5vxJhVJCg9heHNseePK8T5yAFal');

  api500px.users.getGallery ('15693715', {image_size: 6, rpp: 100}, function(error, results) {
    if (error) {
      return console.log(error);
    }

    var randomIndex = Math.floor((Math.random() * results.photos.length - 1) + 0);
    var randomImageUrl = results.photos[randomIndex].image_url;

    res.send(randomImageUrl);
  });
});


module.exports = router;