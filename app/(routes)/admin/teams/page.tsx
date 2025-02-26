"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { TeamList } from "@/components/admin/TeamList";
import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users, UserRound, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ITeam } from "@/models/Team";

export default function TeamsPage() {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<ITeam[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalTeams: 0, totalMembers: 0 });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("/api/admin/teams");
        if (!response.ok) throw new Error("Failed to fetch teams");

        const data = await response.json();
        setTeams(data.teams);
        setFilteredTeams(data.teams);
        setStats({
          totalTeams: data.totalTeams,
          totalMembers: data.totalMembers,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredTeams(teams);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = teams.filter(
      (team) =>
        team.teamName.toLowerCase().includes(term) ||
        team.teamMembers.some(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (member: any) =>
            member.name.toLowerCase().includes(term) ||
            member.email.toLowerCase().includes(term)
        )
    );

    setFilteredTeams(filtered);
  }, [searchTerm, teams]);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Registered Teams
        </h1>
        <p className="text-muted-foreground">
          View and manage all registered teams for the hackathon
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
              title="Total Registered Teams"
              value={stats.totalTeams}
              icon={Users}
              iconClassName="text-emerald-500"
            />
            <StatCard
              title="Total Participants"
              value={stats.totalMembers}
              icon={UserRound}
              iconClassName="text-emerald-500"
            />
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams by name, member name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                {filteredTeams.length}{" "}
                {filteredTeams.length === 1 ? "Team" : "Teams"} Found
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TeamList teams={filteredTeams} type="registered" />
            </CardContent>
          </Card>
        </>
      )}
    </AdminLayout>
  );
}
