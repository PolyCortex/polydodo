import 'dart:ui';
import 'package:enum_to_string/enum_to_string.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/settings/settings_cubit.dart';
import 'package:polydodo/src/common/constants.dart';
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
                            AGEKEY, 'In years', Icons.cake, context, state),
                        _buildSexSettingTile(SEXKEY, Sex.values,
                            'Your biological sex', Icons.face, state),
                        _buildServerAdressSettingTile(
                            SERVERADRESSKEY,
                            'The url for classification',
                            Icons.dns,
                            context,
                            state),
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

SettingsTile _buildSexSettingTile(String settingKey, dynamic settingOptions,
    String substitle, IconData icon, SettingsState state) {
  return SettingsTile(
    title: settingKey,
    subtitle: substitle,
    leading: Icon(icon),
    trailing: SettingsPopupMenuButton(
        savedSetting: (state as SettingsLoadSuccess).settings.sex,
        settingOptions: settingOptions),
  );
}

SettingsTile _buildDatePickerSettingTile(String title, String substitle,
    IconData icon, BuildContext context, SettingsState state) {
  return SettingsTile(
    title: AGEKEY,
    subtitle: 'In years',
    leading: Icon(Icons.cake),
    trailing: TextButton(
        child: Text(
          (state as SettingsLoadSuccess).settings.age == null
              ? 'Not Set'
              : (state as SettingsLoadSuccess).settings.age.toString(),
        ),
        onPressed: () => _showDatePicker(context)),
  );
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
    await BlocProvider.of<SettingsCubit>(context).setSetting(
        AGE_KEY, DateTime.now().difference(datePicked).inDays ~/ 365);
  }
}

SettingsTile _buildServerAdressSettingTile(String settingKey, String subtitle,
    IconData icon, BuildContext context, SettingsState state) {
  return SettingsTile(
    title: settingKey,
    subtitle: subtitle,
    leading: Icon(icon),
    trailing: Container(
      width: 100,
      child: TextField(
        controller: TextEditingController()
          ..text = (state as SettingsLoadSuccess).settings.serverAdress,
        onSubmitted: (newText) => BlocProvider.of<SettingsCubit>(context)
            .setSetting(settingKey, newText),
      ),
    ),
  );
}

class SettingsPopupMenuButton<T> extends StatelessWidget {
  SettingsPopupMenuButton({
    Key key,
    @required this.savedSetting,
    @required this.settingOptions,
  }) : super(key: key);

  final dynamic savedSetting;
  final List<dynamic> settingOptions;
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
      onSelected: (newSetting) => BlocProvider.of<SettingsCubit>(context)
          .setSetting(newSetting.toString().split('.').first, newSetting),
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
