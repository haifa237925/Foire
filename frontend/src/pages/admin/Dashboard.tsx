
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookText, DollarSign, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Données fictives pour la démonstration
const MOCK_DATA = {
  totalUsers: 1245,
  writers: 326,
  readers: 919,
  totalBooks: 852,
  revenue: 15684.45,
  growth: "+12.5%",
  recentUsers: [
    { id: 1, name: "Sophie Martin", role: "reader", date: "2025-04-15" },
    { id: 2, name: "Jean Dupont", role: "writer", date: "2025-04-14" },
    { id: 3, name: "Marie Bernard", role: "reader", date: "2025-04-14" },
  ],
  recentBooks: [
    { id: 101, title: "Le Secret des Étoiles", author: "Jean Dupont", date: "2025-04-13" },
    { id: 102, title: "Voyage au Centre de la Terre", author: "Jules Verne", date: "2025-04-12" },
    { id: 103, title: "Les Misérables", author: "Victor Hugo", date: "2025-04-10" },
  ],
};

export default function Dashboard() {
  const [data, setData] = useState(MOCK_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Simulation du chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Données chargées",
        description: "Les statistiques sont à jour",
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Utilisateurs" 
          value={data.totalUsers} 
          description={`${data.writers} écrivains, ${data.readers} lecteurs`} 
          icon={<Users className="h-8 w-8" />}
          isLoading={isLoading} 
        />
        
        <StatCard 
          title="Livres publiés" 
          value={data.totalBooks} 
          description="Total des ebooks et livres audio" 
          icon={<BookText className="h-8 w-8" />}
          isLoading={isLoading} 
        />
        
        <StatCard 
          title="Revenus (€)" 
          value={data.revenue.toLocaleString('fr-FR')} 
          description="Total des ventes" 
          icon={<DollarSign className="h-8 w-8" />}
          isLoading={isLoading} 
        />
        
        <StatCard 
          title="Croissance" 
          value={data.growth} 
          description="Vs mois précédent" 
          icon={<TrendingUp className="h-8 w-8" />}
          isLoading={isLoading} 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentActivityCard 
          title="Utilisateurs récents" 
          items={data.recentUsers}
          type="users"
          isLoading={isLoading}
        />
        
        <RecentActivityCard 
          title="Livres récemment publiés" 
          items={data.recentBooks}
          type="books"
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

// Composant pour les cartes de statistiques
function StatCard({ title, value, description, icon, isLoading }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

// Composant pour les cartes d'activité récente
function RecentActivityCard({ title, items, type, isLoading }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Activité des 7 derniers jours</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="py-2">
              <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="border-b pb-2 last:border-0">
                {type === "users" ? (
                  <>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.role === "writer" ? "Écrivain" : "Lecteur"} • Inscrit le {formatDate(item.date)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Par {item.author} • Publié le {formatDate(item.date)}
                    </p>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

// Fonction pour formater les dates - Fixed with correct type for DateTimeFormatOptions
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions;
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}
