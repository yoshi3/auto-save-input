import storage from '@/services/storage';
import throttle from '@/services/throttle';

/**
 * @class AutoSaveInput
 */
class AutoSaveInput {
  private wrapKey: string;
  private elements: Element[] = [];
  private targets: Map<Element, {
    selector: string,
    expire: number,
  }> = new Map();
  private hookEventName: string = 'input';
  private hasLimitedCalledByInputEvent: boolean = false;
  private limitedCalledByInputEvent: Function;
  /**
   * Creates an instance of AutoSaveInput.
   * @param {string} wrapKey
   * @param {number} delay
   * @memberof AutoSaveInput
   */
  constructor(wrapKey: string, delay: number = 200) {
    this.wrapKey = wrapKey;
    this.limitedCalledByInputEvent = this.CalledByInputEvent;
    if (!storage.isAvailable()) return;
    if (!this.wrapKey) {
      throw new Error('Required parameter is missing');
    }
    if (delay && typeof delay === 'number') {
      this.hasLimitedCalledByInputEvent = true;
      this.limitedCalledByInputEvent = throttle(this.CalledByInputEvent, delay);
    }
  }
  /**
   * Observe element.
   * @private
   * @param {Element} element
   * @returns {void}
   * @memberof AutoSaveInput
   */
  private observe(element: Element): void {
    if (!element) return;
    element.addEventListener(this.hookEventName, this.inputEventListener);
  }
  /**
   * Listen to the event of input.
   * @private
   * @memberof AutoSaveInput
   */
  private inputEventListener = (event: Event): void => {
    if (this.hasLimitedCalledByInputEvent) {
      this.limitedCalledByInputEvent(event);
    } else {
      this.CalledByInputEvent(event);
    }
  }
  /**
   * Called by input event.
   * @private
   * @memberof AutoSaveInput
   */
  private CalledByInputEvent = (event: Event): void => {
    const element = event.target;
    if (
      !(element instanceof HTMLInputElement ||
        element instanceof HTMLTextAreaElement)
    ) {
      return;
    }
    const {value} = element;
    console.log(value);
    const info = this.targets.get(element);
    if (!info) return;
    const {selector, expire} = info;
    if (!selector) return;
    storage.set(this.wrapKey, selector, value, expire);
  }
  /**
   * Recover input value.
   * @private
   * @param {Element} element
   * @returns {void}
   * @memberof AutoSaveInput
   */
  private recover(element: Element): void {
    storage.removeHadExpire(this.wrapKey);
    if (!element) return;
    const info = this.targets.get(element);
    if (!info) return;
    const {selector} = info;
    if (!selector) return;
    const recode = storage.get(this.wrapKey, selector);
    if (recode && recode.value) {
      if (element instanceof HTMLInputElement) {
        element.setAttribute('value', recode.value);
      }
      if (element instanceof HTMLTextAreaElement) {
        element.textContent = recode.value;
      }
    }
  }
  /**
   * Add observation target.
   * @param {string} selector
   * @param {number} [expire=0]
   * @returns {void}
   * @memberof AutoSaveInput
   */
  public add (selector: string, expire: number = 0): void {
    if (!selector) return;
    const element = <Element>window.document.querySelector(selector);
    if (!element) return;
    this.targets.set(element, {selector, expire});
    this.recover(element);
    this.observe(element);
  }
  /**
   * Remove observation target.
   * @param {string} selector
   * @param {number} [expire=0]
   * @returns {void}
   * @memberof AutoSaveInput
   */
  public remove (selector: string): void {
    if (!selector) return;
    let element: Element;
    this.targets.forEach((info, _element) => {
      if (info.selector === selector) {
        element = _element;
      }
    });
    element = element! || <Element>window.document.querySelector(selector);
    if (!element) return;
    this.targets.delete(element)
    this.removeEvent(element);
    this.removeStorage(selector);
  }
  /**
   * Remove event of element.
   * @private
   * @param {Element} element
   * @memberof AutoSaveInput
   */
  private removeEvent (element: Element): void {
    if (!element) return;
    element.removeEventListener(this.hookEventName, this.inputEventListener);
  }
  /**
   * Remove storage data of selector.
   * @private
   * @param {string} selector
   * @memberof AutoSaveInput
   */
  private removeStorage (selector: string): void {
    if (!selector) return;
    storage.remove(this.wrapKey, selector);
  }
  /**
   * Remove all events and all storage data.
   * @memberof AutoSaveInput
   */
  public destroy (): void {
    this.targets.forEach((_info, element) => {
      this.removeEvent(element);
    });
    storage.removeAll(this.wrapKey);
  }
}

export default AutoSaveInput;