import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import PageSEO from "@/components/seo/PageSEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log 404 errors for analytics if needed in production
    // console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <PageSEO
        title="404 Not Found | Invoicer"
        description="The page you're looking for doesn't exist."
        canonicalUrl={window.location.origin + location.pathname}
        robots="noindex, nofollow"
      />
      <div className="min-h-screen flex items-center justify-center">
        <main className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-lg text-muted-foreground mb-4">Oops! Page not found</p>
          <Link to="/" className="text-primary underline hover:opacity-90">
            Return to Home
          </Link>
        </main>
      </div>
    </>
  );
};

export default NotFound;
