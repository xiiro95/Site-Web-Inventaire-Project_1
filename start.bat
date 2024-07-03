@echo off
REM Chemin vers le répertoire XAMPP
SET XAMPP_PATH=C:\xampp

REM Chemin vers le fichier serveur.js
SET SERVER_JS_PATH=C:\xampp\htdocs\inventaire\serveur.js

REM Démarrer le service Apache de XAMPP
echo Démarrage du service Apache de XAMPP...
%XAMPP_PATH%\xampp_start.exe apache

REM Vérifier si Apache a démarré correctement
IF %ERRORLEVEL% NEQ 0 (
    echo Échec du démarrage du service Apache.
    pause
    exit /b %ERRORLEVEL%
) ELSE (
    echo Service Apache démarré avec succès.
)

REM Démarrer le service MySQL de XAMPP
echo Démarrage du service MySQL de XAMPP...
%XAMPP_PATH%\xampp_start.exe mysql

REM Vérifier si MySQL a démarré correctement
IF %ERRORLEVEL% NEQ 0 (
    echo Échec du démarrage du service MySQL.
    pause
    exit /b %ERRORLEVEL%
) ELSE (
    echo Service MySQL démarré avec succès.
)

REM Démarrer le serveur Node.js
echo Démarrage du serveur Node.js...
start /B node %SERVER_JS_PATH%

REM Vérifier si le serveur Node.js a démarré correctement
IF %ERRORLEVEL% NEQ 0 (
    echo Échec du démarrage du serveur Node.js.
    pause
    exit /b %ERRORLEVEL%
) ELSE (
    echo Serveur Node.js démarré avec succès.
)

pause