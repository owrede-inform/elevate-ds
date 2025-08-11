# Button Component Visual Specification

## Overview
This document provides a comprehensive visual specification for the ELEVATE Button component system, extracted directly from Figma designs.

![Button System Overview](../figma-exports/button-system-overview.png)

## Color Specifications

### Primary Button Colors

#### Default States
- **Background**: `#0b5cdf` (Primary Blue)
- **Text**: `#ffffff` (White)
- **Border**: `#ffffff00` (Transparent)

#### Hover States
- **Background**: `#1b50a6` (Darker Blue)
- **Text**: `#ffffff` (White)
- **Border**: `#ffffff00` (Transparent)

#### Active States
- **Background**: `#23334b` (Dark Blue-Grey)
- **Text**: `#ffffff` (White)
- **Border**: `#ffffff00` (Transparent)

#### Selected States
- **Background**: `#234275` (Medium Blue)
- **Text**: `#ffffff` (White)
- **Border**: `#ffffff00` (Transparent)

#### Disabled States
- **Background**: `#90c6ff` (Light Blue)
- **Text**: `#eaf4ff` (Very Light Blue)
- **Border**: `#ffffff00` (Transparent)

### Subtle Button Colors

#### Default States
- **Background**: Transparent
- **Text**: `#0b5cdf` (Primary Blue)
- **Border**: `#ffffff00` (Transparent)

#### Hover States
- **Background**: `#b9dbff` (Light Blue)
- **Text**: `#0b5cdf` (Primary Blue)
- **Border**: `#ffffff00` (Transparent)

#### Active States
- **Background**: `#5facff` (Medium Blue)
- **Text**: `#0b5cdf` (Primary Blue)
- **Border**: `#ffffff00` (Transparent)

### Neutral Button Colors

#### Default States
- **Background**: `#ffffff` (White)
- **Text**: `#2f3240` (Dark Grey)
- **Border**: `#a3aab4` (Light Grey)

#### Hover States
- **Background**: `#f3f4f7` (Very Light Grey)
- **Text**: `#2f3240` (Dark Grey)
- **Border**: `#707a8f` (Medium Grey)

#### Active States
- **Background**: `#bec3cd` (Light Grey)
- **Text**: `#2f3240` (Dark Grey)
- **Border**: `#5d6679` (Dark Grey)

### Emphasized Button Colors

#### Default States
- **Background**: `#d5d9e1` (Light Grey)
- **Text**: `#2f3240` (Dark Grey)
- **Border**: `#ffffff00` (Transparent)

#### Hover States
- **Background**: `#bec3cd` (Medium Grey)
- **Text**: `#2f3240` (Dark Grey)
- **Border**: `#ffffff00` (Transparent)

#### Active States
- **Background**: `#8891a0` (Dark Grey)
- **Text**: `#2f3240` (Dark Grey)
- **Border**: `#ffffff00` (Transparent)

### Danger Button Colors

#### Default States
- **Background**: `#ce0101` (Red)
- **Text**: `#ffffff` (White)
- **Border**: `#ffffff00` (Transparent)

#### Hover States
- **Background**: `#ab0101` (Dark Red)
- **Text**: `#ffffff` (White)
- **Border**: `#ffffff00` (Transparent)

#### Active States
- **Background**: `#6c0101` (Very Dark Red)
- **Text**: `#ffffff` (White)
- **Border**: `#ffffff00` (Transparent)

### Success Button Colors

#### Default States
- **Background**: `#05763d` (Green)
- **Text**: `#ffffff` (White)
- **Border**: `#ffffff00` (Transparent)

#### Hover States
- **Background**: `#056036` (Dark Green)
- **Text**: `#ffffff` (White)
- **Border**: `#ffffff00` (Transparent)

#### Active States
- **Background**: `#103a26` (Very Dark Green)
- **Text**: `#ffffff` (White)
- **Border**: `#ffffff00` (Transparent)

### Warning Button Colors

#### Default States
- **Background**: `#f88f00` (Orange)
- **Text**: `#401300` (Dark Brown)
- **Border**: `#ffffff00` (Transparent)

#### Hover States
- **Background**: `#d87800` (Dark Orange)
- **Text**: `#401300` (Dark Brown)
- **Border**: `#ffffff00` (Transparent)

#### Active States
- **Background**: `#a44d00` (Very Dark Orange)
- **Text**: `#401300` (Dark Brown)
- **Border**: `#ffffff00` (Transparent)

## Spacing Specifications

### Small Button (S)
- **Height**: `32px`
- **Horizontal Padding**: `12px`
- **Gap**: `4px` (between icon and text)
- **Border Radius**: `4px`
- **Border Width**: `1px`

### Medium Button (M) - Default
- **Height**: `40px`
- **Horizontal Padding**: `12px`
- **Gap**: `8px` (between icon and text)
- **Border Radius**: `4px`
- **Border Width**: `1px`

### Large Button (L)
- **Height**: `48px`
- **Horizontal Padding**: `20px`
- **Gap**: `12px` (between icon and text)
- **Border Radius**: `4px`
- **Border Width**: `1px`

## Typography Specifications

### Small Button Typography
- **Font Family**: Inter
- **Font Size**: `14px`
- **Font Weight**: Medium (500)
- **Line Height**: `20px`

### Medium Button Typography
- **Font Family**: Inter
- **Font Size**: `16px`
- **Font Weight**: Medium (500)
- **Line Height**: `24px`

### Large Button Typography
- **Font Family**: Inter
- **Font Size**: `20px`
- **Font Weight**: Medium (500)
- **Line Height**: `32px`

## Design Tokens Summary

The button component system uses a comprehensive set of design tokens:

- **6 Variants**: Primary, Subtle, Neutral, Emphasized, Danger, Success, Warning
- **3 Sizes**: Small (32px), Medium (40px), Large (48px)
- **5 States**: Default, Hover, Active, Selected, Disabled
- **Consistent Typography**: Inter font family with size-appropriate weights
- **Unified Spacing**: Systematic padding and gap values
- **Accessibility**: High contrast ratios and clear state differentiation

## Usage Guidelines

1. **Primary buttons** for main actions and CTAs
2. **Subtle buttons** for secondary actions
3. **Neutral buttons** for tertiary actions
4. **Emphasized buttons** for highlighted secondary actions
5. **Danger buttons** for destructive actions
6. **Success buttons** for positive confirmations
7. **Warning buttons** for cautionary actions

All buttons maintain consistent interaction patterns and visual hierarchy while providing clear semantic meaning through color and typography choices.