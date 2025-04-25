import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye, FileDown, Calendar, Search, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Données fictives pour la démonstration
const MOCK_TRANSACTIONS = Array(75).fill(0).map((_, i) => {
  const bookType = i % 2 === 0 ? "ebook" : "audiobook";
  const price = bookType === "ebook" ? 5 + Math.random() * 15 : 10 + Math.random() * 20;
  
  return {
    id: `TRX-${1000 + i}`,
    bookId: i % 50 + 1,
    bookTitle: `Livre ${i % 50 + 1}`,
    bookType,
    userId: i % 20 + 1,
    userName: `Utilisateur ${i % 20 + 1}`,
    date: new Date(2025, 3, 15 - i % 60).toISOString(),
    amount: parseFloat(price.toFixed(2))
  };
});

export default function TransactionsManagement() {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [filteredTransactions, setFilteredTransactions] = useState(MOCK_TRANSACTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookTypeFilter, setBookTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Dialog states
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { toast } = useToast();

  // Simulation du chargement des données
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filtrage des transactions
  useEffect(() => {
    let results = transactions;
    
    if (searchTerm) {
      results = results.filter(
        t => t.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
             t.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             t.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (bookTypeFilter !== "all") {
      results = results.filter(t => t.bookType === bookTypeFilter);
    }
    
    if (dateFilter !== "all") {
      const currentDate = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(currentDate.getDate() - 30);
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(currentDate.getDate() - 90);
      
      if (dateFilter === "30days") {
        results = results.filter(t => new Date(t.date) >= thirtyDaysAgo);
      } else if (dateFilter === "90days") {
        results = results.filter(t => new Date(t.date) >= ninetyDaysAgo);
      } else if (dateFilter === "month") {
        results = results.filter(t => {
          const date = new Date(t.date);
          return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
        });
      }
    }
    
    setFilteredTransactions(results);
  }, [searchTerm, bookTypeFilter, dateFilter, transactions, selectedMonth, selectedYear]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  // Statistiques des transactions
  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.amount, 0);
  const ebookRevenue = filteredTransactions.filter(t => t.bookType === "ebook").reduce((sum, t) => sum + t.amount, 0);
  const audiobookRevenue = filteredTransactions.filter(t => t.bookType === "audiobook").reduce((sum, t) => sum + t.amount, 0);

  // Actions handlers
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  const handleExportCSV = () => {
    toast({
      title: "Export initié",
      description: "Le fichier CSV des transactions sera bientôt téléchargé",
    });
    
    // Dans une application réelle, ceci déclencherait un vrai téléchargement de fichier
    setTimeout(() => {
      toast({
        title: "Export terminé",
        description: "Le fichier CSV des transactions a été téléchargé",
      });
    }, 2000);
  };

  const handleGenerateReport = () => {
    toast({
      title: "Génération de rapport initiée",
      description: "Le rapport mensuel est en cours de génération",
    });
    
    // Dans une application réelle, ceci déclencherait la génération d'un vrai rapport
    setTimeout(() => {
      toast({
        title: "Rapport généré",
        description: "Le rapport mensuel a été généré et téléchargé",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion des transactions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenu total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-primary mr-2" />
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  `${totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenu ebooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-500 mr-2" />
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  `${ebookRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Revenu livres audio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-2xl font-bold">
                {isLoading ? (
                  <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  `${audiobookRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Filtres</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportCSV}>
              <FileDown className="mr-2 h-4 w-4" />
              Exporter CSV
            </Button>
            <Button onClick={handleGenerateReport}>
              <Calendar className="mr-2 h-4 w-4" />
              Rapport mensuel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par ID, titre ou utilisateur..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/3">
              <Select 
                value={bookTypeFilter} 
                onValueChange={setBookTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type de livre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="ebook">Ebooks</SelectItem>
                  <SelectItem value="audiobook">Livres audio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/3">
              <Select 
                value={dateFilter} 
                onValueChange={setDateFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="30days">30 derniers jours</SelectItem>
                  <SelectItem value="90days">90 derniers jours</SelectItem>
                  <SelectItem value="month">Mois spécifique</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {dateFilter === "month" && (
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="w-full md:w-1/2">
                <Select 
                  value={selectedMonth.toString()} 
                  onValueChange={(val) => setSelectedMonth(parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Mois" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array(12).fill(0).map((_, i) => (
                      <SelectItem key={i} value={i.toString()}>
                        {new Date(0, i).toLocaleString('fr-FR', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-1/2">
                <Select 
                  value={selectedYear.toString()} 
                  onValueChange={(val) => setSelectedYear(parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Année" />
                  </SelectTrigger>
                  <SelectContent>
                    {[2023, 2024, 2025].map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Livre</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Utilisateur</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    {Array(7).fill(0).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Aucune transaction trouvée
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.id}</TableCell>
                    <TableCell>{transaction.bookTitle}</TableCell>
                    <TableCell>{transaction.bookType === "ebook" ? "Ebook" : "Livre audio"}</TableCell>
                    <TableCell>{transaction.userName}</TableCell>
                    <TableCell>{formatDate(transaction.date)}</TableCell>
                    <TableCell>{transaction.amount.toFixed(2)} €</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => handleViewTransaction(transaction)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Pagination */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              aria-disabled={currentPage === 1}
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink 
                isActive={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          {totalPages > 5 && (
            <PaginationItem>
              <span className="px-2">...</span>
            </PaginationItem>
          )}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              aria-disabled={currentPage === totalPages}
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      
      {/* Détails de la transaction */}
      {selectedTransaction && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Détails de la transaction</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p>{selectedTransaction.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{formatDate(selectedTransaction.date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Livre</p>
                  <p>{selectedTransaction.bookTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Livre</p>
                  <p>{selectedTransaction.bookId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Utilisateur</p>
                  <p>{selectedTransaction.userName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Utilisateur</p>
                  <p>{selectedTransaction.userId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p>{selectedTransaction.bookType === "ebook" ? "Ebook" : "Livre audio"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Montant</p>
                  <p className="font-semibold">{selectedTransaction.amount.toFixed(2)} €</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Fonction pour formater les dates
function formatDate(dateString) {
  const options = { year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Fix formatCurrency function
function formatCurrency(amount) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
}