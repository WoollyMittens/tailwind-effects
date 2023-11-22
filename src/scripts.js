(function() {

    localStorage.setItem('twfx', 'off');
/*
    const tailwindEffects = {
        ".klevuLanding":class{constructor(t){new MutationObserver(((e,i)=>{let s=t.querySelectorAll(".kuLandingAddToCartBtn");for(let t of s){let e=t.innerHTML;/add to cart/i.test(e)?t.setAttribute("data-status","add"):/adding/i.test(e)?t.setAttribute("data-status","adding"):/added to cart/i.test(e)&&t.setAttribute("data-status","added")}})).observe(t,{attributes:!1,childList:!0,subtree:!0})}},
        ".twfx-hero,.twfx-carousel":class{constructor(t){for(let e in this.dataSlider=t.getAttribute("data-slider"),this.dataSlides=t.getAttribute("data-slides"),this.dataNav=t.getAttribute("data-nav"),this.dataNavPrev=t.getAttribute("data-nav-prev"),this.dataNavNext=t.getAttribute("data-nav-next"),this.dataNavPassive=t.getAttribute("data-nav-passive"),this.dataNavActive=t.getAttribute("data-nav-active"),this.dataDots=t.getAttribute("data-dots"),this.dataDot=t.getAttribute("data-dot"),this.dataDotPassive=t.getAttribute("data-dot-passive"),this.dataDotActive=t.getAttribute("data-dot-active"),this.scroller=t.querySelector(this.dataSlider),this.previous=null,this.distance=0,this.indicatorNav=document.createElement("nav"),this.indicatorNav.setAttribute("class",`twfx-hero-dots ${this.dataDots}`),this.scroller.parentNode.appendChild(this.indicatorNav),this.indicatorButtons=[],this.slides=[...t.querySelectorAll(this.dataSlides)],console.log("this.slides",this.slides),this.slidesPerPage=Math.round(this.scroller.offsetWidth/this.slides[0].offsetWidth),this.slides)if(e%this.slidesPerPage==0){this.slides[e].addEventListener("click",this.capture.bind(this));let i=document.createElement("button");i.innerHTML=+e+1,i.setAttribute("class",this.dataDot),this.indicatorButtons.push(i),i.addEventListener("click",this.focus.bind(this,this.slides[e])),this.indicatorNav.appendChild(i)}this.nextButton=document.createElement("button"),this.nextButton.innerHTML="Next",this.nextButton.setAttribute("class",`twfx-hero-next ${this.dataNav} ${this.dataNavNext}`),this.nextButton.addEventListener("click",this.cycle.bind(this,this.slidesPerPage)),this.scroller.parentNode.appendChild(this.nextButton),this.prevButton=document.createElement("button"),this.prevButton.innerHTML="Previous",this.prevButton.setAttribute("class",`twfx-hero-prev ${this.dataNav} ${this.dataNavPrev}`),this.prevButton.addEventListener("click",this.cycle.bind(this,-this.slidesPerPage)),this.scroller.parentNode.appendChild(this.prevButton),this.scroller.addEventListener("mousedown",this.startDrag.bind(this)),this.scroller.addEventListener("mousemove",this.handleDrag.bind(this)),this.scroller.addEventListener("mouseup",this.endDrag.bind(this)),this.scroller.addEventListener("touchstart",this.endIdle.bind(this)),this.scroller.addEventListener("scroll",this.manualScroll.bind(this),{passive:!0}),this.redraw(this.slides[0]),this.idleDelay=+t.getAttribute("class").split(" idle-").pop(),this.idleDirection=this.slidesPerPage,this.idleTimeout=this.idleDelay?setInterval(this.idle.bind(this),this.idleDelay):null}startDrag(t){window.matchMedia("(pointer:fine)")&&(this.previous=t.clientX)}handleDrag(t){if(clearTimeout(this.idleTimeout),null!==this.previous){t.preventDefault(t);let e=t.clientX,i=e-this.previous;this.scroller.scrollBy({left:-i}),this.distance+=i,this.previous=e}}endDrag(t){this.previous=null,this.focus(),setTimeout(()=>{this.distance=0},1e3)}endIdle(t){clearTimeout(this.idleTimeout)}manualScroll(t){this.redraw(this.closest())}idle(){let t=this.scroller.getBoundingClientRect(),e=t.bottom>window.innerHeight||t.top<0,i=this.nextButton.className.includes(this.dataNavPassive)&&this.idleDirection>0,s=this.prevButton.className.includes(this.dataNavPassive)&&this.idleDirection<0;(i||s)&&(this.idleDirection=-this.idleDirection),e||this.cycle(this.idleDirection)}redraw(t){let e=this.slides.indexOf(t);for(let i in this.prevButton.className=e<=0?this.prevButton.className.replace(this.dataNavActive,this.dataNavPassive):this.prevButton.className.replace(this.dataNavPassive,this.dataNavActive),this.nextButton.className=e>=this.slides.length-this.slidesPerPage?this.nextButton.className.replace(this.dataNavActive,this.dataNavPassive):this.nextButton.className.replace(this.dataNavPassive,this.dataNavActive),this.indicatorButtons)this.indicatorButtons[i].className=+i===Math.round(e/this.slidesPerPage)?this.indicatorButtons[i].className.replace(this.dataDotPassive,this.dataDotActive):this.indicatorButtons[i].className.replace(this.dataDotActive,this.dataDotPassive)}focus(t){t||(t=this.closest()),t.scrollIntoView({behavior:"smooth",block:"nearest",inline:"start"}),this.redraw(t)}closest(){let t=this.scroller.getBoundingClientRect();for(let e of this.slides){let i=e.getBoundingClientRect(),s=i.left-t.left+i.width/2;if(s>0&&s<t.width)return e}return this.slides[this.slides.length-1]}cycle(t,e){e&&(e.preventDefault(),clearTimeout(this.idleTimeout));let i=this.slides.indexOf(this.closest()),s=Math.max(Math.min(i+t,this.slides.length-1),0);this.focus(this.slides[s])}capture(t){Math.abs(this.distance)>10&&t.preventDefault()}},
        ".defer-template":class{constructor(t){t.querySelector("template")&&t.setAttribute("data-defered","")}},
        ".gifting-landing-details":class{constructor(t){const e=t.querySelector(".toolbar"),i=[...t.querySelectorAll(".pagebuilder-column-group")];var s=[...t.querySelectorAll(".tab")];const r=[...t.querySelectorAll(".pagebuilder-column-group:first-of-type ~ .pagebuilder-column-group")];function n(e,i){if(i&&i.preventDefault(),/large/.test(t.className)){let t="true"===e.getAttribute("data-active");e.setAttribute("data-active",!t),t&&e.scrollIntoView()}else{let e="true"===t.getAttribute("data-expanded");t.setAttribute("data-expanded",!e)}}function o(e,i){i&&i.preventDefault(),s=[...t.querySelectorAll(".tab")];for(let t of s){let i=parseInt(t.getAttribute("data-target"));t.setAttribute("data-active",+i==+e)}for(let t in r)r[t].setAttribute("data-active",+t==+e)}for(let t of i){let e=t.querySelectorAll("a:first-child");for(let i of e)i.addEventListener("click",n.bind(this,t))}for(let t in s)if(s[t].setAttribute("data-target",t),e){let i=s[t].cloneNode(!0);e.parentNode.appendChild(i),i.addEventListener("click",o.bind(this,t))}s.length>0&&setTimeout((()=>{o(0)}),100)}},
        ".gifting-landing-box.large":class{constructor(t){const e=setInterval((()=>{t.querySelector(".glider-initialized")&&(clearInterval(e),function(){const e=t.querySelectorAll(".pagebuilder-slider tr"),i=t.querySelectorAll(".plp-accordion tr"),s=t.querySelector(".pagebuilder-column:nth-of-type(1)"),r=t.querySelector(".pagebuilder-column:nth-of-type(2)");function n(t,i){i&&i.preventDefault();let n=t.querySelector("td:nth-of-type(3)"),o=t.querySelector("td:nth-of-type(4)");for(let i of e)i.setAttribute("data-active",i===t);n&&s&&(s.innerHTML=n.innerHTML),o&&r&&(r.innerHTML=o.innerHTML)}function o(t,e){e&&e.preventDefault(),t.setAttribute("data-active",!("true"===t.getAttribute("data-active")))}for(let t of e)t.addEventListener("click",n.bind(this,t));for(let t of i)t.addEventListener("click",o.bind(this,t));e.length>0&&setTimeout((()=>{n(e[0])}),100)}())}),500)}},
        ".catalog-product-view #gallery":class{constructor(t){const e=t.querySelector("div"),i=[...t.querySelectorAll("img")].filter((t=>t.offsetHeight)),s=document.createElement("nav"),r=[];for(let t in i){let e=document.createElement("button");e.innerHTML=t,e.className="passive",e.addEventListener("click",(e=>{e.preventDefault(),i[t].scrollIntoView({behavior:"smooth",block:"end",inline:"nearest"})})),s.appendChild(e),r.push(e)}t.appendChild(s),e&&e.addEventListener("scroll",(t=>{console.log("scrolled",e.scrollLeft);let s=e.scrollWidth-e.offsetWidth,n=e.scrollLeft,o=i.length-1,l=Math.min(Math.round(n/s*o),o);for(let t of r)t.className="passive";r[l].className="active"}),{passive:!0})}},
        ".plp-mosaic, .plp-carousel":class{constructor(t){const e=document.querySelector("#gallery");e&&(e.innerHTML="")}},
        ".defer-template":class{constructor(t){t.querySelector("template")&&t.setAttribute("data-defered","")}},
        ".observe-position, .defer-template, .demo-intro-row, .demo-cta-row":class{constructor(t){void 0===this.positionObserver&&(this.positionObserver=new IntersectionObserver((t=>{for(let i of t)i.isIntersecting?(i.target.setAttribute("data-position","inside"),(e=i.target).hasAttribute("data-defered")&&(e.removeAttribute("data-defered"),e.appendChild(e.querySelector("template").content.cloneNode(!0)))):i.boundingClientRect.top>i.rootBounds.bottom?i.target.setAttribute("data-position","below"):i.boundingClientRect.bottom<i.rootBounds.top&&i.target.setAttribute("data-position","above");var e}),{root:null,rootMargin:"0px 0px 0px 0px",threshold:0})),this.positionObserver.observe(t)}},
        ".plp-embiggen, #gallery img":class{constructor(t){let e;class i{constructor(t){const e=t.querySelector("img")||t;this.container=document.createElement("section"),this.container.setAttribute("class","plp-embiggen-shadow");const i=document.createElement("div");i.setAttribute("class","plp-embiggen-panel"),this.container.appendChild(i);const s=document.createElement("button");s.setAttribute("class","plp-embiggen-closer"),s.innerHTML="<span>Close</span>",s.addEventListener("click",this.selfDestruct.bind(this)),i.appendChild(s);const r=document.createElement("figure");r.setAttribute("class","plp-embiggen-figure"),i.appendChild(r);const n=document.createElement("img");n.setAttribute("src",e.src),n.setAttribute("alt",""),r.appendChild(n),document.body.appendChild(this.container),document.body.setAttribute("data-embiggen","open")}selfDestruct(t){t&&t.preventDefault(),document.body.removeChild(this.container),document.body.removeAttribute("data-embiggen"),e=null}}t.addEventListener("click",(s=>{s.stopImmediatePropagation(),e&&e.selfDestruct(),e=new i(t)}),!0)}},
        'input[name="qty"]':class{constructor(t){const e=document.createElement("button");e.innerHTML="+",e.addEventListener("click",(e=>{e.preventDefault();let i=+t.value||0;t.value=i+1})),t.parentNode.appendChild(e);const i=document.createElement("button");i.innerHTML="-",i.addEventListener("click",(e=>{e.preventDefault();let i=+t.value||0;t.value=Math.max(i-1,1)})),t.parentNode.appendChild(i)}},
        ".product-info-main":class{constructor(t){const e=t.querySelector(".plp-mosaic, #gallery"),i=[...t.querySelectorAll(".product-brand>span, #gallery~div, .vintage_variable, .plp-landing-instructions, .delivery-estimate, .extra_description")],s=e&&e.offsetTop,r=e&&e.offsetHeight;e&&i[0].offsetLeft<e.offsetLeft+e.offsetWidth||window.addEventListener("scroll",(t=>{let e=i.reduce(((t,e)=>t+e.offsetHeight),0),n=Math.max(r-e,0),o=window.scrollY+100,l=Math.min(Math.max(o-s,0),n);for(let t of i)t.style.transform=`translateY(${l}px)`}),{capture:!0,passive:!0})}},
        '.mega-menu, [x-ref="nav-desktop"]':class{constructor(t){new MutationObserver(((e,i)=>{const s=t.querySelectorAll('.level-0[\\@mouseenter*="category-node"]');for(let t of s){let e=t.querySelectorAll(".submenu-item>div>a").length>0?2:1;t.setAttribute("data-tiers",e)}const r=t.querySelectorAll(".submenu-item");for(let t of r){const e=t.querySelectorAll("a+div>a").length>11?2:1;t.setAttribute("data-span",e)}const n=t.querySelectorAll(".megamenu-banner");for(let t of n){const e=t.querySelectorAll('[data-content-type="banner"');t.parentNode.setAttribute("data-banners",e.length)}})).observe(t,{attributes:!1,childList:!0,subtree:!0})}},
        ".tabbed-carousel, .gifting-home-recommendations":class{constructor(t){const e=[...t.querySelectorAll('[data-content-type="buttons"] a, [data-content-type="buttons"] button')];for(let i in e)e[i].addEventListener("click",(e=>{e.preventDefault(),t.setAttribute("data-active",i)}));t.setAttribute("data-active",0)}},
        ".back-to-top":class{constructor(t){t.addEventListener("click",(t=>{t.preventDefault(),t.stopPropagation(),window.scrollTo({top:0,behavior:"smooth"})}),!0)}},
        ".undock-parent":class{constructor(t){const e=t.parentNode.offsetHeight;let i=window.scrollY;window.addEventListener("scroll",(async t=>{document.body.setAttribute("data-direction",window.scrollY>i?"down":"up"),document.body.setAttribute("data-undocked",window.scrollY>e),i=window.scrollY}),{capture:!0,passive:!0})}},
        ".toggle":class{constructor(t){t.addEventListener("click",(e=>{e.preventDefault(),e.stopPropagation(),t.setAttribute("data-toggle","true"!==t.getAttribute("data-toggle"))}),!0)}},
        '.toggle-parent, [x-data^="initMenuMobile"] .level-0>div>a~a span:first-of-type':class{constructor(t){t.addEventListener("click",(e=>{e.preventDefault(),e.stopPropagation(),t.parentNode.setAttribute("data-toggle","true"!==t.parentNode.getAttribute("data-toggle"))}),!0)}}
    }
*/
    const tailwindEffects = {
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