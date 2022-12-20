const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// instance method
todoSchema.methods = {
  findActive: function () {
    return mongoose.model("Todo", todoSchema).find({ status: "active" });
  },
  // findByUser: function (user) {
  //   return mongoose.model("Todo", todoSchema).find({ user });
  // },
};

// static mathod
todoSchema.statics = {
  findByAwe: function () {
    return this.find({ title: /code/i });
  },
  findByUser: function(userId){
    return this.find({user:userId});
  }
};

// query helpers
todoSchema.query = {
  byEditor: function (editor) {
    return this.find({ title: RegExp(editor, "i") });
  },
};
module.exports = mongoose.model("todo", todoSchema);
