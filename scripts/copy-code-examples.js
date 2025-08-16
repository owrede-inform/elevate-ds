const fs = require('fs');
const path = require('path');

function copyCodeExamples() {
  const docsDir = path.join(__dirname, '..', 'docs');
  const staticDir = path.join(__dirname, '..', 'static');
  
  // Find all code-examples folders
  function findCodeExamplesFolders(dir, basePath = '') {
    const items = fs.readdirSync(dir);
    let folders = [];
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relativePath = path.join(basePath, item);
      
      if (fs.statSync(fullPath).isDirectory()) {
        if (item === 'code-examples') {
          folders.push({ fullPath, relativePath: basePath });
        } else {
          folders.push(...findCodeExamplesFolders(fullPath, relativePath));
        }
      }
    }
    
    return folders;
  }
  
  // Copy function
  function copyRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const items = fs.readdirSync(src);
    
    for (const item of items) {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      
      if (fs.statSync(srcPath).isDirectory()) {
        copyRecursive(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied: ${srcPath} -> ${destPath}`);
      }
    }
  }
  
  // Find and copy all code-examples folders
  const codeExamplesFolders = findCodeExamplesFolders(docsDir);
  
  console.log('Found code-examples folders:', codeExamplesFolders);
  
  for (const folder of codeExamplesFolders) {
    const componentName = path.basename(folder.relativePath);
    console.log(`Component: ${componentName}, Full path: ${folder.fullPath}, Relative: ${folder.relativePath}`);
    
    // The fullPath should already point to the code-examples directory
    const srcPath = folder.fullPath;
    const destPath = path.join(staticDir, 'code-examples', componentName);
    
    // Check if source path exists before copying
    if (fs.existsSync(srcPath)) {
      console.log(`Processing: ${componentName} from ${srcPath} to ${destPath}`);
      copyRecursive(srcPath, destPath);
    } else {
      console.log(`Skipping ${componentName}: code-examples folder not found at ${srcPath}`);
    }
  }
  
  console.log('Code examples copied to static folder!');
}

copyCodeExamples();