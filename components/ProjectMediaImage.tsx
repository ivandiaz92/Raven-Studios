import Image from 'next/image'

interface ProjectMediaImageProps {
  src: string
  alt: string
  priority?: boolean
  /** Hero cover on project detail */
  emphasis?: boolean
}

export default function ProjectMediaImage({
  src,
  alt,
  priority = false,
  emphasis = false,
}: ProjectMediaImageProps) {
  return (
    <div className="w-full rounded-lg border border-gray-800/40 bg-transparent">
      <Image
        src={src}
        alt={alt}
        width={0}
        height={0}
        sizes={
          emphasis
            ? '(max-width: 1024px) 92vw, 640px'
            : '(max-width: 1024px) 96vw, 1200px'
        }
        className={`mx-auto block h-auto w-full object-contain object-center ${
          emphasis
            ? 'max-h-[min(70vh,800px)]'
            : 'max-h-[min(88vh,1200px)]'
        }`}
        unoptimized
        priority={priority}
      />
    </div>
  )
}
