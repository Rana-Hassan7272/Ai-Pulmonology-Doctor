const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} PulmoAI - Doctor Assistant. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Developed by Muhammad Hassan Shahbaz
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

