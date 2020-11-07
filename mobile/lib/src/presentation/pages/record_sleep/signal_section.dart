import 'package:flutter/material.dart';
import 'package:polydodo/src/application/eeg_data/data_states.dart';
import 'package:polydodo/src/domain/eeg_data/signal_result.dart';

Container buildSignalSection(var state) {
  var channelOneResult = SignalResult.untested;
  var channelTwoResult = SignalResult.untested;

  if (state is DataStateTestSignalSuccess) {
    channelOneResult = state.channelOneResult;
    channelTwoResult = state.channelTwoResult;
  }

  return Container(
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _buildSignalInformation('Fpz-Cz', channelOneResult),
        _buildSignalInformation('Pz-Oz', channelTwoResult)
      ],
    ),
  );
}

Container _buildSignalInformation(var signalName, var signalResult) {
  return Container(
    padding: const EdgeInsets.all(16),
    child: Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [Text(signalName), _getIcon(signalResult)],
        ),
        _getErrorText(signalResult)
      ],
    ),
  );
}

Icon _getIcon(var signalResult) {
  switch (signalResult) {
    case SignalResult.near_railed:
      return Icon(Icons.warning, color: Colors.yellow[800]);
    case SignalResult.railed:
      return Icon(Icons.error, color: Colors.red);
    case SignalResult.valid:
      return Icon(Icons.check, color: Colors.green);
    default:
      return Icon(Icons.hourglass_empty, color: Colors.blue);
  }
}

Text _getErrorText(var signalResult) {
  switch (signalResult) {
    case SignalResult.near_railed:
      return Text('Electrode is nearly railed');
    case SignalResult.railed:
      return Text('Electrode is railed');
    case SignalResult.valid:
      return Text('Valid Signal');
    default:
      return Text('');
  }
}
