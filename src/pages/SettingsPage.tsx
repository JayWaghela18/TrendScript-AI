import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, User, Crown } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [tier, setTier] = useState("free");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("full_name, subscription_tier")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setFullName(data.full_name || "");
          setTier(data.subscription_tier);
        }
      });
  }, [user]);

  const updateProfile = async () => {
    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("user_id", user!.id);
    if (error) toast.error(error.message);
    else toast.success("Profile updated!");
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" /> Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input value={user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <Button onClick={updateProfile} disabled={loading} className="gradient-primary">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5" /> Subscription
          </CardTitle>
          <CardDescription>Your current plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge className={tier === "pro" ? "gradient-primary" : ""}>
              {tier === "pro" ? "Pro" : "Free"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {tier === "free" ? "5 scripts/day" : "Unlimited scripts"}
            </span>
          </div>
          {tier === "free" && (
            <Button variant="outline" className="mt-4" disabled>
              Upgrade to Pro (Coming Soon)
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
