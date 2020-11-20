import 'package:flutter/material.dart';

final theme = ThemeData(
  primaryColor: HexColor('32325D'),
  buttonColor: HexColor('FC7C5F'),
  floatingActionButtonTheme:
      FloatingActionButtonThemeData(backgroundColor: HexColor('FC7C5F')),
  visualDensity: VisualDensity.adaptivePlatformDensity,
);

class HexColor extends Color {
  static int _getColorFromHex(String hexColor) {
    hexColor = hexColor.toUpperCase().replaceAll('#', '');
    if (hexColor.length == 6) {
      hexColor = 'FF' + hexColor;
    }
    return int.parse(hexColor, radix: 16);
  }

  HexColor(final String hexColor) : super(_getColorFromHex(hexColor));
}
