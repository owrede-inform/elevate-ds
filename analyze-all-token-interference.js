const { chromium } = require('playwright');

async function analyzeAllTokenInterference() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Analyzing ALL ELEVATE Token Interference...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        const comprehensiveAnalysis = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            const button = document.querySelector('elvt-button');
            const computedStyle = getComputedStyle(card);
            
            // Get ALL CSS properties that might be affected
            const allCSSProperties = {
                // Layout & Background
                backgroundColor: computedStyle.backgroundColor,
                backgroundImage: computedStyle.backgroundImage,
                
                // Borders
                borderColor: computedStyle.borderColor,
                borderWidth: computedStyle.borderWidth,
                borderStyle: computedStyle.borderStyle,
                borderRadius: computedStyle.borderRadius,
                borderTop: computedStyle.borderTop,
                borderRight: computedStyle.borderRight,
                borderBottom: computedStyle.borderBottom,
                borderLeft: computedStyle.borderLeft,
                
                // Typography
                color: computedStyle.color,
                fontFamily: computedStyle.fontFamily,
                fontSize: computedStyle.fontSize,
                fontWeight: computedStyle.fontWeight,
                lineHeight: computedStyle.lineHeight,
                letterSpacing: computedStyle.letterSpacing,
                
                // Spacing
                padding: computedStyle.padding,
                paddingTop: computedStyle.paddingTop,
                paddingRight: computedStyle.paddingRight,
                paddingBottom: computedStyle.paddingBottom,
                paddingLeft: computedStyle.paddingLeft,
                margin: computedStyle.margin,
                marginTop: computedStyle.marginTop,
                marginRight: computedStyle.marginRight,
                marginBottom: computedStyle.marginBottom,
                marginLeft: computedStyle.marginLeft,
                
                // Shadows & Effects
                boxShadow: computedStyle.boxShadow,
                textShadow: computedStyle.textShadow,
                opacity: computedStyle.opacity,
                
                // Layout
                width: computedStyle.width,
                height: computedStyle.height,
                minWidth: computedStyle.minWidth,
                minHeight: computedStyle.minHeight,
                maxWidth: computedStyle.maxWidth,
                maxHeight: computedStyle.maxHeight,
                
                // Position
                top: computedStyle.top,
                right: computedStyle.right,
                bottom: computedStyle.bottom,
                left: computedStyle.left,
                
                // Transform & Animation
                transform: computedStyle.transform,
                transition: computedStyle.transition,
                animation: computedStyle.animation
            };
            
            // Get ALL ELEVATE tokens that are available
            const allElevateTokens = {};
            for (let i = 0; i < computedStyle.length; i++) {
                const prop = computedStyle.item(i);
                if (prop.startsWith('--elvt-') || prop.startsWith('--sl-') || 
                    prop.startsWith('--distance-') || prop.startsWith('--border-') ||
                    prop.startsWith('--fill') || prop.startsWith('--padding-')) {
                    allElevateTokens[prop] = computedStyle.getPropertyValue(prop).trim();
                }
            }
            
            // Check which CSS properties are potentially using tokens
            const shadowDOMInternals = card.shadowRoot ? (() => {
                const adoptedSheets = card.shadowRoot.adoptedStyleSheets || [];
                const shadowRules = [];
                
                adoptedSheets.forEach((sheet, sheetIndex) => {
                    try {
                        Array.from(sheet.cssRules || []).forEach((rule, ruleIndex) => {
                            if (rule.selectorText && rule.selectorText.includes(':host')) {
                                const cssText = rule.style.cssText;
                                shadowRules.push({
                                    selector: rule.selectorText,
                                    cssText: cssText,
                                    usesTokens: cssText.includes('var(--'),
                                    tokens: (cssText.match(/var\(--[^)]+\)/g) || [])
                                });
                            }
                        });
                    } catch (e) {
                        // Handle errors
                    }
                });
                
                return shadowRules;
            })() : [];
            
            // Test if Docusaurus is interfering with other properties
            const interferenceTesting = {
                // Test border properties
                borderTest: (() => {
                    const originalBorder = computedStyle.borderColor;
                    card.style.setProperty('border-color', 'var(--elvt-alias-layout-border-prominent)', 'important');
                    card.offsetHeight;
                    const afterBorder = getComputedStyle(card).borderColor;
                    card.style.removeProperty('border-color');
                    return { original: originalBorder, after: afterBorder, changed: originalBorder !== afterBorder };
                })(),
                
                // Test typography
                fontTest: (() => {
                    const originalFont = computedStyle.fontFamily;
                    card.style.setProperty('font-family', 'var(--elvt-type-alias-default-content-m-font-family)', 'important');
                    card.offsetHeight;
                    const afterFont = getComputedStyle(card).fontFamily;
                    card.style.removeProperty('font-family');
                    return { original: originalFont, after: afterFont, changed: originalFont !== afterFont };
                })(),
                
                // Test spacing
                paddingTest: (() => {
                    const originalPadding = computedStyle.paddingTop;
                    card.style.setProperty('padding-top', 'var(--distance-xl)', 'important');
                    card.offsetHeight;
                    const afterPadding = getComputedStyle(card).paddingTop;
                    card.style.removeProperty('padding-top');
                    return { original: originalPadding, after: afterPadding, changed: originalPadding !== afterPadding };
                })()
            };
            
            return {
                allCSSProperties,
                elevateTokenCount: Object.keys(allElevateTokens).length,
                elevateTokens: Object.keys(allElevateTokens).slice(0, 20), // First 20 for brevity
                shadowDOMRules: shadowDOMInternals.slice(0, 10),
                interferenceTesting,
                tokenUsageInShadowDOM: shadowDOMInternals.filter(rule => rule.usesTokens).length
            };
        });
        
        console.log('📊 Comprehensive ELEVATE Token Analysis:');
        console.log(`Total ELEVATE Tokens Available: ${comprehensiveAnalysis.elevateTokenCount}`);
        console.log(`Shadow DOM Rules Using Tokens: ${comprehensiveAnalysis.tokenUsageInShadowDOM}`);
        
        console.log('\n🎯 Sample ELEVATE Tokens:');
        comprehensiveAnalysis.elevateTokens.forEach((token, i) => {
            console.log(`  ${i}: ${token}`);
        });
        
        console.log('\n🌙 Shadow DOM Token Usage:');
        comprehensiveAnalysis.shadowDOMRules.forEach((rule, i) => {
            if (rule.usesTokens) {
                console.log(`${i}: ${rule.selector}`);
                console.log(`   Tokens: ${rule.tokens.join(', ')}`);
            }
        });
        
        console.log('\n🧪 CSS Property Interference Tests:');
        Object.entries(comprehensiveAnalysis.interferenceTesting).forEach(([test, result]) => {
            const status = result.changed ? '✅ TOKEN WORKS' : '❌ BLOCKED';
            console.log(`${test}: ${status}`);
            console.log(`  Original: ${result.original}`);
            console.log(`  After Token: ${result.after}`);
        });
        
        console.log('\n🔍 Key CSS Properties Analysis:');
        const keyProperties = [
            'backgroundColor', 'borderColor', 'borderWidth', 'borderRadius',
            'color', 'fontFamily', 'fontSize', 'paddingTop', 'boxShadow'
        ];
        
        keyProperties.forEach(prop => {
            const value = comprehensiveAnalysis.allCSSProperties[prop];
            console.log(`  ${prop}: ${value}`);
        });
        
        // Check what ALL properties need token-based fixing
        console.log('\n🚨 SYSTEMATIC ISSUE IDENTIFICATION:');
        
        const tokenBased = comprehensiveAnalysis.shadowDOMRules
            .filter(rule => rule.usesTokens)
            .flatMap(rule => rule.tokens)
            .map(token => token.replace('var(', '').replace(')', ''));
        
        const uniqueTokens = [...new Set(tokenBased)];
        console.log(`Unique Tokens Used in Shadow DOM: ${uniqueTokens.length}`);
        uniqueTokens.slice(0, 15).forEach((token, i) => {
            console.log(`  ${i}: ${token}`);
        });
        
        console.log('\n💡 SOLUTION SCOPE:');
        console.log('- Background colors: ❌ Currently fixed for --fill only');
        console.log('- Border colors: ❓ Need systematic fix for --border-color, --elvt-alias-layout-border-*');
        console.log('- Typography: ❓ Need systematic fix for --elvt-type-alias-*');
        console.log('- Spacing: ❓ Need systematic fix for --distance-*, --padding-*');
        console.log('- All other token-based properties: ❓ Need comprehensive solution');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

analyzeAllTokenInterference();