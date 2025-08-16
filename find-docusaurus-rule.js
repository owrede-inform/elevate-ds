const { chromium } = require('playwright');

async function findDocusaurusRule() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Finding Exact Docusaurus Rule...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        const ruleAnalysis = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            
            // Find ALL CSS rules that set background-color
            const allBgRules = [];
            
            Array.from(document.styleSheets).forEach((sheet, sheetIndex) => {
                try {
                    Array.from(sheet.cssRules || []).forEach((rule, ruleIndex) => {
                        if (rule.style && rule.selectorText) {
                            const bgColor = rule.style.backgroundColor;
                            if (bgColor) {
                                // Check if this rule matches our card
                                let matches = false;
                                try {
                                    matches = card.matches(rule.selectorText);
                                } catch (e) {
                                    // Complex selectors might fail
                                }
                                
                                allBgRules.push({
                                    sheetIndex,
                                    ruleIndex,
                                    selector: rule.selectorText,
                                    backgroundColor: bgColor,
                                    priority: rule.style.getPropertyPriority('background-color'),
                                    matches: matches,
                                    specificity: rule.selectorText.split(' ').length, // rough specificity
                                    href: (sheet.href || 'inline').split('/').pop()
                                });
                            }
                        }
                    });
                } catch (e) {
                    // CORS issues
                }
            });
            
            // Sort by specificity (rough)
            allBgRules.sort((a, b) => b.specificity - a.specificity);
            
            // Find the rule that's actually affecting our element
            const matchingRules = allBgRules.filter(rule => rule.matches);
            
            // Test creating an even more specific rule
            const testSpecificRule = () => {
                // Get the current computed style stack for background-color
                const computedBg = getComputedStyle(card).backgroundColor;
                
                // Try creating a rule with maximum specificity
                const style = document.createElement('style');
                style.id = 'max-specificity-test';
                
                // Calculate extremely high specificity
                // Get all parent elements for maximum specificity
                const parents = [];
                let current = card.parentElement;
                while (current && current !== document.body) {
                    const selector = current.tagName.toLowerCase() + 
                        (current.id ? '#' + current.id : '') +
                        (current.className ? '.' + Array.from(current.classList).join('.') : '');
                    parents.unshift(selector);
                    current = current.parentElement;
                }
                
                const maxSpecificitySelector = 'html body ' + parents.join(' ') + ' elvt-card[layer="elevated"]';
                
                style.textContent = `
                    ${maxSpecificitySelector} {
                        background-color: var(--fill) !important;
                    }
                `;
                document.head.appendChild(style);
                
                card.offsetHeight; // Force reflow
                const afterMaxSpec = getComputedStyle(card).backgroundColor;
                
                document.head.removeChild(style);
                
                return {
                    selector: maxSpecificitySelector,
                    before: computedBg,
                    after: afterMaxSpec,
                    worked: afterMaxSpec !== 'rgba(0, 0, 0, 0)'
                };
            };
            
            return {
                totalBgRules: allBgRules.length,
                matchingRules: matchingRules.slice(0, 10),
                topSpecificityRules: allBgRules.slice(0, 10),
                maxSpecificityTest: testSpecificRule()
            };
        });
        
        console.log('📊 Docusaurus Rule Analysis:');
        console.log(`Total Background Rules: ${ruleAnalysis.totalBgRules}`);
        console.log(`Matching Rules: ${ruleAnalysis.matchingRules.length}`);
        
        console.log('\n🎯 Rules That Match Our Element:');
        ruleAnalysis.matchingRules.forEach((rule, i) => {
            console.log(`${i}: ${rule.selector} -> ${rule.backgroundColor} (${rule.href})`);
            console.log(`   Specificity: ${rule.specificity}, Priority: ${rule.priority || 'normal'}`);
        });
        
        console.log('\n🏆 Highest Specificity Rules:');
        ruleAnalysis.topSpecificityRules.forEach((rule, i) => {
            const status = rule.matches ? '✅ MATCHES' : '❌ NO MATCH';
            console.log(`${i}: ${rule.selector} -> ${rule.backgroundColor} (spec: ${rule.specificity}) ${status}`);
        });
        
        console.log('\n🚀 Maximum Specificity Test:');
        const maxTest = ruleAnalysis.maxSpecificityTest;
        console.log(`Selector: ${maxTest.selector}`);
        console.log(`Before: ${maxTest.before}`);
        console.log(`After: ${maxTest.after}`);
        console.log(`Status: ${maxTest.worked ? '✅ SUCCESS!' : '❌ STILL FAILED'}`);
        
        if (maxTest.worked) {
            console.log('\n🎉 FOUND WORKING SOLUTION! This selector has enough specificity.');
            
            // Test it with different ELEVATE components
            const componentTest = await page.evaluate((workingSelector) => {
                const components = ['elvt-card', 'elvt-button'];
                const results = {};
                
                components.forEach(componentType => {
                    const element = document.querySelector(componentType);
                    if (element) {
                        const selector = workingSelector.replace('elvt-card[layer="elevated"]', componentType);
                        
                        const style = document.createElement('style');
                        style.textContent = `
                            ${selector} {
                                background-color: var(--fill) !important;
                            }
                        `;
                        document.head.appendChild(style);
                        
                        element.offsetHeight;
                        const bg = getComputedStyle(element).backgroundColor;
                        
                        document.head.removeChild(style);
                        
                        results[componentType] = {
                            selector,
                            backgroundColor: bg,
                            worked: bg !== 'rgba(0, 0, 0, 0)'
                        };
                    }
                });
                
                return results;
            }, maxTest.selector);
            
            console.log('\n🧪 Component Test Results:');
            Object.entries(componentTest).forEach(([component, result]) => {
                const status = result.worked ? '✅ WORKS' : '❌ FAILED';
                console.log(`${component}: ${result.backgroundColor} ${status}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

findDocusaurusRule();