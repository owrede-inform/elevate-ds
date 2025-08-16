const { chromium } = require('playwright');

async function debugShadowHost() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Debugging Shadow DOM Host Element...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        const hostAnalysis = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            
            // Check the actual host element vs Shadow DOM
            const hostStyle = getComputedStyle(card);
            const shadowRoot = card.shadowRoot;
            
            // Get Shadow DOM internal elements
            let shadowInternalStyles = {};
            if (shadowRoot) {
                const internalElements = shadowRoot.querySelectorAll('*');
                shadowInternalStyles = Array.from(internalElements).map(el => ({
                    tagName: el.tagName,
                    classes: Array.from(el.classList),
                    backgroundColor: getComputedStyle(el).backgroundColor,
                    styles: getComputedStyle(el).cssText.substring(0, 200)
                }));
            }
            
            // Check if the issue is that background is being applied to internal elements
            const analysis = {
                host: {
                    tagName: card.tagName,
                    classes: Array.from(card.classList),
                    attributes: Array.from(card.attributes).map(attr => `${attr.name}="${attr.value}"`),
                    backgroundColor: hostStyle.backgroundColor,
                    backgroundImage: hostStyle.backgroundImage,
                    display: hostStyle.display,
                    border: hostStyle.border,
                    borderColor: hostStyle.borderColor,
                    fill: hostStyle.getPropertyValue('--fill'),
                    hasShadowRoot: !!shadowRoot
                },
                shadowInternal: shadowInternalStyles.slice(0, 5), // First 5 internal elements
                
                // Test if we apply background to the host element itself
                directHostTest: () => {
                    const beforeBg = getComputedStyle(card).backgroundColor;
                    
                    // Apply background directly to host
                    card.style.setProperty('background', 'red', 'important');
                    card.offsetHeight;
                    const redTest = getComputedStyle(card).backgroundColor;
                    
                    // Apply the fill token
                    const fillValue = getComputedStyle(card).getPropertyValue('--fill').trim();
                    card.style.setProperty('background', fillValue, 'important');
                    card.offsetHeight;
                    const fillTest = getComputedStyle(card).backgroundColor;
                    
                    return { beforeBg, redTest, fillTest, fillValue };
                }
            };
            
            analysis.directHostTest = analysis.directHostTest();
            
            return analysis;
        });
        
        console.log('📊 Shadow DOM Host Analysis:');
        console.log('\n🏠 Host Element:');
        console.log(`  Tag: ${hostAnalysis.host.tagName}`);
        console.log(`  Classes: ${hostAnalysis.host.classes.join(', ')}`);
        console.log(`  Attributes: ${hostAnalysis.host.attributes.join(', ')}`);
        console.log(`  Background Color: ${hostAnalysis.host.backgroundColor}`);
        console.log(`  Background Image: ${hostAnalysis.host.backgroundImage}`);
        console.log(`  Display: ${hostAnalysis.host.display}`);
        console.log(`  Border: ${hostAnalysis.host.border}`);
        console.log(`  Border Color: ${hostAnalysis.host.borderColor}`);
        console.log(`  --fill Token: ${hostAnalysis.host.fill}`);
        console.log(`  Has Shadow Root: ${hostAnalysis.host.hasShadowRoot}`);
        
        console.log('\n🌙 Shadow DOM Internal Elements:');
        hostAnalysis.shadowInternal.forEach((el, i) => {
            console.log(`  ${i}: ${el.tagName} (${el.classes.join(',')}) -> bg: ${el.backgroundColor}`);
        });
        
        console.log('\n🧪 Direct Host Element Test:');
        const test = hostAnalysis.directHostTest;
        console.log(`  Before: ${test.beforeBg}`);
        console.log(`  Red Test: ${test.redTest} ${test.redTest.includes('255, 0, 0') ? '✅ WORKS' : '❌ FAILED'}`);
        console.log(`  Fill Test: ${test.fillTest} ${test.fillTest !== 'rgba(0, 0, 0, 0)' ? '✅ WORKS' : '❌ FAILED'}`);
        console.log(`  Fill Value: ${test.fillValue}`);
        
        // If direct host styling works, the issue is with CSS specificity/cascade
        if (test.redTest.includes('255, 0, 0') && test.fillTest !== 'rgba(0, 0, 0, 0)') {
            console.log('\n✅ SOLUTION: Direct host styling works! Issue is CSS specificity.');
            
            // Test if we can create the right CSS selector
            const cssTest = await page.evaluate(() => {
                const card = document.querySelector('elvt-card[layer="elevated"]');
                
                // Remove any existing styles
                card.style.removeProperty('background');
                
                // Try creating a super-specific CSS rule
                const style = document.createElement('style');
                style.id = 'elvt-fix-test';
                
                // Try different selector approaches
                const selectors = [
                    'body main article div elvt-card[layer="elevated"]',
                    'html body main article div elvt-card[layer="elevated"]',
                    'div.theme-doc-markdown elvt-card[layer="elevated"]',
                    '.theme-doc-markdown elvt-card[layer="elevated"]',
                    'article elvt-card[layer="elevated"]'
                ];
                
                const results = [];
                
                selectors.forEach(selector => {
                    // Remove previous test
                    const existing = document.getElementById('elvt-fix-test');
                    if (existing) existing.remove();
                    
                    // Add new test
                    const newStyle = document.createElement('style');
                    newStyle.id = 'elvt-fix-test';
                    newStyle.textContent = `
                        ${selector} {
                            background-color: var(--fill) !important;
                        }
                    `;
                    document.head.appendChild(newStyle);
                    
                    // Force reflow and check
                    card.offsetHeight;
                    const bg = getComputedStyle(card).backgroundColor;
                    
                    results.push({
                        selector,
                        backgroundColor: bg,
                        works: bg !== 'rgba(0, 0, 0, 0)'
                    });
                });
                
                return results;
            });
            
            console.log('\n🎯 CSS Selector Tests:');
            cssTest.forEach(test => {
                const status = test.works ? '✅ WORKS' : '❌ FAILED';
                console.log(`  ${test.selector} -> ${test.backgroundColor} ${status}`);
            });
            
            const workingSelectors = cssTest.filter(t => t.works);
            if (workingSelectors.length > 0) {
                console.log(`\n🏆 WORKING SELECTORS FOUND: ${workingSelectors.map(s => s.selector).join(', ')}`);
            }
        } else {
            console.log('\n❌ Even direct host styling failed. The issue is deeper.');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

debugShadowHost();