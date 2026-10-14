/* COPYRIGHT Esri - https://js.arcgis.com/5.2/LICENSE.txt */
import { a as p, L as y, c as v, l as x, s as S, b as g, d as R } from "./index.js";
import { i as E } from "./isEqual.js";
import { d as l, a as h, n as c, p as d, g as D, b as o, s as m, c as f, i as u } from "./date.js";
import { n as b, g as C } from "./locale.js";
import { u as z } from "./useT9n.js";
import { u as k } from "./useFocusable.js";
import { g as A, a as $, b as M, c as P } from "./utils2.js";
const w = 2, U = { dateStyle: "full" }, F = {
  container: "container"
}, O = p`:host{box-sizing:border-box;background-color:var(--calcite-theme-color-surface-2, var(--calcite-color-foreground-1));color:var(--calcite-color-text-2);font-size:var(--calcite-font-size--1)}:host *{box-sizing:border-box}:host{display:inline-block;inline-size:100%;overflow:visible;border-width:1px;border-style:solid;vertical-align:top;border-color:var(--calcite-date-picker-border-color, var(--calcite-color-border-3));border-radius:var(--calcite-date-picker-corner-radius, var(--calcite-corner-radius))}:host([scale=s]){inline-size:236px;min-inline-size:216px;max-inline-size:380px}:host([scale=s][range][layout=horizontal][calendars="2"]){inline-size:480px;min-inline-size:432px;max-inline-size:772px}:host([scale=m]){inline-size:298px;min-inline-size:272px;max-inline-size:480px}:host([scale=m][layout=horizontal][range][calendars="2"]){inline-size:608px;min-inline-size:544px;max-inline-size:972px}:host([scale=l]){inline-size:334px;min-inline-size:320px;max-inline-size:600px}:host([scale=l][layout=horizontal][range][calendars="2"]){inline-size:684px;min-inline-size:640px;max-inline-size:1212px}.container{outline:2px solid transparent;outline-offset:2px}:host([hidden]){display:none}[hidden]{display:none}`;
class L extends y {
  constructor() {
    super(), this.rangeValueChangedByUser = !1, this.messages = z({ blocking: !0 }), this.focusSetter = k()(this), this.calendars = 2, this.layout = "horizontal", this.monthStyle = "wide", this.proximitySelectionDisabled = !1, this.range = !1, this.scale = "m", this.calciteDatePickerChange = v({ cancelable: !1 }), this.calciteDatePickerRangeChange = v({ cancelable: !1 }), this.listen("keydown", this.keyDownHandler);
  }
  static {
    this.properties = { activeEndDate: 16, activeStartDate: 16, dateTimeFormat: 16, hoverRange: 16, localeData: 16, activeDate: 0, activeRange: 3, calendars: 11, headingLevel: 11, layout: 3, max: 3, maxAsDate: 0, messageOverrides: 0, min: 3, minAsDate: 0, monthStyle: 1, numberingSystem: 3, proximitySelectionDisabled: 7, range: 7, scale: 3, value: 1, valueAsDate: 0 };
  }
  static {
    this.styles = O;
  }
  async reset() {
    this.resetActiveDates(), this.rangeValueChangedByUser = !1;
  }
  async setFocus(e) {
    return this.focusSetter(() => this.el, e);
  }
  async load() {
    await this.loadLocaleData();
  }
  willUpdate(e) {
    const t = e.get("valueAsDate"), a = this.valueAsDate, i = this.rangeValueChangedByUser && !e.has("value") && this.range && E(t, a), s = e.has("value") && e.has("valueAsDate");
    this.rangeValueChangedByUser && !s && !i && (this.rangeValueChangedByUser = !1), e.has("value") && this.valueHandler(this.value), e.has("valueAsDate") && this.valueAsDateWatcher(this.valueAsDate), i && (this.rangeValueChangedByUser = !1);
    const n = A(e, "min"), r = A(e, "max");
    n === "min" ? this.minAsDate = this.min ? l(this.min) : void 0 : n === "minAsDate" && (this.minAsDate = l(h(this.minAsDate))), r === "max" ? this.maxAsDate = this.max ? l(this.max) : void 0 : r === "maxAsDate" && (this.maxAsDate = l(h(this.maxAsDate))), (e.has("range") && this.range || e.has("maxAsDate") || e.has("minAsDate")) && this.setActiveStartAndEndDates(), e.has("activeDate") && this.hasUpdated && this.activeDateWatcher(this.activeDate), e.has("messages") && this.hasUpdated && this.loadLocaleData().catch(x.error);
  }
  activeDateWatcher(e) {
    this.range && (e ? (this.activeStartDate = e, this.activeEndDate = c(this.activeStartDate)) : this.resetActiveDates());
  }
  valueHandler(e) {
    Array.isArray(e) ? (this.valueAsDate = e.every((t) => t === "") ? void 0 : $(e), this.rangeValueChangedByUser || this.resetActiveDates()) : e ? this.valueAsDate = l(e) : (this.valueAsDate = void 0, this.resetActiveDates());
  }
  valueAsDateWatcher(e) {
    this.range && Array.isArray(e) && !this.rangeValueChangedByUser ? this.setActiveStartAndEndDates() : this.range || (e && e !== this.activeDate ? this.activeDate = e : e || this.resetActiveDates());
  }
  keyDownHandler(e) {
    e.key === "Escape" && this.resetActiveDates();
  }
  async loadLocaleData() {
    const e = M(this.messages._lang);
    b.numberFormatOptions = {
      numberingSystem: this.numberingSystem,
      locale: e,
      useGrouping: !1
    }, this.localeData = await P(e), this.dateTimeFormat = C(e, U);
  }
  monthHeaderSelectChange(e) {
    const t = new Date(e.detail.date), a = e.detail.position;
    this.range ? a === "end" ? (this.activeEndDate = t, this.activeStartDate = d(t)) : (this.activeStartDate = t, this.activeEndDate = c(t)) : this.activeDate = t, e.stopPropagation();
  }
  monthActiveDateChange(e) {
    const t = new Date(e.detail);
    if (!this.range)
      this.activeDate = t;
    else {
      const a = t.getMonth(), i = a !== this.activeStartDate?.getMonth() && (this.calendars === 1 || (this.activeStartDate ? a !== c(this.activeStartDate).getMonth() : !1));
      this.activeRange === "end" ? (!this.activeEndDate || this.activeStartDate && i) && (this.activeEndDate = t, this.activeStartDate = d(t)) : (this.activeStartDate && i || !this.activeStartDate) && (this.activeStartDate = t, this.activeEndDate = c(t));
    }
    e.stopPropagation();
  }
  monthHoverChange(e) {
    if (!this.range) {
      this.hoverRange = void 0;
      return;
    }
    const { valueAsDate: t } = this, a = Array.isArray(t) ? t[0] : void 0, i = Array.isArray(t) ? t[1] : void 0, s = new Date(e.detail);
    if (this.hoverRange = {
      focused: this.activeRange || "start",
      start: a,
      end: i
    }, this.proximitySelectionDisabled)
      i && a || !i && a && s >= a ? (this.hoverRange.focused = "end", this.hoverRange.end = s) : !i && a && s < a ? this.hoverRange = {
        focused: "start",
        start: s,
        end: a
      } : this.hoverRange = void 0;
    else if (this.activeRange && this.hoverRange)
      this.activeRange === "end" ? (this.hoverRange.end = s, this.hoverRange.focused = "end") : (this.hoverRange.start = s, this.hoverRange.focused = "start");
    else if (a && i) {
      const n = Math.abs(D(s, a)), r = Math.abs(D(s, i));
      s > i ? (this.hoverRange.end = s, this.hoverRange.focused = "end") : s < a ? (this.hoverRange.start = s, this.hoverRange.focused = "start") : s > a && s < i && (n < r ? (this.hoverRange.start = s, this.hoverRange.focused = "start") : (this.hoverRange.end = s, this.hoverRange.focused = "end"));
    } else
      a && (s < a ? this.hoverRange = {
        focused: "start",
        start: s,
        end: a
      } : (this.hoverRange.end = s, this.hoverRange.focused = "end"));
    e.stopPropagation();
  }
  monthMouseOutChange(e) {
    this.hoverRange && (this.hoverRange = void 0), e.stopPropagation();
  }
  resetActiveDates() {
    const { valueAsDate: e } = this;
    if (!Array.isArray(e)) {
      if (e && e !== this.activeDate)
        this.activeDate = new Date(e);
      else if (!e) {
        this.activeDate = void 0;
        const t = this.getActiveDate(void 0, this.minAsDate, this.maxAsDate);
        this.range ? (this.activeStartDate = t, this.activeEndDate = void 0) : this.activeDate = t;
      }
    }
    Array.isArray(e) && (e[0] && e[0] !== this.activeStartDate ? this.activeStartDate = new Date(e[0]) : e[0] || (this.activeStartDate = this.getActiveDate(void 0, this.minAsDate, this.maxAsDate)), e[1] && e[1] !== this.activeEndDate ? this.activeEndDate = new Date(e[1]) : e[1] || (this.activeEndDate = void 0)), this.hoverRange = void 0;
  }
  getEndDate() {
    return Array.isArray(this.valueAsDate) && this.valueAsDate[1] || void 0;
  }
  setEndDate(e, t = !0) {
    const a = this.getStartDate();
    this.rangeValueChangedByUser = !0, this.value = [h(a), h(e)], this.valueAsDate = [a, e], t && this.calciteDatePickerRangeChange.emit();
  }
  getStartDate() {
    return Array.isArray(this.valueAsDate) && this.valueAsDate[0] || void 0;
  }
  setStartDate(e, t = !0) {
    const a = this.getEndDate();
    this.rangeValueChangedByUser = !0, this.value = [h(e), h(a)], this.valueAsDate = [e, a], t && this.calciteDatePickerRangeChange.emit();
  }
  monthDateChange(e) {
    const t = new Date(e.detail), a = h(t);
    if (!this.range && a === h(this.valueAsDate))
      return;
    if (!this.range) {
      this.value = a || "", this.valueAsDate = t || void 0, this.activeDate = t || void 0, this.calciteDatePickerChange.emit();
      return;
    }
    const i = this.getStartDate(), s = this.getEndDate();
    if (!i || !s && t < i)
      i && this.setEndDate(new Date(i)), this.activeRange == "end" ? this.setEndDate(t) : this.setStartDate(t);
    else if (!s)
      this.setEndDate(t);
    else if (this.proximitySelectionDisabled)
      this.setStartDate(t, !1), this.setEndDate(void 0, !1), this.calciteDatePickerRangeChange.emit();
    else if (this.activeRange)
      this.activeRange == "end" ? this.setEndDate(t) : (t > s && (this.setEndDate(void 0, !1), this.activeEndDate = void 0), this.setStartDate(t));
    else {
      const n = D(t, i), r = D(t, s);
      r === 0 || n < 0 ? this.setStartDate(t) : n === 0 || r < 0 ? this.setEndDate(t) : n < r ? this.setStartDate(t) : this.setEndDate(t);
    }
    e.stopPropagation(), this.calciteDatePickerChange.emit();
  }
  getActiveDate(e, t, a) {
    const i = o(/* @__PURE__ */ new Date(), t, a);
    return o(this.activeDate, t, a) || e || (m(a, i) && !this.range ? f(i, t, a) : i);
  }
  getActiveEndDate(e, t, a) {
    return o(this.activeEndDate, t, a) || e || o(c(/* @__PURE__ */ new Date()), t, a);
  }
  setActiveStartAndEndDates() {
    if (this.range) {
      const e = o(Array.isArray(this.valueAsDate) ? this.valueAsDate[0] : this.valueAsDate, this.minAsDate, this.maxAsDate), t = o(Array.isArray(this.valueAsDate) ? this.valueAsDate[1] : void 0, this.minAsDate, this.maxAsDate);
      if (this.activeStartDate = this.getActiveDate(e, this.minAsDate, this.maxAsDate), this.activeEndDate = this.getActiveEndDate(t, this.minAsDate, this.maxAsDate), m(this.activeStartDate, this.activeEndDate)) {
        const a = f(this.activeEndDate ? d(this.activeEndDate) : void 0, this.minAsDate, this.maxAsDate), i = this.activeEndDate ? c(this.activeEndDate) : void 0;
        u(a, this.minAsDate, this.maxAsDate) ? this.activeStartDate = a : u(i, this.minAsDate, this.maxAsDate) && (this.activeEndDate = i);
      }
    }
  }
  render() {
    const e = o(this.range && Array.isArray(this.valueAsDate) ? this.valueAsDate[0] : this.valueAsDate, this.minAsDate, this.maxAsDate), t = this.getActiveDate(e, this.minAsDate, this.maxAsDate), a = this.range && Array.isArray(this.valueAsDate) ? o(this.valueAsDate[1], this.minAsDate, this.maxAsDate) : void 0, i = this.range && this.activeRange ? this.activeRange === "start" ? this.minAsDate : e : this.minAsDate, s = this.range ? this.activeStartDate : t;
    return g`<div aria-hidden class=${S(F.container)} tabindex=-1>${this.renderMonth(s, this.maxAsDate, i, e, a)}</div>`;
  }
  renderMonth(e, t, a, i, s) {
    return g`<calcite-date-picker-month .activeDate=${e} .calendars=${this.calendars} .dateTimeFormat=${this.dateTimeFormat} .endDate=${this.range ? s : void 0} .headingLevel=${this.headingLevel || w} .hoverRange=${this.hoverRange} .layout=${this.layout} .localeData=${this.localeData} .max=${t} .messages=${this.messages} .min=${a} .monthStyle=${this.monthStyle} @calciteInternalDatePickerDayHover=${this.monthHoverChange} @calciteInternalDatePickerDaySelect=${this.monthDateChange} @calciteInternalDatePickerMonthActiveDateChange=${this.monthActiveDateChange} @calciteInternalDatePickerMonthChange=${this.monthHeaderSelectChange} @calciteInternalDatePickerMonthMouseOut=${this.monthMouseOutChange} .range=${this.range} .scale=${this.scale} .selectedDate=${this.activeRange === "end" ? s : i} .startDate=${this.range ? i : void 0}></calcite-date-picker-month>`;
  }
}
R("calcite-date-picker", L);
export {
  L as DatePicker
};
