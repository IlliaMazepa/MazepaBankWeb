import mysql2 from 'mysql2';
import cors from 'cors';
import express from 'express';

const connection = mysql2.createConnection({
    host: "localhost",
    database: "mazepabank",
    user: "root",
    password: "",

});

const app = express();

app.use(cors());

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`SERVER   :    http://localhost:${PORT}`);
    connection.connect((err) => {
        if (err) throw err;
        console.log("DATABASE CONNECTED");
    })
});


const queryAsync = (sql, values) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};






app.use("/all", (req, res) => {
    const sql_query = 'select * from users';
    connection.query(sql_query, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});


app.use("/LogIn/:phoneNumber/:password", async (req, res) => {
    let phoneData = req.params.phoneNumber;
    let passwordData = req.params.password;

    const sql_query = `select * from users where PhoneNumber = '${phoneData}'`;
    /* connection.query(sql_query, (err, result) => {
        if (err) throw err;
        userData = result;
        console.log(userData);
    }) */


    let userData = await queryAsync(sql_query, [phoneData]);


    let jsonString = "";
    if (userData != null) {
        if (userData[0].PhoneNumber == phoneData && userData[0].Password == passwordData)
            jsonString = `{"status": "OK", "phoneNumber": "${phoneData}", "name": "${userData[0].Name}", "surname": "${userData[0].Surname}"}`;
        else jsonString = `{"status": "NO", "phoneNumber": "${phoneData}"}`;
    }
    else {

        jsonString = `{"status": "NO", "phoneNumber": " "}`;
    }

    let jsonObject = "";


    try {
        jsonObject = JSON.parse(jsonString);
        /* console.log(jsonObject); */
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
    res.send(jsonObject);
});






app.use("/activeUser/:phoneNumber", async (req, res) => {
    let phoneData = req.params.phoneNumber;

    console.log(req.params.phoneNumber);
    let jsonString;
    const sql_query = `select * from userinffo where PhoneNumber = '${phoneData}'`;

    let userData = await queryAsync(sql_query, [phoneData]);
    //console.log(userData);
    if (userData != null) {
        jsonString = `{"Balance": ${userData[0].Balance}, "CardNumber": "${userData[0].CardNumber}", "DateEnd": "${userData[0].DateEnd}", "CVV": "${userData[0].CVV}", "CardStatus": "${userData[0].CardStatus}"}`;
    }
    else {
        jsonString = `{"Balance": "0", "CardNumber": "0000000000000000", "DateEnd": "0", "CVV": "0", "CardStatus": "0"}`;
    }
    let jsonObject = "";
    //console.log(jsonString);


    try {
        jsonObject = JSON.parse(jsonString);
        /* console.log(jsonObject); */
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
    res.send(jsonObject);
});


let UserInfoCreat = async (phone) => {
    let phoneNumber = phone;
    let Balance = 0;

    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setFullYear(currentDate.getFullYear() + 5);

    let DateEnd = formatDate(futureDate);
    let newCardNumber = await generateUniqueCardNumber();
    let CVV = Math.floor(100 + Math.random() * 900).toString();
    let CardStatus = "Basic";

    const insertUserQuery = `INSERT INTO userinffo (PhoneNumber, Balance, CardNumber,DateEnd,CVV,CardStatus) VALUES ('${phoneNumber}',${Balance},'${newCardNumber}',STR_TO_DATE('${DateEnd}', '%d.%m.%Y'),'${CVV}', '${CardStatus}')`;


    connection.query(insertUserQuery, (err, result) => {
        if (err) {
            console.error('Error inserting user data:', err);
            return res.status(500).send('Internal Server Error');
        }

        // User successfully inserted
        console.log("User info added");

    });


}



app.use("/SignUp/:name/:surname/:phoneNumber/:dateOfBirth_/:password", async (req, res) => {
    let nameData = req.params.name;
    let surnameData = req.params.surname;
    let phoneData = req.params.phoneNumber;
    let dateData = req.params.dateOfBirth_;
    let passwordData = req.params.password;

    const checkPhoneNumberQuery = `SELECT * FROM users WHERE PhoneNumber = '${phoneData}'`;

    connection.query(checkPhoneNumberQuery, (err, results) => {
        if (err) {
            console.error('Error checking phone number:', err);
            connection.end();
            return;
        }

        // If a user with the same phone number exists, handle it accordingly
        if (results.length > 0) {
            console.log('User with the same phone number already exists');
            connection.end();
            return;
        }

        // If the phone number doesn't exist, insert the new user data
        const insertUserQuery = `INSERT INTO users (Name, Surname, PhoneNumber, DateOfBirth, Password) VALUES ('${nameData}','${surnameData}','${phoneData}',STR_TO_DATE('${dateData}', '%d.%m.%Y'), '${passwordData}')`;


        connection.query(insertUserQuery, (err, result) => {
            if (err) {
                let jsonString = `{"status": "Error"}`;
                let jsonObject = "";
                try {
                    jsonObject = JSON.parse(jsonString);
                    /* console.log(jsonObject); */
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
                res.send(jsonObject);
                console.error('Error inserting user data:', err);
                return result.status(500).send('Internal Server Error');
            }

            // User successfully inserted
            UserInfoCreat(phoneData);
            console.log("User added");
            ('User registered successfully');
            let jsonObject = "";
            let jsonString = `{"status": "Created"}`;


            try {
                jsonObject = JSON.parse(jsonString);
                /* console.log(jsonObject); */
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
            res.send(jsonObject);
        });





    });
})

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}


async function generateUniqueCardNumber() {
    let newCardNumber;


    // Generate a new random string of digits
    newCardNumber = generateRandomDigits(16);


    return newCardNumber;
}

function generateRandomDigits(length) {
    let result1 = '';
    const characters = '0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result1;
}




app.use("/payment/:cardNumber", async (req, res) => {
    let cardData = req.params.cardNumber;

    
    let jsonString;
    const sql_query = `select * from userinffo where CardNumber = '${cardData}'`;

    let userData = await queryAsync(sql_query, [cardData]);
    //console.log(userData);
    
        jsonString = `{"Balance": ${userData[0].Balance}, "CardNumber": "${userData[0].CardNumber}", "DateEnd": "${userData[0].DateEnd}", "CVV": "${userData[0].CVV}", "CardStatus": "${userData[0].CardStatus}"}`;
    
    //console.log(jsonString);
    let jsonObject;


    try {
        jsonObject = JSON.parse(jsonString);
        /* console.log(jsonObject); */
    } catch (error) {
        console.error('Error parsing JSON:', error);
    }
    res.send(jsonObject);
});



app.use("/paymentup/:cardNumber/:summ", async (req, res) => {
    let cardData = req.params.cardNumber;
    let summData = req.params.summ;

    
    let jsonString;
    const sql_query = `UPDATE userinffo SET Balance=${summData} WHERE CardNumber='${cardData}'`;

    let userData = await queryAsync(sql_query, [cardData]);
    

});



