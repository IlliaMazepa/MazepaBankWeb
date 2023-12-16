import React, { useState, useEffect, useRef } from 'react';
import s from "./SignUp.module.css";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [Name, setName] = useState('');
    const [Surname, setSurname] = useState('');
    const [dateOfBirth, setdateOfBirth] = useState('');
    const navigate = useNavigate();

    function formatDate(inputDate) {
        // Split the input date into parts
        const [year, month, day] = inputDate.split('-');
      
        // Create the formatted date string
        const formattedDate = `${day}.${month}.${year}`;
      
        return formattedDate;
      }

      let SendPost = async(event) =>{
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/SignUp/${Name}/${Surname}/${phoneNumber}/${formatDate(dateOfBirth)}/${password}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: Name,
                    surname: Surname,
                    phoneNumber: phoneNumber,
                    dateOfBirth_: dateOfBirth,
                    password: password,
                }),
            });

            const data = await response.json();
            console.log(data);

            if (data.status=="Created") {
                
                //alert("Your account created seccessfuly!!!");
                navigate("/");
            }
            else console.log("False");



        } catch (error) {
            console.error('Error fetching data:', error);
        }

      }



    const handleSubmit = (event) => {
        if(Name.length>3){
            if(/^[a-zA-Z]+$/.test(Name)){
                if(Surname.length>3){
                    if(/^[a-zA-Z]+$/.test(Name)){
                        if(dateOfBirth!=null){
                            if(/^\+380\d{9}$/.test(phoneNumber)){
                                if(password.length>5) SendPost(event);
                                else{
                                    alert("Password should be longer then 6 symbols")
                                }
                            }
                            else{
                                alert("Incorrect phone number");
                            }
                        }
                        else {
                            alert("Enter date of birth");
                        }
                    }
                    else{
                        alert("Name should contain only English letters");
                    }
                }
                else{
                    alert("Surname should be longer (more then 3)")
                }
            }
            else{
                alert("Name should contain only English letters");
            }
        }
        else{
            alert("Name should be longer (more then 3)")
        }
        

    }


    return (
        <div className={s.wrapper}>
            <form action=''>
                <h1>Sign Up</h1>
                <div className={s.input_box}>
                    <input type='text' placeholder='First Name' value={Name} onChange={(e) => setName(e.target.value)} required></input>
                </div>
                <div className={s.input_box}>
                    <input type='text' placeholder='Second Name' value={Surname} onChange={(e) => setSurname(e.target.value)} required></input>
                </div>
                <div className={s.input_box}>
                    <input type='date' placeholder='Date of Birth' value={dateOfBirth} onChange={(e) => setdateOfBirth(e.target.value)} required></input>
                </div>
                <div className={s.input_box}>
                    <input type='text' placeholder='Phone Number (+380-111-11-11)' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required></input>
                </div>
                <div className={s.input_box}>
                    <input type='text' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                </div>


                <button type='submit' className={s.btn} onClick={handleSubmit}>Create Account</button>


            </form>
        </div>
    )
}

export default SignUp;