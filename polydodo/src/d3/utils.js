export const convertTimestampsToDates = (data) =>
  data.map((row) =>
    Object({
      ...row,
      timestamp: parseTimestampToDate(row.timestamp),
    })
  );

const parseTimestampToDate = (timestamp) => {
  // To convert UNIX timestamp to JS Date, we have to convert number of seconds to milliseconds.
  const date = new Date(timestamp * 1000);
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDay(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
};
