const express = require("express");
const router = express.Router();
const statusModel = require("../models/statusModel");
const transitionModel = require("../models/transitionModel");
const axios = require("axios");

//Post Method
router.post("/add/:field", async (req, res) => {
  let type = req.params.field;

  let data;
  let from;
  let to;
  if (type === "status") {
    data = new statusModel({
      title: req.body.title,
    });
  } else if (type === "transition") {
    from = await statusModel.findOne({ title: req.body.from });
    to = await statusModel.findOne({ title: req.body.to });
    data = new transitionModel({
      title: req.body.title,
      from: from._id,
      to: to._id,
    });
    console.log("from", from);
    console.log("to", to);
    console.log("DATA", data);
  }
  let isExist;
  if (type === "status") {
    isExist = await statusModel.findOne({ title: req.body.title });
  } else if (type === "transition") {
    isExist = await transitionModel.findOne({ title: req.body.title });
  }
  if (isExist) {
    res.status(400).json({ message: `${type} already exsit!` });
  } else {
    try {
      const dataToSave = await data.save();
      const updateStatusData = {
        from: from,
        to: to,
      };
      await updateStatusAfterAddingTranstion(updateStatusData);
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
    const data = await transitionModel.find().populate(["from", "to"]);
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
router.patch("/updateInitial/:id", async (req, res) => {
  try {
    const id = req.params.id.trim();
    const updatedData = req.body;
    const options = { new: true };

    const result = await statusModel.findByIdAndUpdate(
      id,
      updatedData,
      options
    );
    updateInitalOnAllOthers(id);
    // try {
    //   const updateManyresult = await statusModel.updateMany(
    //     { _id: { $ne: id } },
    //     { $set: { initial: false } }
    //   );

    //   // res.send(result);
    // } catch (error) {
    //   console.log("error", error);
    //   res.status(400).json({ message: error.message });
    // }

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});
router.patch("/updateStatusReacable", async (req, res) => {
  try {
    const id = req.params.id.trim();
    const updatedData = req.body;
    const options = { new: true };

    const result = await statusModel.findByIdAndUpdate(
      id,
      updatedData,
      options
    );
    updateInitalOnAllOthers(id);
    // try {
    //   const updateManyresult = await statusModel.updateMany(
    //     { _id: { $ne: id } },
    //     { $set: { initial: false } }
    //   );

    //   // res.send(result);
    // } catch (error) {
    //   console.log("error", error);
    //   res.status(400).json({ message: error.message });
    // }

    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

const updateInitalOnAllOthers = async (id) => {
  try {
    const updateManyresult = await statusModel.updateMany(
      { _id: { $ne: id } },
      { $set: { initial: false } }
    );

    // res.send(result);
  } catch (error) {
    console.log("error", error);
  }
};
const updateStatusAfterAddingTranstion = async (updatedData) => {
  const options = { new: true };

  try {
    const result = await statusModel.findByIdAndUpdate(
      updatedData.from,
      updatedData.to,
      options
    );

    // res.send(result);
  } catch (error) {
    console.log("error", error);
  }
};
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
    await transitionModel.deleteMany({});
    res.send("Delete all data");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
