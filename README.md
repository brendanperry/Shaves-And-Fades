A website for Shaves and Fades

Dev:
- Clone the project
- Navigation to main directory
- run the command 'npm i' (this will install all dependencies as described in the package.json)
- You can start the web app by running 'npm run webpack' follow by 'npm start' in the project main directory (do this each time)
- Go to localhost:3000 in your web browser to view it

- Keep all css files in the public/stylesheets directory because that is where express is looking
- This project has tests using Mocha, make tests under the unit-test directory as '[file-name-you-are-testing].test.js'
- Tests can be run with 'npm test'
- I strongly recommend unit testing any core logic to the system

- It is best to make a new branch for changes
- Changes are merged to master
- Production builds are pushed to the production branch with CI

note: loading indicator from https://loading.io/