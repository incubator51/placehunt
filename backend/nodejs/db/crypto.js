import bcrypt from 'bcrypt';

export const generatePasswordHash = async (password, saltRounds = 10) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

export const checkPasswordHash = async (password, hashedPassword) => {
  try {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
