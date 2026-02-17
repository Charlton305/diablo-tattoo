import { tinaField } from 'tinacms/dist/react'
import type { HomepageArtists } from '@/tina/__generated__/types'
import ArtistsGrid from '@/components/shared/ArtistsGrid';

interface Artist {
  slug: string;
  image: string;
  imageAlt: string;
  name: string;
}

interface ArtistsSectionProps {
  artistsData: HomepageArtists | null | undefined;
  artists: Artist[];
}

export default function ArtistsSection({ artistsData, artists }: ArtistsSectionProps) {
  return (
    <section className="py-20 md:py-32 bg-zinc-950">
      <div className="container mx-auto px-4 max-w-8xl">
        <h2
          className="text-4xl sm:text-5xl uppercase md:text-6xl text-center mb-16"
          data-tina-field={artistsData ? tinaField(artistsData, 'heading') : undefined}
        >
          {artistsData?.heading ?? ''}
        </h2>

        <ArtistsGrid artists={artists} />
      </div>
    </section>
  );
}
