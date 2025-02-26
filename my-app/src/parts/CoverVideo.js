import React from 'react';
import styled from 'styled-components';
import GIF from '../assets/giphy.gif';

const VideoContainer = styled.div`
  width: 100%;
  video {
    width: 100%;
    height: auto;
  }
`;

const CoverVideo = () => {
  return (
    <VideoContainer>
      <img src={GIF} alt="Cover GIF" />
    </VideoContainer>
  );
};

export default CoverVideo;
