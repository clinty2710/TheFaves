// models/user.js
// /Users/clinty2710/Desktop/TheFaves/models/user.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../database/connection');
const bcrypt = require('bcrypt');

class User extends Model {
    static async authenticate(email, password) {
        console.log('Authenticating user:', email); 
        const user = await this.findOne({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.error('Invalid email or password');
            throw new Error('Invalid email or password');
        }
        console.log('Authentication successful:', email);
        return user;
    }

    async isValidPassword(password) {
        console.log('Comparing password:', password);
        console.log('Stored password hash:', this.password);
        return bcrypt.compare(password, this.password);
    }  
}

User.init(
    {
        nickname: {
            type: DataTypes.STRING,
            allowNull: false,
            // unique: true, // Remove unique constraint if not required
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
        timestamps: false, // Disable timestamps
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
