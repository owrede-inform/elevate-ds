import React, {memo} from 'react';
import {
  DocSidebarItemsExpandedStateProvider,
  useVisibleSidebarItems,
} from '@docusaurus/plugin-content-docs/client';
import DocSidebarItem from '@theme/DocSidebarItem';

function DocSidebarItems({items, ...props}) {
  const visibleItems = useVisibleSidebarItems(items, props.activePath);
  
  // Custom logic: If there's only one top-level category and we're at level 1,
  // show only its children instead of the category itself
  if (props.level === 1 && visibleItems.length === 1 && visibleItems[0].type === 'category' && visibleItems[0].items) {
    const categoryItem = visibleItems[0];
    
    // Check if we're currently in this category by looking at the active path
    const isInThisCategory = props.activePath && (
      props.activePath.startsWith(categoryItem.href) ||
      props.activePath === categoryItem.link?.id ||
      (categoryItem.items && categoryItem.items.some(item => 
        props.activePath === item.href || props.activePath.includes(item.id || '')
      ))
    );
    
    // If we're in this category, show only the sub-items
    if (isInThisCategory && categoryItem.items) {
      return (
        <DocSidebarItemsExpandedStateProvider>
          {categoryItem.items.map((item, index) => (
            <DocSidebarItem key={index} item={item} index={index} {...props} level={props.level + 1} />
          ))}
        </DocSidebarItemsExpandedStateProvider>
      );
    }
  }
  
  // Default behavior for other cases
  return (
    <DocSidebarItemsExpandedStateProvider>
      {visibleItems.map((item, index) => (
        <DocSidebarItem key={index} item={item} index={index} {...props} />
      ))}
    </DocSidebarItemsExpandedStateProvider>
  );
}
// Optimize sidebar at each "level"
export default memo(DocSidebarItems);
