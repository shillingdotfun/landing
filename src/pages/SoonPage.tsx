import allColors from "../assets/images/shilling-logo/all-colors.gif"
import allColorsMobile from "../assets/images/shilling-logo/all-colors-mobile.gif"

const SoonPage = () => {
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
        </div>
    )
}

export default SoonPage