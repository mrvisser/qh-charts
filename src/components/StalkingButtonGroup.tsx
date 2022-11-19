import Icon from '@mdi/react';
import React from 'react';
import styled from 'styled-components';

const buttonSizePx = 75;
const colorDefault = '#ccc';
const colorHover = '#888';

const StalkingButtonContainer = styled.button`
  background-color: #fff;
  border: solid 1px ${colorDefault};
  border-radius: ${buttonSizePx / 2}px;
  color: ${colorDefault};
  cursor: pointer;
  display: block;
  height: ${buttonSizePx}px;
  margin: 25px;
  padding: 0;
  transition: border-color 250ms ease-in, color 250ms ease-in;
  width: ${buttonSizePx}px;

  &:hover,
  &:focus {
    border-color: ${colorHover};
    color: ${colorHover};
  }
`;

export const StalkingButtonGroup = styled.div`
  left: 0;
  position: fixed;
  top: 0;
  z-index: 999;

  @media print {
    display: none;
  }
`;

export type StalkingButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  path: string;
};

export const StalkingButton: React.FC<StalkingButtonProps> = ({
  path,
  ...props
}) => {
  return (
    <StalkingButtonContainer {...props}>
      <Icon path={path} />
    </StalkingButtonContainer>
  );
};
