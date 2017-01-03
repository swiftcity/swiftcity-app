# Setting up

This guide intends to explain how to set up the necessary tools to extract your Swift project's data. 
At the end, you will be able to correctly upload your project data and visualize it using [SwiftCity](https://peaonunes.github.io/swiftcity/).

## Pre-requisites

It is necessary that your machine has the following:

* Xcode 8.0+
  * The toolchain compiles projects using Swift 3.
* Java
  * The parser that transforms the toolchain output to understandable data will use the `-jar` command.

It is necessary to download the following files:

* [The Xcode Toolchain](https://drive.google.com/open?id=0B5MQj087FULcRWR5b3ZMOEpjYnM)
  * The toolchain is responsible for printing an AST representation of the current project when it is being compiled. Its output is similar to using the `-dump-ast` command of Swift's compiler. This output will then be parsed so the information is extracted.
  * The current toolchain code can be found [here](https://github.com/frsoares/swift), on the branch swift-3.0-branch.
* [The Parser](https://drive.google.com/open?id=0B5MQj087FULcVi1WR2tlOW1QYmM)
  * The parser breaks the AST representation into understandable data, such as detecting classes, enums and other metrics. 
  It also generates the file that is used as input to [SwiftCity](https://peaonunes.github.io/swiftcity/).

## Installing

1. After downloading the Xcode Toolchain, it is necessary to unzip it. It will create a folder called *Library*. 
Copy the file *swift-LOCAL-2016-11-21-a.xctoolchain* present at *Library/Developer/Toolchains* and place it at 
your Xcode's toolchain folder. This is commonly located at */Applications/Xcode/Contents/Developer/Toolchains*. 
This will enable Xcode to detect the custom toolchain and present it through its interface.

2. Open Xcode and select the current toolchain to use the one you just installed. This can be done by the following steps: 
Xcode -> Toolchains -> Local Swift Development Snapshot 2016-11-21. It might be necessary to reopen Xcode. It is possible to see which toolchain is being used through its initial menu. From now on, every time that the project is built, a file called *dumper-output.txt* will be created with its AST information inside your project directory.
<img src="https://github.com/swiftcity/swiftcity-app/blob/master/files/set-up-images/select-toolchain.png" width="500">
<img src="https://github.com/swiftcity/swiftcity-app/blob/master/files/set-up-images/initial-menu.png" width="500">

3. In order to extract information from the *dumper-output.txt*, we will use the parser. After downloading the SwiftDumperParser.jar, it is possible to run it using the command `java -jar SwiftDumperParser.jar path/to/dumper-output.txt`. This will create a .json file that can be uploaded to Swiftcity.
4. The step above can be automated by using build phase scripts inside Xcode. This allows the `java -jar` command to be run automatically when the project is built.  
 * With your project open, select your project icon (blue icon) on the Project Navigator. Then, select the target of your project, and click on *Build Phases*. We will add two new build phases. 

 <img src="https://github.com/swiftcity/swiftcity-app/blob/master/files/set-up-images/begin-build-phases.png" width="500">

*  The first script will remove the old dumper file, if it exists. It is necessary since the current implementation of the toolchain appends the Ast Dump to the current existing file. Click the + icon, and select *New Run Script Phase*. Then, place the code `rm -f dumper-output.txt` inside the black box, and mark *Run script only when installing*, so it runs when the project is built. Place the script between *Target Dependencies* and *Compile Sources*.

 <img src="https://github.com/swiftcity/swiftcity-app/blob/master/files/set-up-images/delete-old-dump-script.png" width="500">
 
*  The second script will run the SwiftDumperParser.jar. Click the + icon, and select *New Run Script Phase*. Then, place the code `java -jar path/to/SwiftDumperParser.jar dumper-output.txt your-project-name.json`. Remember to change the path on the script to your local *.jar* location. Place the script after *Link Binary With Libraries*. 

 <img src="https://github.com/swiftcity/swiftcity-app/blob/master/files/set-up-images/run-jar-script.png" width="500">
 
 *  The final *Build Phases* should look like this:
 
 <img src="https://github.com/swiftcity/swiftcity-app/blob/master/files/set-up-images/final-build-phases.png" width="500">
 
 5. Everything is set! Now just upload the *.json* to [SwiftCity](https://peaonunes.github.io/swiftcity/) and see how your project looks. 

## Current problems and things that must be fixed

1. If you decide not to use the scripts inside Xcode, it is necessary to manually delete the *dumper-output.txt* file before building, since it appends the text of the ast dump to the existing file. Then, multiple builds might generate an inconsistent file that will produce a wrong visualization. 

## Conclusion

We hope that this tutorial was able to make the set-up and installation of the tools an easy proccess. Thank you for using SwiftCity! 


