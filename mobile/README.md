# Polydodo mobile client

This mobile app receives, scores, saves and aggregates sleep sequences. Unlike the web application, this app can save sleep sequences for later consultation and display the aggregated results of several nights of sleep on a dashboard. Also, it will guide the user from the installation of the electrodes, until the end of his acquisition. It does not require the use of OpenBCI GUI as it directly interface itself with the OpenBCI board.

In the case of the Cyton, this is done using the serial protocol via an OTG cable that is plugged into the phone and with the Cyton Dongle plugged in. In the case of the Ganglion, the connection is made by bluetooth.

## Development Framework

We are using Flutter which is a high-level framework for mobile development. The speed of development and the possibility to develop a cross-platform product (Android and iOS) from a single code repository without sacrificing performances has been the determining factor in the use of this technology. Flutter uses the Dart language which is typed and compiled.

## Targeted Platform

We target Android as our only platform. While development frameworks like Flutter allow these two platforms to be targeted using a single source code, there are some small tasks and extra attention that should be paid in this regard. If it became worth it, we will also target iOS in the future.

## Getting Started

### Prerequisites
- Install the latest stable version of [flutter](https://flutter.dev/docs/get-started/install/).
- Install the latest stable version of [Android Studio](https://developer.android.com/studio/index.html).
  - Android Studio is a great tool as it installs the required Android SDK, but also provides an Android Virtual Device manager which allows you to emulate an android device.

### Setup
First, download the required dependencies using:
```
flutter pub get
```

Prior to build execute build-runner to generate the app's routes.  
```
flutter packages pub run build_runner watch --delete-conflicting-outputs
```

You now have the option to run the app on an emulator or on a live device. If you wish to run the app on a live device, you will need to use [Android Debug Brige](https://developer.android.com/studio/command-line/adb).

Once you have an emulator setup or a connection to your live device, you can now run the app using:
```
flutter run
```

## Learn more

Refer to the [wiki pages](https://github.com/PolyCortex/polydodo/wiki) to learn more about our mobile app project.
