import React from 'react';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';

export type FadeInProps = React.HTMLAttributes<HTMLDivElement> & {
  active: boolean;
};

const Container = styled.div`
  display: none;
  transition: opacity 250ms ease-in;

  &.enter,
  &.enter-done,
  &.exit {
    display: block;
  }

  &.enter {
    opacity: 0;
  }
  &.enter.enter-active {
    opacity: 1;
  }

  &.exit {
    opacity: 1;
  }
  &.exit.exit-active {
    opacity: 0;
  }
`;

export const FadeIn: React.FC<FadeInProps> = ({
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
