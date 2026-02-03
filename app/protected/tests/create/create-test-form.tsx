"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { addTestResult } from "@/lib/admin/actions";
import { FileUp } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";

interface UserOption {
  id: string;
  name: string;
}

interface TypeOption {
  id: any;
  title?: string;
  name?: string;
}

export function CreateTestForm({
  users,
  types,
}: {
  users: UserOption[];
  types: TypeOption[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    user_id: "",
    type_id: "",
    cost: "",
    notes: "",
    createdAt: new Date().toISOString().slice(0, 16), // Format for datetime-local
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's a PDF
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed");
        setPdfFile(null);
        e.target.value = "";
        return;
      }
      setError("");
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.user_id) {
      setError("Please select a user");
      setLoading(false);
      return;
    }

    if (!pdfFile) {
      setError("Please select a PDF file");
      setLoading(false);
      return;
    }

    const cost = parseFloat(formData.cost);

    if (isNaN(cost)) {
      setError("Please enter a valid cost");
      setLoading(false);
      return;
    }

    const result = await addTestResult({
      user_id: formData.user_id,
      type_id: formData.type_id,
      cost,
      notes: formData.notes,
      createdAt: new Date(formData.createdAt).toISOString(),
      pdfFile,
    });

    if (result.success) {
      router.push("/protected/tests");
    } else {
      setError(result.error || "Failed to create test");
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Add Test Result</CardTitle>
        <CardDescription>Upload a test result PDF for a user</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            <Select
              value={formData.user_id}
              onValueChange={(val) => handleChange("user_id", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name || "Unnamed User"} ({user.id.slice(0, 6)}...)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type_id">Test Type</Label>
            <Select
              value={formData.type_id}
              onValueChange={(val) => handleChange("type_id", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => {
                  const label = type.name || type.title || "Unnamed Type";
                  return (
                    <SelectItem
                      key={type.id?.toString()}
                      value={type.id?.toString()}
                    >
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              placeholder="100.00"
              value={formData.cost}
              onChange={(e) => handleChange("cost", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this test..."
              value={formData.notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleChange("notes", e.target.value)
              }
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="createdAt">Date & Time</Label>
            <Input
              id="createdAt"
              type="datetime-local"
              value={formData.createdAt}
              onChange={(e) => handleChange("createdAt", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf">PDF File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="pdf"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                required
                className="cursor-pointer"
              />
              {pdfFile && <FileUp className="h-5 w-5 text-green-600" />}
            </div>
            {pdfFile && (
              <p className="text-sm text-muted-foreground">
                Selected: {pdfFile.name} ({(pdfFile.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/protected/admin/tests">Cancel</Link>
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Test Result"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
