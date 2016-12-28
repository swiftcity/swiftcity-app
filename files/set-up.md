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

* [The Xcode Toolchain]()
  * The toolchain is responsible for printing an AST representation of the current project when it is being compiled. Its output
  is similar to using the `-dump-ast` command of Swift's compiler. This output will then be parsed so the information is extracted.
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
Xcode -> Toolchains -> Local Swift Development Snapshot 2016-11-21. It might be necessary to reopen Xcode. It is possible to see which toolchain is being used through its initial menu.
<img src="https://github.com/swiftcity/swiftcity-app/blob/master/files/set-up-images/select-toolchain.png" width="500">
<img src="https://github.com/swiftcity/swiftcity-app/blob/master/files/set-up-images/initial-menu.png" width="500">
3. From now on, every time that the project is built, a file called *dumper-output.txt* will be created with its AST information.

