import { FaGlobe, FaStar } from "react-icons/fa";
import { Button } from "../ui/button";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";


export function Hero() {
    return (
        <section className="overflow-hidden">
            <div className="flex justify-center flex-col items-center mt-40 font-inter">
                <h1 className="text-center font-semibold text-2xl lg:text-4xl text-white" data-aos="flip-up">

                    Crie, personalize e compartilhe formulários online com facilidade.
                    <div className="flex gap-2 justify-center items-center mb-2 animate-bounce">
                        <FaStar className="text-yellow-500" size={25} />
                        <FaStar className="text-yellow-500" size={25} />
                        <FaStar className="text-yellow-500" size={25} />
                        <FaStar className="text-yellow-500" size={25} />
                        <FaStar className="text-yellow-500" size={25} />
                    </div>
                    Crie formulários profissionais em minutos! 🚀 <br /> Simples, rápido e eficiente. Experimente agora!
                </h1>
                <p className="text-gray-400 text-sm lg:text-base text-center max-w-[900px] mt-6" data-aos="zoom-in">
                    Arraste, solte e aproveite integrações com suas plataformas favoritas, tudo em um design 100% responsivo.                </p>
                Com nossa ferramenta de construção de formulários, você pode criar, personalizar e compartilhar formulários online com facilidade. Aproveite recursos avançados como drag-and-drop, integração com plataformas populares e designs responsivos, tudo em uma interface intuitiva.
                <div className="mt-6">
                    <a href="/login"><Button className="p-6 hover:bg-opacity-80">Comece agora mesmo<ArrowUpRight /></Button></a>
                </div>
                <div className="mt-10">
                    <Image src="/imagehero.svg" width={800}
                        quality={100}

                        height={400} priority alt="" className="animate-float" />
                </div>
            </div>
            <div className="mt-40 mb-16 flex justify-center items-center" data-aos="zoom-out">
                <Image src="/ProgressBarImage.png" width={800} height={200} alt="" />
            </div>
        </section>
    )
}