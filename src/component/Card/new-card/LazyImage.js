import React from "react";
import styled, { keyframes } from "styled-components";

const loadingAnimation = keyframes`
  0% {
    background-color: #f5f5f5;
  }
  50% {
    background-color: #f5f5f5;
  }

  100% {
    background-color: #f5f5f5;
  }

`;

const Placeholder = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  animation: ${loadingAnimation} 2s infinite;
  background: #f5f5f5;
`;

const LazyImage = (props) => {

  return (
    <>
      <Placeholder />
    </>
  );
};

export default React.memo(LazyImage);
