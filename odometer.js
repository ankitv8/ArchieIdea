
(function () {
  var a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    i,
    j,
    k,
    l,
    m,
    n,
    o,
    p,
    q,
    r,
    s,
    t,
    u,
    v,
    w,
    x,
    y,
    z,
    A,
    B,
    C,
    D,
    E,
    F,
    G = [].slice;
  (q = '<span class="odometer-value"></span>'),
    (n =
      '<span class="odometer-ribbon"><span class="odometer-ribbon-inner">' +
      q +
      "</span></span>"),
    (d =
      '<span class="odometer-digit"><span class="odometer-digit-spacer">8</span><span class="odometer-digit-inner">' +
      n +
      "</span></span>"),
    (g = '<span class="odometer-formatting-mark"></span>'),
    (c = "(,ddd).dd"),
    (h = /^\(?([^)]*)\)?(?:(.)(d+))?$/),
    (i = 30),
    (f = 2e3),
    (a = 20),
    (j = 2),
    (e = 0.5),
    (k = 1e3 / i),
    (b = 1e3 / a),
    (o =
      "transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd"),
    (y = document.createElement("div").style),
    (p =
      null != y.transition ||
      null != y.webkitTransition ||
      null != y.mozTransition ||
      null != y.oTransition),
    (w =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame),
    (l =
      window.MutationObserver ||
      window.WebKitMutationObserver ||
      window.MozMutationObserver),
    (s = function (a) {
      var b;
      return (
        (b = document.createElement("div")), (b.innerHTML = a), b.children[0]
      );
    }),
    (v = function (a, b) {
      return (a.className = a.className.replace(
        new RegExp("(^| )" + b.split(" ").join("|") + "( |$)", "gi"),
        " "
      ));
    }),
    (r = function (a, b) {
      return v(a, b), (a.className += " " + b);
    }),
    (z = function (a, b) {
      var c;
      return null != document.createEvent
        ? ((c = document.createEvent("HTMLEvents")),
          c.initEvent(b, !0, !0),
          a.dispatchEvent(c))
        : void 0;
    }),
    (u = function () {
      var a, b;
      return null !=
        (a =
          null != (b = window.performance)
            ? "function" == typeof b.now
              ? b.now()
              : void 0
            : void 0)
        ? a
        : +new Date();
    }),
    (x = function (a, b) {
      return (
        null == b && (b = 0),
        b
          ? ((a *= Math.pow(10, b)),
            (a += 0.5),
            (a = Math.floor(a)),
            (a /= Math.pow(10, b)))
          : Math.round(a)
      );
    }),
    (A = function (a) {
      return 0 > a ? Math.ceil(a) : Math.floor(a);
    }),
    (t = function (a) {
      return a - x(a);
    }),
    (C = !1),
    (B = function () {
      var a, b, c, d, e;
      if (!C && null != window.jQuery) {
        for (
          C = !0, d = ["html", "text"], e = [], b = 0, c = d.length;
          c > b;
          b++
        )
          (a = d[b]),
            e.push(
              (function (a) {
                var b;
                return (
                  (b = window.jQuery.fn[a]),
                  (window.jQuery.fn[a] = function (a) {
                    var c;
                    return null == a ||
                      null == (null != (c = this[0]) ? c.odometer : void 0)
                      ? b.apply(this, arguments)
                      : this[0].odometer.update(a);
                  })
                );
              })(a)
            );
        return e;
      }
    })(),
    setTimeout(B, 0),
    (m = (function () {
      function a(b) {
        var c,
          d,
          e,
          g,
          h,
          i,
          l,
          m,
          n,
          o,
          p = this;
        if (
          ((this.options = b),
          (this.el = this.options.el),
          null != this.el.odometer)
        )
          return this.el.odometer;
        (this.el.odometer = this), (m = a.options);
        for (d in m)
          (g = m[d]), null == this.options[d] && (this.options[d] = g);
        null == (h = this.options).duration && (h.duration = f),
          (this.MAX_VALUES = (this.options.duration / k / j) | 0),
          this.resetFormat(),
          (this.value = this.cleanValue(
            null != (n = this.options.value) ? n : ""
          )),
          this.renderInside(),
          this.render();
        try {
          for (
            o = ["innerHTML", "innerText", "textContent"], i = 0, l = o.length;
            l > i;
            i++
          )
            (e = o[i]),
              null != this.el[e] &&
                !(function (a) {
                  return Object.defineProperty(p.el, a, {
                    get: function () {
                      var b;
                      return "innerHTML" === a
                        ? p.inside.outerHTML
                        : null != (b = p.inside.innerText)
                        ? b
                        : p.inside.textContent;
                    },
                    set: function (a) {
                      return p.update(a);
                    },
                  });
                })(e);
        } catch (q) {
          (c = q), this.watchForMutations();
        }
      }
      return (
        (a.prototype.renderInside = function () {
          return (
            (this.inside = document.createElement("div")),
            (this.inside.className = "odometer-inside"),
            (this.el.innerHTML = ""),
            this.el.appendChild(this.inside)
          );
        }),
        (a.prototype.watchForMutations = function () {
          var a,
            b = this;
          if (null != l)
            try {
              return (
                null == this.observer &&
                  (this.observer = new l(function () {
                    var a;
                    return (
                      (a = b.el.innerText),
                      b.renderInside(),
                      b.render(b.value),
                      b.update(a)
                    );
                  })),
                (this.watchMutations = !0),
                this.startWatchingMutations()
              );
            } catch (c) {
              a = c;
            }
        }),
        (a.prototype.startWatchingMutations = function () {
          return this.watchMutations
            ? this.observer.observe(this.el, { childList: !0 })
            : void 0;
        }),
        (a.prototype.stopWatchingMutations = function () {
          var a;
          return null != (a = this.observer) ? a.disconnect() : void 0;
        }),
        (a.prototype.cleanValue = function (a) {
          var b;
          return (
            "string" == typeof a &&
              ((a = a.replace(
                null != (b = this.format.radix) ? b : ".",
                "<radix>"
              )),
              (a = a.replace(/[.,]/g, "")),
              (a = a.replace("<radix>", ".")),
              (a = parseFloat(a, 10) || 0)),
            x(a, this.format.precision)
          );
        }),
        (a.prototype.bindTransitionEnd = function () {
          var a,
            b,
            c,
            d,
            e,
            f,
            g = this;
          if (!this.transitionEndBound) {
            for (
              this.transitionEndBound = !0,
                b = !1,
                e = o.split(" "),
                f = [],
                c = 0,
                d = e.length;
              d > c;
              c++
            )
              (a = e[c]),
                f.push(
                  this.el.addEventListener(
                    a,
                    function () {
                      return b
                        ? !0
                        : ((b = !0),
                          setTimeout(function () {
                            return (
                              g.render(), (b = !1), z(g.el, "odometerdone")
                            );
                          }, 0),
                          !0);
                    },
                    !1
                  )
                );
            return f;
          }
        }),
        (a.prototype.resetFormat = function () {
          var a, b, d, e, f, g, i, j;
          if (
            ((a = null != (i = this.options.format) ? i : c),
            a || (a = "d"),
            (d = h.exec(a)),
            !d)
          )
            throw new Error("Odometer: Unparsable digit format");
          return (
            (j = d.slice(1, 4)),
            (g = j[0]),
            (f = j[1]),
            (b = j[2]),
            (e = (null != b ? b.length : void 0) || 0),
            (this.format = { repeating: g, radix: f, precision: e })
          );
        }),
        (a.prototype.render = function (a) {
          var b, c, d, e, f, g, h, i, j, k, l, m;
          for (
            null == a && (a = this.value),
              this.stopWatchingMutations(),
              this.resetFormat(),
              this.inside.innerHTML = "",
              g = this.options.theme,
              b = this.el.className.split(" "),
              f = [],
              i = 0,
              k = b.length;
            k > i;
            i++
          )
            (c = b[i]),
              c.length &&
                ((e = /^odometer-theme-(.+)$/.exec(c))
                  ? (g = e[1])
                  : /^odometer(-|$)/.test(c) || f.push(c));
          for (
            f.push("odometer"),
              p || f.push("odometer-no-transitions"),
              f.push(g ? "odometer-theme-" + g : "odometer-auto-theme"),
              this.el.className = f.join(" "),
              this.ribbons = {},
              this.digits = [],
              h = !this.format.precision || !t(a) || !1,
              m = a.toString().split("").reverse(),
              j = 0,
              l = m.length;
            l > j;
            j++
          )
            (d = m[j]), "." === d && (h = !0), this.addDigit(d, h);
          return this.startWatchingMutations();
        }),
        (a.prototype.update = function (a) {
          var b,
            c = this;
          return (
            (a = this.cleanValue(a)),
            (b = a - this.value)
              ? (v(
                  this.el,
                  "odometer-animating-up odometer-animating-down odometer-animating"
                ),
                b > 0
                  ? r(this.el, "odometer-animating-up")
                  : r(this.el, "odometer-animating-down"),
                this.stopWatchingMutations(),
                this.animate(a),
                this.startWatchingMutations(),
                setTimeout(function () {
                  return c.el.offsetHeight, r(c.el, "odometer-animating");
                }, 0),
                (this.value = a))
              : void 0
          );
        }),
        (a.prototype.renderDigit = function () {
          return s(d);
        }),
        (a.prototype.insertDigit = function (a, b) {
          return null != b
            ? this.inside.insertBefore(a, b)
            : this.inside.children.length
            ? this.inside.insertBefore(a, this.inside.children[0])
            : this.inside.appendChild(a);
        }),
        (a.prototype.addSpacer = function (a, b, c) {
          var d;
          return (
            (d = s(g)), (d.innerHTML = a), c && r(d, c), this.insertDigit(d, b)
          );
        }),
        (a.prototype.addDigit = function (a, b) {
          var c, d, e, f;
          if ((null == b && (b = !0), "-" === a))
            return this.addSpacer(a, null, "odometer-negation-mark");
          if ("." === a)
            return this.addSpacer(
              null != (f = this.format.radix) ? f : ".",
              null,
              "odometer-radix-mark"
            );
          if (b)
            for (e = !1; ; ) {
              if (!this.format.repeating.length) {
                if (e) throw new Error("Bad odometer format without digits");
                this.resetFormat(), (e = !0);
              }
              if (
                ((c = this.format.repeating[this.format.repeating.length - 1]),
                (this.format.repeating = this.format.repeating.substring(
                  0,
                  this.format.repeating.length - 1
                )),
                "d" === c)
              )
                break;
              this.addSpacer(c);
            }
          return (
            (d = this.renderDigit()),
            (d.querySelector(".odometer-value").innerHTML = a),
            this.digits.push(d),
            this.insertDigit(d)
          );
        }),
        (a.prototype.animate = function (a) {
          return p && "count" !== this.options.animation
            ? this.animateSlide(a)
            : this.animateCount(a);
        }),
        (a.prototype.animateCount = function (a) {
          var c,
            d,
            e,
            f,
            g,
            h = this;
          if ((d = +a - this.value))
            return (
              (f = e = u()),
              (c = this.value),
              (g = function () {
                var i, j, k;
                return u() - f > h.options.duration
                  ? ((h.value = a), h.render(), void z(h.el, "odometerdone"))
                  : ((i = u() - e),
                    i > b &&
                      ((e = u()),
                      (k = i / h.options.duration),
                      (j = d * k),
                      (c += j),
                      h.render(Math.round(c))),
                    null != w ? w(g) : setTimeout(g, b));
              })()
            );
        }),
        (a.prototype.getDigitCount = function () {
          var a, b, c, d, e, f;
          for (
            d = 1 <= arguments.length ? G.call(arguments, 0) : [],
              a = e = 0,
              f = d.length;
            f > e;
            a = ++e
          )
            (c = d[a]), (d[a] = Math.abs(c));
          return (
            (b = Math.max.apply(Math, d)),
            Math.ceil(Math.log(b + 1) / Math.log(10))
          );
        }),
        (a.prototype.getFractionalDigitCount = function () {
          var a, b, c, d, e, f, g;
          for (
            e = 1 <= arguments.length ? G.call(arguments, 0) : [],
              b = /^\-?\d*\.(\d*?)0*$/,
              a = f = 0,
              g = e.length;
            g > f;
            a = ++f
          )
            (d = e[a]),
              (e[a] = d.toString()),
              (c = b.exec(e[a])),
              (e[a] = null == c ? 0 : c[1].length);
          return Math.max.apply(Math, e);
        }),
        (a.prototype.resetDigits = function () {
          return (
            (this.digits = []),
            (this.ribbons = []),
            (this.inside.innerHTML = ""),
            this.resetFormat()
          );
        }),
        (a.prototype.animateSlide = function (a) {
          var b,
            c,
            d,
            f,
            g,
            h,
            i,
            j,
            k,
            l,
            m,
            n,
            o,
            p,
            q,
            s,
            t,
            u,
            v,
            w,
            x,
            y,
            z,
            B,
            C,
            D,
            E;
          if (
            ((s = this.value),
            (j = this.getFractionalDigitCount(s, a)),
            j && ((a *= Math.pow(10, j)), (s *= Math.pow(10, j))),
            (d = a - s))
          ) {
            for (
              this.bindTransitionEnd(),
                f = this.getDigitCount(s, a),
                g = [],
                b = 0,
                m = v = 0;
              f >= 0 ? f > v : v > f;
              m = f >= 0 ? ++v : --v
            ) {
              if (
                ((t = A(s / Math.pow(10, f - m - 1))),
                (i = A(a / Math.pow(10, f - m - 1))),
                (h = i - t),
                Math.abs(h) > this.MAX_VALUES)
              ) {
                for (
                  l = [],
                    n = h / (this.MAX_VALUES + this.MAX_VALUES * b * e),
                    c = t;
                  (h > 0 && i > c) || (0 > h && c > i);

                )
                  l.push(Math.round(c)), (c += n);
                l[l.length - 1] !== i && l.push(i), b++;
              } else
                l = function () {
                  E = [];
                  for (var a = t; i >= t ? i >= a : a >= i; i >= t ? a++ : a--)
                    E.push(a);
                  return E;
                }.apply(this);
              for (m = w = 0, y = l.length; y > w; m = ++w)
                (k = l[m]), (l[m] = Math.abs(k % 10));
              g.push(l);
            }
            for (
              this.resetDigits(), D = g.reverse(), m = x = 0, z = D.length;
              z > x;
              m = ++x
            )
              for (
                l = D[m],
                  this.digits[m] || this.addDigit(" ", m >= j),
                  null == (u = this.ribbons)[m] &&
                    (u[m] = this.digits[m].querySelector(
                      ".odometer-ribbon-inner"
                    )),
                  this.ribbons[m].innerHTML = "",
                  0 > d && (l = l.reverse()),
                  o = C = 0,
                  B = l.length;
                B > C;
                o = ++C
              )
                (k = l[o]),
                  (q = document.createElement("div")),
                  (q.className = "odometer-value"),
                  (q.innerHTML = k),
                  this.ribbons[m].appendChild(q),
                  o === l.length - 1 && r(q, "odometer-last-value"),
                  0 === o && r(q, "odometer-first-value");
            return (
              0 > t && this.addDigit("-"),
              (p = this.inside.querySelector(".odometer-radix-mark")),
              null != p && p.parent.removeChild(p),
              j
                ? this.addSpacer(
                    this.format.radix,
                    this.digits[j - 1],
                    "odometer-radix-mark"
                  )
                : void 0
            );
          }
        }),
        a
      );
    })()),
    (m.options = null != (E = window.odometerOptions) ? E : {}),
    setTimeout(function () {
      var a, b, c, d, e;
      if (window.odometerOptions) {
        (d = window.odometerOptions), (e = []);
        for (a in d)
          (b = d[a]),
            e.push(
              null != (c = m.options)[a] ? (c = m.options)[a] : (c[a] = b)
            );
        return e;
      }
    }, 0),
    (m.init = function () {
      var a, b, c, d, e, f;
      if (null != document.querySelectorAll) {
        for (
          b = document.querySelectorAll(m.options.selector || ".odometer"),
            f = [],
            c = 0,
            d = b.length;
          d > c;
          c++
        )
          (a = b[c]),
            f.push(
              (a.odometer = new m({
                el: a,
                value: null != (e = a.innerText) ? e : a.textContent,
              }))
            );
        return f;
      }
    }),
    null != (null != (F = document.documentElement) ? F.doScroll : void 0) &&
    null != document.createEventObject
      ? ((D = document.onreadystatechange),
        (document.onreadystatechange = function () {
          return (
            "complete" === document.readyState &&
              m.options.auto !== !1 &&
              m.init(),
            null != D ? D.apply(this, arguments) : void 0
          );
        }))
      : document.addEventListener(
          "DOMContentLoaded",
          function () {
            return m.options.auto !== !1 ? m.init() : void 0;
          },
          !1
        ),
    "function" == typeof define && define.amd
      ? define(["jquery"], function () {
          return m;
        })
      : typeof exports === !1
      ? (module.exports = m)
      : (window.Odometer = m);
}).call(this);