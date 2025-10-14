import TopNav from '../components/Common/TopNav';
import Jumbotron, { JumbotronProps } from '../components/MainBlocks/Jumbotron';
import TopGlitchSeparator from '../components/Separators/TopGlitchSeparator';
import PeopleSlider, { CarouselItem } from '../components/Common/PeopleSlider';
import BottomGlitchSeparator from '../components/Separators/BottomGlitchSeparator';

import sample1 from "../assets/images/sample/people-1.png";
import sample2 from "../assets/images/sample/people-3.png";
import sample3 from "../assets/images/sample/people-2.png";
import sample4 from "../assets/images/sample/people-4.png";
import sample5 from "../assets/images/sample/people-5.png";
import sample6 from "../assets/images/sample/social-media-dashboard.png";
import CustomTabs from '../components/Common/CustomTabs';
import { ArrowUp } from 'lucide-react';
import CustomCarousel, { CustomCarouselProps } from '../components/Common/CustomCarousel';
import ClaimBlock from '../components/MainBlocks/ClaimBlock';
import OpenSource from '../components/Common/OpenSource';
import Footer from '../components/MainBlocks/Footer';
import Marquee from '../components/Separators/Marquee';

const SamplePage = () => {
  const jumbotronData: JumbotronProps = {
    title: <>With sample, you’re not just creating avatars—you’re launching <b>SAMPLEs</b> that shape conversations, build communities, and redefine digital presence in the Solana-powered universe.</>,
    ctas: [
      {
        text: "Create",
        link: "#",
        variant: "dark",
      },
      {
        text: "How to",
        link: "https://sample.gitbook.io/doc",
        variant: "light",
      }
    ],
  };
  const agentsCarouselTitle = 'Elevate your influence with SAMPLEs';
  const agentsCarouselSubtitle = <>Our platform empowers you to design and deploy <b>SAMPLEs</b> tailored to your brand’s unique needs in a few seconds.</>;
  const agentsCarouselData: CarouselItem[] = [
    {
      image: sample1,
      title: "Sarah Johnson",
      subtitle: "Lifestyle & Travel",
      socialLinks: {
        /*
        instagram: "#",
        twitter: "#",
        facebook: "#"
        */
      }
    },
    {
      image: sample2,
      title: "Eva Croft",
      subtitle: "Fitness & Health",
      socialLinks: {
        /*
        instagram: "#",
        twitter: "#"
        */
      }
    },
    {
      image: sample3,
      title: "Emma Davis",
      subtitle: "Fashion & Beauty",
      socialLinks: {
        /*
        instagram: "#",
        facebook: "#"
        */
      }
    },
    {
      image: sample4,
      title: "Daisy Williams",
      subtitle: "e-Learning",
      socialLinks: {
        /*
        instagram: "#",
        facebook: "#"
        */
      }
    },
    // Añade más items según necesites
  ];
  const tabs = [
    {
      title: 'Fun',
      subtitle: "Fun, vibrant, and expressive. Perfect for engaging Web3 audiences and creating a playful brand identity.",
      icon: <ArrowUp size={20} />, 
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
      image: sample5,
      slides: [
        {
          title: 'Unique Branding',
          description: 'Every SAMPLE carries a distinctive visual identity. We use advanced modeling techniques to ensure that every avatar clearly represents the sample brand, recognizable across the digital space.'
        },
        {
          title: 'LDM powered',
          description: 'Using advanced modeling techniques, we ensure each avatar not only embodies your brand’s identity but also clearly reflects the signature sample style, creating instant trust and recognition in any digital environment.'
        }
      ]
    },
    {
      title: 'Realistic',
      subtitle: "Detailed, lifelike, and immersive. Perfect for building credibility, trust, and delivering a sophisticated sense of realism.",
      icon: <ArrowUp size={20} />, 
      content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
      image: sample2,
      slides: [
        {
          title: 'Realistic Switch',
          description: 'Every SAMPLE is meticulously crafted to achieve stunning realism and authenticity.'
        },
        {
          title: 'LDM powered',
          description: 'Using advanced modeling techniques, we ensure each avatar not only embodies your brand’s identity but also clearly reflects the signature sample style, creating instant trust and recognition in any digital environment.'
        },
      ]
    },
  ];
  const videoWithCarousel: CustomCarouselProps = {
    data: {
      image: sample6,
      slides: [
        {
          title: "Your Creativity Pays Off",
          description: "Agents that captivate audiences and boost engagement across social media earn daily rewards.",
          ctas: [
            {
              text: "Launch app",
              link: "#",
              variant: "dark",
            },
          ],
        },
        {
          title: 'Earn from Engagement',
          description: 'Top-performing agents receive rewards sourced from liquidity pool fees and daily token unlocks.',
          ctas: [
            {
              text: "Create",
              link: "#",
              variant: "dark",
            },
            {
              text: "How to",
              link: "https://sample.gitbook.io/doc",
              variant: "light",
            }
          ],
        },
        {
          title: 'Rewarding Your Impact',
          description: 'Turn your digital influence into tangible gains, innovate, engage, and get rewarded daily!',
          ctas: [
            {
              text: "Launch App",
              link: "#",
              variant: "dark",
            },
          ],
        }
      ]
    }
  };

  const marqueeText = "TOKEN ($TOKEN): Ada9RsTetajP4Uxjhp1gW2c9cJqokNMbQoBUdzFcpump";
  const copyableText = "Ada9RsTetajP4Uxjhp1gW2c9cJqokNMbQoBUdzFcpump";

  return (
    <>
      <Marquee 
        text={marqueeText} 
        copyableText={copyableText}
        backgroundColor="bg-white" 
        textColor="text-black"
        className="hover:bg-gray-200"
        spacing={200}
        speed={0.7}
      />
      <TopNav></TopNav>
      
      <Jumbotron title={jumbotronData.title} ctas={jumbotronData.ctas}></Jumbotron>

      <TopGlitchSeparator/>

      <PeopleSlider title={agentsCarouselTitle} subtitle={agentsCarouselSubtitle} items={agentsCarouselData} />

      <BottomGlitchSeparator/>

      <CustomTabs
        title="Choose Your Style: Fun or Realistic"
        subtitle={<>Transform your digital presence with <b>SAMPLEs</b> that align with your brand identity. Customize your <b>SAMPLE’s</b> appearance to match your audience, choosing between two distinct visual styles.</>}
        tabs={tabs}
      />

      <ClaimBlock></ClaimBlock>

      <CustomCarousel data={videoWithCarousel.data}/>

      <OpenSource></OpenSource>

      <Footer></Footer>
    </>
  );
}

export default SamplePage;