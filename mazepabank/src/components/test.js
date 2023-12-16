import React, { useState, useEffect, useRef } from 'react';

const TestComponent = () => {
  const [userData, setUserData] = useState([]);
  let [userByPhone, setUserByPhone] = useState([]);
  let pN = useRef();
  let phoneNumber = "";

  const getValueFromTextarea = async () => {
    phoneNumber = pN.current.value;

    try {
      const response = await fetch(`http://localhost:5000/byPhone/${phoneNumber}`);
      const data = await response.json();

      setUserByPhone(data);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/all');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>User Data</h1>
      <ul>
        {userData.map(user => (
          <li key={user.id}>
            <p>Name: {user.Name}</p>
            <p>Surname: {user.Surname}</p>
            <p>Phone Number: {user.PhoneNumber}</p>
            <p>Date of Birth: {new Date(user.DateOfBirth).toLocaleDateString()}</p>

          </li>
        ))}
      </ul>
      <br />
      <div>
        <h2>Get user by phone</h2>
        <div>
          <h3>User by {phoneNumber}</h3>
          <div>
            {userByPhone.length === 1 ? (
              <div>
                <p>Name: {userByPhone[0].Name}</p>
                <p>Surname: {userByPhone[0].Surname}</p>
                <p>Phone Number: {userByPhone[0].PhoneNumber}</p>
                <p>Date of Birth: {new Date(userByPhone[0].DateOfBirth).toLocaleDateString()}</p>
              </div>
            ) : (
              <p>Not found</p>
            )}
          </div>
        </div>
        <textarea ref={pN} />
        <br />
        <button onClick={getValueFromTextarea}>Get Textarea Value</button>
      </div>
    </div>
  );
}

export default TestComponent;
