const nodemailer = require('nodemailer');
const ejs = require('ejs');
const Path = require('path')

let transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user: 'anjalianup7250@gmail.com',
        pass:'12345anj@'
    }
});

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile (
        Path.join(__dirname,'../views/mailers', relativePath),
        data,
        function(err,template){
            if(err){console.log("error in rendering",err);return}

            mailHTML=template;
        }
    )
    return mailHTML;
}

module.exports= {
    transporter : transporter,
    renderTemplate : renderTemplate
}