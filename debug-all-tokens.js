const { chromium } = require('playwright');

async function debugAllTokens() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Analyzing ALL ELEVATE token issues...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        // Comprehensive token analysis
        const tokenAnalysis = await page.evaluate(() => {
            const cards = document.querySelectorAll('elvt-card');
            const results = [];
            
            Array.from(cards).slice(0, 4).forEach((card, index) => {
                const layer = card.getAttribute('layer') || 'default';
                const computedStyle = getComputedStyle(card);
                
                // Get ALL CSS custom properties from the card
                const allCustomProps = {};
                for (let i = 0; i < computedStyle.length; i++) {
                    const prop = computedStyle.item(i);
                    if (prop.startsWith('--elvt-') || prop.startsWith('--sl-') || prop.startsWith('--')) {
                        allCustomProps[prop] = computedStyle.getPropertyValue(prop).trim();
                    }
                }
                
                // Get key visual properties
                const visualProps = {
                    backgroundColor: computedStyle.backgroundColor,
                    borderColor: computedStyle.borderColor,
                    borderWidth: computedStyle.borderWidth,
                    borderStyle: computedStyle.borderStyle,
                    borderRadius: computedStyle.borderRadius,
                    color: computedStyle.color,
                    fontSize: computedStyle.fontSize,
                    fontFamily: computedStyle.fontFamily,
                    padding: computedStyle.padding,
                    margin: computedStyle.margin,
                    boxShadow: computedStyle.boxShadow
                };
                
                // Check if Shadow DOM tokens are working
                const shadowDOMCheck = {
                    hasShadowRoot: !!card.shadowRoot,
                    adoptedStyleSheets: card.shadowRoot ? card.shadowRoot.adoptedStyleSheets.length : 0
                };
                
                // Check specific ELEVATE tokens we expect to work
                const expectedTokens = {
                    // Border tokens
                    borderDefault: allCustomProps['--elvt-alias-layout-border-default'],
                    borderProminent: allCustomProps['--elvt-alias-layout-border-prominent'],
                    borderMuted: allCustomProps['--elvt-alias-layout-border-muted'],
                    
                    // Layer tokens
                    layerDefault: allCustomProps['--elvt-alias-layout-layer-default'],
                    layerElevated: allCustomProps['--elvt-alias-layout-layer-elevated'],
                    layerOverlay: allCustomProps['--elvt-alias-layout-layer-overlay'],
                    
                    // Internal component tokens
                    fill: allCustomProps['--fill'],
                    borderColor: allCustomProps['--border-color'],
                    borderRadius: allCustomProps['--border-radius'],
                    borderWidth: allCustomProps['--border-width'],
                    
                    // Typography tokens
                    fontFamily: allCustomProps['--elvt-type-alias-default-content-m-font-family'],
                    fontSize: allCustomProps['--elvt-type-alias-default-content-m-font-size'],
                    
                    // Spacing tokens
                    paddingTop: allCustomProps['--padding-top'],
                    paddingRight: allCustomProps['--padding-right'],
                    paddingBottom: allCustomProps['--padding-bottom'],
                    paddingLeft: allCustomProps['--padding-left']
                };
                
                results.push({
                    index,
                    layer,
                    visualProps,
                    expectedTokens,
                    shadowDOMCheck,
                    customPropsCount: Object.keys(allCustomProps).length
                });
            });
            
            return results;
        });
        
        console.log('📊 Comprehensive Token Analysis:');
        tokenAnalysis.forEach(card => {
            console.log(`\n🎯 Card ${card.index} (${card.layer}):`);
            console.log('Visual Properties:', card.visualProps);
            console.log('Expected Tokens:');
            Object.entries(card.expectedTokens).forEach(([key, value]) => {
                const status = value ? '✅' : '❌';
                console.log(`  ${status} ${key}: ${value || 'NOT DEFINED'}`);
            });
            console.log(`Shadow DOM: ${card.shadowDOMCheck.hasShadowRoot ? '✅' : '❌'} (${card.shadowDOMCheck.adoptedStyleSheets} stylesheets)`);
            console.log(`Custom Properties: ${card.customPropsCount} total`);
        });
        
        // Test dark mode to see what changes
        console.log('\n🌙 Testing Dark Mode Token Changes...');
        await page.click('[aria-label="Switch between dark and light mode"]');
        await page.waitForTimeout(1000);
        
        const darkModeAnalysis = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            if (!card) return null;
            
            const computedStyle = getComputedStyle(card);
            
            return {
                visualProps: {
                    backgroundColor: computedStyle.backgroundColor,
                    borderColor: computedStyle.borderColor,
                    color: computedStyle.color
                },
                tokens: {
                    borderDefault: computedStyle.getPropertyValue('--elvt-alias-layout-border-default').trim(),
                    layerElevated: computedStyle.getPropertyValue('--elvt-alias-layout-layer-elevated').trim(),
                    fill: computedStyle.getPropertyValue('--fill').trim(),
                    borderColor: computedStyle.getPropertyValue('--border-color').trim()
                }
            };
        });
        
        console.log('Dark Mode Analysis:', darkModeAnalysis);
        
        // Identify the root cause pattern
        console.log('\n🔍 ROOT CAUSE ANALYSIS:');
        
        const rootCauseCheck = await page.evaluate(() => {
            // Check if document-level tokens are different from component-level tokens
            const docStyle = getComputedStyle(document.documentElement);
            const card = document.querySelector('elvt-card');
            const cardStyle = getComputedStyle(card);
            
            const tokenComparison = {};
            const tokensToCheck = [
                '--elvt-alias-layout-border-default',
                '--elvt-alias-layout-layer-default',
                '--elvt-alias-layout-layer-elevated'
            ];
            
            tokensToCheck.forEach(token => {
                tokenComparison[token] = {
                    document: docStyle.getPropertyValue(token).trim(),
                    component: cardStyle.getPropertyValue(token).trim(),
                    match: docStyle.getPropertyValue(token).trim() === cardStyle.getPropertyValue(token).trim()
                };
            });
            
            return {
                tokenComparison,
                documentTheme: document.documentElement.getAttribute('data-theme'),
                cardClasses: Array.from(card.classList)
            };
        });
        
        console.log('Token Inheritance Check:');
        Object.entries(rootCauseCheck.tokenComparison).forEach(([token, data]) => {
            const status = data.match ? '✅' : '❌';
            console.log(`${status} ${token}:`);
            console.log(`  Document: ${data.document}`);
            console.log(`  Component: ${data.component}`);
        });
        console.log('Document Theme:', rootCauseCheck.documentTheme);
        console.log('Card Classes:', rootCauseCheck.cardClasses);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

debugAllTokens();