const mysql = require('mysql2/promise');

const passwords = ['', 'root', 'password', 'admin', '123456', 'taskflow'];

async function tryConnect() {
    console.log('Testing connection passwords for user root...');
    for (const password of passwords) {
        try {
            console.log(`Trying password: '${password}' ...`);
            const connection = await mysql.createConnection({
                host: '127.0.0.1',
                user: 'root',
                password: password
            });
            console.log(`SUCCESS! Connected with password: '${password}'`);
            await connection.end();
            process.exit(0);
        } catch (err) {
            if (err.code === 'ER_ACCESS_DENIED_ERROR') {
                console.log('Access Denied.');
            } else {
                console.log(`Error: ${err.message}`);
            }
        }
    }
    console.log('All passwords failed.');
    process.exit(1);
}

tryConnect();
