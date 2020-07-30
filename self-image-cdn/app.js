const express = require("express");
const app = express();
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
const cors = require("cors");
app.use(cors());
app.use(express.json());

// @desc: multer configuration
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${__dirname}/images`);
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(
        null,
        raw.toString("hex") +
          "." +
          file.originalname.split(".").pop().toString()
      );
    });
  },
});

var upload = multer({ storage: storage });

app.post("/upload", upload.array("upload"), async (req, res) => {
  console.log(req.files);
  res.send(req.files);
});

app.get("/cdn/images/:id", async (req, res) => {
  const id = req.params.id;
  res.sendFile(`${__dirname}/images/${id}`, function (err) {
    if (err) console.log(err);
  });
  // fs.readFile(`${__dirname}/images/${id}`, function read(err, data) {
  //   if (err) {
  //     res.send(err);
  //   }
  //   res.send(data);
  // });
});

app.listen(8081, () => {
  console.log(`Server is running on ${8081}`);
});
