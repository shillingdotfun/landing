import { useNavigate } from "react-router-dom";
import cludLogos from "../../assets/images/shilling-logo/cloud-logos.svg"
import Button from '../../components/Common/Button';
import { useAuth } from "../../hooks/useAuth";
import PrivyLogin from "../Auth/PrivyLogin";

const Jumbotron: React.FC = () => {
  const navigate = useNavigate();
  const {isAuthenticated} = useAuth();
  return (
    <section className='w-full bg-gradient-to-b to-blue-900 from-purple-500'>
      <div className='max-w-[1600px] mx-auto p-10 grid grid-cols-2 items-center '>
        <div className='flex flex-col gap-2 my-28'>
          <h2 className='text-2xl'>
            Welcome the Attention Capital Markets:
          </h2>
          <h1 className='font-afacad text-5xl font-bold'>
            Work for your bags. Earn from your shill.
          </h1>
          <div className='flex flex-row gap-4 mt-8'>
            {isAuthenticated ? (
              <Button label="Create shilling campaign" onClick={() => navigate('/campaigns/create')} />
            ) : (
              <PrivyLogin label="Create shilling campaign" />
            )}

            {isAuthenticated ? (
              <Button disabled={true} label="Earn money shilling" onClick={() =>alert('TODO')}></Button>
            ) : (
              <PrivyLogin label="Earn money shilling" />
            )}
          </div>
        </div>
        <div className='flex justify-center'>
          <img src={cludLogos} className='h-[280px]'/>
        </div>
      </div>
    </section>
  )
}

export default Jumbotron;