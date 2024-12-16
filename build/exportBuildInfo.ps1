param([string]$outputFile)

function ExportBuildInfo()
{
    $buildInfo = new-object PSObject
    $currentDate = Get-Date -Format g 

	$buildInfo | add-member -type NoteProperty -Name version -Value "$ENV:PROJECT_VERSION" 
	$buildInfo | add-member -type NoteProperty -Name build -Value "$ENV:PROJECT_VERSION.${ENV:BUILD_NUMBER}" 
	$buildInfo | add-member -type NoteProperty -Name date -Value $currentDate

	return $buildInfo
}

ExportBuildInfo | ConvertTo-Json | Out-File $outputFile