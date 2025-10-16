import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, UserPlus, Mail, Lock, Loader2, Check } from "lucide-react";

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

const RegisterForm: React.FC<RegisterFormProps> = ({
  email,
  password,
  confirm,
  showPass,
  showConfirm,
  setEmail,
  setPassword,
  setConfirm,
  setShowPass,
  setShowConfirm,
  loading,
  error,
  onSubmit
}) => {
  const [focusedField, setFocusedField] = React.useState<string | null>(null);
  const passwordsMatch = password && confirm && password === confirm;
  const passwordStrength = password.length >= 8 ? "strong" : password.length >= 6 ? "medium" : "weak";
  
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
        {/* Email Input */}
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
            className="pl-10 h-12 bg-background/60 border-border/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary transition-all rounded-xl placeholder:text-muted-foreground/60 hover:bg-background/80 hover:border-border shadow-sm"
          />
        </motion.div>

        {/* Password Input with Strength Indicator */}
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
            placeholder="Password (min. 6 characters)"
            type={showPass ? "text" : "password"}
            autoComplete="new-password"
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
          
          {/* Password Strength Bar */}
          <AnimatePresence>
            {password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 space-y-1"
              >
                <div className="flex gap-1">
                  {[1, 2, 3].map((level) => (
                    <motion.div
                      key={level}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: level * 0.1 }}
                      className="h-1 flex-1 rounded-full bg-muted overflow-hidden"
                    >
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{
                          width: passwordStrength === "strong" || (passwordStrength === "medium" && level <= 2) || (passwordStrength === "weak" && level === 1) ? "100%" : "0%"
                        }}
                        transition={{ duration: 0.3 }}
                        className={`h-full ${
                          passwordStrength === "strong" ? "bg-green-500" :
                          passwordStrength === "medium" ? "bg-yellow-500" :
                          "bg-red-500"
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-muted-foreground"
                >
                  Password strength: <span className={
                    passwordStrength === "strong" ? "text-green-500" :
                    passwordStrength === "medium" ? "text-yellow-500" :
                    "text-red-500"
                  }>{passwordStrength}</span>
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Confirm Password Input */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="relative group"
        >
          <motion.div
            animate={{
              scale: focusedField === "confirm" ? 1.1 : 1,
              color: focusedField === "confirm" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground) / 0.5)"
            }}
            transition={{ duration: 0.2 }}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4"
          >
            <Lock className="w-full h-full" />
          </motion.div>
          <Input
            placeholder="Confirm password"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            onFocus={() => setFocusedField("confirm")}
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
            aria-label={showConfirm ? "Hide password" : "Show password"}
            onClick={() => setShowConfirm(v => !v)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={showConfirm ? "hide" : "show"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
          
          {/* Password Match Indicator */}
          <AnimatePresence>
            {confirm && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute -right-8 top-1/2 -translate-y-1/2"
              >
                {passwordsMatch ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  >
                    <Check className="w-5 h-5 text-green-500" />
                  </motion.div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
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
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: loading ? 1 : 1.02 }}
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
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2 transition-transform group-hover:-translate-y-0.5" />
                  Create Account
                </>
              )}
            </span>
          </Button>
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="text-xs text-muted-foreground text-center pt-1"
      >
        By signing up, you agree to our Terms and Privacy Policy
      </motion.p>
    </motion.form>
  );
};

export default RegisterForm;
