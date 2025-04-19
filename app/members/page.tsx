"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Pencil, Trash2, UserPlus, Loader2, Phone, CreditCard, User } from "lucide-react";

type Member = {
  _id: string;
  memberId: string;
  fullName: string;
  phone: string;
  money: number;
  role: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://backend.nurdcells.com/api/members");
      setMembers(res.data.members);
    } catch (err) {
      console.error("Failed to fetch members", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this member?")) {
      try {
        setIsSubmitting(true);
        await axios.delete(`https://backend.nurdcells.com/api/members/${id}`);
        setMembers(prev => prev.filter(m => m._id !== id));
      } catch (err) {
        console.error("Delete failed", err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEdit = (member: Member) => {
    setEditingMember(member);
    setOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingMember) return;

    try {
      setIsSubmitting(true);
      await axios.put(`https://backend.nurdcells.com/api/members/${editingMember._id}`, {
        fullName: editingMember.fullName,
        phone: editingMember.phone,
        money: editingMember.money
      });

      await fetchMembers();
      setOpen(false);
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof Member, value: string) => {
    setEditingMember((prev) => prev ? { ...prev, [field]: field === "money" ? parseFloat(value) : value } : null);
  };

  const filteredMembers = members.filter(member => 
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.phone.includes(searchTerm)
  );

  const roleColors = {
    admin: "bg-purple-100 text-purple-800",
    member: "bg-blue-100 text-blue-800",
    guest: "bg-green-100 text-green-800",
    default: "bg-gray-100 text-gray-800"
  };

  const getRoleClass = (role: string) => {
    return roleColors[role as keyof typeof roleColors] || roleColors.default;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Member Directory</h1>
          
          <div className="flex w-full md:w-auto gap-4">
            <div className="relative w-full md:w-64">
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-8 py-2 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-2 text-gray-600">Loading members...</span>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No members found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <Card key={member._id} className="overflow-hidden border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                  <CardTitle className="text-white text-xl font-semibold truncate">{member.fullName}</CardTitle>
                  <div className="text-sm text-blue-100 font-medium">ID: {member.memberId}</div>
                </CardHeader>
                
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{member.phone}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-500" />
                    <span>₹{member.money.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    <span className={`text-sm px-2 py-1 rounded-full ${getRoleClass(member.role)}`}>
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                  </div>
                </CardContent>
                
                <CardFooter className="bg-gray-50 px-5 py-3 flex justify-end gap-2 border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(member._id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Member Details</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</label>
                <Input
                  id="fullName"
                  placeholder="Full Name"
                  value={editingMember.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
                <Input
                  id="phone"
                  placeholder="Phone"
                  value={editingMember.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="money" className="text-sm font-medium text-gray-700">Balance Amount (₹)</label>
                <Input
                  id="money"
                  placeholder="Money"
                  type="number"
                  value={editingMember.money}
                  onChange={(e) => handleChange("money", e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}
          <DialogFooter className="flex space-x-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Member
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}