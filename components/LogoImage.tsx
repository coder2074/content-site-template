// components/LogoImage.tsx
'use client'

type LogoImageProps = {
  src: string
  alt: string
  width: number
  height: number
  className?: string
}

export function LogoImage({
  src,
  alt,
  width,
  height,
  className,
}: LogoImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => {
        e.currentTarget.style.display = 'none'
      }}
    />
  )
}
