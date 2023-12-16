import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Transactions = (props) => {
    const location = useLocation();
    let [activeUser, setActiveUser] = useState([]);
    const [summ, setSumm] = useState();
    const [recep, setRecep] = useState();
    const phoneNumber = location.state?.phoneNumber;
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

        // Set up an interval to refresh data every 5 seconds
        const intervalId = setInterval(() => {
            fetchData();
        }, 5000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [phoneNumber]);

    const handleSummChange = (e) => {
        setSumm(parseFloat(e.target.value));
    };

    const handleRecepChange = (e) => {
        setRecep(parseFloat(e.target.value));
    };

    let sendMoney = () => {
        if(summ<=activeUser.Balance){
            const fetchData1 = async () => {
                try {
                  const response = await fetch(`http://localhost:5000/payment/${recep}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                     cardNumber: activeUser.CardNumber,
                    }),
                  });
                  const data = await response.json();
                  console.log(data);
          
                  if(data.CardNumber==recep){
                    console.log(recep);
                    let firstP = async () => {
                        try {
                            const response = await fetch(`http://localhost:5000/paymentup/${recep}/${data.Balance+summ}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    cardNumber: recep,
                                    summ: data.Balance+summ
                                }),
                            });
            
                            
                        } catch (error) {
                            console.error('Error fetching data:', error);
                        }
                    };

                    let secondP = async () => {
                        try {
                            const response = await fetch(`http://localhost:5000/paymentup/${activeUser.CardNumber}/${activeUser.Balance-summ}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    cardNumber: recep,
                                    summ: data.Balance+summ
                                }),
                            });
            
                            
                        } catch (error) {
                            console.error('Error fetching data:', error);
                        }
                    };
            
                    firstP();
                    secondP();
                  }
                  
          
          
          
                } catch (error) {
                  console.error('Error fetching data:', error);
                }
              };
          
              fetchData1();
        }
        else{
            alert("Not enough money");
        }

    }

    return (
        <div>
            <div>
                <div>Sender: {activeUser.CardNumber}</div>
                Summ: <input type='number' value={summ} onChange={handleSummChange}></input>
            </div>
            <div>
                <div>Recipient: <input type='number' value={recep} onChange={handleRecepChange}></input></div>
            </div>
            <button onClick={sendMoney}>Send </button>
        </div>
    )
}

export default Transactions;