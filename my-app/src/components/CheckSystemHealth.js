import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
`;

const TableContainer = styled.div`
  width: 100%;
  height: 100vh;
  padding: 20px;
  background-color: #fff;
  margin-top: 190px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 12px;
  background-color: #007bff;
  color: #fff;
  text-align: left;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 12px;
`;

const NoData = styled.div`
  margin-top: 10px;
  color: #555;
  text-align: center;
`;

const CheckSystemHealth = () => {
  const [trackStatus, setTrackStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const macAddress = location.state?.macAddress; // Get MAC address from state

  // Function to fetch tracking data
  const fetchTrackingData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://electron-eye.onrender.com/api/check-system-health',
        {
          macAddress: macAddress,
        }
      );
      setTrackStatus(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      setIsLoading(false);
    }
  };

  // Use useEffect to fetch data periodically
  useEffect(() => {
    fetchTrackingData(); // Fetch data immediately on component mount
    const interval = setInterval(fetchTrackingData, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [macAddress]);

  return (
    <Container>
      <TableContainer>
        {isLoading ? (
          <NoData>Loading...</NoData>
        ) : (
          <>
            {Array.isArray(trackStatus) && trackStatus.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <Th>Timestamp</Th>
                    <Th>CPU Usage (in %)</Th>
                    <Th>Memory Used (in GB)</Th>
                    <Th>Memory Total (in GB)</Th>
                    <Th>Disk Used (in GB)</Th>
                    <Th>Disk Total (in GB)</Th>
                  </tr>
                </thead>
                <tbody>
                  {trackStatus.map((item, index) => (
                    <tr key={index}>
                      <Td>{item.timestamp}</Td>
                      <Td>{item.cpu_usage}</Td>
                      <Td>{item.memory_used}</Td>
                      <Td>{item.memory_total}</Td>
                      <Td>{item.disk_used}</Td>
                      <Td>{item.disk_total}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <NoData>No tracking data available.</NoData>
            )}
          </>
        )}
      </TableContainer>
    </Container>
  );
};

export default CheckSystemHealth;
