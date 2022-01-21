const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
// const { createPool } = require("mysql");
// const pool = require("pg").pool;
// const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true }));
app.use(cors());


// const MonoURL = "mongodb+srv://Robin:robin890@cluster0.pjqqt.mongodb.net/myFirstDatabase?retryWrites=true"

// const pool = createPool({
//     host:'localhost',
//     user:'root',
//     password:'',
//     database:'testdb',
//     connectionLimit:10,
//     port: 4000
// });

// pool.connect((err) => {
//   if(err){
//     console.log('Error connecting to Db');
//     return;
//   }
//   console.log('Connection established');
// });
// const sql = require('mssql')

// const config = {
//     user: 'user',
//     password: 'pass',
//     server: 'server',
//     database: 'master',
// }
 
// sql.connect(config).then(pool => {
//     return pool.request()
//     .query('select * from sys.tables ').then(result => {
//         console.dir(result)
    
//         return pool.request()      /*    <-- THIS LINE!    */
//         .input('input_parameter', sql.Int, 10)
//         .output('output_parameter', sql.VarChar(50))
//         .execute('procedure_name')
//     }).then(result => {
//         console.dir(result)
//     });
// }).catch(err => {
//     console.log("error at line24: ", err)
// })

// sql.on('error', err => {
//     console.log("error at line28: ", err)
//     // ... error handler
// })

mongoose.connect("mongodb+srv://Robin:robin890@cluster0.pjqqt.mongodb.net/myFirstDatabase?retryWrites=true",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});()=>{
    console.log("connected to DB")
}



  
// user schema 
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now()
      }
      
})

const User = new mongoose.model("User", userSchema)

// routes routes
app.post("/Login",(req,res)=>{

    User.findone({email:email},(err,user)=>{
        if(user){
           if(password === user.password){
               res.send({message:"login sucess",user:user})
           }else{
               res.send({message:"wrong credentials"})
           }
        }else{
            res.send("not register")
        }
    })
});
app.post("/Register",(req,res)=>{
    console.log(req.body) 
    const {name,email,password} =req.body;
    User.findOne({email:email},(err,user)=>{
        if(user){
            res.send({message:"user already exist"})
        }else {
            const user = new User({name,email,password})
            user.save(err=>{
                if(err){
                    res.send(err)
                }else{
                    res.send({message:"sucessfull"})
                }
            })
        }
    })

    var hashedPassword = password;

 

    // Encryption of the string password
    bcrypt.genSalt(10, function (err, Salt) {
    
        // The bcrypt is used for encrypting password.
        bcrypt.hash(password, Salt, function (err, hash) {
    
            if (err) {
                return console.log('Cannot encrypt');
            }
    
            hashedPassword = hash;
            console.log(hash);
    
          bcrypt.compare(password, hashedPassword,
                async function (err, isMatch) {
    
            
                if (isMatch) {
                    console.log('Encrypted password is: ', password);
                    console.log('Decrypted password is: ', hashedPassword);
                }
    
                if (!isMatch) {
            
                    console.log(hashedPassword + ' is not encryption of '
                    + password);
                }
            })
         
        })
    })
   User.password = hashedPassword;


   const payload = {
    user: {
        id: User.id
    }
};
jwt.sign(
    payload,
    "randomString", {
        expiresIn: 10000
    },
    (err, token) => {
        if (err) throw err;
        res.status(200).json({
            token
        });
    }
);


}) 

// Requiring module





app.get('/', (req, res) => {
    res.send("you are in user singup")
  })

app.listen(4000,()=>{
    console.log("started")
})
