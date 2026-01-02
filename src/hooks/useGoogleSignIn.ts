import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: {
              credential: string;
              select_by?: string;
            }) => void;
          }) => void;
          prompt: () => void;
          renderButton: (
            element: HTMLElement,
            config: {
              theme?: "outline" | "filled_blue" | "filled_black";
              size?: "large" | "medium" | "small";
              text?: "signin_with" | "signup_with" | "continue_with" | "signin";
              shape?: "rectangular" | "pill" | "circle" | "square";
              logo_alignment?: "left" | "center";
              width?: string;
              locale?: string;
            }
          ) => void;
        };
      };
    };
  }
}

interface UseGoogleSignInProps {
  clientId: string;
  onSuccess: (credential: string) => void;
  onError?: (error: Error) => void;
}

export const useGoogleSignIn = ({
  clientId,
  onSuccess,
  onError,
}: UseGoogleSignInProps) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!clientId) {
      console.warn("Google Client ID is not provided");
      return;
    }

    const initializeGoogleSignIn = () => {
      if (isInitialized.current || !window.google) return;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response.credential) {
              onSuccess(response.credential);
            }
          },
        });

        if (buttonRef.current) {
          window.google.accounts.id.renderButton(buttonRef.current, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            width: "100%",
          });
        }

        isInitialized.current = true;
      } catch (error) {
        console.error("Error initializing Google Sign-In:", error);
        if (onError) {
          onError(error as Error);
        }
      }
    };

    // Check if Google script is already loaded
    if (window.google?.accounts?.id) {
      initializeGoogleSignIn();
    } else {
      // Wait for the script to load
      const checkGoogle = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkGoogle);
          initializeGoogleSignIn();
        }
      }, 100);

      // Cleanup after 10 seconds
      setTimeout(() => clearInterval(checkGoogle), 10000);
    }

    return () => {
      isInitialized.current = false;
    };
  }, [clientId, onSuccess, onError]);

  const handleGoogleSignIn = () => {
    if (window.google?.accounts?.id && isInitialized.current) {
      window.google.accounts.id.prompt();
    }
  };

  return {
    buttonRef,
    handleGoogleSignIn,
  };
};



