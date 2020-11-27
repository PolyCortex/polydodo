import 'package:auto_route/auto_route.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:polydodo/src/application/sleep_sequence/sleep_sequence_cubit.dart';
import 'package:polydodo/src/constants.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_tabs.dart';
import 'package:polydodo/src/presentation/navigation/navdrawer_widget.dart';
import 'package:polydodo/src/presentation/navigation/routes/router.gr.dart';
import 'package:url_launcher/url_launcher.dart';

class RecordSleepGuidePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Record a sleep sequence')),
      drawer: NavDrawer(activeTab: NavdrawerTab.RecordSleep),
      body: PageView(
        children: [
          Container(
            child: Center(
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Padding(
                        padding: const EdgeInsets.symmetric(
                          vertical: 100.0,
                          horizontal: 20,
                        ),
                      ),
                    ],
                  ),
                  _buildSleepGuideCard(context),
                ],
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // todo: Place start validation at last page of guide or skip guide button
          BlocProvider.of<SleepSequenceCubit>(context).startSignalValidation();
          ExtendedNavigator.of(context).replace(Routes.recordSleepValidatePage);
        },
        icon: Icon(Icons.radio_button_checked),
        label: Text('Record'),
      ),
    );
  }
}

void _launchURL() async {
  if (await canLaunch(SETUP_GUIDE_URL)) {
    await launch(SETUP_GUIDE_URL);
  } else {
    throw 'Could not launch $SETUP_GUIDE_URL';
  }
}

Widget _buildSleepGuideCard(BuildContext context) {
  return Container(
    child: InkWell(
      onTap: _launchURL,
      child: Container(
        height: 345.0,
        margin: EdgeInsets.all(10.0),
        width: 400.0,
        child: Stack(
          alignment: Alignment.topCenter,
          children: <Widget>[
            Positioned(
              bottom: 15.0,
              child: Container(
                height: 150.0,
                width: 320.0,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(10.0),
                ),
                child: Padding(
                  padding: EdgeInsets.all(5.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.end,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        'Setup Guide',
                        style: TextStyle(
                          fontSize: 22.0,
                          fontWeight: FontWeight.w600,
                          letterSpacing: 1.2,
                        ),
                      ),
                      Text(
                        "Prior to starting the recording, make sure that you've followed the installation procedures stated in this guide.",
                        style: TextStyle(
                          color: Colors.grey,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                color: Theme.of(context).primaryColor,
                borderRadius: BorderRadius.circular(20.0),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black26,
                    offset: Offset(0.0, 2.0),
                    blurRadius: 6.0,
                  ),
                ],
              ),
              child: Stack(
                children: <Widget>[
                  Hero(
                    tag: 'common/assets/img/Objets.png',
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(20.0),
                      child: Image(
                        height: 250.0,
                        width: 305.0,
                        image: AssetImage('common/assets/img/Objets.png'),
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Positioned(
                    left: 80.0,
                    bottom: 10.0,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: <Widget>[
                        Row(
                          children: <Widget>[
                            Icon(
                              Icons.book,
                              size: 15.0,
                              color: Colors.white,
                            ),
                            SizedBox(width: 5.0),
                            Text(
                              'Tap to open the guide',
                              style: TextStyle(
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            )
          ],
        ),
      ),
    ),
  );
}
