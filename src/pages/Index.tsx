
import { Link } from "react-router-dom";
import PageSEO from "@/components/seo/PageSEO";

const Index = () => (
  <>
    <PageSEO
      title="SparkInvoice | Cloud Invoicing"
      description="Create, manage and send professional invoices fast."
      canonicalUrl={window.location.origin + "/"}
    />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-accent via-background to-accent/50 relative overflow-hidden px-4">
      {/* Decorative blurs */}
      <div className="absolute z-0 inset-0 pointer-events-none">
        <div className="absolute top-[-80px] left-[-80px] w-[260px] h-[260px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-70px] right-[-70px] w-[200px] h-[200px] bg-primary/10 rounded-full blur-2xl" />
      </div>
      {/* Hero */}
      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-lg bg-card/90 rounded-2xl shadow-xl px-8 py-12 backdrop-blur-md animate-fade-in border border-border">
        <div className="mb-5 flex flex-col items-center">
          <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center mb-3 shadow-lg">
            <span className="text-primary-foreground font-bold text-2xl">S</span>
          </div>
          <h1 className="font-extrabold text-4xl sm:text-5xl text-foreground tracking-tight mb-1">
            Spark<span className="text-primary">Invoice</span>
          </h1>
          <span className="text-base sm:text-lg text-muted-foreground font-medium">
            Professional Cloud Invoices, Faster
          </span>
        </div>
        <p className="text-center text-muted-foreground text-lg sm:text-xl mt-4 mb-6 max-w-md">
          Streamline your invoice workflow. Create, manage & send invoices with ease.
        </p>
        <Link
          to="/auth"
          className="block w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-8 rounded-lg shadow-md transition-colors duration-200 text-center text-lg mb-2"
        >
          Get Started
        </Link>
        <span className="mt-2 text-muted-foreground text-xs italic">No credit card required • Free plan available</span>
      </main>
    </div>
  </>
);

export default Index;
