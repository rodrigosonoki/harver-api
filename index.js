const express = require("express");
const mongoose = require("mongoose");
const app = express();

// import routes
const authRoutes = require("./routes/auth");
const verifyToken = require("./routes/validate-token");
const dashboardRoutes = require("./routes/dashboard");
const createOrder = require("./routes/createOrder");
const getOrder = require("./routes/getOrders");

// connect to db
mongoose.connect(
  "mongodb+srv://rodrigo:rodrigo123@harver-users.yjsqx.gcp.mongodb.net/users?retryWrites=true&w=majority",
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

//this route is protected with token
app.use("/api/dashboard", verifyToken, dashboardRoutes);

app.use("/api/createorder", createOrder);

app.use("/api/getorder", getOrder);

app.listen(3000, () => console.log("Listening on PORT 3000"));
