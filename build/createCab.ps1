$newCode = "$ENV:WORKSPACE\Output"

$cabarcExe = "C:\Program Files (x86)\CabSDK\BIN\CABARC.exe"
$trimSection = $newCode.substring(3, $newCode.length-3)
Write-Host $trimSection
$cabarcArgument = "-r", "-p", "-P", "$trimSection\", "n", "SelfService.cab",  "$newCode\*.*"
& $cabarcExe @cabarcArgument

$beyondCompareExe = "C:\Program Files (x86)\Beyond Compare 4\bcompare.exe"
$bcscript = "$ENV:WORKSPACE\build\createSelfServicePatch.txt"
$previousCode = "$ENV:WORKSPACE\Previous"
$outputPath = "$ENV:WORKSPACE\Patch"
$logPath = "$ENV:WORKSPACE\SelfServicePatch.log"
$reportPath = "$ENV:WORKSPACE\Patch\changedFiles.txt"

$bcArgument = "/silent", "@$bcscript", "$previousCode", "$newCode", "$outputPath", "$logPath", "$reportPath"
& $beyondCompareExe @bcArgument
Write-Host "Beyond Compare has completed."

$trimSection = $outputPath.substring(3, $outputPath.length-3)
Write-Host $trimSection
$cabarcArgument = "-r", "-p", "-P", "$trimSection\", "n", "Patch.cab",  "$outputPath\*.*"
& $cabarcExe @cabarcArgument
