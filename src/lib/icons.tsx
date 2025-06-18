import React from 'react';
import * as PhosphorIcons from '@phosphor-icons/react';
import iconMapping from '../../icon-mapping.json';

// Type for icon names from our mapping
export type IconName = keyof typeof iconMapping;

// Default icon props
const defaultIconProps = {
  size: 24,
  weight: 'regular' as const,
};

/**
 * Get a Phosphor icon component by name, using our Lucide-to-Phosphor mapping
 * @param iconName - The Lucide icon name to map to Phosphor
 * @param props - Additional props to pass to the icon
 * @returns React component for the icon
 */
export function getIcon(
  iconName: string | undefined,
  props: any = {}
): React.ReactNode {
  const mappedIconName = iconMapping[iconName as IconName] || 'Package';
  const IconComponent = PhosphorIcons[
    mappedIconName as keyof typeof PhosphorIcons
  ] as React.ComponentType<any>;

  if (!IconComponent) {
    // Fallback to Package icon if the mapped icon doesn't exist
    const FallbackIcon = PhosphorIcons.Package;
    return <FallbackIcon {...defaultIconProps} {...props} />;
  }

  return <IconComponent {...defaultIconProps} {...props} />;
}

/**
 * Get a small icon (commonly used in lists, buttons, etc.)
 */
export function getSmallIcon(
  iconName: string | undefined,
  className?: string
): React.ReactNode {
  return getIcon(iconName, {
    size: 16,
    className: className || 'h-4 w-4',
  });
}

/**
 * Get a large icon (commonly used for headers, hero sections, etc.)
 */
export function getLargeIcon(
  iconName: string | undefined,
  className?: string
): React.ReactNode {
  return getIcon(iconName, {
    size: 32,
    className: className || 'h-8 w-8',
  });
}

// Export specific commonly used icons for direct import
export const Icons = {
  // Navigation
  ArrowLeft: (props: any) => (
    <PhosphorIcons.ArrowLeft {...defaultIconProps} {...props} />
  ),
  ArrowRight: (props: any) => (
    <PhosphorIcons.ArrowRight {...defaultIconProps} {...props} />
  ),
  CaretDown: (props: any) => (
    <PhosphorIcons.CaretDown {...defaultIconProps} {...props} />
  ),
  CaretUp: (props: any) => (
    <PhosphorIcons.CaretUp {...defaultIconProps} {...props} />
  ),

  // Actions
  PlusCircle: (props: any) => (
    <PhosphorIcons.PlusCircle {...defaultIconProps} {...props} />
  ),
  PencilSimple: (props: any) => (
    <PhosphorIcons.PencilSimple {...defaultIconProps} {...props} />
  ),
  Trash: (props: any) => (
    <PhosphorIcons.Trash {...defaultIconProps} {...props} />
  ),
  FloppyDisk: (props: any) => (
    <PhosphorIcons.FloppyDisk {...defaultIconProps} {...props} />
  ),
  Copy: (props: any) => <PhosphorIcons.Copy {...defaultIconProps} {...props} />,

  // Status
  Check: (props: any) => (
    <PhosphorIcons.Check {...defaultIconProps} {...props} />
  ),
  X: (props: any) => <PhosphorIcons.X {...defaultIconProps} {...props} />,
  Warning: (props: any) => (
    <PhosphorIcons.Warning {...defaultIconProps} {...props} />
  ),
  CheckCircle: (props: any) => (
    <PhosphorIcons.CheckCircle {...defaultIconProps} {...props} />
  ),
  XCircle: (props: any) => (
    <PhosphorIcons.XCircle {...defaultIconProps} {...props} />
  ),

  // Loading
  CircleNotch: (props: any) => (
    <PhosphorIcons.CircleNotch {...defaultIconProps} {...props} />
  ),

  // Common
  Eye: (props: any) => <PhosphorIcons.Eye {...defaultIconProps} {...props} />,
  EyeSlash: (props: any) => (
    <PhosphorIcons.EyeSlash {...defaultIconProps} {...props} />
  ),
  MagnifyingGlass: (props: any) => (
    <PhosphorIcons.MagnifyingGlass {...defaultIconProps} {...props} />
  ),
  FunnelSimple: (props: any) => (
    <PhosphorIcons.FunnelSimple {...defaultIconProps} {...props} />
  ),
  Gear: (props: any) => <PhosphorIcons.Gear {...defaultIconProps} {...props} />,
  GearSix: (props: any) => (
    <PhosphorIcons.GearSix {...defaultIconProps} {...props} />
  ),

  // Tech
  Cpu: (props: any) => <PhosphorIcons.Cpu {...defaultIconProps} {...props} />,
  Robot: (props: any) => (
    <PhosphorIcons.Robot {...defaultIconProps} {...props} />
  ),
  Terminal: (props: any) => (
    <PhosphorIcons.Terminal {...defaultIconProps} {...props} />
  ),
  Code: (props: any) => <PhosphorIcons.Code {...defaultIconProps} {...props} />,

  // Security
  ShieldCheck: (props: any) => (
    <PhosphorIcons.ShieldCheck {...defaultIconProps} {...props} />
  ),
  Key: (props: any) => <PhosphorIcons.Key {...defaultIconProps} {...props} />,
  Lock: (props: any) => <PhosphorIcons.Lock {...defaultIconProps} {...props} />,

  // Users
  User: (props: any) => <PhosphorIcons.User {...defaultIconProps} {...props} />,
  Users: (props: any) => (
    <PhosphorIcons.Users {...defaultIconProps} {...props} />
  ),
  UserPlus: (props: any) => (
    <PhosphorIcons.UserPlus {...defaultIconProps} {...props} />
  ),

  // Layout
  SquaresFour: (props: any) => (
    <PhosphorIcons.SquaresFour {...defaultIconProps} {...props} />
  ),
  Stack: (props: any) => (
    <PhosphorIcons.Stack {...defaultIconProps} {...props} />
  ),
  Package: (props: any) => (
    <PhosphorIcons.Package {...defaultIconProps} {...props} />
  ),

  // Communication
  Envelope: (props: any) => (
    <PhosphorIcons.Envelope {...defaultIconProps} {...props} />
  ),
  ChatCircle: (props: any) => (
    <PhosphorIcons.ChatCircle {...defaultIconProps} {...props} />
  ),
  Bell: (props: any) => <PhosphorIcons.Bell {...defaultIconProps} {...props} />,

  // Files
  FileText: (props: any) => (
    <PhosphorIcons.FileText {...defaultIconProps} {...props} />
  ),
  Download: (props: any) => (
    <PhosphorIcons.Download {...defaultIconProps} {...props} />
  ),
  Upload: (props: any) => (
    <PhosphorIcons.Upload {...defaultIconProps} {...props} />
  ),

  // Business
  CurrencyDollar: (props: any) => (
    <PhosphorIcons.CurrencyDollar {...defaultIconProps} {...props} />
  ),
  ChartBar: (props: any) => (
    <PhosphorIcons.ChartBar {...defaultIconProps} {...props} />
  ),
  TrendUp: (props: any) => (
    <PhosphorIcons.TrendUp {...defaultIconProps} {...props} />
  ),

  // Time
  Clock: (props: any) => (
    <PhosphorIcons.Clock {...defaultIconProps} {...props} />
  ),
  Calendar: (props: any) => (
    <PhosphorIcons.Calendar {...defaultIconProps} {...props} />
  ),

  // Special
  Sparkle: (props: any) => (
    <PhosphorIcons.Sparkle {...defaultIconProps} {...props} />
  ),
  Lightning: (props: any) => (
    <PhosphorIcons.Lightning {...defaultIconProps} {...props} />
  ),
  Rocket: (props: any) => (
    <PhosphorIcons.Rocket {...defaultIconProps} {...props} />
  ),

  // Workflow
  FlowArrow: (props: any) => (
    <PhosphorIcons.FlowArrow {...defaultIconProps} {...props} />
  ),
  Play: (props: any) => <PhosphorIcons.Play {...defaultIconProps} {...props} />,
} as const;
