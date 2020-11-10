import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/settings/settings_cubit.dart';
import 'package:polydodo/src/application/settings/settings_state.dart';
import 'package:polydodo/src/domain/settings/acquisition_board.dart';
import 'package:polydodo/src/domain/settings/sex.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_tabs.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/widgets/loading_indicator.dart';
import 'package:settings_ui/settings_ui.dart';

class SettingsPage extends StatefulWidget {
  SettingsPage({Key key}) : super(key: key);

  @override
  _SettingsPageState createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Settings')),
      drawer: NavDrawer(activeTab: NavdrawerTab.Settings),
      body: BlocBuilder<SettingsCubit, SettingsState>(
        builder: (context, state) {
          return state is SettingsLoadSuccess
              ? SettingsList(
                  sections: [
                    SettingsSection(
                      title: 'Personnal informations',
                      tiles: [
                        SettingsTile(
                          title: 'Age',
                          subtitle: 'In years',
                          leading: Icon(Icons.cake),
                          trailing: TextButton(
                              child: Text(state.settings.age == null
                                  ? 'Empty'
                                  : state.settings.age.toString()),
                              onPressed: () => _showDatePicker(context)),
                        ),
                        SettingsTile(
                          title: 'Sex',
                          subtitle: 'What is your biological sex',
                          leading: Icon(Icons.face),
                          trailing: _SexButton(
                            savedSex: state.settings.sex,
                            onSelected: (newSex) =>
                                BlocProvider.of<SettingsCubit>(context)
                                    .setSex(newSex),
                            activeStyle: TextStyle(fontWeight: FontWeight.bold),
                            defaultStyle: TextStyle(),
                          ),
                        ),
                        SettingsTile(
                          title: 'Acquisition Board',
                          subtitle: 'What OpenBCI board are you using?',
                          leading: Icon(Icons.memory),
                          trailing: _BoardButton(
                            savedBoard: state.settings.board,
                            onSelected: (newBoard) =>
                                BlocProvider.of<SettingsCubit>(context)
                                    .setBoard(newBoard),
                            activeStyle: TextStyle(fontWeight: FontWeight.bold),
                            defaultStyle: TextStyle(),
                          ),
                        ),
                      ],
                    ),
                  ],
                )
              : LoadingIndicator();
        },
      ),
    );
  }
}

void _showDatePicker(BuildContext context) async {
  final datePicked = await showDatePicker(
      context: context,
      initialEntryMode: DatePickerEntryMode.calendar,
      initialDatePickerMode: DatePickerMode.year,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      helpText: 'Select birthdate');

  if (datePicked != null && datePicked != DateTime.now()) {
    BlocProvider.of<SettingsCubit>(context)
        .setAge(DateTime.now().difference(datePicked).inDays ~/ 365);
  }
}

class _SexButton extends StatelessWidget {
  const _SexButton({
    Key key,
    @required this.onSelected,
    @required this.savedSex,
    @required this.activeStyle,
    @required this.defaultStyle,
  }) : super(key: key);

  final PopupMenuItemSelected<Sex> onSelected;
  final Sex savedSex;
  final TextStyle activeStyle;
  final TextStyle defaultStyle;

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<Sex>(
      child:
          // ignore: missing_required_param
          TextButton(
              child: Text(savedSex.toString().split('.').last),
              style: ButtonStyle(
                  foregroundColor: MaterialStateProperty.all(
                      Theme.of(context).colorScheme.primary))),
      onSelected: onSelected,
      itemBuilder: (BuildContext context) => <PopupMenuItem<Sex>>[
        PopupMenuItem<Sex>(
          value: Sex.Male,
          child: Text(
            'Male',
            style: savedSex == Sex.Male ? activeStyle : defaultStyle,
          ),
        ),
        PopupMenuItem<Sex>(
          value: Sex.Female,
          child: Text(
            'Female',
            style: savedSex == Sex.Female ? activeStyle : defaultStyle,
          ),
        ),
      ],
    );
  }
}

class _BoardButton extends StatelessWidget {
  const _BoardButton({
    Key key,
    @required this.onSelected,
    @required this.savedBoard,
    @required this.activeStyle,
    @required this.defaultStyle,
  }) : super(key: key);

  final PopupMenuItemSelected<AcquisitionBoard> onSelected;
  final AcquisitionBoard savedBoard;
  final TextStyle activeStyle;
  final TextStyle defaultStyle;

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<AcquisitionBoard>(
      child:
          // ignore: missing_required_param
          TextButton(
              child: Text(savedBoard.toString().split('.').last),
              style: ButtonStyle(
                  foregroundColor: MaterialStateProperty.all(
                      Theme.of(context).colorScheme.primary))),
      onSelected: onSelected,
      itemBuilder: (BuildContext context) => <PopupMenuItem<AcquisitionBoard>>[
        PopupMenuItem<AcquisitionBoard>(
          value: AcquisitionBoard.Cython,
          child: Text(
            'Cython',
            style: savedBoard == AcquisitionBoard.Cython
                ? activeStyle
                : defaultStyle,
          ),
        ),
        PopupMenuItem<AcquisitionBoard>(
          value: AcquisitionBoard.Ganglion,
          child: Text(
            'Ganglion',
            style: savedBoard == AcquisitionBoard.Ganglion
                ? activeStyle
                : defaultStyle,
          ),
        ),
      ],
    );
  }
}
