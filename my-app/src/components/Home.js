import { React } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import TypeWriter from '../parts/TypeWriter';
import CoverVideo from '../parts/CoverVideo';

const Section = styled.section`
  min-height: 80vh;
  width: 100vw;
  position: relative;
  background-color: ${(props) => props.theme.body};
`;

const Container = styled.div`
  width: 75%;
  min-height: 85vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  margin-top:50px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ButtonContainer = styled.div`
  width: 80%;
  align-self: flex-start;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const StyledButton = styled.button`
  font-size: 1.2rem;
  font-weight: bold;
  padding: 12px 24px;
  margin: 10px 0;
  border: none;
  border-radius: 8px;
  background-color: #968df0;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #500073;
  }
`;

function Home() {
  return (
    <div>
      <Section id="home">
        <Container>
          <Box>
            <TypeWriter />
            <ButtonContainer>
              <StyledLink to="/Register">
                <StyledButton>Register</StyledButton>
              </StyledLink>
              <br />
              <StyledLink to="/Login">
                <StyledButton>Login</StyledButton>
              </StyledLink>
            </ButtonContainer>
          </Box>
          <Box>
            <CoverVideo />
          </Box>
        </Container>
      </Section>
    </div>
  );
}

export default Home;
