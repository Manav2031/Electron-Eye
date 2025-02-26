import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import alertSound from '../sounds/alert.mp3'; // Add an alert sound file

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

const ConnectedDevices = () => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [penDriveDetected, setPenDriveDetected] = useState(false);
  const location = useLocation();
  const macAddress = location.state?.macAddress; // Get MAC address from state

  // Create an Audio object
  const audio = new Audio(alertSound);

  // Function to fetch connected devices
  const fetchConnectedDevices = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        'https://electron-eye.onrender.com/api/display-connected-devices',
        { macAddress: macAddress }
      );
      setDevices(response.data);

      let isPenDriveDetected = false;
      response.data.forEach((device) => {
        if (device['Device Type'] === 'Secondary Storage') {
          isPenDriveDetected = true;
          if (!penDriveDetected) {
            audio.play();
            toast.error('Pen drive detected!', {
              position: 'top-center',
              autoClose: 10000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            // Send request to shutdown system
            // axios.post('https://electron-eye.onrender.com/api/shutdown-system');
          }
        }
      });

      if (!isPenDriveDetected && penDriveDetected) {
        audio.pause();
        audio.currentTime = 0;
        toast.info('Pen drive removed!', {
          position: 'top-center',
          autoClose: 10000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }

      setPenDriveDetected(isPenDriveDetected); // Update the state based on detection
      setIsLoading(false);
    } catch (error) {
      console.error(
        'Error fetching connected devices:',
        error.response ? error.response.data : error.message
      );
      setIsLoading(false);
    }
  };

  // Use useEffect to fetch data periodically
  useEffect(() => {
    fetchConnectedDevices(); // Fetch data immediately on component mount
    const interval = setInterval(fetchConnectedDevices, 5000); // Fetch data every 5 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [macAddress, penDriveDetected]); // Track penDriveDetected state

  return (
    <Container>
      <TableContainer>
        {isLoading ? (
          <NoData>Loading...</NoData>
        ) : (
          <>
            {Array.isArray(devices) && devices.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <Th>Timestamp</Th>
                    <Th>Device Type</Th>
                    <Th>Device Name</Th>
                    <Th>MAC Address</Th>
                    <Th>Signal Strength</Th>
                    <Th>Mount Point</Th>
                    <Th>File System Type</Th>
                    <Th>Total Size (in GB)</Th>
                    <Th>Used Size (in GB)</Th>
                    <Th>Free Size (in GB)</Th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device, index) => (
                    <tr key={index}>
                      <Td>{device.timestamp}</Td>
                      <Td>{device['Device Type']}</Td>
                      <Td>{device['Device Name']}</Td>
                      <Td>{device['MAC Address']}</Td>
                      <Td>{device['Signal Strength']}</Td>
                      <Td>{device['Mount Point']}</Td>
                      <Td>{device['File System Type']}</Td>
                      <Td>{device['Total Size (GB)']}</Td>
                      <Td>{device['Used Size (GB)']}</Td>
                      <Td>{device['Free Size (GB)']}</Td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <NoData>No connected devices found.</NoData>
            )}
          </>
        )}
      </TableContainer>
    </Container>
  );
};

export default ConnectedDevices;
