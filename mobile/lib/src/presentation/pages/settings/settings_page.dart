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
                        SettingsTile(
                          title: 'Age',
                          subtitle: 'In years',
                          leading: Icon(Icons.cake),
                          trailing: TextButton(
                              child: Text(state.settings[AGEKEY] == null
                                  ? 'Not Set'
                                  : state.settings[AGEKEY].toString()),
                              onPressed: () => _showDatePicker(context)),
                        ),
                        SettingsTile(
                          title: 'Sex',
                          subtitle: 'Your biological sex',
                          leading: Icon(Icons.face),
                          trailing: SettingsPopupMenuButton(
                            savedSetting: state.settings[SEXKEY],
                            settingEnum: Sex,
                          ),
                        ),
                        SettingsTile(
                          title: 'Acquisition Board',
                          subtitle: 'Your OpenBCI board',
                          leading: Icon(Icons.memory),
                          trailing: SettingsPopupMenuButton(
                            savedSetting: state.settings[BOARDKEY],
                            settingEnum: AcquisitionBoard,
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
    await BlocProvider.of<SettingsCubit>(context).setSetting(
        AGEKEY, DateTime.now().difference(datePicked).inDays ~/ 365);
  }
}

class SettingsPopupMenuButton extends StatelessWidget {
  SettingsPopupMenuButton({
    Key key,
    @required this.savedSetting,
    @required this.settingEnum,
  }) : super(key: key);

  final dynamic savedSetting;
  final dynamic settingEnum;
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
      onSelected: (savedSetting) => BlocProvider.of<SettingsCubit>(context)
          .setSetting(savedSetting.toString().split('.').first, savedSetting),
      itemBuilder: (BuildContext context) => _buildPopupItemList(settingEnum),
    );
  }

  List<PopupMenuItem<T>> _buildPopupItemList<T>(dynamic settingEnum) {
    return [
      for (var setting in settingEnum.values
          .sublist(1)) // Only starting at 1 cause 0 is 'Not Set'
        PopupMenuItem<T>(
          value: setting,
          child: Text(EnumToString.convertToString(setting, camelCase: true),
              style: savedSetting == setting ? activeStyle : defaultStyle),
        ),
    ];
  }
}
