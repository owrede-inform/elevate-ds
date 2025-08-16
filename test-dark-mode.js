const { chromium } = require('playwright');

async function testDarkMode() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🌙 Testing Dark Mode Token Switching...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        // Test light mode first
        console.log('\n☀️ Light Mode Analysis:');
        const lightMode = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            const computedStyle = getComputedStyle(card);
            
            return {
                theme: document.documentElement.getAttribute('data-theme'),
                cardClasses: Array.from(card.classList),
                backgroundColor: computedStyle.backgroundColor,
                borderColor: computedStyle.borderColor,
                tokens: {
                    borderDefault: computedStyle.getPropertyValue('--elvt-alias-layout-border-default').trim(),
                    layerElevated: computedStyle.getPropertyValue('--elvt-alias-layout-layer-elevated').trim(),
                    fill: computedStyle.getPropertyValue('--fill').trim()
                }
            };
        });
        
        console.log('Light Mode Results:', lightMode);
        
        // Switch to dark mode by setting data-theme attribute directly
        await page.evaluate(() => {
            document.documentElement.setAttribute('data-theme', 'dark');
        });
        
        // Wait for our theme change handler to apply
        await page.waitForTimeout(500);
        
        console.log('\n🌙 Dark Mode Analysis:');
        const darkMode = await page.evaluate(() => {
            const card = document.querySelector('elvt-card[layer="elevated"]');
            const computedStyle = getComputedStyle(card);
            
            return {
                theme: document.documentElement.getAttribute('data-theme'),
                cardClasses: Array.from(card.classList),
                backgroundColor: computedStyle.backgroundColor,
                borderColor: computedStyle.borderColor,
                tokens: {
                    borderDefault: computedStyle.getPropertyValue('--elvt-alias-layout-border-default').trim(),
                    layerElevated: computedStyle.getPropertyValue('--elvt-alias-layout-layer-elevated').trim(),
                    fill: computedStyle.getPropertyValue('--fill').trim()
                }
            };
        });
        
        console.log('Dark Mode Results:', darkMode);
        
        // Compare the results
        console.log('\n🔍 COMPARISON:');
        const comparison = {
            themeChanged: lightMode.theme !== darkMode.theme,
            backgroundChanged: lightMode.backgroundColor !== darkMode.backgroundColor,
            borderChanged: lightMode.borderColor !== darkMode.borderColor,
            tokensChanged: {
                borderDefault: lightMode.tokens.borderDefault !== darkMode.tokens.borderDefault,
                layerElevated: lightMode.tokens.layerElevated !== darkMode.tokens.layerElevated,
                fill: lightMode.tokens.fill !== darkMode.tokens.fill
            }
        };
        
        console.log('Changes detected:', comparison);
        
        // Test multiple layer types in dark mode
        console.log('\n🎯 Testing All Layer Types in Dark Mode:');
        const allLayersTest = await page.evaluate(() => {
            const layers = ['default', 'elevated', 'overlay', 'sunken'];
            const results = [];
            
            layers.forEach(layer => {
                const card = document.querySelector(`elvt-card[layer="${layer}"]`) || 
                           document.querySelector('elvt-card:not([layer])'); // fallback to default
                
                if (card) {
                    const computedStyle = getComputedStyle(card);
                    results.push({
                        layer: layer,
                        actualLayer: card.getAttribute('layer') || 'default',
                        classes: Array.from(card.classList),
                        backgroundColor: computedStyle.backgroundColor,
                        borderColor: computedStyle.borderColor
                    });
                }
            });
            
            return results;
        });
        
        allLayersTest.forEach(result => {
            console.log(`${result.layer}: bg=${result.backgroundColor}, border=${result.borderColor}, classes=${result.classes.join(',')}`);
        });
        
        await page.screenshot({ path: 'dark-mode-test.png' });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

testDarkMode();