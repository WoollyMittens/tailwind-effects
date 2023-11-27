(function() {

    localStorage.setItem('twfx', 'off');

    // TODO: +/- number increment
    // TODO: if the data-attribs are not defined, don't replace classes but apply the attributes directly for vanilla mode. To tidy this up, create getters and setters for the classname

    const tailwindProps = {};

    const tailwindEffects = {
        '.twfx-direction': class {
            constructor(elem) {
                if (!tailwindProps.directionObserver) {
                    tailwindProps.directionPrevious = 0;
                    tailwindProps.directionElements = [];
                    tailwindProps.directionObserver = this.direction.bind(this);
                    window.addEventListener('scroll', tailwindProps.directionObserver, { capture:false, passive:true });
                }
                tailwindProps.directionElements.push(elem);
            }
            direction(evt) {
                const position = window.scrollY;
                for (let element of tailwindProps.directionElements) {
                    let dataUp = element.getAttribute('data-up');
                    let dataDown = element.getAttribute('data-down');
                    element.className = (position >= tailwindProps.directionPrevious) ? 
                        element.className.replace(dataUp, dataDown):
                        element.className.replace(dataDown, dataUp);
                }
                tailwindProps.directionPrevious = position;
            }
        },
        '.twfx-scrollto': class {
            constructor(elem) {
                elem.addEventListener('click', this.scroll.bind(this, elem));
            }
            scroll(elem, evt) {
                evt.preventDefault();
                const id = elem.getAttribute('href').split('#').pop();
                const target = document.getElementById(id);
                if (target) target.scrollIntoView({ behavior:"smooth", block:"center", inline:"nearest" });
            }
        },
        '.twfx-reveal': class {
            constructor(elem) {
                this.dataPassive = elem.getAttribute('data-passive');
                this.dataActive = elem.getAttribute('data-active');
                this.observer.observe(elem);
            }
            get observer() {
                if (!tailwindProps.revealObserver) {
                    tailwindProps.revealObserver = new IntersectionObserver(
                        this.update.bind(this), 
                        {root:null, rootMargin:"0px 0px 0px 0px", threshold:[0.5]}
                    );
                }
                return tailwindProps.revealObserver;
            }
            set observer(value) {
                tailwindProps.revealObserver = value;
            }
            update(intersections, observer) {
                for (let intersection of intersections) {
                    if (intersection.isIntersecting) {
                        intersection.target.className = intersection.target.className.replace(this.dataPassive, this.dataActive);
                        observer.unobserve(intersection.target);
                    }
                }
            }
        },
        '.twfx-accordion, .twfx-tabs': class {
            constructor(elem) {
                this.dataTitle = elem.getAttribute('data-title');
                this.dataPassive = elem.getAttribute('data-passive');
                this.dataActive = elem.getAttribute('data-active');
                this.dataDescriptions = elem.getAttribute('data-descriptions');
                this.dataClosed = elem.getAttribute('data-closed');
                this.dataOpen = elem.getAttribute('data-open');
                this.dataExlusive = elem.hasAttribute('data-exclusive');
                this.titles = [...elem.querySelectorAll(this.dataTitle)];
                this.descriptions = [...elem.querySelectorAll(this.dataDescriptions)];
                for (let index in this.titles) {
                    this.titles[index].addEventListener('click', this.toggle.bind(this, this.titles[index], this.descriptions[index]));
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
                title.className = title.className.includes(this.dataPassive) ?
                    title.className.replace(this.dataPassive, this.dataActive):
                    title.className.replace(this.dataActive, this.dataPassive);
                description.className = description.className.includes(this.dataClosed) ?
                    description.className.replace(this.dataClosed, this.dataOpen):
                    description.className.replace(this.dataOpen, this.dataClosed);
            }
        },
        '.twfx-toggle': class {
            constructor(elem) {
                this.dataPassive = elem.getAttribute('data-passive');
                this.dataActive = elem.getAttribute('data-active');
                this.dataParent = elem.getAttribute('data-parent');
                this.dataTarget = elem.getAttribute('data-target');
                this.dataClosed = elem.getAttribute('data-closed');
                this.dataOpen = elem.getAttribute('data-open');
                const parent = this.parent(elem, this.dataParent);
                const target = parent.querySelector(this.dataTarget);
                elem.addEventListener('click', this.toggle.bind(this, elem, target));
            }
            parent(elem, levels) {
                if (isNaN(levels)) return document.querySelector(levels);
                let parent = elem;
                while(+levels--) { parent = parent.parentNode }
                return parent;
            }
            toggle(elem, target, evt) {
                evt.preventDefault();
                elem.className = elem.className.includes(this.dataPassive) ?
                    elem.className.replace(this.dataPassive, this.dataActive):
                    elem.className.replace(this.dataActive, this.dataPassive);
                target.className = target.className.includes(this.dataClosed) ?
                    target.className.replace(this.dataClosed, this.dataOpen):
                    target.className.replace(this.dataOpen, this.dataClosed);
            }
        },
        '.twfx-hero, .twfx-carousel': class {
            constructor(elem) {
                this.dataSlider = elem.getAttribute('data-slider');
                this.dataSlides = elem.getAttribute('data-slides');
                this.dataNav = elem.getAttribute('data-nav');
                this.dataNavPrev = elem.getAttribute('data-nav-prev');
                this.dataNavNext = elem.getAttribute('data-nav-next');
                this.dataNavPassive = elem.getAttribute('data-nav-passive');
                this.dataNavActive = elem.getAttribute('data-nav-active');
                this.dataDots = elem.getAttribute('data-dots');
                this.dataDot = elem.getAttribute('data-dot');
                this.dataDotPassive = elem.getAttribute('data-dot-passive');
                this.dataDotActive = elem.getAttribute('data-dot-active');
                this.scroller = elem.querySelector(this.dataSlider);
                this.previous = null;
                this.distance = 0;
                this.indicatorNav = document.createElement('nav');
                this.indicatorNav.setAttribute('class', `twfx-dots ${this.dataDots}`);
                this.scroller.parentNode.appendChild(this.indicatorNav);
                this.indicatorButtons = [];
                this.slides = [...elem.querySelectorAll(this.dataSlides)];
                this.slidesPerPage = Math.round(this.scroller.offsetWidth / this.slides[0].offsetWidth);
                for(let index in this.slides) {
                    if (index % this.slidesPerPage === 0) {
                        this.slides[index].addEventListener('click', this.capture.bind(this));
                        let indicatorButton = document.createElement('button');
                        indicatorButton.innerHTML = +index + 1;
                        indicatorButton.setAttribute('class', this.dataDot);
                        this.indicatorButtons.push(indicatorButton);
                        indicatorButton.addEventListener('click', this.focus.bind(this, this.slides[index]));
                        this.indicatorNav.appendChild(indicatorButton);
                    }
                }
                this.nextButton = document.createElement('button');
                this.nextButton.innerHTML = 'Next';
                this.nextButton.setAttribute('class', `twfx-next ${this.dataNav} ${this.dataNavNext}`);
                this.nextButton.addEventListener('click', this.cycle.bind(this, this.slidesPerPage));
                this.scroller.parentNode.appendChild(this.nextButton);
                this.prevButton = document.createElement('button');
                this.prevButton.innerHTML = 'Previous';
                this.prevButton.setAttribute('class', `twfx-prev ${this.dataNav} ${this.dataNavPrev}`);
                this.prevButton.addEventListener('click', this.cycle.bind(this, -this.slidesPerPage));
                this.scroller.parentNode.appendChild(this.prevButton);
                this.scroller.addEventListener('mousedown', this.startDrag.bind(this));
                this.scroller.addEventListener('mousemove', this.handleDrag.bind(this));
                this.scroller.addEventListener('mouseup', this.endDrag.bind(this));
                this.scroller.addEventListener("touchstart", this.endIdle.bind(this), { passive: true });
                this.scroller.addEventListener('scroll', this.manualScroll.bind(this), { passive: true });
                this.redraw(this.slides[0]);
                this.idleDelay = +elem.getAttribute('class').split(' idle-').pop();
                this.idleDirection = this.slidesPerPage;
                this.idleTimeout = (this.idleDelay) ? setInterval(this.idle.bind(this), this.idleDelay) : null;
            }
            startDrag(evt) {
                if (window.matchMedia('(pointer:fine)')) this.previous = evt.clientX;
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
                setTimeout(() => { this.distance = 0; }, 1000);
            }
            endIdle(evt) {
                clearTimeout(this.idleTimeout);
            }
            manualScroll(evt) {
                this.redraw(this.closest());
            }
            idle() {
                const sliderRect = this.scroller.getBoundingClientRect();
                const offScreen = (sliderRect.bottom > window.innerHeight || sliderRect.top < 0);
                const atFarSide = (this.nextButton.className.includes(this.dataNavPassive) && this.idleDirection > 0);
                const atNearSide = (this.prevButton.className.includes(this.dataNavPassive) && this.idleDirection < 0);
                if (atFarSide || atNearSide) this.idleDirection = -this.idleDirection;
                if (!offScreen) this.cycle(this.idleDirection);
            }
            redraw(slide) {
                const activeIndex = this.slides.indexOf(slide);
                this.prevButton.className = (activeIndex <= 0) ? 
                    this.prevButton.className.replace(this.dataNavActive, this.dataNavPassive): 
                    this.prevButton.className.replace(this.dataNavPassive, this.dataNavActive);
                this.nextButton.className = (activeIndex >= this.slides.length - this.slidesPerPage) ?
                    this.nextButton.className.replace(this.dataNavActive, this.dataNavPassive):
                    this.nextButton.className.replace(this.dataNavPassive, this.dataNavActive);

                for (let buttonIndex in this.indicatorButtons) {
                    this.indicatorButtons[buttonIndex].className = (+buttonIndex === Math.round(activeIndex / this.slidesPerPage)) ?
                    this.indicatorButtons[buttonIndex].className.replace(this.dataDotPassive, this.dataDotActive):
                    this.indicatorButtons[buttonIndex].className.replace(this.dataDotActive, this.dataDotPassive);
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
                if (evt) { evt.preventDefault(); clearTimeout(this.idleTimeout); }
                const currentIndex = this.slides.indexOf(this.closest());
                const nextIndex = Math.max(Math.min(currentIndex + direction, this.slides.length - 1), 0);
                this.focus(this.slides[nextIndex]);
            }
            capture(evt) {
                if (Math.abs(this.distance) > 10) evt.preventDefault();
            }
        },
		'.twfx-increment': class {
            constructor(elem) {
                const plusElem = document.createElement('button');
                const dataIncrement = elem.getAttribute('data-increment');
                plusElem.className = dataIncrement;
                plusElem.addEventListener('click', this.increment.bind(this, elem));
                elem.parentNode.appendChild(plusElem);
                const minusElem = document.createElement('button');
                const dataDecrement = elem.getAttribute('data-decrement');
                minusElem.className = dataDecrement;
                minusElem.addEventListener('click', this.decrement.bind(this, elem));
                elem.parentNode.appendChild(minusElem);
            }
            increment(elem, evt) {
                evt.preventDefault(); 
                const max = elem.getAttribute('max');
                let value = +elem.value || 0; 
                elem.value = Math.min(value + 1, +max); 
            }
            decrement(elem, evt) {
                evt.preventDefault(); 
                const min = elem.getAttribute('min') || 0;
                let value = +elem.value || 0; 
                elem.value = Math.max(value - 1, +min); 
            }
		},
        '.twfx-totop': class {
            constructor(elem) {
                elem.addEventListener('click', evt => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, true);
            }
        }
    }

    function tailwindHandler(elems, effect) {
        for (let elem of elems) {
            new effect(elem);
        }
    }

    function tailwindParser(behaviors) {
        for (let name in behaviors) {
            tailwindHandler(
                document.querySelectorAll(name),
                behaviors[name]
            );
        }
    }

    tailwindParser(tailwindEffects);
	
})();