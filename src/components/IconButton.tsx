import Icon from '@mdi/react';
import React from 'react';
import styled from 'styled-components';

export type IconButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  path: string;
};

const Button = styled.button`
  background: none;
  border: solid 1px rgba(255, 255, 255, 0);
  border-radius: 5px;
  cursor: pointer;
  display: inline-block;
  height: 50px;
  width: 50px;

  &:hover,
  &:focus {
    border: solid 1px #eee;
  }
`;

export const IconButton: React.FC<IconButtonProps> = ({ path, ...props }) => {
  return (
    <Button {...props}>
      <Icon path={path} />
    </Button>
  );
};
