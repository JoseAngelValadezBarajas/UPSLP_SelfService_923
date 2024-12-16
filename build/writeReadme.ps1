$timeStamp = $date = Get-Date -Format u
$intro = "These artifacts were generated on: " + $timeStamp + "`r`n"
$version = "Version: " + $ENV:PROJECT_VERSION + "." + $ENV:BUILD_NUMBER + "`r`n"

$metadata = ($intro + $version + $ENV:BUILD_URL) | Out-File ($ENV:WORKSPACE + "\readme.txt")