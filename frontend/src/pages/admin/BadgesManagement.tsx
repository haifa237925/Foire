
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Award, PlusCircle, Pencil, Trash2, Search, Users, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MOCK_BADGES = [
  { id: 1, name: "Top Writer", description: "Écrivains avec une note moyenne supérieure à 4.5", icon: "star", color: "gold", type: "writer" },
  { id: 2, name: "Verified", description: "Écrivain vérifié par la plateforme", icon: "check-circle", color: "blue", type: "writer" },
  { id: 3, name: "Rising Star", description: "Nouvel écrivain avec croissance rapide", icon: "trending-up", color: "purple", type: "writer" },
  { id: 4, name: "Premium", description: "Lecteur avec un abonnement premium", icon: "crown", color: "amber", type: "reader" },
  { id: 5, name: "Book Worm", description: "Lecteur avec plus de 50 livres achetés", icon: "book", color: "green", type: "reader" },
  { id: 6, name: "Beta Reader", description: "Lecteur qui participe aux tests bêta", icon: "flag", color: "red", type: "reader" },
];

const MOCK_BADGE_ASSIGNMENTS = Array(25).fill(0).map((_, i) => {
  const badgeId = (i % 6) + 1;
  const badge = MOCK_BADGES.find(b => b.id === badgeId);
  const userType = badge.type;
  
  return {
    id: i + 1,
    badgeId,
    badgeName: badge.name,
    userId: i % 10 + 1,
    userName: `${userType === "writer" ? "Écrivain" : "Lecteur"} ${i % 10 + 1}`,
    userType,
    assignedDate: new Date(2025, 3, 15 - i % 30).toISOString(),
  };
});

export default function BadgesManagement() {
  const [badges, setBadges] = useState(MOCK_BADGES);
  const [badgeAssignments, setBadgeAssignments] = useState(MOCK_BADGE_ASSIGNMENTS);
  const [isLoading, setIsLoading] = useState(true);
  
  const [badgesPage, setBadgesPage] = useState(1);
  const [badgeSearch, setBadgeSearch] = useState("");
  const [filteredBadges, setFilteredBadges] = useState(badges);
  
  const [assignmentsPage, setAssignmentsPage] = useState(1);
  const [assignmentSearch, setAssignmentSearch] = useState("");
  const [filteredAssignments, setFilteredAssignments] = useState(badgeAssignments);
  
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [isBadgeDialogOpen, setIsBadgeDialogOpen] = useState(false);
  const [badgeFormMode, setBadgeFormMode] = useState("add");
  
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  
  const [badgeForm, setBadgeForm] = useState({
    name: "",
    description: "",
    icon: "star",
    color: "blue",
    type: "writer"
  });
  
  const itemsPerPage = 10;
  
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let results = badges;
    
    if (badgeSearch) {
      results = results.filter(
        badge => badge.name.toLowerCase().includes(badgeSearch.toLowerCase()) || 
                 badge.description.toLowerCase().includes(badgeSearch.toLowerCase())
      );
    }
    
    setFilteredBadges(results);
  }, [badgeSearch, badges]);

  useEffect(() => {
    let results = badgeAssignments;
    
    if (assignmentSearch) {
      results = results.filter(
        assignment => assignment.userName.toLowerCase().includes(assignmentSearch.toLowerCase()) || 
                      assignment.badgeName.toLowerCase().includes(assignmentSearch.toLowerCase())
      );
    }
    
    setFilteredAssignments(results);
  }, [assignmentSearch, badgeAssignments]);

  const badgeItems = filteredBadges.slice((badgesPage - 1) * itemsPerPage, badgesPage * itemsPerPage);
  const badgesTotalPages = Math.ceil(filteredBadges.length / itemsPerPage);

  const assignmentItems = filteredAssignments.slice((assignmentsPage - 1) * itemsPerPage, assignmentsPage * itemsPerPage);
  const assignmentsTotalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

  const handleAddBadge = () => {
    setBadgeForm({
      name: "",
      description: "",
      icon: "star",
      color: "blue",
      type: "writer"
    });
    setBadgeFormMode("add");
    setIsBadgeDialogOpen(true);
  };

  const handleEditBadge = (badge) => {
    setSelectedBadge(badge);
    setBadgeForm({
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      color: badge.color,
      type: badge.type
    });
    setBadgeFormMode("edit");
    setIsBadgeDialogOpen(true);
  };
  
  const handleDeleteBadge = (badge) => {
    setSelectedBadge(badge);
    setActionType("deleteBadge");
    setIsActionDialogOpen(true);
  };

  const saveBadge = () => {
    setIsBadgeDialogOpen(false);
    
    if (badgeFormMode === "add") {
      const newBadge = {
        id: Math.max(...badges.map(b => b.id)) + 1,
        ...badgeForm
      };
      
      setBadges([...badges, newBadge]);
      
      toast({
        title: "Badge créé",
        description: `Le badge "${badgeForm.name}" a été créé avec succès`,
      });
    } else {
      setBadges(badges.map(b => 
        b.id === selectedBadge.id ? { ...b, ...badgeForm } : b
      ));
      
      toast({
        title: "Badge mis à jour",
        description: `Le badge "${badgeForm.name}" a été mis à jour avec succès`,
      });
    }
  };

  const handleViewAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setIsAssignmentDialogOpen(true);
  };
  
  const handleDeleteAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setActionType("deleteAssignment");
    setIsActionDialogOpen(true);
  };

  const performAction = () => {
    setIsActionDialogOpen(false);
    
    if (actionType === "deleteBadge") {
      setBadges(badges.filter(b => b.id !== selectedBadge.id));
      setBadgeAssignments(badgeAssignments.filter(a => a.badgeId !== selectedBadge.id));
      
      toast({
        title: "Badge supprimé",
        description: `Le badge "${selectedBadge.name}" a été supprimé avec succès`,
      });
    } else if (actionType === "deleteAssignment") {
      setBadgeAssignments(badgeAssignments.filter(a => a.id !== selectedAssignment.id));
      
      toast({
        title: "Attribution supprimée",
        description: `L'attribution du badge "${selectedAssignment.badgeName}" à "${selectedAssignment.userName}" a été supprimée`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion des badges</h1>
      
      <Tabs defaultValue="badges">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="badges">
            <Award className="h-4 w-4 mr-2" />
            Badges
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <Users className="h-4 w-4 mr-2" />
            Attributions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="badges" className="space-y-6 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Liste des badges</CardTitle>
              <Button onClick={handleAddBadge}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nouveau badge
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <div className="relative w-full md:w-1/2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un badge..."
                    className="pl-8"
                    value={badgeSearch}
                    onChange={(e) => setBadgeSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        {Array(5).fill(0).map((_, j) => (
                          <TableCell key={j}>
                            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : badgeItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        Aucun badge trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    badgeItems.map((badge) => (
                      <TableRow key={badge.id}>
                        <TableCell>{badge.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`p-1 rounded-full bg-${badge.color}-100`}>
                              <Award className={`h-4 w-4 text-${badge.color}-500`} />
                            </span>
                            {badge.name}
                          </div>
                        </TableCell>
                        <TableCell>{badge.description}</TableCell>
                        <TableCell>
                          {badge.type === "writer" ? "Écrivain" : "Lecteur"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleEditBadge(badge)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteBadge(badge)}
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
              
              {badgesTotalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setBadgesPage(prev => Math.max(prev - 1, 1))}
                          aria-disabled={badgesPage === 1}
                          className={badgesPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, badgesTotalPages) }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            isActive={badgesPage === i + 1}
                            onClick={() => setBadgesPage(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setBadgesPage(prev => Math.min(prev + 1, badgesTotalPages))}
                          aria-disabled={badgesPage === badgesTotalPages}
                          className={badgesPage === badgesTotalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Attributions des badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <div className="relative w-full md:w-1/2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une attribution..."
                    className="pl-8"
                    value={assignmentSearch}
                    onChange={(e) => setAssignmentSearch(e.target.value)}
                  />
                </div>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Badge</TableHead>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date d'attribution</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        {Array(5).fill(0).map((_, j) => (
                          <TableCell key={j}>
                            <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : assignmentItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-10">
                        Aucune attribution trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    assignmentItems.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>{assignment.badgeName}</TableCell>
                        <TableCell>{assignment.userName}</TableCell>
                        <TableCell>
                          {assignment.userType === "writer" ? "Écrivain" : "Lecteur"}
                        </TableCell>
                        <TableCell>{formatDate(assignment.assignedDate)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleViewAssignment(assignment)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteAssignment(assignment)}
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
              
              {assignmentsTotalPages > 1 && (
                <div className="mt-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => setAssignmentsPage(prev => Math.max(prev - 1, 1))}
                          aria-disabled={assignmentsPage === 1}
                          className={assignmentsPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: Math.min(5, assignmentsTotalPages) }).map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink 
                            isActive={assignmentsPage === i + 1}
                            onClick={() => setAssignmentsPage(i + 1)}
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => setAssignmentsPage(prev => Math.min(prev + 1, assignmentsTotalPages))}
                          aria-disabled={assignmentsPage === assignmentsTotalPages}
                          className={assignmentsPage === assignmentsTotalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={isBadgeDialogOpen} onOpenChange={setIsBadgeDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {badgeFormMode === "add" ? "Ajouter un nouveau badge" : "Modifier le badge"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="badge-name">Nom du badge</label>
              <Input
                id="badge-name"
                value={badgeForm.name}
                onChange={(e) => setBadgeForm({ ...badgeForm, name: e.target.value })}
                placeholder="Ex: Top Writer"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="badge-description">Description</label>
              <Input
                id="badge-description"
                value={badgeForm.description}
                onChange={(e) => setBadgeForm({ ...badgeForm, description: e.target.value })}
                placeholder="Ex: Écrivains avec une note moyenne supérieure à 4.5"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="badge-color">Couleur</label>
                <select
                  id="badge-color"
                  value={badgeForm.color}
                  onChange={(e) => setBadgeForm({ ...badgeForm, color: e.target.value })}
                  className="w-full rounded-md border p-2"
                >
                  <option value="blue">Bleu</option>
                  <option value="green">Vert</option>
                  <option value="red">Rouge</option>
                  <option value="purple">Violet</option>
                  <option value="amber">Ambre</option>
                  <option value="gold">Or</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="badge-type">Type d'utilisateur</label>
                <select
                  id="badge-type"
                  value={badgeForm.type}
                  onChange={(e) => setBadgeForm({ ...badgeForm, type: e.target.value })}
                  className="w-full rounded-md border p-2"
                >
                  <option value="writer">Écrivain</option>
                  <option value="reader">Lecteur</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBadgeDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={saveBadge} disabled={!badgeForm.name.trim()}>
              {badgeFormMode === "add" ? "Ajouter" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {selectedAssignment && (
        <Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Détails de l'attribution</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p>{selectedAssignment.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date d'attribution</p>
                  <p>{formatDate(selectedAssignment.assignedDate)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Badge</p>
                  <p>{selectedAssignment.badgeName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Badge</p>
                  <p>{selectedAssignment.badgeId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Utilisateur</p>
                  <p>{selectedAssignment.userName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID Utilisateur</p>
                  <p>{selectedAssignment.userId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Type d'utilisateur</p>
                  <p>{selectedAssignment.userType === "writer" ? "Écrivain" : "Lecteur"}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer l'action</DialogTitle>
            <DialogDescription>
              {actionType === "deleteBadge" && `Êtes-vous sûr de vouloir supprimer le badge "${selectedBadge?.name}" ?`}
              {actionType === "deleteAssignment" && `Êtes-vous sûr de vouloir supprimer l'attribution du badge "${selectedAssignment?.badgeName}" à "${selectedAssignment?.userName}" ?`}
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
    </div>
  );
}

function formatDate(dateString) {
  const options = { year: 'numeric' as const, month: 'long' as const, day: 'numeric' as const };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}
