import React from 'react';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {useThemeConfig} from '@docusaurus/theme-common';

export default function Logo(): JSX.Element {
  const {
    siteConfig: {title},
  } = useDocusaurusContext();
  
  const {
    navbar: {logo, title: navbarTitle},
  } = useThemeConfig();

  const logoLink = useBaseUrl(logo?.href || '/');
  const logoAlt = logo?.alt || title;
  
  // Get both light and dark logo sources
  const lightLogoSrc = useBaseUrl(logo?.src || '');
  const darkLogoSrc = useBaseUrl(logo?.srcDark || logo?.src || '');

  return (
    <Link
      to={logoLink}
      className="navbar__brand"
      aria-label={logoAlt}
    >
      {logo && (
        <div className="navbar__logo-container">
          {/* Light mode logo */}
          <img
            src={lightLogoSrc}
            alt={logoAlt}
            className="navbar__logo navbar__logo--light"
            style={{
              width: logo.width,
              height: logo.height,
            }}
          />
          {/* Dark mode logo */}
          <img
            src={darkLogoSrc}
            alt={logoAlt}
            className="navbar__logo navbar__logo--dark"
            style={{
              width: logo.width,
              height: logo.height,
            }}
          />
        </div>
      )}
      {navbarTitle && (
        <div className="navbar__title">
          <strong>ELEVATE</strong> Design System
        </div>
      )}
    </Link>
  );
}