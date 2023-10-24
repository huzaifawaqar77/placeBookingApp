const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const fs = require("fs");
// Models
const User = require("./models/User");
const Place = require("./models/Place");
const Booking = require("./models/Booking");

const app = express();

// middleware
app.use(express.json());

app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// connect to db
mongoose
  .connect("mongodb://127.0.0.1:27017/mern_auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

function getUserDataFromToken(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, "test", {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "Please enter all required fields." });
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong" });
  }
  res.json({ name, email, password });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Please enter all required fields." });
  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User does not exist." });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials." });

    jwt.sign({ email: user.email, id: user._id }, "test", (err, token) => {
      if (err) {
        res.status(400).json({ error: "Something went wrong" });
      } else {
        res.cookie("token", token).json({ ...user._doc });
      }
    });
  } catch (error) {
    res.status(400).json({ error: "Something went wrong" });
  }
});

app.get("/profile", async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.status(400).json("Invalid token");
  jwt.verify(token, "test", {}, async (err, userData) => {
    if (err) throw Error("Something went wrong");
    const { name, email, _id } = await User.findById(userData.id);
    res.json({ name, email, _id });
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("token").json(true);
  // res.cookie("token", null).json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });
  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });

app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;

  // getting data from the request body
  const {
    title,
    description,
    perks,
    photos,
    address,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, "test", {}, async (err, userData) => {
    if (err) throw Error("Something went wrong");
    await Place.create({
      owner: userData.id,
      title,
      description,
      perks,
      photos,
      address,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
  });
  res.json({ success: true });
});

app.get("/places", async (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, "test", {}, async (err, userData) => {
    if (err) throw Error("Something went wrong");
    const places = await Place.find({ owner: userData.id });
    res.json(places);
  });
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  const place = await Place.findById(id);

  res.json(place);
});

app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    description,
    perks,
    photos,
    address,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  jwt.verify(token, "test", {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.findById(id);

    if (placeDoc.owner.toString() === userData.id) {
      placeDoc.set({
        title,
        description,
        perks,
        photos,
        address,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json({ success: true });
    }
  });
});

app.get("/allplaces", async (req, res) => {
  const places = await Place.find();
  res.json(places);
});

app.post("/bookings", async (req, res) => {
  const userData = await getUserDataFromToken(req);
  const { place, checkIn, checkOut, guests, name, phone, price } = req.body;
  const booking = await Booking.create({
    place,
    checkIn,
    checkOut,
    guests,
    name,
    phone,
    price,
    user: userData.id,
  });
  if (booking) {
    res.status(200).json(booking);
  } else {
    res.status(400).json({ error: "Something went wrong" });
  }
});

app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromToken(req);
  const bookings = await Booking.find({ user: userData.id }).populate("place");
  res.json(bookings);
});
