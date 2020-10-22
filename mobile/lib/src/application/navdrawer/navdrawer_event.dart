part of 'navdrawer_bloc.dart';

abstract class NavdrawerEvent extends Equatable {
  const NavdrawerEvent();
  @override
  List<Object> get props => [];
}

class NavdrawerUpdated extends NavdrawerEvent {
  final NavdrawerState page;

  const NavdrawerUpdated(this.page);

  @override
  List<Object> get props => [page];

  @override
  String toString() => 'NavDrawerUpdated { tab: $page }';
}
