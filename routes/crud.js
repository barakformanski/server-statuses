const express = require("express");
const router = express.Router();
const statusModel = require("../models/statusModel");
const transitionModel = require("../models/transitionModel");
// const Data = require("../models/statusModel");
const axios = require("axios");
const auth = require("../middleware/auth");

//Post Method
// router.post("/addStatus", async (req, res) => {
router.post("/add/:field", async (req, res) => {
  console.log(req.params.field);
  let type = req.params.field;

  let data;
  if (type === "status") {
    // data = new Data({
    data = new statusModel({
      title: req.body.title,
      // description: req.body.description,
    });
  } else if (type === "transition") {
    data = new transitionModel({
      title: req.body.title,
      from: req.body.from,
      to: req.body.to,
    });
  }
  let isExist;
  if (type === "status") {
    isExist = await statusModel.findOne({ title: req.body.title });
  } else if (type === "transition") {
    isExist = await transitionModel.findOne({ title: req.body.title });
  }
  // const isExist = await statusModel.findOne({ title: req.body.title });
  if (isExist) {
    res.status(400).json({ message: `${type} already exsit!` });
  } else {
    try {
      const dataToSave = await data.save();
      res.status(200).json(dataToSave);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

//Get all Method
router.get("/getAllStatuses", async (req, res) => {
  try {
    const data = await statusModel.find();
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/getAllTransitions", async (req, res) => {
  try {
    const data = await transitionModel.find();
    console.log(data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
router.get("/getOne/:id", async (req, res) => {
  console.log(req.params);
  const id = req.params.id;
  console.log("req.params.id", req.params.id);
  try {
    const id = req.params.id.trim();

    const data = await statusModel.findById(id);
    console.log("data", data);
    res.json(data);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: error.message });
  }
});

//Update by ID Method
router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id.trim();
    const updatedData = req.body;
    const options = { new: true };

    const result = await statusModel.findByIdAndUpdate(
      id,
      updatedData,
      options
    );

    try {
      const result = await statusModel.updateOne(
        { description: "INIT", _id: { $ne: id } },
        { $set: { description: null } }
      );

      // res.send(result);
    } catch (error) {
      console.log("error", error);
      res.status(400).json({ message: error.message });
    }

    res.send(result);
    // updatePreviosINIT(result._id);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/delete/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const id = req.params.id;
    const data = await statusModel.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/deletetransition/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    const id = req.params.id;
    const data = await transitionModel.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/deleteAll", async (req, res) => {
  try {
    await statusModel.deleteMany({});
    res.send("Delete all data");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
