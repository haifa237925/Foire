
import { useState, useEffect } from "react";
import { UsersFilters } from "@/components/admin/users/UsersFilters";
import { UsersTable } from "@/components/admin/users/UsersTable";
import { UsersPagination } from "@/components/admin/users/UsersPagination";
import { UserDetailsDialog } from "@/components/admin/users/UserDetailsDialog";
import { UserActionDialog } from "@/components/admin/users/UserActionDialog";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/user.ts";

const MOCK_USERS: User[] = Array(50).fill(0).map((_, i) => ({
  id: i + 1,
  name: `Utilisateur ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 3 === 0 ? "writer" : "reader",
  registrationDate: new Date(2025, 3, 15 - i % 30).toISOString(),
  status: i % 10 === 0 ? "banned" : "active"
}));

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
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

  const handleFiltersChange = ({ searchTerm, roleFilter, statusFilter }) => {
    let results = users;
    
    if (searchTerm) {
      results = results.filter(
        user => user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter !== "all") {
      results = results.filter(user => user.role === roleFilter);
    }
    
    if (statusFilter !== "all") {
      results = results.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(results);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };
  
  const handleActionClick = (user: User, action: string) => {
    setSelectedUser(user);
    setActionType(action);
    setIsActionDialogOpen(true);
  };
  
  const performAction = () => {
    setIsActionDialogOpen(false);
    
    if (actionType === "ban" && selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, status: "banned" } : user
      ));
      
      toast({
        title: "Utilisateur banni",
        description: `${selectedUser.name} a été banni avec succès`,
      });
    } else if (actionType === "activate" && selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, status: "active" } : user
      ));
      
      toast({
        title: "Utilisateur activé",
        description: `${selectedUser.name} a été activé avec succès`,
      });
    } else if (actionType === "changeRole" && selectedUser) {
      const newRole = selectedUser.role === "reader" ? "writer" : "reader";
      setUsers(users.map(user => 
        user.id === selectedUser.id ? { ...user, role: newRole } : user
      ));
      
      toast({
        title: "Rôle modifié",
        description: `${selectedUser.name} est maintenant un ${newRole === "writer" ? "écrivain" : "lecteur"}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion des utilisateurs</h1>
      
      <UsersFilters onFilterChange={handleFiltersChange} />
      
      <UsersTable 
        users={currentItems} 
        isLoading={isLoading} 
        onViewUser={handleViewUser}
        onActionClick={handleActionClick}
      />
      
      <UsersPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
      <UserDetailsDialog 
        user={selectedUser}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
      
      <UserActionDialog
        user={selectedUser}
        open={isActionDialogOpen}
        actionType={actionType}
        onOpenChange={setIsActionDialogOpen}
        onAction={performAction}
      />
    </div>
  );
}
