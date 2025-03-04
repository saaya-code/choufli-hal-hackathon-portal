import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ITeam } from "@/models/Team";
import { IWaitlist } from "@/models/WaitlistTeam";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TeamListProps {
  teams: Array<ITeam | IWaitlist>;
  type: "registered" | "waitlist";
  setFilteredTeams?: (teams: Array<ITeam | IWaitlist>) => void;
}

export function TeamList({ teams, type }: TeamListProps) {
  const acceptTeam = async (teamId: string) => {
    try {
      const response = await fetch(`/api/admin/waitlist/${teamId}`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Failed to accept team");
      window.location.reload();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err?.message);
    }
    alert('Team accepted successfully');
  };
  if (!teams || teams.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No teams found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Team Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Experience</TableHead>
            <TableHead>Members</TableHead>
            {type === "waitlist" && <TableHead>Registered At</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.map((team, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{team.teamName}</TableCell>
              <TableCell>{team.teamSize}</TableCell>
              <TableCell>{team.experience}</TableCell>
              <TableCell>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="members">
                    <AccordionTrigger className="py-1 text-sm">
                      <Badge variant="secondary">
                        {team.teamMembers.length} members
                      </Badge>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2 text-sm">
                        {team.teamMembers.map((member, i) => (
                          <div key={i} className="p-2 bg-accent/5 rounded-md">
                            <p className="font-medium">{member.name}</p>
                            <div className="text-xs text-muted-foreground flex flex-col gap-1">
                              <span>Email: {member.email}</span>
                              <span>Phone: {member.phone}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TableCell>
              {type === "waitlist" && "registeredAt" in team && (
                <>
                  <TableCell>{formatDate(team.registeredAt)}</TableCell>
                  <TableCell>
                    <Button
                      size="lg"
                      className="bg-primary text-white hover:bg-primary/90"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to accept this team?')) {
                          acceptTeam(team._id as string);
                        }
                      }}
                    >
                      Accept Team
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
