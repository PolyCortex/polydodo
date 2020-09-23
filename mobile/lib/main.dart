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

  void addDeviceTolist(final BluetoothDevice device) {
    if (!widget.devicesList.contains(device)) {
      setState(() {
        widget.devicesList.add(device);
        print(widget.devicesList);
      });
    }
  }

  void connectDevice(BluetoothDevice device) async {
    try {
      await device.connect();
    } catch (e) {
      if (e.code != 'already_connected') {
        throw e;
      }
    } finally {
      List<BluetoothService> services = await device.discoverServices();

      for (BluetoothService service in services) {
        if (service.toString().contains(BLE_SERVICE)) {
          for (BluetoothCharacteristic characteristic
              in service.characteristics) {
            if (characteristic.toString().contains(BLE_RECEIVE)) {
              _receiveCharacteristics = characteristic;
            } else if (characteristic.toString().contains(BLE_SEND)) {
              _sendCharacteristics = characteristic;
            }
          }
        }
      }
    }

    setState(() {
      _connectedDevice = device;
    });
  }

  List getListForCSV() {
    List data = new List(30);

    for (int i = 5; i < 15; ++i) {
      data[i] = 0;
      data[i + 15] = 0;
    }
    return data;
  }

  List formatData(event) {
    // Test event, comment scale factor
    // event = [ 101, 0, 0, 0, 0, 8, 0, 5, 0, 0, 72, 0, 9, 240, 1, 176, 0, 48, 0, 8]; // Positive Test
    // Expected [[0, 2, 10, 4], [262148, 507910, 393222, 8]]
    // event = [ 101, 255, 255, 191, 255, 239, 255, 252, 255, 255, 88, 0, 11, 62, 56, 224, 0, 63, 240, 1 ]; // Negative Test
    // Expected [[-3, -5, -7, -11], [-262139, -198429, -262137, -4095]]

    List data = getListForCSV();

    data[0] = sampleCounter;
    data[1] = (event[1] << 11) | (event[2] << 3) | (event[3] >> 5);
    data[2] = ((event[3] & 31) << 14) | (event[4] << 6) | (event[5] >> 2);
    data[3] = ((event[5] & 3) << 17) |
        (event[6] << 9) |
        (event[7] << 1) |
        (event[8] >> 7);
    data[4] = ((event[8] & 127) << 12) | (event[9] << 4) | (event[10] >> 4);
    data[15] = sampleCounter++;
    data[16] = ((event[10] & 15) << 15) | (event[11] << 7) | (event[12] >> 1);
    data[17] = ((event[12] & 1) << 18) |
        (event[13] << 10) |
        (event[14] << 2) |
        (event[15] >> 6);
    data[18] = ((event[15] & 63) << 13) | (event[16] << 5) | (event[17] >> 3);
    data[19] = ((event[17] & 7) << 16) | (event[18] << 8) | (event[19]);

    return data;
  }

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

  void addData(event) async {
    int packetID = event[0];

    if (packetID >= 101 && packetID <= 200) {
      List data = formatData(event);
      data = handleNegativesAndConvertToVolts(data);

      _values.add(data.sublist(0, 15));
      _values.add(data.sublist(15, 30));
    }
  }

  void updateData(event) async {
    setState(() => {addData(event)});
  }

  void initializeData() {
    _values.add(["%OpenBCI Raw EEG Data"]);
    _values.add(["%Number of channels = 4"]);
    _values.add(["%Sample Rate = 200 Hz"]);
    _values.add(["%Board = OpenBCI_GUI\$BoardGanglionBLE"]);
    _values.add([
      "Sample Index",
      " EXG Channel 0",
      " EXG Channel 1",
      " EXG Channel 2",
      " EXG Channel 3",
      " Accel Channel 0",
      " Accel Channel 1",
      " Accel Channel 2",
      " Other",
      " Other",
      " Other",
      " Other",
      " Other",
      " Timestamp",
      " Timestamp (Formatted)"
    ]);
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
