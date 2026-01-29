import styled from 'styled-components/native';
import { TouchableOpacityProps } from 'react-native';

export const Container = styled.TouchableOpacity<TouchableOpacityProps>`
  background: ${({ disabled }: TouchableOpacityProps) => (disabled ? '#999' : '#D73035')};
  border-radius: 48px;
  padding: 14px 24px;
  align-items: center;
  justify-content: center;
`;