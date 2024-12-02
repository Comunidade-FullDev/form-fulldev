import Image from "next/image";
import { Button } from "../ui/button";
import { FaChartLine } from "react-icons/fa";

export function Contact() {
    return (
        <section className="mt-60 max-w-[1440px] mx-auto font-inter">
            <div className="bg-gradient-orange p-6 lg:p-16 rounded-lg shadow-2xl neon-border">
                <div className="flex justify-center lg:justify-between flex-col items-center lg:flex-row">
                <div className="flex flex-col">
                    <h1 className="text-white font-bold text-xl lg:text-3xl max-w-[600px] mb-10" data-aos="fade-down">Ainda tem dúvidas que o nosso form builder é o melhor!? Venha agora conhecer a nossa plataforma 🚀 </h1>
                    <a data-aos="fade-down" data-aos-delay="200" href="/register" className="text-[#E14817]">
                    <Button variant="outline">Conheça a plataforma agora!<FaChartLine /></Button>
                </a>
                </div>
                <Image src="/LogoContact.svg" width={300} height={300} alt="" className="hidden lg:flex" />
                </div>
            </div>  
            <div className="flex justify-center items-center absolute inset-0 top-[140rem] -z-10">
                <Image src="/LogoBg.png" width={700} height={600} alt="" />
            </div>
        </section>
    )
}