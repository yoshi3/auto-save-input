/**
 * limits your function to be called at every the delay time of milliseconds.
 * It has behavior is the almost same as that of underscore.js.
 * There is only one difference is it bind "this" of outside function.
 * Please see if you want to see the details is: https://underscorejs.org/#throttle
 * @param fnc
 * @param delay
 * @param options
 */
export default (fnc: Function, delay: number, options = {leading: true, trailing: true}): Function => {
  let result: any;
  let timeout: NodeJS.Timeout | null;
  let args: any = null;
  let previous = 0;
  const later = () => {
    previous = !options.leading ? 0 : Date.now();
    timeout = null;
    result = fnc(...args);
    if (!timeout) args = null;
  };
  return (..._args: any) => {
    const now = Date.now();
    if (!previous && !options.leading) previous = now;
    const remaining = delay - (now - previous);
    args = _args;
    if (remaining <= 0 || remaining > delay) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = fnc(...args);
      if (!timeout) args = null;
    } else if (!timeout && options.trailing) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}