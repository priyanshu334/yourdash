"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

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

  const fetchMembers = async () => {
    try {
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
        await axios.delete(`https://backend.nurdcells.com/api/members/${id}`);
        setMembers(prev => prev.filter(m => m._id !== id));
      } catch (err) {
        console.error("Delete failed", err);
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
      await axios.put(`https://backend.nurdcells.com/api/members/${editingMember._id}`, {
        fullName: editingMember.fullName,
        phone: editingMember.phone,
        money: editingMember.money
      });

      await fetchMembers();
      setOpen(false);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleChange = (field: keyof Member, value: string) => {
    setEditingMember((prev) => prev ? { ...prev, [field]: field === "money" ? parseFloat(value) : value } : null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">All Members</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member._id} className="shadow-md hover:shadow-xl transition-all border-0">
              <CardHeader className="bg-blue-500 rounded-t-lg p-4">
                <CardTitle className="text-white text-lg">{member.fullName}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4">
                <p><span className="font-semibold text-gray-700">ID:</span> {member.memberId}</p>
                <p><span className="font-semibold text-gray-700">Phone:</span> {member.phone}</p>
                <p><span className="font-semibold text-gray-700">Money:</span> ₹{member.money}</p>
                <p><span className="font-semibold text-gray-700">Role:</span> {member.role}</p>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={() => handleEdit(member)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDelete(member._id)}>Delete</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <div className="space-y-4">
              <Input
                placeholder="Full Name"
                value={editingMember.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
              />
              <Input
                placeholder="Phone"
                value={editingMember.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
              <Input
                placeholder="Money"
                type="number"
                value={editingMember.money}
                onChange={(e) => handleChange("money", e.target.value)}
              />
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
