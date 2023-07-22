const User = require('../models/user');
const fs = require('fs');
const path = require('path');


// module.exports.profile = function(req, res){
//     console.log(req.cookies.user_id);
//     if(req.cookies.user_id){
//         User.findById(req.cookies.user_id, function(err,user){
//             console.log(user);
//             if(user)
//             {
//                 return res.render('user_profile', {
//                     title: 'User Profile',
//                     user: user
//                 })
//             }

//             // return res.redirect('/');
//         });
//     }else{
//         return res.redirect('/sign-in');
//     }
// }

module.exports.profile = function(req, res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    });   
}

module.exports.update = async function(req,res){
    
    if(req.user.id == req.params.id){

        try{
            let user = await User.findById(req.params.id);
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('**** multer error!',err);
                }
                console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){

                    if(user.avatar)
                    {                         
                        try {
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        } catch (err) {
                            console.log("error",err); 
                        }
                    }

                    user.avatar=User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
        }catch(err)
        {
            req.flash('error',err);
            return res.redirect('back');
        }

    }else{
        req.flash('error','Unautorized!');
        return res.status(401).send('unauthorized');
    }
}
// console.log("executed");

// render the sign up page
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    
    
    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


// render the sign in page
module.exports.signIn = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}


// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return}

                return res.redirect('/users/sign-in');
            });
        }else{
            return res.redirect('back');
        }

    });
}
//done

// // sign in and create a session for the user
// module.exports.createSession = function(req, res){
//     // steps to authenticate
//     //find the user
//     User.findOne({email:req.body.email},function(err,user){
//         if(err){console.log('error in creating user while signing up'); return}
//         //handle user found
//             if(user){
//                  //handle password which don't match
//                     if(user.password!=req.body.password){
//                         return res.redirect('back');
//                     }
//                  //handle session creation
//                  res.cookie('user_id',user.id);
//                  return res.redirect('/users/profile');
//             }else{
//                      //handle user not found
//                      return res.redirect('back');
//                 }
//     });
// }

//sign in and create a session for the user

module.exports.createSession = function(req,res){
    req.flash('success','Logged in successfully');
    console.log('success','logged in');
    return res.redirect('/');
}

//sign-out the login page
module.exports.destroySession = function(req,res){
    req.logout();
    req.flash('success','you are Logged out!');
    console.log('success','logged out');
    return res.redirect('/');
}