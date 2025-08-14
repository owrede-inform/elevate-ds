# PowerShell Script to Extract ELEVATE Component Changelogs
# Run this script in the elevate-core-ui repository root directory

param(
    [string]$RepoPath = "",
    [string]$OutputDir = "sample-data\component-changelogs",
    [int]$MaxCommits = 50
)

Write-Host "🔍 ELEVATE Component Changelog Extractor" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Determine repository path
if ($RepoPath -eq "") {
    $RepoPath = Read-Host "Enter the path to the elevate-core-ui repository"
}

# Validate repository path
if (-not (Test-Path $RepoPath)) {
    Write-Error "Repository path does not exist: $RepoPath"
    exit 1
}

if (-not (Test-Path "$RepoPath\.git")) {
    Write-Error "Not a Git repository: $RepoPath"
    exit 1
}

# Change to repository directory
Push-Location $RepoPath

try {
    Write-Host "📂 Working in repository: $RepoPath" -ForegroundColor Green
    
    # Create output directory in the elevate-ds project
    $ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $FullOutputDir = Join-Path $ScriptDir $OutputDir
    
    if (-not (Test-Path $FullOutputDir)) {
        New-Item -ItemType Directory -Path $FullOutputDir -Force | Out-Null
        Write-Host "📁 Created output directory: $FullOutputDir" -ForegroundColor Green
    }
    
    # Get repository info
    $RepoUrl = git remote get-url origin 2>$null
    $CurrentBranch = git branch --show-current 2>$null
    $CurrentCommit = git rev-parse HEAD 2>$null
    
    Write-Host "🌐 Repository: $RepoUrl" -ForegroundColor Yellow
    Write-Host "🌿 Branch: $CurrentBranch" -ForegroundColor Yellow
    Write-Host "📝 Commit: $($CurrentCommit.Substring(0,8))" -ForegroundColor Yellow
    
    # Extract repository metadata
    $MetadataFile = Join-Path $FullOutputDir "repository-metadata.json"
    $Metadata = @{
        repository = $RepoUrl
        branch = $CurrentBranch
        commit = $CurrentCommit
        extractedAt = Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ"
        script = "extract-component-changelogs.ps1"
    }
    $Metadata | ConvertTo-Json -Depth 3 | Out-File -FilePath $MetadataFile -Encoding UTF8
    Write-Host "💾 Saved metadata: $MetadataFile" -ForegroundColor Green
    
    # Get all tags
    Write-Host "🏷️  Extracting tags..." -ForegroundColor Cyan
    $TagsFile = Join-Path $FullOutputDir "all-tags.txt"
    git tag -l --sort=-version:refname --format='%(refname:short)|%(creatordate:short)|%(subject)' | Out-File -FilePath $TagsFile -Encoding UTF8
    $TagCount = (Get-Content $TagsFile | Measure-Object).Count
    Write-Host "   Found $TagCount tags" -ForegroundColor Gray
    
    # Find all components
    Write-Host "🔍 Discovering components..." -ForegroundColor Cyan
    $ComponentsRaw = git ls-files src/components/ 2>$null | ForEach-Object { ($_ -split '/')[2] } | Sort-Object | Get-Unique
    $Components = $ComponentsRaw | Where-Object { $_ -ne "" -and $_ -ne $null }
    
    if ($Components.Count -eq 0) {
        Write-Warning "No components found in src/components/. Trying alternative paths..."
        # Try alternative component paths
        $ComponentsRaw = git ls-files | Where-Object { $_ -match "components?" } | ForEach-Object { ($_ -split '/')[1] } | Sort-Object | Get-Unique
        $Components = $ComponentsRaw | Where-Object { $_ -ne "" -and $_ -ne $null }
    }
    
    Write-Host "   Found $($Components.Count) components: $($Components -join ', ')" -ForegroundColor Gray
    
    # Save components list
    $ComponentsFile = Join-Path $FullOutputDir "components-list.txt"
    $Components | Out-File -FilePath $ComponentsFile -Encoding UTF8
    
    # Extract changelog for each component
    Write-Host "📜 Extracting component changelogs..." -ForegroundColor Cyan
    
    foreach ($Component in $Components) {
        Write-Host "   Processing: $Component" -ForegroundColor Yellow
        
        $ComponentFile = Join-Path $FullOutputDir "$Component-changelog.txt"
        
        # Build the git log command for this component
        $ComponentPath = "src/components/$Component/"
        
        # Check if path exists
        $PathExists = git ls-files $ComponentPath 2>$null
        if (-not $PathExists) {
            Write-Host "     ⚠️  No files found for $ComponentPath, skipping..." -ForegroundColor Red
            continue
        }
        
        # Create component changelog
        $Output = @()
        $Output += "=== COMPONENT: $Component ==="
        $Output += "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        $Output += "Path: $ComponentPath"
        $Output += ""
        
        # File count
        $FileCount = (git ls-files $ComponentPath | Measure-Object).Count
        $Output += "File count: $FileCount"
        
        # First and latest commits
        $FirstCommit = git log --reverse --pretty=format:"%ad|%h|%s" --date=short -- $ComponentPath 2>$null | Select-Object -First 1
        $LatestCommit = git log --pretty=format:"%ad|%h|%s" --date=short -- $ComponentPath 2>$null | Select-Object -First 1
        
        if ($FirstCommit) { $Output += "First commit: $FirstCommit" }
        if ($LatestCommit) { $Output += "Latest commit: $LatestCommit" }
        $Output += ""
        
        # Recent changes
        $Output += "=== RECENT CHANGES (Last $MaxCommits) ==="
        $RecentChanges = git log --pretty=format:"%h|%ad|%an|%s" --date=short -- $ComponentPath 2>$null | Select-Object -First $MaxCommits
        if ($RecentChanges) {
            $RecentChanges | ForEach-Object { $Output += $_ }
        } else {
            $Output += "No commits found"
        }
        $Output += ""
        
        # Breaking/API changes
        $Output += "=== BREAKING/API CHANGES ==="
        $BreakingChanges = git log --grep="BREAKING" --grep="breaking" --grep="Breaking" --grep="API" --grep="interface" --grep="prop" --grep="deprecated" --pretty=format:"%h|%ad|%an|%s" --date=short -- $ComponentPath 2>$null | Select-Object -First 20
        if ($BreakingChanges) {
            $BreakingChanges | ForEach-Object { $Output += $_ }
        } else {
            $Output += "No breaking/API changes found"
        }
        $Output += ""
        
        # Version-specific changes (last 3 versions)
        $Output += "=== VERSION-SPECIFIC CHANGES ==="
        $Tags = git tag -l --sort=-version:refname 2>$null | Select-Object -First 4
        if ($Tags.Count -gt 1) {
            for ($i = 0; $i -lt ($Tags.Count - 1); $i++) {
                $NewTag = $Tags[$i]
                $OldTag = $Tags[$i + 1]
                $Output += "--- Changes in $NewTag (from $OldTag) ---"
                $VersionChanges = git log "$OldTag..$NewTag" --pretty=format:"%h|%ad|%an|%s" --date=short -- $ComponentPath 2>$null
                if ($VersionChanges) {
                    $VersionChanges | ForEach-Object { $Output += $_ }
                } else {
                    $Output += "No changes in this version"
                }
                $Output += ""
            }
        } else {
            $Output += "Insufficient version tags for comparison"
        }
        
        $Output += "=== END OF $Component CHANGELOG ==="
        
        # Save component changelog
        $Output | Out-File -FilePath $ComponentFile -Encoding UTF8
        Write-Host "     💾 Saved: $ComponentFile" -ForegroundColor Green
    }
    
    # Create summary file
    Write-Host "📊 Creating summary..." -ForegroundColor Cyan
    $SummaryFile = Join-Path $FullOutputDir "extraction-summary.txt"
    $Summary = @()
    $Summary += "ELEVATE COMPONENT CHANGELOG EXTRACTION SUMMARY"
    $Summary += "=============================================="
    $Summary += "Extracted: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
    $Summary += "Repository: $RepoUrl"
    $Summary += "Branch: $CurrentBranch"
    $Summary += "Commit: $CurrentCommit"
    $Summary += ""
    $Summary += "Components processed: $($Components.Count)"
    $Summary += "Tags found: $TagCount"
    $Summary += "Output directory: $FullOutputDir"
    $Summary += ""
    $Summary += "Generated files:"
    Get-ChildItem $FullOutputDir -Name | ForEach-Object { $Summary += "  - $_" }
    
    $Summary | Out-File -FilePath $SummaryFile -Encoding UTF8
    
    Write-Host "✅ Extraction completed successfully!" -ForegroundColor Green
    Write-Host "📁 Output directory: $FullOutputDir" -ForegroundColor Green
    Write-Host "📄 Summary: $SummaryFile" -ForegroundColor Green
    Write-Host "" 
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Review the generated files in: $FullOutputDir" -ForegroundColor Gray
    Write-Host "2. I'll process these files to update the component info documentation" -ForegroundColor Gray
    
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
} finally {
    Pop-Location
}