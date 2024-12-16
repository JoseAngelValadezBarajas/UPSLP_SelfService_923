#!groovy​
library identifier: 'codeQualityScan@master', retriever: modernSCM(
  [$class: 'GitSCMSource',
   remote: "https://git.ellucian.com/scm/cor/code-quality-shared-lib.git",
   credentialsId: 'git_read_only'
  ]
)

pipeline {
  agent none

  options {
      buildDiscarder(logRotator(numToKeepStr: '10'))
   }

  environment {
    SOLUTION_NAME = 'SelfService.sln'
    PROJECT_NAME = 'SelfService\\SelfService.csproj'
    OUTPUT_PREFIX = 'PowerCampusSelfService'
    OUTPUT_EXT = 'Setup.exe'
    NODE_VERSION = '18.18.0'
    PROJECT_FOLDER = 'Self-Service'
    CONFIGURATION = 'Release'
    SONARQUBE_PROJECT = 'PowerCampus-SelfService'
  }

  stages {
    stage('dotNet')
    {
      agent { node { label 'PowerCampus-Net5Applications'}}

      environment {
        PROJECT_VERSION = readFile 'build/version.txt'
      }

      stages {
        stage('Build') {
          steps {
            script {
                powershell '$outputFileName = ($ENV:OUTPUT_PREFIX + ($ENV:PROJECT_VERSION -replace \'[.]\', \'\') + $ENV:OUTPUT_EXT) | Out-File ($ENV:WORKSPACE + "\\build\\outputFileName.txt") -NoNewLine -Encoding ASCII'
                  env.OUTPUT_FILE = readFile 'build/outputFileName.txt'
                  echo 'Output File Name: ' + env.OUTPUT_FILE
                  echo 'Product version: ' + env.PROJECT_VERSION
              }
            powershell'''
              .\\build\\UpdateAssemblyInfoFiles.ps1
              Write-Output ".. listing node versions"
              &"C:\\ProgramData\\nvm\\nvm.exe" version
              &"C:\\ProgramData\\nvm\\nvm.exe" list
              &"C:\\ProgramData\\nvm\\nvm.exe" install $ENV:NODE_VERSION
            '''
            bat 'call build/build.bat'
            codeQualityScan(['mode': 'dotnet', 'projectName': SONARQUBE_PROJECT, 'solution': SOLUTION_NAME])
          }
        }
        stage('Package') {
          steps {
            rtDownload (
                serverId: 'ArtifactoryProd',
                spec: '''{
                      "files": [
                        {
                          "pattern": "powercampus-generic/Source/SelfService/SelfServicePrevious.zip",
                          "flat" : "true"
                        }
                      ]
                }'''
            )
            dir('Previous')
            {
              unzip dir: '', glob: '', zipFile: WORKSPACE + '/SelfServicePrevious.zip'
            }
            powershell '''
              .\\build\\exportBuildInfo.ps1 -outputFile "$ENV:WORKSPACE\\Output\\App_Data\\buildInfo.json"
              .\\build\\createCab.ps1
            '''
                }
                post {
                  success {
                    stash includes: 'SelfService.cab, Patch.cab', name: 'sourceforinstaller'
            }
          }  
        }
      }
      post {
        cleanup {
          echo "Cleaning up workspace ${env.WORKSPACE}"
          deleteDir()
        }
      }
    }

    stage('Installer')
    {
      agent { node { label 'PowerCampus-Backoffice'}}

      environment {
        PROJECT_VERSION = readFile 'build/version.txt'
        PRODUCT_CODE = readFile 'build/productcode.txt'
        SETUP = "PowerCampusSelfService"
        OUTPUT_SUBFOLDER = 'SelfService'
      }

      stages {
        stage('InstallShield') {
          steps {
            echo "Product version: ${env.PROJECT_VERSION}"
            dir ('Installer/Source') {
              unstash 'sourceforinstaller'
            }
            rtDownload (
                serverId: 'ArtifactoryProd',
                spec: '''{
                      "files": [
                        {
                          "pattern": "powercampus-generic/INSTALL_SUPPORT/2023/*.*",
                          "target": "Installer/",
                          "flat" : "true"
                        }
                      ]
                }'''
            )
            bat '''
              C:\\Windows\\SysWow64\\WindowsPowerShell\\v1.0\\powershell -executionpolicy bypass -file "%WORKSPACE%\\build\\updateInstallShieldProject.ps1" -project "%WORKSPACE%\\Installer\\SelfService.ism" -buildNumber %BUILD_NUMBER% -version %PROJECT_VERSION% -setupFileName %SETUP% -productCode %PRODUCT_CODE%
              "%IS_LATEST_PATH%\\IsCmdBld.exe" -p "%WORKSPACE%\\Installer\\SelfService.ism" -r networkImage -c COMP -a AutomatedBuild -l PATH_TO_CERT_FILES=c:\\Cert
              "%SIGNTOOL_PATH%\\signtool.exe" sign /v /sm /s Root /n "Ellucian Company L.P." /t http://timestamp.digicert.com/scripts/timstamp.dll "%WORKSPACE%\\Installer\\%OUTPUT_SUBFOLDER%\\AutomatedBuild\\networkImage\\DiskImages\\DISK1\\%OUTPUT_FILE%"
            '''
          }
          post {
            success {
              archiveArtifacts allowEmptyArchive: true, artifacts: "Installer\\${OUTPUT_SUBFOLDER}\\AutomatedBuild\\networkImage\\DiskImages\\DISK1\\**\\*,SelfServicePatch.log,changedFiles.txt", caseSensitive: false, onlyIfSuccessful: true
              script {
                env.FOLDER = 'DEV'
                try {
                  echo env.BRANCH_NAME
                  if (env.BRANCH_NAME.contains('feature')) {
                    echo 'This is running on a FEATURE branch'
                    env.FOLDER = 'FEATURE'
                  }
                  else if (env.BRANCH_NAME.contains('release')) {
                    echo 'This is running on a RELEASE branch'
                    env.FOLDER = 'RELEASE'
                  }
                  else if (env.BRANCH_NAME.contains('hotfix')) {
                    echo 'This is running on a HOTFIX branch'
                    env.FOLDER = 'HOTFIX'
                  }
                }
                catch (ex) {
                  echo 'branch parameter not defined, assuming working on DEV'
                }

                powershell '.\\build\\writeReadme.ps1'
                rtUpload (
                    serverId: 'ArtifactoryProd',
                    spec: '''{
                          "files": [
                            {
                              "pattern": "Installer/${OUTPUT_SUBFOLDER}/AutomatedBuild/networkImage/DiskImages/DISK1/${OUTPUT_FILE}",
                              "target": "powercampus-generic/${FOLDER}/${PROJECT_FOLDER}/" 
                            },
                            {
                              "pattern": "Installer/${OUTPUT_SUBFOLDER}/AutomatedBuild/networkImage/DiskImages/DISK1/${OUTPUT_FILE}",
                              "target": "powercampus-generic/${FOLDER}/${PROJECT_FOLDER}/${OUTPUT_PREFIX}Latest${OUTPUT_EXT}"
                            },
                            {
                              "pattern": "readme.txt",
                              "target": "powercampus-generic/${FOLDER}/${PROJECT_FOLDER}/"
                            }
                         ]
                    }'''
                )
              }
            }
          }
        }
      }
      post {
        cleanup {
          echo "Cleaning up workspace ${env.WORKSPACE}"
            deleteDir()
        }
      }
    }
  }
}