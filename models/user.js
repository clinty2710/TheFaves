// models/user.js
// /Users/clinty2710/Desktop/TheFaves/models/user.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connection'); // Adjust the path as per your project structure
const bcrypt = require('bcrypt');

class User extends Model {
    static async authenticate(email, password) {
        console.log('Authenticating user:', email); 
        const user = await this.findOne({ where: { email } });
        if (!user || !(await user.isValidPassword(password))) {
            console.error('Invalid email or password'); // Log authentication failure
            throw new Error('Invalid email or password');
        }
        console.log('Authentication successful:', email); // Log authentication success
        return user;
    }

    async isValidPassword(password) {
      console.log('Comparing password:', password); // Log the password being compared
      console.log('Stored password hash:', this.password); // Log the hashed password stored in the database
      return bcrypt.compare(password, this.password);
  }  
}

User.init(
    {
        // Define model attributes here
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
        sequelize, // Pass the sequelize instance to the model
        modelName: 'Users', // Set the model name
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

module.exports = User;
