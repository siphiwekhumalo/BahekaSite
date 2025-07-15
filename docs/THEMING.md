# Theming System Documentation

## Overview
The Baheka Tech website now includes a comprehensive theming system with support for light, dark, and system themes. The theming system is built using CSS custom properties and Tailwind CSS classes, providing seamless transitions between themes.

## Features
- **Light Theme**: Clean, professional appearance with light backgrounds
- **Dark Theme**: Modern dark mode with enhanced contrast
- **System Theme**: Automatically adapts to user's system preference
- **Persistent Storage**: Theme preference saved in localStorage
- **Smooth Transitions**: Animated transitions between themes
- **Responsive Design**: Works across all device sizes

## Implementation

### Theme Context Provider
```typescript
// client/src/contexts/theme-context.tsx
- ThemeProvider: Manages theme state and system preference detection
- useTheme: Hook for accessing theme functionality
- Automatic system theme detection and updates
```

### Theme Toggle Component
```typescript
// client/src/components/ui/theme-toggle.tsx
- Dropdown menu with theme options
- Icons for each theme state
- Accessible keyboard navigation
- Available in both desktop and mobile navigation
```

### CSS Variables
```css
/* Light Theme */
:root {
  --background: hsl(0, 0%, 100%);
  --foreground: hsl(240, 10%, 3.9%);
  --deep-green: hsl(158, 64%, 20%);
  --tech-gold: hsl(43, 96%, 56%);
  /* ... other variables */
}

/* Dark Theme */
.dark {
  --background: hsl(240, 10%, 3.9%);
  --foreground: hsl(0, 0%, 98%);
  --deep-green: hsl(158, 64%, 30%);
  --tech-gold: hsl(43, 96%, 65%);
  /* ... other variables */
}
```

### Tailwind Configuration
```typescript
// tailwind.config.ts
export default {
  darkMode: ["class"], // Enable class-based dark mode
  // ... rest of config
}
```

## Usage

### Basic Theme Classes
```jsx
// Background colors
<div className="bg-background text-foreground">
  Content adapts to theme
</div>

// Card components
<div className="bg-card text-card-foreground border border-border">
  Card content
</div>

// Muted content
<p className="text-muted-foreground">
  Secondary text
</p>
```

### Custom Colors
```jsx
// Brand colors that adapt to theme
<span className="text-deep-green">Brand color</span>
<span className="text-tech-gold">Accent color</span>
```

### Component Updates
All major components have been updated to support theming:
- **Header**: Adaptive background and text colors
- **Hero Section**: Gradient backgrounds and text colors
- **Services**: Card backgrounds and borders
- **Footer**: Enhanced dark mode support
- **Forms**: Input and button theming

## Testing

### Unit Tests
```typescript
// client/src/components/ui/__tests__/theme-toggle.test.tsx
- Theme toggle functionality
- Theme persistence
- System theme detection
- Accessibility compliance
```

### Manual Testing
1. **Theme Switching**: Verify all three themes work correctly
2. **Persistence**: Theme preference saved across sessions
3. **System Detection**: Automatic theme based on OS preference
4. **Responsive**: Theme toggle works on mobile devices
5. **Accessibility**: Keyboard navigation and screen reader support

## Browser Support
- **Modern Browsers**: Full support for all features
- **CSS Custom Properties**: Required for theming
- **matchMedia API**: Used for system theme detection
- **localStorage**: For theme persistence

## Performance
- **CSS Variables**: Efficient theme switching without layout shifts
- **Lazy Loading**: Theme context only loads when needed
- **Minimal JavaScript**: Most styling handled by CSS
- **Smooth Transitions**: Hardware-accelerated animations

## Customization

### Adding New Themes
To add additional themes:
1. Define new CSS variables in `index.css`
2. Add theme option to `theme-context.tsx`
3. Update `theme-toggle.tsx` with new option
4. Add corresponding icon and label

### Brand Color Adjustments
Update color values in CSS variables:
```css
:root {
  --deep-green: hsl(158, 64%, 20%); /* Adjust as needed */
  --tech-gold: hsl(43, 96%, 56%);   /* Adjust as needed */
}
```

### Component Theming
Use semantic color classes for consistent theming:
```jsx
// Good: Semantic colors
<div className="bg-background text-foreground">

// Avoid: Hard-coded colors
<div className="bg-white text-black">
```

## Migration Guide

### Existing Components
To update existing components for theming:

1. **Replace hard-coded colors**:
   ```jsx
   // Before
   <div className="bg-white text-black">
   
   // After
   <div className="bg-background text-foreground">
   ```

2. **Use semantic color classes**:
   ```jsx
   // Before
   <p className="text-gray-600">
   
   // After
   <p className="text-muted-foreground">
   ```

3. **Update gradients**:
   ```jsx
   // Before
   <div className="bg-gradient-to-r from-white to-gray-50">
   
   // After
   <div className="bg-gradient-to-r from-background to-muted">
   ```

## Best Practices

1. **Use CSS Variables**: Always use CSS custom properties for colors
2. **Test Both Themes**: Verify functionality in light and dark modes
3. **Semantic Naming**: Use descriptive color names, not appearance-based
4. **Accessibility**: Maintain proper contrast ratios in both themes
5. **Performance**: Minimize JavaScript usage for theme switching
6. **Consistency**: Use the same theming approach across all components

## Troubleshooting

### Common Issues
1. **Theme not persisting**: Check localStorage permissions
2. **System theme not detected**: Verify matchMedia API support
3. **Colors not updating**: Ensure CSS variables are properly defined
4. **Flash of unstyled content**: Initialize theme before rendering

### Debug Tools
- Browser DevTools: Inspect CSS custom properties
- Console logging: Theme state changes
- Accessibility tools: Test keyboard navigation
- Performance tools: Monitor theme switching performance

This comprehensive theming system provides a professional, accessible, and maintainable approach to supporting multiple themes while preserving the brand identity and user experience.