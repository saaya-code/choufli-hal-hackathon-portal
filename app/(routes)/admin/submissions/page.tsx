"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SubmissionControl } from "@/components/admin/SubmissionControl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  ExternalLink,
  FileCheck,
  Loader2,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { Input } from "@/components/ui/input";

export default function AdminSubmissionsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [submissions, setSubmissions] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([]);
  const [submissionsCount, setSubmissionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    if (!submissions.length) {
      setFilteredSubmissions([]);
      return;
    }

    if (!searchTerm.trim()) {
      setFilteredSubmissions(submissions);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = submissions.filter((submission) => {
      return (
        submission.teamName.toLowerCase().includes(searchTermLower) ||
        (submission.githubUrl &&
          submission.githubUrl.toLowerCase().includes(searchTermLower)) ||
        (submission.deployedUrl &&
          submission.deployedUrl.toLowerCase().includes(searchTermLower)) ||
        (submission.presentationUrl &&
          submission.presentationUrl.toLowerCase().includes(searchTermLower)) ||
        (submission.fileName &&
          submission.fileName.toLowerCase().includes(searchTermLower))
      );
    });

    setFilteredSubmissions(filtered);
  }, [searchTerm, submissions]);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/submissions");
      if (!response.ok) throw new Error("Failed to fetch submissions");

      const data = await response.json();
      setSubmissions(data.submissions || []);
      setFilteredSubmissions(data.submissions || []);
      setSubmissionCount(data.submissionsCount || 0);
      setError(null);
    } catch (err) {
      setError("Failed to load submissions");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Project Submissions
        </h1>
        <p className="text-muted-foreground">
          Manage project submissions and submission period settings
        </p>
      </div>

      <SubmissionControl />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Submissions"
          value={submissionsCount}
          icon={FileCheck}
          iconClassName="text-primary"
          description="Teams that have submitted their projects"
        />
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>All Team Submissions</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchSubmissions}
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
                  placeholder="Search teams, URLs, or files..."
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
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center p-4 text-red-500">{error}</div>
              ) : filteredSubmissions.length === 0 ? (
                <div className="text-center p-4 text-muted-foreground">
                  {submissions.length === 0
                    ? "No submissions found"
                    : "No submissions match your search"}
                </div>
              ) : (
                <>
                  {searchTerm && (
                    <div className="mb-4 text-sm">
                      Found {filteredSubmissions.length}{" "}
                      {filteredSubmissions.length === 1
                        ? "submission"
                        : "submissions"}{" "}
                      matching &quot;{searchTerm}&quot;
                    </div>
                  )}
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team</TableHead>
                        <TableHead>Links</TableHead>
                        <TableHead>File</TableHead>
                        <TableHead>Submitted</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSubmissions.map((submission) => (
                        <TableRow key={submission._id}>
                          <TableCell className="font-medium">
                            {submission.teamName || "Unknown Team"}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {submission.githubUrl && (
                                <Badge
                                  variant="outline"
                                  className="w-fit flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <Link
                                    href={submission.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs hover:underline"
                                  >
                                    GitHub
                                  </Link>
                                </Badge>
                              )}
                              {submission.deployedUrl && (
                                <Badge
                                  variant="outline"
                                  className="w-fit flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <Link
                                    href={submission.deployedUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs hover:underline"
                                  >
                                    Demo
                                  </Link>
                                </Badge>
                              )}
                              {submission.presentationUrl && (
                                <Badge
                                  variant="outline"
                                  className="w-fit flex items-center gap-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <Link
                                    href={submission.presentationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs hover:underline"
                                  >
                                    Presentation
                                  </Link>
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {submission.fileUrl ? (
                              <a
                                href={submission.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center"
                              >
                                <Download className="h-3 w-3 mr-1" />
                                {submission.fileName || "Download"}
                              </a>
                            ) : (
                              <span className="text-muted-foreground text-xs">
                                No file
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {formatDate(submission.submittedAt)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
