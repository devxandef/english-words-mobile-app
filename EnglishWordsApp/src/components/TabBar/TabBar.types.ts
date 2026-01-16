import { TabType } from '../../types';

export interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

