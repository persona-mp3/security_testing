import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt'
dotenv.config()

// connection pool
const pool = mysql.createPool( {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise();


// handle post request
export async function saveDetails(email, password){
    const [user] = await pool.query(`
        INSERT INTO Credentials(email, password)
        VALUES (?, ?)
        `, [email, password])

    return user
};

//check if an email already exist
//query database SELECT email FROM Credentials WHERE email === ''
//use booleam, if true >> don't save

async function existingUser(email){
    const [checkUser]=  await pool.query(`
        SELECT email FROM Credentials
        WHERE email = (?)
        `, [email]);
    
    const existingUser = checkUser[0] 
    
    if (existingUser !== undefined){        
        return true;
    }
    
    console.log('User does not exist, (save user)');
    return false;

}


export async function checker(email, password){
    try{
        const userExists = await existingUser(email);

        if (userExists){
            return {success: false, message: 'USER EXISTS'}
        };


        await saveDetails(email, password);
        
        return {
            success: true, 
            message: 'USER CREATED'
        }
    }catch (err){
        console.error(`Duplicate Entry, User Already exists ${err}`);
        return false
    }

};

//check password
async function checkPassword(email){
    const [isEmail] = await pool.query(`
        SELECT password FROM Credentials
        WHERE email = (?)
        `, [email])
    
    return isEmail[0].password
}

//CHECK if user exists, comparing email and password
export async function authentication(email, userPassword){

    try {
        const userExists = await existingUser(email);
        if (!userExists){
            return {success: false, message: 'User does not exist'};
        }


        //compare password from checker and hased
        const hashedPassword = await checkPassword(email);
        const match = await bcrypt.compare(userPassword, hashedPassword);
        if(!match){
            console.log('Incorrect Credentials. Try Again');
            return false;
        }

        if(match){
            console.log('Logged IN');
            return {success: true};
    
        }


    } catch (err) {
        console.log(`Error occured during Authentication: ${err}`)
    }
}

// const newPass = await checkPassword('your_hashed_password');
// console.log(newPass);

// const newCred = await authentication('email_test', 'password_test');
// console.log(newCred)