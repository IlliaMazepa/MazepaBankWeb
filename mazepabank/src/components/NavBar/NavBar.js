import React, { useRef } from 'react';
import { FaBars, FaTimes } from "react-icons/fa";
import s from './NavBar.module.css';
import Logo from "../../images/Logo.png";
import { useNavigate } from 'react-router-dom';


const NavBar = (props) => {
    const navRef = useRef();

    const navigate = useNavigate();
    let phoneNumber = props.user.phoneNumber;
    let name = props.user.name;
    let surname = props.user.surname;
    const handleClickHome = () => {
        // Navigate to the new page with state
        navigate('/new-page', { state: { phoneNumber, name, surname } });
    };

    const handleClickTransactions = () => {
        // Navigate to the "Transactions" page with state
        navigate('/Transactions', { state: { phoneNumber} });
    };


    const showNavBar = () => {
        navRef.current.classList.toggle("responsive_nav");
    };


    return (
        <div className={s.navbar}>
            <h3 className={s.logo}><img src={Logo} alt='a' style={{ width: '60px', height: '60px' }} /> </h3>

            <nav ref={navRef}>
                <a href='' onClick={handleClickHome}>Home</a>
                <a href='/Currencies'>Currency</a>
                <a href='/Transactions' onClick={handleClickTransactions}>Transactions</a>
                <a href=''>About</a>

            </nav>
            <button className={s.nav_btn}>Hello, {name}</button>

        </div>
    )
}

export default NavBar;