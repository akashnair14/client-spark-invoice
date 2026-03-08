import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, UserPlus, Mail, Lock, Loader2, Check, X } from "lucide-react";

interface RegisterFormProps {
  email: string;
  password: string;
  confirm: string;
  showPass: boolean;
  showConfirm: boolean;
  setEmail: (v: string) => void;
  setPassword: (v: string) => void;
  setConfirm: (v: string) => void;
  setShowPass: (v: boolean | ((prev: boolean) => boolean)) => void;
  setShowConfirm: (v: boolean | ((prev: boolean) => boolean)) => void;
  loading: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
}

const formVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], staggerChildren: 0.08 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.25 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const RegisterForm: React.FC<RegisterFormProps> = ({
  email, password, confirm, showPass, showConfirm,
  setEmail, setPassword, setConfirm, setShowPass, setShowConfirm,
  loading, error, onSubmit,
}) => {
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const passwordsMatch = password && confirm && password === confirm;

  const hasMinLength = password.length >= 6;
  const hasMaxLength = password.length <= 10;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const passedRules = [hasMinLength, hasMaxLength, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthLabel = passedRules >= 5 ? "Strong" : passedRules >= 3 ? "Medium" : "Weak";
  const strengthColor = passedRules >= 5 ? "#22c55e" : passedRules >= 3 ? "#FFB347" : "#ef4444";

  const inputCls = "pl-10 pr-11 h-12 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/25 rounded-xl focus-visible:ring-1 focus-visible:ring-[#FF8A00]/50 focus-visible:border-[#FF8A00]/40 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12]";
  const glowStyle = (field: string) => focusedField === field ? { boxShadow: "0 0 20px rgba(255,138,0,0.08)" } : {};

  return (
    <motion.form
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onSubmit={onSubmit}
      autoComplete="on"
      className="space-y-4 w-full"
    >
      {/* Email */}
      <motion.div variants={itemVariants} className="space-y-1.5">
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
            className={inputCls}
            style={glowStyle("email")}
          />
        </div>
      </motion.div>

      {/* Password */}
      <motion.div variants={itemVariants} className="space-y-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-white/50">Password</label>
        <div className="relative">
          <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === "password" ? "text-[#FF8A00]" : "text-white/30"}`} />
          <Input
            placeholder="6–10 characters"
            type={showPass ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(e) => { if (e.target.value.length <= 10) setPassword(e.target.value); }}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            disabled={loading}
            required
            minLength={6}
            maxLength={10}
            className={inputCls}
            style={glowStyle("password")}
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-1" onClick={() => setShowPass((v) => !v)}>
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Strength */}
        <AnimatePresence>
          {password && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1.5 overflow-hidden pt-1"
            >
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((level) => (
                  <div key={level} className="h-1 flex-1 rounded-full bg-white/[0.06] overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: passedRules >= level ? "100%" : "0%" }}
                      transition={{ duration: 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: strengthColor }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-semibold" style={{ color: strengthColor }}>{strengthLabel}</span>
                <span className="text-[11px] text-white/30">{password.length}/10</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                {[
                  { label: "6–10 chars", met: hasMinLength && hasMaxLength },
                  { label: "Uppercase", met: hasUppercase },
                  { label: "Number", met: hasNumber },
                  { label: "Special char", met: hasSpecial },
                ].map((rule) => (
                  <div key={rule.label} className="flex items-center gap-1.5">
                    {rule.met ? <Check className="w-3 h-3 text-green-400" /> : <X className="w-3 h-3 text-white/20" />}
                    <span className={`text-[11px] ${rule.met ? "text-green-400" : "text-white/30"}`}>{rule.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Confirm Password */}
      <motion.div variants={itemVariants} className="space-y-1.5">
        <label className="text-xs font-medium uppercase tracking-wider text-white/50">Confirm Password</label>
        <div className="relative">
          <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${focusedField === "confirm" ? "text-[#FF8A00]" : "text-white/30"}`} />
          <Input
            placeholder="••••••••"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onFocus={() => setFocusedField("confirm")}
            onBlur={() => setFocusedField(null)}
            disabled={loading}
            required
            minLength={6}
            className={inputCls}
            style={glowStyle("confirm")}
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-1" onClick={() => setShowConfirm((v) => !v)}>
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <AnimatePresence>
          {confirm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-1.5 pt-0.5">
              {passwordsMatch ? (
                <><Check className="w-3 h-3 text-green-400" /><span className="text-[11px] text-green-400">Passwords match</span></>
              ) : (
                <><X className="w-3 h-3 text-red-400" /><span className="text-[11px] text-red-400">Passwords do not match</span></>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: "auto", scale: 1, x: [0, -5, 5, -5, 5, 0] }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/20 rounded-xl overflow-hidden"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      <motion.div variants={itemVariants}>
        <motion.div whileHover={{ scale: loading ? 1 : 1.015, y: loading ? 0 : -1 }} whileTap={{ scale: loading ? 1 : 0.97 }}>
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 font-semibold text-base rounded-xl text-white relative overflow-hidden border-0"
            style={{
              background: "linear-gradient(135deg, #FF8A00 0%, #FFB347 100%)",
              boxShadow: "0 8px 28px rgba(255,138,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
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
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</>
              ) : (
                <><UserPlus className="w-5 h-5" /> Create Account</>
              )}
            </span>
          </Button>
        </motion.div>
      </motion.div>

      <motion.p variants={itemVariants} className="text-[11px] text-white/25 text-center">
        By signing up, you agree to our Terms and Privacy Policy
      </motion.p>
    </motion.form>
  );
};

export default RegisterForm;
