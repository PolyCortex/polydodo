abstract class IEEGDataRepository {
  void createRecordingFromStream(Stream<List<int>> stream);
  void stopRecordingFromStream();

  // todo: implement export and import
  void importData();
  void exportData();
}
