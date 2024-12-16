param([string]$project, [string]$version, [string]$buildNumber, [string]$productCode, [string]$setupFileName)

$ism = new-object -comobject IswiAuto29.ISWiProject
$ism.OpenProject($project)

$ism.ProductVersion  = $version
Write-Output ".. updated ProductVersion to: $version"
$ism.ProductCode = $productCode
Write-Output ".. updated ProductCode to: $productCode"

$build = $ism.ISWiProperties.Item("BUILDNUMBER")
$build.Value = $buildNumber
Write-Output ".. updated build number to: $buildNumber"

$prodConfig = $ism.ISWiProductConfigs.Item("AutomatedBuild")
$prodConfig.SetupFileName = "$setupFileName" + ($version -replace '[.]', '')  + "Setup"
Write-Output ".. updated SetupFileName in AutomatedBuild product configuration"

$release = $prodConfig.ISWiReleases.Item("networkImage")
$release.LauncherCopyright = [char]0x00A9 + "1995-" + (Get-Date).Year + " Ellucian Company L.P. and its affiliates."
Write-Output ".. updated copyright in networkImage release"

foreach ($upgradeItem in $ism.ISWiUpgradeTableEntries)
{
    if ($upgradeItem.UpgradeCode -eq "{00000000-0000-0000-0000-000000000000}")
    {
            $upgradeItem.VersionMin = $version
            Write-Output ".. updated VersionMin in PreventDowngrade item"
    }
}

$ism.SaveProject()
$ism.CloseProject();