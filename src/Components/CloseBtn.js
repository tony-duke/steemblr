import styled from "styled-components";

const CloseBtn = styled.button`
  padding: 10px;
  border: 0;
  background-color: transparent;
  outline: none;
  cursor: pointer;
  font-weight: 700;
  transition: 0.5s;
  &:focus {
    background-color: #808e95;
    transition: 0.5s;
  }
`;

export default CloseBtn;
