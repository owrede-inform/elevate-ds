const { chromium } = require('playwright');

async function compareStorybookVsDocusaurus() {
    console.log('🔍 Comparing Storybook vs Docusaurus environments...');
    
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    
    try {
        // First, analyze Storybook
        console.log('\n📖 ANALYZING STORYBOOK...');
        const storybookPage = await context.newPage();
        
        try {
            // Try to access Storybook - adjust URL as needed
            await storybookPage.goto('https://elevate-core-ui.inform-cloud.io/?path=/story/components-card--default', { timeout: 10000 });
            await storybookPage.waitForSelector('elvt-card', { timeout: 5000 });
            
            const storybookAnalysis = await storybookPage.evaluate(() => {
                const card = document.querySelector('elvt-card');
                if (!card) return { error: 'No card found' };
                
                // Get document info
                const docInfo = {
                    title: document.title,
                    theme: document.documentElement.getAttribute('data-theme') || 'none',
                    bodyClasses: Array.from(document.body.classList),
                    htmlClasses: Array.from(document.documentElement.classList)
                };
                
                // Get stylesheets
                const stylesheets = Array.from(document.styleSheets).map(sheet => ({
                    href: sheet.href,
                    title: sheet.title,
                    media: sheet.media.mediaText
                })).filter(s => s.href);
                
                // Get card styles
                const cardStyle = getComputedStyle(card);
                const cardInfo = {
                    tagName: card.tagName,
                    classes: Array.from(card.classList),
                    layer: card.getAttribute('layer'),
                    backgroundColor: cardStyle.backgroundColor,
                    borderColor: cardStyle.borderColor,
                    borderWidth: cardStyle.borderWidth,
                    display: cardStyle.display,
                    position: cardStyle.position,
                    zIndex: cardStyle.zIndex
                };
                
                // Get CSS custom properties
                const customProps = {};
                for (let i = 0; i < cardStyle.length; i++) {
                    const prop = cardStyle.item(i);
                    if (prop.startsWith('--elvt-alias-layout-') || prop === '--fill' || prop === '--border-color') {
                        customProps[prop] = cardStyle.getPropertyValue(prop).trim();
                    }
                }
                
                // Check for CSS reset or normalization
                const bodyStyle = getComputedStyle(document.body);
                const resetInfo = {
                    boxSizing: cardStyle.boxSizing,
                    bodyBoxSizing: bodyStyle.boxSizing,
                    bodyBackground: bodyStyle.backgroundColor,
                    bodyFontFamily: bodyStyle.fontFamily
                };
                
                return {
                    docInfo,
                    stylesheets: stylesheets.slice(0, 10), // First 10 stylesheets
                    cardInfo,
                    customProps,
                    resetInfo
                };
            });
            
            console.log('📊 Storybook Analysis:');
            console.log('Document:', storybookAnalysis.docInfo);
            console.log('Card Info:', storybookAnalysis.cardInfo);
            console.log('Custom Props:', storybookAnalysis.customProps);
            console.log('Reset Info:', storybookAnalysis.resetInfo);
            console.log(`Stylesheets: ${storybookAnalysis.stylesheets.length} total`);
            storybookAnalysis.stylesheets.forEach(sheet => {
                console.log(`  ${sheet.href}`);
            });
            
        } catch (error) {
            console.log('⚠️  Could not access Storybook:', error.message);
        }
        
        // Now analyze Docusaurus
        console.log('\n📝 ANALYZING DOCUSAURUS...');
        const docusaurusPage = await context.newPage();
        await docusaurusPage.goto('http://localhost:3000/docs/components/card');
        await docusaurusPage.waitForSelector('elvt-card', { timeout: 5000 });
        
        const docusaurusAnalysis = await docusaurusPage.evaluate(() => {
            const card = document.querySelector('elvt-card');
            if (!card) return { error: 'No card found' };
            
            // Get document info
            const docInfo = {
                title: document.title,
                theme: document.documentElement.getAttribute('data-theme') || 'none',
                bodyClasses: Array.from(document.body.classList),
                htmlClasses: Array.from(document.documentElement.classList)
            };
            
            // Get stylesheets
            const stylesheets = Array.from(document.styleSheets).map(sheet => ({
                href: sheet.href,
                title: sheet.title,
                media: sheet.media.mediaText
            })).filter(s => s.href);
            
            // Get card styles
            const cardStyle = getComputedStyle(card);
            const cardInfo = {
                tagName: card.tagName,
                classes: Array.from(card.classList),
                layer: card.getAttribute('layer'),
                backgroundColor: cardStyle.backgroundColor,
                borderColor: cardStyle.borderColor,
                borderWidth: cardStyle.borderWidth,
                display: cardStyle.display,
                position: cardStyle.position,
                zIndex: cardStyle.zIndex
            };
            
            // Get CSS custom properties
            const customProps = {};
            for (let i = 0; i < cardStyle.length; i++) {
                const prop = cardStyle.item(i);
                if (prop.startsWith('--elvt-alias-layout-') || prop === '--fill' || prop === '--border-color') {
                    customProps[prop] = cardStyle.getPropertyValue(prop).trim();
                }
            }
            
            // Check for CSS reset or normalization
            const bodyStyle = getComputedStyle(document.body);
            const resetInfo = {
                boxSizing: cardStyle.boxSizing,
                bodyBoxSizing: bodyStyle.boxSizing,
                bodyBackground: bodyStyle.backgroundColor,
                bodyFontFamily: bodyStyle.fontFamily
            };
            
            // Check for potential interfering CSS
            const interferingCSS = {
                cardBackground: cardStyle.background,
                cardBackgroundImage: cardStyle.backgroundImage,
                cardBackgroundColor: cardStyle.backgroundColor,
                cardOpacity: cardStyle.opacity,
                cardFilter: cardStyle.filter,
                cardTransform: cardStyle.transform
            };
            
            return {
                docInfo,
                stylesheets: stylesheets.slice(0, 10),
                cardInfo,
                customProps,
                resetInfo,
                interferingCSS
            };
        });
        
        console.log('📊 Docusaurus Analysis:');
        console.log('Document:', docusaurusAnalysis.docInfo);
        console.log('Card Info:', docusaurusAnalysis.cardInfo);
        console.log('Custom Props:', docusaurusAnalysis.customProps);
        console.log('Reset Info:', docusaurusAnalysis.resetInfo);
        console.log('Interfering CSS:', docusaurusAnalysis.interferingCSS);
        console.log(`Stylesheets: ${docusaurusAnalysis.stylesheets.length} total`);
        docusaurusAnalysis.stylesheets.forEach(sheet => {
            console.log(`  ${sheet.href}`);
        });
        
        // Compare the results
        console.log('\n🔍 COMPARISON ANALYSIS:');
        
        // Look for differences in stylesheets
        const storybookHrefs = new Set((storybookAnalysis?.stylesheets || []).map(s => s.href));
        const docusaurusHrefs = new Set(docusaurusAnalysis.stylesheets.map(s => s.href));
        
        console.log('\nStylesheets in Docusaurus but not Storybook:');
        docusaurusHrefs.forEach(href => {
            if (!storybookHrefs.has(href)) {
                console.log(`  - ${href}`);
            }
        });
        
        // Test CSS isolation in Docusaurus
        console.log('\n🧪 Testing CSS isolation fixes...');
        const isolationTest = await docusaurusPage.evaluate(() => {
            const card = document.querySelector('elvt-card');
            if (!card) return 'No card';
            
            const tests = {};
            
            // Test 1: Remove all external stylesheets temporarily
            const stylesheets = Array.from(document.styleSheets);
            const disabledSheets = [];
            
            stylesheets.forEach(sheet => {
                if (sheet.href && sheet.href.includes('docusaurus')) {
                    sheet.disabled = true;
                    disabledSheets.push(sheet);
                }
            });
            
            tests.afterDisablingDocusaurus = getComputedStyle(card).backgroundColor;
            
            // Re-enable sheets
            disabledSheets.forEach(sheet => sheet.disabled = false);
            
            // Test 2: Force CSS custom property re-evaluation
            card.style.setProperty('--fill', 'rgb(255, 0, 0)'); // Force red
            tests.forcedRed = getComputedStyle(card).backgroundColor;
            
            card.style.setProperty('--fill', 'rgb(243, 244, 247)'); // Reset to expected
            tests.resetToExpected = getComputedStyle(card).backgroundColor;
            
            // Test 3: Try different CSS isolation approaches
            card.style.isolation = 'isolate';
            tests.withIsolation = getComputedStyle(card).backgroundColor;
            
            card.style.isolation = '';
            card.style.contain = 'style';
            tests.withContainment = getComputedStyle(card).backgroundColor;
            
            return tests;
        });
        
        console.log('CSS Isolation Test Results:', isolationTest);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await browser.close();
    }
}

compareStorybookVsDocusaurus();