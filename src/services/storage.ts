import { IStorageData, IStorageRecode } from '@/interfaces';
import { getUnixTimeOfNow, getUnixTimeOfAfter24h } from '@/services/time';

/**
 * Whether LocalStorage is available in the environment.
 * If LocalStorage is not available, all functions here will not be available.
 * @returns {boolean}
 */
const isAvailable = ():boolean => {
  try {
      const x = '__storage_test__';
      window.localStorage.setItem(x, x);
      window.localStorage.removeItem(x);
      return true;
  } catch (error) {
      return false;
  }
};

const _isAvailable = isAvailable();

if (!_isAvailable) {
  console.warn('LocalStorage is not available in this environment.');
}

/**
 * Get all data.
 * @param {string} wrapKey
 * @returns {(IStorageData | void)}
 */
const getAll = (wrapKey: string): IStorageData | void => {
  if (!_isAvailable) return;
  let result;
  try {
    result = window.localStorage.getItem(wrapKey);
  } catch (error) {
    console.warn(error);
  }
  if (!result) return;
  return window.JSON.parse(result || '{}');
};
/**
 * Get data.
 * @param {string} wrapKey
 * @param {string} key
 * @returns {IStorageRecode}
 */
const get = (wrapKey: string, key: string): IStorageRecode | void => {
  if (!_isAvailable) return;
  return (getAll(wrapKey) || {})[key];
};
/**
 * Set data.
 * @param {string} wrapKey
 * @param {string} key
 * @param {string} value
 * @param {number} [expire=0]
 */
const set = (wrapKey: string, key: string, value: string, expire: number = 0): void => {
  if (!_isAvailable) return;
  if (!wrapKey || !key) return;
  const savedRecode = get(wrapKey, key);
  expire = savedRecode && savedRecode.expire || expire;
  if (!expire) {
    expire = getUnixTimeOfAfter24h();
  }
  const recode: IStorageRecode = {value, expire};
  const data: IStorageData = {[key]: recode};
  try {
    window.localStorage.setItem(wrapKey, window.JSON.stringify({...getAll(wrapKey), ...data}));
  } catch (error) {
    console.warn(error);
  }
};
/**
 * Clean storage data set and set new data.
 * @param {string} wrapKey
 * @param {IStorageData} data
 */
const cleanSetAll = (wrapKey: string, data: IStorageData): void => {
  if (!_isAvailable) return;
  if (!wrapKey || !data) return;
  try {
    window.localStorage.setItem(wrapKey, window.JSON.stringify(data));
  } catch (error) {
    console.warn(error);
  }
};
/**
 * Remove data by key.
 * @param {string} wrapKey
 * @param {string} key
 */
const remove = (wrapKey: string, key: string): void => {
  if (!_isAvailable) return;
  const savedData = getAll(wrapKey) || {};
  delete savedData[key];
  try {
    window.localStorage.setItem(wrapKey, window.JSON.stringify(savedData));
  } catch (error) {
    console.warn(error);
  }
};
/**
 * Remove all data.
 * @param {string} wrapKey
 */
const removeAll = (wrapKey: string): void => {
  if (!_isAvailable) return;
  if (!wrapKey) return;
  try {
    window.localStorage.removeItem(wrapKey);
  } catch (error) {
    console.warn(error);
  }
};
/**
 * Remove expired data.
 * @param {string} wrapKey
 */
const removeHadExpire = (wrapKey: string): void => {
  if (!_isAvailable) return;
  if (!wrapKey) return;
  const newData: IStorageData = {};
  const savedData = getAll(wrapKey) || {};
  Object.keys(savedData).forEach(key => {
    const { expire } = savedData[key];
    if (getUnixTimeOfNow() > expire) return;
    newData[key] = savedData[key];
  });
  cleanSetAll(wrapKey, newData);
};

export default {
  isAvailable,
  get,
  set,
  remove,
  removeAll,
  removeHadExpire,
};
