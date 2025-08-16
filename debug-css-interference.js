const { chromium } = require('playwright');

async function debugCSSInterference() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Debugging CSS interference in Docusaurus...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        // Deep dive into CSS rules affecting the card
        const cssInterferenceAnalysis = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            if (!card) return { error: 'No card found' };
            
            // Get all computed styles
            const computedStyle = getComputedStyle(card);
            
            // Check if there are any CSS rules explicitly setting background-color
            const allRules = [];
            Array.from(document.styleSheets).forEach(sheet => {
                try {
                    Array.from(sheet.cssRules || []).forEach(rule => {
                        if (rule.style && rule.selectorText) {
                            // Check if this rule might affect our card
                            if (rule.selectorText.includes('elvt-') || 
                                rule.selectorText.includes('*') || 
                                rule.selectorText.includes('card') ||
                                rule.style.backgroundColor ||
                                rule.style.background) {
                                allRules.push({
                                    selector: rule.selectorText,
                                    backgroundColor: rule.style.backgroundColor,
                                    background: rule.style.background,
                                    cssText: rule.cssText.substring(0, 200)
                                });
                            }
                        }
                    });
                } catch (e) {
                    // Skip CORS-blocked stylesheets
                }
            });
            
            // Test manual background setting
            const originalBackground = card.style.backgroundColor;
            card.style.backgroundColor = 'rgb(243, 244, 247)';
            const manualBackgroundResult = getComputedStyle(card).backgroundColor;
            card.style.backgroundColor = originalBackground;
            
            // Test if we can access the Shadow DOM styles directly
            let shadowDOMInfo = null;
            if (card.shadowRoot) {
                const shadowStyles = Array.from(card.shadowRoot.adoptedStyleSheets || []);
                shadowDOMInfo = {
                    adoptedStylesCount: shadowStyles.length,
                    shadowHTML: card.shadowRoot.innerHTML
                };
                
                // Try to see actual Shadow DOM CSS rules
                if (shadowStyles.length > 0) {
                    shadowDOMInfo.shadowRules = shadowStyles.map(sheet => {
                        try {
                            return Array.from(sheet.cssRules).slice(0, 5).map(rule => ({
                                selector: rule.selectorText,
                                cssText: rule.cssText.substring(0, 200)
                            }));
                        } catch (e) {
                            return 'Cannot access shadow CSS rules';
                        }
                    });
                }
            }
            
            // Test CSS custom property override
            const originalFill = card.style.getPropertyValue('--fill');
            card.style.setProperty('--fill', 'rgb(255, 0, 0)', 'important');
            const redFillResult = getComputedStyle(card).backgroundColor;
            card.style.setProperty('--fill', originalFill);
            
            return {
                cardComputedStyles: {
                    backgroundColor: computedStyle.backgroundColor,
                    background: computedStyle.background,
                    fillProperty: computedStyle.getPropertyValue('--fill'),
                    borderColor: computedStyle.borderColor,
                    display: computedStyle.display
                },
                relevantCSSRules: allRules.slice(0, 20), // First 20 relevant rules
                manualBackgroundTest: manualBackgroundResult,
                redFillTest: redFillResult,
                shadowDOMInfo
            };
        });
        
        console.log('📊 CSS Interference Analysis:');
        console.log('Card Computed Styles:', cssInterferenceAnalysis.cardComputedStyles);
        console.log('\n🧪 Manual Tests:');
        console.log('Manual background-color:', cssInterferenceAnalysis.manualBackgroundTest);
        console.log('Red --fill test:', cssInterferenceAnalysis.redFillTest);
        
        console.log('\n📋 Relevant CSS Rules:');
        cssInterferenceAnalysis.relevantCSSRules.forEach((rule, i) => {
            if (rule.backgroundColor || rule.background) {
                console.log(`${i + 1}. ${rule.selector}`);
                console.log(`   Background: ${rule.backgroundColor || rule.background}`);
                console.log(`   CSS: ${rule.cssText.substring(0, 100)}...`);
            }
        });
        
        console.log('\n🌙 Shadow DOM Info:');
        console.log(cssInterferenceAnalysis.shadowDOMInfo);
        
        if (cssInterferenceAnalysis.shadowDOMInfo?.shadowRules) {
            console.log('\n📜 Shadow DOM CSS Rules:');
            cssInterferenceAnalysis.shadowDOMInfo.shadowRules.forEach((sheet, i) => {
                console.log(`Sheet ${i}:`, sheet);
            });
        }
        
        // Now test potential fixes
        console.log('\n🔧 Testing Potential Fixes...');
        
        const fixTests = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            if (!card) return 'No card';
            
            const tests = {};
            
            // Test 1: Force CSS custom property with !important
            card.style.setProperty('--fill', 'rgb(243, 244, 247)', 'important');
            card.style.setProperty('background-color', 'var(--fill)', 'important');
            tests.forcedImportant = getComputedStyle(card).backgroundColor;
            
            // Test 2: Direct background-color with !important
            card.style.setProperty('background-color', 'rgb(243, 244, 247)', 'important');
            tests.directImportant = getComputedStyle(card).backgroundColor;
            
            // Test 3: Add CSS isolation
            card.style.isolation = 'isolate';
            tests.withIsolation = getComputedStyle(card).backgroundColor;
            
            // Test 4: Try CSS containment
            card.style.contain = 'style layout';
            tests.withContainment = getComputedStyle(card).backgroundColor;
            
            // Test 5: Force reflow
            card.style.display = 'none';
            card.offsetHeight; // Force reflow
            card.style.display = 'grid';
            tests.afterReflow = getComputedStyle(card).backgroundColor;
            
            return tests;
        });
        
        console.log('🧪 Fix Test Results:');
        Object.entries(fixTests).forEach(([test, result]) => {
            console.log(`  ${test}: ${result}`);
        });
        
        // Take screenshot of current state
        await page.screenshot({ path: 'debug-css-interference.png' });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

debugCSSInterference();