const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const mysql = require("mysql")
const path =require("path")
app.use(bodyParser.json())
const dotenv= require("dotenv")
const { text } = require("express")
app.use(bodyParser.json())
dotenv.config()
app.use(bodyParser.urlencoded({"extended":true}))
let connection = mysql.createConnection({
    host:process.env.HOST,
    port:process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database:process.env.DATABASE
})
app.get("/", function (req, res) {
    res.sendFile("work.html",{root:__dirname})
})

app.post("/submit", function (req, res) {
    
    connection.connect(function (err) {
        if (err) throw err;
        console.log(req.body);
        const Username = req.body.Username
        const Email = req.body.Email
        const Password = req.body.Password
        const Image = req.body.Image
        
        const info = `INSERT INTO Users_data(Username,Email,Password,Image) VALUES(?)`
        const values = [Username,Email,Password,Image]
        connection.query(info, [values], function (err) {
        if (err) throw err
            res.redirect("/homepage");
        })
    })

})

app.get("/homepage", function (req, res) {
    res.sendFile("login.html",{root:__dirname})
   
});
    
    app.post("/homepage",function(req,res){
        let Uname= req.body.text

        let mail= req.body.email
        let pword= req.body.password
        console.log(Uname);
        console.log(mail)
        console.log(pword);
        connection.query(`SELECT * FROM users_data  WHERE Username=? and Password=? `,[Uname,pword] ,(error, result)=> {
            if (error){
                console.error(err);
                res.status(500).send('An error occurred, please try again later.');
                return;
            }
            else if(result.length > 0){
                console.log(result);
                  for(i=0; i<result.length; i++){
                    
                    if(result[i].Password== pword && result[i].Username == Uname){
                      res.redirect("/welcome");
                    
                    }
                  }
                } else {
                    res.write("not exist")
                  res.sendFile(path.join(__dirname,"./login.html"));
                }
              });
        
           
        });
        app.get('/welcome',(req,res) => {
            res.sendFile(path.join(__dirname,"./update.html"))
           
           
           })
               app.post("/welcome",(req,res)=>{
                let username=req.body.usernam
                 let usernewname=req.body.username
                 let email=req.body.email;
               let password=req.body.password;
               console.log(email,password)
               
           
           connection.query(`UPDATE users_data SET Email="${email}",Password="${password}",Username="${usernewname}"  WHERE Username="${username}"`,(err,result)=>{
            if(result.length>0){
                for(i=0; i<result.length; i++){
                    
                    if(result[i].username==username){
                      res.send("updated")
                    }
                      else{
                    res.send("unable to update")
                      }
                    
                 
                  }
            }
           })
          
           res.redirect("/delete")
               })

        app.get("/delete",(req,res)=>{
            res.sendFile(path.join(__dirname,"./home.html"))
        })
    
        app.post('/delete',(req,res)=>{
            let username=req.body.usernam
            connection.query( `DELETE FROM users_data WHERE username="${username}"`)
            res.redirect("/afterDeletion")
           
            // res.sendFile(path.join(__dirname,"/update.html"))
          })
          app.get("/afterDeletion",(req,res)=>{
            res.sendFile(path.join(__dirname,"./delete.html"))
          })
       
     app.post('/afterDeletion',(req,res)=>{
        res.redirect("/submit")
     })
    app.get('/submit',(req,res)=>{
        res.sendFile(path.join(__dirname,"./work.html"))
    })
  

 



app.listen(1600, function () {
    console.log("The server is running on port 1600");
})