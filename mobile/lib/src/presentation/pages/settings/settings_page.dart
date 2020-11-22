import 'dart:ui';
import 'package:enum_to_string/enum_to_string.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/settings/settings_cubit.dart';
import 'package:polydodo/src/domain/settings/settings.dart';
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
                        _buildDatePickerSettingTile(
                          'Age',
                          'In years',
                          Icons.cake,
                          (datePicked) =>
                              BlocProvider.of<SettingsCubit>(context)
                                  .setAge(datePicked),
                          context,
                          state,
                        ),
                        _buildSelectSettingTile(
                          'Sex',
                          'Your biological sex',
                          Sex.values,
                          Icons.face,
                          (newSex) => BlocProvider.of<SettingsCubit>(context)
                              .setSex(newSex),
                          state,
                        ),
                        _buildServerAdressSettingTile(context, state),
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

SettingsTile _buildSelectSettingTile(
  String title,
  String substitle,
  dynamic settingOptions,
  IconData icon,
  Function(dynamic) onSelected,
  SettingsState state,
) {
  return SettingsTile(
    title: title,
    subtitle: substitle,
    leading: Icon(icon),
    trailing: SettingsPopupMenuButton(
      savedSetting: (state as SettingsLoadSuccess).settings.sex,
      settingOptions: settingOptions,
      onSelected: onSelected,
    ),
  );
}

SettingsTile _buildDatePickerSettingTile(
  String title,
  String subtitle,
  IconData icon,
  Function(dynamic) onDatePicked,
  BuildContext context,
  SettingsState state,
) {
  return SettingsTile(
    title: 'Age',
    subtitle: 'In years',
    leading: Icon(icon),
    trailing: TextButton(
        child: Text(
          (state as SettingsLoadSuccess).settings.age == null
              ? 'Not Set'
              : (state as SettingsLoadSuccess).settings.age.toString(),
        ),
        onPressed: () => _showDatePicker(onDatePicked, context)),
  );
}

void _showDatePicker(
  Function(dynamic) onDatePicked,
  BuildContext context,
) async {
  final datePicked = await showDatePicker(
      context: context,
      initialEntryMode: DatePickerEntryMode.calendar,
      initialDatePickerMode: DatePickerMode.year,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
      helpText: 'Select birthdate');

  if (datePicked != null && datePicked != DateTime.now()) {
    onDatePicked(datePicked);
  }
}

SettingsTile _buildServerAdressSettingTile(
    BuildContext context, SettingsState state) {
  return SettingsTile(
    title: 'Server Address',
    subtitle: 'The url for classification',
    leading: Icon(Icons.dns),
    trailing: Container(
      width: 100,
      child: TextField(
        controller: TextEditingController()
          ..text = (state as SettingsLoadSuccess).settings.serverAddress,
        onSubmitted: (newAdress) {
          try {
            BlocProvider.of<SettingsCubit>(context).setServerAddress(newAdress);
          } on InvalidIPAddressException catch (e) {
            Scaffold.of(context).showSnackBar(SnackBar(
                content: Text(e.cause), duration: Duration(seconds: 3)));
          }
        },
      ),
    ),
  );
}

class SettingsPopupMenuButton<T> extends StatelessWidget {
  SettingsPopupMenuButton({
    Key key,
    @required this.savedSetting,
    @required this.settingOptions,
    @required this.onSelected,
  }) : super(key: key);

  final dynamic savedSetting;
  final List<dynamic> settingOptions;
  final Function(dynamic) onSelected;
  final TextStyle activeStyle = TextStyle(fontWeight: FontWeight.bold);
  final TextStyle defaultStyle = TextStyle();

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton(
      child:
          // ignore: missing_required_param
          TextButton(
        child: Text(
          EnumToString.convertToString(savedSetting, camelCase: true),
        ),
        style: ButtonStyle(
          foregroundColor:
              MaterialStateProperty.all(Theme.of(context).colorScheme.primary),
        ),
      ),
      onSelected: onSelected,
      itemBuilder: (BuildContext context) =>
          _buildPopupItemList(settingOptions),
    );
  }

  List<PopupMenuItem> _buildPopupItemList(List<dynamic> values) {
    return [
      for (var setting
          in values.sublist(1)) // Only starting at 1 cause 0 is 'Not Set'
        PopupMenuItem(
          value: setting,
          child: Text(EnumToString.convertToString(setting, camelCase: true),
              style: savedSetting == setting ? activeStyle : defaultStyle),
        ),
    ];
  }
}
