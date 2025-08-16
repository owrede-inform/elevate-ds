const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function debugElevateTheme() {
    console.log('🚀 Starting ELEVATE theme debugging with Playwright...');
    
    const browser = await chromium.launch({ headless: false, slowMo: 1000 });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // Navigate to debug page
        const debugPath = path.resolve('./debug-theme.html');
        await page.goto(`file://${debugPath}`);
        
        console.log('📄 Loaded debug page');
        
        // Wait for ELEVATE components to load
        console.log('⏳ Waiting for ELEVATE components to load...');
        
        try {
            await page.waitForFunction(() => {
                return customElements.get('elvt-card') !== undefined;
            }, { timeout: 10000 });
            console.log('✅ ELEVATE components loaded');
        } catch (error) {
            console.log('⚠️  Timeout waiting for components, checking what loaded...');
            
            const componentStatus = await page.evaluate(() => {
                return {
                    elvtCardDefined: customElements.get('elvt-card') !== undefined,
                    elvtCardElements: document.querySelectorAll('elvt-card').length,
                    customElementsCount: Array.from(document.querySelectorAll('*')).filter(el => el.tagName.includes('-')).length,
                    hasElevateCSS: !!document.querySelector('link[href*="elevate"]'),
                    errors: window.lastError || 'none'
                };
            });
            
            console.log('🔍 Component status:', componentStatus);
            
            if (componentStatus.elvtCardElements === 0) {
                console.log('❌ No elvt-card elements found, components may not be working');
                return;
            }
        }
        
        // Function to capture component state
        async function captureComponentState(themeName) {
            console.log(`\n🔍 Analyzing ${themeName} theme:`);
            
            // Get document-level CSS custom properties
            const documentTokens = await page.evaluate(() => {
                const style = getComputedStyle(document.documentElement);
                const tokens = [
                    '--elvt-alias-layout-border-default',
                    '--elvt-alias-layout-border-prominent', 
                    '--elvt-alias-layout-layer-default',
                    '--elvt-alias-layout-layer-elevated',
                    '--elvt-alias-layout-layer-overlay'
                ];
                
                const result = {};
                tokens.forEach(token => {
                    result[token] = style.getPropertyValue(token).trim();
                });
                return result;
            });
            
            console.log('📊 Document-level tokens:', documentTokens);
            
            // Inspect each card component
            const cardStates = await page.evaluate(() => {
                const cards = document.querySelectorAll('elvt-card');
                const results = [];
                
                cards.forEach((card, index) => {
                    const id = card.id || `card-${index}`;
                    const layer = card.getAttribute('layer') || 'default';
                    const classes = Array.from(card.classList);
                    
                    // Get computed styles from the card element itself
                    const computedStyle = getComputedStyle(card);
                    
                    results.push({
                        id,
                        layer,
                        classes,
                        computedStyles: {
                            borderColor: computedStyle.borderColor,
                            backgroundColor: computedStyle.backgroundColor,
                            borderWidth: computedStyle.borderWidth,
                            borderStyle: computedStyle.borderStyle
                        },
                        customProperties: {
                            borderColor: computedStyle.getPropertyValue('--border-color').trim(),
                            fill: computedStyle.getPropertyValue('--fill').trim(),
                            borderRadius: computedStyle.getPropertyValue('--border-radius').trim()
                        }
                    });
                });
                
                return results;
            });
            
            console.log(`🎯 Component states for ${themeName}:`);
            cardStates.forEach(state => {
                console.log(`  ${state.id} (${state.layer}):`);
                console.log(`    Classes: ${state.classes.join(', ')}`);
                console.log(`    Border: ${state.computedStyles.borderColor} ${state.computedStyles.borderWidth} ${state.computedStyles.borderStyle}`);
                console.log(`    Background: ${state.computedStyles.backgroundColor}`);
                console.log(`    CSS Props: --border-color=${state.customProperties.borderColor}, --fill=${state.customProperties.fill}`);
            });
            
            // Take screenshot
            await page.screenshot({ 
                path: `debug-${themeName}-theme.png`,
                fullPage: true 
            });
            
            return { documentTokens, cardStates };
        }
        
        // Test light theme
        await page.evaluate(() => {
            document.body.setAttribute('data-theme', 'light');
            document.body.classList.remove('dark-mode');
            window.applyThemeToComponents();
        });
        await page.waitForTimeout(500);
        const lightResults = await captureComponentState('light');
        
        // Test dark theme  
        await page.evaluate(() => {
            document.body.setAttribute('data-theme', 'dark');
            document.body.classList.add('dark-mode');
            window.applyThemeToComponents();
        });
        await page.waitForTimeout(500);
        const darkResults = await captureComponentState('dark');
        
        // Compare results
        console.log('\n🔍 COMPARISON ANALYSIS:');
        
        // Check if tokens are different between themes
        const lightTokens = lightResults.documentTokens;
        const darkTokens = darkResults.documentTokens;
        
        console.log('\n📊 Token Differences:');
        Object.keys(lightTokens).forEach(token => {
            if (lightTokens[token] !== darkTokens[token]) {
                console.log(`  ✅ ${token}: DIFFERENT`);
                console.log(`    Light: ${lightTokens[token]}`);
                console.log(`    Dark: ${darkTokens[token]}`);
            } else {
                console.log(`  ❌ ${token}: SAME (${lightTokens[token]})`);
            }
        });
        
        // Check if component styles change
        console.log('\n🎯 Component Style Changes:');
        lightResults.cardStates.forEach((lightCard, index) => {
            const darkCard = darkResults.cardStates[index];
            if (lightCard && darkCard) {
                const stylesChanged = 
                    lightCard.computedStyles.backgroundColor !== darkCard.computedStyles.backgroundColor ||
                    lightCard.computedStyles.borderColor !== darkCard.computedStyles.borderColor;
                
                console.log(`  ${lightCard.id}: ${stylesChanged ? '✅ CHANGED' : '❌ NO CHANGE'}`);
                if (!stylesChanged) {
                    console.log(`    Background: ${lightCard.computedStyles.backgroundColor}`);
                    console.log(`    Border: ${lightCard.computedStyles.borderColor}`);
                }
            }
        });
        
        // Save detailed results to file
        const detailedResults = {
            light: lightResults,
            dark: darkResults,
            timestamp: new Date().toISOString()
        };
        
        fs.writeFileSync('debug-results.json', JSON.stringify(detailedResults, null, 2));
        console.log('\n💾 Detailed results saved to debug-results.json');
        
        // Test ComponentShowcase comparison
        console.log('\n🌐 Testing ComponentShowcase on localhost:3000...');
        try {
            await page.goto('http://localhost:3000/docs/components/card');
            await page.waitForSelector('elvt-card', { timeout: 5000 });
            
            const showcaseResults = await page.evaluate(() => {
                const cards = document.querySelectorAll('elvt-card');
                return Array.from(cards).slice(0, 4).map((card, index) => {
                    const computedStyle = getComputedStyle(card);
                    return {
                        index,
                        layer: card.getAttribute('layer') || 'default',
                        classes: Array.from(card.classList),
                        backgroundColor: computedStyle.backgroundColor,
                        borderColor: computedStyle.borderColor
                    };
                });
            });
            
            console.log('🎯 ComponentShowcase card states:');
            showcaseResults.forEach(card => {
                console.log(`  Card ${card.index} (${card.layer}): bg=${card.backgroundColor}, border=${card.borderColor}`);
                console.log(`    Classes: ${card.classes.join(', ')}`);
            });
            
            await page.screenshot({ path: 'debug-componentshowcase.png' });
            
        } catch (error) {
            console.log(`⚠️  Could not access ComponentShowcase: ${error.message}`);
        }
        
        console.log('\n🎉 Debug analysis complete! Check the screenshots and debug-results.json');
        
    } catch (error) {
        console.error('❌ Error during debugging:', error);
    } finally {
        await browser.close();
    }
}

// Run the debug function
debugElevateTheme().catch(console.error);