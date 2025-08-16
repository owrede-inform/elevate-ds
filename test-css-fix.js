const { chromium } = require('playwright');

async function testCSSFix() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🧪 Testing CSS Fix Implementation...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        // Check if our CSS rule is being applied
        const cssAnalysis = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            const computedStyle = getComputedStyle(card);
            
            // Check all CSS rules that apply to this element
            const allRules = [];
            Array.from(document.styleSheets).forEach((sheet, sheetIndex) => {
                try {
                    Array.from(sheet.cssRules || []).forEach((rule, ruleIndex) => {
                        if (rule.style && rule.selectorText) {
                            // Check if this rule applies to our card
                            try {
                                if (card.matches(rule.selectorText) || 
                                    rule.selectorText.includes('elvt-card') ||
                                    rule.selectorText.includes('main') ||
                                    rule.selectorText === '*') {
                                    
                                    const bgColor = rule.style.backgroundColor;
                                    const bgColorProp = rule.style.getPropertyValue('background-color');
                                    
                                    allRules.push({
                                        sheetIndex,
                                        sheetHref: (sheet.href || 'inline').split('/').pop(),
                                        selector: rule.selectorText,
                                        backgroundColor: bgColor || bgColorProp || 'none',
                                        priority: rule.style.getPropertyPriority('background-color'),
                                        matches: card.matches(rule.selectorText)
                                    });
                                }
                            } catch (e) {
                                // Some selectors can't be matched
                            }
                        }
                    });
                } catch (e) {
                    // CORS or other issues
                }
            });
            
            // Filter for background-color rules
            const backgroundRules = allRules.filter(rule => 
                rule.backgroundColor && rule.backgroundColor !== 'none'
            );
            
            return {
                computedBackground: computedStyle.backgroundColor,
                fillToken: computedStyle.getPropertyValue('--fill'),
                matchingRules: backgroundRules.length,
                backgroundRules: backgroundRules.slice(0, 10)
            };
        });
        
        console.log('📊 CSS Analysis Results:');
        console.log(`Computed Background: ${cssAnalysis.computedBackground}`);
        console.log(`--fill Token: ${cssAnalysis.fillToken}`);
        console.log(`Matching Background Rules: ${cssAnalysis.matchingRules}`);
        
        console.log('\n🎯 Background Color Rules:');
        cssAnalysis.backgroundRules.forEach((rule, i) => {
            const status = rule.matches ? '✅ MATCHES' : '❌ NO MATCH';
            console.log(`${i}: ${rule.selector} -> ${rule.backgroundColor} (${rule.sheetHref}) ${status}`);
            if (rule.priority) console.log(`   Priority: ${rule.priority}`);
        });
        
        // Test if we can manually apply the fix
        console.log('\n🔧 Testing Manual Fix:');
        const manualFix = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            const before = getComputedStyle(card).backgroundColor;
            
            // Try different approaches
            const results = {};
            
            // Approach 1: Set background-color to unset
            card.style.setProperty('background-color', 'unset', 'important');
            card.offsetHeight;
            results.unset = getComputedStyle(card).backgroundColor;
            
            // Approach 2: Set background-color to inherit
            card.style.setProperty('background-color', 'inherit', 'important');
            card.offsetHeight;
            results.inherit = getComputedStyle(card).backgroundColor;
            
            // Approach 3: Set background-color to var(--fill)
            card.style.setProperty('background-color', 'var(--fill)', 'important');
            card.offsetHeight;
            results.varFill = getComputedStyle(card).backgroundColor;
            
            // Approach 4: Remove background-color property entirely
            card.style.removeProperty('background-color');
            card.offsetHeight;
            results.removed = getComputedStyle(card).backgroundColor;
            
            return {
                before,
                ...results,
                fillToken: getComputedStyle(card).getPropertyValue('--fill')
            };
        });
        
        console.log('Manual Fix Results:');
        Object.entries(manualFix).forEach(([method, value]) => {
            console.log(`  ${method}: ${value}`);
        });
        
        // Check if our specific CSS rule exists
        console.log('\n🔍 Checking Our CSS Rule:');
        const ourRuleCheck = await page.evaluate(() => {
            let foundOurRule = false;
            let ruleDetails = null;
            
            Array.from(document.styleSheets).forEach(sheet => {
                try {
                    Array.from(sheet.cssRules || []).forEach(rule => {
                        if (rule.selectorText && rule.selectorText.includes('main elvt-card')) {
                            foundOurRule = true;
                            ruleDetails = {
                                selector: rule.selectorText,
                                backgroundColor: rule.style.backgroundColor,
                                cssText: rule.style.cssText,
                                href: (sheet.href || 'inline').split('/').pop()
                            };
                        }
                    });
                } catch (e) {
                    // CORS issues
                }
            });
            
            return { foundOurRule, ruleDetails };
        });
        
        console.log(`Our Rule Found: ${ourRuleCheck.foundOurRule ? '✅' : '❌'}`);
        if (ourRuleCheck.ruleDetails) {
            console.log('Rule Details:', ourRuleCheck.ruleDetails);
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

testCSSFix();