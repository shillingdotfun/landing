import React, { ReactNode, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Importar el CSS correcto de Swiper
import 'swiper/css/pagination'; // Importar la paginación de Swiper
import { Button } from './Button';
import { Pagination } from 'swiper/modules';

type Tab = {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  image: string;
  slides: { title: string, description: string }[]; // Cada tab tiene múltiples slides
};

interface Props {
  title: string;
  subtitle: string|ReactNode;
  tabs: Tab[];
}

const CustomTabs: React.FC<Props> = ({ title, subtitle, tabs }) => {
  const [activeTab, setActiveTab] = useState(0);
  const pagination = {
    clickable: true,
    injectStyles: [`
    `],
    renderBullet: function (index: number, className: string) {
      return `<span class="${className} transition-all duration-300 index-${index}"></span>`; // Personaliza el renderizado de los bullets
    },
  };

  return (
    <div className="w-11/12 md:container mx-auto flex flex-col items-center mt-0 mb-12">
      {/* Título y Subtítulo */}
      <div className="text-center mb-20 md:w-5/6 w-full px-4">
        <h1 className="text-4xl md:text-5xl font-anek-latin font-bold text-black">{title}</h1>
        <p className="text-2xl text-black font-afacad mt-4">{subtitle}</p>
      </div>

      {/* Tabs de Navegación */}
      <div className="flex flex-row gap-3 justify-center mb-4 md:mb-20 md:w-5/6 w-full mx-auto">
        {tabs.map((tab, index) => (
          <div
            key={index}
            onClick={() => setActiveTab(index)}
            className={`cursor-pointer flex flex-col items-center w-1/2 p-5 md:p-7 rounded-2xl transition-all duration-300 ${
              activeTab === index
                ? 'bg-purple-500 text-white rotate-3'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            <div className={`flex w-full justify-center space-x-2 flex flex-row md:justify-between`}>
              <span className='text-base font-anek-latin font-bold'>{tab.title}</span>
              {activeTab === index && <span className='hidden md:inline-block'>{tab.icon}</span>}
            </div>
            <p className="text-xl md:block hidden font-afacad">{tab.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Contenido de la Tab */}
      <div className="flex flex-col md:flex-row w-full justify-center">
        {/* Mitad Izquierda: Carrusel */}
        <div className="w-full md:w-1/2 relative h-[60vh] md:h-[70vh] max-h-[500px]">
          <Swiper
            direction="vertical"
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={pagination} // Aplicamos la paginación personalizada
            modules={[Pagination]} // Necesitamos el módulo de Paginación
            className="w-full h-full vertical md:rounded-l-lg md:rounded-none rounded-lg"
          >
            {tabs[activeTab].slides.map((slide, index) => (
              <SwiperSlide key={index} className="relative">
                <div className="absolute inset-0 bg-gradient-primary opacity-60"></div>
                <div className="flex flex-col gap-1 h-full justify-center ml-12 p-2 md:p-5 relative text-white z-10">
                  <h2 className="text-3xl md:text-4xl font-bold font-anek-latin">{slide.title}</h2>
                  <p className="text-xl mt-4 mb-8 font-afacad">{slide.description}</p>
                  <div>
                    <Button variant="dark" href="https://sample.gitbook.io/doc" target='_blank' onClick={() => console.log('clicked')}>HOW TO</Button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* just for mobile */}
          <div className="rounded-lg md:hidden absolute w-full md:w-1/2 md:relative h-[100%] top-0 md:h-[70vh] max-h-[500px]">
            <img
              src={tabs[activeTab].image}
              alt="Tab Image"
              className="object-cover w-full h-full rounded-lg  md:rounded-none md:rounded-r-lg"
            />
            <div className="absolute inset-0 bg-purple-500 mix-blend-lighten rounded-lg  md:rounded-none md:rounded-r-lg"></div>
          </div>
        </div>

        {/* Mitad Derecha: Imagen fija con máscara */}
        <div className="md:absolute md:block hidden w-full md:w-1/2 md:relative h-[100%] top-0 md:h-[70vh] max-h-[500px]">
          <img
            src={tabs[activeTab].image}
            alt="Tab Image"
            className="object-cover w-full h-full rounded-b-lg  md:rounded-none md:rounded-r-lg"
          />
          <div className="md:absolute inset-0 bg-purple-500 mix-blend-lighten rounded-b-lg  md:rounded-none md:rounded-r-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default CustomTabs;
