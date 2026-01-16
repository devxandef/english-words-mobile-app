import styled from 'styled-components/native';
import { COLORS } from '../../constants';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${COLORS.backgroundDark};
`;

export const LoadingText = styled.Text`
  margin-top: 16px;
  font-size: 14px;
  color: ${COLORS.textSecondary};
  font-weight: 500;
`;

