const mongoose = require("mongoose");

const url = `mongodb+srv://inalfaruk295:dIn4VcXd8on9W2xk@cluster0.yzwliej.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(
    url
    //     {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    //       serverApi: {
    //         version: ServerApiVersion.v1,
    //         strict: true,
    //         deprecationErrors: true,
    //       },
    //   }
  )
  .then(() => console.log("Connected to db"))
  .catch((err) => console.log(err));
