// components/items/shared/MediaBlock.tsx
import Image from 'next/image'
import { Item } from '@/lib/types'

interface MediaBlockProps {
  media: Item['media']
  name: string
}

export default function MediaBlock({ media, name }: MediaBlockProps) {
  const image = media?.images?.[0]
  if (!image) return null
  return (
    <div className="mb-6">
      <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={image.url}
          alt={image.alt || name}
          fill
          className="object-contain"
        />
      </div>
      {image.caption && (
        <p className="text-sm text-gray-600 text-center mt-2">{image.caption}</p>
      )}
    </div>
  )
}
