import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CustomHero from '@site/src/components/CustomHero';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  
  // Define hero actions
  const heroActions = [
    { 
      label: 'Get Started', 
      href: '/docs/home/overview', 
      tone: 'primary' as const,
      size: 'large' as const
    },
    { 
      label: 'View Components', 
      href: '/docs/components', 
      tone: 'neutral' as const,
      size: 'large' as const
    },
    { 
      label: 'Design Guidelines', 
      href: '/docs/guidelines', 
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
