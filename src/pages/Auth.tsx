
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import GradientBackground from "@/components/auth/GradientBackground";
import PageSEO from "@/components/seo/PageSEO";
import AuthForm from "@/components/auth/AuthForm";
import { motion } from "framer-motion";

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-background"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-4 border-primary border-t-transparent"
        />
      </motion.div>
    );
  }

  return (
    <>
      <PageSEO
        title="SparkInvoice | Login & Sign Up"
        description="Access your SparkInvoice account to create and manage professional invoices with ease."
        canonicalUrl={window.location.origin + "/"}
      />
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-screen w-screen fixed inset-0 overflow-hidden"
      >
        <GradientBackground />
        <div className="h-full w-full overflow-y-auto overflow-x-hidden relative z-10">
          <AuthForm />
        </div>
      </motion.div>
    </>
  );
};

export default Auth;
