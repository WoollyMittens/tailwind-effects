(function() {

    localStorage.setItem('twfx', 'off');

    const tailwindEffects = {
        '.klevuLanding': (elem) =>  {
            new MutationObserver((mutationList, observer) => {
                let buttons = elem.querySelectorAll('.kuLandingAddToCartBtn');
                for (let button of buttons) {
                    let label = button.innerHTML;
                    if(/add to cart/i.test(label)) { button.setAttribute('data-status', 'add'); }
                    else if(/adding/i.test(label)) { button.setAttribute('data-status', 'adding'); }
                    else if(/added to cart/i.test(label)) { button.setAttribute('data-status', 'added'); }
                }
            }).observe(elem, { attributes: false, childList: true, subtree: true });
        },
        '.tailwind-hero-carousel, .tailwind-products-carousel .block-content': (elem) => {
            /* CSS:
	            scroll-snap-type: x mandatory;
                @media(pointer:fine) { scroll-snap-type: initial; }
            */
            let previous = null;
            let distance = 0;
            function focus(slide) {
                if (!slide) slide = closest();
                slide.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
                // TODO: redraw arrows
                // TODO: redraw the balls
            }
            function closest() {
                const elemRect = elem.getBoundingClientRect();
                for (let slide of slides) {
                    let slideRect = slide.getBoundingClientRect();
                    let slideCenter = slideRect.left - elemRect.left + slideRect.width / 2;
                    if (slideCenter > 0 && slideCenter < elemRect.width) return slide;
                }
                return slides[slides.length - 1];
            }
            function cycle(direction, evt) {
                if (evt) evt.preventDefault();
                const currentIndex = slides.indexOf(closest());
                console.log('currentIndex', currentIndex);
                const nextIndex = Math.max(Math.min(currentIndex + direction, slides.length - 1), 0);
                console.log('nextIndex', nextIndex, slides, slides[nextIndex]);
                focus(slides[nextIndex]);
            }
            function capture(evt) {
                if (Math.abs(distance) > 10) evt.preventDefault();
            }
            elem.addEventListener('mousedown', evt => {
                if (window.matchMedia('(pointer:fine)')) previous = evt.clientX;
            });
			elem.addEventListener('mousemove', evt => {
                if (previous !== null) {
                    evt.preventDefault(evt);
                    let current = evt.clientX;
                    let offset = current - previous;
                    elem.scrollBy({ left: -offset });
                    distance += offset;
                    previous = current;
                }
            });
            elem.addEventListener('mouseup', evt => {
                previous = null;
                focus();
                setTimeout(() => { distance = 0; }, 1000);
            });
            // TODO: take slides per page into account
            // add prev and next buttons
            const nextButton = document.createElement('button');
            nextButton.innerHTML = 'Next';
            nextButton.setAttribute('class', 'twc-next');
            nextButton.addEventListener('click', cycle.bind(this, 1));
            elem.parentNode.appendChild(nextButton);
            const prevButton = document.createElement('button');
            prevButton.innerHTML = 'Previous';
            prevButton.setAttribute('class', 'twc-prev');
            prevButton.addEventListener('click', cycle.bind(this, -1));
            elem.parentNode.appendChild(prevButton);
            const indicatorNav = document.createElement('nav');
            indicatorNav.setAttribute('class', 'twc-nav');
            elem.parentNode.appendChild(indicatorNav);
            const indicatorButtons = [];
            let slides = [...elem.querySelectorAll(':scope > a, form')];
            for(let index in slides) {
                slides[index].addEventListener('click', capture.bind(this));
                let indicatorButton = document.createElement('button');
                indicatorButton.innerHTML = +index + 1;
                indicatorButtons.push(indicatorButton);
                indicatorButton.addEventListener('click', focus.bind(this, slides[index]));
                indicatorNav.parentNode.appendChild(indicatorButton);
            }
            // TODO: auto cycle when idle
        },
        '.defer-template': (elem) => {
            if (elem.querySelector('template')) elem.setAttribute('data-defered', '');
        },
        '.gifting-landing-details': (elem) => {
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
        },
        '.gifting-landing-box.large': (elem) => {
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
        },
        '.catalog-product-view #gallery' : (elem) => {
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
        },
        '.plp-mosaic, .plp-carousel': (elem) => {
            const galleryElem = document.querySelector('#gallery');
            if (galleryElem) galleryElem.innerHTML = "";
        },
        '.observe-position, .defer-template, .demo-intro-row, .demo-cta-row': (elem) => {
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
        },
        '.plp-embiggen, #gallery img': (elem) => {
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
        },
		'input[name="qty"]': (elem) => {
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
		},
		'.product-info-main': (elem) => {
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
		},
        '[x-ref="nav-desktop"': (elem) => {
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
        },
        '.tabbed-carousel, .gifting-home-recommendations': (elem) => {
            const tabs = [...elem.querySelectorAll('[data-content-type="buttons"] a, [data-content-type="buttons"] button')];
            for (let index in tabs) {
                tabs[index].addEventListener('click', evt => {
                    evt.preventDefault();
                    elem.setAttribute('data-active', index)
                });
            }
            elem.setAttribute('data-active', 0);
        },
        '.back-to-top': (elem) => {
            elem.addEventListener('click', evt => {
                evt.preventDefault();
                evt.stopPropagation();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, true);
        },
        '.undock-parent': (elem) => {
            const limit = elem.parentNode.offsetHeight;
            let previous = window.scrollY;
            window.addEventListener('scroll', async evt => {
                document.body.setAttribute('data-direction', (window.scrollY > previous) ? 'down': 'up');
                document.body.setAttribute('data-undocked', window.scrollY > limit);
                previous = window.scrollY;
            }, {capture: true, passive: true});
        },
        '.toggle': (elem) => {
            elem.addEventListener('click', evt => {
                evt.preventDefault();
                evt.stopPropagation();
                elem.setAttribute('data-toggle', (elem.getAttribute('data-toggle') !== 'true'));
            }, true);
        },
        '.toggle-parent, [x-data^="initMenuMobile"] .level-0>div>a~a span:first-of-type': (elem) => {
            elem.addEventListener('click', evt => {
                evt.preventDefault();
                evt.stopPropagation();
                elem.parentNode.setAttribute('data-toggle', (elem.parentNode.getAttribute('data-toggle') !== 'true'));
            }, true);
        }
    }
    function tailwindHandler(elems, effect) {
        for (let elem of elems) {
            // TODO: make all of these classes
            effect(elem);
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