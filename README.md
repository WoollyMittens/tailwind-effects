# Tailwind Effects

A library to tie scripted events to tailwind classes.

## Sticky Nav

Shows a sticky navigation bar only on the way back up.

```html
<header class="twfx-direction bg-neutral-500 sticky top-0 flex gap-4 z-50 justify-between px-5 py-2 transition-all"
    data-down="sticky -top-full md:-top-10"
    data-up="sticky top-0">
```

**data-down: {className}** - Positioning of the toolbar when scrolling down the page.

**data-up: {className}** - Positioning of the toolbar when scrolling up the page.

## Carousels

### Hero Slider

A slideshow with touch controls.

```html
<div class="twfx-hero relative w-full aspect-[3/4] md:aspect-[16/4]"
    data-slider=":scope>div"
    data-slides=":scope>div>a"
    data-nav="hidden md:block absolute top-1/2 -mt-5 w-10 h-10 z-40 overflow-hidden whitespace-nowrap indent-10 bg-no-repeat bg-center bg-contain cursor-pointer opacity-75 transition-opacity"
    data-nav-prev="arrow-light left-2 rotate-180"
    data-nav-next="arrow-light right-2"
    data-nav-passive="cursor-default opacity-25"
    data-nav-active="cursor-pointer opacity-75"
    data-dots="flex md:hidden justify-center items-center gap-2 px-4 h-8"
    data-dot="bg-black opacity-25 w-3 h-3 rounded-full overflow-hidden indent-5"
    data-dot-passive="opacity-25 w-3 h-3"
    data-dot-active="opacity-50 w-4 h-4"
    data-idle="3000">
    <div class="flex w-full h-full overflow-auto snap-x snap-mandatory">
```

### Product Carousel

A product carousel with touch controls.

```html
<div class="twfx-carousel relative -mx-2 mb-10"
    data-slider=":scope>div"
    data-slides=":scope>div>article"
    data-nav="hidden md:block absolute -top-14 w-6 h-6 z-50 overflow-hidden whitespace-nowrap indent-10 bg-no-repeat bg-center bg-contain cursor-pointer opacity-75 transition-opacity"
    data-nav-prev="arrow-dark right-12 rotate-180"
    data-nav-next="arrow-dark right-2"
    data-nav-passive="cursor-default opacity-25"
    data-nav-active="cursor-pointer opacity-75"
    data-dots="flex md:hidden justify-center items-center gap-2 px-4 h-8"
    data-dot="bg-black opacity-25 w-3 h-3 rounded-full overflow-hidden indent-5"
    data-dot-passive="opacity-25 w-3 h-3"
    data-dot-active="opacity-50 w-4 h-4">
    <div class="flex w-full overflow-auto snap-x snap-mandatory">
```

### Callouts

Scrolls horizontally to save space on mobile.

```html
<div class="twfx-carousel mb-10"
    data-slider=":scope>div"
    data-slides=":scope>div>article"
    data-dots="flex md:hidden justify-center items-center gap-2 px-4 h-8"
    data-dot="bg-black opacity-25 w-3 h-3 rounded-full overflow-hidden indent-5"
    data-dot-passive="opacity-25 w-3 h-3"
    data-dot-active="opacity-50 w-4 h-4">
    <div class="flex w-full overflow-auto gap-4 snap-x snap-mandatory">
```

**data-slider: {querySelector}** - The container for the slides to scroll around in.

**data-slides: {querySelector}** - The individual slides.

**data-nav: {className}** - The common styling for both direction arrows.

**data-nav-prev: {className}** - Styling for the back arrow.

**data-nav-next: {className}** - Styling for the forward arrow.

**data-nav-passive: {className}** - Styling for deactivated arrows.

**data-nav-active: {className}** - Styling for actice arrows.

**data-dots: {className}** - Styling for the page indicator dots.

**data-dot: {className}** - Styling for an individual dot.

**data-dot-passive: {className}** - Styling for a deactivated dot.

**data-dot-active: {className}** - Styling for an activated dot.

**data-idle: {number}** - The time in miliseconds between automatic slide transitions if left idle.

## Read More

Reveals additional content.

```html
<a class="twfx-toggle inline-block underline text-sm text-blue-500 hover:text-blue-300" href="#" 
    data-passive="inline-block" 
    data-active="hidden"
    data-parent="2"
    data-target=".extra-content"
    data-closed="hidden"
    data-open="block">
```

**data-passive: {className}** - Styling when the link is unused.

**data-active: {className}** - Styling after the link is used.

**data-parent: {number}** - The amount of levels up to the common container.

**data-target: {querySelector}** - A selector for the unexpanded content down from the common container.

**data-closed: {className}** - Styling for the unrevealed content.

**data-open: {className}** - Styling for the revealed content.

## FAQ Accordion

Toggles question and answer sections.

```html
<dl class="twfx-accordion border-b border-black mb-10"
    data-title=":scope > dt"
    data-passive="after:rotate-90"
    data-active="after:-rotate-90"
    data-descriptions=":scope > dd"
    data-closed="overflow-hidden max-h-0"
    data-open="overflow-auto max-h-[75vh]">
```

**data-title: {querySelector}** - A selector for the title container.

**data-passive: {className}** - Styling for the passive state of the title.

**data-active: {className}** - Styling for the active state of the title.

**data-descriptions: {querySelector}** - A selector for the description containers.

**data-closed: {className}** - Styling for the unrevealed description.

**data-open: {className}** - Styling for the revealed description.

## Tab Strip

Selectively shows tabbed content.

```html
<dl class="twfx-tabs flex flex-wrap gap-px after:content-[''] after:block after:order-1 after:border-b after:border-neutral-400 after:grow mb-10"
    data-title=":scope > dt"
    data-passive="text-neutral-500 hover:text-neutral-600 bg-neutral-200 hover:bg-neutral-300 border-neutral-400 border cursor-pointer"
    data-active="text-black bg-white border-neutral-400 border-b-white border"
    data-descriptions=":scope > dd"
    data-closed="hidden"
    data-open="block md:grid"
    data-exclusive>
```

**data-title: {querySelector}** - A selector for the tab titles.

**data-passive: {className}** - Styling for the passive state of the tab title.

**data-active: {className}** - Styling for the activated state of he tab title.

**data-descriptions: {querySelector}** - A selector for the tabbed content.

**data-closed: {className}** - Styling for the hidden state of the tabbed content.

**data-open: {className}** - Styling for the revealed state of the tabbed conttent.

**data-exclusive: {flag}** - A flag that allows only one tab to be open at a time.

## Reveal

An animated reveal as soon as content enters the view.

```html
<article class="twfx-reveal inline-flex flex-col gap-4 basis-1/4 transition-all delay-0 duration-500 opacity-0 translate-y-1/4"
    data-passive="opacity-0 translate-y-1/4"
    data-active="opacity-100 translate-y-0">
```

**data-passive: {className}** - Styling for the unrevealed state.

**data-active: {className}** - Styling for the revealed state.

## Increment

Increment a quantity input counter.

```html
<input class="twfx-increment order-2 w-24 h-12 bg-neutral-200 text-center" type="number" min="0" max="99" value="0"
    data-decrement="flex items-center justify-center order-1 w-12 h-12 bg-neutral-200 hover:bg-neutral-100 after:content-['-']"
    data-increment="flex items-center justify-center order-3 w-12 h-12 bg-neutral-200 hover:bg-neutral-100 after:content-['+']"/>
```

**value: {number}** - Starting value of the counter.

**min: {number}** - Minimum value of the counter.

**max: {number}** - Maximum value of the counter.

**data-decrement: {className}** - Styling for the buton that decreases the counter.

**data-increment: {className}** - Styling for the button that inceased the counter.

## Templated Content

Populates a section only after it enters the view.

```html
<article id="example" class="twfx-template inline-flex flex-col gap-4 basis-1/4"
    data-template="#example-template" 
    data-keyword="value">
<template id="example-template">
    <h3>{data-keyword}</h3>
</template>
```

**data-template: {querySelector}** - A selector to the template for the content.

**data-keyword: {string}** - Any data attribute to populate the templated content with.

## Relocate Container

Moves a container to a different place in the document.

```html
<section class="twfx-relocate" 
    data-destination="body">
```

**data-destination: {querySelector}** - A selector for the destination container.

## Back to Top

An animated scroll back to the top (or anywhere else).

```html
<button class="twfx-totop">
<a class="twfx-scrollto" href="#carousel">
```

**href: {querySelector}** - A selector for the container to scroll into view.

## References

1. Tailwind framework - https://tailwindcss.com/
2. Placeholder images - https://placehold.co/480x640/
3. Placeholder text - https://lipsum.com/