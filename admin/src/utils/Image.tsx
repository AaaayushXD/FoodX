import React, { useEffect } from "react";

export const Image = ({
  lowResSrc,
  highResSrc,
  alt,
  className,
  draggabe = false,
}: {
  lowResSrc?: string;
  highResSrc: string;
  alt?: string;
  className: string;
  draggabe?: boolean;
}) => {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
 
  useEffect(() => {
    setError(false);

  }, [lowResSrc, highResSrc]);
  return (
    <img
      draggable={draggabe}
      loading="lazy"
      className={`${className} transition-opacity duration-500 ${
        loaded ? "opacity-100" : "opacity-50 blur-sm"
      }`}
      src={
        error ? lowResSrc : loaded ? highResSrc?.trim() : lowResSrc || highResSrc
      }
      alt={alt}
      onLoad={() => {
        setLoaded(true);
      }}
      onError={() => {
        setError(true);
      }}
    />
  );
};
