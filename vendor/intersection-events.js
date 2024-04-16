/*! Intersection Events v0.0.1 - (c) 2024 Maurice van Creij - MIT License - https://github.com/WoollyMittens */

export class IntersectionEvents {
	constructor(options) {
		const defaults = {
			root: null,
			rootMargin: "0px 0px 0px 0px",
			threshold: [0]
		};
		this.options = {...defaults, ...options};
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

window.IntersectionEvents = IntersectionEvents;
