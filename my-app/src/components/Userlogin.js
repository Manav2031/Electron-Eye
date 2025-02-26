import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { AiOutlineLogin } from 'react-icons/ai';

const Container = styled.div`
  width: 75%;
  min-height: 100vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
`;

function Userlogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userNotification, setUserNotification] = useState(null);
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmituser = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'https://electron-eye.onrender.com/api/login',
        {
          username,
          password,
        }
      );

      if (response.data._id) {
        const userId = response.data._id;
        setUserNotification('Logged in successfully');
        navigate('/add-system', { state: { userId } });
      } else {
        setUserNotification('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setUserNotification('An error occurred. Please try again.');
    }
  };

  return (
    <Container>
      <div className="section">
        <h2>Login User</h2>
        <form onSubmit={handleSubmituser}>
          <div>
            <label>
              <FaUser /> Username:
            </label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              required
            />
          </div>
          <div>
            <label>
              <FaLock /> Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit">
            <AiOutlineLogin /> Submit
          </button>
          {userNotification && <p>{userNotification}</p>}
        </form>
        <p>
          Not registered?
          <a href="/register" style={{ textDecoration: 'none' }}>
            {' '}
            Create an Account
          </a>
        </p>
      </div>
    </Container>
  );
}

export default Userlogin;
