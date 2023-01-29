import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomToken = token.length < 500;

    let decondedData;

    if (token && isCustomToken) {
      decondedData = jwt.verify(token, "test");

      req.userId = decondedData?.id;
    } else {
      decondedData = jwt.decode(token);

      req.userId = decondedData?.sub;
    }

    next();
  } catch (error) {
    console.error(error);
  }
};

export default auth;
