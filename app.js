const express = require("express");
const ImageKit = require("imagekit");
const app = express();
const cors = require("cors");
const multer = require("multer");
require("dotenv").config()

// @desc: Express app configuration
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// @desc: Imagekit configuration
var imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_API_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_API_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// @desc: multer initialization
var upload = multer();

// @desc: GET - list of all the image details!
app.get("/images", async (req, res) => {
  try {
    // var resString = '';
    var list = await imagekit.listFiles({});
    // for (var file of list) {
    //   resString += `<img src="${file.thumbnail}" alt=""></img>`;
    // }
    // res.status(200).send(resString);
    res.status(200).send(list);
  } catch (error) {
    res.send(error);
  }
});

// @desc: POST - Upload the images to imagekit storage!
app.post("/upload", upload.array("upload"), async (req, res) => {
  try {
    var fileListArray = [];
    for (var file of req.files) {
      fileListArray.push(
        await imagekit.upload({
          file: file.buffer,
          fileName: "image",
          folder: "/images",
        })
      );
    }
    res.send({
      uploads: fileListArray,
    });
  } catch (error) {
    res.send(error);
  }
});

// Listening to the server 
app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
