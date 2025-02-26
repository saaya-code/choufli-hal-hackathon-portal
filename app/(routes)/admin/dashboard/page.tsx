"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard } from "@/components/admin/StatCard";
import { TeamList } from "@/components/admin/TeamList";
import {
  Users,
  UserRound,
  UsersRound,
  ClipboardList,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard");
        if (!response.ok) throw new Error("Failed to fetch dashboard data");

        const data = await response.json();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {session?.user?.name || "Admin"}! Here&apos;s an overview of
          the hackathon registration status.
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-12 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="bg-destructive/10 p-4 rounded-md text-destructive">
          {error}
        </div>
      ) : dashboardData ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Total Teams"
              value={dashboardData.totalTeams}
              icon={Users}
              description="Combined registered and waitlisted"
            />
            <StatCard
              title="Registered Teams"
              value={dashboardData.registeredTeams.count}
              icon={UsersRound}
              iconClassName="text-emerald-500"
            />
            <StatCard
              title="Total Participants"
              value={dashboardData.totalMembers}
              icon={UserRound}
            />
            <StatCard
              title="Waitlisted Teams"
              value={dashboardData.waitlistedTeams.count}
              icon={Clock}
              iconClassName="text-amber-500"
            />
          </div>

          <Tabs defaultValue="recent" className="mb-6">
            <TabsList>
              <TabsTrigger value="recent">Recent Registrations</TabsTrigger>
              <TabsTrigger value="waitlist">Recent Waitlist</TabsTrigger>
            </TabsList>
            <TabsContent value="recent">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ClipboardList className="h-5 w-5 mr-2" />
                    Latest Registered Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TeamList
                    teams={dashboardData.registeredTeams.recent}
                    type="registered"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="waitlist">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Latest Waitlisted Teams
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TeamList
                    teams={dashboardData.waitlistedTeams.recent}
                    type="waitlist"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </AdminLayout>
  );
}
