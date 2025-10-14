import React, { ReactNode } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Importar el CSS correcto de Swiper
import 'swiper/css/pagination'; // Asegúrate de importar el CSS para la paginación

import { Instagram, Twitter, Facebook } from 'lucide-react';
import { Pagination } from 'swiper/modules';

type SocialLinks = {
  instagram?: string;
  twitter?: string;
  facebook?: string;
};

export type CarouselItem = {
  image: string;
  title: string;
  subtitle: string;
  socialLinks: SocialLinks;
};

interface PeopleSliderProps {
  title: string;
  subtitle: string|ReactNode;
  items: CarouselItem[];
}

const PeopleSlider: React.FC<PeopleSliderProps> = ({ title, subtitle, items }) => {
  const pagination = {
    clickable: true,
    injectStyles: [`
    `],
    renderBullet: function (index: number, className: string) {
      return `<span class="${className} transition-all duration-300 index-${index}"></span>`; // Personaliza el renderizado de los bullets
    },
  };

  return (
    <div className="w-full flex flex-col items-center bg-black -mt-2">
      {/* Header Section */}
      <div className="text-center md:w-8/12 w-full px-4 mb-24 py-5">
        <h1 className="text-5xl font-anek-latin font-bold mb-4 md:text-5xl text-white">{title}</h1>
        <p className="text-2xl font-afacad text-white max-w-3xl mx-auto">{subtitle}</p>
      </div>

      {/* Carousel Container */}
      <Swiper
        spaceBetween={20} // Ajusta el espacio entre los slides
        slidesPerView={2.5} // Cuántos slides se ven al mismo tiempo
        loop // Para que el carrusel sea infinito
        autoplay={{
          delay: 5000, // Cambio automático de slide cada 5 segundos
          disableOnInteraction: false,
        }}
        breakpoints={{
          320: {
            slidesPerView: 1.5, // 1.5 slides por vista en pantallas móviles
          },
          768: {
            slidesPerView: 2.5, // 2.5 slides por vista en pantallas medianas (tabletas)
          },
          1024: {
            slidesPerView: 2.5, // 2.5 slides por vista en pantallas grandes (escritorio)
          },
        }}
        pagination={pagination} // Aplicamos la paginación personalizada
        modules={[Pagination]} // Necesitamos el módulo de Paginación
        className="w-full py-24"
      >
        {items.map((item, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <div className="flex-shrink-0">
              {/* Image Container with Gradient */}
              <div className="relative h-72 md:h-96">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover rounded-lg rounded-b-none"
                  draggable="false"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-80 rounded-lg rounded-br-none rounded-bl-none" />

                {/* Image Overlay Text */}
                <div className="absolute bottom-0 w-full p-4 md:p-6 flex justify-between items-end text-white">
                  <h2 className="text-xl md:text-2xl font-bold">{item.title}</h2>
                  <p className="text-base md:text-lg">{item.subtitle}</p>
                </div>
              </div>

              {/* Footer Section */}
              <div className="bg-white p-4 md:p-6 shadow-lg rounded-lg rounded-t-none">
                <div className="flex justify-between items-center">
                  <div className="flex flex-row items-center gap-3">
                    <h3 className="text-lg md:text-xl font-semibold">{item.title}</h3>
                    <p className="hidden lg:block text-sm md:text-base text-gray-600">{item.subtitle}</p>
                  </div>
                  <div className="flex">
                    {item.socialLinks.instagram && (
                      <a
                        href={item.socialLinks.instagram}
                        className="-mx-1 border-white border-2 hover:bg-purple-300 p-2 rounded-full text-small transition-colors bg-purple-500 text-white inline-block"
                      >
                        <Instagram size={20} />
                      </a>
                    )}
                    {item.socialLinks.twitter && (
                      <a
                        href={item.socialLinks.twitter}
                        className="-mx-1 border-white border-2 hover:bg-purple-300 p-2 rounded-full text-small transition-colors bg-purple-500 text-white inline-block"
                      >
                        <Twitter size={20} />
                      </a>
                    )}
                    {item.socialLinks.facebook && (
                      <a
                        href={item.socialLinks.facebook}
                        className="-mx-1 border-white border-2 hover:bg-purple-300 p-2 rounded-full text-small transition-colors bg-purple-500 text-white inline-block"
                      >
                        <Facebook size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PeopleSlider;
