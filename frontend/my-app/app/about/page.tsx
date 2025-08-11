import { Button } from "@/components/ui/button"
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
      name: "Sarah Mitchell",
      role: "Editor-in-Chief",
      bio: "Former Reuters correspondent with 20 years in investigative journalism",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      name: "Dr. James Chen",
      role: "AI Research Director",
      bio: "PhD in Machine Learning, specializing in misinformation detection algorithms",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      name: "Maria Rodriguez",
      role: "Fact-Check Lead",
      bio: "Award-winning fact-checker with expertise in political and scientific content",
      image: "/placeholder.svg?height=120&width=120",
    },
    {
      name: "David Thompson",
      role: "Technology Director",
      bio: "Former Google engineer focused on content verification systems",
      image: "/placeholder.svg?height=120&width=120",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="bg-gray-800 py-16 border-b border-gray-700">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="h-10 w-10 text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold">About NewsGuard</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We're on a mission to combat misinformation and provide the world with verified, trustworthy journalism
            through cutting-edge technology and rigorous editorial standards.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Mission Statement */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <Target className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                  <CardTitle className="text-white text-center">Fight Misinformation</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    Using advanced AI and human expertise to identify and prevent the spread of false information.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <Eye className="h-8 w-8 text-indigo-400 mx-auto mb-4" />
                  <CardTitle className="text-white text-center">Promote Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
                    Every article includes clear source attribution and verification status for complete transparency.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-600">
                <CardHeader>
                  <Users className="h-8 w-8 text-purple-400 mx-auto mb-4" />
                  <CardTitle className="text-white text-center">Empower Citizens</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-300 text-center">
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
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Since our launch, we've been making a significant impact in the fight against misinformation.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 text-center">
                <CardContent className="p-6">
                  <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How We Work */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How We Ensure Accuracy</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our multi-layered verification process combines cutting-edge technology with human expertise.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Detection</h3>
              <p className="text-gray-400">
                Advanced machine learning algorithms scan content for potential misinformation patterns and
                inconsistencies.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Review</h3>
              <p className="text-gray-400">
                Our team of experienced journalists and fact-checkers manually review flagged content and verify
                sources.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Source Verification</h3>
              <p className="text-gray-400">
                Every claim is cross-referenced with multiple credible sources and official documentation.
              </p>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Leadership Team</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Meet the experts behind NewsGuard, bringing decades of experience in journalism, technology, and
              fact-checking.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 text-center">
                <CardContent className="p-6">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-blue-400 mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.bio}</p>
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
            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Integrity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  We maintain the highest standards of journalistic integrity, never compromising on accuracy for speed
                  or engagement.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-indigo-400" />
                  Transparency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Our verification process is open and transparent, with clear indicators of how each article was
                  fact-checked.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  Every piece of information is rigorously fact-checked and verified before publication.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-400" />
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300">
                  We believe in empowering our community with the tools and knowledge to identify reliable information.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="bg-slate-800 border-slate-600 max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Join Our Mission</h2>
              <p className="text-gray-300 mb-6">
                Help us build a more informed world. Sign up for verified news updates and become part of the solution
                against misinformation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent">
                  Contact Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
