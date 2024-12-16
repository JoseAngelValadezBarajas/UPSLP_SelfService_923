function Update-SourceVersion
{
  Param ([string]$Version)
  $NewVersion = 'AssemblyVersion("' + $Version + '")';
  $NewFileVersion = 'FileVersion("' + $Version + '")';

  foreach ($o in $input) 
  {
    Write-output $o.FullName
    $TmpFile = $o.FullName + ".tmp"

     Get-Content $o.FullName -encoding utf8 |
        %{$_ -replace 'AssemblyVersion\("[0-9]+(\.([0-9]+|\*)){1,3}"\)', $NewVersion } |
        %{$_ -replace 'FileVersion\("[0-9]+(\.([0-9]+|\*)){1,3}"\)', $NewFileVersion }  |
        Set-Content $TmpFile -encoding utf8
    
    move-item $TmpFile $o.FullName -force
  }
}

function Update-AllAssemblyInfoFiles ( $version )
{
  foreach ($file in "AssemblyInfo.cs", "AssemblyInfo.vb", "SelfService.csproj")
  {
    get-childitem -recurse |? {$_.Name -eq $file} | Update-SourceVersion $version;
  }
}

$version = ($ENV:PROJECT_VERSION + "." + $ENV:BUILD_NUMBER)
Write-output $version
Update-AllAssemblyInfoFiles $version;