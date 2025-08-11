import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import CustomHero from '@site/src/components/CustomHero';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  
  // Define hero actions with proper base URL resolution
  const heroActions = [
    { 
      label: 'Get Started', 
      href: useBaseUrl('docs/home/overview'), 
      tone: 'primary' as const,
      size: 'large' as const
    },
    { 
      label: 'View Components', 
      href: useBaseUrl('docs/components'), 
      tone: 'neutral' as const,
      size: 'large' as const
    },
    { 
      label: 'Design Guidelines', 
      href: useBaseUrl('docs/guidelines'), 
      tone: 'subtle' as const,
      size: 'large' as const
    }
  ];

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="A comprehensive design system built for modern web applications with consistent components, design tokens, and guidelines.">
      <CustomHero
        title={siteConfig.title}
        subtitle={siteConfig.tagline}
        actions={heroActions}
        backgroundImageFolder="img/hero-backgrounds"
        overlay="gradient"
      />
    </Layout>
  );
}
