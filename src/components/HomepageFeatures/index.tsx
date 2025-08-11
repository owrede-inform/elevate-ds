import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '50+ UI Components',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Production-ready components built with modern web standards.
        Consistent design language across your entire application with 
        comprehensive <code>TypeScript</code> support.
      </>
    ),
  },
  {
    title: 'Design Tokens',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Systematic design tokens for colors, typography, spacing, and more.
        Built-in light and dark themes with seamless switching between modes.
      </>
    ),
  },
  {
    title: 'Developer Experience',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        React components, Web Components, and comprehensive documentation.
        Interactive examples with live code previews and complete API reference.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
