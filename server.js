import express from 'express'
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import morgan from 'morgan';
import bcrypt from 'bcrypt';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { register } from 'module';

import { checker, authentication }  from './db.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const app = express();
const upload = multer()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));


// get requests
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'))
})


// post requests
app.post('/signup', upload.none(), async (req, res) => {
    const {email, password} = req.body;

    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await checker(email, hashedPassword);

        if (!result.success){
            console.log(result.message);
            res.status(409).json({message: 'User alrdy exists'});
            return;
        }

        return res.status(201).json({message: 'Saved Successsfully'})

    } catch (err) {
        console.error(`MyServer Error: ${err}`)
    }

})



app.post('/login', upload.none(), async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const result = await authentication(email, password);
        if (!result.success){
            console.log('Invalid Credentials from user');
            return res.status(401).send('Incorrect Password/Email');
        } 

        return res.status(200).send('SERVER.JS>> Logged In');


    } catch (err){
        console.log(`Error Within Server, ${err}`);
        res.status(500).send('Internal Server Error')
    }
    
})

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', '404.html'))

})
app.listen(3000, () => {
    console.log('Active on http://localhost:3000')
})