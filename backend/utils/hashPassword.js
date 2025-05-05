const bcrypt = require('bcrypt');


async function hashPassword(password) {
  // Generate a salt.  
  const saltRounds = 10; // 10 is a good balance of security and performance

  try {
    // Hash the password using bcrypt.
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    // Handle errors, such as bcrypt failing to hash the password.
    console.error("Error hashing password:", error);
    throw error;
  }
}

    // Use bcrypt.compare to check if the password matches the hash.
async function comparePassword(password, hash) {
    try {
      const match = await bcrypt.compare(password, hash);
      return match;
    } catch (error) {
      console.error("Error comparing password and hash:", error);
      throw error;
    }
}


module.exports = { hashPassword, comparePassword };
