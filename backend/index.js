require("dotenv").config();
console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET);

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString)
  .then(() => {
    console.log("Database connected!");
  })
  .catch(err => {
    console.error("Database connection error:", err);
  });

// Add Database 
const User = require("./models/user.model");
const Note = require("./models/note.modal");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");

// Correct the path to utilities.js
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*"
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

app.post("/create-account", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname) {
      return res.status(400).json({ error: true, message: "Full name is required" });
    }
    if (!email) {
      return res.status(400).json({ error: true, message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
      return res.json({
        error: true,
        message: "User already exists"
      });
    }

    const user = new User({
      fullname,
      email,
      password
    });
    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m"
    });

    return res.json({
      error: false,
      user,
      accessToken,
      message: "Registration successful"
    });
  } catch (error) {
    console.error("Error in /create-account:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: true, message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ error: true, message: "Password is required" });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: true, message: "User not found" });
    }

    // Simple password check for demonstration; in real applications, use hashed passwords
    if (user.password !== password) {
      return res.status(400).json({ error: true, message: "Invalid password" });
    }

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m"
    });

    return res.json({
      error: false,
      user,
      accessToken,
      message: "Login successful"
    });
  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});

app.get("/get-user",authenticateToken, async (req, res) =>{
  const {user} = req.user;
  const isUser =  await User.findOne({_id:user._id})
  if(!isUser){
    return res.sendStatus(401)
  }
  return res.json({
    user:isUser,
    message:""
  })

})

app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const user = req.user;

  if (!title || !content) {
    return res.status(400).json({ error: true, message: "Title and content are required" });
  }

  try {
    const noteFields = {
      title,
      content,
      tags,
      userId: user._id
    };

    // if (tags) {
    //   noteFields.tags = Array.isArray(tags) ? tags : [tags];
    // }

    const note = new Note(noteFields);
    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note created successfully"
    });
  } catch (error) {
    console.error("Error in /add-note:", error);
    return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});


app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, tags, isPinned } = req.body;
  const userId = req.user._id;

  if (!title && !content && !tags && isPinned === undefined) {
    return res.status(400).json({ error: true, message: "No changes provided" });
  }

  try {
    const note = await Note.findOne({ _id: noteId, userId: userId });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    if (title) note.title = title;
    if (content) note.content = content;
    if (tags) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated"
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});

app.get("/get-all-notes", authenticateToken, async (req, res) => {
  const userId = req.user._id;
  console.log("User ID:", userId); // Log the userId to ensure it's correct

  try {
    const notes = await Note.find({ userId }).sort({ isPinned: -1 });
    console.log("Notes:", notes); // Log the retrieved notes to inspect

    return res.json({
      error: false,
      notes,
      message: "All notes retrieved"
    });
  } catch (error) {
    console.error("Error retrieving notes:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});




app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const user = req.user; // Access user from req.user

  console.log("Attempting to delete note with ID:", noteId);
  console.log("User ID:", user._id);

  try {
    const note = await Note.findOne({ _id: noteId, userId: user._id });
    if (!note) {
      console.log("Note not found");
      return res.status(404).json({ error: true, message: "Note not found" });
    }

    await Note.deleteOne({ _id: noteId, userId: user._id });
    return res.json({ error: false, message: "Deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});


app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
  const noteId = req.params.noteId;
  const {  isPinned } = req.body;
  const userId = req.user._id;

  try {
    const note = await Note.findOne({ _id: noteId, userId: userId });

    if (!note) {
      return res.status(404).json({ error: true, message: "Note not found" });
    }


    if (isPinned !== undefined) note.isPinned = isPinned || false;

    await note.save();

    return res.json({
      error: false,
      note,
      message: "Note updated"
    });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});

app.get("/search-notes", authenticateToken, async (req, res) => {
  const user = req.user; // Access user directly
  const query = req.query.query; // Extract query parameter

  if (!query) {
    return res.status(400).json({ error: true, message: "Search query is required" });
  }

  try {
    const matchingNotes = await Note.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } }
      ]
    });

    return res.json({
      error: false,
      notes: matchingNotes,
      message: "Notes matching"
    });
  } catch (error) {
    console.error("Error searching notes:", error);
    return res.status(500).json({ error: true, message: "Internal server error" });
  }
});



app.listen(8000, () => {
  console.log('Server is running on port 8000');
});

module.exports = app;
