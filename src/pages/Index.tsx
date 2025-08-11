
import { Link } from "react-router-dom";
import PageSEO from "@/components/seo/PageSEO";

const Index = () => (
  <>
    <PageSEO
      title="Invoicer | Cloud Invoicing"
      description="Create, manage and send professional invoices fast."
      canonicalUrl={window.location.origin + "/"}
    />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-100 to-blue-200 relative overflow-hidden px-2">
    {/* Decorative background blur */}
    <div className="absolute z-0 inset-0 pointer-events-none">
      <div className="absolute top-[-80px] left-[-80px] w-[260px] h-[260px] bg-blue-300 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-[-70px] right-[-70px] w-[200px] h-[200px] bg-cyan-200 rounded-full blur-2xl opacity-40" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[140px] h-[140px] bg-blue-100 rounded-full blur-xl opacity-20" />
    </div>
    {/* Hero Card */}
    <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg bg-white/80 rounded-2xl shadow-xl px-8 py-12 backdrop-blur-md animate-fade-in">
      {/* Logo & Name */}
      <div className="mb-5 flex flex-col items-center">
        <img
          src="https://kitwind.tailwindcomponents.com/img/logo.svg"
          alt="Invoicer logo"
          className="w-16 h-16 mb-3 drop-shadow"
          loading="lazy"
        />
        <h1 className="font-extrabold text-4xl sm:text-5xl text-blue-700 tracking-tight mb-1">
          Invoicer
        </h1>
        <span className="text-base sm:text-lg text-blue-800/80 font-medium">
          Professional Cloud Invoices, Faster
        </span>
      </div>
      {/* Tagline */}
      <p className="text-center text-gray-600 text-lg sm:text-xl mt-4 mb-6 max-w-md">
        Streamline your invoice workflow. Create, manage & send invoices with ease—designed for modern businesses.
      </p>
      {/* CTA Button */}
      <Link
        to="/auth"
        className="block w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-200 text-center text-lg mb-2"
      >
        Get Started
      </Link>
      <span className="mt-2 text-gray-400 text-xs italic">No credit card required • Free plan available</span>
      {/* Resources */}
      <div className="flex items-center justify-center mt-8">
        <a
          href="https://kitwind.tailwindcomponents.com/components"
          className="bg-white/50 border border-blue-100 rounded p-3 flex items-center gap-2 hover:bg-gray-100 transition-colors duration-200 text-blue-800 shadow"
        >
          <img
            src="https://kitwind.tailwindcomponents.com/img/logo.svg"
            className="w-7 h-7"
            alt="Tailwind Components"
            loading="lazy"
          />
          <span className="font-medium text-base">Tailwind Components</span>
        </a>
      </div>
    </main>
  </div>
  </>
);

export default Index;
