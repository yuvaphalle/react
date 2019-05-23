
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);


module.exports = function(app, passport) {
 app.get('/',logg, function(req, res){
  res.render('index.ejs');
 });
function logg(req , res , next){
 if (req.isAuthenticated()) res.redirect('/profile')
else next();
};



 app.get('/login', logg,function(req, res){
  res.render('login.ejs', {message:req.flash('loginMessage')});
 });

 app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
 }),
  function(req, res){
   if(req.body.remember){
    req.session.cookie.maxAge = 1000 * 60 * 3;
   }else{
    req.session.cookie.expires = false;
   }
   res.redirect('/');
  });

 app.post('/profile', function(request, response){

  var idd= request.body.goo;
  console.log('this is new' +idd);
  var query = 'UPDATE  newuser SET fname = ?,  lname = ?, agee =  ? , image = ? WHERE id='+idd+' '  ;
  console.log('Mai yaha aa gyaa' + request.body.goo );
  connection.query(query, [request.body.fname , request.body.lname,  request.body.agee , request.body.image],

      function(err, rows){
       console.log(err);
      });
  console.log('Ho gaya' + request.body.goo);

  response.redirect('/profile'); });

 app.get('/signup', function(req, res){
  res.render('signup.ejs', {message: req.flash('signupMessage')});
 });

 app.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
 }));

 app.post('/profile', passport.authenticate('local-profile', {

  failureFlash: true
 }));


 app.get('/profile', isLoggedIn, function(req, res){
  res.render('profile.ejs', {
   user:req.user
  });
 });


 app.get('/profile', function(req, res){
  res.render('profile.ejs', {

  });
 });


 app.get('/logout', function(req,res){
  req.logout();
  res.redirect('/');
 })


};




function isLoggedIn(req, res, next){
 if(req.isAuthenticated())
  return next();

 res.redirect('/');
}

