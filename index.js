const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

require("dotenv/config");

//MIDDLEWARES
const pedidoId = require("./middlewares/orderId");

app.use(cors());
app.options("*", cors());

// import routes
const authRoutes = require("./routes/auth");
const verifyToken = require("./routes/validate-token");

const createOrder = require("./routes/createOrder");
const getOrder = require("./routes/getOrders");
const getOrderDetail = require("./routes/getOrderDetail");

// connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("connected to db")
);

// middlewares
app.use(express.json());

// route middlewares
app.use("/api/user", authRoutes);

app.use("/api/createorder", pedidoId, createOrder);

app.use("/api/getorder", verifyToken, getOrder);

app.use("/api/getorderdetail", verifyToken, getOrderDetail);

app.listen(3333, () => console.log("Listening on PORT 3000"));
