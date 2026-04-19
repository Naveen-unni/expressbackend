require('dotenv').config();
const express=require("express");
const app=express();
const router=require("./routes/authRoute");
const router1=require("./routes/adminRoute");
const router2=require("./routes/roomRoute");
app.use(express.json());



app.use("/auth",router);

app.use("/admin",router1);

app.use("/room",router2);

app.get("/", (req, res) => {
  res.send("API is running...");
});



app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});



app.listen(3000,()=>{
    console.log("server is running on 3000")
});
