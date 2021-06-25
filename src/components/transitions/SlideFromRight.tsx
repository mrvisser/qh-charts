import React from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

export type SlideFromRightProps = React.HTMLAttributes<HTMLDivElement> & {
  active: boolean;
};

const Container = styled.div`
  transform: translateX(100%);
  transition: transform 250ms ease-in;

  &.enter {
    transform: translateX(100%);
  }

  &.enter.enter-active,
  &.enter-done {
    transform: translateX(0);
  }

  &.exit {
    transform: translateX(0);
  }

  &.exit.exit-active {
    transform: translateX(100%);
  }
`;

export const SlideFromRight: React.FC<SlideFromRightProps> = ({
  active,
  children,
  ...props
}) => {
  const containerRef = React.useRef(null);
  return (
    <CSSTransition
      addEndListener={() => undefined}
      in={active}
      nodeRef={containerRef}
      timeout={250}
    >
      <Container {...props} ref={containerRef}>
        {children}
      </Container>
    </CSSTransition>
  );
};
