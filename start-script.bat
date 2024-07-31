@echo off
REM Start PostgreSQL if needed
REM "C:\Program Files\PostgreSQL\14\bin\pg_ctl" start -D "C:\Program Files\PostgreSQL\14\data"

REM Navigate to the directory containing the solution file and build the solution
cd C:\Users\Miljana\Documents\Technical-Department-Service\Technical-Department-Service\Technical-Department
echo Building .NET solution...
dotnet build Technical-Department.sln
if %errorlevel% neq 0 (
    echo Failed to build .NET solution
    pause
    exit /b %errorlevel%
)

REM Navigate to the directory of the Web API project and run it
cd C:\Users\Miljana\Documents\Technical-Department-Service\Technical-Department-Service\Technical-Department\Technical-Department.API
echo Starting .NET Web API backend...
start dotnet run --project Technical-Department.API.csproj
if %errorlevel% neq 0 (
    echo Failed to start .NET Web API backend
    pause
    exit /b %errorlevel%
)

REM Wait for the backend to start (simple 10-second delay, adjust as needed)
timeout /t 10

REM Navigate to the correct Angular project directory and start frontend
cd C:\Users\Miljana\Documents\Technical-Department-Service\Technical-Department-Service\Technical-Department-front\src
echo Starting Angular frontend...
start ng serve

REM Wait for Angular to start (simple 10-second delay, adjust as needed)
timeout /t 10

REM Open the Angular frontend in the default web browser
echo Opening http://localhost:4200/ in browser...
start http://localhost:4200/ingredients

REM Exit script
exit