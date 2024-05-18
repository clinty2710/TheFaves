// /Users/clinty2710/Desktop/TheFaves/models/user.js

const { DataTypes, Model } = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Model {
  static async authenticate(email, password) {
    const user = await this.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid email or password');
    }
    return user;
  }

  async isValidPassword(password) {
    return bcrypt.compare(password, this.password);
  }
}

module.exports = (sequelize) => {
  User.init(
    {
      nickname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      timestamps: false,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user.password = hashedPassword;
          }
        },
      },
    }
  );
  return User;
};
