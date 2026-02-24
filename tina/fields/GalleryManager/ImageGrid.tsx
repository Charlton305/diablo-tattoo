// tina/fields/GalleryManager/ImageGrid.tsx
import { ImageCard } from './ImageCard'
import type { GalleryImage } from './index'

interface ImageGridProps {
  images: GalleryImage[]
  previewUrls: Map<string, string>
  deletingIndex: number | null
  imgSrc: (src: string) => string
  onView: (index: number) => void
  onMoveUp: (index: number) => void
  onMoveDown: (index: number) => void
  onDeleteRequest: (index: number) => void
  onDeleteConfirm: (index: number) => void
  onDeleteCancel: () => void
}

export const ImageGrid = ({
  images,
  previewUrls,
  deletingIndex,
  imgSrc,
  onView,
  onMoveUp,
  onMoveDown,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
}: ImageGridProps) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
      gap: 12,
    }}
  >
    {images.map((img, i) => (
      <ImageCard
        key={i}
        image={img}
        index={i}
        total={images.length}
        isDeleting={deletingIndex === i}
        isPending={previewUrls.has(img.src)}
        imgSrc={imgSrc}
        onView={() => onView(i)}
        onMoveUp={() => onMoveUp(i)}
        onMoveDown={() => onMoveDown(i)}
        onDeleteRequest={() => onDeleteRequest(i)}
        onDeleteConfirm={() => onDeleteConfirm(i)}
        onDeleteCancel={onDeleteCancel}
      />
    ))}
  </div>
)
