import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Receipt } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { DEMO_MODE } from "@/lib/api-client";
import type { Gender } from "@/lib/types";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Register — Splitwise" },
      { name: "description", content: "Sign in to your Splitwise account or create a new one." },
      { property: "og:title", content: "Login or Register — Splitwise" },
      { property: "og:description", content: "Sign in to your Splitwise account or create a new one." },
    ],
  }),
  component: AuthPage,
});

const errMsg = (error: unknown) => (error instanceof Error ? error.message : "Something went wrong");

function AuthPage() {
  const { login, register, isAuthenticated, ready } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && isAuthenticated) navigate({ to: "/dashboard", replace: true });
  }, [ready, isAuthenticated, navigate]);

  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    firstname: "",
    lastname: "",
    username: "",
    gender: "male" as Gender,
    mobile_no: "",
    email: "",
    password: "",
  });

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await login(loginForm.username, loginForm.password);
      toast.success("Welcome back!");
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(errMsg(error));
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      await register(signupForm);
      await login(signupForm.username, signupForm.password);
      toast.success("Account created");
      navigate({ to: "/dashboard" });
    } catch (error) {
      toast.error(errMsg(error));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Receipt className="size-5" />
          </span>
          <span className="text-xl font-semibold text-foreground">Splitwise</span>
        </div>

        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                  {DEMO_MODE ? "Demo mode: username demouser, any password." : "Sign in with your username."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4" onSubmit={handleLogin}>
                  <div className="grid gap-2">
                    <Label htmlFor="login-username">Username</Label>
                    <Input
                      id="login-username"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={busy}>
                    {busy ? "Signing in…" : "Login"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Create your account</CardTitle>
                <CardDescription>It only takes a minute.</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleRegister}>
                  <div className="grid gap-2">
                    <Label htmlFor="firstname">First name</Label>
                    <Input
                      id="firstname"
                      value={signupForm.firstname}
                      onChange={(e) => setSignupForm({ ...signupForm, firstname: e.target.value })}
                      required
                      minLength={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastname">Last name</Label>
                    <Input
                      id="lastname"
                      value={signupForm.lastname}
                      onChange={(e) => setSignupForm({ ...signupForm, lastname: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={signupForm.username}
                      onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={signupForm.gender}
                      onValueChange={(value) => setSignupForm({ ...signupForm, gender: value as Gender })}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="mobile">Mobile number</Label>
                    <Input
                      id="mobile"
                      inputMode="numeric"
                      maxLength={10}
                      value={signupForm.mobile_no}
                      onChange={(e) =>
                        setSignupForm({ ...signupForm, mobile_no: e.target.value.replace(/\D/g, "") })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2 sm:col-span-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      8–15 characters with upper, lower, a digit and a special character.
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <Button type="submit" className="w-full" disabled={busy}>
                      {busy ? "Creating…" : "Create account"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
