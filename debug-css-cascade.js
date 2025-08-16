const { chromium } = require('playwright');

async function debugCSSCascade() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🔍 Analyzing CSS cascade and token inheritance...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        // Deep analysis of CSS cascade and token resolution
        const cascadeAnalysis = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            if (!card) return { error: 'No card found' };
            
            // Check where tokens are defined and their cascade order
            const tokenSources = {};
            const tokensToCheck = [
                '--elvt-alias-layout-border-default',
                '--elvt-alias-layout-layer-default', 
                '--elvt-alias-layout-layer-elevated',
                '--elvt-primitives-color-gray-200',
                '--elvt-primitives-color-gray-50'
            ];
            
            tokensToCheck.forEach(token => {
                // Check document root
                const docValue = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
                // Check body
                const bodyValue = getComputedStyle(document.body).getPropertyValue(token).trim();
                // Check component
                const componentValue = getComputedStyle(card).getPropertyValue(token).trim();
                
                tokenSources[token] = {
                    document: docValue || 'NOT DEFINED',
                    body: bodyValue || 'NOT DEFINED', 
                    component: componentValue || 'NOT DEFINED',
                    // Check if they're the same (proper inheritance)
                    inheritance: docValue === componentValue ? 'INHERITED' : 'BLOCKED'
                };
            });
            
            // Check Shadow DOM token resolution
            let shadowTokens = {};
            if (card.shadowRoot) {
                // Try to access the actual CSS rules in Shadow DOM
                const adoptedSheets = card.shadowRoot.adoptedStyleSheets || [];
                shadowTokens = {
                    adoptedSheetsCount: adoptedSheets.length,
                    // Check what the Shadow DOM thinks these tokens are
                    shadowResolution: {}
                };
                
                tokensToCheck.forEach(token => {
                    // Get the resolved value from Shadow DOM perspective
                    const shadowValue = getComputedStyle(card).getPropertyValue(token).trim();
                    shadowTokens.shadowResolution[token] = shadowValue || 'NOT RESOLVED';
                });
            }
            
            // Check CSS custom property definition order
            const stylesheetAnalysis = [];
            Array.from(document.styleSheets).forEach((sheet, index) => {
                try {
                    if (sheet.href) {
                        stylesheetAnalysis.push({
                            index,
                            href: sheet.href,
                            isElevate: sheet.href.includes('elevate'),
                            isDocusaurus: sheet.href.includes('styles.css') || sheet.href.includes('main'),
                            hasRules: !!sheet.cssRules
                        });
                    }
                } catch (e) {
                    stylesheetAnalysis.push({
                        index,
                        href: sheet.href || 'inline',
                        error: 'CORS blocked'
                    });
                }
            });
            
            // Check if our theme classes are actually applying
            const themeClassAnalysis = {
                documentTheme: document.documentElement.getAttribute('data-theme'),
                cardClasses: Array.from(card.classList),
                // Check if theme-specific CSS selectors would match
                wouldMatchLight: card.matches('.elvt-theme-light'),
                wouldMatchDark: card.matches('.elvt-theme-dark'),
                wouldMatchThemed: card.matches('[class*="elvt-theme"]')
            };
            
            return {
                tokenSources,
                shadowTokens,
                stylesheetAnalysis,
                themeClassAnalysis
            };
        });
        
        console.log('📊 CSS Cascade Analysis:');
        
        console.log('\n🎯 Token Source Analysis:');
        Object.entries(cascadeAnalysis.tokenSources).forEach(([token, sources]) => {
            console.log(`${token}:`);
            console.log(`  Document: ${sources.document}`);
            console.log(`  Component: ${sources.component}`);
            console.log(`  Inheritance: ${sources.inheritance}`);
        });
        
        console.log('\n🌙 Shadow DOM Token Resolution:');
        console.log(`Adopted StyleSheets: ${cascadeAnalysis.shadowTokens.adoptedSheetsCount}`);
        Object.entries(cascadeAnalysis.shadowTokens.shadowResolution || {}).forEach(([token, value]) => {
            console.log(`  ${token}: ${value}`);
        });
        
        console.log('\n📄 Stylesheet Load Order:');
        cascadeAnalysis.stylesheetAnalysis.forEach(sheet => {
            const type = sheet.isElevate ? 'ELEVATE' : sheet.isDocusaurus ? 'DOCUSAURUS' : 'OTHER';
            console.log(`  ${sheet.index}: ${type} - ${sheet.href}`);
        });
        
        console.log('\n🏷️  Theme Class Analysis:');
        console.log(cascadeAnalysis.themeClassAnalysis);
        
        // Test what happens if we remove Docusaurus styles temporarily
        console.log('\n🧪 Testing Docusaurus CSS Removal:');
        const removalTest = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            const originalBackground = getComputedStyle(card).backgroundColor;
            
            // Temporarily disable Docusaurus CSS
            const docusaurusSheets = Array.from(document.styleSheets).filter(sheet => 
                sheet.href && (sheet.href.includes('styles.css') || sheet.href.includes('main'))
            );
            
            docusaurusSheets.forEach(sheet => sheet.disabled = true);
            
            // Force recalculation
            document.body.offsetHeight;
            
            const afterRemoval = getComputedStyle(card).backgroundColor;
            
            // Re-enable
            docusaurusSheets.forEach(sheet => sheet.disabled = false);
            
            return {
                originalBackground,
                afterDocusaurusRemoval: afterRemoval,
                disabledSheets: docusaurusSheets.length
            };
        });
        
        console.log('Docusaurus Removal Test:', removalTest);
        
        // Check the actual CSS specificity issue
        console.log('\n🎯 CSS Specificity Analysis:');
        const specificityTest = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            
            // Check what CSS rules are actually being applied
            const computedStyle = getComputedStyle(card);
            
            // Test different selector approaches
            const tests = {};
            
            // Test 1: Check if :host styles are being applied
            tests.hostBackground = computedStyle.getPropertyValue('background-color');
            tests.hostFill = computedStyle.getPropertyValue('--fill');
            
            // Test 2: Check CSS custom property resolution chain
            const fillValue = computedStyle.getPropertyValue('--fill');
            const layerElevatedValue = computedStyle.getPropertyValue('--elvt-alias-layout-layer-elevated');
            tests.tokenChain = {
                fill: fillValue,
                layerElevated: layerElevatedValue,
                chainsCorrectly: fillValue === layerElevatedValue
            };
            
            return tests;
        });
        
        console.log('Specificity Test Results:', specificityTest);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

debugCSSCascade();