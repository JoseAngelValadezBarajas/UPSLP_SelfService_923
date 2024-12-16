$installdir= get-property -name CustomActionData

If (Test-Path -Path "$installdir\Config\ConnectionSettings.config" -PathType Leaf) { Remove-Item -Path "$installdir\Config\ConnectionSettings.config" }
If (Test-Path -Path "$installdir\Config\AuthenticationSettings.config" -PathType Leaf) { Remove-Item -Path "$installdir\Config\AuthenticationSettings.config" }
If (Test-Path -Path "$installdir\Config\NotificationSettings.config" -PathType Leaf) { Remove-Item -Path "$installdir\Config\NotificationSettings.config" }