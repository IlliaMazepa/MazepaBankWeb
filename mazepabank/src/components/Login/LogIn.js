import React, { useState, useEffect, useRef } from 'react';
import s from "./Login.module.css";
import 'boxicons';
import { useNavigate } from 'react-router-dom';

const LogIn = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/LogIn/${phoneNumber}/${password}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: phoneNumber,
                    password: password,
                }),
            });

            const data = await response.json();
            
            if (data.status === "OK") {
                /* console.log(data); */
                let name = data.name;
                let surname = data.surname
                navigate('/new-page', { state: { phoneNumber, name, surname } });
            }
            else console.log("False");



        } catch (error) {
            console.error('Error fetching data:', error);
        }

    }




    return (
        <div className={s.wrapper}>
            <form action=''>
                <h1>LogIn</h1>
                <div className={s.input_box}>
                    <input type='text' placeholder='Phone Number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required></input>
                    {/* <box-icon type='solid' name='phone' className={s.icon1}></box-icon> */}
                </div>
                <div className={s.input_box}>
                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required></input>
                    {/* <box-icon type='solid' name="lock-alt" className={s.icon1}></box-icon> */}
                </div>
                <div className={s.remember_forgot}>
                    <label><input type='checkbox'></input>Remember me</label>
                    <a href='#'>Forgot password?</a>
                </div>

                <button type='submit' className={s.btn} onClick={handleSubmit}>LogIn</button>

                <div className={s.register_link}>
                    <p>Don`t have an account? <a href='/SignUp'>Register</a></p>
                </div>
            </form>
        </div>
    )
}

export default LogIn;