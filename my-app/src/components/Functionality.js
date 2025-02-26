import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaNetworkWired, FaClipboardList, FaLaptop, FaHistory, FaHeartbeat, FaChartBar } from 'react-icons/fa';
import { MdDevices, MdOutlineNetworkCheck } from 'react-icons/md';

const Section = styled.section`
  min-height: 90vh;
  width: 100vw;
  position: relative;
  background-color: ${(props) => props.theme.body || "#f4f4f4"};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  width: 80%;
  min-height: 85vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const ButtonContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
`;

const Button = styled(Link)`
  width: 75%;
  padding: 1.5rem;
  font-size: 1.3rem;
  color: ${(props) => props.theme.text || "white"};
  background-color: ${(props) => props.theme.primary || "#968df0"};
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-weight: bold;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${(props) => props.theme.secondary || "#500073"};
    transform: scale(1.05);
  }

  svg {
    font-size: 1.8rem;
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  color: ${(props) => props.theme.text || "#333"};
  margin-bottom: 1.5rem;
`;

function Functionality() {
  const location = useLocation();
  const macAddress = location.state?.macAddress; // Get the MAC address from state

  return (
    <Section id="Functionality">
      <Container>
        <Title> <FaLaptop></FaLaptop> System Monitoring Options</Title>
        <ButtonContainer>
          <Button to="/view-logs" state={{ macAddress }}>
            <FaClipboardList /> View Process Details
          </Button>
          <Button to="/view-network-details" state={{ macAddress }}>
            <FaNetworkWired /> View Network Details
          </Button>
          <Button to="/view-network-requests" state={{ macAddress }}>
            <MdOutlineNetworkCheck /> View Network Requests
          </Button>
          <Button to="/view-connected-devices" state={{ macAddress }}>
            <MdDevices /> View Connected Devices
          </Button>
          <Button to="/view-browser-history" state={{ macAddress }}>
            <FaHistory /> View Browser History
          </Button>
          <Button to="/check-system-health" state={{ macAddress }}>
            <FaHeartbeat /> View System Health
          </Button>
          <Button to="/view-graphs" state={{ macAddress }}>
            <FaChartBar /> View Graphs
          </Button>
        </ButtonContainer>
      </Container>
    </Section>
  );
}

export default Functionality;
