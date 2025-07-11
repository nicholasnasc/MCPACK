(function(f) {
    "function" === typeof define && define.amd ? define(["jquery"], f) : "undefined" !== typeof exports ? module.exports = f(require("jquery")) : f(jQuery)
}
)(function(f) {
    var g = window.Slick || {};
    g = function() {
        var a = 0;
        return function(b, c) {
            this.defaults = {
                accessibility: !0,
                adaptiveHeight: !1,
                appendArrows: f(b),
                appendDots: f(b),
                arrows: !0,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: !1,
                autoplaySpeed: 3E3,
                centerMode: !1,
                centerPadding: "50px",
                cssEase: "ease",
                customPaging: function(d, h) {
                    return f('<button type="button" />').text(h + 1)
                },
                dots: !1,
                dotsClass: "slick-dots",
                draggable: !0,
                easing: "linear",
                edgeFriction: .35,
                fade: !1,
                focusOnSelect: !1,
                focusOnChange: !1,
                infinite: !0,
                initialSlide: 0,
                lazyLoad: "ondemand",
                mobileFirst: !1,
                pauseOnHover: !0,
                pauseOnFocus: !0,
                pauseOnDotsHover: !1,
                respondTo: "window",
                responsive: null,
                rows: 1,
                rtl: !1,
                slide: "",
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: !0,
                swipeToSlide: !1,
                touchMove: !0,
                touchThreshold: 5,
                useCSS: !0,
                useTransform: !0,
                variableWidth: !1,
                vertical: !1,
                verticalSwiping: !1,
                waitForAnimate: !0,
                zIndex: 1E3
            };
            this.initials = {
                animating: !1,
                dragging: !1,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: !1,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: !1,
                slideOffset: 0,
                swipeLeft: null,
                swiping: !1,
                $list: null,
                touchObject: {},
                transformsEnabled: !1,
                unslicked: !1
            };
            f.extend(this, this.initials);
            this.animProp = this.animType = this.activeBreakpoint = null;
            this.breakpoints = [];
            this.breakpointSettings = [];
            this.interrupted = this.focussed = this.cssTransitions = !1;
            this.hidden = "hidden";
            this.paused = !0;
            this.respondTo = this.positionProp = null;
            this.rowCount = 1;
            this.shouldClick = !0;
            this.$slider = f(b);
            this.transitionType = this.transformType = this.$slidesCache = null;
            this.visibilityChange = "visibilitychange";
            this.windowWidth = 0;
            this.windowTimer = null;
            var e = f(b).data("slick") || {};
            this.options = f.extend({}, this.defaults, c, e);
            this.currentSlide = this.options.initialSlide;
            this.originalSettings = this.options;
            "undefined" !== typeof document.mozHidden ? (this.hidden = "mozHidden",
            this.visibilityChange = "mozvisibilitychange") : "undefined" !== typeof document.webkitHidden && (this.hidden = "webkitHidden",
            this.visibilityChange = "webkitvisibilitychange");
            this.autoPlay = f.proxy(this.autoPlay, this);
            this.autoPlayClear = f.proxy(this.autoPlayClear, this);
            this.autoPlayIterator = f.proxy(this.autoPlayIterator, this);
            this.changeSlide = f.proxy(this.changeSlide, this);
            this.clickHandler = f.proxy(this.clickHandler, this);
            this.selectHandler = f.proxy(this.selectHandler, this);
            this.setPosition = f.proxy(this.setPosition, this);
            this.swipeHandler = f.proxy(this.swipeHandler, this);
            this.dragHandler = f.proxy(this.dragHandler, this);
            this.keyHandler = f.proxy(this.keyHandler, this);
            this.instanceUid = a++;
            this.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
            this.registerBreakpoints();
            this.init(!0)
        }
    }();
    g.prototype.activateADA = function() {
        this.$slideTrack.find(".slick-active").attr({
            "aria-hidden": "false"
        }).find("a, input, button, select").attr({
            tabindex: "0"
        })
    }
    ;
    g.prototype.addSlide = g.prototype.slickAdd = function(a, b, c) {
        if ("boolean" === typeof b)
            c = b,
            b = null;
        else if (0 > b || b >= this.slideCount)
            return !1;
        this.unload();
        "number" === typeof b ? 0 === b && 0 === this.$slides.length ? f(a).appendTo(this.$slideTrack) : c ? f(a).insertBefore(this.$slides.eq(b)) : f(a).insertAfter(this.$slides.eq(b)) : !0 === c ? f(a).prependTo(this.$slideTrack) : f(a).appendTo(this.$slideTrack);
        this.$slides = this.$slideTrack.children(this.options.slide);
        this.$slideTrack.children(this.options.slide).detach();
        this.$slideTrack.append(this.$slides);
        this.$slides.each(function(e, d) {
            f(d).attr("data-slick-index", e)
        });
        this.$slidesCache = this.$slides;
        this.reinit()
    }
    ;
    g.prototype.animateHeight = function() {
        if (1 === this.options.slidesToShow && !0 === this.options.adaptiveHeight && !1 === this.options.vertical) {
            var a = this.$slides.eq(this.currentSlide).outerHeight(!0);
            this.$list.animate({
                height: a
            }, this.options.speed)
        }
    }
    ;
    g.prototype.animateSlide = function(a, b) {
        var c = {}
          , e = this;
        e.animateHeight();
        !0 === e.options.rtl && !1 === e.options.vertical && (a = -a);
        !1 === e.transformsEnabled ? !1 === e.options.vertical ? e.$slideTrack.animate({
            left: a
        }, e.options.speed, e.options.easing, b) : e.$slideTrack.animate({
            top: a
        }, e.options.speed, e.options.easing, b) : !1 === e.cssTransitions ? (!0 === e.options.rtl && (e.currentLeft = -e.currentLeft),
        f({
            animStart: e.currentLeft
        }).animate({
            animStart: a
        }, {
            duration: e.options.speed,
            easing: e.options.easing,
            step: function(d) {
                d = Math.ceil(d);
                c[e.animType] = !1 === e.options.vertical ? "translate(" + d + "px, 0px)" : "translate(0px," + d + "px)";
                e.$slideTrack.css(c)
            },
            complete: function() {
                b && b.call()
            }
        })) : (e.applyTransition(),
        a = Math.ceil(a),
        c[e.animType] = !1 === e.options.vertical ? "translate3d(" + a + "px, 0px, 0px)" : "translate3d(0px," + a + "px, 0px)",
        e.$slideTrack.css(c),
        b && setTimeout(function() {
            e.disableTransition();
            b.call()
        }, e.options.speed))
    }
    ;
    g.prototype.getNavTarget = function() {
        var a = this.options.asNavFor;
        a && null !== a && (a = f(a).not(this.$slider));
        return a
    }
    ;
    g.prototype.asNavFor = function(a) {
        var b = this.getNavTarget();
        null !== b && "object" === typeof b && b.each(function() {
            var c = f(this).slick("getSlick");
            c.unslicked || c.slideHandler(a, !0)
        })
    }
    ;
    g.prototype.applyTransition = function(a) {
        var b = {};
        b[this.transitionType] = !1 === this.options.fade ? this.transformType + " " + this.options.speed + "ms " + this.options.cssEase : "opacity " + this.options.speed + "ms " + this.options.cssEase;
        !1 === this.options.fade ? this.$slideTrack.css(b) : this.$slides.eq(a).css(b)
    }
    ;
    g.prototype.autoPlay = function() {
        this.autoPlayClear();
        this.slideCount > this.options.slidesToShow && (this.autoPlayTimer = setInterval(this.autoPlayIterator, this.options.autoplaySpeed))
    }
    ;
    g.prototype.autoPlayClear = function() {
        this.autoPlayTimer && clearInterval(this.autoPlayTimer)
    }
    ;
    g.prototype.autoPlayIterator = function() {
        var a = this.currentSlide + this.options.slidesToScroll;
        this.paused || this.interrupted || this.focussed || (!1 === this.options.infinite && (1 === this.direction && this.currentSlide + 1 === this.slideCount - 1 ? this.direction = 0 : 0 === this.direction && (a = this.currentSlide - this.options.slidesToScroll,
        0 === this.currentSlide - 1 && (this.direction = 1))),
        this.slideHandler(a))
    }
    ;
    g.prototype.buildArrows = function() {
        !0 === this.options.arrows && (this.$prevArrow = f(this.options.prevArrow).addClass("slick-arrow"),
        this.$nextArrow = f(this.options.nextArrow).addClass("slick-arrow"),
        this.slideCount > this.options.slidesToShow ? (this.$prevArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
        this.$nextArrow.removeClass("slick-hidden").removeAttr("aria-hidden tabindex"),
        this.htmlExpr.test(this.options.prevArrow) && this.$prevArrow.prependTo(this.options.appendArrows),
        this.htmlExpr.test(this.options.nextArrow) && this.$nextArrow.appendTo(this.options.appendArrows),
        !0 !== this.options.infinite && this.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true")) : this.$prevArrow.add(this.$nextArrow).addClass("slick-hidden").attr({
            "aria-disabled": "true",
            tabindex: "-1"
        }))
    }
    ;
    g.prototype.buildDots = function() {
        var a;
        if (!0 === this.options.dots && this.slideCount > this.options.slidesToShow) {
            this.$slider.addClass("slick-dotted");
            var b = f("<ul />").addClass(this.options.dotsClass);
            for (a = 0; a <= this.getDotCount(); a += 1)
                b.append(f("<li />").append(this.options.customPaging.call(this, this, a)));
            this.$dots = b.appendTo(this.options.appendDots);
            this.$dots.find("li").first().addClass("slick-active")
        }
    }
    ;
    g.prototype.buildOut = function() {
        this.$slides = this.$slider.children(this.options.slide + ":not(.slick-cloned)").addClass("slick-slide");
        this.slideCount = this.$slides.length;
        this.$slides.each(function(a, b) {
            f(b).attr("data-slick-index", a).data("originalStyling", f(b).attr("style") || "")
        });
        this.$slider.addClass("slick-slider");
        this.$slideTrack = 0 === this.slideCount ? f('<div class="slick-track"/>').appendTo(this.$slider) : this.$slides.wrapAll('<div class="slick-track"/>').parent();
        this.$list = this.$slideTrack.wrap('<div class="slick-list"/>').parent();
        this.$slideTrack.css("opacity", 0);
        if (!0 === this.options.centerMode || !0 === this.options.swipeToSlide)
            this.options.slidesToScroll = 1;
        f("img[data-lazy]", this.$slider).not("[src]").addClass("slick-loading");
        this.setupInfinite();
        this.buildArrows();
        this.buildDots();
        this.updateDots();
        this.setSlideClasses("number" === typeof this.currentSlide ? this.currentSlide : 0);
        !0 === this.options.draggable && this.$list.addClass("draggable")
    }
    ;
    g.prototype.buildRows = function() {
        var a, b, c;
        var e = document.createDocumentFragment();
        var d = this.$slider.children();
        if (0 < this.options.rows) {
            var h = this.options.slidesPerRow * this.options.rows;
            var k = Math.ceil(d.length / h);
            for (a = 0; a < k; a++) {
                var m = document.createElement("div");
                for (b = 0; b < this.options.rows; b++) {
                    var l = document.createElement("div");
                    for (c = 0; c < this.options.slidesPerRow; c++) {
                        var n = a * h + (b * this.options.slidesPerRow + c);
                        d.get(n) && l.appendChild(d.get(n))
                    }
                    m.appendChild(l)
                }
                e.appendChild(m)
            }
            this.$slider.empty().append(e);
            this.$slider.children().children().children().css({
                width: 100 / this.options.slidesPerRow + "%",
                display: "inline-block"
            })
        }
    }
    ;
    g.prototype.checkResponsive = function(a, b) {
        var c, e, d = !1;
        var h = this.$slider.width();
        var k = window.innerWidth || f(window).width();
        "window" === this.respondTo ? e = k : "slider" === this.respondTo ? e = h : "min" === this.respondTo && (e = Math.min(k, h));
        if (this.options.responsive && this.options.responsive.length && null !== this.options.responsive) {
            h = null;
            for (c in this.breakpoints)
                this.breakpoints.hasOwnProperty(c) && (!1 === this.originalSettings.mobileFirst ? e < this.breakpoints[c] && (h = this.breakpoints[c]) : e > this.breakpoints[c] && (h = this.breakpoints[c]));
            if (null !== h)
                if (null !== this.activeBreakpoint) {
                    if (h !== this.activeBreakpoint || b)
                        this.activeBreakpoint = h,
                        "unslick" === this.breakpointSettings[h] ? this.unslick(h) : (this.options = f.extend({}, this.originalSettings, this.breakpointSettings[h]),
                        !0 === a && (this.currentSlide = this.options.initialSlide),
                        this.refresh(a)),
                        d = h
                } else
                    this.activeBreakpoint = h,
                    "unslick" === this.breakpointSettings[h] ? this.unslick(h) : (this.options = f.extend({}, this.originalSettings, this.breakpointSettings[h]),
                    !0 === a && (this.currentSlide = this.options.initialSlide),
                    this.refresh(a)),
                    d = h;
            else
                null !== this.activeBreakpoint && (this.activeBreakpoint = null,
                this.options = this.originalSettings,
                !0 === a && (this.currentSlide = this.options.initialSlide),
                this.refresh(a),
                d = h);
            a || !1 === d || this.$slider.trigger("breakpoint", [this, d])
        }
    }
    ;
    g.prototype.changeSlide = function(a, b) {
        var c = f(a.currentTarget);
        c.is("a") && a.preventDefault();
        c.is("li") || (c = c.closest("li"));
        var e = 0 !== this.slideCount % this.options.slidesToScroll ? 0 : (this.slideCount - this.currentSlide) % this.options.slidesToScroll;
        switch (a.data.message) {
        case "previous":
            c = 0 === e ? this.options.slidesToScroll : this.options.slidesToShow - e;
            this.slideCount > this.options.slidesToShow && this.slideHandler(this.currentSlide - c, !1, b);
            break;
        case "next":
            c = 0 === e ? this.options.slidesToScroll : e;
            this.slideCount > this.options.slidesToShow && this.slideHandler(this.currentSlide + c, !1, b);
            break;
        case "index":
            e = 0 === a.data.index ? 0 : a.data.index || c.index() * this.options.slidesToScroll,
            this.slideHandler(this.checkNavigable(e), !1, b),
            c.children().trigger("focus")
        }
    }
    ;
    g.prototype.checkNavigable = function(a) {
        var b = this.getNavigableIndexes();
        var c = 0;
        if (a > b[b.length - 1])
            a = b[b.length - 1];
        else
            for (var e in b) {
                if (a < b[e]) {
                    a = c;
                    break
                }
                c = b[e]
            }
        return a
    }
    ;
    g.prototype.cleanUpEvents = function() {
        this.options.dots && null !== this.$dots && (f("li", this.$dots).off("click.slick", this.changeSlide).off("mouseenter.slick", f.proxy(this.interrupt, this, !0)).off("mouseleave.slick", f.proxy(this.interrupt, this, !1)),
        !0 === this.options.accessibility && this.$dots.off("keydown.slick", this.keyHandler));
        this.$slider.off("focus.slick blur.slick");
        !0 === this.options.arrows && this.slideCount > this.options.slidesToShow && (this.$prevArrow && this.$prevArrow.off("click.slick", this.changeSlide),
        this.$nextArrow && this.$nextArrow.off("click.slick", this.changeSlide),
        !0 === this.options.accessibility && (this.$prevArrow && this.$prevArrow.off("keydown.slick", this.keyHandler),
        this.$nextArrow && this.$nextArrow.off("keydown.slick", this.keyHandler)));
        this.$list.off("touchstart.slick mousedown.slick", this.swipeHandler);
        this.$list.off("touchmove.slick mousemove.slick", this.swipeHandler);
        this.$list.off("touchend.slick mouseup.slick", this.swipeHandler);
        this.$list.off("touchcancel.slick mouseleave.slick", this.swipeHandler);
        this.$list.off("click.slick", this.clickHandler);
        f(document).off(this.visibilityChange, this.visibility);
        this.cleanUpSlideEvents();
        !0 === this.options.accessibility && this.$list.off("keydown.slick", this.keyHandler);
        !0 === this.options.focusOnSelect && f(this.$slideTrack).children().off("click.slick", this.selectHandler);
        f(window).off("orientationchange.slick.slick-" + this.instanceUid, this.orientationChange);
        f(window).off("resize.slick.slick-" + this.instanceUid, this.resize);
        f("[draggable!=true]", this.$slideTrack).off("dragstart", this.preventDefault);
        f(window).off("load.slick.slick-" + this.instanceUid, this.setPosition)
    }
    ;
    g.prototype.cleanUpSlideEvents = function() {
        this.$list.off("mouseenter.slick", f.proxy(this.interrupt, this, !0));
        this.$list.off("mouseleave.slick", f.proxy(this.interrupt, this, !1))
    }
    ;
    g.prototype.cleanUpRows = function() {
        if (0 < this.options.rows) {
            var a = this.$slides.children().children();
            a.removeAttr("style");
            this.$slider.empty().append(a)
        }
    }
    ;
    g.prototype.clickHandler = function(a) {
        !1 === this.shouldClick && (a.stopImmediatePropagation(),
        a.stopPropagation(),
        a.preventDefault())
    }
    ;
    g.prototype.destroy = function(a) {
        this.autoPlayClear();
        this.touchObject = {};
        this.cleanUpEvents();
        f(".slick-cloned", this.$slider).detach();
        this.$dots && this.$dots.remove();
        this.$prevArrow && this.$prevArrow.length && (this.$prevArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
        this.htmlExpr.test(this.options.prevArrow) && this.$prevArrow.remove());
        this.$nextArrow && this.$nextArrow.length && (this.$nextArrow.removeClass("slick-disabled slick-arrow slick-hidden").removeAttr("aria-hidden aria-disabled tabindex").css("display", ""),
        this.htmlExpr.test(this.options.nextArrow) && this.$nextArrow.remove());
        this.$slides && (this.$slides.removeClass("slick-slide slick-active slick-center slick-visible slick-current").removeAttr("aria-hidden").removeAttr("data-slick-index").each(function() {
            f(this).attr("style", f(this).data("originalStyling"))
        }),
        this.$slideTrack.children(this.options.slide).detach(),
        this.$slideTrack.detach(),
        this.$list.detach(),
        this.$slider.append(this.$slides));
        this.cleanUpRows();
        this.$slider.removeClass("slick-slider");
        this.$slider.removeClass("slick-initialized");
        this.$slider.removeClass("slick-dotted");
        this.unslicked = !0;
        a || this.$slider.trigger("destroy", [this])
    }
    ;
    g.prototype.disableTransition = function(a) {
        var b = {};
        b[this.transitionType] = "";
        !1 === this.options.fade ? this.$slideTrack.css(b) : this.$slides.eq(a).css(b)
    }
    ;
    g.prototype.fadeSlide = function(a, b) {
        var c = this;
        !1 === c.cssTransitions ? (c.$slides.eq(a).css({
            zIndex: c.options.zIndex
        }),
        c.$slides.eq(a).animate({
            opacity: 1
        }, c.options.speed, c.options.easing, b)) : (c.applyTransition(a),
        c.$slides.eq(a).css({
            opacity: 1,
            zIndex: c.options.zIndex
        }),
        b && setTimeout(function() {
            c.disableTransition(a);
            b.call()
        }, c.options.speed))
    }
    ;
    g.prototype.fadeSlideOut = function(a) {
        !1 === this.cssTransitions ? this.$slides.eq(a).animate({
            opacity: 0,
            zIndex: this.options.zIndex - 2
        }, this.options.speed, this.options.easing) : (this.applyTransition(a),
        this.$slides.eq(a).css({
            opacity: 0,
            zIndex: this.options.zIndex - 2
        }))
    }
    ;
    g.prototype.filterSlides = g.prototype.slickFilter = function(a) {
        null !== a && (this.$slidesCache = this.$slides,
        this.unload(),
        this.$slideTrack.children(this.options.slide).detach(),
        this.$slidesCache.filter(a).appendTo(this.$slideTrack),
        this.reinit())
    }
    ;
    g.prototype.focusHandler = function() {
        var a = this;
        a.$slider.off("focus.slick blur.slick").on("focus.slick blur.slick", "*", function(b) {
            b.stopImmediatePropagation();
            var c = f(this);
            setTimeout(function() {
                a.options.pauseOnFocus && (a.focussed = c.is(":focus"),
                a.autoPlay())
            }, 0)
        })
    }
    ;
    g.prototype.getCurrent = g.prototype.slickCurrentSlide = function() {
        return this.currentSlide
    }
    ;
    g.prototype.getDotCount = function() {
        var a = 0
          , b = 0
          , c = 0;
        if (!0 === this.options.infinite)
            if (this.slideCount <= this.options.slidesToShow)
                ++c;
            else
                for (; a < this.slideCount; )
                    ++c,
                    a = b + this.options.slidesToScroll,
                    b += this.options.slidesToScroll <= this.options.slidesToShow ? this.options.slidesToScroll : this.options.slidesToShow;
        else if (!0 === this.options.centerMode)
            c = this.slideCount;
        else if (this.options.asNavFor)
            for (; a < this.slideCount; )
                ++c,
                a = b + this.options.slidesToScroll,
                b += this.options.slidesToScroll <= this.options.slidesToShow ? this.options.slidesToScroll : this.options.slidesToShow;
        else
            c = 1 + Math.ceil((this.slideCount - this.options.slidesToShow) / this.options.slidesToScroll);
        return c - 1
    }
    ;
    g.prototype.getLeft = function(a) {
        var b = 0;
        this.slideOffset = 0;
        var c = this.$slides.first().outerHeight(!0);
        !0 === this.options.infinite ? (this.slideCount > this.options.slidesToShow && (this.slideOffset = this.slideWidth * this.options.slidesToShow * -1,
        b = -1,
        !0 === this.options.vertical && !0 === this.options.centerMode && (2 === this.options.slidesToShow ? b = -1.5 : 1 === this.options.slidesToShow && (b = -2)),
        b *= c * this.options.slidesToShow),
        0 !== this.slideCount % this.options.slidesToScroll && a + this.options.slidesToScroll > this.slideCount && this.slideCount > this.options.slidesToShow && (a > this.slideCount ? (this.slideOffset = (this.options.slidesToShow - (a - this.slideCount)) * this.slideWidth * -1,
        b = (this.options.slidesToShow - (a - this.slideCount)) * c * -1) : (this.slideOffset = this.slideCount % this.options.slidesToScroll * this.slideWidth * -1,
        b = this.slideCount % this.options.slidesToScroll * c * -1))) : a + this.options.slidesToShow > this.slideCount && (this.slideOffset = (a + this.options.slidesToShow - this.slideCount) * this.slideWidth,
        b = (a + this.options.slidesToShow - this.slideCount) * c);
        this.slideCount <= this.options.slidesToShow && (b = this.slideOffset = 0);
        !0 === this.options.centerMode && this.slideCount <= this.options.slidesToShow ? this.slideOffset = this.slideWidth * Math.floor(this.options.slidesToShow) / 2 - this.slideWidth * this.slideCount / 2 : !0 === this.options.centerMode && !0 === this.options.infinite ? this.slideOffset += this.slideWidth * Math.floor(this.options.slidesToShow / 2) - this.slideWidth : !0 === this.options.centerMode && (this.slideOffset = 0,
        this.slideOffset += this.slideWidth * Math.floor(this.options.slidesToShow / 2));
        c = !1 === this.options.vertical ? a * this.slideWidth * -1 + this.slideOffset : a * c * -1 + b;
        !0 === this.options.variableWidth && (b = this.slideCount <= this.options.slidesToShow || !1 === this.options.infinite ? this.$slideTrack.children(".slick-slide").eq(a) : this.$slideTrack.children(".slick-slide").eq(a + this.options.slidesToShow),
        c = !0 === this.options.rtl ? b[0] ? -1 * (this.$slideTrack.width() - b[0].offsetLeft - b.width()) : 0 : b[0] ? -1 * b[0].offsetLeft : 0,
        !0 === this.options.centerMode && (b = this.slideCount <= this.options.slidesToShow || !1 === this.options.infinite ? this.$slideTrack.children(".slick-slide").eq(a) : this.$slideTrack.children(".slick-slide").eq(a + this.options.slidesToShow + 1),
        c = !0 === this.options.rtl ? b[0] ? -1 * (this.$slideTrack.width() - b[0].offsetLeft - b.width()) : 0 : b[0] ? -1 * b[0].offsetLeft : 0,
        c += (this.$list.width() - b.outerWidth()) / 2));
        return c
    }
    ;
    g.prototype.getOption = g.prototype.slickGetOption = function(a) {
        return this.options[a]
    }
    ;
    g.prototype.getNavigableIndexes = function() {
        var a = 0
          , b = 0
          , c = [];
        if (!1 === this.options.infinite)
            var e = this.slideCount;
        else
            a = -1 * this.options.slidesToScroll,
            b = -1 * this.options.slidesToScroll,
            e = 2 * this.slideCount;
        for (; a < e; )
            c.push(a),
            a = b + this.options.slidesToScroll,
            b += this.options.slidesToScroll <= this.options.slidesToShow ? this.options.slidesToScroll : this.options.slidesToShow;
        return c
    }
    ;
    g.prototype.getSlick = function() {
        return this
    }
    ;
    g.prototype.getSlideCount = function() {
        var a = this, b, c;
        var e = !0 === a.options.centerMode ? a.slideWidth * Math.floor(a.options.slidesToShow / 2) : 0;
        return !0 === a.options.swipeToSlide ? (a.$slideTrack.find(".slick-slide").each(function(d, h) {
            if (h.offsetLeft - e + f(h).outerWidth() / 2 > -1 * a.swipeLeft)
                return c = h,
                !1
        }),
        b = Math.abs(f(c).attr("data-slick-index") - a.currentSlide) || 1) : a.options.slidesToScroll
    }
    ;
    g.prototype.goTo = g.prototype.slickGoTo = function(a, b) {
        this.changeSlide({
            data: {
                message: "index",
                index: parseInt(a)
            }
        }, b)
    }
    ;
    g.prototype.init = function(a) {
        f(this.$slider).hasClass("slick-initialized") || (f(this.$slider).addClass("slick-initialized"),
        this.buildRows(),
        this.buildOut(),
        this.setProps(),
        this.startLoad(),
        this.loadSlider(),
        this.initializeEvents(),
        this.updateArrows(),
        this.updateDots(),
        this.checkResponsive(!0),
        this.focusHandler());
        a && this.$slider.trigger("init", [this]);
        !0 === this.options.accessibility && this.initADA();
        this.options.autoplay && (this.paused = !1,
        this.autoPlay())
    }
    ;
    g.prototype.initADA = function() {
        var a = this
          , b = Math.ceil(a.slideCount / a.options.slidesToShow)
          , c = a.getNavigableIndexes().filter(function(h) {
            return 0 <= h && h < a.slideCount
        });
        a.$slides.add(a.$slideTrack.find(".slick-cloned")).attr({
            "aria-hidden": "true",
            tabindex: "-1"
        }).find("a, input, button, select").attr({
            tabindex: "-1"
        });
        null !== a.$dots && (a.$slides.not(a.$slideTrack.find(".slick-cloned")).each(function(h) {
            var k = c.indexOf(h);
            f(this).attr({
                role: "tabpanel",
                id: "slick-slide" + a.instanceUid + h,
                tabindex: -1
            });
            -1 !== k && (h = "slick-slide-control" + a.instanceUid + k,
            f("#" + h).length && f(this).attr({
                "aria-describedby": h
            }))
        }),
        a.$dots.attr("role", "tablist").find("li").each(function(h) {
            var k = c[h];
            f(this).attr({
                role: "presentation"
            });
            f(this).find("button").first().attr({
                role: "tab",
                id: "slick-slide-control" + a.instanceUid + h,
                "aria-controls": "slick-slide" + a.instanceUid + k,
                "aria-label": h + 1 + " of " + b,
                "aria-selected": null,
                tabindex: "-1"
            })
        }).eq(a.currentSlide).find("button").attr({
            "aria-selected": "true",
            tabindex: "0"
        }).end());
        for (var e = a.currentSlide, d = e + a.options.slidesToShow; e < d; e++)
            a.options.focusOnChange ? a.$slides.eq(e).attr({
                tabindex: "0"
            }) : a.$slides.eq(e).removeAttr("tabindex");
        a.activateADA()
    }
    ;
    g.prototype.initArrowEvents = function() {
        !0 === this.options.arrows && this.slideCount > this.options.slidesToShow && (this.$prevArrow.off("click.slick").on("click.slick", {
            message: "previous"
        }, this.changeSlide),
        this.$nextArrow.off("click.slick").on("click.slick", {
            message: "next"
        }, this.changeSlide),
        !0 === this.options.accessibility && (this.$prevArrow.on("keydown.slick", this.keyHandler),
        this.$nextArrow.on("keydown.slick", this.keyHandler)))
    }
    ;
    g.prototype.initDotEvents = function() {
        if (!0 === this.options.dots && this.slideCount > this.options.slidesToShow && (f("li", this.$dots).on("click.slick", {
            message: "index"
        }, this.changeSlide),
        !0 === this.options.accessibility))
            this.$dots.on("keydown.slick", this.keyHandler);
        if (!0 === this.options.dots && !0 === this.options.pauseOnDotsHover && this.slideCount > this.options.slidesToShow)
            f("li", this.$dots).on("mouseenter.slick", f.proxy(this.interrupt, this, !0)).on("mouseleave.slick", f.proxy(this.interrupt, this, !1))
    }
    ;
    g.prototype.initSlideEvents = function() {
        this.options.pauseOnHover && (this.$list.on("mouseenter.slick", f.proxy(this.interrupt, this, !0)),
        this.$list.on("mouseleave.slick", f.proxy(this.interrupt, this, !1)))
    }
    ;
    g.prototype.initializeEvents = function() {
        this.initArrowEvents();
        this.initDotEvents();
        this.initSlideEvents();
        this.$list.on("touchstart.slick mousedown.slick", {
            action: "start"
        }, this.swipeHandler);
        this.$list.on("touchmove.slick mousemove.slick", {
            action: "move"
        }, this.swipeHandler);
        this.$list.on("touchend.slick mouseup.slick", {
            action: "end"
        }, this.swipeHandler);
        this.$list.on("touchcancel.slick mouseleave.slick", {
            action: "end"
        }, this.swipeHandler);
        this.$list.on("click.slick", this.clickHandler);
        f(document).on(this.visibilityChange, f.proxy(this.visibility, this));
        if (!0 === this.options.accessibility)
            this.$list.on("keydown.slick", this.keyHandler);
        if (!0 === this.options.focusOnSelect)
            f(this.$slideTrack).children().on("click.slick", this.selectHandler);
        f(window).on("orientationchange.slick.slick-" + this.instanceUid, f.proxy(this.orientationChange, this));
        f(window).on("resize.slick.slick-" + this.instanceUid, f.proxy(this.resize, this));
        f("[draggable!=true]", this.$slideTrack).on("dragstart", this.preventDefault);
        f(window).on("load.slick.slick-" + this.instanceUid, this.setPosition);
        f(this.setPosition)
    }
    ;
    g.prototype.initUI = function() {
        !0 === this.options.arrows && this.slideCount > this.options.slidesToShow && (this.$prevArrow.show(),
        this.$nextArrow.show());
        !0 === this.options.dots && this.slideCount > this.options.slidesToShow && this.$dots.show()
    }
    ;
    g.prototype.keyHandler = function(a) {
        a.target.tagName.match("TEXTAREA|INPUT|SELECT") || (37 === a.keyCode && !0 === this.options.accessibility ? this.changeSlide({
            data: {
                message: !0 === this.options.rtl ? "next" : "previous"
            }
        }) : 39 === a.keyCode && !0 === this.options.accessibility && this.changeSlide({
            data: {
                message: !0 === this.options.rtl ? "previous" : "next"
            }
        }))
    }
    ;
    g.prototype.lazyLoad = function() {
        function a(m) {
            f("img[data-lazy]", m).each(function() {
                var l = f(this)
                  , n = f(this).attr("data-lazy")
                  , p = f(this).attr("data-srcset")
                  , r = f(this).attr("data-sizes") || b.$slider.attr("data-sizes")
                  , q = document.createElement("img");
                q.onload = function() {
                    l.animate({
                        opacity: 0
                    }, 100, function() {
                        p && (l.attr("srcset", p),
                        r && l.attr("sizes", r));
                        l.attr("src", n).animate({
                            opacity: 1
                        }, 200, function() {
                            l.removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading")
                        });
                        b.$slider.trigger("lazyLoaded", [b, l, n])
                    })
                }
                ;
                q.onerror = function() {
                    l.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error");
                    b.$slider.trigger("lazyLoadError", [b, l, n])
                }
                ;
                q.src = n
            })
        }
        var b = this;
        if (!0 === b.options.centerMode)
            if (!0 === b.options.infinite) {
                var c = b.currentSlide + (b.options.slidesToShow / 2 + 1);
                var e = c + b.options.slidesToShow + 2
            } else
                c = Math.max(0, b.currentSlide - (b.options.slidesToShow / 2 + 1)),
                e = 2 + (b.options.slidesToShow / 2 + 1) + b.currentSlide;
        else
            c = b.options.infinite ? b.options.slidesToShow + b.currentSlide : b.currentSlide,
            e = Math.ceil(c + b.options.slidesToShow),
            !0 === b.options.fade && (0 < c && c--,
            e <= b.slideCount && e++);
        var d = b.$slider.find(".slick-slide").slice(c, e);
        if ("anticipated" === b.options.lazyLoad) {
            --c;
            for (var h = b.$slider.find(".slick-slide"), k = 0; k < b.options.slidesToScroll; k++)
                0 > c && (c = b.slideCount - 1),
                d = d.add(h.eq(c)),
                d = d.add(h.eq(e)),
                c--,
                e++
        }
        a(d);
        b.slideCount <= b.options.slidesToShow ? (d = b.$slider.find(".slick-slide"),
        a(d)) : b.currentSlide >= b.slideCount - b.options.slidesToShow ? (d = b.$slider.find(".slick-cloned").slice(0, b.options.slidesToShow),
        a(d)) : 0 === b.currentSlide && (d = b.$slider.find(".slick-cloned").slice(-1 * b.options.slidesToShow),
        a(d))
    }
    ;
    g.prototype.loadSlider = function() {
        this.setPosition();
        this.$slideTrack.css({
            opacity: 1
        });
        this.$slider.removeClass("slick-loading");
        this.initUI();
        "progressive" === this.options.lazyLoad && this.progressiveLazyLoad()
    }
    ;
    g.prototype.next = g.prototype.slickNext = function() {
        this.changeSlide({
            data: {
                message: "next"
            }
        })
    }
    ;
    g.prototype.orientationChange = function() {
        this.checkResponsive();
        this.setPosition()
    }
    ;
    g.prototype.pause = g.prototype.slickPause = function() {
        this.autoPlayClear();
        this.paused = !0
    }
    ;
    g.prototype.play = g.prototype.slickPlay = function() {
        this.autoPlay();
        this.options.autoplay = !0;
        this.interrupted = this.focussed = this.paused = !1
    }
    ;
    g.prototype.postSlide = function(a) {
        this.unslicked || (this.$slider.trigger("afterChange", [this, a]),
        this.animating = !1,
        this.slideCount > this.options.slidesToShow && this.setPosition(),
        this.swipeLeft = null,
        this.options.autoplay && this.autoPlay(),
        !0 === this.options.accessibility && (this.initADA(),
        this.options.focusOnChange && f(this.$slides.get(this.currentSlide)).attr("tabindex", 0).focus()))
    }
    ;
    g.prototype.prev = g.prototype.slickPrev = function() {
        this.changeSlide({
            data: {
                message: "previous"
            }
        })
    }
    ;
    g.prototype.preventDefault = function(a) {
        a.preventDefault()
    }
    ;
    g.prototype.progressiveLazyLoad = function(a) {
        a = a || 1;
        var b = this
          , c = f("img[data-lazy]", b.$slider);
        if (c.length) {
            var e = c.first();
            var d = e.attr("data-lazy");
            var h = e.attr("data-srcset");
            var k = e.attr("data-sizes") || b.$slider.attr("data-sizes");
            c = document.createElement("img");
            c.onload = function() {
                h && (e.attr("srcset", h),
                k && e.attr("sizes", k));
                e.attr("src", d).removeAttr("data-lazy data-srcset data-sizes").removeClass("slick-loading");
                !0 === b.options.adaptiveHeight && b.setPosition();
                b.$slider.trigger("lazyLoaded", [b, e, d]);
                b.progressiveLazyLoad()
            }
            ;
            c.onerror = function() {
                3 > a ? setTimeout(function() {
                    b.progressiveLazyLoad(a + 1)
                }, 500) : (e.removeAttr("data-lazy").removeClass("slick-loading").addClass("slick-lazyload-error"),
                b.$slider.trigger("lazyLoadError", [b, e, d]),
                b.progressiveLazyLoad())
            }
            ;
            c.src = d
        } else
            b.$slider.trigger("allImagesLoaded", [b])
    }
    ;
    g.prototype.refresh = function(a) {
        var b = this.slideCount - this.options.slidesToShow;
        !this.options.infinite && this.currentSlide > b && (this.currentSlide = b);
        this.slideCount <= this.options.slidesToShow && (this.currentSlide = 0);
        b = this.currentSlide;
        this.destroy(!0);
        f.extend(this, this.initials, {
            currentSlide: b
        });
        this.init();
        a || this.changeSlide({
            data: {
                message: "index",
                index: b
            }
        }, !1)
    }
    ;
    g.prototype.registerBreakpoints = function() {
        var a = this, b, c, e = a.options.responsive || null;
        if ("array" === f.type(e) && e.length) {
            a.respondTo = a.options.respondTo || "window";
            for (b in e) {
                var d = a.breakpoints.length - 1;
                if (e.hasOwnProperty(b)) {
                    for (c = e[b].breakpoint; 0 <= d; )
                        a.breakpoints[d] && a.breakpoints[d] === c && a.breakpoints.splice(d, 1),
                        d--;
                    a.breakpoints.push(c);
                    a.breakpointSettings[c] = e[b].settings
                }
            }
            a.breakpoints.sort(function(h, k) {
                return a.options.mobileFirst ? h - k : k - h
            })
        }
    }
    ;
    g.prototype.reinit = function() {
        this.$slides = this.$slideTrack.children(this.options.slide).addClass("slick-slide");
        this.slideCount = this.$slides.length;
        this.currentSlide >= this.slideCount && 0 !== this.currentSlide && (this.currentSlide -= this.options.slidesToScroll);
        this.slideCount <= this.options.slidesToShow && (this.currentSlide = 0);
        this.registerBreakpoints();
        this.setProps();
        this.setupInfinite();
        this.buildArrows();
        this.updateArrows();
        this.initArrowEvents();
        this.buildDots();
        this.updateDots();
        this.initDotEvents();
        this.cleanUpSlideEvents();
        this.initSlideEvents();
        this.checkResponsive(!1, !0);
        if (!0 === this.options.focusOnSelect)
            f(this.$slideTrack).children().on("click.slick", this.selectHandler);
        this.setSlideClasses("number" === typeof this.currentSlide ? this.currentSlide : 0);
        this.setPosition();
        this.focusHandler();
        this.paused = !this.options.autoplay;
        this.autoPlay();
        this.$slider.trigger("reInit", [this])
    }
    ;
    g.prototype.resize = function() {
        var a = this;
        f(window).width() !== a.windowWidth && (clearTimeout(a.windowDelay),
        a.windowDelay = window.setTimeout(function() {
            a.windowWidth = f(window).width();
            a.checkResponsive();
            a.unslicked || a.setPosition()
        }, 50))
    }
    ;
    g.prototype.removeSlide = g.prototype.slickRemove = function(a, b, c) {
        a = "boolean" === typeof a ? !0 === a ? 0 : this.slideCount - 1 : !0 === b ? --a : a;
        if (1 > this.slideCount || 0 > a || a > this.slideCount - 1)
            return !1;
        this.unload();
        !0 === c ? this.$slideTrack.children().remove() : this.$slideTrack.children(this.options.slide).eq(a).remove();
        this.$slides = this.$slideTrack.children(this.options.slide);
        this.$slideTrack.children(this.options.slide).detach();
        this.$slideTrack.append(this.$slides);
        this.$slidesCache = this.$slides;
        this.reinit()
    }
    ;
    g.prototype.setCSS = function(a) {
        var b = {};
        !0 === this.options.rtl && (a = -a);
        var c = "left" == this.positionProp ? Math.ceil(a) + "px" : "0px";
        var e = "top" == this.positionProp ? Math.ceil(a) + "px" : "0px";
        b[this.positionProp] = a;
        !1 !== this.transformsEnabled && (b = {},
        b[this.animType] = !1 === this.cssTransitions ? "translate(" + c + ", " + e + ")" : "translate3d(" + c + ", " + e + ", 0px)");
        this.$slideTrack.css(b)
    }
    ;
    g.prototype.setDimensions = function() {
        !1 === this.options.vertical ? !0 === this.options.centerMode && this.$list.css({
            padding: "0px " + this.options.centerPadding
        }) : (this.$list.height(this.$slides.first().outerHeight(!0) * this.options.slidesToShow),
        !0 === this.options.centerMode && this.$list.css({
            padding: this.options.centerPadding + " 0px"
        }));
        this.listWidth = this.$list.width();
        this.listHeight = this.$list.height();
        !1 === this.options.vertical && !1 === this.options.variableWidth ? (this.slideWidth = Math.ceil(this.listWidth / this.options.slidesToShow),
        this.$slideTrack.width(Math.ceil(this.slideWidth * this.$slideTrack.children(".slick-slide").length))) : !0 === this.options.variableWidth ? this.$slideTrack.width(5E3 * this.slideCount) : (this.slideWidth = Math.ceil(this.listWidth),
        this.$slideTrack.height(Math.ceil(this.$slides.first().outerHeight(!0) * this.$slideTrack.children(".slick-slide").length)));
        var a = this.$slides.first().outerWidth(!0) - this.$slides.first().width();
        !1 === this.options.variableWidth && this.$slideTrack.children(".slick-slide").width(this.slideWidth - a)
    }
    ;
    g.prototype.setFade = function() {
        var a = this, b;
        a.$slides.each(function(c, e) {
            b = a.slideWidth * c * -1;
            !0 === a.options.rtl ? f(e).css({
                position: "relative",
                right: b,
                top: 0,
                zIndex: a.options.zIndex - 2,
                opacity: 0
            }) : f(e).css({
                position: "relative",
                left: b,
                top: 0,
                zIndex: a.options.zIndex - 2,
                opacity: 0
            })
        });
        a.$slides.eq(a.currentSlide).css({
            zIndex: a.options.zIndex - 1,
            opacity: 1
        })
    }
    ;
    g.prototype.setHeight = function() {
        if (1 === this.options.slidesToShow && !0 === this.options.adaptiveHeight && !1 === this.options.vertical) {
            var a = this.$slides.eq(this.currentSlide).outerHeight(!0);
            this.$list.css("height", a)
        }
    }
    ;
    g.prototype.setOption = g.prototype.slickSetOption = function(a, b, c) {
        var e = this, d, h = !1;
        if ("object" === f.type(a)) {
            var k = a;
            h = b;
            var m = "multiple"
        } else if ("string" === f.type(a)) {
            k = a;
            var l = b;
            h = c;
            "responsive" === a && "array" === f.type(b) ? m = "responsive" : "undefined" !== typeof b && (m = "single")
        }
        if ("single" === m)
            e.options[k] = l;
        else if ("multiple" === m)
            f.each(k, function(n, p) {
                e.options[n] = p
            });
        else if ("responsive" === m)
            for (d in l)
                if ("array" !== f.type(e.options.responsive))
                    e.options.responsive = [l[d]];
                else {
                    for (a = e.options.responsive.length - 1; 0 <= a; )
                        e.options.responsive[a].breakpoint === l[d].breakpoint && e.options.responsive.splice(a, 1),
                        a--;
                    e.options.responsive.push(l[d])
                }
        h && (e.unload(),
        e.reinit())
    }
    ;
    g.prototype.setPosition = function() {
        this.setDimensions();
        this.setHeight();
        !1 === this.options.fade ? this.setCSS(this.getLeft(this.currentSlide)) : this.setFade();
        this.$slider.trigger("setPosition", [this])
    }
    ;
    g.prototype.setProps = function() {
        var a = document.body.style;
        this.positionProp = !0 === this.options.vertical ? "top" : "left";
        "top" === this.positionProp ? this.$slider.addClass("slick-vertical") : this.$slider.removeClass("slick-vertical");
        void 0 === a.WebkitTransition && void 0 === a.MozTransition && void 0 === a.msTransition || !0 !== this.options.useCSS || (this.cssTransitions = !0);
        this.options.fade && ("number" === typeof this.options.zIndex ? 3 > this.options.zIndex && (this.options.zIndex = 3) : this.options.zIndex = this.defaults.zIndex);
        void 0 !== a.OTransform && (this.animType = "OTransform",
        this.transformType = "-o-transform",
        this.transitionType = "OTransition",
        void 0 === a.perspectiveProperty && void 0 === a.webkitPerspective && (this.animType = !1));
        void 0 !== a.MozTransform && (this.animType = "MozTransform",
        this.transformType = "-moz-transform",
        this.transitionType = "MozTransition",
        void 0 === a.perspectiveProperty && void 0 === a.MozPerspective && (this.animType = !1));
        void 0 !== a.webkitTransform && (this.animType = "webkitTransform",
        this.transformType = "-webkit-transform",
        this.transitionType = "webkitTransition",
        void 0 === a.perspectiveProperty && void 0 === a.webkitPerspective && (this.animType = !1));
        void 0 !== a.msTransform && (this.animType = "msTransform",
        this.transformType = "-ms-transform",
        this.transitionType = "msTransition",
        void 0 === a.msTransform && (this.animType = !1));
        void 0 !== a.transform && !1 !== this.animType && (this.transformType = this.animType = "transform",
        this.transitionType = "transition");
        this.transformsEnabled = this.options.useTransform && null !== this.animType && !1 !== this.animType
    }
    ;
    g.prototype.setSlideClasses = function(a) {
        var b = this.$slider.find(".slick-slide").removeClass("slick-active slick-center slick-current").attr("aria-hidden", "true");
        this.$slides.eq(a).addClass("slick-current");
        if (!0 === this.options.centerMode) {
            var c = 0 === this.options.slidesToShow % 2 ? 1 : 0;
            var e = Math.floor(this.options.slidesToShow / 2);
            if (!0 === this.options.infinite) {
                if (a >= e && a <= this.slideCount - 1 - e)
                    this.$slides.slice(a - e + c, a + e + 1).addClass("slick-active").attr("aria-hidden", "false");
                else {
                    var d = this.options.slidesToShow + a;
                    b.slice(d - e + 1 + c, d + e + 2).addClass("slick-active").attr("aria-hidden", "false")
                }
                0 === a ? b.eq(b.length - 1 - this.options.slidesToShow).addClass("slick-center") : a === this.slideCount - 1 && b.eq(this.options.slidesToShow).addClass("slick-center")
            }
            this.$slides.eq(a).addClass("slick-center")
        } else
            0 <= a && a <= this.slideCount - this.options.slidesToShow ? this.$slides.slice(a, a + this.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false") : b.length <= this.options.slidesToShow ? b.addClass("slick-active").attr("aria-hidden", "false") : (e = this.slideCount % this.options.slidesToShow,
            d = !0 === this.options.infinite ? this.options.slidesToShow + a : a,
            this.options.slidesToShow == this.options.slidesToScroll && this.slideCount - a < this.options.slidesToShow ? b.slice(d - (this.options.slidesToShow - e), d + e).addClass("slick-active").attr("aria-hidden", "false") : b.slice(d, d + this.options.slidesToShow).addClass("slick-active").attr("aria-hidden", "false"));
        "ondemand" !== this.options.lazyLoad && "anticipated" !== this.options.lazyLoad || this.lazyLoad()
    }
    ;
    g.prototype.setupInfinite = function() {
        var a;
        !0 === this.options.fade && (this.options.centerMode = !1);
        if (!0 === this.options.infinite && !1 === this.options.fade) {
            var b = null;
            if (this.slideCount > this.options.slidesToShow) {
                var c = !0 === this.options.centerMode ? this.options.slidesToShow + 1 : this.options.slidesToShow;
                for (a = this.slideCount; a > this.slideCount - c; --a)
                    b = a - 1,
                    f(this.$slides[b]).clone(!0).attr("id", "").attr("data-slick-index", b - this.slideCount).prependTo(this.$slideTrack).addClass("slick-cloned");
                for (a = 0; a < c + this.slideCount; a += 1)
                    b = a,
                    f(this.$slides[b]).clone(!0).attr("id", "").attr("data-slick-index", b + this.slideCount).appendTo(this.$slideTrack).addClass("slick-cloned");
                this.$slideTrack.find(".slick-cloned").find("[id]").each(function() {
                    f(this).attr("id", "")
                })
            }
        }
    }
    ;
    g.prototype.interrupt = function(a) {
        a || this.autoPlay();
        this.interrupted = a
    }
    ;
    g.prototype.selectHandler = function(a) {
        a = f(a.target).is(".slick-slide") ? f(a.target) : f(a.target).parents(".slick-slide");
        (a = parseInt(a.attr("data-slick-index"))) || (a = 0);
        this.slideCount <= this.options.slidesToShow ? this.slideHandler(a, !1, !0) : this.slideHandler(a)
    }
    ;
    g.prototype.slideHandler = function(a, b, c) {
        var e = null
          , d = this;
        if (!0 !== d.animating || !0 !== d.options.waitForAnimate)
            if (!0 !== d.options.fade || d.currentSlide !== a) {
                !1 === (b || !1) && d.asNavFor(a);
                var h = a;
                e = d.getLeft(h);
                b = d.getLeft(d.currentSlide);
                d.currentLeft = null === d.swipeLeft ? b : d.swipeLeft;
                if (!1 === d.options.infinite && !1 === d.options.centerMode && (0 > a || a > d.getDotCount() * d.options.slidesToScroll))
                    !1 === d.options.fade && (h = d.currentSlide,
                    !0 !== c && d.slideCount > d.options.slidesToShow ? d.animateSlide(b, function() {
                        d.postSlide(h)
                    }) : d.postSlide(h));
                else if (!1 === d.options.infinite && !0 === d.options.centerMode && (0 > a || a > d.slideCount - d.options.slidesToScroll))
                    !1 === d.options.fade && (h = d.currentSlide,
                    !0 !== c && d.slideCount > d.options.slidesToShow ? d.animateSlide(b, function() {
                        d.postSlide(h)
                    }) : d.postSlide(h));
                else {
                    d.options.autoplay && clearInterval(d.autoPlayTimer);
                    var k = 0 > h ? 0 !== d.slideCount % d.options.slidesToScroll ? d.slideCount - d.slideCount % d.options.slidesToScroll : d.slideCount + h : h >= d.slideCount ? 0 !== d.slideCount % d.options.slidesToScroll ? 0 : h - d.slideCount : h;
                    d.animating = !0;
                    d.$slider.trigger("beforeChange", [d, d.currentSlide, k]);
                    a = d.currentSlide;
                    d.currentSlide = k;
                    d.setSlideClasses(d.currentSlide);
                    d.options.asNavFor && (b = d.getNavTarget(),
                    b = b.slick("getSlick"),
                    b.slideCount <= b.options.slidesToShow && b.setSlideClasses(d.currentSlide));
                    d.updateDots();
                    d.updateArrows();
                    !0 === d.options.fade ? (!0 !== c ? (d.fadeSlideOut(a),
                    d.fadeSlide(k, function() {
                        d.postSlide(k)
                    })) : d.postSlide(k),
                    d.animateHeight()) : !0 !== c && d.slideCount > d.options.slidesToShow ? d.animateSlide(e, function() {
                        d.postSlide(k)
                    }) : d.postSlide(k)
                }
            }
    }
    ;
    g.prototype.startLoad = function() {
        !0 === this.options.arrows && this.slideCount > this.options.slidesToShow && (this.$prevArrow.hide(),
        this.$nextArrow.hide());
        !0 === this.options.dots && this.slideCount > this.options.slidesToShow && this.$dots.hide();
        this.$slider.addClass("slick-loading")
    }
    ;
    g.prototype.swipeDirection = function() {
        var a = Math.round(180 * Math.atan2(this.touchObject.startY - this.touchObject.curY, this.touchObject.startX - this.touchObject.curX) / Math.PI);
        0 > a && (a = 360 - Math.abs(a));
        return 45 >= a && 0 <= a || 360 >= a && 315 <= a ? !1 === this.options.rtl ? "left" : "right" : 135 <= a && 225 >= a ? !1 === this.options.rtl ? "right" : "left" : !0 === this.options.verticalSwiping ? 35 <= a && 135 >= a ? "down" : "up" : "vertical"
    }
    ;
    g.prototype.swipeEnd = function(a) {
        this.swiping = this.dragging = !1;
        if (this.scrolling)
            return this.scrolling = !1;
        this.interrupted = !1;
        this.shouldClick = 10 < this.touchObject.swipeLength ? !1 : !0;
        if (void 0 === this.touchObject.curX)
            return !1;
        !0 === this.touchObject.edgeHit && this.$slider.trigger("edge", [this, this.swipeDirection()]);
        if (this.touchObject.swipeLength >= this.touchObject.minSwipe) {
            a = this.swipeDirection();
            switch (a) {
            case "left":
            case "down":
                var b = this.options.swipeToSlide ? this.checkNavigable(this.currentSlide + this.getSlideCount()) : this.currentSlide + this.getSlideCount();
                this.currentDirection = 0;
                break;
            case "right":
            case "up":
                b = this.options.swipeToSlide ? this.checkNavigable(this.currentSlide - this.getSlideCount()) : this.currentSlide - this.getSlideCount(),
                this.currentDirection = 1
            }
            "vertical" != a && (this.slideHandler(b),
            this.touchObject = {},
            this.$slider.trigger("swipe", [this, a]))
        } else
            this.touchObject.startX !== this.touchObject.curX && (this.slideHandler(this.currentSlide),
            this.touchObject = {})
    }
    ;
    g.prototype.swipeHandler = function(a) {
        if (!(!1 === this.options.swipe || "ontouchend"in document && !1 === this.options.swipe || !1 === this.options.draggable && -1 !== a.type.indexOf("mouse")))
            switch (this.touchObject.fingerCount = a.originalEvent && void 0 !== a.originalEvent.touches ? a.originalEvent.touches.length : 1,
            this.touchObject.minSwipe = this.listWidth / this.options.touchThreshold,
            !0 === this.options.verticalSwiping && (this.touchObject.minSwipe = this.listHeight / this.options.touchThreshold),
            a.data.action) {
            case "start":
                this.swipeStart(a);
                break;
            case "move":
                this.swipeMove(a);
                break;
            case "end":
                this.swipeEnd(a)
            }
    }
    ;
    g.prototype.swipeMove = function(a) {
        var b = void 0 !== a.originalEvent ? a.originalEvent.touches : null;
        if (!this.dragging || this.scrolling || b && 1 !== b.length)
            return !1;
        var c = this.getLeft(this.currentSlide);
        this.touchObject.curX = void 0 !== b ? b[0].pageX : a.clientX;
        this.touchObject.curY = void 0 !== b ? b[0].pageY : a.clientY;
        this.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(this.touchObject.curX - this.touchObject.startX, 2)));
        b = Math.round(Math.sqrt(Math.pow(this.touchObject.curY - this.touchObject.startY, 2)));
        if (!this.options.verticalSwiping && !this.swiping && 4 < b)
            return this.scrolling = !0,
            !1;
        !0 === this.options.verticalSwiping && (this.touchObject.swipeLength = b);
        b = this.swipeDirection();
        void 0 !== a.originalEvent && 4 < this.touchObject.swipeLength && (this.swiping = !0,
        a.preventDefault());
        var e = (!1 === this.options.rtl ? 1 : -1) * (this.touchObject.curX > this.touchObject.startX ? 1 : -1);
        !0 === this.options.verticalSwiping && (e = this.touchObject.curY > this.touchObject.startY ? 1 : -1);
        a = this.touchObject.swipeLength;
        this.touchObject.edgeHit = !1;
        !1 === this.options.infinite && (0 === this.currentSlide && "right" === b || this.currentSlide >= this.getDotCount() && "left" === b) && (a = this.touchObject.swipeLength * this.options.edgeFriction,
        this.touchObject.edgeHit = !0);
        this.swipeLeft = !1 === this.options.vertical ? c + a * e : c + a * (this.$list.height() / this.listWidth) * e;
        !0 === this.options.verticalSwiping && (this.swipeLeft = c + a * e);
        if (!0 === this.options.fade || !1 === this.options.touchMove)
            return !1;
        if (!0 === this.animating)
            return this.swipeLeft = null,
            !1;
        this.setCSS(this.swipeLeft)
    }
    ;
    g.prototype.swipeStart = function(a) {
        var b;
        this.interrupted = !0;
        if (1 !== this.touchObject.fingerCount || this.slideCount <= this.options.slidesToShow)
            return this.touchObject = {},
            !1;
        void 0 !== a.originalEvent && void 0 !== a.originalEvent.touches && (b = a.originalEvent.touches[0]);
        this.touchObject.startX = this.touchObject.curX = void 0 !== b ? b.pageX : a.clientX;
        this.touchObject.startY = this.touchObject.curY = void 0 !== b ? b.pageY : a.clientY;
        this.dragging = !0
    }
    ;
    g.prototype.unfilterSlides = g.prototype.slickUnfilter = function() {
        null !== this.$slidesCache && (this.unload(),
        this.$slideTrack.children(this.options.slide).detach(),
        this.$slidesCache.appendTo(this.$slideTrack),
        this.reinit())
    }
    ;
    g.prototype.unload = function() {
        f(".slick-cloned", this.$slider).remove();
        this.$dots && this.$dots.remove();
        this.$prevArrow && this.htmlExpr.test(this.options.prevArrow) && this.$prevArrow.remove();
        this.$nextArrow && this.htmlExpr.test(this.options.nextArrow) && this.$nextArrow.remove();
        this.$slides.removeClass("slick-slide slick-active slick-visible slick-current").attr("aria-hidden", "true").css("width", "")
    }
    ;
    g.prototype.unslick = function(a) {
        this.$slider.trigger("unslick", [this, a]);
        this.destroy()
    }
    ;
    g.prototype.updateArrows = function() {
        !0 === this.options.arrows && this.slideCount > this.options.slidesToShow && !this.options.infinite && (this.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
        this.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false"),
        0 === this.currentSlide ? (this.$prevArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        this.$nextArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : this.currentSlide >= this.slideCount - this.options.slidesToShow && !1 === this.options.centerMode ? (this.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        this.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")) : this.currentSlide >= this.slideCount - 1 && !0 === this.options.centerMode && (this.$nextArrow.addClass("slick-disabled").attr("aria-disabled", "true"),
        this.$prevArrow.removeClass("slick-disabled").attr("aria-disabled", "false")))
    }
    ;
    g.prototype.updateDots = function() {
        null !== this.$dots && (this.$dots.find("li").removeClass("slick-active").end(),
        this.$dots.find("li").eq(Math.floor(this.currentSlide / this.options.slidesToScroll)).addClass("slick-active"))
    }
    ;
    g.prototype.visibility = function() {
        this.options.autoplay && (this.interrupted = document[this.hidden] ? !0 : !1)
    }
    ;
    f.fn.slick = function() {
        var a = arguments[0], b = Array.prototype.slice.call(arguments, 1), c = this.length, e, d;
        for (e = 0; e < c; e++)
            if ("object" == typeof a || "undefined" == typeof a ? this[e].slick = new g(this[e],a) : d = this[e].slick[a].apply(this[e].slick, b),
            "undefined" != typeof d)
                return d;
        return this
    }
});
