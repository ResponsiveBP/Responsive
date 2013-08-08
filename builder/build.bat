@echo off
rem turn off the noise.

rem Sets the root folder to the location of the cruncher executable.
pushd "%~dp0\cruncher"

echo This file combines and builds the responsive framework.
echo.

echo Building CSS files.
echo --------------------------------------------------

echo Building responsive.css
start /b cruncherconsole.exe -in:..\..\src\css\responsive.css -out:..\..\rel\responsive.css -t:css 

echo Building responsive.min.css
start /b cruncherconsole.exe -in:..\..\src\css\responsive.css -out:..\..\rel\responsive.min.css -t:css -m 

echo Building responsive-legacy.css
start /b cruncherconsole.exe -in:..\..\src\css\responsive-legacy.css -out:..\..\rel\responsive-legacy.css -t:css 

echo Building responsive-legacy.min.css
start /b cruncherconsole.exe -in:..\..\src\css\responsive-legacy.css -out:..\..\rel\responsive-legacy.min.css -t:css -m 
echo.
echo CSS build complete.

rem Just a bit of whitespace.
echo.
echo.

echo Building JavaScript files.
echo --------------------------------------------------

echo Building responsive.js
start /b cruncherconsole.exe -in:..\..\src\js -out:..\..\rel\responsive.js -t:javascript 

echo Building responsive.min.js
start /b cruncherconsole.exe -in:..\..\src\js -out:..\..\rel\responsive.min.js -t:javascript -m 
echo.
echo Javascript build Complete.
echo.
echo.

echo All builds complete, check the rel folder for output.
PAUSE