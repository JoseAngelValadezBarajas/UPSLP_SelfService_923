$installdir= get-property -name CustomActionData

$configFilePath = "$installdir\Config\ConnectionSettings.config"
if (Test-Path -Path $configFilePath -PathType Leaf) {
    [xml]$configFile = (Get-Content $configFilePath)

    $pcConn = $configFile.SelectSingleNode("connectionStrings/add[@name='PowerCampus']")
    $pcConnString = $pcConn.connectionString

    $pfaidsConn = $configFile.SelectSingleNode("connectionStrings/add[@name='PowerFAIDS']")
    $pfaidsConnString = $pfaidsConn.connectionString

    $authConn = $configFile.SelectSingleNode("connectionStrings/add[@name='PowerCampus.Auth']")
    $authConnString = $authConn.connectionString

    $connSettings = Get-Content "$installdir\Config\ConnectionSettings.json" -raw | ConvertFrom-Json
    $connSettings.ConnectionStrings.PowerCampusDbContext = $pcConnString
    $connSettings.ConnectionStrings.PowerCampusAuthDbContext = $authConnString
    $connSettings.ConnectionStrings.PowerFaidsDbContext = $pfaidsConnString

    $connSettings | ConvertTo-Json -Depth 32 | Set-Content "$installdir\Config\ConnectionSettings.json"
}


$configFilePath = "$installdir\Config\AuthenticationSettings.config"
if (Test-Path -Path $configFilePath -PathType Leaf) {
    [xml]$configFile = (Get-Content $configFilePath)

    $loginSettings = $configFile.SelectSingleNode("authenticationSettings/LoginSettings")
    $UserNameMask = $loginSettings.UserNameMask
    $UseMaskFirst = $loginSettings.UseMaskFirst

    $ActiveDirectory = $configFile.SelectSingleNode("authenticationSettings/ActiveDirectory/Store")
    $adName = $ActiveDirectory.Name
    $adServer =$ActiveDirectory.Server
    $adContainer = $ActiveDirectory.Container
    $adUser = $ActiveDirectory.User
    $adPwd = $ActiveDirectory.Password

    $ADFS = $configFile.SelectSingleNode("authenticationSettings/ADFS/Store")
    $adfsName = $ADFS.Name
    $adfsMetadataAddress = $ADFS.MetadataAddress
    $adfswtRealm = $ADFS.WtRealm

    $SAML = $configFile.SelectSingleNode("authenticationSettings/SAML/Store")
    $samlName = $SAML.Name
    $samlServiceProviderPrivateKeyFilename = $SAML.ServiceProviderPrivateKeyFilename
    $samlServiceProviderPrivateKeyPassword = $SAML.ServiceProviderPrivateKeyPassword
    $samlIdentityProviderPublicKeyFilename = $SAML.IdentityProviderPublicKeyFilename
    $samlServiceProviderId = $SAML.ServiceProviderId

    $authSettings = Get-Content "$installdir\Config\AuthenticationSettings.json" -raw | ConvertFrom-Json
    $authSettings.AuthenticationSettings.Login.UserNameMask = $UserNameMask
    $authSettings.AuthenticationSettings.Login.UseMaskFirst = $UseMaskFirst

    $authSettings.AuthenticationSettings.ActiveDirectory.Stores[0].Name = $adName
    $authSettings.AuthenticationSettings.ActiveDirectory.Stores[0].Server = $adServer
    $authSettings.AuthenticationSettings.ActiveDirectory.Stores[0].Container = $adContainer
    $authSettings.AuthenticationSettings.ActiveDirectory.Stores[0].User = $adUser
    $authSettings.AuthenticationSettings.ActiveDirectory.Stores[0].Password = $adPwd

    $authSettings.AuthenticationSettings.ADFS.Stores[0].Name = $adfsName
    $authSettings.AuthenticationSettings.ADFS.Stores[0].MetadataAddress = $adfsMetadataAddress
    $authSettings.AuthenticationSettings.ADFS.Stores[0].WtRealm = $adfswtRealm

    $authSettings.AuthenticationSettings.SAML.Stores[0].Name = $samlName
    $authSettings.AuthenticationSettings.SAML.Stores[0].Issuer = $samlServiceProviderId
    $authSettings.AuthenticationSettings.SAML.Stores[0].SigningCertificateFile = $samlServiceProviderPrivateKeyFilename
    $authSettings.AuthenticationSettings.SAML.Stores[0].SigningCertificatePassword = $samlServiceProviderPrivateKeyPassword
    $authSettings.AuthenticationSettings.SAML.Stores[0].SignatureValidationCertificateFile = $samlIdentityProviderPublicKeyFilename

    $authSettings | ConvertTo-Json -Depth 32 | Set-Content "$installdir\Config\AuthenticationSettings.json"

}

$configFilePath = "$installdir\Config\NotificationSettings.config"
if (Test-Path $configFilePath -PathType Leaf) {
    [xml]$configFile = (Get-Content $configFilePath)

    $notificationSettings = $configFile.SelectSingleNode("notificationSettings/NotificationSetting")
    $notificationEnabled = $notificationSettings.Enabled
    $notificationBaseAddress = $notificationSettings.BaseAddress
    $notificationDomain = $notificationSettings.Domain
    $notificationUserName = $notificationSettings.UserName
    $notificationsPassword = $notificationSettings.Password


    $authSettings = Get-Content "$installdir\Config\NotificationSettings.json" -raw | ConvertFrom-Json
    $authSettings.NotificationSettings.Enabled = $notificationEnabled
    $authSettings.NotificationSettings.BaseAddress = $notificationBaseAddress
    $authSettings.NotificationSettings.Domain = $notificationDomain
    $authSettings.NotificationSettings.UserName = $notificationUserName
    $authSettings.NotificationSettings.Password = $notificationsPassword

    $authSettings | ConvertTo-Json -Depth 32 | Set-Content "$installdir\Config\NotificationSettings.json"
}