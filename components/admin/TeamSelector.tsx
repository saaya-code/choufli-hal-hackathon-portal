/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, CheckSquare, Square, Users } from "lucide-react";

type TeamSelectorProps = {
  type: "registered" | "waitlist";
  onTeamsSelected: (teamIds: string[]) => void;
};

export function TeamSelector({ type, onTeamsSelected }: TeamSelectorProps) {
  const [teams, setTeams] = useState<any[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<any[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const endpoint =
          type === "registered" ? "/api/admin/teams" : "/api/admin/waitlist";
        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`Failed to fetch ${type} teams`);
        }

        const data = await response.json();
        const fetchedTeams =
          type === "registered" ? data.teams : data.waitlistedTeams;

        setTeams(fetchedTeams || []);
        setFilteredTeams(fetchedTeams || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [type]);

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
          (member: any) =>
            member.name?.toLowerCase().includes(term) ||
            member.email?.toLowerCase().includes(term)
        )
    );

    setFilteredTeams(filtered);
  }, [searchTerm, teams]);

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTeams.length === filteredTeams.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(filteredTeams.map((team) => team._id));
    }
  };

  useEffect(() => {
    onTeamsSelected(selectedTeams);
  }, [selectedTeams, onTeamsSelected]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-full" />
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-destructive text-center p-4">Error: {error}</div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search teams..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex items-center justify-between mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          className="text-xs"
        >
          {selectedTeams.length === filteredTeams.length ? (
            <>
              <Square className="h-4 w-4 mr-1" /> Deselect All
            </>
          ) : (
            <>
              <CheckSquare className="h-4 w-4 mr-1" /> Select All
            </>
          )}
        </Button>

        <Badge variant="outline" className="ml-2">
          <Users className="h-3 w-3 mr-1" />
          {selectedTeams.length} selected
        </Badge>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-2">
          {filteredTeams.length === 0 ? (
            <div className="text-center p-4 text-muted-foreground">
              No teams found
            </div>
          ) : (
            filteredTeams.map((team) => (
              <div
                key={team._id}
                className={`flex items-start space-x-2 p-3 rounded-lg border ${
                  selectedTeams.includes(team._id)
                    ? "bg-primary/5 border-primary/20"
                    : "bg-card border-border hover:bg-accent/5"
                }`}
              >
                <Checkbox
                  id={team._id}
                  checked={selectedTeams.includes(team._id)}
                  onCheckedChange={() => handleTeamSelect(team._id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={team._id}
                    className="font-medium cursor-pointer block"
                  >
                    {team.teamName}
                  </Label>
                  <div className="text-xs text-muted-foreground mt-1">
                    {team.teamMembers.length} members |{" "}
                    {team.teamMembers.map((m: any) => m.email).join(", ")}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
