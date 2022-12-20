const express = require("express");
const router = express.Router();
const Todo = require("../schemas/todoSchema");
const checkLogin = require("../middlewares/checkLogin");

// get all the todo
router.get("/", checkLogin, async (req, res) => {
  try {
    data = await Todo.find()
      .select({
        __v: 0,
        date: 0,
      })
      .populate("user");
    res.status(200).json({
      result: data,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// get active todo
router.get("/active", async (req, res) => {
  try {
    const todo = new Todo();
    const data = await todo.findActive();
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There was a server side error",
    });
  }
});

// get todos by user
router.get("/by-user", checkLogin, async (req, res) => {
  try {
    const data = await Todo.findByUser(req.userId);
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There was a server side error",
    });
  }
});

// get all awe todo
router.get("/awe", async (req, res) => {
  try {
    const data = await Todo.findByAwe();
    res.status(200).json({
      data,
    });
  } catch (error) {
    res.status(500).json({
      message: "There is a server side error!",
    });
  }
});

// get find by code editor todo
router.get("/editor", async (req, res) => {
  try {
    const data = await Todo.find().byEditor("android studio");
    res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "There is a server side error!",
    });
  }
});

// get a todo by id
router.get("/:id", async (req, res) => {
  try {
    data = await Todo.findById(req.params.id)
      .select({
        _id: 0,
        __v: 0,
        date: 0,
      })
      .populate("user");
    res.status(200).json({
      result: data,
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

// post a todo
router.post("/", checkLogin, async (req, res) => {
  req.body.user = req.userId;
  const newTodo = new Todo(req.body);
  await newTodo.save((err) => {
    if (err) {
      res.status(500).json({
        error: err.message,
      });
    } else {
      res.status(200).json({
        message: "Todo was inserted successfully!",
      });
    }
  });
});

// post multiple todo
router.post("/all", checkLogin, async (req, res) => {
  const todos = req.body.map((todo) => {
    return { ...todo, user: req.userId };
  });
  console.log(todos);
  await Todo.insertMany(todos, (err, data) => {
    if (err) {
      res.status(500).json({
        error: err.message,
      });
    } else {
      res.status(200).json({
        message: "Todos were inserted successfully!",
        data,
      });
    }
  });
});

// put todo
router.put("/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
    });
    res.status(200).json({
      message: "Todo was updated successfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

// delete todo
router.delete("/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "Todo deleted succesfully!",
    });
  } catch (error) {
    res.status(500).json({
      error: "There was a server side error!",
    });
  }
});

module.exports = router;
