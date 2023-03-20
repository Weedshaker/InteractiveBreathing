// @ts-check

/* global HTMLElement */
/* global localStorage */

/**
 * @typedef {{ [key: number]: string[] } | {}} TimeObject
 */

/**
 * @typedef {{ time: string }} SetTimeDetail
 */

/**
 * @typedef {{ resolve: (TimeObject) => void }} GetTimesDetail
 */

/**
 * @typedef {{ time: string, date: string, resolve?: (times: TimeObject) => void }} RemoveTimeDetail
 */

/**
 * @typedef {{ resolve?: (times: TimeObject) => void }} UndoTimeDetail
 */

/**
 * As a controller, this component becomes a store and organizes events
 * answers promise resolve on 'getTimes'
 *
 * @export
 * @class Comments
 */
export default class Comments extends HTMLElement {
  constructor () {
    super()

    /** @type {string | null} */
    let lastTimes = null

    /**
     * Listens to the event name/typeArg: 'setTime'
     *
     * @param {CustomEvent & {detail: SetTimeDetail}} event
     * @return {void}
     */
    this.setTimeListener = event => {
      if (event && event.detail && event.detail.time) {
        let times = this.getTimesListener()
        const key = new Intl.DateTimeFormat(navigator.language).format(Date.now())
        key in times ? times[key].push(event.detail.time) : times = Object.assign(times, { [key]: [event.detail.time] })
        localStorage.setItem('times', JSON.stringify(times))
      }
    }

    /**
     * Listens to the event name/typeArg: 'getTimes'
     *
     * @param {CustomEvent & {detail: GetTimesDetail} | null} [event=null]
     * @return {TimeObject}
     */
    this.getTimesListener = (event = null) => {
      let times = {}
      try {
        times = JSON.parse(localStorage.getItem('times') || '{}')
      } catch (e) {
        console.error('Your localStorage times are brocken, please clear your localStorage with the command: "localStorage.removeItem(\'times\')"')
      }
      if (event && event.detail && typeof event.detail.resolve === 'function') event.detail.resolve(times)
      return times
    }

    /**
     * Listens to the event name/typeArg: 'removeTime'
     *
     * @param {CustomEvent & {detail: RemoveTimeDetail}} event
     * @return {void}
     */
    this.removeTimeListener = event => {
      if (event && event.detail && event.detail.date && event.detail.time) {
        let times = this.getTimesListener()
        const key = event.detail.date
        if (key in times) {
          lastTimes = JSON.stringify(times)
          times[key].splice(times[key].indexOf(event.detail.time), 1)
          if (!times[key].length) delete times[key]
          localStorage.setItem('times', JSON.stringify(times))
        }
        if (typeof event.detail.resolve == 'function') event.detail.resolve(times)
      }
    }

    /**
     * Listens to the event name/typeArg: 'undoTime'
     *
     * @param {CustomEvent & {detail: UndoTimeDetail}} event
     * @return {void}
     */
    this.undoTimeListener = event => {
      if (lastTimes) {
        localStorage.setItem('times', lastTimes)
        if (event && event.detail && typeof event.detail.resolve == 'function') event.detail.resolve(JSON.parse(lastTimes))
        lastTimes = null
      }
    }
  }

  connectedCallback () {
 // @ts-ignore
     // @ts-ignore
    this.addEventListener('setTime', this.setTimeListener)
     // @ts-ignore
    this.addEventListener('getTimes', this.getTimesListener)
     // @ts-ignore
    this.addEventListener('removeTime', this.removeTimeListener)
    // @ts-ignore
    this.addEventListener('undoTime', this.undoTimeListener)
  }

  disconnectedCallback () {
     // @ts-ignore
    this.removeEventListener('setTime', this.setTimeListener)
     // @ts-ignore
    this.removeEventListener('getTimes', this.getTimesListener)
     // @ts-ignore
    this.removeEventListener('removeTime', this.removeTimeListener)
    // @ts-ignore
    this.removeEventListener('undoTime', this.undoTimeListener)
  }
}
