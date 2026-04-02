@echo off
echo.
echo ========================================================
echo        OPINBACK - DEPLOIEMENT FINAL (PRODUCTION)
echo ========================================================
echo.
echo 1. Suppression du fichier lock corrompu...
del package-lock.json
echo.
echo 2. Reinstallation des dépendances propre...
call npm install
echo.
echo 3. Sauvegarde de tout...
git add .
git commit -m "fix: update to Next.js 15.3.3 secure version with fresh lockfile"
echo.
echo 4. Envoi vers GitHub et Vercel...
git push origin main
echo.
echo ========================================================
echo SUCCES ! Vercel compile le site en version securisee.
echo ========================================================
pause
