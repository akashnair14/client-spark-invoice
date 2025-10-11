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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onSubmit={onSubmit}
      autoComplete="on"
      className="space-y-5 w-full"
    >
      <div className="space-y-4">
        {/* Email Input with animated focus */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="relative group"
        >
          <motion.div
            animate={{
              scale: focusedField === "email" ? 1.1 : 1,
              color: focusedField === "email" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.5)"
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
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
            className="pl-10 h-12 bg-background/50 border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all rounded-xl placeholder:text-muted-foreground/60 hover:bg-background/70"
          />
        </motion.div>
        
        {/* Password Input with animated focus */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="relative group"
        >
          <motion.div
            animate={{
              scale: focusedField === "password" ? 1.1 : 1,
              color: focusedField === "password" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.5)"
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
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
            className="pl-10 pr-11 h-12 bg-background/50 border-border focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all rounded-xl placeholder:text-muted-foreground/60 hover:bg-background/70"
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
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 20 }}
            className="text-destructive text-sm p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          <Button
            type="submit"
            className="w-full h-12 font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 rounded-xl relative overflow-hidden group"
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="flex justify-between items-center text-xs pt-1"
      >
        <motion.button
          whileHover={{ scale: 1.05, x: 2 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
          onClick={onForgotPassword}
        >
          Forgot password?
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, x: -2 }}
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
