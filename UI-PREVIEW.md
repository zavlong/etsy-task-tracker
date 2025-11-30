# 🎨 UI Design Preview

## Visual Layout

The Etsy Tracker features a modern, dark-themed interface with glassmorphism effects.

### Header Section

```
┌─────────────────────────────────────────────────────────────┐
│ 📦 Etsy Shop Tracker                                        │
│                                                             │
│ [← Prev]    Week of Nov 25, 2024    [Next →]              │
│                                                             │
│ Progress Bar: ████████████████████░░░░░░░  68% Complete    │
└─────────────────────────────────────────────────────────────┘
```

### Stats Dashboard

Three cards displaying key metrics:

| Items Listed | Sales | Revenue |
|--------------|-------|---------|
| 14           | 3     | $127    |

### Weekly Calendar View

The main interface shows 7 columns (Mon-Sun) with:
- Daily progress bars
- Task checkboxes
- Time estimates
- Priority indicators

```
┌────────────┬────────────┬────────────┬────────────┐
│   Monday   │  Tuesday   │ Wednesday  │  Thursday  │
│  Nov 25    │  Nov 26    │  Nov 27    │  Nov 28    │
├────────────┼────────────┼────────────┼────────────┤
│ Progress:  │ Progress:  │ Progress:  │ Progress:  │
│ ████████   │ ████████   │ ████░░░░   │ ░░░░░░░░   │
│  100%      │  100%      │   60%      │    0%      │
├────────────┼────────────┼────────────┼────────────┤
│ ☑ Check    │ ☑ Check    │ ☑ Check    │ ☐ Check    │
│   messages │   messages │   messages │   messages │
│   15m      │   15m      │   15m      │   15m      │
│            │            │            │            │
│ ☑ Process  │ ☑ Process  │ ☑ Process  │ ☐ Process  │
│   orders   │   orders   │   orders   │   orders   │
│   5m       │   5m       │   5m       │   5m       │
└────────────┴────────────┴────────────┴────────────┘
```

## Design Features

### Color Scheme

- **Background:** Deep navy/black gradient (`#0f172a` → `#020617`)
- **Cards:** Translucent dark blue with blur effect
- **Primary:** Purple (`#8b5cf6`)
- **Secondary:** Green (`#10b981`)
- **Warning:** Orange (`#f59e0b`)
- **Danger:** Red (`#ef4444`)

### Visual Effects

- **Glassmorphism:** Cards use `backdrop-filter: blur(10px)` with semi-transparent backgrounds
- **Gradients:** Purple-to-green gradients on progress bars and headers
- **Smooth Animations:** All hover effects and transitions use `transition: all 0.2s`
- **Priority Indicators:** 
  - High priority = Red left border (3px)
  - Medium priority = Orange left border (3px)

### Interactive Elements

#### Task Cards
- Click anywhere to toggle completion
- Completed tasks show checkmark and strikethrough
- Opacity reduces to 60% when complete
- Hover effect: slight translation and background change

#### Progress Bars
- Real-time updates as tasks are checked
- Smooth width transitions
- Gradient fill from purple to green

#### Stats Cards
- Editable number inputs
- Auto-save on change
- Hover effect: lift with purple shadow

## Responsive Design

The interface adapts to different screen sizes:

### Desktop (1400px+)
- 7 columns (full week view)
- Large stats cards
- Spacious padding

### Tablet (768px - 1200px)
- 4 columns
- Compact stats cards
- Reduced spacing

### Mobile (< 768px)
- 2 columns or single column
- Stacked week navigation
- Full-width buttons

## Task Card Anatomy

```
┌──────────────────────────────────────┐
│ [✓]  Check & respond to messages     │  ← Checkbox + Task name
│      15m                              │  ← Time estimate
│                                       │
│      Priority indicator (left border)│
└──────────────────────────────────────┘
```

### States

1. **Unchecked:** Empty checkbox, normal opacity
2. **Checked:** Green checkmark, strikethrough, 60% opacity
3. **Hover:** Background darkens, slight right shift

## Typography

- **Headers:** System fonts with gradient text fill
- **Body:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Sizes:**
  - H1 (Title): 2rem
  - Week Label: 1.1rem
  - Task Names: 0.9rem
  - Time Estimates: 0.75rem

## Accessibility Features

- High contrast text on dark backgrounds
- Clear visual hierarchy
- Large click targets (min 44px)
- Keyboard navigation support
- Screen reader friendly labels

## Animation Details

### Hover Animations
```css
transition: all 0.2s ease;
transform: translateY(-2px);
box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
```

### Progress Bar Fill
```css
transition: width 0.3s ease;
background: linear-gradient(90deg, #8b5cf6 0%, #10b981 100%);
```

### Task Completion
```css
opacity: 0.6;
text-decoration: line-through;
background: rgba(16, 185, 129, 0.1);
```

## Mobile Experience

On mobile devices:
- Single column layout
- Swipe-friendly cards
- Large touch targets
- Bottom navigation for week switching
- Collapsible stats section

## Dark Theme Rationale

Perfect for:
- Long work sessions (reduced eye strain)
- Evening/night use
- Modern aesthetic
- Professional appearance
- Battery saving on OLED screens

The dark theme with purple/green accents creates a modern, professional look that's easy on the eyes during long work sessions.

---

**Note:** The actual implementation uses CSS-in-JS with React components, providing smooth animations and responsive behavior across all devices.
