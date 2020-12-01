import 'package:flutter/material.dart';
import 'package:polydodo/src/application/sleep_sequence/sleep_sequence_acquisition_states.dart';
import 'package:polydodo/src/domain/sleep_sequence/signal_result.dart';

Container buildSignalSection(var state) {
  var fpzCzChannelResult = SignalResult.invalid;
  var pzOzChannelResult = SignalResult.invalid;

  if (state is SleepSequenceAcquisitionTestSignalInProgress ||
      state is SleepSequenceAcquisitionTestSignalSuccess) {
    fpzCzChannelResult = state.fpzCzChannelResult;
    pzOzChannelResult = state.pzOzChannelResult;
  }

  return Container(
    child: Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        _buildSignalInformation('Fpz-Cz', fpzCzChannelResult),
        _buildSignalInformation('Pz-Oz', pzOzChannelResult)
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

Widget _getIcon(var signalResult) {
  switch (signalResult) {
    case SignalResult.near_railed:
      return Icon(Icons.warning, color: Colors.yellow[800]);
    case SignalResult.railed:
      return Icon(Icons.error, color: Colors.red);
    case SignalResult.untested:
      return Icon(Icons.hourglass_empty, color: Colors.blue);
    default:
      return Container();
  }
}

Text _getErrorText(var signalResult) {
  switch (signalResult) {
    case SignalResult.near_railed:
      return Text('Electrode is nearly railed');
    case SignalResult.railed:
      return Text('Electrode is railed');
    case SignalResult.good:
      return Text('Valid Signal');
    default:
      return Text('');
  }
}
