# TeaCo-Mobile

Ionic Project of a mobile companion app for a TeaCo server platform. <br />
This project has been implemented as part of a class implementation project in the master's program [Computer Science and Media](https://informatik.th-brandenburg.de/studium/masterstudiengaenge/online-studiengang-medieninformatik/?S=248) at [Brandenburg University of Applied Sciences](https://informatik.th-brandenburg.de).
<br />
<br />
**Course Instructor**

* [Prof. Dr. rer. nat. Martin Christof Kindsmüller](mailto:martin.christof.kindsmueller@th-brandenburg.de)

**Development Team**

* [Dominic Schiller](mailto:dominic.schiller@th-brandenburg.de)<br />
Project Manager & Mobile Application Developer
* [Vasileios Roumoglou](mailto:vasileios.roumoglou@th-brandenburg.de) <br />
Mobile Application Developer
* [Iven Köthke](mailto:koethke@th-brandenburg.de) <br />
Mobile Application Developer

----


## Prerequisites


To use and run this Ionic project, it is required that the development environment is set up as follows:


#### Tools


* [Node.js](https://nodejs.org/en/) must be installed (latest stable version recommended) in order to install cordova and ionic with all it's dependencies
* [Java SE Development Kit 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) 
must be installed in order to meet the Android SDK's required Java version & the [`JAVA_HOME`](https://docs.oracle.com/cd/E19182-01/820-7851/inst_cli_jdk_javahome_t/) 
environment variable must be correct set on the current operating system
* [Android Studio](https://developer.android.com/studio/) including the latest stable Android SDK must be installed in order to be able to build the TeaCoMobile app for Android
* If running MacOS it's neccessary that [Xcode](https://developer.apple.com/xcode/) 
is installed to be able to build the TeaCoMobile app for iOS


#### Installing the Cordova and Ionic Command Line Interfaces (CLI)


Before installing the Ionic CLI it is required to install the Cordova CLI first, since Ionic addresses that CLI when building the app project for Android and iOS.
To do so, the following command must be executed in the system's shell:

```console
foo@bar:~$ npm install -g cordova
```

 This command will download and install the Cordova CLI globally on the operating system using the `npm`-package manager that has been shipped and installed along with NodeJS.
 <br />
 If Cordova has been installed successfully, Ionic can be installed next by running the following command:

```console
foo@bar:~$ npm install -g ionic
```

 Similar to the installation of the Cordova CLI, this command will install the Ionic CLI on the system globally.

 > <span class="black">**Note:** <br />
 > In some cases both commands listed above might fail. If so, these commands should be executed with the `sudo` keyword in front if running MacOS or the shell-application launched as administrator if running 
 > Windows to finally execute these commands with administrator permissions.
 
 <br />
 <br />
 

## Initializing the Project

Once the project has been cloned or downloaded to the local system it has to be initialized though.
<br />
To install all production and development dependencies using the Node.js package manager `npm` which are defined in the `package.json` file, the following shell command needs to be executed within the projects root directory:<br />

```console
foo@bar:~$ npm install 
```

<br />
 This command will install all required dependencies locally to the `node_modules` directory.
 <br />
 <br />
 The last step before getting ready is to install all plugins required by Cordova and Ionic.<br />
 To do so, the following shell command needs to be executed within the projects root directory:

 ```console
foo@bar:~$ ionic cordova prepare
 ```
 <br />
 Similar to the project dependencies, this command will install all plugins locally to the `plugins` directory.
 <br />
 <br />
 
## Build and Run the Project

If the local development environment is set up correctly and the project has been completely initialized as described in the previous sections,
the project can be built.
<br />

#### Build and Run for the local Web Browser

Building the project for the web browser is the first step the Ionic CLI will always take -  even if a build for iOS or Android has been actually requested as it will be described in the upcoming sections.
<br />
To build the project for the web browser, the following shell command needs to be executed within the projects root directory:

 ```console
 foo@bar:~$ ionic build
 ```

 This command will take all source files from the project's `src` directory, builds, minifies and hence copies the final build result to the
 project's `www` directory.
 <br />
 <br />
 The finally run and preview the build result in the systems' set default web browser, the following command needs to be executed: 

```console
foo@bar:~$ ionic serve
```

  > <span class="black">**Note:** <br />
 > `ionic serve` can be used as short hand command to build and preview the app all at once.<br />
 > But the most useful fact with this command is that, whenever some changes to any of the source files from the  
 > `src` directory will be made, the browser will be updated instantly. This said, this command offers a live preview feature while coding.
 > 
 > 

  > <span class="black">**Note:** <br />
 > It's recommended using [Chrome](https://www.google.de/intl/de_ALL/chrome/) as default web browser for development purpose, since it provides handy [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/) like the [Device Toolbar](https://developers.google.com/web/tools/chrome-devtools/device-mode/), which makes it possible to test the app's visual responsiveness along different device classes and viewport sizes.
 > 
