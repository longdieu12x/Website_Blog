let controller;
let slideScene;
let pageScene;
let detailScene;
function animateSlides(){
    controller = new ScrollMagic.Controller();
    const slides = document.querySelectorAll('.slide');
    const nav = document.querySelector('.nav-header');
    slides.forEach((slide,index,slides) => {
        const revealImg = slide.querySelector('.reveal-img');
        const img = slide.querySelector('img');
        const revealText = slide.querySelector('.reveal-text');
        const slideTl = gsap.timeline({defaults: {
            duration: 1,
            ease: 'power2.inOut'
        }})
        slideTl.fromTo(revealImg, {x: "0%"} , {x: "100%"});
        slideTl.fromTo(img, { scale: 2 }, { scale:  1}, "-=1");
        slideTl.fromTo(revealText, {x: "0%"} , {x: "100%"}, "-=0.75");
        

        //Create Scene
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25,
            reverse: false
        })
        .setTween(slideTl)
        .addIndicators({colorStart: 'white',colorTrigger: 'white',name: 'slide'})
        .addTo(controller);
        // New Animation
        const pageTl = gsap.timeline();
        let nextSlide= slides.length - 1 === index? 'end' : slides[index+1];

        pageTl.fromTo(nextSlide, { y: '0%'}, { y: '50%'});
        pageTl.fromTo(slide, {opacity:1, scale: 1}, {opacity: 0, scale: 0.5});
        pageTl.fromTo(nextSlide, { y: '50%'}, { y: '0%'}, '-=0.5');
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0, 
        })
        .setPin(slide, { pushFollowers: false })
        .setTween(pageTl)
        .addIndicators({colorStart: 'white',colorTrigger: 'white',name: 'page',indent: 200})
        .addTo(controller);
})}
const  mouse = document.querySelector('.cursor');
const mouseTxt = document.querySelector('.cursor-text');
const button = document.querySelector('.burger');
function moveCursor(e){
    mouse.style.top = e.pageY + 'px';
    mouse.style.left = e.pageX + 'px';
}
function activeCursor(e){
    const item = e.target;
    if ((item.id === 'logo') || (item.classList.contains('burger'))){
        mouse.classList.add('nav-active');
    }
    else {
        mouse.classList.remove('nav-active');
    }
    if (item.classList.contains('explore')){
        mouse.classList.add('explore-active');
        gsap.to('.title-swipe', 1 ,{y: "0%"});
        mouseTxt.innerText = 'Tap';
    }
    else {
        mouse.classList.remove('explore-active');
        gsap.to('.title-swipe', 1 ,{y: "100%"});
        mouseTxt.innerText = '';
    }
}
const navBar = document.querySelector('.nav-bar');
function navToggle(e){
    if (!e.target.classList.contains("active")){
    e.target.classList.add('active');
    gsap.to(".line1",0.5,{ rotate: "45", y: 5, background: "black",});
    gsap.to(".line2",0.5,{ rotate: "-45", y: -5 , background: "black",});
    gsap.to('#logo', 1, {color: "black"});
    gsap.to('.nav-bar', 1, {clipPath: "circle(2500px at 100% -10%)"})
    document.body.classList.add('hide');
}
    else {
    e.target.classList.remove('active');
    gsap.to(".line1",0.5,{ rotate: "0", y: 0, background: "white",});
    gsap.to(".line2",0.5,{ rotate: "0", y: 0 , background: "white",});
    gsap.to('#logo', 1, {color: "white"});
    gsap.to('.nav-bar', 1, {clipPath: "circle(50px at 100% -10%)"})
    document.body.classList.remove('hide');
}
}
//Change page 
const logo = document.querySelector("#logo");
barba.init({
    views: [
        {
            namespace: "home",
            beforeEnter() {
              animateSlides();
              logo.href = "./index.html"
            },
            beforeLeave() {
              slideScene.destroy();
              pageScene.destroy();
              controller.destroy();
            }
        }
        ,
        {
            namespace: "fashion",
            beforeEnter() {
              logo.href = "../index.html"
              detailAnimation();
            },
            beforeLeave() {
                detailScene.destroy();
                controller.destroy();
            }
          }

    ],
    transitions: [
        {
            leave(current,next){
                let done = this.async();
                const tl = gsap.timeline({ defaults: {ease: 'power2.inOut'}});
                tl.fromTo(current.container, 1 ,{opacity: 1}, {opacity: 0});
                tl.fromTo('.swipe', 0.75 ,{x: '-100%'}, {x: '0%', onComplete: done}, "-=0.5" );
            }
            ,
            enter({ current, next }) {
                let done = this.async();
                //Scroll to the top
                window.scrollTo(0,0);
                //An Animation
                const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
                tl.fromTo('.swipe', 1 , {x:'0'}, {x:'100%', stagger: 0.25, onComplete: done}, "-=0.5")
                tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
                tl.fromTo('.nav-header', 1 ,{y: '-100%'}, {y: '0%', ease: "power2.inOut"}, "-= 1.2");
            }
        }
    ]


})
function detailAnimation(){
    controller = new ScrollMagic.Controller();
    const slides = document.querySelectorAll('.detail-slide');
    slides.forEach((slide,index,slides) => {
        const slideTl = gsap.timeline({defaults : { duration: 1 }});
        let nextSlide = slides.length -1 === index ? "end" : slides[index+1];
        const nextImg = nextSlide.querySelector('img');
        slideTl.fromTo(slide, {opacity: 1}, {opacity: 0});
        slideTl.fromTo(nextSlide, {opacity: 0}, {opacity: 1});
        slideTl.fromTo(nextImg, 1,{x: "50%"}, {x: "0%"});
        detailScene  = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0, 
        })
        .setPin(slide, { pushFollowers: false })
        .setTween(slideTl)
        .addIndicators({colorStart: 'white',colorTrigger: 'white',name: 'detail'})
        .addTo(controller);
    })
}
button.addEventListener('click',navToggle);
window.addEventListener('mouseover',activeCursor);
window.addEventListener('mousemove',moveCursor);
animateSlides();