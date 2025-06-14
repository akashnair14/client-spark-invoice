import { Link } from "react-router-dom";

const Index = () => (
  <main className="flex flex-col items-center justify-center min-h-screen py-24 px-4">
    <h1 className="text-5xl font-bold">
      Welcome to <span className="text-blue-600">Invoicer!</span>
    </h1>
    <p className="mt-3 text-2xl">
      Get started by editing <code>src/pages/Index.tsx</code>
    </p>
    <div className="mt-8">
      <Link to="/auth" className="underline text-blue-600 hover:text-blue-800">
        Login / Register
      </Link>
    </div>
    <div className="flex items-center justify-center mt-8">
      <a
        href="https://kitwind.tailwindcomponents.com/components"
        className="bg-white shadow rounded-md p-4 flex items-center hover:bg-gray-100 transition-colors duration-200"
      >
        <img
          src="https://kitwind.tailwindcomponents.com/img/logo.svg"
          className="w-8 h-8 mr-2"
          alt="Tailwind Components"
        />
        <span>Tailwind Components</span>
      </a>
    </div>
  </main>
);

export default Index;
