const bcrypt = require("bcryptjs");

// Encrypt Password using bcrypt package
const generateHashpassword = async (originalPassword) => {
  try {
    const hashPassword = await bcrypt.hash(originalPassword, 10);
    return hashPassword;
  } catch (err) {
    console.error(err);
    return "";
  }
};

// Validate hash password
const validateHashpassword = async (originalPassword, hashPassword) => {
  try {
    const isValid = await bcrypt.compare(originalPassword, hashPassword);
    return isValid;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = {
  generateHashpassword,
  validateHashpassword,
};
