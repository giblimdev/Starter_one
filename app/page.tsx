// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import DevToDoList from "@/components/dev/DevToDoList";
import { Rocket, Shield, Layout, Github } from "lucide-react"; // Import direct depuis lucide-react
import { Card } from "@/components/ui/card";

export default function Home() {
  const features = [
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Développement Rapide",
      description: "Template prêt à l'emploi avec architecture optimisée",
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Sécurité Intégrée",
      description: "Authentification complète avec rôles et permissions",
    },
    {
      icon: <Layout className="h-8 w-8" />,
      title: "UI Moderne",
      description: "Composants Shadcn/ui personnalisables et accessibles",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Votre Template <span className="text-primary">Next.js</span>{" "}
              Ultime
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Un starter kit complet avec authentification, dashboard et outils
              de développement intégrés
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/dev">Voir la Documentation</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link
                  href="https://github.com/giblimdev/next-starter.git"
                  target="_blank"
                >
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Fonctionnalités Clés
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Dev Preview Section */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">
              Suivi de Développement
            </h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Visualisez l&apos;avancement du projet et les tâches à venir
            </p>
            <div className="max-w-5xl mx-auto">
              <DevToDoList />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Prêt à commencer ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Clonez ce template et personnalisez-le pour votre projet en
              quelques minutes
            </p>
            <Button asChild size="lg" className="mx-2">
              <Link href="/auth/sign-up">Créer un compte</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="mx-2">
              <Link href="/dev">En savoir plus</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Mon Application. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
}
