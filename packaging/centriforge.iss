; Inno Setup script for the CentriForge Windows installer.
;   iscc /DAppVersion=0.2.0 packaging\centriforge.iss
; Installs per user (no admin rights), so one-click updates run silently.

#ifndef AppVersion
  #define AppVersion "0.0.0"
#endif

[Setup]
AppId={{7C1E4B2A-5D3F-4E8B-9A61-CF0A2E5B7D19}
AppName=CentriForge
AppVersion={#AppVersion}
AppVerName=CentriForge {#AppVersion}
AppPublisher=CentriForge contributors
AppPublisherURL=https://github.com/Edgar-Mendonca/Compressor-Engineering-Suite
DefaultDirName={localappdata}\Programs\CentriForge
DefaultGroupName=CentriForge
DisableProgramGroupPage=yes
PrivilegesRequired=lowest
OutputDir=Output
OutputBaseFilename=CentriForge-Setup-{#AppVersion}
SetupIconFile=centriforge.ico
UninstallDisplayIcon={app}\CentriForge.exe
Compression=lzma2/max
SolidCompression=yes
WizardStyle=modern
CloseApplications=force
ArchitecturesAllowed=x64compatible
ArchitecturesInstallIn64BitMode=x64compatible

[Tasks]
Name: "desktopicon"; Description: "Create a desktop shortcut"; GroupDescription: "Shortcuts:"

[InstallDelete]
; Remove the previous version's bundle so stale libraries never mix with new ones.
Type: filesandordirs; Name: "{app}\_internal"

[Files]
Source: "dist\CentriForge\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\CentriForge"; Filename: "{app}\CentriForge.exe"
Name: "{autodesktop}\CentriForge"; Filename: "{app}\CentriForge.exe"; Tasks: desktopicon

[Run]
Filename: "{app}\CentriForge.exe"; Description: "Start CentriForge"; Flags: nowait postinstall skipifsilent
; After a silent one-click update, start the new version straight away.
Filename: "{app}\CentriForge.exe"; Flags: nowait; Check: WizardSilent
