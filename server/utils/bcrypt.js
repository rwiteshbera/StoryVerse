const bcrypt = require("bcryptjs");

// Encrypt Password using bcrypt package
const generateHashpassword = async (originalPassword, salt = 10) => {
  try {
    const hashPassword = await bcrypt.hash(originalPassword, salt);
    return hashPassword;
  } catch (err) {
    throw new Error(err);
  }
};

// Validate hash password
const validateHashpassword = async (originalPassword, hashPassword) => {
  try {
    const isValid = await bcrypt.compare(originalPassword, hashPassword);
    return isValid;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  generateHashpassword,
  validateHashpassword,
};
