import { NOT_BOOTSTRAPPED, BOOTSTRAPPING, NOT_MOUNTED, SKIP_BECAUSE_BROKEN } from '../applications/app.helpers.js';
import { reasonableTime } from '../applications/timeouts.js';
import { handleAppError, transformErr } from '../applications/app-errors.js';
import { getProps } from './prop.helpers.js'

export function toBootstrapPromise(appOrParcel, hardFail = false) {
  return Promise.resolve().then(() => {
    console.log('挂载挂载挂载挂载')
    if (appOrParcel.status !== NOT_BOOTSTRAPPED) {
      return appOrParcel;
    }

    appOrParcel.status = BOOTSTRAPPING;

    return reasonableTime(appOrParcel.bootstrap(getProps(appOrParcel)), `Bootstrapping appOrParcel '${appOrParcel.name}'`, appOrParcel.timeouts.bootstrap)
      .then(() => {
        console.log('挂载成功成功成功')
        appOrParcel.status = NOT_MOUNTED;
        return appOrParcel;
      })
      .catch(err => {
        appOrParcel.status = SKIP_BECAUSE_BROKEN;
        if (hardFail) {
          const transformedErr = transformErr(err, appOrParcel)
          throw transformedErr
        } else {
          handleAppError(err, appOrParcel);
          return appOrParcel;
        }
      })
  })
}
