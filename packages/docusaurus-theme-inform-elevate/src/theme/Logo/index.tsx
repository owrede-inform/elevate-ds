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
  
  // For now, just use the light logo by default to avoid color mode issues
  // We'll fix the dynamic switching once the context provider is properly set up
  const logoSrc = useBaseUrl(logo?.src || '');

  return (
    <Link
      to={logoLink}
      className="navbar__brand"
      aria-label={logoAlt}
    >
      {logo && (
        <img
          src={logoSrc}
          alt={logoAlt}
          className="navbar__logo"
          style={{
            width: logo.width,
            height: logo.height,
          }}
        />
      )}
      {navbarTitle && (
        <div className="navbar__title">
          <strong>ELEVATE</strong> Design System
        </div>
      )}
    </Link>
  );
}