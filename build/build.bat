dotnet restore "%WORKSPACE%\SelfService.sln"
cd %WORKSPACE%\SelfService

"C:\\ProgramData\\nvm\\nvm.exe" use %NODE_VERSION%
call "C:\\ProgramData\\nvm\\v%NODE_VERSION%\\npm.cmd" -v
call "C:\\ProgramData\\nvm\\v%NODE_VERSION%\\npm.cmd" install --scripts-prepend-node-path=true || echo Installation (first-level) Error && exit /b
call "C:\\ProgramData\\nvm\\v%NODE_VERSION%\\npm.cmd" install --scripts-prepend-node-path=true || echo Installation (second-level) Error && exit /b
call "C:\\ProgramData\\nvm\\v%NODE_VERSION%\\npm.cmd" run-script ts-version --scripts-prepend-node-path=true
call "C:\\ProgramData\\nvm\\v%NODE_VERSION%\\npm.cmd" run-script type-check --scripts-prepend-node-path=true || echo Syntaxis Error && exit /b
call "C:\\ProgramData\\nvm\\v%NODE_VERSION%\\npm.cmd" run-script build --scripts-prepend-node-path=true || echo Transpiling Error && exit /b

dotnet build /nodereuse:false "%WORKSPACE%\%SOLUTION_NAME%" --configuration %CONFIGURATION%
dotnet publish "%WORKSPACE%\%PROJECT_NAME%" --configuration %CONFIGURATION% --runtime win-x64 --no-self-contained --output "%WORKSPACE%\Output"