import React, { useState, useEffect } from 'react';
import s from './ActiveUser.module.css';
import mc from '../../images/mc.png';
import chip from '../../images/chip.png';

const ActiveUSer = (props) => {

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

      let dateEndString = props.info.DateEnd; // Assuming activeUser.DateEnd is a string
      let dateEnd = new Date(dateEndString);
      let formattedDate = dateEnd.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    return (
        <div className={s.ActiveUSer}> 
        <div style={{margin: "100px"}}>Balance: {props.info.Balance} UAH</div>
            <div className={s.cantainer}>
                <div className={s.header}>
                    <span className={s.ms}>
                        <img src={mc} alt=""></img>
                        <h5>Master Card</h5>
                    </span>
                    <img src={chip} alt="" className={s.chip}></img>
                </div>

                <div className={s.card_details}>
                    <div className={s.name_number}>
                        <h6>Card Number</h6>
                        <h5 className={s.number}>{formatCreditCardNumber(props.info.CardNumber)}</h5>
                        <h6 className={s.name}>{props.user.name} {props.user.surname}</h6>
                    </div>
                    <div className={s.valid_date}>
                        <h6>Valid till</h6>
                        <h5>{formattedDate}</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActiveUSer;