@echo off
set /p comment=Enter your comment: 
git add .
git commit -m "%comment%"
git push heroku master
heroku open