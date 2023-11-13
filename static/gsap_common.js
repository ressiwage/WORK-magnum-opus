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

const qualitiesElements = gsap.utils.toArray('.my-qualities .col-6>ul>*')


const qualities = gsap.timeline({
    repeat: 0,

    yoyo: false,
})

qualitiesElements.forEach(elem => {
    qualities.from(elem,
        {
            scaleY: 0,
            // yPercent: 50,
            duration: 0.3,
            ease: "power3.out"
        })
})


ScrollTrigger.create({
    trigger: ".my-qualities",
    start: "bottom bottom",
    once: true,
    onEnter: (self) => {
        qualities()
    },
});
ScrollTrigger.create({
    trigger: ".projects",
    start: "top bottom",
    onEnter: (self) => {
        gsap.to(['.networks a', '.simple-link'], {
            backgroundColor: 'rgba(0,0,0,0.0)',
            ease: "power3.out",
            duration: 1
        })
    },
});

ScrollTrigger.create({
    trigger: ".portfolio",
    start: "top bottom",
    onEnterBack: (self) => {
        gsap.to(['.networks a', '.simple-link'], {
            backgroundColor: 'var(--back)',
            ease: "power3.out",
            duration: 1
        })
    },
});

gsap.utils.toArray('.my-experience p').forEach(
    (elem) => {
        ScrollTrigger.create({
            trigger: elem,
            start: 'bottom bottom',
            onEnter: () => {
                gsap.to(elem,
                    {
                        scaleY: 1,
                        translateY:0,
                        duration: 0.3,
                        once: true,
                        ease: "power3.out"
                    })
            }
        })
    }
)
gsap.utils.toArray('.project-card').forEach(
    (elem) => {
        ScrollTrigger.create({
            trigger: elem,
            start: 'bottom bottom',
            onEnter: () => {
                gsap.to(elem,
                    {
                        scaleY: 1,
                        translateY:0,
                        duration: 0.3,
                        once: true,
                        ease: "power3.out"
                    })
            }
        })
    }
)

const technologiesElems = gsap.utils.shuffle(gsap.utils.toArray('.technologies .col-6>ul li'))



const technologies = gsap.timeline({
    repeat: 0,

    yoyo: false,
})

technologiesElems.forEach(elem => {
    qualities.from(elem,
        {
            scaleY: 0,
            // yPercent: 50,
            duration: 0.3,
            ease: "power3.out"
        },
        "<+=0.05")
})


ScrollTrigger.create({
    trigger: ".technologies",
    start: "top top",
    once: true,
    onEnter: (self) => {
        technologies()
    },
});