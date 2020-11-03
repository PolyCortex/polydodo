part of 'record_sleep_guide_page.dart';

class RecordSleepValidatePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Record Sleep')),
      drawer: NavDrawer(activeTab: NavdrawerState.RecordSleep),
      body: BlocConsumer<DataCubit, DataState>(
        listener: (context, state) {
          print(state.runtimeType);
        },
        builder: (context, state) {
          if (state is DataStateInitial) {
            return Center(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    RaisedButton(
                      child: Text('Start'),
                      onPressed: () =>
                          BlocProvider.of<DataCubit>(context).startStreaming(),
                    ),
                  ]),
            );
          else
            return Center(
              child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: <Widget>[
                    RaisedButton(
                      child: Text("Stop"),
                      onPressed: () =>
                          BlocProvider.of<DataCubit>(context).stopStreaming(),
                    ),
                  ]),
            );
          }
        },
      ),
    );
  }
}
