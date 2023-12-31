import { useRef, useEffect } from "react";
import "./Animation.css";

const Animation = () => {
  //   let prev = Date.now();
  //   let times = 0;
  //   requestAnimationFrame(function measure(time) {
  //     console.log(time - prev);
  //     prev = time;
  //     if (times++ < 10) {
  //       requestAnimationFrame(measure);
  //     }
  //   });

  const divNum = useRef(null);

  function animate({ timing, draw, duration }) {
    let start = performance.now();
    requestAnimationFrame(function animate(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) {
        timeFraction = 1;
      }

      let progress = timing(timeFraction);
      draw(progress);
      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      }
    });
  }

  useEffect(() => {
    animate({
      duration: 1000,
      timing(timeFraction) {
        return timeFraction;
      },
      draw(progress) {
        divNum.current.style.fontSize = progress * 100 + "px";
        console.log(divNum);
      },
    });
  }, []);

  return <div ref={divNum}>12</div>;
};

export default Animation;
