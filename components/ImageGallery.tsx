interface ImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex gap-4 pb-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-80 h-60 overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
          >
            <img
              src={image}
              alt={`${alt} - Image ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
