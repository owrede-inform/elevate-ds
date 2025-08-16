#!/usr/bin/env python3
"""
Script to convert React-style syntax to standard HTML syntax in HTML files.
Converts style={{...}} objects to style="..." strings and component names.
"""

import os
import re
import glob

def convert_react_style_to_html(content):
    """Convert React style objects to HTML style strings."""
    
    def style_object_to_string(match):
        style_content = match.group(1)
        
        # Convert camelCase to kebab-case and remove quotes around values
        conversions = [
            (r"([a-z])([A-Z])", r"\1-\2"),  # camelCase to kebab-case
            (r":\s*'([^']*)'", r": \1"),     # Remove single quotes from values  
            (r":\s*\"([^\"]*)\"", r": \1"),  # Remove double quotes from values
            (r",\s*", "; "),                 # Commas to semicolons
            (r"'", ""),                      # Remove remaining quotes
        ]
        
        result = style_content
        for pattern, replacement in conversions:
            result = re.sub(pattern, replacement, result)
        
        # Clean up the result
        result = result.strip()
        if result.endswith(';'):
            result = result[:-1]  # Remove trailing semicolon
        result += ";"  # Add final semicolon
        
        return f'style="{result}"'
    
    # Pattern to match style={{...}} 
    style_pattern = r'style=\{\{([^}]*)\}\}'
    return re.sub(style_pattern, style_object_to_string, content)

def convert_component_names(content):
    """Convert React component names to web component names."""
    conversions = [
        ('ElvtButton', 'elvt-button'),
        ('ElvtCard', 'elvt-card'),
        ('ElvtIcon', 'elvt-icon'),
        ('ElvtStack', 'elvt-stack'),
        ('ElvtAvatar', 'elvt-avatar'),
        ('ElvtInput', 'elvt-input'),
        ('ElvtSelect', 'elvt-select'),
        ('ElvtRadio', 'elvt-radio'),
        ('ElvtCheckbox', 'elvt-checkbox'),
        ('ElvtSwitch', 'elvt-switch'),
        ('ElvtDialog', 'elvt-dialog'),
        ('ElvtDrawer', 'elvt-drawer'),
        ('ElvtDropdown', 'elvt-dropdown'),
        ('ElvtTooltip', 'elvt-tooltip'),
        ('ElvtBadge', 'elvt-badge'),
        ('ElvtChip', 'elvt-chip'),
        ('ElvtProgress', 'elvt-progress'),
        ('ElvtSkeleton', 'elvt-skeleton'),
        ('ElvtSlider', 'elvt-slider'),
        ('ElvtExpansionPanel', 'elvt-expansion-panel'),
        ('ElvtExpansionPanelGroup', 'elvt-expansion-panel-group'),
        ('ElvtEmptyState', 'elvt-empty-state'),
        ('ElvtLightbox', 'elvt-lightbox'),
        ('ElvtIndicator', 'elvt-indicator'),
        ('ElvtDivider', 'elvt-divider'),
        ('ElvtDatePicker', 'elvt-date-picker'),
        ('ElvtBreadcrumb', 'elvt-breadcrumb'),
        ('ElvtBreadcrumbItem', 'elvt-breadcrumb-item'),
        ('ElvtButtonGroup', 'elvt-button-group'),
        ('ElvtIconButton', 'elvt-icon-button'),
        ('ElvtApplication', 'elvt-application'),
    ]
    
    result = content
    for react_name, web_name in conversions:
        result = result.replace(react_name, web_name)
    
    return result

def process_file(file_path):
    """Process a single HTML file to convert React syntax."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Convert React style objects
        content = convert_react_style_to_html(content)
        
        # Convert component names
        content = convert_component_names(content)
        
        # Only write if content changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True, file_path
        
        return False, file_path
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False, file_path

def main():
    """Main function to process all HTML files."""
    # Find all HTML files in docs/components/*/code-examples/
    pattern = "docs/components/*/code-examples/*.html"
    html_files = glob.glob(pattern)
    
    print(f"Found {len(html_files)} HTML files to process...")
    
    changed_files = []
    unchanged_files = []
    
    for file_path in html_files:
        changed, filepath = process_file(file_path)
        if changed:
            changed_files.append(filepath)
        else:
            unchanged_files.append(filepath)
    
    print(f"\nProcessing complete!")
    print(f"Files modified: {len(changed_files)}")
    print(f"Files unchanged: {len(unchanged_files)}")
    
    if changed_files:
        print(f"\nModified files:")
        for file_path in sorted(changed_files):
            print(f"  - {file_path}")

if __name__ == "__main__":
    main()