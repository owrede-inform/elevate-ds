import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import { ElvtButton } from '@inform-elevate/elevate-core-ui/dist/react';
import styles from './styles.module.css';

interface HeroAction {
  label: string;
  href: string;
  tone?: 'primary' | 'neutral' | 'success' | 'warning' | 'danger' | 'emphasized' | 'subtle';
  size?: 'small' | 'medium' | 'large';
}

interface CustomHeroProps {
  title: string;
  subtitle?: string;
  backgroundImageFolder?: string;
  backgroundImages?: string[];
  actions?: HeroAction[];
  overlay?: 'light' | 'dark' | 'gradient' | 'none';
  className?: string;
}

/**
 * Custom Hero component with dynamic PNG background selection
 * 
 * Features:
 * - Selects random PNG from specified folder or array
 * - Responsive design with content overlay
 * - ELEVATE design system integration
 * - Customizable actions and styling
 */
const CustomHero: React.FC<CustomHeroProps> = ({
  title,
  subtitle,
  backgroundImageFolder = '/img/hero-backgrounds',
  backgroundImages = ['hero-01.png', 'hero-02.png', 'hero-03.png', 'hero-04.png', 'hero-05.png', 'hero-06.png', 'hero-07.png', 'hero-08.png'],
  actions = [
    { label: 'Get Started', href: '/docs/home/overview', tone: 'primary', size: 'large' },
    { label: 'View Components', href: '/docs/components', tone: 'neutral', size: 'large' }
  ],
  overlay = 'gradient',
  className
}) => {
  const [selectedBackground, setSelectedBackground] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Select a random background image
    const randomIndex = Math.floor(Math.random() * backgroundImages.length);
    const selectedImage = `${backgroundImageFolder}/${backgroundImages[randomIndex]}`;
    setSelectedBackground(selectedImage);
    
    // Preload the image
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      console.warn(`Failed to load hero background: ${selectedImage}`);
      setImageLoaded(true); // Still show content even if image fails
    };
    img.src = selectedImage;
  }, [backgroundImageFolder, backgroundImages]);

  const heroStyle = (selectedBackground && imageLoaded) ? {
    backgroundImage: `url(${selectedBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {};

  return (
    <header 
      className={clsx(
        'hero',
        styles.customHero,
        styles[`overlay-${overlay}`],
        !imageLoaded && styles.loading,
        className
      )}
      style={heroStyle}
    >
      <div className={styles.overlay} />
      <div className={clsx('container', styles.heroContent)}>
        <div className={styles.contentWrapper}>
          <Heading as="h1" className={clsx('hero__title', styles.heroTitle)}>
            {title}
          </Heading>
          
          {subtitle && (
            <p className={clsx('hero__subtitle', styles.heroSubtitle)}>
              {subtitle}
            </p>
          )}
          
          {actions && actions.length > 0 && (
            <div className={styles.heroActions}>
              {actions.map((action, index) => (
                <ElvtButton
                  key={index}
                  tone={action.tone || 'primary'}
                  size={action.size || 'large'}
                  href={action.href}
                >
                  {action.label}
                </ElvtButton>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default CustomHero;