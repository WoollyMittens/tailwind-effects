(function () {

    "use strict";

	localStorage.setItem("twfx", "off");

	const tailwindProps = {};
	
	const tailwindRegister = {};

	class Intersections {
		constructor(options) {
			this.options = options;
			this.observer = new IntersectionObserver(this.handle.bind(this), this.options);
		}
		watch(elem) {
			this.observer.observe(elem);
		}
		handle(intersections, observer) {
			for (let intersection of intersections) {
				let evt = new CustomEvent("visible", {
					bubbles: true,
					cancelable: false,
					detail: {
						intersection: intersection,
						observer: observer,
					},
				});
				intersection.target.dispatchEvent(evt);
			}
		}
	}

	const tailwindIntersections = new Intersections({
		root: null,
		rootMargin: "0px 0px 0px 0px",
		threshold: [0],
	});

	class Mutations {
		constructor(options) {
			this.options = options;
			this.observer = new MutationObserver(this.handle.bind(this));
		}
		watch(elem, options) {
			this.observer.observe(elem, options || this.options);
		}
		handle(mutations, observer) {
			for (let mutation of mutations) {
				let evt = new CustomEvent("change", {
					bubbles: true,
					cancelable: false,
					detail: {
						mutation: mutation,
						observer: observer,
					},
				});
				mutation.target.dispatchEvent(evt);
			}
		}
	}

	const tailwindMutations = new Mutations({
		attributes: true,
		childList: false,
		subtree: false,
	});

	const tailwindBehaviors = {
		".twfx-relocate": class {
			constructor(elem) {
				const dataDestination = elem.getAttribute("data-destination");
				const destination = document.querySelector(dataDestination);
				destination.appendChild(elem);
			}
		},
		".twfx-template": class {
			constructor(elem) {
                this.dataTemplate = elem.getAttribute("data-template");
                this.template = document.querySelector(this.dataTemplate) || elem.querySelector("template");
                this.populated = null;
				tailwindIntersections.watch(elem);
				elem.addEventListener("visible", this.reveal.bind(this, elem));
				tailwindMutations.watch(elem);
				elem.addEventListener("change", this.update.bind(this, elem));
			}
			populate(elem) {
				let html = this.template.innerHTML;
				for (let attribute of elem.attributes) {
					html = html.replace(new RegExp(`\\{${attribute.nodeName}\\}`, "g"), attribute.nodeValue);
				}
				elem.innerHTML = html;
			}
            reveal(elem, evt) {
                if (evt.detail.intersection.isIntersecting) {
                    evt.detail.observer.unobserve(elem);
                    this.update(elem);
                }
            }
            update(elem, evt) {
                this.populate(elem);
                elem.dispatchEvent(new Event("completed"));
            }
		},
		".twfx-direction": class {
			constructor(elem) {
				if (!tailwindProps.directionObserver) {
					tailwindProps.directionPrevious = 0;
					tailwindProps.directionElements = [];
					tailwindProps.directionObserver = this.direction.bind(this);
					window.addEventListener("scroll", tailwindProps.directionObserver, {
						capture: false,
						passive: true,
					});
				}
				tailwindProps.directionElements.push(elem);
			}
			direction(evt) {
				const position = window.scrollY;
				for (let element of tailwindProps.directionElements) {
					let dataUp = element.getAttribute("data-up");
					let dataDown = element.getAttribute("data-down");
					element.className =
						position >= tailwindProps.directionPrevious
							? element.className.replace(dataUp, dataDown)
							: element.className.replace(dataDown, dataUp);
				}
				tailwindProps.directionPrevious = position;
			}
		},
		".twfx-scrollto": class {
			constructor(elem) {
				elem.addEventListener("click", this.scroll.bind(this, elem));
			}
			scroll(elem, evt) {
				evt.preventDefault();
				const id = elem.getAttribute("href").split("#").pop();
				const target = document.getElementById(id);
				if (target) target.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
			}
		},
		".twfx-reveal": class {
			constructor(elem) {
				this.dataPassive = elem.getAttribute("data-passive");
				this.dataActive = elem.getAttribute("data-active");
				tailwindIntersections.watch(elem);
				elem.addEventListener("visible", this.update.bind(this, elem));
			}
			update(elem, evt) {
				if (evt.detail.intersection.isIntersecting) {
					elem.className = elem.className.replace(this.dataPassive, this.dataActive);
					evt.detail.observer.unobserve(elem);
				}
			}
		},
		".twfx-accordion, .twfx-tabs": class {
			constructor(elem) {
				this.dataTitle = elem.getAttribute("data-title");
				this.dataPassive = elem.getAttribute("data-passive");
				this.dataActive = elem.getAttribute("data-active");
				this.dataDescriptions = elem.getAttribute("data-descriptions");
				this.dataClosed = elem.getAttribute("data-closed");
				this.dataOpen = elem.getAttribute("data-open");
				this.dataExlusive = elem.hasAttribute("data-exclusive");
				this.titles = [...elem.querySelectorAll(this.dataTitle)];
				this.descriptions = [...elem.querySelectorAll(this.dataDescriptions)];
				for (let index in this.titles) {
					this.titles[index].addEventListener(
						"click",
						this.toggle.bind(this, this.titles[index], this.descriptions[index])
					);
				}
			}
			reset() {
				for (let index in this.titles) {
					let title = this.titles[index];
					let desc = this.descriptions[index];
					title.className = title.className.replace(this.dataActive, this.dataPassive);
					desc.className = desc.className.replace(this.dataOpen, this.dataClosed);
				}
			}
			toggle(title, description, evt) {
				evt.preventDefault();
				if (this.dataExlusive) this.reset();
				title.className = title.className.includes(this.dataPassive)
					? title.className.replace(this.dataPassive, this.dataActive)
					: title.className.replace(this.dataActive, this.dataPassive);
				description.className = description.className.includes(this.dataClosed)
					? description.className.replace(this.dataClosed, this.dataOpen)
					: description.className.replace(this.dataOpen, this.dataClosed);
			}
		},
		".twfx-toggle": class {
			constructor(elem) {
				this.dataPassive = elem.getAttribute("data-passive");
				this.dataActive = elem.getAttribute("data-active");
				this.dataParent = elem.getAttribute("data-parent");
				this.dataTarget = elem.getAttribute("data-target") || elem.getAttribute("href");
				this.dataClosed = elem.getAttribute("data-closed");
				this.dataOpen = elem.getAttribute("data-open");
				const container = this.dataParent ? this.parent(elem, this.dataParent) : document.body;
				const target = container.querySelector(this.dataTarget);
				elem.addEventListener("click", this.toggle.bind(this, elem, target));
			}
			parent(elem, levels) {
				if (isNaN(levels)) return document.querySelector(levels);
				while (+levels-- && !/body/i.test(elem.nodeName)) {
					elem = elem.parentNode;
				}
				return elem;
			}
			toggle(elem, target, evt) {
				evt.preventDefault();
				elem.className = elem.className.includes(this.dataPassive)
					? elem.className.replace(this.dataPassive, this.dataActive)
					: elem.className.replace(this.dataActive, this.dataPassive);
				target.className = target.className.includes(this.dataClosed)
					? target.className.replace(this.dataClosed, this.dataOpen)
					: target.className.replace(this.dataOpen, this.dataClosed);
			}
		},
		".twfx-hero, .twfx-carousel": class {
			constructor(elem) {
				this.dataSlider = elem.getAttribute("data-slider");
				this.dataSlides = elem.getAttribute("data-slides");
				this.dataNav = elem.getAttribute("data-nav");
				this.dataNavPrev = elem.getAttribute("data-nav-prev");
				this.dataNavNext = elem.getAttribute("data-nav-next");
				this.dataNavPassive = elem.getAttribute("data-nav-passive");
				this.dataNavActive = elem.getAttribute("data-nav-active");
				this.dataDots = elem.getAttribute("data-dots");
				this.dataDot = elem.getAttribute("data-dot");
				this.dataDotPassive = elem.getAttribute("data-dot-passive");
				this.dataDotActive = elem.getAttribute("data-dot-active");
                this.dataIdle = elem.getAttribute("data-idle");
				this.scroller = elem.querySelector(this.dataSlider);
				this.previous = null;
				this.distance = 0;
				this.indicatorNav = document.createElement("nav");
				this.indicatorNav.setAttribute("class", `twfx-dots ${this.dataDots}`);
				this.scroller.parentNode.appendChild(this.indicatorNav);
				this.indicatorButtons = [];
				this.slides = [...elem.querySelectorAll(this.dataSlides)];
				this.slidesPerPage = Math.round(this.scroller.offsetWidth / this.slides[0].offsetWidth);
				for (let index in this.slides) {
					if (index % this.slidesPerPage === 0) {
						this.slides[index].addEventListener("click", this.capture.bind(this));
						let indicatorButton = document.createElement("button");
						indicatorButton.innerHTML = +index + 1;
						indicatorButton.setAttribute("class", this.dataDot);
						this.indicatorButtons.push(indicatorButton);
						indicatorButton.addEventListener("click", this.focus.bind(this, this.slides[index]));
						if (this.dataDots) this.indicatorNav.appendChild(indicatorButton);
					}
				}
				this.nextButton = document.createElement("button");
				this.nextButton.innerHTML = "Next";
				this.nextButton.setAttribute("class", `twfx-next ${this.dataNav} ${this.dataNavNext}`);
				this.nextButton.addEventListener("click", this.cycle.bind(this, this.slidesPerPage));
				if (this.dataNav) this.scroller.parentNode.appendChild(this.nextButton);
				this.prevButton = document.createElement("button");
				this.prevButton.innerHTML = "Previous";
				this.prevButton.setAttribute("class", `twfx-prev ${this.dataNav} ${this.dataNavPrev}`);
				this.prevButton.addEventListener("click", this.cycle.bind(this, -this.slidesPerPage));
				if (this.dataNav) this.scroller.parentNode.appendChild(this.prevButton);
				this.scroller.addEventListener("mousedown", this.startDrag.bind(this));
				this.scroller.addEventListener("mousemove", this.handleDrag.bind(this));
				this.scroller.addEventListener("mouseup", this.endDrag.bind(this));
				this.scroller.addEventListener("touchstart", this.endIdle.bind(this), { passive: true });
				this.scroller.addEventListener("scroll", this.manualScroll.bind(this), { passive: true });
				this.redraw(this.slides[0]);
				this.idleDirection = this.slidesPerPage;
				this.idleTimeout = this.dataIdle ? setInterval(this.idle.bind(this), +this.dataIdle) : null;
			}
			startDrag(evt) {
				if (window.matchMedia("(pointer:fine)")) this.previous = evt.clientX;
			}
			handleDrag(evt) {
				clearTimeout(this.idleTimeout);
				if (this.previous !== null) {
					evt.preventDefault(evt);
					let current = evt.clientX;
					let offset = current - this.previous;
					this.scroller.scrollBy({ left: -offset });
					this.distance += offset;
					this.previous = current;
				}
			}
			endDrag(evt) {
				this.previous = null;
				this.focus();
				setTimeout(() => {
					this.distance = 0;
				}, 1000);
			}
			endIdle(evt) {
				clearTimeout(this.idleTimeout);
			}
			manualScroll(evt) {
				this.redraw(this.closest());
			}
			idle() {
				const sliderRect = this.scroller.getBoundingClientRect();
				const offScreen = sliderRect.bottom > window.innerHeight || sliderRect.top < 0;
				const atFarSide = this.nextButton.className.includes(this.dataNavPassive) && this.idleDirection > 0;
				const atNearSide = this.prevButton.className.includes(this.dataNavPassive) && this.idleDirection < 0;
				if (atFarSide || atNearSide) this.idleDirection = -this.idleDirection;
				if (!offScreen) this.cycle(this.idleDirection);
			}
			redraw(slide) {
				const activeIndex = this.slides.indexOf(slide);
				this.prevButton.className =
					activeIndex <= 0
						? this.prevButton.className.replace(this.dataNavActive, this.dataNavPassive)
						: this.prevButton.className.replace(this.dataNavPassive, this.dataNavActive);
				this.nextButton.className =
					activeIndex >= this.slides.length - this.slidesPerPage
						? this.nextButton.className.replace(this.dataNavActive, this.dataNavPassive)
						: this.nextButton.className.replace(this.dataNavPassive, this.dataNavActive);
				for (let buttonIndex in this.indicatorButtons) {
					this.indicatorButtons[buttonIndex].className =
						+buttonIndex === Math.round(activeIndex / this.slidesPerPage)
							? this.indicatorButtons[buttonIndex].className.replace(
									this.dataDotPassive,
									this.dataDotActive
							  )
							: this.indicatorButtons[buttonIndex].className.replace(
									this.dataDotActive,
									this.dataDotPassive
							  );
				}
			}
			focus(slide) {
				if (!slide) slide = this.closest();
				slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
				this.redraw(slide);
			}
			closest() {
				const sliderRect = this.scroller.getBoundingClientRect();
				for (let slide of this.slides) {
					let slideRect = slide.getBoundingClientRect();
					let slideCenter = slideRect.left - sliderRect.left + slideRect.width / 2;
					if (slideCenter > 0 && slideCenter < sliderRect.width) return slide;
				}
				return this.slides[this.slides.length - 1];
			}
			cycle(direction, evt) {
				if (evt) {
					evt.preventDefault();
					clearTimeout(this.idleTimeout);
				}
				const currentIndex = this.slides.indexOf(this.closest());
				const nextIndex = Math.max(Math.min(currentIndex + direction, this.slides.length - 1), 0);
				this.focus(this.slides[nextIndex]);
			}
			capture(evt) {
				if (Math.abs(this.distance) > 10) evt.preventDefault();
			}
		},
		".twfx-increment": class {
			constructor(elem) {
				const plusElem = document.createElement("button");
				const dataIncrement = elem.getAttribute("data-increment");
				plusElem.className = dataIncrement;
				plusElem.addEventListener("click", this.increment.bind(this, elem));
				elem.parentNode.appendChild(plusElem);
				const minusElem = document.createElement("button");
				const dataDecrement = elem.getAttribute("data-decrement");
				minusElem.className = dataDecrement;
				minusElem.addEventListener("click", this.decrement.bind(this, elem));
				elem.parentNode.appendChild(minusElem);
			}
			increment(elem, evt) {
				evt.preventDefault();
				const max = elem.getAttribute("max");
				let value = +elem.value || 0;
				elem.value = Math.min(value + 1, +max);
			}
			decrement(elem, evt) {
				evt.preventDefault();
				const min = elem.getAttribute("min") || 0;
				let value = +elem.value || 0;
				elem.value = Math.max(value - 1, +min);
			}
		},
		".twfx-totop": class {
			constructor(elem) {
				elem.addEventListener(
					"click",
					(evt) => {
						evt.preventDefault();
						evt.stopPropagation();
						window.scrollTo({ top: 0, behavior: "smooth" });
					},
					true
				);
			}
		},
	};

	function tailwindHandler(name, elems, effect) {
		for (let elem of elems) {
			if (!tailwindRegister[name].includes(elem)) {
				new effect(elem);
				tailwindRegister[name].push(elem);
			}
		}
	}

	function tailwindParser(behaviors) {
		for (let name in behaviors) {
			tailwindRegister[name] = tailwindRegister[name] || [];
			tailwindHandler(name, document.querySelectorAll(name), behaviors[name]);
		}
	}

	function tailwindWatcher() {
		clearTimeout(tailwindProps.timeout);
		tailwindProps.timeout = setTimeout(tailwindParser.bind(this, tailwindBehaviors), 100);
	}

	new MutationObserver(tailwindWatcher.bind(this)).observe(document.body, { 
		attributes: false, 
		childList: true, 
		subtree: true 
	});
	
	tailwindWatcher();

})();
