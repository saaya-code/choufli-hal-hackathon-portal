"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { EmailComposer } from "@/components/admin/EmailComposer";
import { TeamSelector } from "@/components/admin/TeamSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Users, Info, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminEmailPage() {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [emailStatus, setEmailStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const { toast } = useToast();

  const handleTeamsSelected = (teamIds: string[]) => {
    setSelectedTeams(teamIds);
    if (teamIds.length > 0) {
      toast({
        title: `${teamIds.length} teams selected`,
        description: "Recipients updated for your email",
      });
    } else {
      toast({
        variant: "destructive",
        title: "No teams selected",
        description: "Please select at least one team to send an email",
      });
    }
  };

  const handleEmailSent = (success: boolean, message: string) => {
    setEmailStatus({ success, message });
    toast({
      variant: success ? "default" : "destructive",
      title: success ? "Email sent successfully" : "Failed to send email",
      description: message,
    });
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Email Management
        </h1>
        <p className="text-muted-foreground">
          Send communications to hackathon participants
        </p>
      </div>

      {emailStatus && (
        <Alert
          variant={emailStatus.success ? "default" : "destructive"}
          className={`mb-6 ${
            emailStatus.success
              ? "bg-primary/10 border-primary/20"
              : "bg-destructive/10 border-destructive/20"
          }`}
        >
          {emailStatus.success ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <Info className="h-4 w-4" />
          )}
          <AlertTitle>{emailStatus.success ? "Success!" : "Error"}</AlertTitle>
          <AlertDescription>{emailStatus.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Select Recipients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="registered">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="registered">Registered</TabsTrigger>
                  <TabsTrigger value="waitlist">Waitlisted</TabsTrigger>
                </TabsList>
                <TabsContent value="registered">
                  <TeamSelector
                    type="registered"
                    onTeamsSelected={handleTeamsSelected}
                  />
                </TabsContent>
                <TabsContent value="waitlist">
                  <TeamSelector
                    type="waitlist"
                    onTeamsSelected={handleTeamsSelected}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Compose Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmailComposer
                selectedTeams={selectedTeams}
                onEmailSent={handleEmailSent}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
