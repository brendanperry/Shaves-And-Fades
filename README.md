A website for Shaves and Fades

Dev:
- Clone the project
- Navigation to main directory
- run the command 'npm i' (this will install all dependencies as described in the package.json)
- You can start the web app by running 'npm start' in the project main directory
- Go to localhost:3000 in your web browser to view it
- The data-access.js file connects to a local mongodb database with instructions for use in the file (currently only works locally and needs some adjusting so it doesn't crash the whole server)
- Keep all css files in the public/stylesheets directory because that is where express is looking
- We have .ejs files instead of html, but you can write html the same and ignore the new features if you want to (keep in views directory)
- This project has tests using Mocha, make tests under the unit-test directory as '[file-name-you-are-testing].test.js'
- Tests can be run with 'npm test'
- I strongly reccomend unit testing any core logic to the system
- It is best to make a new branch for changes
- Any pushes to master will trigger the pipeline and go live on the site in minutes