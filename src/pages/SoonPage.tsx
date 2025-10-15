//import black from "../assets/images/shilling-logo/large/black.svg";
import blue from "../assets/images/shilling-logo/large/blue.svg";
import green from "../assets/images/shilling-logo/large/green.svg";
import orange from "../assets/images/shilling-logo/large/orange.svg";
import purple from "../assets/images/shilling-logo/large/purple.svg";
import red from "../assets/images/shilling-logo/large/red.svg";
import white from "../assets/images/shilling-logo/large/white.svg";

const SoonPage = () => {
    return (
        <div className="static w-screen h-screen">
            <a href="https://x.com/shillingdotfun">
                <div className="grid sm:grid-cols-2 grid-cols-1">
                    <img
                        src={white}
                        alt="shilling.fun logo"
                    />
                    <img
                        src={blue}
                        alt="shilling.fun logo"
                    />
                    <img
                        src={green}
                        alt="shilling.fun logo"
                    />
                    <img
                        src={purple}
                        alt="shilling.fun logo"
                    />
                    <img
                        src={red}
                        alt="shilling.fun logo"
                    />
                    <img
                        src={orange}
                        alt="shilling.fun logo"
                    />
                </div>
            </a>
        </div>
    )
}

export default SoonPage