import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../lib/AuthContext";
import { useToast } from "../lib/ToastContext";

const configured = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);

export default function GoogleAuthButton({ onSuccess }: { onSuccess: () => void }) {
  const { loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  if (!configured) {
    return (
      <button
        type="button"
        disabled
        title="Google Sign-In needs a VITE_GOOGLE_CLIENT_ID configured on the frontend"
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-50 py-2 text-sm font-medium text-slate-400"
      >
        Continue with Google
      </button>
    );
  }

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) {
            showToast("Google Sign-In did not return a credential", "error");
            return;
          }
          try {
            await loginWithGoogle(credentialResponse.credential);
            onSuccess();
          } catch (err) {
            showToast(err instanceof Error ? err.message : "Google Sign-In failed", "error");
          }
        }}
        onError={() => showToast("Google Sign-In failed", "error")}
        width="320"
      />
    </div>
  );
}
