var t, e;
(t = this),
  (e = function () {
    function t(t, e, i) {
      return Math.max(t, Math.min(e, i));
    }
    class Animate {
      advance(e) {
        if (!this.isRunning) return;
        let i = !1;
        if (this.lerp)
          (this.value =
            ((s = this.value),
            (o = this.to),
            (n = 60 * this.lerp),
            (l = e),
            (function (t, e, i) {
              return (1 - i) * t + i * e;
            })(s, o, 1 - Math.exp(-n * l)))),
            Math.round(this.value) === this.to &&
              ((this.value = this.to), (i = !0));
        else {
          this.currentTime += e;
          const s = t(0, this.currentTime / this.duration, 1);
          i = s >= 1;
          const o = i ? 1 : this.easing(s);
          this.value = this.from + (this.to - this.from) * o;
        }
        var s, o, n, l;
        this.onUpdate?.(this.value, i), i && this.stop();
      }
      stop() {
        this.isRunning = !1;
      }
      fromTo(
        t,
        e,
        {
          lerp: i = 0.1,
          duration: s = 1,
          easing: o = (t) => t,
          onStart: n,
          onUpdate: l,
        }
      ) {
        (this.from = this.value = t),
          (this.to = e),
          (this.lerp = i),
          (this.duration = s),
          (this.easing = o),
          (this.currentTime = 0),
          (this.isRunning = !0),
          n?.(),
          (this.onUpdate = l);
      }
    }
    class Dimensions {
      constructor({
        wrapper: t,
        content: e,
        autoResize: i = !0,
        debounce: s = 250,
      } = {}) {
        (this.wrapper = t),
          (this.content = e),
          i &&
            ((this.debouncedResize = (function (t, e) {
              let i;
              return function () {
                let s = arguments,
                  o = this;
                clearTimeout(i),
                  (i = setTimeout(function () {
                    t.apply(o, s);
                  }, e));
              };
            })(this.resize, s)),
            this.wrapper === window
              ? window.addEventListener("resize", this.debouncedResize, !1)
              : ((this.wrapperResizeObserver = new ResizeObserver(
                  this.debouncedResize
                )),
                this.wrapperResizeObserver.observe(this.wrapper)),
            (this.contentResizeObserver = new ResizeObserver(
              this.debouncedResize
            )),
            this.contentResizeObserver.observe(this.content)),
          this.resize();
      }
      destroy() {
        this.wrapperResizeObserver?.disconnect(),
          this.contentResizeObserver?.disconnect(),
          window.removeEventListener("resize", this.debouncedResize, !1);
      }
      resize = () => {
        this.onWrapperResize(), this.onContentResize();
      };
      onWrapperResize = () => {
        this.wrapper === window
          ? ((this.width = window.innerWidth),
            (this.height = window.innerHeight))
          : ((this.width = this.wrapper.clientWidth),
            (this.height = this.wrapper.clientHeight));
      };
      onContentResize = () => {
        this.wrapper === window
          ? ((this.scrollHeight = this.content.scrollHeight),
            (this.scrollWidth = this.content.scrollWidth))
          : ((this.scrollHeight = this.wrapper.scrollHeight),
            (this.scrollWidth = this.wrapper.scrollWidth));
      };
      get limit() {
        return {
          x: this.scrollWidth - this.width,
          y: this.scrollHeight - this.height,
        };
      }
    }
    class Emitter {
      constructor() {
        this.events = {};
      }
      emit(t, ...e) {
        let i = this.events[t] || [];
        for (let t = 0, s = i.length; t < s; t++) i[t](...e);
      }
      on(t, e) {
        return (
          this.events[t]?.push(e) || (this.events[t] = [e]),
          () => {
            this.events[t] = this.events[t]?.filter((t) => e !== t);
          }
        );
      }
      off(t, e) {
        this.events[t] = this.events[t]?.filter((t) => e !== t);
      }
      destroy() {
        this.events = {};
      }
    }
    class VirtualScroll {
      constructor(
        t,
        {
          wheelMultiplier: e = 1,
          touchMultiplier: i = 2,
          normalizeWheel: s = !1,
        }
      ) {
        (this.element = t),
          (this.wheelMultiplier = e),
          (this.touchMultiplier = i),
          (this.normalizeWheel = s),
          (this.touchStart = { x: null, y: null }),
          (this.emitter = new Emitter()),
          this.element.addEventListener("wheel", this.onWheel, { passive: !1 }),
          this.element.addEventListener("touchstart", this.onTouchStart, {
            passive: !1,
          }),
          this.element.addEventListener("touchmove", this.onTouchMove, {
            passive: !1,
          }),
          this.element.addEventListener("touchend", this.onTouchEnd, {
            passive: !1,
          });
      }
      on(t, e) {
        return this.emitter.on(t, e);
      }
      destroy() {
        this.emitter.destroy(),
          this.element.removeEventListener("wheel", this.onWheel, {
            passive: !1,
          }),
          this.element.removeEventListener("touchstart", this.onTouchStart, {
            passive: !1,
          }),
          this.element.removeEventListener("touchmove", this.onTouchMove, {
            passive: !1,
          }),
          this.element.removeEventListener("touchend", this.onTouchEnd, {
            passive: !1,
          });
      }
      onTouchStart = (t) => {
        const { clientX: e, clientY: i } = t.targetTouches
          ? t.targetTouches[0]
          : t;
        (this.touchStart.x = e),
          (this.touchStart.y = i),
          (this.lastDelta = { x: 0, y: 0 }),
          this.emitter.emit("scroll", { deltaX: 0, deltaY: 0, event: t });
      };
      onTouchMove = (t) => {
        const { clientX: e, clientY: i } = t.targetTouches
            ? t.targetTouches[0]
            : t,
          s = -(e - this.touchStart.x) * this.touchMultiplier,
          o = -(i - this.touchStart.y) * this.touchMultiplier;
        (this.touchStart.x = e),
          (this.touchStart.y = i),
          (this.lastDelta = { x: s, y: o }),
          this.emitter.emit("scroll", { deltaX: s, deltaY: o, event: t });
      };
      onTouchEnd = (t) => {
        this.emitter.emit("scroll", {
          deltaX: this.lastDelta.x,
          deltaY: this.lastDelta.y,
          event: t,
        });
      };
      onWheel = (e) => {
        let { deltaX: i, deltaY: s } = e;
        this.normalizeWheel && ((i = t(-100, i, 100)), (s = t(-100, s, 100))),
          (i *= this.wheelMultiplier),
          (s *= this.wheelMultiplier),
          this.emitter.emit("scroll", { deltaX: i, deltaY: s, event: e });
      };
    }
    return class Lenis {
      constructor({
        wrapper: t = window,
        content: e = document.documentElement,
        wheelEventsTarget: i = t,
        eventsTarget: s = i,
        smoothWheel: o = !0,
        syncTouch: n = !1,
        syncTouchLerp: l = 0.075,
        touchInertiaMultiplier: r = 35,
        duration: h,
        easing: a = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        lerp: c = !h && 0.1,
        infinite: p = !1,
        orientation: u = "vertical",
        gestureOrientation: d = "vertical",
        touchMultiplier: m = 1,
        wheelMultiplier: g = 1,
        normalizeWheel: v = !1,
        autoResize: S = !0,
        __experimental__naiveDimensions: w = !1,
      } = {}) {
        (this.__isSmooth = !1),
          (this.__isScrolling = !1),
          (this.__isStopped = !1),
          (this.__isLocked = !1),
          (this.onVirtualScroll = ({ deltaX: t, deltaY: e, event: i }) => {
            if (i.ctrlKey) return;
            const s = i.type.includes("touch"),
              o = i.type.includes("wheel");
            if (this.options.syncTouch && s && "touchstart" === i.type)
              return void this.reset();
            const n = 0 === t && 0 === e,
              l =
                ("vertical" === this.options.gestureOrientation && 0 === e) ||
                ("horizontal" === this.options.gestureOrientation && 0 === t);
            if (n || l) return;
            let r = i.composedPath();
            if (
              ((r = r.slice(0, r.indexOf(this.rootElement))),
              r.find((t) => {
                var e, i, n, l, r;
                return (
                  (null === (e = t.hasAttribute) || void 0 === e
                    ? void 0
                    : e.call(t, "data-lenis-prevent")) ||
                  (s &&
                    (null === (i = t.hasAttribute) || void 0 === i
                      ? void 0
                      : i.call(t, "data-lenis-prevent-touch"))) ||
                  (o &&
                    (null === (n = t.hasAttribute) || void 0 === n
                      ? void 0
                      : n.call(t, "data-lenis-prevent-wheel"))) ||
                  ((null === (l = t.classList) || void 0 === l
                    ? void 0
                    : l.contains("lenis")) &&
                    !(null === (r = t.classList) || void 0 === r
                      ? void 0
                      : r.contains("lenis-stopped")))
                );
              }))
            )
              return;
            if (this.isStopped || this.isLocked) return void i.preventDefault();
            if (
              ((this.isSmooth =
                (this.options.syncTouch && s) ||
                (this.options.smoothWheel && o)),
              !this.isSmooth)
            )
              return (this.isScrolling = !1), void this.animate.stop();
            i.preventDefault();
            let h = e;
            "both" === this.options.gestureOrientation
              ? (h = Math.abs(e) > Math.abs(t) ? e : t)
              : "horizontal" === this.options.gestureOrientation && (h = t);
            const a = s && this.options.syncTouch,
              c = s && "touchend" === i.type && Math.abs(h) > 5;
            c && (h = this.velocity * this.options.touchInertiaMultiplier),
              this.scrollTo(
                this.targetScroll + h,
                Object.assign(
                  { programmatic: !1 },
                  a
                    ? { lerp: c ? this.options.syncTouchLerp : 1 }
                    : {
                        lerp: this.options.lerp,
                        duration: this.options.duration,
                        easing: this.options.easing,
                      }
                )
              );
          }),
          (this.onNativeScroll = () => {
            if (!this.__preventNextScrollEvent && !this.isScrolling) {
              const t = this.animatedScroll;
              (this.animatedScroll = this.targetScroll = this.actualScroll),
                (this.velocity = 0),
                (this.direction = Math.sign(this.animatedScroll - t)),
                this.emit();
            }
          }),
          (window.lenisVersion = "1.0.40"),
          (t !== document.documentElement && t !== document.body) ||
            (t = window),
          (this.options = {
            wrapper: t,
            content: e,
            wheelEventsTarget: i,
            eventsTarget: s,
            smoothWheel: o,
            syncTouch: n,
            syncTouchLerp: l,
            touchInertiaMultiplier: r,
            duration: h,
            easing: a,
            lerp: c,
            infinite: p,
            gestureOrientation: d,
            orientation: u,
            touchMultiplier: m,
            wheelMultiplier: g,
            normalizeWheel: v,
            autoResize: S,
            __experimental__naiveDimensions: w,
          }),
          (this.animate = new Animate()),
          (this.emitter = new Emitter()),
          (this.dimensions = new Dimensions({
            wrapper: t,
            content: e,
            autoResize: S,
          })),
          this.toggleClassName("lenis", !0),
          (this.velocity = 0),
          (this.isLocked = !1),
          (this.isStopped = !1),
          (this.isSmooth = n || o),
          (this.isScrolling = !1),
          (this.targetScroll = this.animatedScroll = this.actualScroll),
          this.options.wrapper.addEventListener(
            "scroll",
            this.onNativeScroll,
            !1
          ),
          (this.virtualScroll = new VirtualScroll(s, {
            touchMultiplier: m,
            wheelMultiplier: g,
            normalizeWheel: v,
          })),
          this.virtualScroll.on("scroll", this.onVirtualScroll);
      }
      destroy() {
        this.emitter.destroy(),
          this.options.wrapper.removeEventListener(
            "scroll",
            this.onNativeScroll,
            !1
          ),
          this.virtualScroll.destroy(),
          this.dimensions.destroy(),
          this.toggleClassName("lenis", !1),
          this.toggleClassName("lenis-smooth", !1),
          this.toggleClassName("lenis-scrolling", !1),
          this.toggleClassName("lenis-stopped", !1),
          this.toggleClassName("lenis-locked", !1);
      }
      on(t, e) {
        return this.emitter.on(t, e);
      }
      off(t, e) {
        return this.emitter.off(t, e);
      }
      setScroll(t) {
        this.isHorizontal
          ? (this.rootElement.scrollLeft = t)
          : (this.rootElement.scrollTop = t);
      }
      resize() {
        this.dimensions.resize();
      }
      emit() {
        this.emitter.emit("scroll", this);
      }
      reset() {
        (this.isLocked = !1),
          (this.isScrolling = !1),
          (this.animatedScroll = this.targetScroll = this.actualScroll),
          (this.velocity = 0),
          this.animate.stop();
      }
      start() {
        this.isStopped && ((this.isStopped = !1), this.reset());
      }
      stop() {
        this.isStopped ||
          ((this.isStopped = !0), this.animate.stop(), this.reset());
      }
      raf(t) {
        const e = t - (this.time || t);
        (this.time = t), this.animate.advance(0.001 * e);
      }
      scrollTo(
        e,
        {
          offset: i = 0,
          immediate: s = !1,
          lock: o = !1,
          duration: n = this.options.duration,
          easing: l = this.options.easing,
          lerp: r = !n && this.options.lerp,
          onComplete: h,
          force: a = !1,
          programmatic: c = !0,
        } = {}
      ) {
        if ((!this.isStopped && !this.isLocked) || a) {
          if (["top", "left", "start"].includes(e)) e = 0;
          else if (["bottom", "right", "end"].includes(e)) e = this.limit;
          else {
            let t;
            if (
              ("string" == typeof e
                ? (t = document.querySelector(e))
                : (null == e ? void 0 : e.nodeType) && (t = e),
              t)
            ) {
              if (this.options.wrapper !== window) {
                const t = this.options.wrapper.getBoundingClientRect();
                i -= this.isHorizontal ? t.left : t.top;
              }
              const s = t.getBoundingClientRect();
              e = (this.isHorizontal ? s.left : s.top) + this.animatedScroll;
            }
          }
          if ("number" == typeof e) {
            if (
              ((e += i),
              (e = Math.round(e)),
              this.options.infinite
                ? c && (this.targetScroll = this.animatedScroll = this.scroll)
                : (e = t(0, e, this.limit)),
              s)
            )
              return (
                (this.animatedScroll = this.targetScroll = e),
                this.setScroll(this.scroll),
                this.reset(),
                void (null == h || h(this))
              );
            if (!c) {
              if (e === this.targetScroll) return;
              this.targetScroll = e;
            }
            this.animate.fromTo(this.animatedScroll, e, {
              duration: n,
              easing: l,
              lerp: r,
              onStart: () => {
                o && (this.isLocked = !0), (this.isScrolling = !0);
              },
              onUpdate: (t, e) => {
                (this.isScrolling = !0),
                  (this.velocity = t - this.animatedScroll),
                  (this.direction = Math.sign(this.velocity)),
                  (this.animatedScroll = t),
                  this.setScroll(this.scroll),
                  c && (this.targetScroll = t),
                  e || this.emit(),
                  e &&
                    (this.reset(),
                    this.emit(),
                    null == h || h(this),
                    (this.__preventNextScrollEvent = !0),
                    requestAnimationFrame(() => {
                      delete this.__preventNextScrollEvent;
                    }));
              },
            });
          }
        }
      }
      get rootElement() {
        return this.options.wrapper === window
          ? document.documentElement
          : this.options.wrapper;
      }
      get limit() {
        return this.options.__experimental__naiveDimensions
          ? this.isHorizontal
            ? this.rootElement.scrollWidth - this.rootElement.clientWidth
            : this.rootElement.scrollHeight - this.rootElement.clientHeight
          : this.dimensions.limit[this.isHorizontal ? "x" : "y"];
      }
      get isHorizontal() {
        return "horizontal" === this.options.orientation;
      }
      get actualScroll() {
        return this.isHorizontal
          ? this.rootElement.scrollLeft
          : this.rootElement.scrollTop;
      }
      get scroll() {
        return this.options.infinite
          ? ((t = this.animatedScroll), (e = this.limit), ((t % e) + e) % e)
          : this.animatedScroll;
        var t, e;
      }
      get progress() {
        return 0 === this.limit ? 1 : this.scroll / this.limit;
      }
      get isSmooth() {
        return this.__isSmooth;
      }
      set isSmooth(t) {
        this.__isSmooth !== t &&
          ((this.__isSmooth = t), this.toggleClassName("lenis-smooth", t));
      }
      get isScrolling() {
        return this.__isScrolling;
      }
      set isScrolling(t) {
        this.__isScrolling !== t &&
          ((this.__isScrolling = t),
          this.toggleClassName("lenis-scrolling", t));
      }
      get isStopped() {
        return this.__isStopped;
      }
      set isStopped(t) {
        this.__isStopped !== t &&
          ((this.__isStopped = t), this.toggleClassName("lenis-stopped", t));
      }
      get isLocked() {
        return this.__isLocked;
      }
      set isLocked(t) {
        this.__isLocked !== t &&
          ((this.__isLocked = t), this.toggleClassName("lenis-locked", t));
      }
      get className() {
        let t = "lenis";
        return (
          this.isStopped && (t += " lenis-stopped"),
          this.isLocked && (t += " lenis-locked"),
          this.isScrolling && (t += " lenis-scrolling"),
          this.isSmooth && (t += " lenis-smooth"),
          t
        );
      }
      toggleClassName(t, e) {
        this.rootElement.classList.toggle(t, e),
          this.emitter.emit("className change", this);
      }
    };
  }),
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : ((t = "undefined" != typeof globalThis ? globalThis : t || self).Lenis =
        e());