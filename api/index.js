const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

app.use(cors()); 
app.use(express.json());  
app.use(express.static('public'))

const user_data = {
    user_id: "1478",
    email: "raghavendra.siddhardha2021@vitstudent.ac.in",
    roll_number: "21BAI1478"
};

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/main.html'));
  });

app.route('/bfhl')
    .get((req, res) => {
        const response = {
            operation_code: 1
        };
        res.status(200).json(response);
    })
    .post((req, res) => {
        try {
            const data = req.body.data;

            if (!Array.isArray(data)) {
                throw new Error("Data should be an array");
            }

            const numbers = data.filter(item => !isNaN(item));
            const alphabets = data.filter(item => isNaN(item));

            const lowercase_alphabets = alphabets.filter(ch => /^[a-z]$/.test(ch));
            const highest_lowercase = lowercase_alphabets.length ? lowercase_alphabets.sort().pop() : null;

            const response = {
                is_success: true,
                user_id: user_data.user_id,
                email: user_data.email,
                roll_number: user_data.roll_number,
                numbers: numbers,
                alphabets: alphabets,
                highest_lowercase_alphabet: highest_lowercase ? [highest_lowercase] : []
            };

            res.status(200).json(response);
        } catch (error) {
            const response = {
                is_success: false,
                message: error.message
            };
            res.status(200).json(response);
        }
    });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
