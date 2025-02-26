import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Button from '../parts/Button';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userNotification, setUserNotification] = useState(null);
  const [machineNotification, setMachineNotification] = useState(null);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmituser = async (event) => {
    event.preventDefault();
    axios
      .post('https://electron-eye.onrender.com/adduser', { username, password })
      .then((result) => {
        console.log(result);
        setUserNotification('User added successfully');
      })
      .catch((err) => console.log(err));
  };
  const [macAddress, setMacAddress] = useState('');

  const handleMacAddressChange = (event) => {
    setMacAddress(event.target.value);
  };

  const handleSubmitmachine = async (event) => {
    event.preventDefault();
    axios
      .post('https://electron-eye.onrender.com/add-machine-info', {
        macAddress,
      })
      .then((result) => {
        console.log(result);
        setMachineNotification('Machine info added successfully');
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      <div className="container">
        <div className="section">
          <h2>Add User Info</h2>
          <form onSubmit={handleSubmituser}>
            <div>
              <label>Username:</label>
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                required
              />
            </div>
            <div>
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <button type="submit">Add User</button>
            {userNotification && <p>{userNotification}</p>}
          </form>
        </div>

        <div className="section">
          <h2>Add Machine Info</h2>
          <form onSubmit={handleSubmitmachine}>
            <div>
              <label>MAC Address:</label>
              <input
                type="text"
                value={macAddress}
                onChange={handleMacAddressChange}
                required
              />
            </div>
            <button type="submit">Add Info</button>
            {machineNotification && <p>{machineNotification}</p>}
          </form>
        </div>
      </div>
      <div className="Home">
        <Link to="/">
          <Button text="Home"></Button>
        </Link>
      </div>
    </>
  );
};

export default Admin;
