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
                console.log('scrolled', evt, window.scrollY);
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
                        console.log('reveal', intersection);
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
                console.log('toggle');
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
        '.klevuLanding': class {
            constructor(elem) {
                new MutationObserver((mutationList, observer) => {
                    let buttons = elem.querySelectorAll('.kuLandingAddToCartBtn');
                    for (let button of buttons) {
                        let label = button.innerHTML;
                        if(/add to cart/i.test(label)) { button.setAttribute('data-status', 'add'); }
                        else if(/adding/i.test(label)) { button.setAttribute('data-status', 'adding'); }
                        else if(/added to cart/i.test(label)) { button.setAttribute('data-status', 'added'); }
                    }
                }).observe(elem, { attributes: false, childList: true, subtree: true });
            }
        },
        '.defer-template': class {
            constructor(elem) {
                if (elem.querySelector('template')) elem.setAttribute('data-defered', '');
            }
        },
        '.gifting-landing-details': class {
            constructor(elem) {
                const toolbar = elem.querySelector(".toolbar");
                const groups = [...elem.querySelectorAll(".pagebuilder-column-group")];
                var tabs = [...elem.querySelectorAll(".tab")];
                const panels = [...elem.querySelectorAll(".pagebuilder-column-group:first-of-type ~ .pagebuilder-column-group")];
                function onToggleClicked(group, evt) {
                    if (evt) evt.preventDefault();
                    if (!/large/.test(elem.className)) {
                        let status = (elem.getAttribute("data-expanded") === "true");
                        elem.setAttribute("data-expanded", !status);
                    } else {
                        let status = (group.getAttribute("data-active") === "true");
                        group.setAttribute("data-active", !status);
                        if (status) {group.scrollIntoView(); }
                    }
                }
                function onTabClicked(active, evt) {
                    if (evt) evt.preventDefault();
                    tabs = [...elem.querySelectorAll(".tab")];
                    for (let tab of tabs) {
                        let target = parseInt(tab.getAttribute("data-target"));
                        tab.setAttribute("data-active", (+target === +active));
                    }
                    for (let index in panels) { panels[index].setAttribute("data-active", (+index === +active)); }
                }
                for (let group of groups) {
                    let toggles = group.querySelectorAll("a:first-child");
                    for (let toggle of toggles) {
                        toggle.addEventListener("click", onToggleClicked.bind(this, group)); 
                    }
                }
                for (let index in tabs) {
                    tabs[index].setAttribute("data-target", index);
                    if (toolbar) {
                        let toolbarTab = tabs[index].cloneNode(true);
                        toolbar.parentNode.appendChild(toolbarTab);
                        toolbarTab.addEventListener("click", onTabClicked.bind(this, index));
                    }
                }
                if(tabs.length > 0) setTimeout(() => { onTabClicked(0) }, 100); 
            }
        },
        '.gifting-landing-box.large': class {
            constructor(elem) {
                function addHandlers() {
                    const links = elem.querySelectorAll(".pagebuilder-slider tr");
                    const toggles = elem.querySelectorAll(".plp-accordion tr");
                    const textColumn = elem.querySelector(".pagebuilder-column:nth-of-type(1)");
                    const mediaColumn = elem.querySelector(".pagebuilder-column:nth-of-type(2)");
                    function onLinkClicked(source, evt) {
                        if (evt) evt.preventDefault();
                        let textSource = source.querySelector("td:nth-of-type(3)");
                        let mediaSource = source.querySelector("td:nth-of-type(4)");
                        for (let link of links) { link.setAttribute("data-active", (link === source)); }
                        if (textSource && textColumn) textColumn.innerHTML = textSource.innerHTML;
                        if (mediaSource && mediaColumn) mediaColumn.innerHTML = mediaSource.innerHTML;
                    }
                    function onToggleClicked(source, evt) {
                        if (evt) evt.preventDefault();
                        source.setAttribute("data-active", !(source.getAttribute("data-active") === "true"));
                    }
                    for (let link of links) { link.addEventListener("click", onLinkClicked.bind(this, link)); }
                    for (let toggle of toggles) { toggle.addEventListener("click", onToggleClicked.bind(this, toggle)); }
                    if(links.length > 0) setTimeout(() => { onLinkClicked(links[0]) }, 100); 
                }
                const retryInterval = setInterval(() => {
                    const hasInit = elem.querySelector('.glider-initialized');
                    if (hasInit) {
                        clearInterval(retryInterval);
                        addHandlers();
                    }
                }, 500);
            }
        },
        '.catalog-product-view #gallery' : class {
            constructor(elem) {
                const scroller = elem.querySelector('div');
                const images = [...elem.querySelectorAll('img')];
                const pages = images.filter((image) => image.offsetHeight);
                const nav = document.createElement('nav');
                const indicators = [];
                for (let index in pages) {
                    let indicator = document.createElement('button');
                    indicator.innerHTML = index;
                    indicator.className = 'passive';
                    indicator.addEventListener('click', (evt) => {
                        evt.preventDefault();
                        pages[index].scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
                    });
                    nav.appendChild(indicator);
                    indicators.push(indicator);
                }
                elem.appendChild(nav);
                if (scroller) scroller.addEventListener('scroll', (evt) => {
                    console.log('scrolled', scroller.scrollLeft);
                    let max = scroller.scrollWidth - scroller.offsetWidth;
                    let pos = scroller.scrollLeft; 
                    let count = pages.length - 1;
                    let index = Math.min(Math.round(pos / max * count), count);
                    for (let indicator of indicators) { indicator.className = 'passive' }
                    indicators[index].className = 'active';
                }, { passive: true });
            }
        },
        '.plp-mosaic, .plp-carousel': class {
            constructor(elem) {
                const galleryElem = document.querySelector('#gallery');
                if (galleryElem) galleryElem.innerHTML = "";
            }
        },
        '.defer-template': class {
            constructor(elem) {
                if (elem.querySelector('template')) elem.setAttribute('data-defered', '');
            }
        },
        '.observe-position, .defer-template, .demo-intro-row, .demo-cta-row': class {
            constructor(elem) {
                function renderTemplate(target) {
                    if (target.hasAttribute('data-defered')) {
                        target.removeAttribute('data-defered');
                        target.appendChild(target.querySelector('template').content.cloneNode(true));
                    }
                }
                if (this.positionObserver === undefined) this.positionObserver = new IntersectionObserver(entries => {
                    for (let entry of entries) {
                        if (entry.isIntersecting) { entry.target.setAttribute('data-position', 'inside'); renderTemplate(entry.target) } 
                        else if (entry.boundingClientRect.top > entry.rootBounds.bottom) { entry.target.setAttribute('data-position', 'below') }
                        else if (entry.boundingClientRect.bottom < entry.rootBounds.top) { entry.target.setAttribute('data-position', 'above') }
                    }
                }, { root:null, rootMargin:"0px 0px 0px 0px", threshold:0 });
                this.positionObserver.observe(elem);
            }
        },
        '.plp-embiggen, #gallery img': class {
            constructor(elem) {
                let _modal;
                class FigureZoomModal {
                    constructor(element) {
                        const source = element.querySelector('img') || element;
                        this.container = document.createElement("section");
                        this.container.setAttribute("class", "plp-embiggen-shadow");
                        const panel = document.createElement("div");
                        panel.setAttribute("class", "plp-embiggen-panel");
                        this.container.appendChild(panel);
                        const closer = document.createElement("button");
                        closer.setAttribute("class", "plp-embiggen-closer");
                        closer.innerHTML = "<span>Close</span>";
                        closer.addEventListener("click", this.selfDestruct.bind(this));
                        panel.appendChild(closer);
                        const figure = document.createElement('figure');
                        figure.setAttribute("class", "plp-embiggen-figure");
                        panel.appendChild(figure);
                        const image = document.createElement('img');
                        image.setAttribute("src", source.src);
                        image.setAttribute("alt", "");
                        figure.appendChild(image);
                        document.body.appendChild(this.container);
                        document.body.setAttribute("data-embiggen", "open");
                    }
                    selfDestruct(evt) {
                        if (evt) evt.preventDefault();
                        document.body.removeChild(this.container);
                        document.body.removeAttribute("data-embiggen");
                        _modal = null;
                    }
                }
                elem.addEventListener("click", evt => {
                    evt.stopImmediatePropagation();
                    if (_modal) _modal.selfDestruct();
                    _modal = new FigureZoomModal(elem);
                }, true);
            }
        },
		'input[name="qty"]': class {
            constructor(elem) {
                const plusElem = document.createElement('button');
                plusElem.innerHTML = '+';
                plusElem.addEventListener('click', evt => { 
                    evt.preventDefault(); 
                    let value = +elem.value || 0; 
                    elem.value = value + 1; 
                });
                elem.parentNode.appendChild(plusElem);
                const minusElem = document.createElement('button');
                minusElem.innerHTML = '-';
                minusElem.addEventListener('click', evt => { 
                    evt.preventDefault(); 
                    let value = +elem.value || 0; 
                    elem.value = Math.max(value - 1, 1); 
                });
                elem.parentNode.appendChild(minusElem);
            }
		},
		'.product-info-main': class {
            constructor(elem) {
                const referenceElem = elem.querySelector('.plp-mosaic, #gallery');
                const floatingElems = [...elem.querySelectorAll('.product-brand>span, #gallery~div, .vintage_variable, .plp-landing-instructions, .delivery-estimate, .extra_description')];
                const referenceTop = referenceElem && referenceElem.offsetTop;
                const referenceLength = referenceElem && referenceElem.offsetHeight;
                if (referenceElem && floatingElems[0].offsetLeft < referenceElem.offsetLeft + referenceElem.offsetWidth) return;
                window.addEventListener('scroll', evt => {
                    let reservedLength = floatingElems.reduce((a, b) => a + b.offsetHeight, 0);
                    let travelledLength = Math.max(referenceLength - reservedLength, 0);
                    let scrolled = window.scrollY + 100;
                    let translation = Math.min(Math.max(scrolled - referenceTop, 0), travelledLength);
                    for (let item of floatingElems) { item.style.transform = `translateY(${translation}px)`; }
                }, {capture: true, passive: true});
            }
		},
        '.mega-menu, [x-ref="nav-desktop"]': class {
            constructor(elem) {
                // when the navigation changes
                const observer = new MutationObserver((mutationList, observer) => {
                    // count the top level items
                    const topLevels = elem.querySelectorAll('.level-0[\\@mouseenter*="category-node"]');
                    for (let topLevel of topLevels) {
                        let tiers = (topLevel.querySelectorAll('.submenu-item>div>a').length > 0) ? 2 : 1;
                        topLevel.setAttribute('data-tiers', tiers);
                    }
                    // count the submenu items
                    const submenuItems = elem.querySelectorAll('.submenu-item');
                    for (let submenuItem of submenuItems) {
                        const cats = (submenuItem.querySelectorAll('a+div>a').length > 11) ? 2 : 1;
                        submenuItem.setAttribute('data-span', cats);
                    }
                    // count the megamenu banners
                    const megamenuBanners = elem.querySelectorAll('.megamenu-banner');
                    for (let megamenuBanner of megamenuBanners) {
                        const banners = megamenuBanner.querySelectorAll('[data-content-type="banner"');
                        megamenuBanner.parentNode.setAttribute('data-banners', banners.length);
                    }
                }).observe(elem, { attributes: false, childList: true, subtree: true });
            }
        },
        '.tabbed-carousel, .gifting-home-recommendations': class {
            constructor(elem) {
                const tabs = [...elem.querySelectorAll('[data-content-type="buttons"] a, [data-content-type="buttons"] button')];
                for (let index in tabs) {
                    tabs[index].addEventListener('click', evt => {
                        evt.preventDefault();
                        elem.setAttribute('data-active', index)
                    });
                }
                elem.setAttribute('data-active', 0);
            }
        },
        '.back-to-top': class {
            constructor(elem) {
                elem.addEventListener('click', evt => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }, true);
            }
        },
        '.undock-parent': class {
            constructor(elem) {
                const limit = elem.parentNode.offsetHeight;
                let previous = window.scrollY;
                window.addEventListener('scroll', async evt => {
                    document.body.setAttribute('data-direction', (window.scrollY > previous) ? 'down': 'up');
                    document.body.setAttribute('data-undocked', window.scrollY > limit);
                    previous = window.scrollY;
                }, {capture: true, passive: true});
            }
        },
        '.toggle': class {
            constructor(elem) {
                elem.addEventListener('click', evt => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    elem.setAttribute('data-toggle', (elem.getAttribute('data-toggle') !== 'true'));
                }, true);
            }
        },
        '.toggle-parent, [x-data^="initMenuMobile"] .level-0>div>a~a span:first-of-type': class {
            constructor(elem) {
                elem.addEventListener('click', evt => {
                    evt.preventDefault();
                    evt.stopPropagation();
                    elem.parentNode.setAttribute('data-toggle', (elem.parentNode.getAttribute('data-toggle') !== 'true'));
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