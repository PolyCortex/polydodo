import { SERVER_URL } from './constants';
import Axios from 'axios-observable';
import { catchError, exhaustMap, map } from 'rxjs/operators';
import { timer, of } from 'rxjs';

const pingServer = () =>
  Axios.get(SERVER_URL).pipe(
    map(() => true),
    catchError(() => of(false)),
  );

export const periodicPingServer = (period) => timer(0, period).pipe(exhaustMap(pingServer));
