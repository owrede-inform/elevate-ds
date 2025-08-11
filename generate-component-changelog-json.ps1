# PowerShell Script to Generate Component Changelog JSON Files
# This script should be run by the ELEVATE Core UI developers to generate structured changelog data

param(
    [string]$ElevateCoreUIPath = "",
    [string]$ElevateDocsPath = "",
    [string]$OutputFormat = "json", # json or all
    [int]$MaxVersionsPerComponent = 10,
    [switch]$UpdateExisting = $false
)

Write-Host "🚀 ELEVATE Component Changelog JSON Generator" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Validate paths
if ($ElevateCoreUIPath -eq "") {
    $ElevateCoreUIPath = Read-Host "Enter the path to elevate-core-ui repository"
}

if ($ElevateDocsPath -eq "") {
    $ElevateDocsPath = Read-Host "Enter the path to elevate-ds docs directory"
}

if (-not (Test-Path $ElevateCoreUIPath)) {
    Write-Error "ELEVATE Core UI path does not exist: $ElevateCoreUIPath"
    exit 1
}

if (-not (Test-Path "$ElevateCoreUIPath\.git")) {
    Write-Error "Not a Git repository: $ElevateCoreUIPath"
    exit 1
}

if (-not (Test-Path $ElevateDocsPath)) {
    Write-Error "ELEVATE Docs path does not exist: $ElevateDocsPath"
    exit 1
}

# Change to repository directory
Push-Location $ElevateCoreUIPath

try {
    Write-Host "📂 Working in repository: $ElevateCoreUIPath" -ForegroundColor Green
    Write-Host "📄 Output directory: $ElevateDocsPath" -ForegroundColor Green
    
    # Get repository info
    $RepoUrl = git remote get-url origin 2>$null
    $CurrentBranch = git branch --show-current 2>$null
    $CurrentCommit = git rev-parse HEAD 2>$null
    $CurrentVersion = ""
    
    # Try to get version from package.json
    if (Test-Path "package.json") {
        $PackageContent = Get-Content "package.json" -Raw | ConvertFrom-Json
        $CurrentVersion = $PackageContent.version
    }
    
    Write-Host "🌐 Repository: $RepoUrl" -ForegroundColor Yellow
    Write-Host "🌿 Branch: $CurrentBranch" -ForegroundColor Yellow
    Write-Host "📦 Version: $CurrentVersion" -ForegroundColor Yellow
    
    # Get all tags sorted by version
    Write-Host "🏷️ Analyzing version tags..." -ForegroundColor Cyan
    $AllTags = git tag -l --sort=-version:refname 2>$null
    $TagsWithDates = @()
    
    foreach ($Tag in $AllTags) {
        $TagDate = git log -1 --format="%ai" $Tag 2>$null
        if ($TagDate) {
            $ParsedDate = [DateTime]::Parse($TagDate).ToString("yyyy-MM-dd")
            $TagsWithDates += @{
                Tag = $Tag
                Date = $ParsedDate
                RawDate = $TagDate
            }
        }
    }
    
    Write-Host "   Found $($TagsWithDates.Count) version tags" -ForegroundColor Gray
    
    # Discover components
    Write-Host "🔍 Discovering components..." -ForegroundColor Cyan
    $ComponentDirs = Get-ChildItem "src/components" -Directory | Where-Object { 
        $_.Name -notmatch "^_" -and 
        $_.Name -ne "distance" -and 
        $_.Name -ne "fields" -and
        (Test-Path "$($_.FullName)\*.component.ts")
    }

    # Also check nested components
    $NestedComponentDirs = Get-ChildItem "src/components" -Directory | ForEach-Object {
        Get-ChildItem $_.FullName -Directory | Where-Object {
            Test-Path "$($_.FullName)\*.component.ts"
        }
    }

    $AllComponents = $ComponentDirs + $NestedComponentDirs | Sort-Object Name
    Write-Host "   Found $($AllComponents.Count) components to process" -ForegroundColor Gray
    
    # Process each component
    foreach ($Component in $AllComponents) {
        $ComponentName = $Component.Name
        $ComponentTag = "elvt-$ComponentName"
        
        Write-Host "   📜 Processing: $ComponentTag" -ForegroundColor Yellow
        
        # Determine output path - use static directory for Docusaurus
        $StaticChangelogDir = Join-Path $ElevateDocsPath "static\component-changelogs"
        if (-not (Test-Path $StaticChangelogDir)) {
            New-Item -ItemType Directory -Path $StaticChangelogDir -Force | Out-Null
            Write-Host "     📁 Created directory: $StaticChangelogDir" -ForegroundColor Green
        }
        
        $JsonOutputPath = Join-Path $StaticChangelogDir "$ComponentTag-changes.json"
        
        # Skip if exists and not updating
        if ((Test-Path $JsonOutputPath) -and -not $UpdateExisting) {
            Write-Host "     ⏩ Skipping (file exists, use -UpdateExisting to overwrite)" -ForegroundColor Gray
            continue
        }
        
        # Get component path
        $ComponentPath = $Component.FullName.Replace($PWD, "").TrimStart('\').Replace('\', '/')
        
        # Analyze component files
        $ComponentFiles = Get-ChildItem $Component.FullName -Recurse -File
        $StoryFiles = $ComponentFiles | Where-Object { $_.Name -like '*.stories.ts' }
        $TestFiles = $ComponentFiles | Where-Object { $_.Name -like '*.test.*' }
        
        # Build version history
        $VersionHistory = @()
        $ProcessedVersions = 0
        
        for ($i = 0; $i -lt ($TagsWithDates.Count - 1) -and $ProcessedVersions -lt $MaxVersionsPerComponent; $i++) {
            $NewTag = $TagsWithDates[$i].Tag
            $OldTag = $TagsWithDates[$i + 1].Tag
            $VersionDate = $TagsWithDates[$i].Date
            
            # Get changes for this version
            $VersionChanges = git log "$OldTag..$NewTag" --pretty=format:"%H|%s|%b" --grep="$ComponentName" --grep="$ComponentTag" -- $ComponentPath 2>$null
            
            if ($VersionChanges) {
                $Changes = @()
                
                foreach ($ChangeEntry in $VersionChanges) {
                    if ([string]::IsNullOrWhiteSpace($ChangeEntry)) { continue }
                    
                    $Parts = $ChangeEntry -split '\|'
                    if ($Parts.Length -lt 2) { continue }
                    
                    $CommitHash = $Parts[0]
                    $CommitMessage = $Parts[1]
                    $CommitBody = if ($Parts.Length -gt 2) { $Parts[2] } else { "" }
                    
                    # Parse commit message for type and details
                    $ChangeType = "improvement"
                    $Impact = "functionality"
                    $IsBreaking = $false
                    
                    if ($CommitMessage -match "BREAKING|breaking") {
                        $ChangeType = "breaking-change"
                        $IsBreaking = $true
                        $Impact = "api"
                    }
                    elseif ($CommitMessage -match "^feat|^feature|Add |New ") {
                        $ChangeType = "feature"
                        $Impact = "functionality"
                    }
                    elseif ($CommitMessage -match "^fix|Fix |Resolve |Correct ") {
                        $ChangeType = "bug-fix"
                        $Impact = "functionality"
                    }
                    elseif ($CommitMessage -match "style|design|visual|css") {
                        $Impact = "visual"
                    }
                    elseif ($CommitMessage -match "performance|optimize|speed") {
                        $Impact = "performance"
                    }
                    
                    # Extract issue numbers
                    $IssueMatch = [regex]::Match($CommitMessage, '#(\d+)')
                    $IssueNumber = if ($IssueMatch.Success) { [int]$IssueMatch.Groups[1].Value } else { $null }
                    
                    $Change = @{
                        type = $ChangeType
                        title = $CommitMessage -replace '\s*\([a-f0-9]+\)\s*$', '' -replace '\s*,?\s*closes\s+#\d+', ''
                        description = if ($CommitBody) { $CommitBody } else { $CommitMessage }
                        commit = $CommitHash.Substring(0, [Math]::Min(40, $CommitHash.Length))
                        impact = $Impact
                        breakingChange = $IsBreaking
                    }
                    
                    if ($IssueNumber) {
                        $Change.issueNumber = $IssueNumber
                    }
                    
                    $Changes += $Change
                }
                
                if ($Changes.Count -gt 0) {
                    $VersionType = "patch"
                    if ($Changes | Where-Object { $_.breakingChange }) { $VersionType = "major" }
                    elseif ($Changes | Where-Object { $_.type -eq "feature" }) { $VersionType = "minor" }
                    
                    $VersionEntry = @{
                        version = $NewTag -replace '^v', ''
                        date = $VersionDate
                        type = $VersionType
                        changes = $Changes
                    }
                    
                    $VersionHistory += $VersionEntry
                    $ProcessedVersions++
                }
            }
        }
        
        # Get first version info
        $FirstVersion = "unknown"
        if ($TagsWithDates.Count -gt 0) {
            $FirstVersion = $TagsWithDates[-1].Tag -replace '^v', ''
        }
        
        # Build the complete JSON structure
        $ChangelogData = @{
            component = $ComponentTag
            version = $CurrentVersion
            lastUpdated = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
            changelog = $VersionHistory
            deprecations = @()
            upcomingChanges = @()
            metadata = @{
                totalVersions = $ProcessedVersions
                firstVersion = $FirstVersion
                storyCount = $StoryFiles.Count
                testCount = $TestFiles.Count
                fileCount = $ComponentFiles.Count
                lastCommit = $CurrentCommit.Substring(0, [Math]::Min(40, $CurrentCommit.Length))
            }
        }
        
        # Convert to JSON and save
        $JsonOutput = $ChangelogData | ConvertTo-Json -Depth 10 -Compress:$false
        $JsonOutput | Out-File -FilePath $JsonOutputPath -Encoding UTF8
        
        Write-Host "     💾 Saved: $JsonOutputPath" -ForegroundColor Green
        Write-Host "     📊 Versions: $ProcessedVersions, Changes: $(($VersionHistory | ForEach-Object { $_.changes.Count } | Measure-Object -Sum).Sum)" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "✅ Component changelog generation completed!" -ForegroundColor Green
    Write-Host "📊 Summary:" -ForegroundColor Cyan
    Write-Host "   - Components processed: $($AllComponents.Count)" -ForegroundColor Gray
    Write-Host "   - Output directory: $ElevateDocsPath" -ForegroundColor Gray
    Write-Host "   - Max versions per component: $MaxVersionsPerComponent" -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Copy the generated JSON files to your elevate-ds documentation project" -ForegroundColor Gray
    Write-Host "2. Use the ComponentChangelog React component to display the data" -ForegroundColor Gray
    Write-Host "3. Set up automation to run this script on new releases" -ForegroundColor Gray
    
} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
} finally {
    Pop-Location
}