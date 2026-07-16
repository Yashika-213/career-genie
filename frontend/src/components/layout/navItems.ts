import {
  Home,
  Sparkles,
  Map,
  LayoutDashboard,
  BookOpen,
  Lightbulb,
  MessageSquare,
  GitCompare,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/recommend', label: 'Career Match', icon: Sparkles },
  { to: '/roadmap', label: 'Roadmap', icon: Map },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/resources', label: 'Resources', icon: BookOpen },
  { to: '/projects', label: 'Project Ideas', icon: Lightbulb },
  { to: '/compare', label: 'Compare', icon: GitCompare },
  { to: '/chatbot', label: 'AI Assistant', icon: MessageSquare },
];
