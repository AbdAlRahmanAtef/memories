import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      res.status(404).json({ message: "user does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      foundUser.password
    );

    if (!isPasswordCorrect) {
      res.status(400).json({ message: "invalid username or password" });
    }

    const token = jwt.sign(
      { email: foundUser.email, id: foundUser._id },
      "test",
      { expiresIn: "1h" }
    );

    res.status(200).json({ userObj: foundUser, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  try {
    const foundUser = await User.findOne({ email });

    if (foundUser) {
      res.status(400).json({ message: "user already exists" });
    }

    if (password !== confirmPassword) {
      res.status(400).json({ message: "passwords does not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ email: user.email, id: user._id }, "test", {
      expiresIn: "1h",
    });

    res.status(200).json({ userObj: user, token });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};
