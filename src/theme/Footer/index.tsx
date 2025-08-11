import type {ReactNode} from 'react';
import React from 'react';
import {useThemeConfig} from '@docusaurus/theme-common';
import FooterLinks from '@theme/Footer/Links';
import FooterLogo from '@theme/Footer/Logo';
import FooterCopyright from '@theme/Footer/Copyright';
import styles from './styles.module.css';

function Footer(): ReactNode | null {
  const {footer} = useThemeConfig();
  
  if (!footer) {
    return null;
  }

  const {copyright, links, logo} = footer;
  
  // Use structured layout for all pages
  return (
    <footer className={styles.structuredFooter}>
      <div className={styles.footerContainer}>
        {/* Left section - sidebar sticks to window edge */}
        <div className={styles.footerSidebar}>
          {logo && <FooterLogo logo={logo} />}
        </div>
        
        {/* Right section - content area with proper width constraints */}
        <div className={styles.footerContent}>
          <div className={styles.footerContentInner}>
            {links && <FooterLinks links={links} />}
            {copyright && <FooterCopyright copyright={copyright} />}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default React.memo(Footer);