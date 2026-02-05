const { sequelize } = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        const adminEmail = 'admin@example.com';
        const adminExists = await User.findOne({ where: { email: adminEmail } });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        await User.create({
            name: 'Admin User',
            email: adminEmail,
            password: hashedPassword,
            role: 'Admin'
        });

        console.log('Admin user created successfully');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
