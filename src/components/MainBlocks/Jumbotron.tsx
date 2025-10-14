import { ReactNode } from "react";
import { Button } from "../Common/Button";

export interface Cta {
    text: string,
    link: string,
    variant: 'dark' | 'light';
}

export interface JumbotronProps {
    title: string|ReactNode;
    ctas: Cta[];
}

const Jumbotron: React.FC<JumbotronProps> = ({ title, ctas }) => {
    return (
        <section className="bg-white">
            <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
                <h1 className="mb-4 text-5xl font-anek-latin font-bold tracking-tight leading-none  max-w-sm mx-auto">Your <span className="inline-block bg-gradient-primary text-transparent bg-clip-text">AI Influencer</span> toolkit on <span className="inline-block bg-gradient-primary text-transparent bg-clip-text">Sol</span><span className="inline-block bg-gradient-secondary text-transparent bg-clip-text">ana</span></h1>
                <p className="mb-8 text-2xl font-afacad max-w-3xl mx-auto">{title}</p>
                <div className="flex flex-row gap-4 py-5 sm:flex-row justify-center">
                    {ctas.map((cta: Cta, index: number) => (
                        <Button key={index} variant={cta.variant} href={cta.link}>{cta.text}</Button> 
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Jumbotron;