$process = "$env:windir\system32\iisreset.exe"
$arguments  = "/RESTART"

$proc = Start-Process $process -ArgumentList $arguments -PassThru -Wait
if ($proc.ExitCode -ne 0) {
    Write-Host "IISRESET returned error code $($proc.ExitCode)"
    trace-info ?LogMessage ?IISRESET returned error code?
}
else {
    Write-Host "IISRESET execution succeeded"
    trace-info ?LogMessage ?IISRESET execution succeeded?
}

