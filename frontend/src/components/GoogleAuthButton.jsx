
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import toast from "react-hot-toast";

export default function GoogleAuthButton({ onSuccess, disabled = false }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <p className="text-sm text-red-400 text-center">
        Google sign-in is not configured.
      </p>
    );
  }

  return (
    <div className={disabled ? "pointer-events-none opacity-60" : ""}>
      <GoogleOAuthProvider clientId={clientId}>
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (response) => {
              if (!response.credential) {
                toast.error("Google sign-in failed.");
                return;
              }

              await onSuccess(response.credential);
            }}
            onError={() => toast.error("Google sign-in failed. Please try again.")}
            text="continue_with"
            shape="rectangular"
            theme="outline"
            size="large"
            width="320"
          />
        </div>
      </GoogleOAuthProvider>
    </div>
  );
}
