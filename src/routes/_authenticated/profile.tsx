import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import {
  changePassword,
  deleteAccount,
  fetchProfile,
  sendPasswordOtp,
  sendProfileOtp,
  updateProfile,
} from "@/lib/account-api";
import { DEMO_MODE } from "@/lib/api-client";
import type { Gender, ProfileUpdateInput, UserProfile } from "@/lib/types";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Splitwise" },
      { name: "description", content: "View and update your account details, password and preferences." },
      { property: "og:title", content: "Profile — Splitwise" },
      { property: "og:description", content: "View and update your account details, password and preferences." },
    ],
  }),
  component: ProfilePage,
});

const errMsg = (error: unknown) => (error instanceof Error ? error.message : "Something went wrong");

function ProfilePage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const profileQuery = useQuery({ queryKey: ["profile"], queryFn: fetchProfile });

  return (
    <AppShell title="Profile">
      <div className="mx-auto max-w-3xl">
        {profileQuery.isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        ) : profileQuery.isError ? (
          <Card>
            <CardHeader>
              <CardTitle>Couldn&apos;t load your profile</CardTitle>
              <CardDescription>{errMsg(profileQuery.error)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => profileQuery.refetch()}>Try again</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <ProfileHeader user={profileQuery.data!} />
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="danger">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4">
                <DetailsForm
                  user={profileQuery.data!}
                  onSaved={() => queryClient.invalidateQueries({ queryKey: ["profile"] })}
                />
              </TabsContent>

              <TabsContent value="password" className="mt-4">
                <PasswordForm />
              </TabsContent>

              <TabsContent value="danger" className="mt-4">
                <DangerZone
                  onDeleted={async () => {
                    await logout();
                    navigate({ to: "/auth", replace: true });
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ProfileHeader({ user }: { user: UserProfile }) {
  const initials = `${user.firstname?.[0] ?? ""}${user.lastname?.[0] ?? ""}`.toUpperCase();
  return (
    <Card>
      <CardContent className="flex flex-wrap items-center gap-4 pt-6">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
          {initials || "U"}
        </span>
        <div className="min-w-0">
          <p className="truncate text-xl font-semibold text-foreground">
            {user.firstname} {user.lastname}
          </p>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
          <p className="text-sm text-muted-foreground">
            {user.email} · +91 {user.mobile_no}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function DetailsForm({ user, onSaved }: { user: UserProfile; onSaved: () => void }) {
  const [form, setForm] = useState({
    firstname: user.firstname ?? "",
    lastname: user.lastname ?? "",
    gender: (user.gender ?? "male") as Gender,
    email: user.email ?? "",
    email_otp: "",
    mobile_no: user.mobile_no ?? "",
    mobile_otp: "",
  });

  useEffect(() => {
    setForm({
      firstname: user.firstname ?? "",
      lastname: user.lastname ?? "",
      gender: (user.gender ?? "male") as Gender,
      email: user.email ?? "",
      email_otp: "",
      mobile_no: user.mobile_no ?? "",
      mobile_otp: "",
    });
  }, [user]);

  const emailChanged = form.email !== user.email;
  const mobileChanged = form.mobile_no !== user.mobile_no;

  const otpMutation = useMutation({
    mutationFn: ({ purpose, target }: { purpose: "update_email" | "update_phone"; target: string }) =>
      sendProfileOtp(purpose, target),
    onSuccess: (res) => toast.success(res.msg ?? "OTP sent"),
    onError: (error) => toast.error(errMsg(error)),
  });

  const saveMutation = useMutation({
    mutationFn: (payload: ProfileUpdateInput) => updateProfile(payload),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      onSaved();
    },
    onError: (error) => toast.error(errMsg(error)),
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload: ProfileUpdateInput = {
      firstname: form.firstname,
      lastname: form.lastname,
      gender: form.gender,
    };
    if (emailChanged) {
      payload.email = form.email;
      payload.email_otp = form.email_otp;
    }
    if (mobileChanged) {
      payload.mobile_no = form.mobile_no;
      payload.mobile_otp = form.mobile_otp;
    }
    saveMutation.mutate(payload);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal details</CardTitle>
        <CardDescription>
          Email and mobile changes need an OTP{DEMO_MODE ? " (demo OTP: 123456)" : ""}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submit}>
          <div className="grid gap-2">
            <Label htmlFor="firstname">First name</Label>
            <Input
              id="firstname"
              value={form.firstname}
              onChange={(e) => setForm({ ...form, firstname: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastname">Last name</Label>
            <Input
              id="lastname"
              value={form.lastname}
              onChange={(e) => setForm({ ...form, lastname: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={user.username} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={form.gender} onValueChange={(value) => setForm({ ...form, gender: value as Gender })}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
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
            <div className="flex flex-wrap gap-2">
              <Input
                id="email"
                type="email"
                className="min-w-48 flex-1"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <Button
                type="button"
                variant="outline"
                disabled={!emailChanged || otpMutation.isPending}
                onClick={() => otpMutation.mutate({ purpose: "update_email", target: form.email })}
              >
                Send OTP
              </Button>
            </div>
            {emailChanged && (
              <Input
                placeholder="Email OTP"
                value={form.email_otp}
                onChange={(e) => setForm({ ...form, email_otp: e.target.value })}
                required
              />
            )}
          </div>

          <div className="grid gap-2 sm:col-span-2">
            <Label htmlFor="mobile">Mobile number</Label>
            <div className="flex flex-wrap gap-2">
              <Input
                id="mobile"
                inputMode="numeric"
                maxLength={10}
                className="min-w-48 flex-1"
                value={form.mobile_no}
                onChange={(e) => setForm({ ...form, mobile_no: e.target.value.replace(/\D/g, "") })}
              />
              <Button
                type="button"
                variant="outline"
                disabled={!mobileChanged || form.mobile_no.length !== 10 || otpMutation.isPending}
                onClick={() => otpMutation.mutate({ purpose: "update_phone", target: form.mobile_no })}
              >
                Send OTP
              </Button>
            </div>
            {mobileChanged && (
              <Input
                placeholder="Mobile OTP"
                value={form.mobile_otp}
                onChange={(e) => setForm({ ...form, mobile_otp: e.target.value })}
                required
              />
            )}
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function PasswordForm() {
  const [form, setForm] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
    otp: "",
  });

  const otpMutation = useMutation({
    mutationFn: (channel: "email" | "phone") => sendPasswordOtp(channel),
    onSuccess: (res) => toast.success(res.msg ?? "OTP sent"),
    onError: (error) => toast.error(errMsg(error)),
  });

  const changeMutation = useMutation({
    mutationFn: () => changePassword(form),
    onSuccess: (res) => {
      toast.success(res.msg ?? "Password changed");
      setForm({ old_password: "", new_password: "", confirm_password: "", otp: "" });
    },
    onError: (error) => toast.error(errMsg(error)),
  });

  const mismatch = form.confirm_password.length > 0 && form.new_password !== form.confirm_password;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>
          Request an OTP on your email or phone, then set the new password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="grid max-w-md gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            changeMutation.mutate();
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="old">Current password</Label>
            <Input
              id="old"
              type="password"
              value={form.old_password}
              onChange={(e) => setForm({ ...form, old_password: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new">New password</Label>
            <Input
              id="new"
              type="password"
              value={form.new_password}
              onChange={(e) => setForm({ ...form, new_password: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              8–15 characters with upper, lower, a digit and a special character.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type="password"
              value={form.confirm_password}
              onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
              required
            />
            {mismatch && <p className="text-xs text-destructive">Passwords do not match.</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="otp">OTP</Label>
            <div className="flex flex-wrap gap-2">
              <Input
                id="otp"
                className="min-w-40 flex-1"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
                required
              />
              <Button
                type="button"
                variant="outline"
                disabled={otpMutation.isPending}
                onClick={() => otpMutation.mutate("email")}
              >
                OTP on email
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={otpMutation.isPending}
                onClick={() => otpMutation.mutate("phone")}
              >
                OTP on phone
              </Button>
            </div>
          </div>
          <Button type="submit" disabled={changeMutation.isPending || mismatch}>
            {changeMutation.isPending ? "Updating…" : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function DangerZone({ onDeleted }: { onDeleted: () => void }) {
  const deleteMutation = useMutation({
    mutationFn: deleteAccount,
    onSuccess: (res) => {
      toast.success(res.msg ?? "Account deleted");
      onDeleted();
    },
    onError: (error) => toast.error(errMsg(error)),
  });

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive">Delete account</CardTitle>
        <CardDescription>
          This permanently removes your account, and you are taken out of every group.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={deleteMutation.isPending}>
              Delete my account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete account permanently?</AlertDialogTitle>
              <AlertDialogDescription>
                This cannot be undone. Your profile, friend links and group membership will be removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteMutation.mutate()}>
                Yes, delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
