const bcrypt = require('bcryptjs');
const mockStorage = require('./mockStorage');

class User {
  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 8);
    return mockStorage.create({
      ...data,
      password: hashedPassword
    });
  }

  static async findOne(query) {
    return mockStorage.findOne(query);
  }

  static async comparePassword(hashedPassword, password) {
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = User;