import glitchTop from '../../assets/images/glitch-top.svg';
import sampleLogo from '../../assets/images/sample-logo-black.svg'
import { Button } from '../Common/Button';

export default function OpenSource() {
    return (
        <section className="p-2 bg-white bg-cover" style={{ backgroundImage: `url(${glitchTop})` }}>
            <div className="container mx-auto mb-14">
                <div className="flex flex-col md:flex-row w-full gap-3">
                    <div className="flex flex-col gap-3 md:w-[60%] min-h-[200px] flex-grow">
                        <div className="p-10 bg-gray-200 border rounded-lg flex flex-col md:flex-row items-left md:gap-0 gap-4 justify-between">
                            <div className='flex flex-row md:gap-4 gap-0 items-center'>
                                <div><img className='md:block hidden h-8 saturate-100' src={sampleLogo} /> </div>
                                <p className='font-afacad text-lg'>Create, customize and earn rewards without writing any code</p>
                            </div>
                            <div>
                                <Button variant='dark' href='#' /*href='https://github.com/sampleSOL'*/ target="_blank" onClick={() => console.log('click')}>Launch</Button>
                            </div>
                        </div>
                        <div className="p-10 bg-gray-200 border rounded-lg h-full flex flex-col justify-center">
                            <h3 className='md:text-4xl text-xl md:font-light font-anek-latin font-bold'>Join the future of digital agents.</h3>
                            <p className='text-lg my-4 font-afacad'>
                            Connect, collaborate, and innovate with creators worldwide. Stay updated, participate in events, and shape the future of sample together.
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col md:w-[40%] min-h-[200px] flex-grow">
                        <div className="p-10 bg-gray-200 border rounded-lg relative h-full flex flex-col justify-center">
                            <h3 className='md:text-4xl text-xl md:font-light font-bold font-anek-latin'>Discover how to create an SAMPLE</h3>
                            <div>
                                <p className='text-lg my-4 font-afacad'>
                                Dive deeper into the mechanisms, rewards, and potential of the sample ecosystem. Visit our GitBook for detailed documentation and tutorials.
                                </p>
                                <Button variant='dark' href='https://sample.gitbook.io/doc' onClick={() => console.log('click')}>Read Gitbook</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}