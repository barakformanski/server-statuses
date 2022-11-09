const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;

const crud = require("./routes/crud.ts");
app.use("/crud", crud);

server.listen(port, () => {
  console.log(`Server Started at ${port}.`);
});
