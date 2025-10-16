export interface SettingsItem {
  id: number;
  icon: string;
  iconColor: string;
  title: string;
  description: string;
}

export const accountSettingsItems: SettingsItem[] = [
  { id: 1, icon: 'time-outline', iconColor: '#3b82f6', title: 'Order History', description: 'View all your transactions' },
  { id: 2, icon: 'people-outline', iconColor: '#10b981', title: 'Referrals', description: 'Invite friends & earn amazing rewards' },
  { id: 3, icon: 'notifications-outline', iconColor: '#8b5cf6', title: 'Notifications', description: 'Manage your notifications' },
  { id: 4, icon: 'language-outline', iconColor: '#3b82f6', title: 'Language', description: 'Change app language' },
];


