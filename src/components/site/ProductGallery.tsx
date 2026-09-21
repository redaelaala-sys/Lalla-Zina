"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-beige mb-3">
        <Image src={images[active]} alt={alt} fill priority className="object-cover brand-photo" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              className={`relative aspect-[4/5] rounded-lg overflow-hidden border-2 transition ${
                active === i ? "border-rose-dark" : "border-transparent"
              }`}
            >
              <Image src={img} alt={`${alt} ${i + 1}`} fill className="object-cover brand-photo" sizes="120px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
