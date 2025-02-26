import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaIdBadge } from 'react-icons/fa';
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

function UserRegistration() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [labId, setLabId] = useState('');
  const [userNotification, setUserNotification] = useState(null);
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleLabIdChange = (event) => {
    setLabId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username || !password || !labId) {
      setUserNotification('All fields are required.');
      return;
    }

    try {
      const response = await axios.post(
        'https://electron-eye.onrender.com/api/register',
        {
          username,
          password,
          labId,
        }
      );

      if (response.data && response.data._id) {
        setUserNotification('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setUserNotification(response.data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error(
        'Registration error:',
        error.response?.data || error.message
      );
      setUserNotification(
        error.response?.data?.message ||
          'An error occurred during registration.'
      );
    }
  };

  return (
    <Container>
      <div className="section">
        <h2>Register User</h2>
        <form onSubmit={handleSubmit}>
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
          <div>
            <label>
              <FaIdBadge /> Lab ID:
            </label>
            <input
              type="text"
              value={labId}
              onChange={handleLabIdChange}
              required
            />
          </div>
          <button type="submit">
            {' '}
            <AiOutlineLogin /> Register
          </button>
          {userNotification && <p>{userNotification}</p>}
        </form>
        <p>
          Already have an account?{' '}
          <a href="/login" style={{ textDecoration: 'none' }}>
            {' '}
            Log in
          </a>
        </p>
      </div>
    </Container>
  );
}

export default UserRegistration;
