part of 'navdrawer_bloc.dart';

abstract class NavdrawerEvent extends Equatable {
  const NavdrawerEvent();
  @override
  List<Object> get props => [];
}

class HomePageEvent extends NavdrawerEvent {}

class SamplePageEvent extends NavdrawerEvent {}
