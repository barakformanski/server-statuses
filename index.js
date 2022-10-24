const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

const crud = require("./routes/crud.js");
// const auth = require("./routes/authRoutes.js");
app.use("/crud", crud);
// app.use("/auth", auth);

server.listen(port, () => {
  console.log(`Server Started at ${port}`);
});
