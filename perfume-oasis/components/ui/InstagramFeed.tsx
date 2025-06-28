// components/ui/InstagramFeed.tsx
import Image from 'next/image';
import { Heart, MessageCircle } from 'lucide-react';

interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
}

// Mock data - replace with actual Instagram API
const mockPosts: InstagramPost[] = [
  { id: '1', image: '/images/products/1.jpg', caption: 'New arrival', likes: 234, comments: 12 },
  { id: '2', image: '/images/products/2.jpg', caption: 'Summer collection', likes: 456, comments: 23 },
  { id: '3', image: '/images/products/3.jpg', caption: 'Limited edition', likes: 789, comments: 34 },
  { id: '4', image: '/images/products/4.jpg', caption: 'Best seller', likes: 321, comments: 45 },
];

export function InstagramFeed() {
  return (
    <section className="py-16 bg-sand-50">
      <div className="container mx-auto px-4">
        {/* Header with Instagram Profile Image */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative w-24 h-24 mb-4">
            <Image 
              src="/images/square-designs/social-media/PO-square-instagram-profile.jpg"
              alt="Perfume Oasis Instagram"
              fill
              className="object-cover rounded-full border-4 border-[#C8A95B]"
            />
          </div>
          <h2 className="text-3xl font-bold text-[#0E5C4A] text-center">
            Follow @PerfumeOasisZA
          </h2>
          <p className="text-[#2C2C2C] mt-2">Join our fragrance community</p>
        </div>

        {/* Instagram Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {mockPosts.map((post) => (
            <a
              key={post.id}
              href="https://instagram.com/perfumeoasizza"
              target="_blank"
              rel="noopener noreferrer"
              className="aspect-square relative group cursor-pointer"
            >
              <Image 
                src={post.image}
                alt={post.caption}
                fill
                className="object-cover rounded-lg"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#0E5C4A]/0 group-hover:bg-[#0E5C4A]/70 transition-all duration-300 rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                  <div className="flex items-center justify-center space-x-4 mb-2">
                    <div className="flex items-center">
                      <Heart className="w-5 h-5 mr-1 fill-current" />
                      <span className="text-sm font-semibold">{post.likes}</span>
                    </div>
                    <div className="flex items-center">
                      <MessageCircle className="w-5 h-5 mr-1 fill-current" />
                      <span className="text-sm font-semibold">{post.comments}</span>
                    </div>
                  </div>
                  <p className="text-xs px-4">{post.caption}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a 
            href="https://instagram.com/perfumeoasizza"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-[#0E5C4A] hover:text-[#C8A95B] font-semibold"
          >
            View More on Instagram
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
