# PowerCampus Self Service 9 Development Environment
**Steps to prepare a development environment using Typescript and .Net (VS 2022) to run Self Service 9.**

1. Install [Node.js v18.18.0](https://nodejs.org/dist/v18.18.0/node-v18.18.0-x64.msi).
    - We need it to execute JavaScript on server.
    - Node.js includes NPM (Node Package Manager), it is like Nuget for Visual Studio.
2. Install [TypeScript v4.8.4 SDK](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.typescript-484) for Visual Studio 2022.
3. Open a Node.js Command Prompt (cmd):
    - To check the Node version installed:  
        `node -v`  
        _Expected result:_ `v18.18.0`
    - To check the NPM version installed:  
        `npm –v`  
        _Expected result:_ `9.8.1`
    - To check the **Self Service NPM packages path**:  
        `npm root`
    - To check the global NPM packages path:  
        `npm -g root`
4. Clone and download the solution from your repository:  
    `git clone <repositoryurl.git>`
5. Open the **selfservice folder**, where you downloaded the solution, only copy the **path**:  
    _(something like 'C:\PowerCampus\selfservice\SelfService')_  
    **DO NOT OPEN THE SOLUTION IN VISUAL STUDIO UNTIL ALL PACKAGES ARE INSTALLED**
6. Use a command line and change to the specified path in the previous step:  
    `cd <path>`
7. Install the packages that are included in the **package.json** file:  
    `npm install`
8. Check if everything is ok:  
    `npm run type-check`
8. Use the transpiler to generate the JS and CSS files:  
    `npm run build` (this will take several minutes, according to the specifications of your machine, you will not be able to do anything else while this process creates the files)
9. If you just want to transpile a module, you are able to specify the module in the command line:  
    `npm run start:<modulename>`  
        - i.e. `npm run start:home`  
        - To know the name of the modules you can view the options in the **package.json** file
10. Now all the required packages are installed, you can open the solution in Visual Studio and build it.
    - Do not manually install another version of React or any other package, it may cause conflicts.