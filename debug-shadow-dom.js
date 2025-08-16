const { chromium } = require('playwright');

async function debugShadowDOM() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Debugging Shadow DOM styles...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 10000 });
        
        // Inspect Shadow DOM styles in detail
        const shadowDOMAnalysis = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            if (!card || !card.shadowRoot) {
                return { error: 'No Shadow DOM found' };
            }
            
            // Get host styles
            const hostStyle = getComputedStyle(card);
            
            // Get Shadow DOM styles
            const shadowStyle = getComputedStyle(card, ':host');
            
            // Try to find the actual styled element within Shadow DOM
            const shadowElements = card.shadowRoot.querySelectorAll('*');
            const shadowChildren = Array.from(shadowElements).map(el => {
                const style = getComputedStyle(el);
                return {
                    tagName: el.tagName,
                    className: el.className,
                    backgroundColor: style.backgroundColor,
                    borderColor: style.borderColor,
                    display: style.display
                };
            });
            
            // Get all CSS custom properties from the host
            const customProps = {};
            for (let i = 0; i < hostStyle.length; i++) {
                const prop = hostStyle.item(i);
                if (prop.startsWith('--')) {
                    customProps[prop] = hostStyle.getPropertyValue(prop).trim();
                }
            }
            
            return {
                hostClasses: Array.from(card.classList),
                hostLayer: card.getAttribute('layer'),
                hostStyles: {
                    backgroundColor: hostStyle.backgroundColor,
                    borderColor: hostStyle.borderColor,
                    borderWidth: hostStyle.borderWidth,
                    borderStyle: hostStyle.borderStyle,
                    display: hostStyle.display
                },
                customProperties: customProps,
                shadowChildren,
                shadowDOMHTML: card.shadowRoot.innerHTML.substring(0, 500)
            };
        });
        
        console.log('🎯 Shadow DOM Analysis:');
        console.log('Host classes:', shadowDOMAnalysis.hostClasses);
        console.log('Host layer:', shadowDOMAnalysis.hostLayer);
        console.log('Host styles:', shadowDOMAnalysis.hostStyles);
        
        console.log('\n📋 Custom Properties (first 10):');
        const customProps = shadowDOMAnalysis.customProperties;
        Object.keys(customProps).slice(0, 10).forEach(prop => {
            console.log(`  ${prop}: ${customProps[prop]}`);
        });
        
        console.log('\n🌳 Shadow DOM Children:');
        shadowDOMAnalysis.shadowChildren.forEach((child, i) => {
            if (child.backgroundColor !== 'rgba(0, 0, 0, 0)' || child.borderColor !== 'rgb(0, 0, 0)') {
                console.log(`  ${i}: ${child.tagName}.${child.className}`);
                console.log(`    Background: ${child.backgroundColor}`);
                console.log(`    Border: ${child.borderColor}`);
            }
        });
        
        console.log('\n📄 Shadow DOM HTML (first 500 chars):');
        console.log(shadowDOMAnalysis.shadowDOMHTML);
        
        // Test if we can manually apply styles
        const manualStyleTest = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            if (!card) return 'No card found';
            
            // Try different approaches to apply background
            const originalBg = card.style.backgroundColor;
            
            // Approach 1: Direct style
            card.style.backgroundColor = 'rgb(243, 244, 247)';
            const directStyleResult = getComputedStyle(card).backgroundColor;
            
            // Approach 2: CSS custom property
            card.style.setProperty('--fill', 'rgb(243, 244, 247)');
            const customPropResult = getComputedStyle(card).backgroundColor;
            
            // Approach 3: Force Shadow DOM rerender
            card.style.display = 'none';
            card.offsetHeight; // Force reflow
            card.style.display = '';
            const rerenderResult = getComputedStyle(card).backgroundColor;
            
            return {
                original: originalBg,
                directStyle: directStyleResult,
                customProp: customPropResult,
                rerender: rerenderResult
            };
        });
        
        console.log('\n🧪 Manual Style Test Results:');
        Object.entries(manualStyleTest).forEach(([method, result]) => {
            console.log(`  ${method}: ${result}`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

debugShadowDOM();