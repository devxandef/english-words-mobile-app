import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../constants';
import { TabType } from '../../types';
import { TabBarProps } from './TabBar.types';
import {
  TabContainer,
  TabButton,
  ActiveIndicator,
  TabText,
  IconContainer,
} from './TabBar.styles';

export const TabBar: React.FC<TabBarProps> = ({ activeTab, onTabChange }) => {
  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: 'wordlist', label: 'Word list', icon: 'list' },
    { key: 'history', label: 'History', icon: 'history' },
    { key: 'favorites', label: 'Favorites', icon: 'favorite' },
  ];

  return (
    <TabContainer>
      {tabs.map((tab) => (
        <TabButton
          key={tab.key}
          active={activeTab === tab.key}
          onPress={() => onTabChange(tab.key)}
          activeOpacity={0.7}
        >
          <IconContainer>
            <Icon
              name={tab.icon}
              size={20}
              color={
                activeTab === tab.key ? COLORS.background : 'rgba(255, 255, 255, 0.7)'
              }
            />
          </IconContainer>
          <TabText active={activeTab === tab.key}>{tab.label}</TabText>
          <ActiveIndicator active={activeTab === tab.key} />
        </TabButton>
      ))}
    </TabContainer>
  );
};

