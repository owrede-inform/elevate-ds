const { chromium } = require('playwright');

async function verifyFinalSolution() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Verifying Final Solution...');
        
        // Force hard refresh to clear any cache
        await page.goto('http://localhost:3000/docs/components/card', { waitUntil: 'networkidle' });
        await page.reload({ waitUntil: 'networkidle' });
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        // Check if our new CSS rules are present
        const cssCheck = await page.evaluate(() => {
            let foundOurMaxSpecRule = false;
            let ruleDetails = null;
            let allElevateRules = [];
            
            Array.from(document.styleSheets).forEach(sheet => {
                try {
                    Array.from(sheet.cssRules || []).forEach(rule => {
                        if (rule.selectorText && rule.selectorText.includes('elvt-')) {
                            const bgColor = rule.style.backgroundColor;
                            
                            allElevateRules.push({
                                selector: rule.selectorText.substring(0, 100) + (rule.selectorText.length > 100 ? '...' : ''),
                                backgroundColor: bgColor || 'none',
                                priority: rule.style.getPropertyPriority('background-color'),
                                href: (sheet.href || 'inline').split('/').pop()
                            });
                            
                            // Check for our maximum specificity rule
                            if (rule.selectorText.includes('html body #__docusaurus') && 
                                rule.selectorText.includes('elvt-card')) {
                                foundOurMaxSpecRule = true;
                                ruleDetails = {
                                    selector: rule.selectorText.substring(0, 200) + '...',
                                    backgroundColor: bgColor,
                                    cssText: rule.style.cssText,
                                    href: (sheet.href || 'inline').split('/').pop()
                                };
                            }
                        }
                    });
                } catch (e) {
                    // CORS issues
                }
            });
            
            return {
                foundOurMaxSpecRule,
                ruleDetails,
                totalElevateRules: allElevateRules.length,
                elevateRules: allElevateRules.slice(0, 10)
            };
        });
        
        console.log('📊 CSS Rules Verification:');
        console.log(`Total ELEVATE Rules Found: ${cssCheck.totalElevateRules}`);
        console.log(`Our Max Specificity Rule Found: ${cssCheck.foundOurMaxSpecRule ? '✅' : '❌'}`);
        
        if (cssCheck.ruleDetails) {
            console.log('\n🎯 Our Rule Details:');
            console.log(`Selector: ${cssCheck.ruleDetails.selector}`);
            console.log(`Background: ${cssCheck.ruleDetails.backgroundColor}`);
            console.log(`CSS: ${cssCheck.ruleDetails.cssText}`);
            console.log(`File: ${cssCheck.ruleDetails.href}`);
        }
        
        console.log('\n📋 All ELEVATE Rules:');
        cssCheck.elevateRules.forEach((rule, i) => {
            console.log(`${i}: ${rule.selector} -> ${rule.backgroundColor} (${rule.href})`);
        });
        
        // Now test the actual functionality
        console.log('\n🧪 Final Functionality Test:');
        const functionalTest = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            const results = {};
            
            // Test 1: Current state
            results.current = {
                backgroundColor: getComputedStyle(card).backgroundColor,
                fillToken: getComputedStyle(card).getPropertyValue('--fill'),
                classes: Array.from(card.classList)
            };
            
            // Test 2: Force apply our rule manually to see if it would work
            card.style.setProperty('background-color', 'unset', 'important');
            card.offsetHeight;
            results.manualUnset = {
                backgroundColor: getComputedStyle(card).backgroundColor,
                fillToken: getComputedStyle(card).getPropertyValue('--fill')
            };
            
            // Test 3: Force apply var(--fill)
            card.style.setProperty('background-color', 'var(--fill)', 'important');
            card.offsetHeight;
            results.manualVarFill = {
                backgroundColor: getComputedStyle(card).backgroundColor,
                fillToken: getComputedStyle(card).getPropertyValue('--fill')
            };
            
            // Reset
            card.style.removeProperty('background-color');
            
            return results;
        });
        
        console.log('Current State:', functionalTest.current);
        console.log('Manual Unset Test:', functionalTest.manualUnset);
        console.log('Manual var(--fill) Test:', functionalTest.manualVarFill);
        
        const isWorking = functionalTest.current.backgroundColor !== 'rgba(0, 0, 0, 0)';
        const manualUnsetWorks = functionalTest.manualUnset.backgroundColor !== 'rgba(0, 0, 0, 0)';
        const manualVarFillWorks = functionalTest.manualVarFill.backgroundColor !== 'rgba(0, 0, 0, 0)';
        
        console.log('\n🏆 FINAL ASSESSMENT:');
        console.log(`CSS Rules Loaded: ${cssCheck.foundOurMaxSpecRule ? '✅' : '❌'}`);
        console.log(`Automatic Working: ${isWorking ? '✅' : '❌'}`);
        console.log(`Manual Unset Works: ${manualUnsetWorks ? '✅' : '❌'}`);
        console.log(`Manual var(--fill) Works: ${manualVarFillWorks ? '✅' : '❌'}`);
        
        if (cssCheck.foundOurMaxSpecRule && !isWorking && manualVarFillWorks) {
            console.log('\n💡 INSIGHT: CSS rule exists but `unset` may not work. Need `var(--fill)` approach.');
        } else if (!cssCheck.foundOurMaxSpecRule) {
            console.log('\n💡 INSIGHT: CSS rules not loaded. Need to check CSS file or cache.');
        } else if (isWorking) {
            console.log('\n🎉 SUCCESS: Clean solution is working perfectly!');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

verifyFinalSolution();