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
const storeRoutes = require("./routes/store");
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const leadRoutes = require("./routes/lead");
const passwordResetRoutes = require("./routes/password-reset");

const userRoutes = require("./routes/user");

// connect to db
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => console.log("Conectado ao MongoDB")
);

// middlewares
app.use(express.json());

// route middlewares
app.use("/api/user", authRoutes);

app.use("/api/store", verifyToken, storeRoutes);

app.use("/api/order", verifyToken, orderRoutes);

app.use("/api/user", verifyToken, userRoutes);

app.use("/api/product", verifyToken, productRoutes);

app.use("/api/lead", leadRoutes);

app.use("/api/password-reset", passwordResetRoutes);

app.listen(process.env.PORT || 3333, () =>
  console.log("Listening on PORT 3000")
);
