import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

interface LoginFormProps {
  email: string;
  password: string;
  showPass: boolean;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setShowPass: (v: boolean | ((prev: boolean) => boolean)) => void;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onResendEmail: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20, y: 10 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24
    }
  }
};

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  showPass,
  setEmail,
  setPassword,
  setShowPass,
  loading,
  error,
  onSubmit,
  onForgotPassword,
  onResendEmail
}) => {
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  
  return (
    <motion.form
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onSubmit={onSubmit}
      autoComplete="on"
      className="space-y-5 w-full"
    >
      <div className="space-y-4">
        {/* Email Input with animated focus */}
        <motion.div
          variants={itemVariants}
          className="relative group"
        >
          <motion.div
            animate={{
              scale: focusedField === "email" ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
              focusedField === "email" ? "text-primary" : "text-muted-foreground/50"
            }`}
          >
            <Mail className="w-full h-full" />
          </motion.div>
          <Input
            placeholder="Email address"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            disabled={loading}
            required
            type="email"
            spellCheck={false}
            className="pl-10 h-12 bg-background/60 border-border/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all rounded-xl placeholder:text-muted-foreground/60 hover:bg-background/80 hover:border-border shadow-sm"
          />
        </motion.div>
        
        {/* Password Input with animated focus */}
        <motion.div
          variants={itemVariants}
          className="relative group"
        >
          <motion.div
            animate={{
              scale: focusedField === "password" ? 1.1 : 1,
            }}
            transition={{ duration: 0.2 }}
            className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
              focusedField === "password" ? "text-primary" : "text-muted-foreground/50"
            }`}
          >
            <Lock className="w-full h-full" />
          </motion.div>
          <Input
            placeholder="Password"
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            disabled={loading}
            required
            minLength={6}
            className="pl-10 pr-11 h-12 bg-background/60 border-border/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all rounded-xl placeholder:text-muted-foreground/60 hover:bg-background/80 hover:border-border shadow-sm"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
            tabIndex={0}
            aria-label={showPass ? "Hide password" : "Show password"}
            onClick={() => setShowPass(v => !v)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={showPass ? "hide" : "show"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </div>

      {/* Animated Error Message */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, height: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              height: "auto",
              transition: {
                type: "spring",
                stiffness: 400,
                damping: 30
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              height: 0,
              transition: { duration: 0.2 }
            }}
            className="text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-lg overflow-hidden"
          >
            <motion.div
              initial={{ x: -5 }}
              animate={{ x: [0, -5, 5, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              {error}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Submit Button */}
      <motion.div variants={itemVariants}>
        <motion.div
          whileHover={{ 
            scale: loading ? 1 : 1.02,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          <Button
            type="submit"
            className="w-full h-12 font-semibold text-base bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 rounded-xl relative overflow-hidden group"
            disabled={loading}
          >
            {loading && (
              <motion.div
                className="absolute inset-0 bg-primary/20"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2 transition-transform group-hover:translate-x-1" />
                  Sign In
                </>
              )}
            </span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Animated Links */}
      <motion.div
        variants={itemVariants}
        className="flex justify-between items-center text-xs pt-1"
      >
        <motion.button
          whileHover={{ 
            scale: 1.05, 
            x: 2,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          whileTap={{ scale: 0.95 }}
          type="button"
          className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
          onClick={onForgotPassword}
        >
          Forgot password?
        </motion.button>
        <motion.button
          whileHover={{ 
            scale: 1.05, 
            x: -2,
            transition: { type: "spring", stiffness: 400, damping: 10 }
          }}
          whileTap={{ scale: 0.95 }}
          type="button"
          className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
          onClick={onResendEmail}
        >
          Resend verification
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

export default LoginForm;
