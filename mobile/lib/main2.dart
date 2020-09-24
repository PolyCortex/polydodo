import 'package:flutter/material.dart';
import 'package:flutter_blue/flutter_blue.dart';
import 'package:binary/binary.dart';
import 'package:csv/csv.dart';
import 'dart:io';
import 'package:path_provider/path_provider.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blue,
        // This makes the visual density adapt to the platform that you run
        // the app on. For desktop platforms, the controls will be smaller and
        // closer together (more dense) than on mobile platforms.
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: MyHomePage(title: 'Flutter Demo Home Page'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;
  final FlutterBlue flutterBlue = FlutterBlue.instance;
  final List<BluetoothDevice> devicesList = new List<BluetoothDevice>();
  final Map<Guid, List<int>> readValues = new Map<Guid, List<int>>();

  @override
  _MyHomePageState createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  static String BLE_SERVICE = "fe84";
  static String BLE_RECEIVE = "2d30c082";
  static String BLE_SEND = "2d30c083";
  static String BLE_DISCONNECT = "2d30c084";

  BluetoothDevice _connectedDevice;
  BluetoothCharacteristic _sendCharacteristics;
  BluetoothCharacteristic _receiveCharacteristics;
  List<List> _values = new List();
  int sampleCounter = 0;



  

  List handleNegativesAndConvertToVolts(data) {
    for (int i = 1; i < 5; ++i) {
      for (int j = 0; j < 2; ++j) {
        int offset = 15 * j;
        String binary = data[i + offset].toRadixString(2);

        if (binary[binary.length - 1] == '1') {
          data[i + offset] = (~data[i + offset] & 524287 | 1) * -1;
        }

        // Convert to microvolts using the scale factor
        data[i + offset] =
            data[i + offset].toDouble() * (1200000 / (8388607.0 * 1.5 * 51.0));
      }
    }

    return data;
  }



  void updateData(event) async {
    setState(() => {addData(event)});
  }

  void startDataStream() async {
    initializeData();

    await _receiveCharacteristics.setNotifyValue(true);
    _receiveCharacteristics.value.listen((event) {
      updateData(event);
    });

    String b = 'b';
    await _sendCharacteristics.write(b.codeUnits);
  }

  void stopDataStream() async {
    String s = 's';
    await _receiveCharacteristics.setNotifyValue(false);
    await _sendCharacteristics.write(s.codeUnits);
    await _connectedDevice.disconnect();
    _connectedDevice = null;

    final directory = await getExternalStorageDirectory();
    final pathOfTheFileToWrite = directory.path + "/myCsvFile.txt";
    File file = File(pathOfTheFileToWrite);
    String csv = const ListToCsvConverter().convert(_values);
    await file.writeAsString(csv);

    _values.clear();
  }

  @override
  void initState() {
    super.initState();
    widget.flutterBlue.connectedDevices
        .asStream()
        .listen((List<BluetoothDevice> devices) {
      for (BluetoothDevice device in devices) {
        addDeviceTolist(device);
      }
    });
    widget.flutterBlue.scanResults.listen((List<ScanResult> results) {
      for (ScanResult result in results) {
        addDeviceTolist(result.device);
      }
    });
    widget.flutterBlue.startScan();
  }

  Scaffold buildListViewOfDevices() {
    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: ListView.builder(
          itemCount: widget.devicesList.length,
          itemBuilder: (context, index) {
            return Card(
              child: ListTile(
                  onTap: () => connectDevice(widget.devicesList[index]),
                  title: Text(widget.devicesList[index].name),
                  subtitle: Text(widget.devicesList[index].id.toString())),
            );
          }),
    );
  }

  Scaffold buildRecordingMenu() {
    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: Center(
        child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              RaisedButton(
                child: Text("Start"),
                onPressed: () => startDataStream(),
              ),
              RaisedButton(
                  child: Text("Stop"), onPressed: () => stopDataStream())
            ]),
      ),
    );
  }

  Scaffold _buildScaffold() {
    if (_connectedDevice != null) {
      return buildRecordingMenu();
    }
    return buildListViewOfDevices();
  }

  @override
  Widget build(BuildContext context) {
    // This method is rerun every time setState is called, for instance as done
    // by the _incrementCounter method above.
    //
    // The Flutter framework has been optimized to make rerunning build methods
    // fast, so that you can just rebuild anything that needs updating rather
    // than having to individually change instances of widgets.
    return _buildScaffold();
  }
}
