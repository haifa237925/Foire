import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye, Trash2, Download, Search, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MOCK_BOOKS = Array(50).fill(0).map((_, i) => ({
  id: i + 1,
  title: `Livre ${i + 1}`,
  author: `Auteur ${i % 10 + 1}`,
  type: i % 2 === 0 ? "ebook" : "audiobook",
  publicationDate: new Date(2025, 3, 15 - i % 30).toISOString(),
  status: i % 10 === 0 ? "hidden" : i % 15 === 0 ? "flagged" : "visible",
  price: parseFloat((5 + Math.random() * 20).toFixed(2))
}));

export default function BooksManagement() {
  const [books, setBooks] = useState(MOCK_BOOKS);
  const [filteredBooks, setFilteredBooks] = useState(MOCK_BOOKS);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let results = books;
    
    if (searchTerm) {
      results = results.filter(
        book => book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (typeFilter !== "all") {
      results = results.filter(book => book.type === typeFilter);
    }
    
    if (statusFilter !== "all") {
      results = results.filter(book => book.status === statusFilter);
    }
    
    setFilteredBooks(results);
  }, [searchTerm, typeFilter, statusFilter, books]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  const handleViewBook = (book) => {
    setSelectedBook(book);
    setIsDetailsOpen(true);
  };
  
  const handleActionClick = (book, action) => {
    setSelectedBook(book);
    setActionType(action);
    setIsActionDialogOpen(true);
  };
  
  const performAction = () => {
    setIsActionDialogOpen(false);
    
    if (actionType === "delete") {
      setBooks(books.filter(book => book.id !== selectedBook.id));
      
      toast({
        title: "Livre supprimé",
        description: `"${selectedBook.title}" a été supprimé avec succès`,
      });
    } else if (actionType === "changeStatus") {
      const newStatus = selectedBook.status === "visible" ? "hidden" : "visible";
      setBooks(books.map(book => 
        book.id === selectedBook.id ? { ...book, status: newStatus } : book
      ));
      
      const actionText = newStatus === "visible" ? "rendu visible" : "masqué";
      toast({
        title: "Statut modifié",
        description: `"${selectedBook.title}" a été ${actionText} avec succès`,
      });
    } else if (actionType === "download") {
      toast({
        title: "Téléchargement initié",
        description: `"${selectedBook.title}" est en cours de téléchargement`,
      });
    } else if (actionType === "resolveFlagged") {
      setBooks(books.map(book => 
        book.id === selectedBook.id ? { ...book, status: "visible" } : book
      ));
      
      toast({
        title: "Signalement résolu",
        description: `"${selectedBook.title}" n'est plus signalé`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion des livres</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre ou auteur..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/3">
              <Select 
                value={typeFilter} 
                onValueChange={setTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
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
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="visible">Visibles</SelectItem>
                  <SelectItem value="hidden">Masqués</SelectItem>
                  <SelectItem value="flagged">Signalés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead>Auteur</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Date de publication</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    {Array(8).fill(0).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : currentItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10">
                    Aucun livre trouvé
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.id}</TableCell>
                    <TableCell>{book.title}</TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell>{book.type === "ebook" ? "Ebook" : "Livre audio"}</TableCell>
                    <TableCell>{book.price.toFixed(2)} €</TableCell>
                    <TableCell>{formatDate(book.publicationDate)}</TableCell>
                    <TableCell>
                      <StatusBadge status={book.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleViewBook(book)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleActionClick(book, "download")}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        
                        {book.status === "flagged" ? (
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleActionClick(book, "resolveFlagged")}
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </Button>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleActionClick(book, "changeStatus")}
                          >
                            {book.status === "visible" ? (
                              <XCircle className="h-4 w-4 text-amber-500" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleActionClick(book, "delete")}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
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
      
      {selectedBook && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Détails du livre</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p>{selectedBook.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Titre</p>
                  <p>{selectedBook.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Auteur</p>
                  <p>{selectedBook.author}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type</p>
                  <p>{selectedBook.type === "ebook" ? "Ebook" : "Livre audio"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prix</p>
                  <p>{selectedBook.price.toFixed(2)} €</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date de publication</p>
                  <p>{formatDate(selectedBook.publicationDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Statut</p>
                  <StatusBadge status={selectedBook.status} />
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground">Description</p>
                <p className="text-sm mt-1">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {selectedBook && (
        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer l'action</DialogTitle>
              <DialogDescription>
                {actionType === "delete" && `Êtes-vous sûr de vouloir supprimer "${selectedBook.title}" ?`}
                {actionType === "changeStatus" && `Êtes-vous sûr de vouloir ${selectedBook.status === "visible" ? "masquer" : "rendre visible"} "${selectedBook.title}" ?`}
                {actionType === "download" && `Télécharger "${selectedBook.title}" ?`}
                {actionType === "resolveFlagged" && `Résoudre le signalement pour "${selectedBook.title}" ?`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={performAction}>
                Confirmer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  switch (status) {
    case "visible":
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
          Visible
        </span>
      );
    case "hidden":
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
          Masqué
        </span>
      );
    case "flagged":
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Signalé
        </span>
      );
    default:
      return null;
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' } as Intl.DateTimeFormatOptions;
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}