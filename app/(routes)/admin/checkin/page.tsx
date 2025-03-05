"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/admin/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  UserCheck,
  Users,
  Search,
  X,
  UserX,
  ClipboardCheck,
  Loader2,
  CalendarClock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

interface TeamMember {
  memberId: string;
  memberName: string;
  memberEmail: string;
  checkedIn: boolean;
  checkedInAt?: string;
}

interface Team {
  teamId: string;
  teamName: string;
  teamSize: number;
  isCheckedIn: boolean;
  checkedInAt?: string;
  members: TeamMember[];
}

export default function AdminCheckInPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const checkedInTeamsCount = teams.filter((team) => team.isCheckedIn).length;
  const totalTeamsCount = teams.length;
  const totalMembersCount = teams.reduce(
    (sum, team) => sum + team.members.length,
    0
  );
  const checkedInMembersCount = teams.reduce(
    (sum, team) =>
      sum + team.members.filter((member) => member.checkedIn).length,
    0
  );

  useEffect(() => {
    fetchCheckInData();
  }, []);

  useEffect(() => {
    if (!teams.length) {
      setFilteredTeams([]);
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredTeams(teams);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = teams.filter((team) => {
      if (team.teamName.toLowerCase().includes(searchTermLower)) {
        return true;
      }

      return team.members.some(
        (member) =>
          member.memberName.toLowerCase().includes(searchTermLower) ||
          member.memberEmail.toLowerCase().includes(searchTermLower)
      );
    });

    setFilteredTeams(filtered);
  }, [searchTerm, teams]);

  const fetchCheckInData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/checkin");

      if (!response.ok) {
        throw new Error("Failed to fetch check-in data");
      }

      const data = await response.json();
      setTeams(data.teams || []);
      setFilteredTeams(data.teams || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load check-in data");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTeamCheckIn = async (teamId: string, checkedIn: boolean) => {
    try {
      const response = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId, checkedIn }),
      });

      if (!response.ok) {
        throw new Error("Failed to update check-in status");
      }

      setTeams(
        teams.map((team) => {
          if (team.teamId === teamId) {
            return {
              ...team,
              isCheckedIn: checkedIn,
              checkedInAt: checkedIn ? new Date().toISOString() : undefined,
            };
          }
          return team;
        })
      );

      toast({
        title: "Check-in status updated",
        description: `Team ${
          checkedIn ? "checked in" : "checked out"
        } successfully`,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update check-in status",
      });
    }
  };

  const updateMemberCheckIn = async (
    teamId: string,
    memberId: string,
    checkedIn: boolean
  ) => {
    try {
      const response = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ teamId, memberId, checkedIn }),
      });

      if (!response.ok) {
        throw new Error("Failed to update member check-in status");
      }

      setTeams(
        teams.map((team) => {
          if (team.teamId === teamId) {
            return {
              ...team,
              members: team.members.map((member) => {
                if (member.memberId === memberId) {
                  return {
                    ...member,
                    checkedIn,
                    checkedInAt: checkedIn
                      ? new Date().toISOString()
                      : undefined,
                  };
                }
                return member;
              }),
            };
          }
          return team;
        })
      );

      toast({
        title: "Member check-in updated",
        description: `Team member ${
          checkedIn ? "checked in" : "checked out"
        } successfully`,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update member check-in status",
      });
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "Not checked in";
    return formatDate(dateString);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Team Check-in</h1>
        <p className="text-muted-foreground">
          Track team attendance for the in-person pitch event on March 6th at
          ISSAT Sousse
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Teams"
          value={totalTeamsCount}
          icon={Users}
          description="Teams that submitted projects"
        />
        <StatCard
          title="Teams Checked In"
          value={checkedInTeamsCount}
          icon={UserCheck}
          iconClassName="text-emerald-500"
          description={`${Math.round(
            (checkedInTeamsCount / (totalTeamsCount || 1)) * 100
          )}% attendance`}
        />
        <StatCard
          title="Total Members"
          value={totalMembersCount}
          icon={ClipboardCheck}
          description="Total expected participants"
        />
        <StatCard
          title="Members Checked In"
          value={checkedInMembersCount}
          icon={UserCheck}
          iconClassName="text-emerald-500"
          description={`${Math.round(
            (checkedInMembersCount / (totalMembersCount || 1)) * 100
          )}% attendance`}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <CalendarClock className="h-5 w-5 mr-2" />
              Check-in Status
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchCheckInData}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Refresh"
              )}
            </Button>
          </div>

          <div className="relative w-full max-w-sm mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search teams or members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTeams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {teams.length === 0
                ? "No teams have submitted projects yet"
                : "No teams match your search criteria"}
            </div>
          ) : (
            <div className="space-y-6">
              {searchTerm && (
                <div className="text-sm mb-2">
                  Found {filteredTeams.length} teams matching your search
                </div>
              )}

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Team Check-in</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.map((team) => (
                    <TableRow key={team.teamId} className="group">
                      <TableCell>
                        <div>
                          <div className="font-medium">{team.teamName}</div>
                          <div className="text-xs text-muted-foreground">
                            {team.teamSize} member{team.teamSize !== 1 && "s"}
                          </div>
                          {team.checkedInAt && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {formatDateTime(team.checkedInAt)}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-2">
                          {team.members.map((member) => (
                            <div
                              key={member.memberId}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <Checkbox
                                  id={`member-${member.memberId}`}
                                  checked={member.checkedIn}
                                  onCheckedChange={(checked) =>
                                    updateMemberCheckIn(
                                      team.teamId,
                                      member.memberId,
                                      checked === true
                                    )
                                  }
                                />
                                <label
                                  htmlFor={`member-${member.memberId}`}
                                  className="ml-2 text-sm flex items-center cursor-pointer"
                                >
                                  <span>{member.memberName}</span>
                                  {member.checkedIn ? (
                                    <Badge
                                      variant="outline"
                                      className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200"
                                    >
                                      <UserCheck className="h-3 w-3 mr-1" />
                                      Present
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="ml-2 bg-gray-50 text-gray-500 border-gray-200"
                                    >
                                      <UserX className="h-3 w-3 mr-1" />
                                      Absent
                                    </Badge>
                                  )}
                                </label>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {member.checkedIn
                                  ? formatDateTime(member.checkedInAt)
                                  : ""}
                              </span>
                            </div>
                          ))}
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            className={
                              team.isCheckedIn
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : "bg-gray-100 text-gray-800"
                            }
                          >
                            {team.isCheckedIn ? (
                              <UserCheck className="h-3 w-3 mr-1" />
                            ) : (
                              <UserX className="h-3 w-3 mr-1" />
                            )}
                            {team.isCheckedIn ? "Present" : "Not checked in"}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {team.members.filter((m) => m.checkedIn).length} of{" "}
                            {team.members.length} members present
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Button
                          variant={team.isCheckedIn ? "outline" : "default"}
                          size="sm"
                          onClick={() =>
                            updateTeamCheckIn(team.teamId, !team.isCheckedIn)
                          }
                        >
                          {team.isCheckedIn ? (
                            <>
                              <UserX className="h-4 w-4 mr-1" />
                              Uncheck
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-1" />
                              Check In
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
