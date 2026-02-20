import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Sparkles, Copy, TrendingUp, Clock, Hash } from "lucide-react";

const niches = ["Tech", "Finance", "Entertainment", "Fitness", "AI", "Startups"];
const platforms = ["Instagram Reels", "YouTube Shorts", "TikTok"];
const tones = ["Educational", "Viral/Controversial", "Storytelling", "Funny", "Authority/Expert"];
const countries = ["United States", "India", "United Kingdom", "Canada", "Australia", "Global"];

interface TrendIdea {
  title: string;
  hook: string;
  bestTime: string;
  hashtags: string[];
  viralityScore: number;
}

interface GeneratedScript {
  hook: string;
  body: string;
  cta: string;
  caption: string;
  hashtags: string[];
  onscreenText: string[];
  shotBreakdown: string[];
}

const PredictTrends = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [niche, setNiche] = useState(location.state?.niche || "");
  const [audience, setAudience] = useState("");
  const [country, setCountry] = useState("");
  const [platform, setPlatform] = useState("");
  const [tone, setTone] = useState("");
  const [loading, setLoading] = useState(false);
  const [scriptLoading, setScriptLoading] = useState(false);
  const [trends, setTrends] = useState<TrendIdea[]>([]);
  const [selectedTrend, setSelectedTrend] = useState<TrendIdea | null>(null);
  const [script, setScript] = useState<GeneratedScript | null>(null);

  const predictTrends = async () => {
    if (!niche || !platform) {
      toast.error("Please select a niche and platform");
      return;
    }
    setLoading(true);
    setTrends([]);
    setScript(null);
    setSelectedTrend(null);

    try {
      const { data, error } = await supabase.functions.invoke("predict-trends", {
        body: { niche, audience, country, platform },
      });
      if (error) throw error;
      setTrends(data.trends || []);

      // Save to history
      await supabase.from("trend_history").insert({
        user_id: user!.id,
        niche,
        target_audience: audience,
        country,
        platform,
        trends: data.trends as any,
      });

      toast.success("Trends generated!");
    } catch (e: any) {
      toast.error(e.message || "Failed to predict trends");
    } finally {
      setLoading(false);
    }
  };

  const generateScript = async (trend: TrendIdea) => {
    if (!tone) {
      toast.error("Please select a tone first");
      return;
    }
    setSelectedTrend(trend);
    setScriptLoading(true);
    setScript(null);

    try {
      const { data, error } = await supabase.functions.invoke("generate-script", {
        body: { trend: trend.title, platform, tone, niche },
      });
      if (error) throw error;
      setScript(data.script);

      // Save script
      await supabase.from("saved_scripts").insert({
        user_id: user!.id,
        trend_title: trend.title,
        niche,
        platform,
        tone,
        hook: data.script.hook,
        script_body: data.script.body,
        cta: data.script.cta,
        caption: data.script.caption,
        hashtags: data.script.hashtags,
        onscreen_text: data.script.onscreenText,
        shot_breakdown: data.script.shotBreakdown,
        generated_output: data.script as any,
      });

      toast.success("Script generated & saved!");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate script");
    } finally {
      setScriptLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold">Predict Trends</h1>
        <p className="text-muted-foreground mt-1">AI-powered trend forecasting & script generation</p>
      </div>

      {/* Input form */}
      <Card className="glass-card">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Niche</label>
              <Select value={niche} onValueChange={setNiche}>
                <SelectTrigger><SelectValue placeholder="Select niche" /></SelectTrigger>
                <SelectContent>
                  {niches.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Platform</label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger><SelectValue placeholder="Select platform" /></SelectTrigger>
                <SelectContent>
                  {platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience</label>
              <Input placeholder="e.g. Gen Z entrepreneurs" value={audience} onChange={(e) => setAudience(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                <SelectContent>
                  {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tone</label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger>
                <SelectContent>
                  {tones.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={predictTrends} disabled={loading} className="mt-4 gradient-primary">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Predict Trends
          </Button>
        </CardContent>
      </Card>

      {/* Trend results */}
      {trends.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Trending Ideas</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {trends.map((trend, i) => (
              <Card
                key={i}
                className={`glass-card cursor-pointer transition-all hover:border-primary/40 ${
                  selectedTrend?.title === trend.title ? "border-primary ring-1 ring-primary/30" : ""
                }`}
                onClick={() => generateScript(trend)}
              >
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <p className="font-medium text-sm">{trend.title}</p>
                    <Badge className="gradient-primary text-xs shrink-0 ml-2">
                      {trend.viralityScore}/100
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Hook: {trend.hook}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {trend.bestTime}
                    <Hash className="h-3 w-3 ml-2" /> {trend.hashtags?.slice(0, 3).join(", ")}
                  </div>
                  {scriptLoading && selectedTrend?.title === trend.title && (
                    <div className="flex items-center gap-2 text-primary text-xs">
                      <Loader2 className="h-3 w-3 animate-spin" /> Generating script...
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Generated script */}
      {script && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generated Script
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="script">
              <TabsList>
                <TabsTrigger value="script">Script</TabsTrigger>
                <TabsTrigger value="visual">Visual</TabsTrigger>
                <TabsTrigger value="social">Social</TabsTrigger>
              </TabsList>

              <TabsContent value="script" className="space-y-4 mt-4">
                <ScriptSection title="🎣 Hook (First 3 sec)" content={script.hook} onCopy={copyToClipboard} />
                <ScriptSection title="📝 Main Content" content={script.body} onCopy={copyToClipboard} />
                <ScriptSection title="🎯 Call to Action" content={script.cta} onCopy={copyToClipboard} />
              </TabsContent>

              <TabsContent value="visual" className="space-y-4 mt-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">On-Screen Text</h4>
                  <div className="space-y-1">
                    {script.onscreenText?.map((t, i) => (
                      <p key={i} className="text-sm text-muted-foreground">• {t}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Shot Breakdown</h4>
                  <div className="space-y-1">
                    {script.shotBreakdown?.map((s, i) => (
                      <p key={i} className="text-sm text-muted-foreground">{i + 1}. {s}</p>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="social" className="space-y-4 mt-4">
                <ScriptSection title="Caption" content={script.caption} onCopy={copyToClipboard} />
                <div>
                  <h4 className="font-medium text-sm mb-2">Hashtags</h4>
                  <div className="flex flex-wrap gap-1">
                    {script.hashtags?.map((h, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">#{h}</Badge>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2"
                    onClick={() => copyToClipboard(script.hashtags?.map((h) => `#${h}`).join(" ") || "")}
                  >
                    <Copy className="mr-1 h-3 w-3" /> Copy All
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

function ScriptSection({ title, content, onCopy }: { title: string; content: string; onCopy: (t: string) => void }) {
  return (
    <div className="rounded-lg bg-muted/50 p-4 relative group">
      <h4 className="font-medium text-sm mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
      <Button
        size="icon"
        variant="ghost"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
        onClick={() => onCopy(content)}
      >
        <Copy className="h-3 w-3" />
      </Button>
    </div>
  );
}

export default PredictTrends;
