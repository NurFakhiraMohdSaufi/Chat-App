export default function LandingPage() {
    return (
        <div className='bg-amber-50 w-full h-screen flex items-center justify-center relative overflow-hidden'>
            <div
                className='absolute inset-0 bg-cover bg-center bg-opacity-30'
                style={{backgroundImage: "url('/path-to-your-image.jpg')"}}
            ></div>

            <div className='z-10 text-center text-black'>
                <div className='text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 animate__animated animate__fadeIn animate__delay-1s'>
                    Welcome to Chat App
                </div>
                <p className='text-xl sm:text-2xl mb-6 opacity-80 animate__animated animate__fadeIn animate__delay-2s'>
                    Start a conversation now!
                </p>

                {/* <button className='px-6 py-3 bg-black text-amber-100 text-lg font-semibold rounded-lg shadow-lg hover:bg-amber-500 transition-colors duration-300'>
                    Get Started
                </button> */}
            </div>
        </div>
    );
}
