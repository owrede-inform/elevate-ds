const { chromium } = require('playwright');

async function findCSSOverride() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Finding CSS Override Source...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        // Analyze what's overriding the background-color
        const overrideAnalysis = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            
            // Get all computed styles and find what's setting background-color
            const computedStyle = getComputedStyle(card);
            
            // Check all possible selectors that might be affecting this element
            const possibleSelectors = [
                'elvt-card',
                'elvt-card[layer="elevated"]',
                '[class*="elvt-"]',
                '*',
                'div', // if it's being treated as div
                ':host',
                '.elvt-theme-light',
                'html[data-theme="light"] elvt-card',
                'body elvt-card'
            ];
            
            // Get all stylesheets and their rules
            const allRules = [];
            Array.from(document.styleSheets).forEach((sheet, sheetIndex) => {
                let sheetHref = 'unknown';
                try {
                    sheetHref = sheet.href || 'inline';
                    Array.from(sheet.cssRules || []).forEach((rule, ruleIndex) => {
                        if (rule.style && rule.selectorText) {
                            const bgColor = rule.style.backgroundColor;
                            const bgColorProp = rule.style.getPropertyValue('background-color');
                            if (bgColor || bgColorProp || rule.selectorText.includes('elvt') || rule.selectorText === '*') {
                                allRules.push({
                                    sheetIndex,
                                    sheetHref: sheetHref.split('/').pop(),
                                    selector: rule.selectorText,
                                    backgroundColor: bgColor || bgColorProp,
                                    priority: rule.style.getPropertyPriority('background-color'),
                                    cssText: rule.style.cssText.substring(0, 200) + (rule.style.cssText.length > 200 ? '...' : '')
                                });
                            }
                        }
                    });
                } catch (e) {
                    allRules.push({
                        sheetIndex,
                        sheetHref: sheetHref.split('/').pop(),
                        error: 'CORS blocked or other error'
                    });
                }
            });
            
            // Check if there are any universal selectors or reset CSS
            const suspiciousRules = allRules.filter(rule => 
                rule.selector === '*' || 
                rule.selector === '*, *::before, *::after' ||
                rule.backgroundColor === 'transparent' ||
                rule.backgroundColor === 'rgba(0, 0, 0, 0)' ||
                rule.selector?.includes('elvt')
            );
            
            return {
                computedBackground: computedStyle.backgroundColor,
                fillToken: computedStyle.getPropertyValue('--fill'),
                totalRules: allRules.length,
                suspiciousRules: suspiciousRules.slice(0, 10),
                allBackgroundRules: allRules.filter(r => r.backgroundColor).slice(0, 15)
            };
        });
        
        console.log('📊 CSS Override Analysis:');
        console.log(`Total CSS Rules Analyzed: ${overrideAnalysis.totalRules}`);
        console.log(`Computed Background: ${overrideAnalysis.computedBackground}`);
        console.log(`--fill Token: ${overrideAnalysis.fillToken}`);
        
        console.log('\n🚨 Suspicious Rules (Universal selectors, transparent, elvt-related):');
        overrideAnalysis.suspiciousRules.forEach((rule, i) => {
            console.log(`${i}: ${rule.selector} -> ${rule.backgroundColor} (${rule.sheetHref})`);
            if (rule.priority) console.log(`   Priority: ${rule.priority}`);
            if (rule.cssText) console.log(`   CSS: ${rule.cssText}`);
        });
        
        console.log('\n🎯 All Background Color Rules:');
        overrideAnalysis.allBackgroundRules.forEach((rule, i) => {
            console.log(`${i}: ${rule.selector} -> ${rule.backgroundColor} (${rule.sheetHref})`);
        });
        
        // Test if we can identify the specific override by temporarily disabling stylesheets
        console.log('\n🧪 Testing Stylesheet Disable to Find Override:');
        const disableTest = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            const results = [];
            
            Array.from(document.styleSheets).forEach((sheet, index) => {
                const before = getComputedStyle(card).backgroundColor;
                
                try {
                    sheet.disabled = true;
                    card.offsetHeight; // Force reflow
                    const after = getComputedStyle(card).backgroundColor;
                    sheet.disabled = false; // Re-enable
                    
                    if (before !== after) {
                        results.push({
                            sheetIndex: index,
                            href: (sheet.href || 'inline').split('/').pop(),
                            before,
                            after,
                            fixed: after !== 'rgba(0, 0, 0, 0)'
                        });
                    }
                } catch (e) {
                    sheet.disabled = false; // Make sure to re-enable
                }
            });
            
            return results;
        });
        
        console.log('Stylesheet Disable Test Results:');
        disableTest.forEach(result => {
            console.log(`${result.sheetIndex}: ${result.href}`);
            console.log(`  Before: ${result.before} -> After: ${result.after}`);
            console.log(`  ${result.fixed ? '✅ FIXES ISSUE' : '❌ NO CHANGE'}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

findCSSOverride();