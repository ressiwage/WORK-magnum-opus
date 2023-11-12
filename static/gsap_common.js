import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";


gsap.registerPlugin(ScrollTrigger);

// const body = document.querySelector("body");
// const mainContainer = body.querySelector(".projects");
// const extraLongContainer = mainContainer.querySelector(".projects>div.row");

// let scrollTween = gsap.to(".projects>div.row", {
//     xPercent: -100,
//     x: () => window.innerWidth,
//     ease: "none",
//     scrollTrigger: {
//         trigger: ".projects>div.row",
//         start: "top top",
//         end: () => "+=" + extraLongContainer.offsetWidth + "px",
//         scrub: true,
//         pin: true,
//         invalidateOnRefresh: true,
//         anticipatePin: 1
//     }
// });

// const t1 = gsap.timeline({
//     scrollTrigger: {
//         trigger: "project-card",
//         start: "left 70%",
//         end: "left 20%",
//         scrub: 1,
//         containerAnimation: scrollTween,
//         markers: true
//     },
// })