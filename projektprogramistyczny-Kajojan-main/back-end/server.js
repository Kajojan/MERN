require("dotenv").config();
const express = require("express");
const https = require('https');
const calRoutes = require("./routes/cal");
const mongoose = require("mongoose");
const fs = require('fs');
const path = require('path');




const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
//   next();
// });
// app.post('/upload', upload.single("file"), (req,res)=>{
//   console.log(req.file)
//   res.send("upload")
// })

app.use(cookieParser())
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});
app.get('/:download', (req, res) => {
  const {download} = req.params
  const file = `${__dirname}/files/${download}`;
  res.download(file);
});

app.use("/api/cal", calRoutes);
mongoose.set("strictQuery", false);

// const server = https.createServer(
//   {
//       key: fs.readFileSync(path.join('plik.key')),
//       cert: fs.readFileSync(path.join( 'cert.crt'))
//   },
//   app
// )


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // server.listen(process.env.PORT, () => console.log('Serwer ssl chodzi'));

    app.listen(process.env.PORT, () => {
      console.log("listening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });

  
