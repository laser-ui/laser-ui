export {};

export interface SidebarProps {
  route: 'home' | 'docs' | 'components';
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
}
