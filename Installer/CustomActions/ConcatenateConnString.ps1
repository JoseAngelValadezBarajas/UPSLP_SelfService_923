function CheckMissingString {
    param (
        [ref]$connStr,
        [string]$missingStr
    )
    if (-not $connStr.Value.Contains($missingStr)) {
        if (-not $connStr.Value.EndsWith(';')){
            $connStr.Value = "$($connStr.Value);$missingStr;"
        }
        else {
            $connStr.Value ="$($connStr.Value)$missingStr;"
        }
    }
}

$installdir= get-property -name CustomActionData
$multMissingString = 'MultipleActiveResultSets=True'
$encryptMissingString = 'Encrypt=False'

$jsonFilePath = "$installdir\Config\ConnectionSettings.json"
if (Test-Path -Path $jsonFilePath -PathType Leaf) {
    $connSettings = Get-Content $jsonFilePath -raw | ConvertFrom-Json

    [string]$connString = $connSettings.ConnectionStrings.PowerCampusDbContext
    CheckMissingString -connStr ([ref]$connString) -missingStr ($multMissingString)
    CheckMissingString -connStr ([ref]$connString) -missingStr ($encryptMissingString)
    $connSettings.ConnectionStrings.PowerCampusDbContext = $connString
    Write-Host "Updated PowerCampus connection string."

    $connString = $connSettings.ConnectionStrings.PowerCampusAuthDbContext
    CheckMissingString -connStr ([ref]$connString) -missingStr ($multMissingString)
    CheckMissingString -connStr ([ref]$connString) -missingStr ($encryptMissingString)
    $connSettings.ConnectionStrings.PowerCampusAuthDbContext = $connString
    Write-Host "Updated PowerCampusAuthDbContext connection string."

    $connString = $connSettings.ConnectionStrings.PowerFaidsDbContext
    CheckMissingString -connStr ([ref]$connString) -missingStr ($multMissingString)
    CheckMissingString -connStr ([ref]$connString) -missingStr ($encryptMissingString)
    $connSettings.ConnectionStrings.PowerFaidsDbContext = $connString
    Write-Host "Updated PowerFAIDS connection string."

    $connSettings | ConvertTo-Json -Depth 32 | Set-Content "$installdir\Config\ConnectionSettings.json"
}
else {
    Write-Host "ConnectionSettings.json file does not exist."
}