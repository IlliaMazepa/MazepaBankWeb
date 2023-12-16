import React, { useState, useEffect } from 'react';
import { useLocation, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import s from './Main.module.css';
import ActiveUser from '../ActiveUser/ActiveUser';
import NavBar from '../NavBar/NavBar';



const MainPage = (props) => {
  const location = useLocation();
  let [activeUser, setActiveUser] = useState([]);
  const { phoneNumber, name, surname } = location.state;

  const [activeUser1, setActiveUser1] = useState({
    phoneNumber: phoneNumber,
    name: name,
    surname: surname,
  });



  function formatCreditCardNumber(cardNumber) {
    if (cardNumber) {
      const digitsOnly = cardNumber.replace(/\D/g, '');
      // Use regular expression to add spaces every four characters
      const formattedNumber = digitsOnly.replace(/(\d{4})/g, '$1 ').trim();
      return formattedNumber;
    } else {
      return ''; // Return an empty string or any default value if cardNumber is undefined or null
    }
  }

  



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/activeUser/${phoneNumber}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber,
          }),
        });
        const data = await response.json();

        setActiveUser(data);



      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [phoneNumber]);


  useEffect(() => {
    console.log("1");
    console.log(activeUser); 
  }, [activeUser]);


  let dateEndString = activeUser.DateEnd; // Assuming activeUser.DateEnd is a string
let dateEnd = new Date(dateEndString);
let formattedDate;

if (!isNaN(dateEnd.getTime())) { // Check if dateEnd is a valid Date object
  formattedDate = dateEnd.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  

  <p>Date End: {formattedDate}</p>
} else {
  console.error('Invalid Date'); // Handle the case where the date is invalid
}


  return (
    <div className={s.fullScreenContainer}>
      <NavBar user={activeUser1}/>
      <ActiveUser user={activeUser1} info={activeUser}/>
      
    </div>
  );
};

export default MainPage;



{/* <div>
        <h1>Active user</h1>
        <div>
          
            <div>
              <h2>UserInfo</h2>
              <p>Name: {activeUser1.name}</p>
              <p>Surname: {activeUser1.surname}</p>
              <p>Phone Number: {activeUser1.phoneNumber}</p>
              <h3>Card info</h3>
              <p>Balance: {activeUser.Balance} UAH</p>
              <p>Card number: {formatCreditCardNumber(activeUser.CardNumber)} </p>
              <p>Date End: {formattedDate}</p>
              <p>CVV: {activeUser.CVV}</p>
              <p>Card Status: {activeUser.CardStatus}</p>
            </div>
          
        </div>
      </div> */}