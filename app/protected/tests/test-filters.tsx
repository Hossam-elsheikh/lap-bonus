"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";

interface UserOption {
  id: string;
  name: string;
}

export function TestFilters({ users }: { users: UserOption[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [testName, setTestName] = useState(searchParams.get("test_name") || "");
  const [userId, setUserId] = useState(searchParams.get("user_id") || "all");
  const [date, setDate] = useState(searchParams.get("date") || "");

  // Update filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    if (testName) params.set("test_name", testName);
    else params.delete("test_name");

    if (userId && userId !== "all") params.set("user_id", userId);
    else params.delete("user_id");

    if (date) params.set("date", date);
    else params.delete("date");

    // Reset page to 1 on filter change
    params.set("page", "1");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    setTestName("");
    setUserId("all");
    setDate("");
    router.push(pathname);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-muted/30 rounded-lg border">
      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium">Test Name</label>
        <Input
          placeholder="Filter by test name..."
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
        />
      </div>

      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium">User</label>
        <Select
          value={userId}
          onValueChange={(val) => {
            setUserId(val);
            // Optional: Auto-apply on select
            // const params = new URLSearchParams(searchParams);
            // if (val !== "all") params.set("user_id", val);
            // else params.delete("user_id");
            // router.push(`${pathname}?${params.toString()}`);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select user" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name || "Unnamed User"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-2">
        <label className="text-sm font-medium">Date</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="flex items-end gap-2">
        <Button onClick={applyFilters}>Apply</Button>
        <Button
          variant="outline"
          size="icon"
          onClick={clearFilters}
          title="Clear filters"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
