"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TeamList } from "@/components/admin/TeamList";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Clock, UserRound, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { IWaitlist } from "@/models/WaitlistTeam";

export default function WaitlistPage() {
  const [waitlistedTeams, setWaitlistedTeams] = useState<IWaitlist[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<IWaitlist[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalWaitlistedTeams: 0,
    totalWaitlistMembers: 0,
  });

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        const response = await fetch("/api/admin/waitlist");
        if (!response.ok) throw new Error("Failed to fetch waitlisted teams");

        const data = await response.json();
        setWaitlistedTeams(data.waitlistedTeams);
        setFilteredTeams(data.waitlistedTeams);
        setStats({
          totalWaitlistedTeams: data.totalWaitlistedTeams,
          totalWaitlistMembers: data.totalWaitlistMembers,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWaitlist();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTeams(waitlistedTeams);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = waitlistedTeams.filter(
      (team) =>
        team.teamName.toLowerCase().includes(term) ||
        team.teamMembers.some(
          (member) =>
            member.name.toLowerCase().includes(term) ||
            member.email.toLowerCase().includes(term)
        )
    );

    setFilteredTeams(filtered);
  }, [searchTerm, waitlistedTeams]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Waitlisted Teams
        </h1>
        <p className="text-muted-foreground">
          View all teams on the waitlist for the hackathon
        </p>
      </div>

      {isLoading ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
          </div>
          <Skeleton className="h-12 mb-6" />
          <Skeleton className="h-[400px]" />
        </>
      ) : error ? (
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          {error}
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <StatCard
              title="Waitlisted Teams"
              value={stats.totalWaitlistedTeams}
              icon={Clock}
              iconClassName="text-amber-500"
            />
            <StatCard
              title="Waitlist Participants"
              value={stats.totalWaitlistMembers}
              icon={UserRound}
              iconClassName="text-amber-500"
            />
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search waitlisted teams by name, member name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                {filteredTeams.length}{" "}
                {filteredTeams.length === 1 ? "Team" : "Teams"} on Waitlist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TeamList teams={filteredTeams} type="waitlist" />
            </CardContent>
          </Card>
        </>
      )}
    </AdminLayout>
  );
}
