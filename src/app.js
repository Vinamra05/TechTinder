import express from 'express';

const app =  express();

app.use("/",(req,res)=>{
res.send("i came from server");
});

// app.get("/",(req,res)=>{
//     console.log('ok');
//     console.log(req.body);
//     res.send({
//         message:"ok"
//     });
// })

app.listen(3000,()=>{
 console.log("server listening on Port:3000");
});  