# Pull to Refresh Components

Professional pull-to-refresh components for the FoodX application with smooth animations and React Query integration.

## Components

### PullToRefresh
Base component with smooth animations and professional design.

### PagePullToRefresh  
Higher-level component with React Query integration for easy data refreshing.

## Features

- Smooth Framer Motion animations
- Professional UI with backdrop blur effects
- Touch gesture support for mobile devices
- React Query integration for data refresh
- Customizable thresholds and styling
- Accessibility-friendly with proper feedback

## Usage Examples

### Basic Usage
```tsx
import { PullToRefresh } from '@/components';

<PullToRefresh onRefresh={handleRefresh}>
  <div>Your content</div>
</PullToRefresh>
```

### Page-Level Usage
```tsx
import { PagePullToRefresh } from '@/components';

<PagePullToRefresh queryKeys={["categories", "products"]}>
  <div>Page content</div>
</PagePullToRefresh>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Content to wrap |
| `onRefresh` | () => Promise<void> \| void | - | Refresh function |
| `threshold` | number | 80 | Pull distance to trigger refresh |
| `maxPullDistance` | number | 120 | Maximum pull distance |
| `className` | string | '' | Additional CSS classes |
| `disabled` | boolean | false | Disable pull-to-refresh |

## Integration

The components are integrated into:
- HomePage (global refresh)
- CategoryPage (specific data refresh)
- Other content-heavy pages

## Requirements

- React Query for data management
- Framer Motion for animations
- Touch device support 