
import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Eye, AlertTriangle, CheckCircle2, XCircle, SendHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/input";

const REPORT_REASONS = [
  "Contenu inapproprié",
  "Violation des droits d'auteur",
  "Contenu offensant",
  "Contenu trompeur",
  "Autre"
];

const MOCK_REPORTS = Array(30).fill(0).map((_, i) => ({
  id: i + 1,
  bookId: i % 15 + 1,
  bookTitle: `Livre ${i % 15 + 1}`,
  reportedBy: `Utilisateur ${i % 10 + 1}`,
  date: new Date(2025, 3, 15 - i % 30).toISOString(),
  reason: REPORT_REASONS[i % REPORT_REASONS.length],
  description: `Description du signalement ${i + 1}. Ceci est un exemple de description plus détaillée fournie par l'utilisateur qui a signalé le contenu.`,
  status: i % 3 === 0 ? "resolved" : "pending"
}));

export default function ReportsManagement() {
  const [reports, setReports] = useState(MOCK_REPORTS);
  const [filteredReports, setFilteredReports] = useState(MOCK_REPORTS);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("pending");
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [messageToAuthor, setMessageToAuthor] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let results = reports;
    
    if (statusFilter !== "all") {
      results = results.filter(r => r.status === statusFilter);
    }
    
    setFilteredReports(results);
  }, [statusFilter, reports]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setIsDetailsOpen(true);
  };
  
  const handleActionClick = (report, action) => {
    setSelectedReport(report);
    setActionType(action);
    setMessageToAuthor("");
    setIsActionDialogOpen(true);
  };
  
  const performAction = () => {
    setIsActionDialogOpen(false);
    
    if (actionType === "hideBook") {
      setReports(reports.map(r => 
        r.id === selectedReport.id ? { ...r, status: "resolved" } : r
      ));
      
      toast({
        title: "Livre masqué",
        description: `"${selectedReport.bookTitle}" a été masqué et le signalement a été résolu`,
      });
    } else if (actionType === "dismiss") {
      setReports(reports.map(r => 
        r.id === selectedReport.id ? { ...r, status: "resolved" } : r
      ));
      
      toast({
        title: "Signalement ignoré",
        description: `Le signalement de "${selectedReport.bookTitle}" a été ignoré`,
      });
    } else if (actionType === "sendWarning") {
      setReports(reports.map(r => 
        r.id === selectedReport.id ? { ...r, status: "resolved" } : r
      ));
      
      toast({
        title: "Avertissement envoyé",
        description: `Un avertissement a été envoyé à l'auteur de "${selectedReport.bookTitle}"`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion des signalements</h1>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Signalements</CardTitle>
          <div className="flex gap-2">
            <Button variant={statusFilter === "pending" ? "default" : "outline"} onClick={() => setStatusFilter("pending")}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              En attente
            </Button>
            <Button variant={statusFilter === "resolved" ? "default" : "outline"} onClick={() => setStatusFilter("resolved")}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Résolus
            </Button>
            <Button variant={statusFilter === "all" ? "default" : "outline"} onClick={() => setStatusFilter("all")}>
              Tous
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Livre</TableHead>
                <TableHead>Signalé par</TableHead>
                <TableHead>Raison</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Statut</TableHead>
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
                    Aucun signalement trouvé
                  </TableCell>
                </TableRow>
              ) : (
                currentItems.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.id}</TableCell>
                    <TableCell>{report.bookTitle}</TableCell>
                    <TableCell>{report.reportedBy}</TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>{formatDate(report.date)}</TableCell>
                    <TableCell>
                      <StatusBadge status={report.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => handleViewReport(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {report.status === "pending" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleActionClick(report, "hideBook")}
                              title="Masquer le livre"
                            >
                              <XCircle className="h-4 w-4 text-red-500" />
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleActionClick(report, "dismiss")}
                              title="Ignorer le signalement"
                            >
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleActionClick(report, "sendWarning")}
                              title="Envoyer un avertissement"
                            >
                              <SendHorizontal className="h-4 w-4 text-amber-500" />
                            </Button>
                          </>
                        )}
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
      
      {selectedReport && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Détails du signalement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p>{selectedReport.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date</p>
                  <p>{formatDate(selectedReport.date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Livre</p>
                  <p>{selectedReport.bookTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Livre</p>
                  <p>{selectedReport.bookId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Signalé par</p>
                  <p>{selectedReport.reportedBy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Raison</p>
                  <p>{selectedReport.reason}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm mt-1">{selectedReport.description}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Statut</p>
                  <StatusBadge status={selectedReport.status} />
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {selectedReport && (
        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "hideBook" && "Masquer le livre"}
                {actionType === "dismiss" && "Ignorer le signalement"}
                {actionType === "sendWarning" && "Envoyer un avertissement"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "hideBook" && `Êtes-vous sûr de vouloir masquer "${selectedReport.bookTitle}" ? Le livre ne sera plus visible pour les utilisateurs.`}
                {actionType === "dismiss" && `Êtes-vous sûr de vouloir ignorer ce signalement ? Aucune action ne sera prise sur "${selectedReport.bookTitle}".`}
                {actionType === "sendWarning" && `Envoyer un avertissement à l'auteur de "${selectedReport.bookTitle}" concernant ce signalement.`}
              </DialogDescription>
            </DialogHeader>
            
            {actionType === "sendWarning" && (
              <div className="py-4">
                <label className="block text-sm font-medium mb-2" htmlFor="warning-message">
                  Message à l'auteur
                </label>
                <Textarea
                  id="warning-message"
                  placeholder="Écrivez votre message d'avertissement ici..."
                  value={messageToAuthor}
                  onChange={(e) => setMessageToAuthor(e.target.value)}
                  rows={4}
                />
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={performAction} disabled={actionType === "sendWarning" && !messageToAuthor.trim()}>
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
    case "pending":
      return (
        <span className="px-2 py-1 rounded-full text-xs flex items-center gap-1 bg-amber-100 text-amber-800">
          <AlertTriangle className="h-3 w-3" />
          En attente
        </span>
      );
    case "resolved":
      return (
        <span className="px-2 py-1 rounded-full text-xs flex items-center gap-1 bg-green-100 text-green-800">
          <CheckCircle2 className="h-3 w-3" />
          Résolu
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