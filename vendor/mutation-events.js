/*! Mutation Events v0.0.1 - (c) 2024 Maurice van Creij - MIT License - https://github.com/WoollyMittens */

export class MutationEvents {
	constructor(options) {
		const defaults = {
			attributes: true,
			childList: true,
			subtree: true
		}
		this.options = {...defaults, ...options};
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

window.MutationEvents = MutationEvents;
