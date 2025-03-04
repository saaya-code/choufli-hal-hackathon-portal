'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react";
import Image from "next/image";
export default function ChallengePage() {
  const [submittionStatus, setSubmittionStatus] = useState(false);
  useEffect(() => {
    const fetchSubmissionStatus = async () => {
      try {
        const response = await fetch("/api/submission-status");
        if (!response.ok) throw new Error("Failed to fetch submission status");

        const data = await response.json();
        setSubmittionStatus(data.submissionOpen);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error(err.message);
      }
    };

    fetchSubmissionStatus();
  }, []);
  return (
    submittionStatus ? 
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Choufli Hal Challenge 2024
          </h1>
          <p className="text-xl text-muted-foreground">
            Innovate Solutions for Cultural Heritage Preservation
          </p>
        </div>

        {/* Main Challenge Card */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-2xl">Main Challenge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary">Tech Innovation</Badge>
              <Badge variant="secondary">Cultural Heritage</Badge>
              <Badge variant="secondary">AI/ML</Badge>
            </div>
            <p className="text-lg leading-relaxed">
              Develop innovative technological solutions that help preserve and promote
              Tunisian cultural heritage. Your solution can address one or more of
              the following areas:
            </p>

            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Digital archiving and 3D scanning of cultural artifacts</li>
              <li>Interactive educational platforms with gamification</li>
              <li>AI-powered heritage preservation tools including:
              <ul className="list-circle list-inside ml-6 mt-2 space-y-1">
              <li>Computer vision for artifact restoration</li>
              <li>Machine learning for pattern recognition in ancient texts</li>
              <li>Predictive maintenance for historical buildings</li>
              <li>NLP for traditional storytelling preservation</li>
              </ul>
              </li>
              <li>Virtual/Augmented reality immersive experiences</li>
            </ul>

            <p className="text-sm text-muted-foreground mt-4">
              These are just examples to inspire you. We encourage you to think creatively 
              and develop unique solutions that combine traditional knowledge with modern 
              technology. Your innovative approach could open new possibilities in cultural 
              heritage preservation!
            </p>
          </CardContent>
        </Card>

        {/* Requirements Section */}
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-secondary">•</span>
                <span>Solution must be technically innovative and feasible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary">•</span>
                <span>Must address a real cultural heritage preservation challenge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary">•</span>
                <span>Projects should be completable within the hackathon timeframe</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary">•</span>
                <span>Teams must submit complete documentation and source code</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Evaluation Criteria */}
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-semibold">Technical Innovation (35%)</h3>
                <p className="text-muted-foreground">Creativity and technical complexity of the solution</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Impact (30%)</h3>
                <p className="text-muted-foreground">Potential impact on cultural heritage preservation</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Feasibility (10%)</h3>
                <p className="text-muted-foreground">Implementation practicality and scalability</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Presentation (25%)</h3>
                <p className="text-muted-foreground">Quality of demonstration and documentation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>

    : 
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-3xl mx-auto">
        <CardContent className="text-center space-y-6 py-8">
          <div className="rounded-full w-16 h-16 bg-muted flex items-center justify-center mx-auto">
            <Image src="/gdg-logo.svg" alt="logo gdg" width={64} height={64} />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Challenge Submissions Currently Closed
          </h1>
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">
              The  challenge opens on:
            </p>
            <p className="text-2xl font-semibold text-primary">
              March 4th, 2025 at 11:59 PM (Tunisia Time)
            </p>
          </div>
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Mark your calendar! The submission window will be open for 24 hours,<br />
              closing on March 5th, 2025 at 11:59 PM (Tunisia Time)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}