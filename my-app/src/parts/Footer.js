import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  text-align: center;
  position: fixed;
  padding-top: 0;
  background-color: #968df0;
  color: black;
  padding: 20px;
  bottom: 0;
  width: 100%;
`;

const FooterText = styled.p`
  font-size: 0.9rem;
  margin-top: 10px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterText>Electron Eye &copy; 2025. All rights reserved.</FooterText>
    </FooterContainer>
  );
};

export default Footer;
