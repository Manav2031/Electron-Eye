import React,{ useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components'

const Container = styled.div`
width: 75%;
min-height: 100vh;
margin:0 auto;
display: flex;
justify-content: center;
align-items:center;
`
function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate =useNavigate('');
  
    const handleUsernameChange = (event) => {
      setUsername(event.target.value);
    };
  
    const handlePasswordChange = (event) => {
      setPassword(event.target.value);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      // Here you can implement your authentication logic
      console.log('Username:', username);
      console.log('Password:', password);
      // For demonstration purposes, let's just clear the inputs
      if (username === 'Admin' && password === 'pict') {
        // Navigate to new page
        navigate('/Admin');
    } else {
        alert('Invalid username or password');
    }
    };
  
    return (
      <div className='Adminlogin'>
        <Container>      
        <form onSubmit={handleSubmit}>
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
          <button type="submit" >Login</button>
        </form>
        </Container>
        
      </div>
 )
}

export default AdminLogin