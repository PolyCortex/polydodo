import 'package:flutter/material.dart';
import 'package:flutter_blue/flutter_blue.dart';

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
  List<BluetoothService> _services;
  List<BluetoothCharacteristic> _characteristics;

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
      _services = await device.discoverServices();
    }
    setState(() {
      _connectedDevice = device;
    });
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

  ListView buildListViewOfDevices() {
    return ListView.builder(
        itemCount: widget.devicesList.length,
        itemBuilder: (context, index) {
          return Card(
            child: ListTile(
                onTap: () => connectDevice(widget.devicesList[index]),
                title: Text(widget.devicesList[index].name),
                subtitle: Text(widget.devicesList[index].id.toString())),
          );
        });
  }

  ListView buildListViewOfConnectedDevice() {
    return ListView.builder(
        itemCount: _services.length,
        itemBuilder: (context, index) {
          return Card(
              child: ListTile(
                onTap: () => setState(() => {_characteristics = _services[index].characteristics}),
                title: Text(_services[index].uuid.toString().contains("fe84") ? "YES" : "NO"),
          ));
        });
  }

  ListView buildListViewOfCharacteristics() {
    return ListView.builder(
        itemCount: _characteristics.length,
        itemBuilder: (context, index) {
          return Card(
              child: ListTile(
                title: Text(_characteristics[index].uuid.toString().contains("2d30c082") ? "YES" : "NO"),
          ));
        });
  }

  ListView _buildView() {
    if (_connectedDevice != null) {
      if (_characteristics != null)
        return buildListViewOfCharacteristics();
      else
        return buildListViewOfConnectedDevice();
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
    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.title),
      ),
      body: _buildView(),
    );
  }
}
