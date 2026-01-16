import React, { useState } from 'react';
import { Modal } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants';
import { UserAvatarProps } from './UserAvatar.types';
import {
  AvatarContainer,
  AvatarButton,
  AvatarImage,
  AvatarIcon,
  MenuOverlay,
  MenuContainer,
  MenuItem,
  MenuItemText,
} from './UserAvatar.styles';

export const UserAvatar: React.FC<UserAvatarProps> = ({ photoURL, onLogout }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleAvatarPress = () => {
    setMenuVisible(true);
  };

  const handleLogout = () => {
    setMenuVisible(false);
    onLogout();
  };

  const handleCloseMenu = () => {
    setMenuVisible(false);
  };

  return (
    <AvatarContainer>
      <AvatarButton onPress={handleAvatarPress} activeOpacity={0.7}>
        {photoURL ? (
          <AvatarImage source={{ uri: photoURL }} />
        ) : (
          <AvatarIcon>
            <Icon name="account-circle" size={36} color={COLORS.background} />
          </AvatarIcon>
        )}
      </AvatarButton>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseMenu}
      >
        <MenuOverlay activeOpacity={1} onPress={handleCloseMenu}>
          <MenuContainer onStartShouldSetResponder={() => true}>
            <MenuItem onPress={handleLogout} activeOpacity={0.7}>
              <Icon name="logout" size={20} color={COLORS.favorite} />
              <MenuItemText>Sair</MenuItemText>
            </MenuItem>
          </MenuContainer>
        </MenuOverlay>
      </Modal>
    </AvatarContainer>
  );
};

