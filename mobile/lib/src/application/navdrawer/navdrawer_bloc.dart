import 'dart:async';

import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part 'navdrawer_event.dart';
part 'navdrawer_state.dart';

class NavdrawerBloc extends Bloc<NavdrawerEvent, NavdrawerState> {
  NavdrawerBloc() : super(NavdrawerState.homePage);

  @override
  Stream<NavdrawerState> mapEventToState(
    NavdrawerEvent event,
  ) async* {
    if (event is HomePageEvent) {
      yield NavdrawerState.homePage;
    } else if (event is SamplePageEvent) {
      yield NavdrawerState.testPage;
    }
  }
}
