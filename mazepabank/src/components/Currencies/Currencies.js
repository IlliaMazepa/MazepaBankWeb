import React, { useState, useEffect } from 'react';
import s from './Currencies.module.css';
import { country_list } from './countryList';

const Currencies = () => {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('UAH');
  const [toCurrency, setToCurrency] = useState('NPR');
  const [amount, setAmount] = useState(1);
  const [exchangeRate, setExchangeRate] = useState(null);

  useEffect(() => {
    const options = Object.keys(country_list).map((currency_code) => (
      <option key={currency_code} value={currency_code}>
        {currency_code}
      </option>
    ));

    setCurrencyOptions(options);
  }, []);

  const loadFlag = (element) => {
    const code = element.value;
    const imgTag = element.parentElement.querySelector('img');
    imgTag.src = `https://flagsapi.com/${country_list[code]}/flat/64.png`;
  };

  const getDefaultSelected = (currencyCode) => {
    return currencyCode === 'UAH' || currencyCode === 'NPR';
  };

  const getExchangeRate = async () => {
    try {
      const url = `https://v6.exchangerate-api.com/v6/a4843e24ad6d7c15724d9f4c/latest/${fromCurrency}`;
      const response = await fetch(url);
      const result = await response.json();
      const exchangeRateValue = result.conversion_rates[toCurrency];
      setExchangeRate(exchangeRateValue);
    } catch (error) {
      console.error('Error fetching exchange rate:', error);
    }
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleFromCurrencyChange = (e) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e) => {
    setToCurrency(e.target.value);
  };

  const handleGetExchangeRate = (e) => {
    e.preventDefault();
    getExchangeRate();
  };

  return (
    <div className={s.cur_body}>
      <div className={s.wrapper}>
        <div className={s.header}>Currency Converter</div>
        <form action='#'>
          <div className={s.amount}>
            <p>Enter amount</p>
            <input type='text' value={amount} onChange={handleAmountChange} />
          </div>
          <div className={s.drop_list}>
            <div className={s.from}>
              <p>From</p>
              <div className={s.select_box}>
                <img src={`https://flagsapi.com/${country_list[fromCurrency]}/flat/64.png`} alt='flag' />
                <select value={fromCurrency} onChange={handleFromCurrencyChange}>
                  {currencyOptions}
                </select>
              </div>
            </div>
          </div>

          <div className={s.icon}><box-icon name='transfer'></box-icon></div>

          <div className={s.drop_list}>
            <div className={s.to}>
              <p>To</p>
              <div className={s.select_box}>
                <img src={`https://flagsapi.com/${country_list[toCurrency]}/flat/64.png`} alt='flag' />
                <select value={toCurrency} onChange={handleToCurrencyChange}>
                  {currencyOptions}
                </select>
              </div>
            </div>
          </div>

          <div className={s.exchange_rate}>
            {exchangeRate !== null && (
              `${amount} ${fromCurrency} = ${(amount * exchangeRate).toFixed(2)} ${toCurrency}`
            )}
          </div>
          <button className={s.ex_btn} onClick={handleGetExchangeRate}>Get Exchange Rate</button>
        </form>
      </div>
    </div>
  );
};

export default Currencies;
