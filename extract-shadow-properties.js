const { chromium } = require('playwright');

async function extractShadowProperties() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Extracting All Shadow DOM CSS Properties...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        const shadowAnalysis = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            if (!card.shadowRoot) return { error: 'No shadow root' };
            
            const adoptedSheets = card.shadowRoot.adoptedStyleSheets || [];
            const allCSSRules = [];
            const tokenizedProperties = new Set();
            const allTokens = new Set();
            
            adoptedSheets.forEach((sheet, sheetIndex) => {
                try {
                    Array.from(sheet.cssRules || []).forEach((rule, ruleIndex) => {
                        if (rule.selectorText && rule.selectorText.includes(':host')) {
                            const style = rule.style;
                            const cssText = style.cssText;
                            
                            // Extract all CSS properties and their values
                            const properties = {};
                            for (let i = 0; i < style.length; i++) {
                                const prop = style.item(i);
                                const value = style.getPropertyValue(prop);
                                properties[prop] = value;
                                
                                // Check if this property uses a token
                                if (value.includes('var(--')) {
                                    tokenizedProperties.add(prop);
                                    // Extract all tokens from this value
                                    const tokens = value.match(/var\(--[^)]+\)/g) || [];
                                    tokens.forEach(token => {
                                        // Clean up the token name
                                        const tokenName = token.replace('var(', '').replace(')', '').split(',')[0].trim();
                                        allTokens.add(tokenName);
                                    });
                                }
                            }
                            
                            allCSSRules.push({
                                selector: rule.selectorText,
                                properties: properties,
                                cssText: cssText,
                                usesTokens: cssText.includes('var(--')
                            });
                        }
                    });
                } catch (e) {
                    console.error('Error processing sheet:', e);
                }
            });
            
            return {
                totalRules: allCSSRules.length,
                rulesWithTokens: allCSSRules.filter(r => r.usesTokens).length,
                tokenizedProperties: Array.from(tokenizedProperties).sort(),
                allTokens: Array.from(allTokens).sort(),
                detailedRules: allCSSRules.filter(r => r.usesTokens)
            };
        });
        
        console.log('📊 Shadow DOM CSS Analysis:');
        console.log(`Total Shadow DOM Rules: ${shadowAnalysis.totalRules}`);
        console.log(`Rules Using Tokens: ${shadowAnalysis.rulesWithTokens}`);
        console.log(`CSS Properties Using Tokens: ${shadowAnalysis.tokenizedProperties.length}`);
        console.log(`Unique Tokens Used: ${shadowAnalysis.allTokens.length}`);
        
        console.log('\n🎯 CSS Properties That Use ELEVATE Tokens:');
        shadowAnalysis.tokenizedProperties.forEach((prop, i) => {
            console.log(`  ${i + 1}: ${prop}`);
        });
        
        console.log('\n🔧 Token Categories:');
        const tokenCategories = {
            measures: shadowAnalysis.allTokens.filter(t => t.includes('measures')),
            alias: shadowAnalysis.allTokens.filter(t => t.includes('alias')),
            component: shadowAnalysis.allTokens.filter(t => t.includes('component')),
            custom: shadowAnalysis.allTokens.filter(t => !t.includes('elvt-') && !t.includes('sl-'))
        };
        
        Object.entries(tokenCategories).forEach(([category, tokens]) => {
            console.log(`\n${category.toUpperCase()} (${tokens.length}):`);
            tokens.slice(0, 10).forEach((token, i) => {
                console.log(`  ${i + 1}: ${token}`);
            });
            if (tokens.length > 10) console.log(`  ... and ${tokens.length - 10} more`);
        });
        
        console.log('\n📋 Detailed Shadow DOM Rules:');
        shadowAnalysis.detailedRules.forEach((rule, i) => {
            console.log(`\n${i + 1}. ${rule.selector}:`);
            Object.entries(rule.properties).forEach(([prop, value]) => {
                if (value.includes('var(--')) {
                    console.log(`   ${prop}: ${value}`);
                }
            });
        });
        
        // Generate the systematic CSS fix
        console.log('\n🚀 SYSTEMATIC CSS FIX NEEDED:');
        console.log('All these CSS properties need to be set with !important to override Docusaurus:');
        shadowAnalysis.tokenizedProperties.forEach(prop => {
            // Find the token variable used for this property
            let tokenVar = 'var(--token-name)'; // placeholder
            
            // Look through the rules to find what token this property uses
            for (const rule of shadowAnalysis.detailedRules) {
                if (rule.properties[prop] && rule.properties[prop].includes('var(--')) {
                    // Extract the first token from the value
                    const match = rule.properties[prop].match(/var\(--[^)]+\)/);
                    if (match) {
                        tokenVar = match[0];
                        break;
                    }
                }
            }
            
            console.log(`  ${prop}: ${tokenVar} !important;`);
        });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

extractShadowProperties();