const Footer = () => {
    return (
      <footer className='bg-zinc-900 text-white py-6 text-center'>
        <p className='text-sm md:text-base'>
          © {new Date().getFullYear()} Gripendor Bot. All rights reserved.
        </p>
        <p className='text-xs md:text-sm'>
          Built with ❤️ by Yours Truly.
        </p>
      </footer>
    );
  };

export default Footer;