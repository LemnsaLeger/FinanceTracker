// src/hooks/usePasskey.js
// ─────────────────────────────────────────────────────────────────────────────
// WebAuthn (Passkey) hook — wraps Supabase's passkey/MFA API.
//
// What this does:
//   registerPasskey()   → after first email login, offer to save a passkey.
//                         The browser prompts Face ID / fingerprint / PIN.
//   loginWithPasskey()  → on return visits, authenticate with biometrics only.
//   isSupported         → false on older browsers or desktop without biometrics.
//
// How it works end-to-end:
//   1. User logs in with email + password (first time).
//   2. We call registerPasskey() → browser shows native biometric prompt.
//   3. The passkey (public key) is saved in Supabase under the user's account.
//   4. Next visit: loginWithPasskey() → browser verifies biometrics locally,
//      sends cryptographic proof to Supabase → session is granted.
//   5. Private key NEVER leaves the device. Supabase only stores the public key.
//
// Browser support (as of 2025):
//   ✅ Chrome 108+, Safari 16+, Firefox 122+
//   ✅ iOS (Face ID / Touch ID), Android (fingerprint / face)
//   ❌ Some older Android WebViews
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";

// Check if the browser supports WebAuthn passkeys
const checkSupport = () => {
  return (
    typeof window !== "undefined" &&
    window.PublicKeyCredential !== undefined &&
    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function"
  );
};

// LocalStorage key to remember if this device has a passkey registered
const PASSKEY_REGISTERED_KEY = "ft_passkey_registered";

export function usePasskey() {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // Check platform authenticator availability (async)
  const isSupported = useCallback(async () => {
    if (!checkSupport()) return false;
    try {
      return await window.PublicKeyCredential
        .isUserVerifyingPlatformAuthenticatorAvailable();
    } catch {
      return false;
    }
  }, []);

  const hasRegisteredPasskey = () => {
    try { return localStorage.getItem(PASSKEY_REGISTERED_KEY) === "true"; }
    catch { return false; }
  };

  // ── Register a passkey after successful password login ────────────────────
  const registerPasskey = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supported = await isSupported();
      if (!supported) throw new Error("Passkeys not supported on this device.");

      // Supabase MFA: enroll a WebAuthn factor
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "webauthn",
      });

      if (error) throw error;

      // Trigger the browser's native biometric prompt
      const credential = await navigator.credentials.create({
        publicKey: data.totp, // Supabase returns the PublicKeyCredentialCreationOptions
      });

      // Verify the credential with Supabase to complete enrollment
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId: data.id,
        challengeId: data.challenge_id,
        code: JSON.stringify(credential),
      });

      if (verifyError) throw verifyError;

      localStorage.setItem(PASSKEY_REGISTERED_KEY, "true");
      return { success: true };
    } catch (err) {
      // User cancelled the biometric prompt — not an error we surface
      if (err.name === "NotAllowedError") return { success: false, cancelled: true };
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isSupported]);

  // ── Login with passkey (biometrics only — no password needed) ────────────
  const loginWithPasskey = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const supported = await isSupported();
      if (!supported) throw new Error("Passkeys not supported on this device.");

      // Get the list of enrolled WebAuthn factors for this browser session
      // Note: for passkey-only login (no session yet), we use a challenge flow
      const { data: challengeData, error: challengeError } =
        await supabase.auth.signInWithPasskey();

      if (challengeError) throw challengeError;

      return { success: true, session: challengeData.session };
    } catch (err) {
      if (err.name === "NotAllowedError") return { success: false, cancelled: true };
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [isSupported]);

  return {
    registerPasskey,
    loginWithPasskey,
    isSupported,
    hasRegisteredPasskey,
    loading,
    error,
  };
}
