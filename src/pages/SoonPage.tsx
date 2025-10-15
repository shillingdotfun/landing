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
                <div className="grid grid-cols-2 grid-rows-2">
                    <img
                        src={white}
                        alt="Tab Image"
                        className=""
                    />
                    <img
                        src={blue}
                        alt="Tab Image"
                        className=""
                    />
                    <img
                        src={green}
                        alt="Tab Image"
                        className=""
                    />
                    <img
                        src={orange}
                        alt="Tab Image"
                        className=""
                    />
                    <img
                        src={purple}
                        alt="Tab Image"
                        className=""
                    />
                    <img
                        src={red}
                        alt="Tab Image"
                        className=""
                    />
                </div>
            </a>
        </div>
    )
}

export default SoonPage