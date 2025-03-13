class MockStorage {
  constructor() {
    this.users = new Map();
    this.lastId = 0;
  }

  async create(data) {
    this.lastId++;
    const id = this.lastId;
    const timestamp = new Date();
    const user = {
      id,
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    this.users.set(data.account, user);
    return user;
  }

  async findOne(query) {
    const { where } = query;
    if (where.account) {
      return this.users.get(where.account) || null;
    }
    return null;
  }
}

module.exports = new MockStorage();