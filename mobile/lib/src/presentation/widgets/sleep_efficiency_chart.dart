import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import 'package:polydodo/src/domain/sleep_sequence/sleep_sequence.dart';

class SleepEfficiencyChart extends StatefulWidget {
  final List<SleepSequence> data;
  SleepEfficiencyChart(this.data);

  @override
  _SleepEfficiencyChartState createState() =>
      _SleepEfficiencyChartState(extractEfficiencyHistory());

  List<FlSpot> extractEfficiencyHistory() {
    var index = 0;
    return data
        .map((e) => FlSpot((index++).toDouble(), e.metrics.sleepEfficiency))
        .toList();
  }
}

class _SleepEfficiencyChartState extends State<SleepEfficiencyChart> {
  List<FlSpot> data;
  _SleepEfficiencyChartState(this.data);

  List<Color> gradientColors = [
    const Color(0xff23b6e6),
    const Color(0xff02d39a),
  ];

  bool isShowingMainData = true;

  @override
  void initState() {
    super.initState();
    isShowingMainData = true;
  }

  @override
  Widget build(BuildContext context) {
    return AspectRatio(
      aspectRatio: 1.23,
      child: Container(
        decoration: const BoxDecoration(
          borderRadius: BorderRadius.all(Radius.circular(18)),
          gradient: LinearGradient(
            colors: [
              Color(0xff2c274c),
              Color(0xff46426c),
            ],
            begin: Alignment.bottomCenter,
            end: Alignment.topCenter,
          ),
        ),
        child: Stack(
          children: <Widget>[
            Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: <Widget>[
                const SizedBox(
                  height: 8,
                ),
                // const Text(
                //   'Unfold Shop 2018',
                //   style: TextStyle(
                //     color: Color(0xff827daa),
                //     fontSize: 16,
                //   ),
                //   textAlign: TextAlign.center,
                // ),
                // const SizedBox(
                //   height: 4,
                // ),
                Padding(
                  padding: const EdgeInsets.only(top: 5.0),
                  child: const Text(
                    'Sleep Efficiency',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 23,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 2),
                    textAlign: TextAlign.center,
                  ),
                ),
                const SizedBox(
                  height: 20,
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(right: 22.0, left: 6.0),
                    child: LineChart(
                      isShowingMainData ? mainData() : avgData(),
                      swapAnimationDuration: const Duration(milliseconds: 250),
                    ),
                  ),
                ),
                const SizedBox(
                  height: 15,
                ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.only(left: 8),
              child: IconButton(
                icon: Icon(
                  Icons.equalizer,
                  color:
                      Colors.white.withOpacity(isShowingMainData ? 1.0 : 0.5),
                ),
                onPressed: () {
                  setState(() {
                    isShowingMainData = !isShowingMainData;
                  });
                },
              ),
            )
          ],
        ),
      ),
    );
  }

  LineChartData mainData() {
    return LineChartData(
      gridData: FlGridData(
        show: true,
        drawVerticalLine: true,
        horizontalInterval: 0.1,
        getDrawingHorizontalLine: (value) {
          return FlLine(
            color: const Color(0xff37434d),
            strokeWidth: 1.5,
          );
        },
        getDrawingVerticalLine: (value) {
          return FlLine(
            color: const Color(0xff37434d),
            strokeWidth: 1,
          );
        },
      ),
      axisTitleData: FlAxisTitleData(
          //     leftTitle: AxisTitle(
          //       showTitle: true,
          //       titleText: 'Efficiency',
          //     ),
          bottomTitle: AxisTitle(titleText: 'Sleep sequences')),
      titlesData: FlTitlesData(
        show: true,
        bottomTitles: SideTitles(
          showTitles: true,
          reservedSize: 22,
          getTextStyles: (value) => const TextStyle(
              color: Color(0xff68737d),
              fontWeight: FontWeight.bold,
              fontSize: 16),
          getTitles: (value) {
            if (value.toInt() % 2 == 0) {
              return value.ceil().toString();
            }
            return '';
          },
          margin: 8,
        ),
        leftTitles: SideTitles(
          showTitles: true,
          getTextStyles: (value) => const TextStyle(
            color: Color(0xff67727d),
            fontWeight: FontWeight.bold,
            fontSize: 15,
          ),
          interval: 0.25,
          getTitles: (value) {
            if (value * 100 % 25 == 0) {
              return (value * 100).ceil().toString() + ' %';
            }
            return '';
          },
          reservedSize: 45,
          margin: 12,
        ),
      ),
      borderData: FlBorderData(
          show: true,
          border: Border.all(color: const Color(0xff37434d), width: 1)),
      minX: 0,
      maxX: data.length.toDouble() - 1,
      minY: 0,
      maxY: 0.9,
      lineBarsData: [
        LineChartBarData(
          spots: data,
          isCurved: true,
          colors: gradientColors,
          barWidth: 5,
          isStrokeCapRound: true,
          dotData: FlDotData(
            show: false,
          ),
          belowBarData: BarAreaData(
            show: true,
            colors:
                gradientColors.map((color) => color.withOpacity(0.3)).toList(),
          ),
        ),
      ],
    );
  }

  LineChartData avgData() {
    return LineChartData(
      lineTouchData: LineTouchData(enabled: false),
      gridData: FlGridData(
        show: true,
        drawVerticalLine: true,
        horizontalInterval: 0.1,
        getDrawingHorizontalLine: (value) {
          return FlLine(
            color: const Color(0xff37434d),
            strokeWidth: 1.5,
          );
        },
        getDrawingVerticalLine: (value) {
          return FlLine(
            color: const Color(0xff37434d),
            strokeWidth: 1,
          );
        },
      ),
      titlesData: FlTitlesData(
        show: true,
        bottomTitles: SideTitles(
          showTitles: true,
          reservedSize: 22,
          getTextStyles: (value) => const TextStyle(
              color: Color(0xff68737d),
              fontWeight: FontWeight.bold,
              fontSize: 16),
          getTitles: (value) {
            if (value.toInt() % 2 == 0) {
              return value.ceil().toString();
            }
            return '';
          },
          margin: 8,
        ),
        leftTitles: SideTitles(
          showTitles: true,
          getTextStyles: (value) => const TextStyle(
            color: Color(0xff67727d),
            fontWeight: FontWeight.bold,
            fontSize: 15,
          ),
          interval: 0.25,
          getTitles: (value) {
            if (value * 100 % 25 == 0) {
              return (value * 100).ceil().toString() + ' %';
            }
            return '';
          },
          reservedSize: 45,
          margin: 12,
        ),
      ),
      borderData: FlBorderData(
          show: true,
          border: Border.all(color: const Color(0xff37434d), width: 1)),
      minX: 0,
      maxX: data.length.toDouble() - 1,
      minY: 0,
      maxY: 0.9,
      lineBarsData: [
        LineChartBarData(
          spots: [
            FlSpot(0, 0.47),
            FlSpot(1.0, 0.47),
            FlSpot(2, 0.47),
            FlSpot(3, 0.47),
            FlSpot(4, 0.47),
            FlSpot(6, 0.47),
          ],
          isCurved: true,
          colors: [
            ColorTween(begin: gradientColors[0], end: gradientColors[1])
                .lerp(0.2),
            ColorTween(begin: gradientColors[0], end: gradientColors[1])
                .lerp(0.2),
          ],
          barWidth: 5,
          isStrokeCapRound: true,
          dotData: FlDotData(
            show: false,
          ),
          belowBarData: BarAreaData(show: true, colors: [
            ColorTween(begin: gradientColors[0], end: gradientColors[1])
                .lerp(0.2)
                .withOpacity(0.1),
            ColorTween(begin: gradientColors[0], end: gradientColors[1])
                .lerp(0.2)
                .withOpacity(0.1),
          ]),
        ),
      ],
    );
  }
}
