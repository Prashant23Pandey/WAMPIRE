import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * CrowdCanvas Component
 * Exact recreation of the walking peep community illustration from https://www.recolabs.in
 * Each hand-drawn builder character walks across the screen with a distinct bobbing cadence,
 * depth layering, and random pacing.
 */
export const CrowdCanvas = ({
  className = 'w-full h-full',
  src = '/peeps.png',
  id = 'crowd-canvas',
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current || document.getElementById(id);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const config = {
      src: src || '/peeps.png',
      rows: 15,
      cols: 7,
    };

    const randomRange = (min, max) => min + Math.random() * (max - min);
    const randomIndex = (arr) => (randomRange(0, arr.length) | 0);
    const removeByIndex = (arr, i) => arr.splice(i, 1)[0];
    const removeItem = (arr, item) => removeByIndex(arr, arr.indexOf(item));
    const removeRandom = (arr) => removeByIndex(arr, randomIndex(arr));
    const getRandom = (arr) => arr[randomIndex(arr) | 0];

    const resetPeep = ({ stage, peep }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const easeFn = gsap?.parseEase ? gsap.parseEase('power2.in') : (t) => t * t;
      const offsetY = 100 - 250 * easeFn(Math.random());
      const yPos = stage.height - peep.height + offsetY;
      let startX, endX;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = yPos;
      peep.anchorY = yPos;

      return { startX, startY: yPos, endX };
    };

    const walks = [
      ({ peep, props }) => {
        const { startX, startY, endX } = props;
        const tl = gsap.timeline();
        tl.timeScale(randomRange(0.4, 0.75));
        tl.to(peep, { duration: 26, x: endX, ease: 'none' }, 0);
        tl.to(peep, { duration: 0.45, repeat: 58, yoyo: true, y: startY - 8 }, 0);
        return tl;
      },
    ];

    const createPeep = ({ image, rect }) => {
      const peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (r) => {
          peep.rect = r;
          peep.width = r[2];
          peep.height = r[3];
        },
        render: (context) => {
          context.save();
          context.translate(peep.x, peep.y);
          context.scale(peep.scaleX, 1);
          context.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height
          );
          context.restore();
        },
      };
      peep.setRect(rect);
      return peep;
    };

    const img = document.createElement('img');
    img.crossOrigin = 'anonymous';

    const stage = { width: 0, height: 0 };
    const allPeeps = [];
    const availablePeeps = [];
    const crowd = [];
    let isVisible = true;

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth, naturalHeight } = img;
      const total = rows * cols;
      const w = naturalWidth / rows;
      const h = naturalHeight / cols;
      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [(i % rows) * w, ((i / rows) | 0) * h, w, h],
          })
        );
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandom(availablePeeps);
      if (!peep) return null;
      peep.walk = getRandom(walks)({
        peep,
        props: resetPeep({ peep, stage }),
      }).eventCallback('onComplete', () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);
      return peep;
    };

    const removePeepFromCrowd = (peep) => {
      removeItem(crowd, peep);
      availablePeeps.push(peep);
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        const p = addPeepToCrowd();
        if (p && p.walk) {
          p.walk.progress(Math.random());
        }
      }
    };

    const render = () => {
      if (!isVisible) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);
      crowd.forEach((p) => p.render(ctx));
      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * dpr;
      canvas.height = stage.height * dpr;

      crowd.forEach((p) => {
        if (p.walk) p.walk.kill();
      });
      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);
      initCrowd();
    };

    img.onerror = () => {
      if (img.src !== window.location.origin + '/peeps.png') {
        img.src = '/peeps.png';
      }
    };

    img.onload = () => {
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    img.src = config.src;

    window.addEventListener('resize', resize);

    let observer = null;
    const parent = canvas.parentElement || canvas;
    if (parent && window.IntersectionObserver) {
      observer = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      });
      observer.observe(parent);
    }

    return () => {
      window.removeEventListener('resize', resize);
      gsap.ticker.remove(render);
      crowd.forEach((p) => {
        if (p.walk) p.walk.kill();
      });
      if (observer) observer.disconnect();
    };
  }, [src, id]);

  return <canvas id={id} ref={canvasRef} className={className} aria-hidden="true" />;
};

export default CrowdCanvas;

