import React from 'react';
import styled from 'styled-components';

const Section = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align to top for better layout */
  background-color: ${(props) => props.theme.body || '#f4f4f4'};
  padding: 0;
`;

const IframeContainer = styled.div`
  width: 100%;
  height: 105vh;
  max-width: 1400px;
  margin-top: 80px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Iframe = styled.iframe`
  width: 100%;
  height: 100%;
  border: 0;
`;

function PowerBIDashboard() {
  return (
    <Section>
      <IframeContainer>
        <Iframe
          title="System Analytics Dashboard"
          src="https://app.powerbi.com/reportEmbed?reportId=5185c4f6-ca64-48dd-a4db-f73f2151df5e&autoAuth=true&ctid=0a0aa63d-82d0-4ba1-b909-d7986ece4c4c"
          allowFullScreen={true}
        />
      </IframeContainer>
    </Section>
  );
}

export default PowerBIDashboard;
