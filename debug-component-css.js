const { chromium } = require('playwright');

async function debugComponentCSS() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🎨 Debugging component CSS loading...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 10000 });
        
        // Check if ELEVATE CSS is loaded and what's in the Shadow DOM
        const cssAnalysis = await page.evaluate(() => {
            const card = document.querySelector('elvt-card');
            
            // Check document stylesheets
            const stylesheets = Array.from(document.styleSheets).map(sheet => {
                try {
                    return {
                        href: sheet.href,
                        rules: sheet.cssRules ? sheet.cssRules.length : 'Cannot access'
                    };
                } catch (e) {
                    return {
                        href: sheet.href || 'inline',
                        rules: 'CORS blocked'
                    };
                }
            });
            
            // Check if the component is actually defined
            const componentDef = customElements.get('elvt-card');
            
            // Check Shadow DOM styles
            let shadowStyles = null;
            if (card && card.shadowRoot) {
                const shadowStyleSheets = Array.from(card.shadowRoot.styleSheets || []);
                const adoptedStyleSheets = card.shadowRoot.adoptedStyleSheets || [];
                
                shadowStyles = {
                    styleSheetsCount: shadowStyleSheets.length,
                    adoptedStyleSheetsCount: adoptedStyleSheets.length,
                    innerHTML: card.shadowRoot.innerHTML
                };
                
                // Try to get actual CSS from adopted stylesheets
                if (adoptedStyleSheets.length > 0) {
                    shadowStyles.adoptedCSS = adoptedStyleSheets.map(sheet => {
                        try {
                            return Array.from(sheet.cssRules).slice(0, 3).map(rule => rule.cssText);
                        } catch (e) {
                            return 'Cannot access rules';
                        }
                    });
                }
            }
            
            // Check if component constructor exists and has styles
            let componentInfo = null;
            if (componentDef) {
                componentInfo = {
                    name: componentDef.name,
                    hasStyles: componentDef.styles !== undefined,
                    stylesLength: componentDef.styles ? componentDef.styles.length : 0
                };
            }
            
            return {
                documentStylesheets: stylesheets.filter(s => s.href && s.href.includes('elevate')),
                componentDefined: !!componentDef,
                componentInfo,
                shadowStyles,
                cardExists: !!card,
                cardTagName: card ? card.tagName : null
            };
        });
        
        console.log('📊 CSS Loading Analysis:');
        console.log('Component defined:', cssAnalysis.componentDefined);
        console.log('Component info:', cssAnalysis.componentInfo);
        console.log('Card exists:', cssAnalysis.cardExists);
        
        console.log('\n📄 ELEVATE Stylesheets:');
        cssAnalysis.documentStylesheets.forEach(sheet => {
            console.log(`  ${sheet.href}: ${sheet.rules} rules`);
        });
        
        console.log('\n🌙 Shadow DOM Styles:');
        if (cssAnalysis.shadowStyles) {
            console.log(`  StyleSheets: ${cssAnalysis.shadowStyles.styleSheetsCount}`);
            console.log(`  Adopted StyleSheets: ${cssAnalysis.shadowStyles.adoptedStyleSheetsCount}`);
            console.log(`  Shadow innerHTML: ${cssAnalysis.shadowStyles.innerHTML.substring(0, 200)}`);
            
            if (cssAnalysis.shadowStyles.adoptedCSS) {
                console.log('  Adopted CSS (first 3 rules from each sheet):');
                cssAnalysis.shadowStyles.adoptedCSS.forEach((rules, i) => {
                    console.log(`    Sheet ${i}:`, rules);
                });
            }
        } else {
            console.log('  No Shadow DOM or no styles found');
        }
        
        // Try to manually inject the correct styles into Shadow DOM
        console.log('\n🔧 Testing manual Shadow DOM style injection...');
        const manualInjectionResult = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            if (!card || !card.shadowRoot) return 'No Shadow DOM';
            
            // Create a style element with the expected CSS
            const style = document.createElement('style');
            style.textContent = `
                :host {
                    --border-radius: var(--elvt-measures-radius-xs, 0.25rem);
                    --border-width: var(--elvt-measures-borderWidth-s, 0.0625rem);
                    --border-color: var(--elvt-alias-layout-border-default, rgb(213, 217, 225));
                    --fill: var(--elvt-alias-layout-layer-elevated, rgb(243, 244, 247));
                    display: grid;
                    grid-template-columns: 1fr;
                    grid-template-rows: min-content 10fr min-content;
                    grid-template-areas: "header" "content" "footer";
                    border: var(--border-width) solid var(--border-color);
                    border-radius: var(--border-radius);
                    background-color: var(--fill);
                }
            `;
            
            // Inject into Shadow DOM
            card.shadowRoot.appendChild(style);
            
            // Check if it worked
            const newStyle = getComputedStyle(card);
            return {
                backgroundColor: newStyle.backgroundColor,
                borderColor: newStyle.borderColor,
                borderRadius: newStyle.borderRadius
            };
        });
        
        console.log('Manual injection result:', manualInjectionResult);
        
        await page.screenshot({ path: 'debug-component-css.png' });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

debugComponentCSS();