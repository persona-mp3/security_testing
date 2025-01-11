import express from 'express'
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import morgan from 'morgan'

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config();
const app = express();
const upload = multer()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.post('/login', upload.none(), async (req, res) => {
    const { username, password } = req.body;
    
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminUsername = process.env.ADMIN_USERNAME;


    if (username !== adminUsername || password !== adminPassword){
        return res.status(401).send('Invalid');
    }

    return res.status(200).send('Valid')
})

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', '404.html'))

})
app.listen(3000, () => {
    console.log('Active on 3000')
})