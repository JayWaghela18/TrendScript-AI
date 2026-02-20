import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Copy, Trash2, FolderOpen } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const MyScripts = () => {
  const { user } = useAuth();
  const [scripts, setScripts] = useState<Tables<"saved_scripts">[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchScripts = async () => {
      const { data } = await supabase
        .from("saved_scripts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setScripts(data || []);
      setLoading(false);
    };
    fetchScripts();
  }, [user]);

  const deleteScript = async (id: string) => {
    await supabase.from("saved_scripts").delete().eq("id", id);
    setScripts((prev) => prev.filter((s) => s.id !== id));
    toast.success("Script deleted");
  };

  const copyAll = (s: Tables<"saved_scripts">) => {
    const text = `🎣 Hook:\n${s.hook}\n\n📝 Script:\n${s.script_body}\n\n🎯 CTA:\n${s.cta}\n\n📱 Caption:\n${s.caption}\n\n#️⃣ Hashtags:\n${s.hashtags?.map((h) => `#${h}`).join(" ")}`;
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Scripts</h1>
        <p className="text-muted-foreground mt-1">{scripts.length} saved scripts</p>
      </div>

      {scripts.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No scripts yet. Generate your first one!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {scripts.map((s) => (
            <Card key={s.id} className="glass-card">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div
                    className="cursor-pointer flex-1"
                    onClick={() => setExpanded(expanded === s.id ? null : s.id)}
                  >
                    <CardTitle className="text-base">{s.trend_title}</CardTitle>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">{s.niche}</Badge>
                      <Badge variant="secondary" className="text-xs">{s.platform}</Badge>
                      <Badge variant="outline" className="text-xs">{s.tone}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => copyAll(s)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-destructive"
                      onClick={() => deleteScript(s.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expanded === s.id && (
                <CardContent className="space-y-3 text-sm">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="font-medium text-xs mb-1">🎣 Hook</p>
                    <p className="text-muted-foreground">{s.hook}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="font-medium text-xs mb-1">📝 Script</p>
                    <p className="text-muted-foreground whitespace-pre-wrap">{s.script_body}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="font-medium text-xs mb-1">🎯 CTA</p>
                    <p className="text-muted-foreground">{s.cta}</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {s.hashtags?.map((h, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">#{h}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyScripts;
