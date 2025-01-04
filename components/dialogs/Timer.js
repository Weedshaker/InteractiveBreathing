// @ts-check
import Dialog from './Dialog.js'

/**
* @export
* @class Timer
* 
* https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
* @type {CustomElementConstructor}
*/
export default class Timer extends Dialog {
  /** @type {number | null} */
  #timer = null
  constructor (options = {}, ...args) {
    super({...options }, ...args)

    const superShow = this.show
    this.show = async () => {
      this.dispatchEvent(new CustomEvent('timer-show', { bubbles: true, cancelable: true, composed: true }))
      this.show = superShow
      return superShow()
    }

    let lastNumberKey = null
    this.keyupEventListener = event => {
      if (!isNaN(event.key)) {
        if (this.focusSelectEl) {
          event.preventDefault()
          const option = this.selectOption(this.focusSelectEl, lastNumberKey !== null ? `${lastNumberKey}${event.key}` : event.key) || this.selectOption(this.focusSelectEl, event.key)
          lastNumberKey = option?.getAttribute('value').length === 2 ? null : event.key
          this.selectElChangeEventListener(event)
        }
      } else if (event.key === 'c') {
        this.close()
      }
    }

    this.selectElChangeEventListener = event => {
      if (this.hoursEl.value && this.minutesEl.value) {
        this.setTimer(`[${this.hoursEl.value}, ${this.minutesEl.value}]`)
      } else {
        this.resetElClickEventListener()
      }
    }

    this.resetElClickEventListener = event => this.setTimer()
  }

  connectedCallback () {
    if (this.shouldRenderCustomHTML()) this.renderCustomHTML()
    const result = super.connectedCallback()
    this.root.addEventListener('keyup', this.keyupEventListener)
    this.hoursEl.addEventListener('change', this.selectElChangeEventListener)
    this.minutesEl.addEventListener('change', this.selectElChangeEventListener)
    this.resetEl.addEventListener('click', this.resetElClickEventListener)
    return result
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.root.removeEventListener('keyup', this.keyupEventListener)
    this.hoursEl.removeEventListener('change', this.selectElChangeEventListener)
    this.minutesEl.removeEventListener('change', this.selectElChangeEventListener)
    this.resetEl.removeEventListener('click', this.resetElClickEventListener)
  }

  /**
     * evaluates if a render is necessary
     *
     * @return {boolean}
     */
  shouldRenderCustomHTML() {
    return !this.root.querySelector(this.cssSelector + ' > dialog')
  }

  /**
   * renders the css
   */
  renderCSS() {
    const result = super.renderCSS()
    this.setCss(/* css */`
      :host > #show-modal, :host > dialog > #close {
        background: 0;
        cursor: pointer;
        font-weight: bold;
        text-transform: uppercase;
        color: coral;
        transition: color 0.3s ease-out;
      }
      :host([timer-active]) > #show-modal {
        animation: blink 5000ms ease-in-out infinite;
        font-family: monospace;
      }
      :host > dialog > #close {
        border: 0;
      }
      :host > #show-modal:hover, :host > #show-modal:active, :host > #show-modal:focus,
      :host > dialog > #close:hover, :host > dialog > #close:active, :host > dialog > #close:focus,
      :host > dialog > button#reset:hover, :host > dialog > button#reset:active, :host > dialog > button#reset:focus {
        color: darkcyan;
      }
      :host > dialog {
        background-color: var(--background-color);
        scrollbar-color: var(--theme-color) var(--background-color);
        scrollbar-width: thin;
      }
      :host > dialog h2, :host .column {
        color: var(--theme-color);
      }
      :host > dialog > #controls {
        display: flex;
        justify-content: center;
      }
      :host > dialog > #controls > select {
        padding: 0.5em;
        font-size: 5em;
        font-family: monospace;
        border: 2px solid var(--background-color);
        border-radius: 0.3em;
      }
      :host > dialog > #controls > select:focus {
        outline: 5px var(--theme-color) solid;
      }
      :host > dialog > #controls > select#hours:not(:active):not(:focus) {
        text-align: right;
      }
      :host > dialog > button#reset {
        display: none;
        cursor: pointer;
        border: coral 5px solid;
        border-radius: 0.3em;
        background: 0;
        padding: 0.5em;
        color: var(--theme-color);
        font-weight: bolder;
        font-size: 2em;
        transition: color 0.3s ease-out, border-color 0.3s ease-out;
      }
      :host([timer-active]) > dialog > button#reset {
        display: inline;
      }
      :host > dialog > button#reset:hover {
        border-color: var(--theme-color);
      }
      :host .column {
        font-size: 9em;
        font-weight: bolder;
        font-family: monospace;
      }
      :host([timer-active]) .column {
        animation: blink 1000ms ease-in-out infinite;
      }
      @media only screen and (max-width: ${
        // @ts-ignore
        this.getAttribute('mobile-breakpoint') ? this.getAttribute('mobile-breakpoint') : self.Environment && !!self.Environment.mobileBreakpoint ? self.Environment.mobileBreakpoint : '1000px'
      }) {
        :host button {
          font-size: 1em;
        }
      }
      @keyframes blink {
        0%{
          opacity: 1;
        }
        50%{
          opacity: 0;
        }
        100%{
          opacity: 1;
        }
      }
    `, undefined, false)
    return result
  }

  /**
   * Render HTML
   * @returns Promise<void>
   */
  renderCustomHTML() {
    this.html = /* html */`
      <dialog>
        <div id="controls">
          <select id=hours tabindex=0 title=hours>
            <option value="" selected disabled hidden>--</option>
            ${Array.from(Array(24).keys()).reduce((acc, curr) => /* html */`${acc}<option value="${curr}">${String(curr).length === 1 ? `0${curr}` : curr}</option>`, '')}
          </select>
          <span class=column>:</span>
          <select id=minutes tabindex=0 title=minutes>
            <option value="" selected disabled hidden>--</option>
            ${Array.from(Array(60).keys()).reduce((acc, curr) => /* html */`${acc}<option value="${curr}">${String(curr).length === 1 ? `0${curr}` : curr}</option>`, '')}
          </select>
        </div>
        <br>
        <br>
        <button id=reset>Reset</button>
        <br>
        <br>
        <button id="close">close</button>
      </dialog>
      <button id="show-modal">Set Trigger</button>
    `
    let [hours, minutes] = JSON.parse(localStorage.getItem('timer') || '[]')
    if (hours !== undefined) {
      if (!this.selectOption(this.hoursEl, hours)) hours = undefined
    } else {
      this.selectOption(this.hoursEl, (new Date()).getHours())
    }
    if (minutes !== undefined) {
      if (!this.selectOption(this.minutesEl, minutes)) minutes = undefined
    } else {
      this.selectOption(this.minutesEl, (new Date()).getMinutes())
    }
    if (hours !== undefined && minutes !== undefined) this.setTimer(`[${hours}, ${minutes}]`)
    return Promise.resolve()
  }

  selectOption (el, value) {
    let option
    if (option = el.querySelector(`option[value="${value}"]`)) option.selected = true
    return option
  }

  setTimer (value) {
    // @ts-ignore
    clearTimeout(this.#timer)
    if (value) {
      localStorage.setItem('timer', value)
      this.setAttribute('timer-active', '')
      const [hours, minutes] = JSON.parse(value)
      const dateNow = new Date()
      const dateTimer = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), hours, minutes)
      if (dateTimer.valueOf() - dateNow.valueOf() < 1) dateTimer.setDate(dateTimer.getDate() + 1)
      this.#timer = setTimeout(() => {
        this.close()
        this.dispatchEvent(new CustomEvent('timer', { bubbles: true, cancelable: true, composed: true }))
        this.setTimer(value)
      }, dateTimer.valueOf() - dateNow.valueOf())
      const timerTextContent = `@ ${String(hours).length === 1 ? `0${hours}` : hours}:${String(minutes).length === 1 ? `0${minutes}` : minutes}`
      if (document.body.hasAttribute('sounds-unlocked')) {
        this.showNodes.forEach(node => (node.textContent = timerTextContent))
      } else {
        document.body.addEventListener('sounds-unlocked', event => {
          if (this.hasAttribute('timer-active')) this.showNodes.forEach(node => (node.textContent = timerTextContent))
        }, { once: true })
      }
    } else {
      localStorage.removeItem('timer')
      this.removeAttribute('timer-active')
      this.showNodes.forEach(node => (node.textContent = 'Set Trigger'))
    }
  }

  get resetEl () {
    return this.root.querySelector('#reset')
  }

  get controlsEl () {
    return this.root.querySelector('#controls')
  }

  get hoursEl () {
    return this.controlsEl.querySelector('#hours')
  }

  get minutesEl () {
    return this.controlsEl.querySelector('#minutes')
  }

  get focusSelectEl () {
    return this.controlsEl.querySelector('select:focus')
  }
}
