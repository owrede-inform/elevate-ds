const { chromium } = require('playwright');

async function analyzeShadowCSS() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Analyzing Shadow DOM CSS Implementation...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        const shadowDOMAnalysis = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            if (!card || !card.shadowRoot) return { error: 'No shadow root found' };
            
            const shadowRoot = card.shadowRoot;
            const adoptedSheets = shadowRoot.adoptedStyleSheets || [];
            
            // Get all CSS rules from adopted stylesheets
            const cssRules = [];
            adoptedSheets.forEach((sheet, sheetIndex) => {
                try {
                    Array.from(sheet.cssRules || []).forEach((rule, ruleIndex) => {
                        if (rule.selectorText && rule.selectorText.includes(':host')) {
                            cssRules.push({
                                sheetIndex,
                                ruleIndex,
                                selector: rule.selectorText,
                                cssText: rule.style.cssText,
                                backgroundColor: rule.style.backgroundColor,
                                fill: rule.style.getPropertyValue('background-color'),
                                customProps: Array.from(rule.style).filter(prop => prop.startsWith('--'))
                            });
                        }
                    });
                } catch (e) {
                    cssRules.push({ error: e.message, sheetIndex });
                }
            });
            
            // Check computed styles
            const computedStyle = getComputedStyle(card);
            const analysis = {
                adoptedSheetsCount: adoptedSheets.length,
                cssRules: cssRules.slice(0, 10), // First 10 rules
                computedStyles: {
                    backgroundColor: computedStyle.backgroundColor,
                    fill: computedStyle.getPropertyValue('--fill'),
                    borderColor: computedStyle.borderColor,
                    backgroundImage: computedStyle.backgroundImage,
                    backgroundRepeat: computedStyle.backgroundRepeat
                },
                // Check if the background is actually transparent and why
                backgroundInvestigation: {
                    hasTransparentBg: computedStyle.backgroundColor === 'rgba(0, 0, 0, 0)',
                    fillToken: computedStyle.getPropertyValue('--fill'),
                    layerToken: computedStyle.getPropertyValue('--elvt-alias-layout-layer-elevated'),
                    // Check if there's a background property that should be using --fill
                    backgroundCSSText: Array.from(computedStyle).filter(prop => prop.includes('background'))
                }
            };
            
            return analysis;
        });
        
        console.log('📊 Shadow DOM Analysis Results:');
        console.log(`Adopted StyleSheets: ${shadowDOMAnalysis.adoptedSheetsCount}`);
        
        console.log('\n🎯 :host CSS Rules:');
        shadowDOMAnalysis.cssRules.forEach((rule, i) => {
            console.log(`${i}: ${rule.selector}`);
            console.log(`   CSS: ${rule.cssText}`);
            if (rule.backgroundColor) console.log(`   Background: ${rule.backgroundColor}`);
            if (rule.customProps.length > 0) console.log(`   Custom Props: ${rule.customProps.join(', ')}`);
        });
        
        console.log('\n🔍 Computed Styles:');
        Object.entries(shadowDOMAnalysis.computedStyles).forEach(([key, value]) => {
            console.log(`  ${key}: ${value}`);
        });
        
        console.log('\n🕵️ Background Investigation:');
        const inv = shadowDOMAnalysis.backgroundInvestigation;
        console.log(`  Transparent Background: ${inv.hasTransparentBg}`);
        console.log(`  --fill Token: ${inv.fillToken}`);
        console.log(`  --layer Token: ${inv.layerToken}`);
        console.log(`  Background Properties: ${inv.backgroundCSSText.join(', ')}`);
        
        // Now check if we can manually trigger the background application
        console.log('\n🧪 Testing Manual Background Application:');
        const manualTest = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            const beforeBackground = getComputedStyle(card).backgroundColor;
            
            // Try setting background-color directly via CSS custom property
            card.style.setProperty('background-color', 'var(--fill)', 'important');
            
            // Force a reflow
            card.offsetHeight;
            
            const afterBackground = getComputedStyle(card).backgroundColor;
            
            return {
                before: beforeBackground,
                after: afterBackground,
                fillToken: getComputedStyle(card).getPropertyValue('--fill'),
                changed: beforeBackground !== afterBackground
            };
        });
        
        console.log('Manual Test Results:', manualTest);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

analyzeShadowCSS();