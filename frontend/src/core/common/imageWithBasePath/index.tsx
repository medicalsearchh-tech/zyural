import { img_path } from '../../../environment';
import type { CSSProperties } from 'react';

interface Image {
  className?: string;
  src: string;
  alt?: string;
  height?: number;
  width?: number;
  id?: string;
  style?: CSSProperties; // ✅ allow inline styles
}

const ImageWithBasePath = (props: Image) => {
  // Combine the base path and the provided src to create the full image source URL
  const fullSrc = props.src?.startsWith('https') ? props.src : `${img_path}${props.src}`;
  return (
    <img
      className={props.className}
      src={fullSrc}
      height={props.height}
      alt={props.alt}
      width={props.width}
      id={props.id}
      style={props.style} // ✅ pass style to <img>
    />
  );
};

export default ImageWithBasePath;
