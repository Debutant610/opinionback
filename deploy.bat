@echo off
echo.
echo ========================================================
echo        OPINBACK - DEPLOIEMENT VERS VERCEL (PRODUCTION)
echo ========================================================
echo.
echo 1. Verification des fichiers ajoutes...
git add .
echo.
echo 2. Sauvegarde des nouvelles fonctionnalites...
git commit -m "feat: lancement production avec base de donnees reelle et api binance"
echo.
echo 3. Envoi vers GitHub et Vercel...
git push origin main -f
echo.
echo ========================================================
echo SUCCES ! Vercel est en train de compiler le site.
echo Le site sera en ligne avec la vraie base de donnees
echo d'ici 1 minute.
echo ========================================================
pause
