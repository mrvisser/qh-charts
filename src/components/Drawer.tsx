import { mdiClose } from '@mdi/js';
import React from 'react';
import styled from 'styled-components';

import { IconButton } from './IconButton';
import { FadeIn } from './transitions/FadeIn';
import { SlideFromRight } from './transitions/SlideFromRight';

const Mask = styled(FadeIn)`
  background-color: rgba(0, 0, 0, 0.4);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
`;

const Container = styled(SlideFromRight)`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-x: hidden;
  position: fixed;
  right: 0;
  top: 0;
  width: auto;
  z-index: 1000;

  &.enter,
  &.enter-done,
  &.exit {
    box-shadow: -3px 0px 10px 1px rgba(0, 0, 0, 0.5);
  }
`;

const Box = styled.div`
  padding: 20px;
`;

const Header = styled(Box)`
  align-items: center;
  display: flex;
  flex-direction: row;
  z-index: 1;

  &.scrolling {
    box-shadow: 0px 3px 10px 1px rgba(0, 0, 0, 0.5);
  }
`;

const Title = styled.h1`
  flex: 1;
  font-size: 24px;
  font-weight: 400;
  white-space: nowrap;
`;

const Body = styled(Box)`
  flex: 1;
  overflow-y: auto;
`;

export type DrawerProps = React.HTMLAttributes<HTMLDivElement> & {
  active: boolean;
  onClose?: () => void;
  title?: string;
};

export const Drawer: React.FC<DrawerProps> = ({
  active,
  children,
  onClose,
  title,
  ...props
}) => {
  const [isScrolling, setIsScrolling] = React.useState(false);

  React.useEffect(() => {
    if (active) {
      // eslint-disable-next-line no-console
      console.log('active changed', active);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [active]);

  return (
    <>
      <Mask active={active} onClick={onClose} />
      <Container active={active}>
        {title !== undefined || onClose !== undefined ? (
          <Header className={isScrolling ? 'scrolling' : undefined}>
            <Title>{title}</Title>
            {onClose !== undefined ? (
              <IconButton path={mdiClose} onClick={onClose} />
            ) : undefined}
          </Header>
        ) : undefined}
        <Body
          {...props}
          onScroll={(ev) => {
            if (ev.currentTarget.scrollTop > 0) {
              setIsScrolling(true);
            } else {
              setIsScrolling(false);
            }
          }}
        >
          {children}
        </Body>
      </Container>
    </>
  );
};
