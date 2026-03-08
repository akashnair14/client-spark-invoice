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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.6 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  }),
};

const LoginForm: React.FC<LoginFormProps> = ({
  email, password, showPass, setEmail, setPassword, setShowPass,
  loading, error, onSubmit, onForgotPassword, onResendEmail,
}) => {
  const [focusedField, setFocusedField] = React.useState<string | null>(null);

  return (
    <motion.form
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: -15, transition: { duration: 0.25 } }}
      onSubmit={onSubmit}
      autoComplete="on"
      className="space-y-5 w-full"
    >
      {/* Email */}
      <motion.div variants={itemVariants} custom={0} className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-wider text-white/50">Email</label>
        <div className="relative">
          <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === "email" ? "text-[#FF8A00]" : "text-white/30"}`} />
          <Input
            placeholder="you@company.com"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            disabled={loading}
            required
            type="email"
            spellCheck={false}
            className="pl-10 h-[52px] bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 rounded-xl focus-visible:ring-1 focus-visible:ring-[#FF8A00]/50 focus-visible:border-[#FF8A00]/40 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12]"
            style={focusedField === "email" ? { boxShadow: "0 0 20px rgba(255,138,0,0.08)" } : {}}
          />
        </div>
      </motion.div>

      {/* Password */}
      <motion.div variants={itemVariants} custom={1} className="space-y-2">
        <label className="text-xs font-medium uppercase tracking-wider text-white/50">Password</label>
        <div className="relative">
          <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === "password" ? "text-[#FF8A00]" : "text-white/30"}`} />
          <Input
            placeholder="••••••••"
            type={showPass ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            disabled={loading}
            required
            minLength={6}
            className="pl-10 pr-11 h-[52px] bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 rounded-xl focus-visible:ring-1 focus-visible:ring-[#FF8A00]/50 focus-visible:border-[#FF8A00]/40 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12]"
            style={focusedField === "password" ? { boxShadow: "0 0 20px rgba(255,138,0,0.08)" } : {}}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-1"
            onClick={() => setShowPass((v) => !v)}
            tabIndex={0}
            aria-label={showPass ? "Hide password" : "Show password"}
          >
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1, x: [0, -6, 6, -6, 6, 0] }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-xl overflow-hidden"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Forgot password */}
      <motion.div variants={itemVariants} custom={2} className="flex justify-between items-center">
        <button type="button" className="text-xs text-white/40 hover:text-[#FF8A00] transition-colors" onClick={onForgotPassword}>
          Forgot password?
        </button>
        <button type="button" className="text-xs text-white/40 hover:text-[#FF8A00] transition-colors" onClick={onResendEmail}>
          Resend verification
        </button>
      </motion.div>

      {/* Submit */}
      <motion.div variants={itemVariants} custom={3}>
        <motion.div whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }} whileTap={{ scale: loading ? 1 : 0.97 }}>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] font-semibold text-base rounded-xl text-white relative overflow-hidden border-0"
            style={{
              background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
              boxShadow: "0 8px 32px rgba(255,138,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {loading && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
              ) : (
                <><LogIn className="w-5 h-5" /> Sign In</>
              )}
            </span>
          </Button>
        </motion.div>
      </motion.div>
    </motion.form>
  );
};

export default LoginForm;
