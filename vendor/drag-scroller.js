/*! Drag Scroller v0.0.1 - (c) 2024 Maurice van Creij - MIT License - https://github.com/WoollyMittens */

export class DragScroller {
	constructor(config) {
		this.config = config;
		this.container = config.container;
		this.increments = config.increments;
		this.snap = config.snap || { behavior: "smooth", block: "nearest", inline: "start" }
		this.decay = config.decay || 0.9;
		this.scrollHandler = config.scrollHandler;
		this.interactionHandler = config.interactionHandler || function(){};
		this.previous = null;
		this.distance = 0;
		this.inertia = 0;
		this.timeout = null;
		if (window.matchMedia("(pointer:fine)").matches) {
			this.container.addEventListener("mousedown", this.onDragStart.bind(this));
			this.container.addEventListener("mousemove", this.onDragMove_mouse.bind(this));
			document.body.addEventListener("mouseup", this.onDragEnd.bind(this));
		} else {
			this.container.addEventListener("touchstart", this.onDragStart.bind(this));
			this.container.addEventListener("touchmove", this.onDragMove_touch.bind(this));
			document.body.addEventListener("touchend", this.onDragEnd.bind(this));
		}
		this.container.addEventListener("scroll", this.onScroll.bind(this), { passive: true });
	}

	onDragStart(evt) {
		this.previous = evt.clientX || evt.touches[0].clientX;
	}

	onDragMove_mouse(evt) {
		if (this.previous !== null) {
			evt.preventDefault(evt);
			let current = evt.clientX;
			let offset = current - this.previous;
			this.container.scrollBy({ left: -offset });
			this.inertia = offset;
			this.distance += offset;
			this.previous = current;
			this.interactionHandler(evt, this.distance);
		}
	}

	onDragMove_touch(evt) {
		if (this.previous !== null) {
			let current = evt.touches[0].clientX;
			let offset = current - this.previous;
			this.distance += offset;
			this.previous = current;
			this.interactionHandler(evt, this.distance);
		}
	}

	onDragEnd(evt) {
		if (this.increments) { this.snapScroll(this.distance, evt) } 
		else { this.decayScroll(this.distance, evt) }
		this.previous = null;
		this.distance = 0;
	}

	onScroll(evt) {
		this.scrollHandler(evt);
	}

	snapScroll(direction) {
		if (direction === 0) return;
		const containerRect = this.container.getBoundingClientRect();
		let increment = (direction > 0) ? -1 : 1;
		let index = (increment < 0) ? this.increments.length : -1 ;
		let nearest = this.container.scrollWidth;
		let distance = nearest;
		let count = 0;
		while (Math.abs(distance) <= Math.abs(nearest) && count < this.increments.length) {
			count++;
			index = index + increment;
			nearest = distance;
			let incrementRect = this.increments[index].getBoundingClientRect();
			distance = (this.snap.inline === "start") ?
				incrementRect.left - containerRect.left:
				(incrementRect.left + incrementRect.width / 2) - (containerRect.left + containerRect.width / 2);
		}
		setTimeout(() => {
			this.increments[index].scrollIntoView(this.snap);
		}, 10);
	}

	decayScroll() {
		window.requestAnimationFrame(() => {
			this.inertia *= this.decay;
			this.container.scrollBy({ left: -this.inertia });
			if (Math.abs(this.inertia) >= 2) this.decayScroll(this.container);
		});
	}
}

window.DragScroller = DragScroller;
