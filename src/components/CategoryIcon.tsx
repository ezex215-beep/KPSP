import React from 'react';
import {
  Utensils,
  Car,
  ShoppingBag,
  Home,
  Zap,
  Film,
  HeartPulse,
  Briefcase,
  Coins,
  CreditCard,
  Coffee,
  Plane,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { CategoryColor } from '../types';

interface CategoryIconProps {
  iconName: string;
  color?: CategoryColor;
  size?: number;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  iconName,
  color = 'cyan',
  size = 18,
  className = '',
}) => {
  const getIcon = () => {
    switch (iconName.toLowerCase()) {
      case 'utensils':
      case 'restaurant':
      case 'food':
        return <Utensils size={size} />;
      case 'car':
      case 'directions_car':
      case 'transport':
        return <Car size={size} />;
      case 'shoppingbag':
      case 'shopping_bag':
      case 'shopping':
        return <ShoppingBag size={size} />;
      case 'home':
      case 'housing':
        return <Home size={size} />;
      case 'zap':
      case 'utilities':
        return <Zap size={size} />;
      case 'film':
      case 'entertainment':
        return <Film size={size} />;
      case 'heartpulse':
      case 'health':
        return <HeartPulse size={size} />;
      case 'briefcase':
      case 'salary':
        return <Briefcase size={size} />;
      case 'coins':
      case 'freelance':
        return <Coins size={size} />;
      case 'coffee':
        return <Coffee size={size} />;
      case 'plane':
        return <Plane size={size} />;
      case 'gift':
        return <Gift size={size} />;
      case 'creditcard':
        return <CreditCard size={size} />;
      default:
        return <HelpCircle size={size} />;
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'error':
        return 'bg-[#93000a]/30 border-[#ffb4ab] text-[#ffb4ab]';
      case 'cyan':
        return 'bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF]';
      case 'yellow':
        return 'bg-yellow-900/30 border-yellow-500 text-yellow-400';
      case 'green':
        return 'bg-[#39FF14]/10 border-[#39FF14] text-[#39FF14]';
      case 'purple':
        return 'bg-purple-900/30 border-purple-400 text-purple-300';
      default:
        return 'bg-[#00E5FF]/10 border-[#00E5FF] text-[#00E5FF]';
    }
  };

  return (
    <div
      className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-transform ${getColorClasses()} ${className}`}
    >
      {getIcon()}
    </div>
  );
};
