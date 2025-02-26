import React from 'react';
import styled from 'styled-components';
import user from '../assets/user-icon.png';

const Section = styled.section`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.body};
  padding: 2rem 0;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: ${(props) => props.theme.primary};
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: center;
`;

const Container = styled.div`
  width: 90%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  margin: 2rem 0;
`;

const Cube = styled.div`
  width: 30%;
  min-width: 250px;
  max-width: 300px;
  padding: 1rem;
  border-radius: 10px;
  background-color: ${(props) => props.theme.secondary};
  color: ${(props) => props.theme.text};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 1rem 0;
  object-fit: cover;
  border: 3px solid ${(props) => props.theme.primary};
`;

const Name = styled.h3`
  font-size: 1.5rem;
  margin: 0.5rem 0;
  color: ${(props) => props.theme.primary};
`;

const Info = styled.p`
  font-size: 1rem;
  line-height: 1.4;
  color: ${(props) => props.theme.textSecondary};
`;

function Team() {
  const teamMembers = [
    {
      name: 'Rutwik Malav',
      image: 'https://via.placeholder.com/100',
      info: 'Backend Developer focusing on Node.js and database management.',
    },
    {
      name: 'Shruti Maliye',
      image: 'https://via.placeholder.com/100',
      info: 'Frontend Developer with expertise in React and UI/UX design.',
    },
    {
      name: 'Manav Mehta',
      image: 'https://via.placeholder.com/100',
      info: 'Full-Stack Developer experienced in building scalable web apps.',
    },
    {
      name: 'Nikita More',
      image: 'https://via.placeholder.com/100',
      info: 'Full-Stack Developer experienced in building scalable web apps.',
    },
  ];

  return (
    <Section>
      <Title>Meet Our Team</Title>
      <Container>
        {teamMembers.map((member, index) => (
          <Cube key={index}>
            <Image src={user} alt="Logo" />
            <Name>{member.name}</Name>
            <Info>{member.info}</Info>
          </Cube>
        ))}
      </Container>
    </Section>
  );
}

export default Team;
