import React from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import NavbarItem from '@theme/NavbarItem';
import CollapseButton from '@theme/DocSidebar/Desktop/CollapseButton';
import Content from '@theme/DocSidebar/Desktop/Content';
import ResponsiveNavigation from '@site/src/components/ResponsiveNavigation';
import type {Props} from '@theme/DocSidebar/Desktop';

import styles from './styles.module.css';

function DocSidebarDesktop({path, sidebar, onCollapse, isHidden}: Props) {
  const {
    navbar: {hideOnScroll},
    docs: {
      sidebar: {hideable},
    },
  } = useThemeConfig();

  return (
    <div
      className={`theme-doc-sidebar-container ${styles.docSidebarContainer} ${
        isHidden ? styles.docSidebarContainerHidden : ''
      }`}>
      {/* Responsive Navigation Component */}
      <ResponsiveNavigation />
      
      {hideOnScroll && <div className={styles.docSidebarGapTop} />}
      <div className={`theme-doc-sidebar ${styles.docSidebar}`}>
        {hideable && (
          <CollapseButton onClick={onCollapse} />
        )}
        <Content path={path} sidebar={sidebar} />
      </div>
      {hideable && <div className={styles.collapsedDocSidebar} />}
    </div>
  );
}

export default React.memo(DocSidebarDesktop);