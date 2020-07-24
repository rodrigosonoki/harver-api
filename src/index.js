const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

require("dotenv/config");

//MIDDLEWARE
const verifyToken = require("./middlewares/validate-token");

app.use(cors());
app.options("*", cors());

// import routes
const authRoutes = require("./routes/auth");
const accountRoutes = require("./routes/account");
const storeRoutes = require("./routes/store");
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");

const userRoutes = require("./routes/user");

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

app.use("/api/account", verifyToken, accountRoutes);

app.use("/api/store", verifyToken, storeRoutes);

app.use("/api/order", verifyToken, orderRoutes);

app.use("/api/user", verifyToken, userRoutes);

app.use("/api/product", verifyToken, productRoutes);

app.listen(process.env.PORT || 3333, () =>
  console.log("Listening on PORT 3000")
);
