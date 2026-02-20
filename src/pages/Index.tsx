import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, Sparkles, TrendingUp, FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="dark min-h-screen bg-background">
      <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl gradient-text">TrendScript AI</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate("/auth")}>Sign In</Button>
          <Button className="gradient-primary" onClick={() => navigate("/auth")}>Get Started</Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-20 pb-32 text-center">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
          Predict Trends.
          <br />
          <span className="gradient-text">Generate Scripts.</span>
        </h1>
        <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
          AI-powered trend forecasting and short-form video script generator for Instagram Reels, YouTube Shorts, and TikTok.
        </p>
        <div className="flex gap-3 justify-center mt-8">
          <Button size="lg" className="gradient-primary" onClick={() => navigate("/auth")}>
            <Sparkles className="mr-2 h-4 w-4" />
            Start Free
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-24">
          {[
            { icon: TrendingUp, title: "Trend Prediction", desc: "AI predicts emerging high-virality content ideas across niches" },
            { icon: FileText, title: "Script Generation", desc: "Generate hook-first short-form scripts optimized for any platform" },
            { icon: Sparkles, title: "Smart Hashtags", desc: "AI-curated hashtags, captions, and posting schedules" },
          ].map((f, i) => (
            <div key={i} className="glass-card rounded-xl p-6 text-left">
              <f.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
