import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Sparkles, Flame, Instagram, Youtube, Music2 } from "lucide-react";

const categories = ["Tech", "Finance", "Entertainment", "Fitness", "AI", "Startups"];

const platformIcon: Record<string, React.ReactNode> = {
  Instagram: <Instagram className="h-3 w-3" />,
  "YouTube Shorts": <Youtube className="h-3 w-3" />,
  TikTok: <Music2 className="h-3 w-3" />,
};

interface MockTrend {
  title: string;
  category: string;
  trendScore: number;
  viralityScore: number;
  platform: string;
}

const mockTrends: MockTrend[] = [
  { title: "AI Agents replacing SaaS tools", category: "AI", trendScore: 95, viralityScore: 88, platform: "YouTube Shorts" },
  { title: "Micro-investing apps for Gen Z", category: "Finance", trendScore: 82, viralityScore: 76, platform: "TikTok" },
  { title: "Solo founder bootstrapping stories", category: "Startups", trendScore: 90, viralityScore: 92, platform: "Instagram" },
  { title: "5AM morning routine productivity", category: "Fitness", trendScore: 78, viralityScore: 85, platform: "TikTok" },
  { title: "Behind the scenes of tech startups", category: "Tech", trendScore: 85, viralityScore: 79, platform: "YouTube Shorts" },
  { title: "Movie AI deepfake analysis", category: "Entertainment", trendScore: 88, viralityScore: 91, platform: "Instagram" },
];

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const filtered = selectedCategory
    ? mockTrends.filter((t) => t.category === selectedCategory)
    : mockTrends;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Discover trending topics across niches</p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedCategory(null)}
          className={selectedCategory === null ? "gradient-primary" : ""}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? "gradient-primary" : ""}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Trend cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((trend, i) => (
          <Card
            key={i}
            className="glass-card hover:border-primary/30 transition-all cursor-pointer group"
            onClick={() =>
              navigate("/dashboard/predict", {
                state: { trendTitle: trend.title, niche: trend.category },
              })
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base leading-snug">{trend.title}</CardTitle>
                <Badge variant="secondary" className="shrink-0 ml-2">{trend.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-3 w-3" /> Trend Score
                </span>
                <span className="font-semibold">{trend.trendScore}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Flame className="h-3 w-3" /> Virality
                </span>
                <span className="font-semibold text-primary">{trend.viralityScore}/100</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {platformIcon[trend.platform]}
                <span>{trend.platform}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="w-full mt-2 group-hover:bg-primary/10 group-hover:text-primary"
              >
                <Sparkles className="mr-1 h-3 w-3" /> Generate Script
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
