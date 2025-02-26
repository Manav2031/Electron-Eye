import React from "react";
import styled from "styled-components";
import { FaServer, FaChartLine, FaTools, FaDesktop, FaShieldAlt, FaCogs } from "react-icons/fa";

const PageContainer = styled.div`
  font-family: Arial, sans-serif;
  padding: 32px;
  background-color: #f4f4f9;
  color: #333;
  text-align: center;
`;

const Section = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin: 100px;
`;

const Block = styled.div`
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  transition: transform 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.05);
  }
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: #6200ea;
  margin-bottom: 15px;
`;

const SubTitle = styled.h2`
  font-size: 1.8rem;
  color: #34495e;
  margin-bottom: 10px;
`;

const Paragraph = styled.p`
  font-size: 1.1rem;
`;

const DocumentationPage = () => {
  return (
    <PageContainer>

      <Section>
        <Block>
          <IconWrapper><FaServer /></IconWrapper>
          <SubTitle>Centralized Data Management</SubTitle>
          <Paragraph>Consolidates system usage and health data for real-time monitoring.</Paragraph>
        </Block>

        <Block>
          <IconWrapper><FaChartLine /></IconWrapper>
          <SubTitle>Predictive Maintenance</SubTitle>
          <Paragraph>Uses machine learning to anticipate system failures and schedule maintenance.</Paragraph>
        </Block>

        <Block>
          <IconWrapper><FaDesktop /></IconWrapper>
          <SubTitle>Advanced Visualization</SubTitle>
          <Paragraph>Interactive Power BI dashboards for deep insights into system performance.</Paragraph>
        </Block>
      </Section>

      <Section>
        <Block>
          <IconWrapper><FaShieldAlt /></IconWrapper>
          <SubTitle>Enhanced Security</SubTitle>
          <Paragraph>Ensures robust security protocols to safeguard system integrity.</Paragraph>
        </Block>

        <Block>
          <IconWrapper><FaTools /></IconWrapper>
          <SubTitle>Proactive Maintenance</SubTitle>
          <Paragraph>Reduces downtime by predicting system issues before they occur.</Paragraph>
        </Block>

        <Block>
          <IconWrapper><FaCogs /></IconWrapper>
          <SubTitle>Optimized Resource Allocation</SubTitle>
          <Paragraph>Helps allocate computing resources efficiently based on usage trends.</Paragraph>
        </Block>
      </Section>
    </PageContainer>
  );
};

export default DocumentationPage;
