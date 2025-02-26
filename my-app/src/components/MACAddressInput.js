import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  width: 80%;
  max-width: 400px;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 90%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 50%;
  text-align: center;
  margin-left: 100px;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const TableContainer = styled.div`
  margin-top: 20px;
  max-height: 70vh; /* Limit the height of the table container */
  overflow-y: auto; /* Add vertical scroll for overflow */
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  background-color: #f2f2f2;
  color: #333;
`;

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const NoData = styled.div`
  margin-top: 10px;
  color: #555;
`;

const MACAddressInput = () => {
  const [macAddress, setMacAddress] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [trackStatus, setTrackStatus] = useState([]);

  const handleInputChange = (e) => {
    setMacAddress(e.target.value);
  };

  const startTracking = async () => {
    try {
      if (macAddress === '') {
        toast.error('MAC Address is required.');
        return;
      }
      setIsLoading(true);
      const response = await axios.post(
        'https://electron-eye.onrender.com/api/startTracking',
        { macAddress }
      );
      setTrackStatus(response.data.message);
      setIsTracking(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getTracking = async () => {
    try {
      const trackingResponse = await axios.post(
        'https://electron-eye.onrender.com/api/getTracking',
        {
          macAddress: macAddress,
        }
      );

      setTrackStatus(trackingResponse.data);
      setIsTracking(true);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const stopTracking = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://electron-eye.onrender.com/api/stopTracking'
      );
      setTrackStatus(response.data.message);
      setIsTracking(false);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <FormContainer>
        <Input
          type="text"
          value={macAddress}
          onChange={handleInputChange}
          placeholder="Enter MAC address"
        />
        {!isTracking ? (
          <Button onClick={startTracking}>Start Tracking</Button>
        ) : (
          <>
            <Button onClick={stopTracking}>Stop Tracking</Button>
            <br /> <br />
            <Button onClick={getTracking}>Display Tracking</Button>
          </>
        )}

        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <TableContainer>
            {Array.isArray(trackStatus) && trackStatus.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <Th>Timestamp</Th>
                    <Th>Process ID</Th>
                    <Th>Name</Th>
                  </tr>
                </thead>
                <tbody>
                  {trackStatus.map((item, index) => (
                    <tr key={index}>
                      <Td>{item.timestamp}</Td>
                      <Td>{item.pid}</Td>
                      <Td>{item.name}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <NoData>No tracking data available.</NoData>
            )}
          </TableContainer>
        )}
      </FormContainer>
    </Container>
  );
};

export default MACAddressInput;
