# PowerShell Script to Extract ELEVATE Component Information from ZIP Download
# Works with downloaded ZIP files (no Git history required)

param(
    [string]$RepoPath = "",
    [string]$OutputDir = "sample-data\component-changelogs"
)

Write-Host "🔍 ELEVATE Component Information Extractor (ZIP Mode)" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan

# Determine repository path
if ($RepoPath -eq "") {
    $RepoPath = Read-Host "Enter the path to the elevate-core-ui directory"
}

# Handle nested directory structure (elevate-core-ui-main/elevate-core-ui-main/)
if (Test-Path "$RepoPath\elevate-core-ui-main") {
    $RepoPath = "$RepoPath\elevate-core-ui-main"
    Write-Host "📁 Using nested directory: $RepoPath" -ForegroundColor Yellow
}

# Validate repository path
if (-not (Test-Path $RepoPath)) {
    Write-Error "Repository path does not exist: $RepoPath"
    exit 1
}

if (-not (Test-Path "$RepoPath\src\components")) {
    Write-Error "Components directory not found: $RepoPath\src\components"
    exit 1
}

Write-Host "📂 Working with repository: $RepoPath" -ForegroundColor Green

# Create output directory in the elevate-ds project
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$FullOutputDir = Join-Path $ScriptDir $OutputDir

if (-not (Test-Path $FullOutputDir)) {
    New-Item -ItemType Directory -Path $FullOutputDir -Force | Out-Null
    Write-Host "📁 Created output directory: $FullOutputDir" -ForegroundColor Green
}

try {
    # Extract repository metadata
    $MetadataFile = Join-Path $FullOutputDir "repository-metadata.json"
    $PackageJson = "$RepoPath\package.json"
    $Version = "unknown"
    
    if (Test-Path $PackageJson) {
        $Package = Get-Content $PackageJson -Raw | ConvertFrom-Json
        $Version = $Package.version
    }
    
    $Metadata = @{
        source = "ZIP download"
        version = $Version
        extractedAt = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
        script = "extract-component-changelogs-zip.ps1"
        repoPath = $RepoPath
    }
    $Metadata | ConvertTo-Json -Depth 3 | Out-File -FilePath $MetadataFile -Encoding UTF8
    Write-Host "💾 Saved metadata: $MetadataFile" -ForegroundColor Green

    # Read global CHANGELOG.md if it exists
    $ChangelogPath = "$RepoPath\CHANGELOG.md"
    $GlobalChangelog = ""
    if (Test-Path $ChangelogPath) {
        Write-Host "📜 Found global CHANGELOG.md" -ForegroundColor Cyan
        $GlobalChangelog = Get-Content $ChangelogPath -Raw -Encoding UTF8
        $ChangelogFile = Join-Path $FullOutputDir "global-changelog.md"
        $GlobalChangelog | Out-File -FilePath $ChangelogFile -Encoding UTF8
        Write-Host "   💾 Copied global changelog" -ForegroundColor Green
    }

    # Discover all components
    Write-Host "🔍 Discovering components..." -ForegroundColor Cyan
    $ComponentsPath = "$RepoPath\src\components"
    $ComponentDirs = Get-ChildItem $ComponentsPath -Directory | Where-Object { 
        $_.Name -notmatch "^_" -and 
        $_.Name -ne "distance" -and 
        $_.Name -ne "fields" -and
        (Test-Path "$($_.FullName)\*.component.ts")
    }

    # Also check nested components (like buttons/button, radios/radio, etc.)
    $NestedComponentDirs = Get-ChildItem $ComponentsPath -Directory | ForEach-Object {
        Get-ChildItem $_.FullName -Directory | Where-Object {
            Test-Path "$($_.FullName)\*.component.ts"
        }
    }

    $AllComponentDirs = $ComponentDirs + $NestedComponentDirs
    $Components = $AllComponentDirs | Sort-Object Name

    Write-Host "   Found $($Components.Count) components" -ForegroundColor Gray

    # Save components list
    $ComponentsFile = Join-Path $FullOutputDir "components-list.txt"
    $ComponentsList = @()
    $ComponentsList += "ELEVATE CORE UI COMPONENTS"
    $ComponentsList += "=========================="
    $ComponentsList += "Extracted from: $RepoPath"
    $ComponentsList += "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    $ComponentsList += ""
    
    foreach ($Component in $Components) {
        $RelativePath = $Component.FullName.Replace($ComponentsPath, "").TrimStart('\')
        $ComponentName = $Component.Name
        $ComponentTag = "elvt-$($ComponentName.Replace('-', '-'))"
        
        # Count files
        $FileCount = (Get-ChildItem $Component.FullName -Recurse -File).Count
        
        $ComponentsList += "Component: $ComponentName"
        $ComponentsList += "  Tag: $ComponentTag"
        $ComponentsList += "  Path: src/components/$RelativePath"
        $ComponentsList += "  Files: $FileCount"
        $ComponentsList += ""
    }
    
    $ComponentsList | Out-File -FilePath $ComponentsFile -Encoding UTF8
    Write-Host "💾 Saved components list: $ComponentsFile" -ForegroundColor Green

    # Process each component
    Write-Host "📜 Processing components..." -ForegroundColor Cyan
    
    foreach ($Component in $Components) {
        $ComponentName = $Component.Name
        Write-Host "   Processing: $ComponentName" -ForegroundColor Yellow
        
        $ComponentFile = Join-Path $FullOutputDir "$ComponentName-info.txt"
        $RelativePath = $Component.FullName.Replace($ComponentsPath, "").TrimStart('\')
        
        # Analyze component files
        $ComponentFiles = Get-ChildItem $Component.FullName -Recurse -File
        $TypeScriptFiles = $ComponentFiles | Where-Object { $_.Extension -eq '.ts' }
        $StyleFiles = $ComponentFiles | Where-Object { $_.Extension -eq '.scss' }
        $StoryFiles = $ComponentFiles | Where-Object { $_.Name -like '*.stories.ts' }
        $TestFiles = $ComponentFiles | Where-Object { $_.Name -like '*.test.*' }
        
        # Try to find component.ts file for analysis
        $ComponentTsFile = $ComponentFiles | Where-Object { $_.Name -eq "$ComponentName.component.ts" } | Select-Object -First 1
        $ComponentCode = ""
        $ComponentProps = @()
        
        if ($ComponentTsFile) {
            $ComponentCode = Get-Content $ComponentTsFile.FullName -Raw -Encoding UTF8
            
            # Extract properties from TypeScript (basic parsing)
            $PropMatches = [regex]::Matches($ComponentCode, '@property\(\{[^}]*\}\)\s*(\w+)[\?\!]?\s*:\s*([^;]+);')
            foreach ($Match in $PropMatches) {
                $PropName = $Match.Groups[1].Value
                $PropType = $Match.Groups[2].Value.Trim()
                $ComponentProps += "${PropName}: ${PropType}"
            }
        }
        
        # Extract changelog entries for this component from global changelog
        $ComponentChangelogEntries = @()
        if ($GlobalChangelog) {
            $Lines = $GlobalChangelog -split "`n"
            $InComponentSection = $false
            
            foreach ($Line in $Lines) {
                if ($Line -match "(?i)$ComponentName" -or $Line -match "(?i)elvt-$ComponentName") {
                    $ComponentChangelogEntries += $Line.Trim()
                }
            }
        }
        
        # Build component information
        $Output = @()
        $Output += "=== COMPONENT: $ComponentName ==="
        $Output += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        $Output += "Tag: elvt-$ComponentName"
        $Output += "Path: src/components/$RelativePath"
        $Output += ""
        
        $Output += "=== FILE STRUCTURE ==="
        $Output += "Total files: $($ComponentFiles.Count)"
        $Output += "TypeScript files: $($TypeScriptFiles.Count)"
        $Output += "Style files: $($StyleFiles.Count)"
        $Output += "Story files: $($StoryFiles.Count)"
        $Output += "Test files: $($TestFiles.Count)"
        $Output += ""
        
        $Output += "Files:"
        foreach ($File in $ComponentFiles) {
            $RelativeFilePath = $File.FullName.Replace($Component.FullName, "").TrimStart('\')
            $Output += "  - $RelativeFilePath"
        }
        $Output += ""
        
        if ($ComponentProps.Count -gt 0) {
            $Output += "=== COMPONENT PROPERTIES ==="
            foreach ($Prop in $ComponentProps) {
                $Output += "  - $Prop"
            }
            $Output += ""
        }
        
        if ($ComponentChangelogEntries.Count -gt 0) {
            $Output += "=== CHANGELOG ENTRIES ==="
            foreach ($Entry in $ComponentChangelogEntries) {
                $Output += "  $Entry"
            }
            $Output += ""
        } else {
            $Output += "=== CHANGELOG ENTRIES ==="
            $Output += "  No specific changelog entries found for this component"
            $Output += ""
        }
        
        $Output += "=== STORIES ANALYSIS ==="
        if ($StoryFiles.Count -gt 0) {
            foreach ($StoryFile in $StoryFiles) {
                $StoryContent = Get-Content $StoryFile.FullName -Raw -Encoding UTF8
                $Output += "Story file: $($StoryFile.Name)"
                
                # Extract story names
                $StoryMatches = [regex]::Matches($StoryContent, 'export const (\w+)')
                foreach ($Match in $StoryMatches) {
                    $Output += "  - Story: $($Match.Groups[1].Value)"
                }
                $Output += ""
            }
        } else {
            $Output += "No story files found"
            $Output += ""
        }
        
        $Output += "=== END OF $ComponentName INFO ==="
        
        # Save component info
        $Output | Out-File -FilePath $ComponentFile -Encoding UTF8
        Write-Host "     💾 Saved: $ComponentFile" -ForegroundColor Green
    }
    
    # Create summary
    Write-Host "📊 Creating summary..." -ForegroundColor Cyan
    $SummaryFile = Join-Path $FullOutputDir "extraction-summary.txt"
    $Summary = @()
    $Summary += "ELEVATE COMPONENT INFORMATION EXTRACTION SUMMARY"
    $Summary += "==============================================="
    $Summary += "Extracted: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    $Summary += "Source: ZIP Download"
    $Summary += "Repository Path: $RepoPath"
    $Summary += "Version: $Version"
    $Summary += ""
    $Summary += "Components processed: $($Components.Count)"
    $Summary += "Global changelog found: $(if (Test-Path $ChangelogPath) { 'Yes' } else { 'No' })"
    $Summary += "Output directory: $FullOutputDir"
    $Summary += ""
    $Summary += "Generated files:"
    Get-ChildItem $FullOutputDir -Name | ForEach-Object { $Summary += "  - $_" }
    
    $Summary | Out-File -FilePath $SummaryFile -Encoding UTF8
    
    Write-Host "✅ Extraction completed successfully!" -ForegroundColor Green
    Write-Host "📁 Output directory: $FullOutputDir" -ForegroundColor Green
    Write-Host "📄 Summary: $SummaryFile" -ForegroundColor Green
    Write-Host "" 
    Write-Host "Components found:" -ForegroundColor Cyan
    $Components | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Review the generated files in: $FullOutputDir" -ForegroundColor Gray
    Write-Host "2. I'll process these files to update the component info documentation" -ForegroundColor Gray

} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
}