const express = require("express");
const macAddressRoutes = require('./routes/macAddressRoutes');
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDb = require("./config/connectDb");
const userRoute=require('./routes/userRoute');
const usermacRoute=require('./routes/usermacRoute');

//config dotenv file
dotenv.config();

//database call
connectDb();

//rest object
const app = express();

const corsOptions = {
  origin: '*'
};

//middlewares
app.use(cors(corsOptions))
app.use(morgan("dev"));
app.use(express.json());
app.use('/api', macAddressRoutes);
app.use('/api',userRoute);
app.use('/api',usermacRoute);

//port
const PORT = process.env.PORT || 8080;

//listen server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
