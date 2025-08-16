const { chromium } = require('playwright');

async function testCleanSolution() {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        console.log('🧪 Testing Clean ELEVATE Token Solution...');
        await page.goto('http://localhost:3000/docs/components/card');
        await page.waitForSelector('elvt-card', { timeout: 5000 });
        
        // Test light mode first
        console.log('\n☀️ LIGHT MODE TEST:');
        const lightMode = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('elvt-card')).slice(0, 4);
            return cards.map(card => {
                const layer = card.getAttribute('layer') || 'default';
                const computedStyle = getComputedStyle(card);
                const classes = Array.from(card.classList);
                
                return {
                    layer,
                    classes,
                    backgroundColor: computedStyle.backgroundColor,
                    borderColor: computedStyle.borderColor,
                    hasManualOverrides: card.style.backgroundColor !== '', // Check if manual styles are applied
                    shadowDOMWorks: !!card.shadowRoot,
                    tokens: {
                        layerToken: computedStyle.getPropertyValue(`--elvt-alias-layout-layer-${layer === 'default' ? 'default' : layer}`).trim(),
                        borderToken: computedStyle.getPropertyValue('--elvt-alias-layout-border-default').trim(),
                        fillToken: computedStyle.getPropertyValue('--fill').trim()
                    }
                };
            });
        });
        
        lightMode.forEach((card, i) => {
            console.log(`Card ${i} (${card.layer}):`);
            console.log(`  Background: ${card.backgroundColor}`);
            console.log(`  Border: ${card.borderColor}`);
            console.log(`  Manual Overrides: ${card.hasManualOverrides ? '❌ DETECTED' : '✅ NONE'}`);
            console.log(`  Shadow DOM: ${card.shadowDOMWorks ? '✅' : '❌'}`);
            console.log(`  Classes: ${card.classes.join(', ')}`);
            console.log(`  Tokens: layer=${card.tokens.layerToken}, border=${card.tokens.borderToken}, fill=${card.tokens.fillToken}`);
        });
        
        // Switch to dark mode
        console.log('\n🌙 SWITCHING TO DARK MODE...');
        await page.evaluate(() => {
            document.documentElement.setAttribute('data-theme', 'dark');
        });
        await page.waitForTimeout(1000); // Wait for theme change to apply
        
        const darkMode = await page.evaluate(() => {
            const cards = Array.from(document.querySelectorAll('elvt-card')).slice(0, 4);
            return cards.map(card => {
                const layer = card.getAttribute('layer') || 'default';
                const computedStyle = getComputedStyle(card);
                const classes = Array.from(card.classList);
                
                return {
                    layer,
                    classes,
                    backgroundColor: computedStyle.backgroundColor,
                    borderColor: computedStyle.borderColor,
                    hasManualOverrides: card.style.backgroundColor !== '',
                    shadowDOMWorks: !!card.shadowRoot,
                    tokens: {
                        layerToken: computedStyle.getPropertyValue(`--elvt-alias-layout-layer-${layer === 'default' ? 'default' : layer}`).trim(),
                        borderToken: computedStyle.getPropertyValue('--elvt-alias-layout-border-default').trim(),
                        fillToken: computedStyle.getPropertyValue('--fill').trim()
                    }
                };
            });
        });
        
        console.log('\n🌙 DARK MODE TEST:');
        darkMode.forEach((card, i) => {
            console.log(`Card ${i} (${card.layer}):`);
            console.log(`  Background: ${card.backgroundColor}`);
            console.log(`  Border: ${card.borderColor}`);
            console.log(`  Manual Overrides: ${card.hasManualOverrides ? '❌ DETECTED' : '✅ NONE'}`);
            console.log(`  Shadow DOM: ${card.shadowDOMWorks ? '✅' : '❌'}`);
            console.log(`  Classes: ${card.classes.join(', ')}`);
            console.log(`  Tokens: layer=${card.tokens.layerToken}, border=${card.tokens.borderToken}, fill=${card.tokens.fillToken}`);
        });
        
        // Compare light vs dark
        console.log('\n🔍 THEME COMPARISON:');
        const comparison = lightMode.map((light, i) => {
            const dark = darkMode[i];
            return {
                layer: light.layer,
                backgroundChanged: light.backgroundColor !== dark.backgroundColor,
                borderChanged: light.borderColor !== dark.borderColor,
                cleanImplementation: !light.hasManualOverrides && !dark.hasManualOverrides,
                themeClassesWork: dark.classes.includes('elvt-theme-dark')
            };
        });
        
        comparison.forEach((comp, i) => {
            const status = comp.cleanImplementation && comp.backgroundChanged && comp.borderChanged && comp.themeClassesWork ? '✅' : '❌';
            console.log(`${status} Card ${i} (${comp.layer}): bg changed=${comp.backgroundChanged}, border changed=${comp.borderChanged}, clean=${comp.cleanImplementation}, theme classes=${comp.themeClassesWork}`);
        });
        
        // Overall assessment
        const allClean = comparison.every(c => c.cleanImplementation);
        const allThemesWork = comparison.every(c => c.backgroundChanged && c.borderChanged);
        const allThemeClasses = comparison.every(c => c.themeClassesWork);
        
        console.log('\n🎯 OVERALL ASSESSMENT:');
        console.log(`Clean Implementation (no manual overrides): ${allClean ? '✅ SUCCESS' : '❌ FAILED'}`);
        console.log(`Theme Switching Works: ${allThemesWork ? '✅ SUCCESS' : '❌ FAILED'}`);
        console.log(`Theme Classes Applied: ${allThemeClasses ? '✅ SUCCESS' : '❌ FAILED'}`);
        
        const overallSuccess = allClean && allThemesWork && allThemeClasses;
        console.log(`\n🏆 SOLUTION STATUS: ${overallSuccess ? '✅ CLEAN SOLUTION WORKING' : '❌ NEEDS INVESTIGATION'}`);
        
        await page.screenshot({ path: 'clean-solution-test.png' });
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

testCleanSolution();