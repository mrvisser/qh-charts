import styled from 'styled-components';

export const InputText = styled.input`
  & {
    border: solid 1px #ddd;
    border-radius: 5px;
    font-size: 16px;
    margin-right: 10px;
    padding: 10px;
  }

  &:focus {
    border-color: #888;
  }
`;
