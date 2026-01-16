import styled from 'styled-components/native';
import { COLORS, SPACING } from '../../constants';

export const TabContainer = styled.View`
  flex-direction: row;
  background-color: ${COLORS.header};
  padding: ${SPACING.xs}px ${SPACING.sm}px;
  border-bottom-width: 1px;
  border-bottom-color: ${COLORS.borderLight};
`;

export const TabButton = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  padding: ${SPACING.sm}px ${SPACING.md}px;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-radius: 10px;
  margin-horizontal: ${SPACING.xs}px;
  position: relative;
  min-height: 48px;
  flex-direction: row;
  gap: ${SPACING.xs}px;
`;

export const ActiveIndicator = styled.View<{ active: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: ${COLORS.background};
  border-radius: 2px 2px 0 0;
  opacity: ${(props) => (props.active ? 1 : 0)};
`;

export const TabText = styled.Text<{ active: boolean }>`
  font-size: 14px;
  font-weight: ${(props) => (props.active ? '600' : '400')};
  color: ${(props) => (props.active ? COLORS.background : 'rgba(255, 255, 255, 0.7)')};
  letter-spacing: 0.3px;
`;

export const IconContainer = styled.View`
  margin-right: ${SPACING.xs}px;
`;

