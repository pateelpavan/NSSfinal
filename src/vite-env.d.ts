/// <reference types="vite/client" />

/// <reference path="./types/images.d.ts" />

declare module '*.png' {
  const pngUrl: string;
  export default pngUrl;
}

declare module '*.jpg' {
  const jpgUrl: string;
  export default jpgUrl;
}

declare module '*.jpeg' {
  const jpegUrl: string;
  export default jpegUrl;
}

declare module '*.gif' {
  const gifUrl: string;
  export default gifUrl;
}

declare module '*.webp' {
  const webpUrl: string;
  export default webpUrl;
}

declare module '*.svg' {
  const svgUrl: string;
  export default svgUrl;
}
