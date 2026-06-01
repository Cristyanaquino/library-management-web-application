import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

import { demoProfile, fetchProfile, isSupabaseConfigured, upsertProfile } from "@/lib/libraryApi";
import { supabase } from "@/lib/supabaseClient";
import type { AuthUser, Profile } from "@/lib/types";

type AuthContextValue = {
  user: AuthUser | null;
  profile: Profile | null;
  loading: boolean;
  demoMode: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (values: { fullName: string; email: string; password: string }) => Promise<{ error?: string; needsEmailConfirmation?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function mapSessionUser(session: Session | null): AuthUser | null {
  if (!session?.user) return null;
  return {
    id: session.user.id,
    email: session.user.email ?? null,
    user_metadata: session.user.user_metadata ?? undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const demoMode = !isSupabaseConfigured;

  async function loadProfile(nextUser: AuthUser | null) {
    if (!nextUser) {
      setProfile(null);
      return;
    }

    if (!supabase) {
      setProfile(demoProfile);
      return;
    }

    const data = await fetchProfile(nextUser.id);
    if (!data) {
      const fallback: Profile = {
        id: nextUser.id,
        full_name:
          typeof nextUser.user_metadata?.full_name === "string"
            ? nextUser.user_metadata.full_name
            : nextUser.email?.split("@")[0] ?? "Leitor",
        email: nextUser.email ?? "",
        created_at: new Date().toISOString(),
      };
      setProfile(fallback);
      return;
    }

    setProfile(data);
  }

  useEffect(() => {
    let active = true;

    async function bootstrap() {
      if (!supabase) {
        if (!active) return;
        setUser({
          id: demoProfile.id,
          email: demoProfile.email,
          user_metadata: { full_name: demoProfile.full_name },
        });
        setProfile(demoProfile);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (!active) return;
      if (!error) {
        const nextUser = mapSessionUser(data.session);
        setUser(nextUser);
        await loadProfile(nextUser);
      }
      setLoading(false);
    }

    void bootstrap();

    if (!supabase) return () => {
      active = false;
    };

    const { data } = supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
      const nextUser = mapSessionUser(session);
      setUser(nextUser);
      await loadProfile(nextUser);
      setLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      demoMode,
      signIn: async (email, password) => {
        if (!supabase) {
          const nextUser: AuthUser = {
            id: demoProfile.id,
            email,
            user_metadata: { full_name: demoProfile.full_name },
          };
          setUser(nextUser);
          setProfile({ ...demoProfile, email });
          return {};
        }
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return error ? { error: error.message } : {};
      },
      signUp: async ({ fullName, email, password }) => {
        if (!supabase) {
          const nextUser: AuthUser = {
            id: crypto.randomUUID(),
            email,
            user_metadata: { full_name: fullName },
          };
          setUser(nextUser);
          setProfile({ id: nextUser.id, full_name: fullName, email, created_at: new Date().toISOString() });
          return {};
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });

        if (error) return { error: error.message };

        if (data.user) {
          try {
            await upsertProfile(
              {
                id: data.user.id,
                email: data.user.email ?? email,
                user_metadata: data.user.user_metadata ?? { full_name: fullName },
              },
              fullName,
            );
          } catch (profileError) {
            return { error: profileError instanceof Error ? profileError.message : "Não foi possível salvar seu perfil." };
          }
        }

        return { needsEmailConfirmation: !data.session };
      },
      signOut: async () => {
        if (!supabase) {
          setUser(null);
          setProfile(null);
          return;
        }
        await supabase.auth.signOut();
      },
      resetPassword: async (email) => {
        if (!supabase) return {};
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login?recovery=1`,
        });
        return error ? { error: error.message } : {};
      },
      refreshProfile: async () => {
        await loadProfile(user);
      },
    }),
    [demoMode, loading, profile, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
