import allColors from "../assets/images/shilling-logo/all-colors.gif"
import allColorsMobile from "../assets/images/shilling-logo/all-colors-mobile.gif"
import { useNavigate } from "react-router-dom"
import Button from "../components/Common/Button";

const SoonPage = () => {
    const navigate = useNavigate();
    return (
        <div className="fixed inset-0 w-screen h-screen overflow-hidden">
            <a href="https://x.com/shillingdotfun" className="block w-full h-full">
                <img
                    src={allColorsMobile}
                    alt="shilling.fun logo"
                    className="block md:hidden w-full h-full object-cover"
                />
                <img
                    src={allColors}
                    alt="shilling.fun logo"
                    className="hidden md:block w-full h-full object-cover"
                />
            </a>
            <Button 
                label="← BACK" 
                onClick={() => navigate(-1)}
                className="!absolute left-5 top-[5vh]"
            />
            <h1 className="absolute bottom-[20vh] text-5xl font-bold font-anek-latin text-center text-white w-full">{`work in progress ;)`}</h1>
        </div>
    )
}

export default SoonPage