
import { useEffect, useRef, useState } from "react";
import { Icons } from "../../utils";

interface CarouselProp {
  props: Ui.Banner[];
  time: number;
  actions?: boolean;
  link?: string;
}
const Carousel: React.FC<CarouselProp> = ({ props, time, actions = true }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const imageRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<any>();

  const prevSlide = () => {
    const newSlide = currentSlide === 0 ? props.length - 1 : currentSlide - 1;
    setCurrentSlide(newSlide);
    imageRef.current?.classList.add("fade-in");
  };
  const nextSlide = () => {
    const newSlide = currentSlide === props.length - 1 ? 0 : currentSlide + 1;
    setCurrentSlide(newSlide);
    imageRef.current?.classList.add("fade-in");
  };

  const removeAnimation = () => {
    imageRef.current?.classList.remove("fade-in");
  };

  const pauseSlider = () => {
    clearInterval(sliderRef.current);
  };

  const autoPlay = () => {
    sliderRef.current = setInterval(
      () => {
        nextSlide();
      },
      time <= 0 ? 3000 : time
    );
  };

  useEffect(() => {
    imageRef.current?.addEventListener("animationend", removeAnimation);
    autoPlay();
    return () => {
      pauseSlider();
      imageRef.current?.addEventListener("animationend", removeAnimation);
    };
  }, [currentSlide]);

  return (
    <div className="relative w-full h-full py-8 group z-1">
      <a
        aria-label={`go to ${props[currentSlide].title}`}
        onClick={(e) => {
          if (!props[currentSlide].link) e.preventDefault();
        }}
        aria-disabled={!props[currentSlide].link}
        href={props[currentSlide].link ? props[currentSlide].link : ""}
        target="_blank"
      >
        <div
          className="w-full h-full overflow-hidden duration-500 bg-center bg-no-repeat bg-cover rounded-xl"
          ref={imageRef}
          style={{
            backgroundImage: `url(${props[currentSlide].image})`,
          }}
        ></div>
      </a>
      {actions && (
        <>
          <div className="absolute  z-[100] cursor-pointer bg-[var(--dark-text)] text-[var(--light-text)] p-1 rounded-full group-hover:block hidden top-[50%] left-3 sm:left-8 -translate-x-0 translate-y-[-50%] hover:bg-[var(--secondary-color)]">
            <Icons.chevronLeft
              className="sm:size-6 size-5 hover:text-[var(--dark-text)] "
              onClick={prevSlide}
            />
          </div>
          <div className="absolute z-[100] cursor-pointer bg-[var(--dark-text)] text-[var(--light-text)] p-1 rounded-full group-hover:block hidden top-[50%] sm:right-8 right-3 -translate-x-0 translate-y-[-50%] hover:bg-[var(--secondary-color)]">
            <Icons.chevronRight
              className="sm:size-6 size-5 hover:text-[var(--dark-text)] "
              onClick={nextSlide}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Carousel;

{
  /* <img
          src={props.slides[currentSlide].url}
          alt="banner"
          className="object-cover object-center w-full h-full"
        /> */
}

export const MultiCardSlider: React.FC = () => {
  return <div className="w-full h-full">Carousel</div>;
};
