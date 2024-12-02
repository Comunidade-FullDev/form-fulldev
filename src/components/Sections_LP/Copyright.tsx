import { FaDiscord, FaGithub, FaInstagram, FaLink, FaLinkedinIn, FaTiktok, FaYoutube } from "react-icons/fa";

export function Copyright() {
    return (
        <section className="flex flex-col lg:justify-between lg:flex-row mt-20 mb-10 max-w-[1440px] mx-auto font-inter">
            <div>
            <p className="text-white text-center lg:text-start mb-10">@2024 Copyright. Todos os direitos reservados Full Dev</p>
            </div>
            <div className="flex items-center justify-center lg:justify-start">
            <div className="grid grid-cols-3 lg:grid-cols-7 gap-6 text-white">
                <a className="text-white transition-all duration-700 text-xl lg:text-2xl hover:text-[#B22D00]"  href="https://www.fulldev.com.br/" target="_blank"><FaLink /></a>
                <a className="text-white transition-all duration-700 text-xl lg:text-2xl hover:text-[#B22D00]"  href="https://www.linkedin.com/groups/9899811/" target="_blank"><FaLinkedinIn /></a>
                <a className="text-white transition-all duration-700 text-xl lg:text-2xl hover:text-[#B22D00]"  href="https://discord.com/channels/1290829198415364118/1290829199065747513" target="_blank"><FaDiscord /></a>
                <a className="text-white transition-all duration-700 text-xl lg:text-2xl hover:text-[#B22D00]"  href="https://www.instagram.com/comunidadefulldev/?igsh=MnVjOW03NW4wOHFp" target="_blank"><FaInstagram /></a>
                <a className="text-white transition-all duration-700 text-xl lg:text-2xl hover:text-[#B22D00]"  href="https://github.com/ComunidadeFullDev" target="_blank"><FaGithub /></a>
                <a className="text-white transition-all duration-700 text-xl lg:text-2xl hover:text-[#B22D00]"  href="https://www.youtube.com/@comunidadefulldev" target="_blank"><FaYoutube /></a>
                <a  className="text-white transition-all duration-700 text-xl lg:text-2xl hover:text-[#B22D00]" href="https://www.tiktok.com/@comunidadefulldev?_t=8r5kwpTwm4j&_r=1" target="_blank"><FaTiktok /></a>
            </div>
            </div>
        </section>
    )
}