export function CarouselSlides() {
    return (
      <div className="relative p-8 mt-60">
       
        <div className="absolute bg-orange-800/80 inset-0 flex justify-center items-center -rotate-12 z-10">
          <div className="flex w-full h-full overflow-hidden">
            <div className="animate-slideCarousel flex gap-32 whitespace-nowrap w-full">
              <div className="flex justify-between gap-32 font-inter">
                <p className="text-white font-semibold text-xl">Rapidez</p>
                <p className="text-white font-semibold text-xl">Segurança</p>
                <p className="text-white font-semibold text-xl">Produtividade</p>
                <p className="text-white font-semibold text-xl">Confiabilidade</p>
                <p className="text-white font-semibold text-xl">Eficácia</p>
                <p className="text-white font-semibold text-xl">Inovação</p>
                <p className="text-white font-semibold text-xl">Eficiência</p>
                <p className="text-white font-semibold text-xl">Agilidade</p>
                <p className="text-white font-semibold text-xl">Praticidade</p>
                <p className="text-white font-semibold text-xl">Rapidez</p>
                <p className="text-white font-semibold text-xl">Segurança</p>
                <p className="text-white font-semibold text-xl">Produtividade</p>
                <p className="text-white font-semibold text-xl">Confiabilidade</p>
                <p className="text-white font-semibold text-xl">Eficácia</p>
                <p className="text-white font-semibold text-xl">Inovação</p>
                <p className="text-white font-semibold text-xl">Eficiência</p>
                <p className="text-white font-semibold text-xl">Agilidade</p>
                <p className="text-white font-semibold text-xl">Praticidade</p>
              </div>
            </div>
          </div>
        </div>
  
        {/* Segundo carrossel com rotação negativa */}
        <div className="absolute bg-[#B22D00] inset-0 flex justify-center items-center rotate-12 z-0 opacity-70">
          <div className="flex w-full h-full overflow-hidden">
            <div className="animate-slideCarousel flex gap-32 whitespace-nowrap w-full">
              <div className="flex justify-between gap-32 font-inter">
                <p className="text-white font-semibold text-xl">Rapidez</p>
                <p className="text-white font-semibold text-xl">Segurança</p>
                <p className="text-white font-semibold text-xl">Produtividade</p>
                <p className="text-white font-semibold text-xl">Confiabilidade</p>
                <p className="text-white font-semibold text-xl">Eficácia</p>
                <p className="text-white font-semibold text-xl">Inovação</p>
                <p className="text-white font-semibold text-xl">Eficiência</p>
                <p className="text-white font-semibold text-xl">Agilidade</p>
                <p className="text-white font-semibold text-xl">Praticidade</p>
                <p className="text-white font-semibold text-xl">Rapidez</p>
                <p className="text-white font-semibold text-xl">Segurança</p>
                <p className="text-white font-semibold text-xl">Produtividade</p>
                <p className="text-white font-semibold text-xl">Confiabilidade</p>
                <p className="text-white font-semibold text-xl">Eficácia</p>
                <p className="text-white font-semibold text-xl">Inovação</p>
                <p className="text-white font-semibold text-xl">Eficiência</p>
                <p className="text-white font-semibold text-xl">Agilidade</p>
                <p className="text-white font-semibold text-xl">Praticidade</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  