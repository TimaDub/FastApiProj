import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Target, Award, CheckCircle, Globe, Zap, Eye } from "lucide-react"

export default function AboutPage() {
  const stats = [
    { label: "Articles Verified", value: "50,000+", icon: CheckCircle },
    { label: "Active Users", value: "1.2M+", icon: Users },
    { label: "Countries Served", value: "150+", icon: Globe },
    { label: "Accuracy Rate", value: "99.7%", icon: Award },
  ]

  const team = [
    {
      name: "Tymofii Dubovyi",
      role: "Founder & CEO",
      bio: "Visionary leader dedicated to combating misinformation through innovative technology",
      image: "/placeholder.svg?height=120&width=120",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="bg-card py-16 border-b border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="h-10 w-10 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold text-card-foreground">About NewsGuard</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to combat misinformation and provide the world with verified, trustworthy journalism
            through cutting-edge technology and rigorous editorial standards.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Mission Statement */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-foreground">Our Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-card border-border">
                <CardHeader>
                  <Target className="h-8 w-8 text-primary mx-auto mb-4" />
                  <CardTitle className="text-card-foreground text-center">Fight Misinformation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-center">
                    Using advanced AI and human expertise to identify and prevent the spread of false information.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <Eye className="h-8 w-8 text-primary mx-auto mb-4" />
                  <CardTitle className="text-card-foreground text-center">Promote Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-center">
                    Every article includes clear source attribution and verification status for complete transparency.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mx-auto mb-4" />
                  <CardTitle className="text-card-foreground text-center">Empower Citizens</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-center">
                    Providing tools and verified information to help people make informed decisions.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Our Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Since our launch, we've been making a significant impact in the fight against misinformation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card border-border text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-card-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How We Work */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">How We Ensure Accuracy</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our multi-layered verification process combines cutting-edge technology with human expertise.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">AI-Powered Detection</h3>
              <p className="text-muted-foreground">
                Advanced machine learning algorithms scan content for potential misinformation patterns and
                inconsistencies.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Expert Review</h3>
              <p className="text-muted-foreground">
                Our team of experienced journalists and fact-checkers manually review flagged content and verify
                sources.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">Source Verification</h3>
              <p className="text-muted-foreground">
                Every claim is cross-referenced with multiple credible sources and official documentation.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Leadership</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the founder behind NewsGuard, dedicated to bringing verified journalism to the world.
            </p>
          </div>
          <div className="flex justify-center">
            {team.map((member, index) => (
              <Card key={index} className="bg-card border-border text-center">
                <CardContent className="p-6">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-card-foreground mb-1">{member.name}</h3>
                  <p className="text-primary mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Integrity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  We maintain the highest standards of journalistic integrity, never compromising on accuracy for speed
                  or engagement.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Transparency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Our verification process is open and transparent, with clear indicators of how each article was
                  fact-checked.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  Every piece of information is rigorously fact-checked and verified before publication.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  We believe in empowering our community with the tools and knowledge to identify reliable information.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

      </div>
    </div>
  )
}
