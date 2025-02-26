import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';

const Section = styled.section`
  width: 100%;
  background-color: ${(props) => props.theme.body};
`;

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #968df0;
  position: fixed;
  width: 75%;
  height: 10%;
  padding: 0 12.5%;
  margin: 0 auto;
  z-index: 1000;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
  gap: 0.5rem;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
`;

const Menu = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
`;

const MenuItem = styled.li`
  margin: 0 1rem;
  color: ${(props) => props.theme.text};
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.8rem 1.5rem;
  transition: transform 0.3s ease, color 0.3s ease;
  text-decoration: none;

  &:hover {
    transform: scale(1.1);
    color: orange;
  }
`;

const Navigation = () => {
  return (
    <Section id="navigation">
      <NavBar>
        <Title>
          <FaEye /> Electron Eye
        </Title>
        <Menu>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <MenuItem>Home</MenuItem>
          </Link>
          <Link to="/documentation" style={{ textDecoration: 'none' }}>
            <MenuItem>Documentation</MenuItem>
          </Link>
          <Link to="/team" style={{ textDecoration: 'none' }}>
            <MenuItem>Team</MenuItem>
          </Link>
        </Menu>
      </NavBar>
    </Section>
  );
};

export default Navigation;
