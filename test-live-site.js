const { chromium } = require('playwright');

async function testLiveSite() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🌐 Testing live site at localhost:3000...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 10000 });
        
        // Get detailed info about the cards
        const cardInfo = await page.evaluate(() => {
            const cards = document.querySelectorAll('elvt-card');
            const docTheme = document.documentElement.getAttribute('data-theme');
            
            // Get document-level tokens
            const style = getComputedStyle(document.documentElement);
            const tokens = {
                borderDefault: style.getPropertyValue('--elvt-alias-layout-border-default').trim(),
                borderProminent: style.getPropertyValue('--elvt-alias-layout-border-prominent').trim(),
                layerDefault: style.getPropertyValue('--elvt-alias-layout-layer-default').trim(),
                layerElevated: style.getPropertyValue('--elvt-alias-layout-layer-elevated').trim()
            };
            
            return {
                documentTheme: docTheme,
                cardCount: cards.length,
                tokens,
                cards: Array.from(cards).slice(0, 3).map((card, i) => {
                    const computedStyle = getComputedStyle(card);
                    return {
                        index: i,
                        layer: card.getAttribute('layer') || 'default',
                        classes: Array.from(card.classList),
                        backgroundColor: computedStyle.backgroundColor,
                        borderColor: computedStyle.borderColor,
                        borderWidth: computedStyle.borderWidth,
                        borderStyle: computedStyle.borderStyle,
                        customProps: {
                            borderColor: computedStyle.getPropertyValue('--border-color').trim(),
                            fill: computedStyle.getPropertyValue('--fill').trim()
                        }
                    };
                })
            };
        });
        
        console.log('📊 Live Site Analysis:');
        console.log(`Theme: ${cardInfo.documentTheme}`);
        console.log(`Cards found: ${cardInfo.cardCount}`);
        console.log('\n🎯 Document Tokens:');
        Object.entries(cardInfo.tokens).forEach(([key, value]) => {
            console.log(`  ${key}: ${value || 'NOT DEFINED'}`);
        });
        
        console.log('\n🎯 Card Details:');
        cardInfo.cards.forEach(card => {
            console.log(`  Card ${card.index} (${card.layer}):`);
            console.log(`    Classes: ${card.classes.join(', ')}`);
            console.log(`    Background: ${card.backgroundColor}`);
            console.log(`    Border: ${card.borderColor} ${card.borderWidth} ${card.borderStyle}`);
            console.log(`    CSS Props: --border-color=${card.customProps.borderColor}, --fill=${card.customProps.fill}`);
        });
        
        // Test theme switching
        console.log('\n🌙 Testing dark mode toggle...');
        await page.click('[data-theme="dark"]'); // Click dark mode toggle
        await page.waitForTimeout(1000);
        
        const darkModeInfo = await page.evaluate(() => {
            const style = getComputedStyle(document.documentElement);
            const docTheme = document.documentElement.getAttribute('data-theme');
            return {
                theme: docTheme,
                tokens: {
                    borderDefault: style.getPropertyValue('--elvt-alias-layout-border-default').trim(),
                    layerDefault: style.getPropertyValue('--elvt-alias-layout-layer-default').trim()
                }
            };
        });
        
        console.log(`\nAfter dark mode toggle:`);
        console.log(`Theme: ${darkModeInfo.theme}`);
        console.log(`Border default: ${darkModeInfo.tokens.borderDefault}`);
        console.log(`Layer default: ${darkModeInfo.tokens.layerDefault}`);
        
        await page.screenshot({ path: 'live-site-analysis.png', fullPage: true });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

testLiveSite();